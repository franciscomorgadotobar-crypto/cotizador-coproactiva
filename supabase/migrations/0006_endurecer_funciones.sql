-- 0006 — Cerrar dos huecos que marcó el linter de Supabase.
--
--   1. Las funciones de trigger corrían con el search_path de quien dispara el
--      UPDATE. Sin fijarlo, alguien puede anteponer un esquema propio y hacer
--      que una llamada resuelva a otra función.
--   2. mi_rol, es_admin y ve_comunidad son `security definer` porque las
--      políticas las necesitan, pero al vivir en `public` quedaban expuestas
--      como endpoints RPC (/rest/v1/rpc/...) incluso para quien no inició
--      sesión.

create or replace function tocar_editado_en()
returns trigger
language plpgsql
set search_path = public
as $fn$
begin
  new.editado_en = now();
  return new;
end;
$fn$;

create or replace function registrar_cambio_etapa()
returns trigger
language plpgsql
set search_path = public
as $fn$
begin
  if new.etapa is distinct from old.etapa then
    insert into prospecto_historial (prospecto_id, etapa_anterior, etapa_nueva, accion)
    values (new.id, old.etapa, new.etapa, 'Cambio de etapa');
  end if;
  return new;
end;
$fn$;

-- Se cierra el acceso anónimo. Las políticas siguen funcionando porque
-- `authenticated` conserva el permiso de ejecución.
revoke execute on function mi_rol()            from public, anon;
revoke execute on function es_admin()          from public, anon;
revoke execute on function ve_comunidad(uuid)  from public, anon;

grant execute on function mi_rol()            to authenticated, service_role;
grant execute on function es_admin()          to authenticated, service_role;
grant execute on function ve_comunidad(uuid)  to authenticated, service_role;
