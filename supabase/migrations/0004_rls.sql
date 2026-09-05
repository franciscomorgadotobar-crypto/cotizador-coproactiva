-- 0004 — Row Level Security.
--
-- En la planilla el control de acceso vivía en dos columnas de la hoja Usuarios
-- (`modulos` y `comunidades`, ambas con ["*"]) y lo aplicaba el Apps Script. Es
-- decir: cualquiera con acceso a la planilla veía todo, y la restricción era una
-- convención de la interfaz.
--
-- Acá el control lo hace Postgres. Aunque alguien se conecte con la clave
-- pública de Supabase y consulte directo, solo recibe lo que su rol permite.
--
-- Las reglas:
--   superadmin, admin  → todas las comunidades.
--   jefatura           → solo sus comunidades asignadas; puede corregir controles.
--   terreno            → solo sus comunidades, y solo los controles propios.

-- ------------------------------------------------------------------ Funciones

-- security definer para poder leer `perfiles` sin caer en recursión: la política
-- de perfiles no puede consultarse a sí misma.
create or replace function mi_rol()
returns rol_usuario
language sql
stable
security definer
set search_path = public
as $$
  select rol from perfiles where id = auth.uid();
$$;

create or replace function es_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(mi_rol() in ('superadmin', 'admin'), false);
$$;

create or replace function ve_comunidad(cid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select es_admin() or exists (
    select 1 from perfil_comunidades
    where perfil_id = auth.uid() and comunidad_id = cid
  );
$$;

-- --------------------------------------------------------------------- Perfiles

alter table perfiles enable row level security;

-- Cada quien ve su propio perfil; los administradores ven a todos.
create policy perfiles_lectura on perfiles for select
  using (id = auth.uid() or es_admin());

create policy perfiles_edicion_propia on perfiles for update
  using (id = auth.uid())
  -- El rol no se cambia a sí mismo: eso sería escalar privilegios.
  with check (id = auth.uid() and rol = mi_rol());

create policy perfiles_admin on perfiles for all
  using (es_admin()) with check (es_admin());

-- ------------------------------------------------------------------ Comunidades

alter table comunidades enable row level security;
alter table perfil_comunidades enable row level security;

create policy comunidades_lectura on comunidades for select
  using (ve_comunidad(id));

-- Crear, editar o dar de baja una comunidad es decisión de administración.
create policy comunidades_escritura on comunidades for all
  using (es_admin()) with check (es_admin());

create policy asignaciones_lectura on perfil_comunidades for select
  using (perfil_id = auth.uid() or es_admin());

create policy asignaciones_escritura on perfil_comunidades for all
  using (es_admin()) with check (es_admin());

-- ------------------------------------- Padrón: unidades, personas y comité

do $$
declare t text;
begin
  foreach t in array array['copropietarios', 'residentes', 'unidades', 'comite'] loop
    execute format('alter table %I enable row level security', t);
    execute format(
      'create policy %I_lectura on %I for select using (ve_comunidad(comunidad_id))', t, t);
    -- El padrón lo mantiene administración; terreno solo lo consulta.
    execute format(
      'create policy %I_escritura on %I for all
         using (es_admin() or (mi_rol() = ''jefatura'' and ve_comunidad(comunidad_id)))
         with check (es_admin() or (mi_rol() = ''jefatura'' and ve_comunidad(comunidad_id)))', t, t);
  end loop;
end;
$$;

-- ------------------------------------------------------------------------ CRM

alter table leads enable row level security;
alter table prospectos enable row level security;
alter table prospecto_historial enable row level security;

-- El embudo comercial es transversal: no cuelga de una comunidad todavía.
-- Lo ven y trabajan administración y jefatura; terreno no entra.
create policy leads_comercial on leads for all
  using (es_admin() or mi_rol() = 'jefatura')
  with check (es_admin() or mi_rol() = 'jefatura');

create policy prospectos_comercial on prospectos for all
  using (es_admin() or mi_rol() = 'jefatura')
  with check (es_admin() or mi_rol() = 'jefatura');

create policy historial_comercial on prospecto_historial for all
  using (es_admin() or mi_rol() = 'jefatura')
  with check (es_admin() or mi_rol() = 'jefatura');

-- -------------------------------------------------------- Control en terreno

alter table plantillas_control enable row level security;
alter table plantilla_items enable row level security;
alter table controles enable row level security;
alter table control_items enable row level security;
alter table hallazgos enable row level security;
alter table ordenes_trabajo enable row level security;
alter table adjuntos enable row level security;

-- Las plantillas las lee cualquiera que trabaje la comunidad; las edita
-- administración y jefatura.
create policy plantillas_lectura on plantillas_control for select
  using (comunidad_id is null or ve_comunidad(comunidad_id));

create policy plantillas_escritura on plantillas_control for all
  using (es_admin() or mi_rol() = 'jefatura')
  with check (es_admin() or mi_rol() = 'jefatura');

create policy plantilla_items_lectura on plantilla_items for select
  using (exists (
    select 1 from plantillas_control p
    where p.id = plantilla_id and (p.comunidad_id is null or ve_comunidad(p.comunidad_id))
  ));

create policy plantilla_items_escritura on plantilla_items for all
  using (es_admin() or mi_rol() = 'jefatura')
  with check (es_admin() or mi_rol() = 'jefatura');

-- Controles: se ven todos los de la comunidad, pero terreno solo escribe los
-- suyos. Que alguien complete el control de otro rompe la evidencia.
create policy controles_lectura on controles for select
  using (ve_comunidad(comunidad_id));

create policy controles_escritura on controles for all
  using (
    ve_comunidad(comunidad_id)
    and (es_admin() or mi_rol() = 'jefatura' or responsable_id = auth.uid())
  )
  with check (
    ve_comunidad(comunidad_id)
    and (es_admin() or mi_rol() = 'jefatura' or responsable_id = auth.uid())
  );

create policy control_items_lectura on control_items for select
  using (exists (
    select 1 from controles c where c.id = control_id and ve_comunidad(c.comunidad_id)
  ));

create policy control_items_escritura on control_items for all
  using (exists (
    select 1 from controles c
    where c.id = control_id and ve_comunidad(c.comunidad_id)
      and (es_admin() or mi_rol() = 'jefatura' or c.responsable_id = auth.uid())
  ))
  with check (exists (
    select 1 from controles c
    where c.id = control_id and ve_comunidad(c.comunidad_id)
      and (es_admin() or mi_rol() = 'jefatura' or c.responsable_id = auth.uid())
  ));

-- Hallazgos y órdenes de trabajo: cualquiera que trabaje la comunidad registra
-- un hallazgo, pero cerrar una OT es responsabilidad de jefatura o administración.
create policy hallazgos_lectura on hallazgos for select
  using (ve_comunidad(comunidad_id));

create policy hallazgos_registro on hallazgos for insert
  with check (ve_comunidad(comunidad_id));

create policy hallazgos_edicion on hallazgos for update
  using (
    ve_comunidad(comunidad_id)
    and (es_admin() or mi_rol() = 'jefatura' or registrado_por = auth.uid())
  );

create policy ot_lectura on ordenes_trabajo for select
  using (ve_comunidad(comunidad_id));

create policy ot_registro on ordenes_trabajo for insert
  with check (ve_comunidad(comunidad_id));

create policy ot_edicion on ordenes_trabajo for update
  using (
    ve_comunidad(comunidad_id)
    and (es_admin() or mi_rol() = 'jefatura' or asignado_a = auth.uid())
  );

-- Adjuntos: se leen si se ve la comunidad; se suben por quien trabaja ahí, y
-- solo administración los borra. Una foto de evidencia no se elimina por error.
create policy adjuntos_lectura on adjuntos for select
  using (ve_comunidad(comunidad_id));

create policy adjuntos_subida on adjuntos for insert
  with check (ve_comunidad(comunidad_id) and subida_por = auth.uid());

create policy adjuntos_borrado on adjuntos for delete
  using (es_admin());
