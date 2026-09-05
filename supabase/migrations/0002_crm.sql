-- 0002 — CRM: leads, prospectos e historial del embudo.
--
-- Es el único módulo con datos reales en la planilla, así que el modelo respeta
-- lo que hay pero normaliza tres cosas que venían sucias:
--
--   · `tipoServicio` mezclaba "administración", "Administración de comunidades"
--     y "Auditoría y asesoría" para lo mismo. Pasa a enum.
--   · `etapa` venía en texto libre ("Nuevo prospecto", "Diagnóstico", "Perdido").
--     Pasa a enum con el embudo completo.
--   · `semaforo` era un color calculado y guardado. Acá se deriva de
--     `fecha_proxima_accion`, así que no se almacena: una fecha vencida no puede
--     quedar en verde por un cálculo viejo.

create type etapa_prospecto as enum (
  'nuevo', 'contacto', 'diagnostico', 'propuesta', 'negociacion', 'ganado', 'perdido'
);

create type tipo_servicio as enum (
  'administracion', 'auditoria', 'asesoria', 'primera_administracion', 'otro'
);

create type estado_lead as enum ('nuevo', 'contactado', 'convertido', 'descartado');

-- ---------------------------------------------------------------------- Leads

-- Contacto entrante que todavía no califica como prospecto. Sirve para no
-- ensuciar el embudo con formularios web sin filtrar.
create table leads (
  id                    uuid primary key default gen_random_uuid(),
  id_legacy             text unique,
  tipo_lead             text,
  nombre_condominio     text,
  direccion             text,
  comuna                text,
  nombre_contacto       text,
  cargo_contacto        text,
  telefono              text,
  email                 text,
  constructora          text,
  etapa_obra            text,
  fecha_entrega_estimada date,
  fuente                text,
  observaciones         text,
  estado                estado_lead not null default 'nuevo',
  fecha_ingreso         timestamptz not null default now(),
  fecha_ultimo_contacto timestamptz,
  prospecto_id          uuid,
  archivado             boolean not null default false,
  creado_en             timestamptz not null default now(),
  editado_en            timestamptz not null default now()
);

create index on leads (estado) where not archivado;

-- ----------------------------------------------------------------- Prospectos

create table prospectos (
  id                      uuid primary key default gen_random_uuid(),
  id_legacy               text unique,
  nombre_condominio       text not null,
  direccion               text,
  comuna                  text,
  unidades                integer check (unidades >= 0),
  nombre_contacto         text,
  cargo_contacto          text,
  telefono                text,
  email                   text,
  tipo_servicio           tipo_servicio,
  fuente                  text,
  etapa                   etapa_prospecto not null default 'nuevo',
  fecha_primer_contacto   timestamptz,
  fecha_ultima_interaccion timestamptz,
  proxima_accion          text,
  fecha_proxima_accion    timestamptz,
  responsable_id          uuid references perfiles (id) on delete set null,
  -- Se conserva el nombre en texto porque en la planilla el responsable era
  -- "Francisco" y no siempre hay un usuario que le corresponda.
  responsable_nombre      text,
  motivo_perdida          text,
  observaciones           text,
  -- Se llena cuando el prospecto se gana y pasa a ser cliente.
  comunidad_id            uuid references comunidades (id) on delete set null,
  creado_en               timestamptz not null default now(),
  editado_en              timestamptz not null default now()
);

comment on table prospectos is
  'Comunidad en el embudo comercial. Al ganarse se crea la comunidad y se enlaza en comunidad_id.';

create index on prospectos (etapa);
create index on prospectos (fecha_proxima_accion) where etapa not in ('ganado', 'perdido');

alter table leads
  add constraint leads_prospecto_fk
  foreign key (prospecto_id) references prospectos (id) on delete set null;

-- El semáforo de la planilla era una columna. Acá es una vista: se calcula al
-- consultar, así una acción vencida nunca aparece en verde por dato viejo.
create view prospectos_con_semaforo as
select
  p.*,
  case
    when p.etapa in ('ganado', 'perdido')         then 'gris'
    when p.fecha_proxima_accion is null           then 'gris'
    when p.fecha_proxima_accion < now()           then 'rojo'
    when p.fecha_proxima_accion < now() + interval '3 days' then 'amarillo'
    else 'verde'
  end as semaforo
from prospectos p;

-- ------------------------------------------------------- Historial del embudo

create table prospecto_historial (
  id             uuid primary key default gen_random_uuid(),
  id_legacy      text unique,
  prospecto_id   uuid not null references prospectos (id) on delete cascade,
  fecha          timestamptz not null default now(),
  etapa_anterior etapa_prospecto,
  etapa_nueva    etapa_prospecto,
  accion         text,
  correo_enviado boolean not null default false,
  responsable_id uuid references perfiles (id) on delete set null,
  notas          text
);

create index on prospecto_historial (prospecto_id, fecha desc);

-- Cada cambio de etapa deja rastro solo. En la planilla el historial se escribía
-- a mano desde el script y por eso quedaban saltos sin registrar.
create or replace function registrar_cambio_etapa()
returns trigger
language plpgsql
as $$
begin
  if new.etapa is distinct from old.etapa then
    insert into prospecto_historial (prospecto_id, etapa_anterior, etapa_nueva, accion)
    values (new.id, old.etapa, new.etapa, 'Cambio de etapa');
  end if;
  return new;
end;
$$;

create trigger prospectos_historial
  after update on prospectos
  for each row execute function registrar_cambio_etapa();

create trigger leads_editado before update on leads
  for each row execute function tocar_editado_en();
create trigger prospectos_editado before update on prospectos
  for each row execute function tocar_editado_en();
