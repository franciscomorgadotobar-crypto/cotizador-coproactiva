/* El nombre de quien tiene asignado un levantamiento.
 *
 * La vista de levantamientos traía el nombre del responsable con un LEFT JOIN
 * a perfiles. Como la vista corre con los permisos de quien consulta, y la
 * política de perfiles solo deja leer el propio, para alguien de terreno ese
 * join devolvía vacío. La aplicación leía ese vacío como "sin asignar", así
 * que un levantamiento que sí tenía responsable aparecía como si no lo
 * tuviera. Dos cosas distintas confundidas en una.
 *
 * Se resuelve con una función que corre con los permisos de su dueño y
 * devuelve únicamente el nombre. El correo, el rol y las comunidades de cada
 * persona siguen siendo invisibles para quien no administra.
 *
 * No sirve para averiguar quién trabaja acá: hay que traer el identificador
 * puesto, y esos identificadores solo aparecen en levantamientos que quien
 * pregunta ya tiene permitido ver. Quien no ve el levantamiento, tampoco tiene
 * de dónde sacar el identificador.
 */
create or replace function public.nombre_de_perfil(pid uuid)
returns text
language sql
stable
security definer
set search_path to 'public'
as $$
  select nombre from perfiles where id = pid;
$$;

comment on function public.nombre_de_perfil(uuid) is
  'Nombre de un perfil a partir de su id. Solo el nombre, y solo si ya se conoce el id.';

revoke all on function public.nombre_de_perfil(uuid) from public;
grant execute on function public.nombre_de_perfil(uuid) to authenticated;

/* La vista se recrea igual salvo por responsable_nombre. El rol sigue saliendo
 * del join y por lo tanto sigue oculto para quien no administra: nadie lo
 * necesita para trabajar, y es información sobre el puesto de otra persona. */
create or replace view public.controles_con_avance as
  select c.id,
         c.comunidad_id,
         c.plantilla_id,
         c.responsable_id,
         c.periodo,
         c.estado,
         c.programado_para,
         c.checkin_en,
         c.checkin_lat,
         c.checkin_lng,
         c.checkin_precision,
         c.checkout_en,
         c.checkout_lat,
         c.checkout_lng,
         c.enviado_en,
         c.observaciones,
         c.creado_en,
         c.editado_en,
         c.prospecto_id,
         c.reabierto_en,
         c.reabierto_por,
         c.motivo_reapertura,
         coalesce(com.nombre, p.nombre_condominio)   as destino_nombre,
         coalesce(com.direccion, p.direccion)        as destino_direccion,
         coalesce(com.comuna, p.comuna)              as destino_comuna,
         case when c.prospecto_id is not null then 'prospecto' else 'comunidad' end as destino_tipo,
         nombre_de_perfil(c.responsable_id)          as responsable_nombre,
         r.rol                                       as responsable_rol,
         (select count(*) from control_items ci
           where ci.control_id = c.id and ci.estado <> 'sin_evaluar')      as items_evaluados,
         (select count(*) from control_items ci
           where ci.control_id = c.id)                                     as items_totales,
         (select count(*) from control_items ci
           where ci.control_id = c.id and ci.estado = 'observacion')        as items_con_observacion,
         (select count(*) from control_items ci
           where ci.control_id = c.id and ci.estado = 'critico')            as items_criticos,
         (select count(*) from adjuntos a
           where a.control_id = c.id and a.clase = 'foto')                  as fotos
    from controles c
    left join comunidades com on com.id = c.comunidad_id
    left join prospectos  p   on p.id   = c.prospecto_id
    left join perfiles    r   on r.id   = c.responsable_id;

alter view public.controles_con_avance set (security_invoker = true);
