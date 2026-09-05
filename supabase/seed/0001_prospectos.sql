-- Seed — prospectos reales del CRM.
--
-- Son los únicos datos con valor de la planilla: el resto era demo. Se migran
-- tal cual, normalizando etapa y tipo de servicio a los enums, y las fechas al
-- huso de Chile continental.
--
-- El `id_legacy` conserva el identificador de la planilla para poder rastrear
-- cualquier registro hasta su origen.

insert into prospectos (
  id_legacy, nombre_condominio, direccion, comuna, unidades,
  nombre_contacto, cargo_contacto, telefono, email,
  tipo_servicio, fuente, etapa,
  fecha_primer_contacto, fecha_ultima_interaccion,
  proxima_accion, fecha_proxima_accion,
  responsable_nombre, motivo_perdida, observaciones
) values
  ('PROS-MQ1HLSGK-7GUR', 'Edificio Las Americas', 'America 755', 'SAN BERNARDO', 140,
   'Ernesto Meza', 'Presidente', '+56939453804', 'mezaernesto72@gmail.com',
   'administracion', 'referido', 'diagnostico',
   '2026-06-05T18:19:47-03', '2026-07-08T14:03:14-03',
   'Realizar diagnóstico en terreno', '2026-07-13T14:03:14-03',
   'Francisco', null, null),
  ('PROS_F38F2331BB8F', 'Sin identificar', null, null, null,
   'joaquin muñoz', null, '56922464977', 'contacto@teamcondorcl.com',
   'administracion', 'web_coproactiva_cl', 'nuevo',
   '2026-07-27T21:00:19-03', '2026-07-27T21:00:19-03',
   'Primer contacto — responder en < 24 h', '2026-07-28T21:00:19-03',
   null, null, 'Mi nombre es Joaquín Muñoz Silva, fundador de Veci.  Quisiera presentarle una iniciativa que creemos puede aportar un valor importante a la administración de edificios y condominios.  En Veci estamos creando una Inteligencia Artificial especializada en la administración de comunidades, diseñada para automatizar procesos que hoy requieren tiempo, coordinación y trabajo manual, permitiendo a los administradores enfocarse en lo realmente importante: gestionar mejor sus comunidades.  Nuestro objetivo no es reemplazar la labor del administrador, sino entregarle una herramienta que simplifique su trabajo diario, reduzca tareas repetitivas y le permita ahorrar tiempo mediante procesos automatizados.  Además, hemos diseñado Veci para que sea una solución simple, intuitiva y fácil de implementar, evitando sistemas complejos que requieren largas capacitaciones o difíciles procesos de adopción.  Nos gustaría invitarlo a una breve reunión de aproximadamente 20 minutos para mostrarle cómo funciona, conocer sus desafíos actuales y evaluar si nuestra solución realmente puede aportar valor a su comunidad.  Como parte de nuestro lanzamiento, estamos invitando a un grupo reducido de administradores a implementar Veci de forma totalmente gratuita, acompañándolos personalmente durante todo el proceso de instalación y configuración.  Si le interesa conocer más, puede responder este correo o escribirme directamente por WhatsApp al +56 9 2246 4977.  Quedo atento y muchas gracias por su tiempo.  Atentamente,  Joaquín Muñoz Silva Founder & Growth Lead — Veci Teléfono: +56 9 2246 4977 Correo: contacto@teamcondorcl.com Sitio web: condorai.cl/veci'),
  ('PROS_14F36CDB58D9', 'Las Palmeras', 'California 1983', 'Providencia', 25,
   'gonzalo muñoz', 'Miembro comité', '56958584378', 'gomunozr@gmail.com',
   'administracion', 'web_coproactiva_cl', 'diagnostico',
   '2026-07-30T09:47:23-03', '2026-08-04T10:49:13-03',
   'Realizar diagnóstico en terreno', '2026-08-09T10:49:13-03',
   null, null, 'Queremos ver la alternativa de cambiar de administrador'),
  ('PROS_4568D02B3A40', 'Sin identificar', null, null, null,
   'José Antonio Pérez', null, '56992651105', 'josantoperez@hotmail.com',
   'auditoria', 'web_coproactiva_cl', 'nuevo',
   '2026-08-13T12:19:20-03', '2026-08-13T12:19:20-03',
   'Primer contacto — responder en < 24 h', '2026-08-14T12:19:20-03',
   null, null, 'Estimados de Coproactiva, Me dirijo a ustedes en mi calidad de abogado especializado en cumplimiento normativo, para compartirles una oportunidad relevante de cara a la entrada en vigencia de la nueva Ley N° 21.719 sobre Protección de Datos Personales, que a partir del 01 de diciembre del presente año, impone obligaciones concretas a Ustedes y también a las comunidades y edificios que administran. Quisiera proponerles una reunión —presencial o por videollamada, según les acomode— para conversar sobre cómo implementar esta normativa en su administradora y en los edificios/condominios que gestionan, evaluando en conjunto algún tipo de acuerdo que nos permita hacerlo sin costo para ustedes como administradora. Actualmente, nuestro equipo de abogados se encuentra implementando la Ley de Protección de Datos, en colegios y empresas entre otros. Quedo atento a que me contacten para coordinar un horario que les acomode, o con gusto los llamo yo si me indican un mejor momento.  Saludos cordiales,  José Antonio Pérez Silva Abogado Compliance Tel. +569 9265 1105'),
  ('PROS_B967E3CEABE1', 'Obispo Donoso 5', null, null, null,
   'Paz Becerra', null, '56940555164', 'pax.valentina@gmail.com',
   'administracion', 'web_coproactiva_cl', 'perdido',
   '2026-08-18T18:28:37-03', '2026-09-03T23:53:18-03',
   'Primer contacto — responder en < 24 h', null,
   null, null, 'Integrante del comite de 4, sin áreas comunes, 7 pisos, 31 departamentos, -1 departamento del edificio para refacción a futuro, pasillos edificio antiguo, terraza a futuro, el nuevo administrador entra en octubre-noviembre 1 conserje de lunes a vienes de 9 a 6, seguro contra incendio contratado, comunidad feliz contratada con disponibilidad a cambio de sistema,  120.000 gasto común actual.'),
  ('PROS_CD63F06B74D1', 'Edificio Zen', null, null, null,
   'Luis Vives', null, '56995402904', 'franciscomorgadotobar@gmail.com',
   'administracion', 'web_coproactiva_cl', 'perdido',
   '2026-08-19T12:43:06-03', '2026-09-03T23:53:32-03',
   'Primer contacto — responder en < 24 h', null,
   null, null, 'Mar tirreno 33,60 peñalolen, 2 torres de 64 yb 66 departamentos cada uno, cambio de administración. vycimper@gmail.com'),
  ('PROS_2395605E792C', 'Edificio Zen', null, null, null,
   'Luis Vives', null, '56995402904', 'vycimper@gmail.com',
   'administracion', 'web_coproactiva_cl', 'nuevo',
   '2026-08-19T14:50:11-03', '2026-08-19T14:50:11-03',
   'Primer contacto — responder en < 24 h', '2026-08-20T14:50:11-03',
   null, null, 'Mar Tirreno 3360 Peñalolen, 2 torres 34 y 66 deptos c/u, cambio de administración.'),
  ('PROS_AA2FD894BCD4', 'Dzine', null, null, null,
   'Diego Barrios', null, '56995241100', 'diegoabarrios@gmail.com',
   'administracion', 'web_coproactiva_cl', 'perdido',
   '2026-08-23T12:51:41-03', '2026-09-03T23:54:42-03',
   'Primer contacto — responder en < 24 h', null,
   null, null, 'Soy presidente del comité de vecinos y queremos cambiar de administrador.  Adjunto detalles del edificio.  Solicitamos una cotización y presentación de sus servicios al comité.  Quedamos atentos a sus comentarios.  Saludos,  Diego Barrios  Dirección del edificio: Carol Uruza 7030 Antigüedad del edificio: 2012 Número de trabajadores: 18 Número departamentos: 269 Pisos: 10 Tiene sala de bombas y sala de calderas Ascensores: 4 Plataforma actual kastor'),
  ('PROS-MTO3W9C2-1HC3', 'Lago sur', 'Lago Rupanco 0851', 'San Bernardo', 156,
   'Osmar Meza', 'Presidente', '+56 968498895', 'osmar.mezaa@gmail.com',
   'administracion', 'Referido', 'nuevo',
   '2026-09-05T04:13:50-03', '2026-09-05T04:58:18-03',
   'Primer contacto — responder en < 24h', '2026-09-06T04:58:18-03',
   null, null, null)
on conflict (id_legacy) do nothing;

-- El historial del embudo se migra enlazado por id_legacy.
