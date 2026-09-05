-- 0003 — Control en terreno: plantillas de checklist, visitas, hallazgos y
-- órdenes de trabajo.
--
-- Módulo nuevo: no existe en la planilla. El modelo sale del diseño de
-- figma/ — pantallas "Control en terreno", "Nuevo hallazgo" y "Detalle de
-- control".
--
-- La idea que sostiene el módulo: el control es la evidencia. Quién estuvo,
-- dónde, cuándo, qué revisó y con qué foto. De ahí salen los hallazgos, y de un
-- hallazgo sale una orden de trabajo. La cadena no se rompe.

create type estado_control as enum ('pendiente', 'en_curso', 'enviado', 'anulado');

create type estado_item_control as enum ('sin_evaluar', 'cumple', 'observacion', 'critico');

create type severidad_hallazgo as enum ('menor', 'importante', 'critica');

create type estado_ot as enum ('pendiente', 'en_curso', 'cerrada', 'anulada');

-- ---------------------------------------------------- Plantillas de checklist

-- Una plantilla por tipo de control (mensual, de entrega, post-asamblea). Si
-- comunidad_id es null la plantilla es del catálogo estándar y sirve para todas.
create table plantillas_control (
  id           uuid primary key default gen_random_uuid(),
  nombre       text not null,
  descripcion  text,
  comunidad_id uuid references comunidades (id) on delete cascade,
  activa       boolean not null default true,
  creado_por   uuid references perfiles (id) on delete set null,
  creado_en    timestamptz not null default now(),
  editado_en   timestamptz not null default now()
);

comment on column plantillas_control.comunidad_id is
  'Null = plantilla del catálogo estándar, disponible para todas las comunidades.';

create table plantilla_items (
  id           uuid primary key default gen_random_uuid(),
  plantilla_id uuid not null references plantillas_control (id) on delete cascade,
  grupo        text not null,
  texto        text not null,
  orden        integer not null default 0,
  requiere_foto boolean not null default false,
  -- Un ítem crítico marcado como incumplido escala solo: genera hallazgo de
  -- severidad crítica y exige orden de trabajo.
  es_critico   boolean not null default false,
  ayuda        text,
  activo       boolean not null default true
);

create index on plantilla_items (plantilla_id, grupo, orden);

-- ------------------------------------------------------------------ Controles

create table controles (
  id                uuid primary key default gen_random_uuid(),
  comunidad_id      uuid not null references comunidades (id) on delete restrict,
  plantilla_id      uuid references plantillas_control (id) on delete set null,
  responsable_id    uuid references perfiles (id) on delete set null,
  periodo           text,
  estado            estado_control not null default 'pendiente',
  programado_para   timestamptz,

  -- Check-in y check-out: la evidencia de que alguien estuvo en el lugar.
  -- Se guardan las coordenadas crudas y la precisión que reportó el GPS; la
  -- distancia al acceso se calcula contra la ubicación de la comunidad.
  checkin_en        timestamptz,
  checkin_lat       numeric(10,7),
  checkin_lng       numeric(10,7),
  checkin_precision numeric(6,1),
  checkout_en       timestamptz,
  checkout_lat      numeric(10,7),
  checkout_lng      numeric(10,7),

  enviado_en        timestamptz,
  observaciones     text,
  creado_en         timestamptz not null default now(),
  editado_en        timestamptz not null default now()
);

create index on controles (comunidad_id, programado_para desc);
create index on controles (estado);
create index on controles (responsable_id) where estado in ('pendiente', 'en_curso');

comment on column controles.checkin_precision is
  'Metros de precisión que informó el GPS del teléfono. Un check-in con precisión mala no es prueba de presencia.';

create table control_items (
  id                 uuid primary key default gen_random_uuid(),
  control_id         uuid not null references controles (id) on delete cascade,
  plantilla_item_id  uuid references plantilla_items (id) on delete set null,
  -- Se copian grupo y texto al momento del control: si la plantilla cambia
  -- después, el control ya realizado debe seguir diciendo lo que decía.
  grupo              text not null,
  texto              text not null,
  orden              integer not null default 0,
  estado             estado_item_control not null default 'sin_evaluar',
  nota               text,
  evaluado_en        timestamptz,
  unique (control_id, plantilla_item_id)
);

create index on control_items (control_id, orden);

-- El avance (12 de 28) no se guarda: se cuenta. Un contador almacenado se
-- desincroniza en cuanto alguien corrige un ítem.
create view controles_con_avance as
select
  c.*,
  count(ci.id) filter (where ci.estado <> 'sin_evaluar') as items_evaluados,
  count(ci.id)                                          as items_totales,
  count(ci.id) filter (where ci.estado = 'observacion')  as items_con_observacion,
  count(ci.id) filter (where ci.estado = 'critico')      as items_criticos
from controles c
left join control_items ci on ci.control_id = c.id
group by c.id;

-- ------------------------------------------------------------------ Hallazgos

create table hallazgos (
  id               uuid primary key default gen_random_uuid(),
  comunidad_id     uuid not null references comunidades (id) on delete restrict,
  -- Puede nacer de un ítem del checklist o registrarse suelto durante la visita.
  control_id       uuid references controles (id) on delete set null,
  control_item_id  uuid references control_items (id) on delete set null,
  severidad        severidad_hallazgo not null default 'menor',
  titulo           text not null,
  descripcion      text,
  ubicacion        text,
  lat              numeric(10,7),
  lng              numeric(10,7),
  registrado_por   uuid references perfiles (id) on delete set null,
  registrado_en    timestamptz not null default now(),
  resuelto_en      timestamptz,
  creado_en        timestamptz not null default now(),
  editado_en       timestamptz not null default now()
);

create index on hallazgos (comunidad_id, registrado_en desc);
create index on hallazgos (severidad) where resuelto_en is null;

-- ------------------------------------------------------- Órdenes de trabajo

create table ordenes_trabajo (
  id             uuid primary key default gen_random_uuid(),
  -- Correlativo legible: OT-1042. Se muestra en la app y en los correos.
  folio          integer generated always as identity,
  comunidad_id   uuid not null references comunidades (id) on delete restrict,
  hallazgo_id    uuid references hallazgos (id) on delete set null,
  titulo         text not null,
  descripcion    text,
  estado         estado_ot not null default 'pendiente',
  prioridad      severidad_hallazgo not null default 'menor',
  asignado_a     uuid references perfiles (id) on delete set null,
  -- Cuando el trabajo lo hace un tercero, el responsable no es un usuario del
  -- sistema sino un proveedor. Por ahora en texto; la tabla de proveedores llega
  -- con el módulo de contratos.
  proveedor      text,
  vence_el       timestamptz,
  cerrada_en     timestamptz,
  cerrada_por    uuid references perfiles (id) on delete set null,
  nota_cierre    text,
  creado_por     uuid references perfiles (id) on delete set null,
  creado_en      timestamptz not null default now(),
  editado_en     timestamptz not null default now()
);

create index on ordenes_trabajo (comunidad_id, estado);
create index on ordenes_trabajo (vence_el) where estado in ('pendiente', 'en_curso');

create view ordenes_trabajo_con_semaforo as
select
  ot.*,
  'OT-' || lpad(ot.folio::text, 4, '0') as codigo,
  case
    when ot.estado in ('cerrada', 'anulada')            then 'gris'
    when ot.vence_el is null                            then 'gris'
    when ot.vence_el < now()                            then 'rojo'
    when ot.vence_el < now() + interval '2 days'        then 'amarillo'
    else 'verde'
  end as semaforo
from ordenes_trabajo ot;

-- ------------------------------------------------------------------ Adjuntos

-- Las fotos viven en Supabase Storage; acá va la referencia y el contexto.
-- Las coordenadas y la hora se guardan aparte del archivo porque los metadatos
-- EXIF se pierden al recomprimir en el teléfono.
create table adjuntos (
  id              uuid primary key default gen_random_uuid(),
  comunidad_id    uuid not null references comunidades (id) on delete cascade,
  control_id      uuid references controles (id) on delete cascade,
  control_item_id uuid references control_items (id) on delete cascade,
  hallazgo_id     uuid references hallazgos (id) on delete cascade,
  orden_id        uuid references ordenes_trabajo (id) on delete cascade,
  storage_path    text not null unique,
  nombre_original text,
  mime            text,
  bytes           integer,
  lat             numeric(10,7),
  lng             numeric(10,7),
  tomada_en       timestamptz,
  subida_por      uuid references perfiles (id) on delete set null,
  creado_en       timestamptz not null default now(),
  -- Un adjunto tiene que colgar de algo.
  constraint adjunto_con_destino check (
    control_id is not null or control_item_id is not null
    or hallazgo_id is not null or orden_id is not null
  )
);

create index on adjuntos (control_id);
create index on adjuntos (hallazgo_id);

-- ------------------------------------------------------------------ Triggers

do $$
declare t text;
begin
  foreach t in array array[
    'plantillas_control', 'controles', 'hallazgos', 'ordenes_trabajo'
  ] loop
    execute format(
      'create trigger %I_editado before update on %I
       for each row execute function tocar_editado_en()', t, t);
  end loop;
end;
$$;
