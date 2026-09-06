-- 0005 — Las vistas deben respetar RLS.
--
-- Una vista normal se ejecuta con los permisos de su dueño (postgres), no de
-- quien consulta. Eso significa que `prospectos_con_semaforo` y
-- `controles_con_avance` pasaban por encima de las políticas: bastaba consultar
-- la vista en vez de la tabla para leerlo todo con la clave pública.
--
-- security_invoker hace que la vista se evalúe con el rol de quien consulta, y
-- las políticas vuelven a aplicarse. Requiere Postgres 15 o superior.

alter view prospectos_con_semaforo       set (security_invoker = true);
alter view controles_con_avance          set (security_invoker = true);
alter view ordenes_trabajo_con_semaforo  set (security_invoker = true);
