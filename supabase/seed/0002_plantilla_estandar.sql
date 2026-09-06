-- Seed — plantilla de control mensual y comunidad de prueba.
--
-- La plantilla es el catálogo estándar (comunidad_id null): sirve para todas las
-- comunidades y es el punto de partida para las que después necesiten ítems
-- propios en `catalogo_custom`.
--
-- La comunidad de prueba existe solo para poder recorrer la app antes de que
-- entre la primera comunidad real. Queda en `marcha_blanca` y se borra con un
-- delete: el on delete cascade se lleva su control y sus ítems.

do $do$
declare
  admin_id uuid;
  plant_id uuid;
  com_id   uuid;
  ctrl_id  uuid;
begin
  select id into admin_id from perfiles where rol = 'admin' order by creado_en limit 1;

  insert into plantillas_control (nombre, descripcion, comunidad_id, creado_por)
  values ('Control mensual de comunidad',
          'Recorrido mensual de administración: acceso, áreas comunes, instalaciones críticas, seguridad y aseo.',
          null, admin_id)
  returning id into plant_id;

  -- Los ítems marcados `es_critico` escalan solos: un incumplimiento genera
  -- hallazgo de severidad crítica y exige orden de trabajo.
  insert into plantilla_items (plantilla_id, grupo, texto, orden, requiere_foto, es_critico, ayuda) values
    (plant_id, 'Acceso y conserjería', 'Conserje en turno según contrato',                  1, false, false, 'Verificar libro de novedades firmado.'),
    (plant_id, 'Acceso y conserjería', 'Libro de novedades al día',                         2, false, false, null),
    (plant_id, 'Acceso y conserjería', 'Citófono y portón operativos',                      3, false, false, null),
    (plant_id, 'Acceso y conserjería', 'Cámaras grabando y con respaldo vigente',           4, false, true,  'Sin grabación no hay evidencia ante un incidente.'),

    (plant_id, 'Áreas comunes',        'Iluminación de pasillos y escaleras completa',      1, true,  false, null),
    (plant_id, 'Áreas comunes',        'Ascensores con certificación vigente',              2, true,  true,  'La certificación vencida expone a la comunidad a multa y a suspensión del servicio.'),
    (plant_id, 'Áreas comunes',        'Salas comunes en condiciones de uso',               3, false, false, null),
    (plant_id, 'Áreas comunes',        'Estacionamientos demarcados y despejados',          4, false, false, null),

    (plant_id, 'Instalaciones críticas','Sala de bombas sin filtraciones ni ruidos',        1, true,  false, null),
    (plant_id, 'Instalaciones críticas','Estanques de agua con último aseo registrado',     2, false, true,  'El aseo de estanques es obligación sanitaria.'),
    (plant_id, 'Instalaciones críticas','Caldera o sistema de agua caliente operativo',     3, false, false, null),
    (plant_id, 'Instalaciones críticas','Grupo electrógeno con combustible y prueba mensual',4, false, true,  null),
    (plant_id, 'Instalaciones críticas','Tablero eléctrico cerrado y rotulado',             5, true,  true,  null),

    (plant_id, 'Seguridad',            'Extintores con carga y revisión vigente',           1, true,  true,  'Revisar fecha en la etiqueta de cada extintor.'),
    (plant_id, 'Seguridad',            'Red húmeda y red seca sin obstrucciones',           2, false, true,  null),
    (plant_id, 'Seguridad',            'Vías de evacuación despejadas y señalizadas',       3, true,  true,  'Una vía bloqueada es hallazgo crítico inmediato.'),
    (plant_id, 'Seguridad',            'Luces de emergencia funcionando',                   4, false, false, null),
    (plant_id, 'Seguridad',            'Plan de emergencia publicado y vigente',            5, false, false, null),

    (plant_id, 'Aseo y residuos',      'Sala de basura limpia y sin acumulación',           1, true,  false, null),
    (plant_id, 'Aseo y residuos',      'Retiro de residuos según frecuencia acordada',      2, false, false, null),
    (plant_id, 'Aseo y residuos',      'Puntos de reciclaje en uso',                        3, false, false, null),
    (plant_id, 'Aseo y residuos',      'Áreas verdes con mantención al día',                4, false, false, null),

    (plant_id, 'Documentación',        'Seguro de incendio vigente',                        1, false, true,  null),
    (plant_id, 'Documentación',        'Contratos de mantención vigentes',                  2, false, false, null),
    (plant_id, 'Documentación',        'Cotizaciones previsionales del personal al día',    3, false, true,  'Su atraso genera responsabilidad solidaria de la comunidad.'),
    (plant_id, 'Documentación',        'Reglamento de copropiedad disponible en conserjería',4, false, false, null);

  insert into comunidades (nombre, direccion, comuna, unidades_declaradas, modalidad, estado,
                           contacto_nombre, instalaciones)
  values ('Comunidad de prueba', 'Av. Providencia 1234', 'Providencia', 48, 'integral', 'marcha_blanca',
          'Francisco Morgado',
          '{"ascensores": 2, "sala_bombas": true, "grupo_electrogeno": true, "cctv": true, "piscina": false}'::jsonb)
  returning id into com_id;

  insert into perfil_comunidades (perfil_id, comunidad_id) values (admin_id, com_id);

  insert into controles (comunidad_id, plantilla_id, responsable_id, periodo, estado, programado_para)
  values (com_id, plant_id, admin_id, 'Septiembre 2026', 'pendiente',
          date_trunc('day', now()) + interval '10 hours')
  returning id into ctrl_id;

  -- Los ítems se copian al control en vez de leerse de la plantilla: si la
  -- plantilla cambia después, el control ya realizado debe seguir diciendo lo
  -- que decía cuando se hizo.
  insert into control_items (control_id, plantilla_item_id, grupo, texto, orden)
  select ctrl_id, pi.id, pi.grupo, pi.texto,
         row_number() over (order by pi.grupo, pi.orden)
  from plantilla_items pi
  where pi.plantilla_id = plant_id and pi.activo;
end;
$do$;
