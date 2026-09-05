-- 0001 — Núcleo: usuarios y roles, comunidades, unidades, copropietarios,
-- residentes y comité.
--
-- El modelo sale de la estructura real de la planilla coproactivAPP, no de
-- supuestos. Lo que cambia respecto de Sheets:
--
--   · Los identificadores pasan a uuid. El id anterior (COM-MQ4CVAEH-8XF0,
--     PROS_F38F2331BB8F, etc.) queda en `id_legacy` para poder rastrear un
--     registro hasta la planilla mientras dure la transición.
--   · Las fechas son timestamptz. En Sheets convivían "1/6/2026" y
--     "2026-06-24T01:21:24.929Z"; acá hay un solo formato.
--   · Los montos en pesos son integer: el peso chileno no tiene decimales y
--     los honorarios de la planilla vienen sin ellos.
--   · Las claves de usuario desaparecen. La autenticación es de Supabase
--     (auth.users); acá solo vive el perfil y su rol.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------- Enumeraciones

-- Los dos primeros existen hoy en la planilla; jefatura y terreno se suman con
-- el módulo de control en terreno.
create type rol_usuario as enum ('superadmin', 'admin', 'jefatura', 'terreno');

create type estado_comunidad as enum ('activo', 'marcha_blanca', 'suspendido', 'terminado');

-- Las modalidades vienen de la columna `modalidad`: Integral y Auditoria en uso.
create type modalidad_comunidad as enum ('integral', 'auditoria', 'asesoria', 'primera_administracion');

create type condicion_ocupacion as enum ('propietario', 'arrendatario', 'desocupada', 'otro');

create type tipo_unidad as enum ('departamento', 'casa', 'local', 'estacionamiento', 'bodega', 'otro');

-- ------------------------------------------------------------------- Perfiles

-- Extiende auth.users. El rol y el nombre viven acá; la contraseña y el correo
-- los administra Supabase.
create table perfiles (
  id            uuid primary key references auth.users (id) on delete cascade,
  id_legacy     text unique,
  nombre        text not null,
  email         text not null unique,
  rol           rol_usuario not null default 'terreno',
  activo        boolean not null default true,
  ultimo_acceso timestamptz,
  creado_en     timestamptz not null default now(),
  editado_en    timestamptz not null default now()
);

comment on table perfiles is
  'Usuario del sistema. La autenticación la maneja auth.users; acá va el rol y el estado.';

-- ---------------------------------------------------------------- Comunidades

create table comunidades (
  id                     uuid primary key default gen_random_uuid(),
  id_legacy              text unique,
  nombre                 text not null,
  rut                    text,
  direccion              text,
  comuna                 text,
  unidades_declaradas    integer check (unidades_declaradas >= 0),
  honorario_mensual      integer check (honorario_mensual >= 0),
  modalidad              modalidad_comunidad,
  estado                 estado_comunidad not null default 'activo',
  fecha_inicio_contrato  date,
  fecha_renovacion       date,
  contacto_nombre        text,
  contacto_telefono      text,
  contacto_email         text,
  -- Ascensores, calderas, gas, grupo electrógeno, piscina, RCI, portón, CCTV.
  -- Es un catálogo que crece; jsonb evita una migración por cada instalación nueva.
  instalaciones          jsonb not null default '{}'::jsonb,
  -- Ítems de checklist propios de esta comunidad, fuera del catálogo estándar.
  catalogo_custom        jsonb,
  carpeta_drive_id       text,
  -- Datos que solo aplican si la comunidad tiene trabajadores contratados.
  mutual_codigo          text,
  mutual_tasa            numeric(5,2),
  politica_gratificacion text,
  banco_id               text,
  tipo_cuenta            text,
  numero_cuenta          text,
  creado_en              timestamptz not null default now(),
  editado_en             timestamptz not null default now()
);

comment on column comunidades.unidades_declaradas is
  'Cantidad de unidades según el contrato. El conteo real sale de la tabla unidades.';

create index on comunidades (estado);
create index on comunidades (comuna);

-- Qué comunidades ve cada usuario. superadmin y admin ven todas sin necesidad de
-- filas acá; jefatura y terreno solo las que tengan asignadas.
create table perfil_comunidades (
  perfil_id    uuid not null references perfiles (id) on delete cascade,
  comunidad_id uuid not null references comunidades (id) on delete cascade,
  creado_en    timestamptz not null default now(),
  primary key (perfil_id, comunidad_id)
);

-- ------------------------------------------------------------- Copropietarios

create table copropietarios (
  id            uuid primary key default gen_random_uuid(),
  id_legacy     text unique,
  comunidad_id  uuid not null references comunidades (id) on delete cascade,
  nombre        text not null,
  tipo_id       text,
  numero_id     text,
  email         text,
  telefono      text,
  domicilio     text,
  -- Al día con sus gastos comunes: define el derecho a voto en asamblea.
  es_habil      boolean not null default true,
  creado_en     timestamptz not null default now(),
  editado_en    timestamptz not null default now()
);

create index on copropietarios (comunidad_id);

-- ----------------------------------------------------------------- Residentes

create table residentes (
  id                  uuid primary key default gen_random_uuid(),
  id_legacy           text unique,
  comunidad_id        uuid not null references comunidades (id) on delete cascade,
  nombre              text not null,
  tipo_id             text,
  numero_id           text,
  email               text,
  telefono_principal  text,
  telefono_secundario text,
  contacto_emergencia text,
  telefono_emergencia text,
  -- Estos dos no son decorativos: obligan a protocolos distintos ante un corte
  -- de suministro o una evacuación.
  electrodependiente  boolean not null default false,
  movilidad_reducida  boolean not null default false,
  idioma_principal    text,
  tiene_mascotas      boolean not null default false,
  detalle_mascotas    text,
  patente_vehiculo    text,
  activo              boolean not null default true,
  fecha_ingreso       date,
  creado_en           timestamptz not null default now(),
  editado_en          timestamptz not null default now()
);

create index on residentes (comunidad_id);
create index on residentes (comunidad_id) where electrodependiente or movilidad_reducida;

-- ------------------------------------------------------------------- Unidades

create table unidades (
  id                   uuid primary key default gen_random_uuid(),
  id_legacy            text unique,
  comunidad_id         uuid not null references comunidades (id) on delete cascade,
  subdivision          text,
  numero               text not null,
  tipo                 tipo_unidad not null default 'departamento',
  rol_sii              text,
  -- Porcentaje de participación en los gastos comunes. La suma por comunidad
  -- debería dar 100; no se fuerza acá porque durante la carga queda incompleta.
  alicuota             numeric(9,6),
  copropietario_id     uuid references copropietarios (id) on delete set null,
  residente_id         uuid references residentes (id) on delete set null,
  -- Estacionamientos y bodegas cuelgan de la unidad principal.
  unidad_principal_id  uuid references unidades (id) on delete set null,
  condicion_ocupacion  condicion_ocupacion,
  cbr_jurisdiccion     text,
  cbr_numero           text,
  cbr_anio             integer,
  creado_en            timestamptz not null default now(),
  editado_en           timestamptz not null default now(),
  unique (comunidad_id, numero, tipo)
);

create index on unidades (comunidad_id);
create index on unidades (copropietario_id);
create index on unidades (residente_id);

-- --------------------------------------------------------------------- Comité

create table comite (
  id            uuid primary key default gen_random_uuid(),
  id_legacy     text unique,
  comunidad_id  uuid not null references comunidades (id) on delete cascade,
  nombre        text not null,
  cargo         text,
  unidad        text,
  email         text,
  telefono      text,
  residente_id  uuid references residentes (id) on delete set null,
  creado_en     timestamptz not null default now()
);

create index on comite (comunidad_id);

-- ------------------------------------------------- Marca de tiempo automática

create or replace function tocar_editado_en()
returns trigger
language plpgsql
as $$
begin
  new.editado_en = now();
  return new;
end;
$$;

do $$
declare t text;
begin
  foreach t in array array[
    'perfiles', 'comunidades', 'copropietarios', 'residentes', 'unidades'
  ] loop
    execute format(
      'create trigger %I_editado before update on %I
       for each row execute function tocar_editado_en()', t, t);
  end loop;
end;
$$;
