/* Supabase simulado para probar la app sin red.
 *
 * Existe porque las fallas que importan en esta app no se ven compilando: una
 * FileList que se vacía antes de leerse, un blob que no llega a IndexedDB, una
 * miniatura que no aparece. Todo eso pasa el build sin una sola advertencia y
 * solo se detecta ejecutando la pantalla de verdad.
 *
 * No pretende imitar a Supabase: responde lo justo para que la pantalla se monte
 * con datos y las escrituras no revienten. Lo que se está probando es el camino
 * del teléfono —IndexedDB, la cola, la interfaz—, no el servidor.
 */

const PERFIL = {
  id: '6165f239-1805-4c68-a526-3577afc9912e',
  nombre: 'Francisco Morgado',
  email: 'prueba@coproactiva.cl',
  rol: 'superadmin',
  activo: true
};

const EQUIPO = [
  PERFIL,
  { id: 'u2', nombre: 'Marta Silva',  email: 'marta@coproactiva.cl',  rol: 'jefatura', activo: true },
  { id: 'u3', nombre: 'Luis Cárcamo', email: 'luis@coproactiva.cl',   rol: 'terreno',  activo: true },
  { id: 'u4', nombre: 'Ana Pinto',    email: 'ana@coproactiva.cl',    rol: 'terreno',  activo: false }
];

const COMUNIDAD_ID = 'c0000000-0000-4000-8000-000000000001';
const CONTROL_ID   = 'c0000000-0000-4000-8000-000000000002';

const PROSPECTO_ID = 'c0000000-0000-4000-8000-000000000003';

const CONTROL = {
  id: CONTROL_ID,
  comunidad_id: COMUNIDAD_ID,
  prospecto_id: null,
  destino_nombre: 'Edificio de prueba',
  destino_direccion: 'América 755',
  destino_comuna: 'San Bernardo',
  destino_tipo: 'comunidad',
  estado: 'en_curso',
  periodo: 'Septiembre 2026',
  checkin_en: '2026-09-06T13:14:00.000Z',
  checkin_precision: 12.4,
  creado_en: '2026-09-06T12:00:00.000Z',
  items_evaluados: 1,
  items_totales: 4,
  items_criticos: 0,
  comunidades: { nombre: 'Edificio de prueba', direccion: 'América 755', comuna: 'San Bernardo' }
};

const ITEMS = [
  { id: 'i1', grupo: 'Acceso', texto: 'Conserje en turno', orden: 0,
    estado: 'cumple', nota: null, respuesta: null, tipo_ingreso: 'estado', config: {} },
  { id: 'i2', grupo: 'Acceso', texto: 'Cámaras grabando', orden: 1,
    estado: 'cumple', nota: null, respuesta: null, tipo_ingreso: 'estado', config: {},
    requiere_foto: true },
  { id: 'i3', grupo: 'Instalaciones', texto: 'Lectura del medidor', orden: 2,
    estado: 'sin_evaluar', nota: null, respuesta: null, tipo_ingreso: 'numero',
    config: { unidad: 'm³' }, requiere_foto: false },
  { id: 'i4', grupo: 'Instalaciones', texto: 'Estado de la fachada', orden: 3,
    estado: 'sin_evaluar', nota: null, respuesta: null, tipo_ingreso: 'escala',
    config: { min: 1, max: 10 }, requiere_foto: false }
];

/* Check-ins repartidos por Santiago, con estados y fechas distintas para poder
 * ejercitar los filtros del mapa. */
const ahora = Date.now();
const hace = d => new Date(ahora - d * 86400000).toISOString();
const VISITAS = [
  { ...CONTROL, id: 'v1', comunidad_id: 'com-mirador', destino_nombre: 'Mirador del Parque', destino_comuna: 'Ñuñoa',
    responsable_id: 'u3', responsable_nombre: 'Luis Cárcamo',
    estado: 'enviado', checkin_en: hace(0), checkin_lat: -33.4569, checkin_lng: -70.5975,
    checkin_precision: 8, items_evaluados: 26, items_totales: 26, items_criticos: 0, fotos: 12 },
  { ...CONTROL, id: 'v2', comunidad_id: 'com-almendros', destino_nombre: 'Los Almendros', destino_comuna: 'La Florida',
    responsable_id: 'u3', responsable_nombre: 'Luis Cárcamo',
    estado: 'en_curso', checkin_en: hace(2), checkin_lat: -33.5226, checkin_lng: -70.5989,
    checkin_precision: 65, items_evaluados: 8, items_totales: 26, items_criticos: 1, fotos: 4 },
  { ...CONTROL, id: 'v3', comunidad_id: 'com-costanera', destino_nombre: 'Costanera Norte', destino_comuna: 'Providencia',
    responsable_id: 'u2', responsable_nombre: 'Marta Silva',
    estado: 'pausado', checkin_en: hace(9), checkin_lat: -33.4198, checkin_lng: -70.6062,
    checkin_precision: 22, items_evaluados: 11, items_totales: 26, items_criticos: 0, fotos: 7 },
  { ...CONTROL, id: 'v4', comunidad_id: null, prospecto_id: PROSPECTO_ID, destino_tipo: 'prospecto', destino_nombre: 'Las Palmeras', destino_comuna: 'Providencia',
    responsable_id: null, responsable_nombre: null,
    estado: 'enviado', checkin_en: hace(40), checkin_lat: -33.4372, checkin_lng: -70.6178,
    checkin_precision: 15, items_evaluados: 26, items_totales: 26, items_criticos: 3, fotos: 21 }
];
// Dos visitas más a Los Almendros: es el caso que la agrupación resuelve.
VISITAS.push({
  ...CONTROL, id: 'v6', comunidad_id: 'com-almendros', destino_nombre: 'Los Almendros',
  destino_comuna: 'La Florida', responsable_id: 'u3', responsable_nombre: 'Luis Cárcamo',
  estado: 'enviado', checkin_en: hace(6), checkin_lat: -33.5231, checkin_lng: -70.5981,
  checkin_precision: 11, items_evaluados: 26, items_totales: 26, items_criticos: 2, fotos: 9
});
VISITAS.push({
  ...CONTROL, id: 'v7', comunidad_id: 'com-almendros', destino_nombre: 'Los Almendros',
  destino_comuna: 'La Florida', responsable_id: 'u3', responsable_nombre: 'Luis Cárcamo',
  estado: 'enviado', checkin_en: hace(20), checkin_lat: -33.5220, checkin_lng: -70.5994,
  checkin_precision: 14, items_evaluados: 26, items_totales: 26, items_criticos: 0, fotos: 15
});
VISITAS.push({
  ...CONTROL, id: 'v5', comunidad_id: 'com-zen', destino_nombre: 'Edificio Zen', destino_comuna: 'Peñalolén',
  responsable_id: null, responsable_nombre: null,
  estado: 'pendiente', checkin_en: null, checkin_lat: null, checkin_lng: null,
  items_evaluados: 0, items_totales: 26, items_criticos: 0, fotos: 0
});

const TABLAS = {
  perfiles: EQUIPO,
  perfil_comunidades: [{ perfil_id: 'u2', comunidad_id: COMUNIDAD_ID }],
  comunidades: [{ id: COMUNIDAD_ID, nombre: 'Edificio de prueba', comuna: 'San Bernardo' }],
  prospectos: [{ id: PROSPECTO_ID, nombre_condominio: 'Las Palmeras', comuna: 'Providencia', etapa: 'diagnostico' }],
  controles: [CONTROL],
  controles_con_avance: VISITAS,
  control_items: ITEMS,
  control_pausas: [],
  plantillas_control: [{ id: 'pl1', nombre: 'Control mensual', activa: true, plantilla_items: [{ count: 4 }] }],
  plantilla_items: ITEMS.map((it, n) => ({
    id: 'p' + n, plantilla_id: 'pl1', grupo: it.grupo, texto: it.texto,
    orden: n, orden_grupo: 0, tipo_ingreso: it.tipo_ingreso, config: it.config, activo: true
  })),
  adjuntos: []
};

/* Consulta encadenable. Cada método devuelve el mismo objeto y la promesa se
 * resuelve al final, igual que el cliente real. */
function consulta(tabla) {
  let filas = [...(TABLAS[tabla] ?? [])];
  const api = {
    select: () => api,
    eq: (columna, valor) => {
      if (filas.length && columna in (filas[0] ?? {})) {
        filas = filas.filter(f => f[columna] === valor);
      }
      return api;
    },
    not: () => api,
    order: () => api,
    insert: d => {
      registrar('insert', tabla, d);
      const fila = Array.isArray(d) ? d[0] : d;
      filas.unshift({ id: 'nuevo-' + tabla, ...fila });
      return api;
    },
    update: d => { registrar('update', tabla, d); return api; },
    upsert: d => { registrar('upsert', tabla, d); return api; },
    delete: () => api,
    single: () => Promise.resolve({ data: filas[0] ?? null, error: null }),
    maybeSingle: () => Promise.resolve({ data: filas[0] ?? null, error: null }),
    then: (resolver, rechazar) =>
      Promise.resolve({ data: filas, error: null }).then(resolver, rechazar)
  };
  return api;
}

// Las escrituras quedan a la vista para que la prueba pueda comprobarlas.
window.__escrituras = [];
function registrar(operacion, tabla, datos) {
  window.__escrituras.push({ operacion, tabla, datos });
}

export const hayCredenciales = true;

export const supabase = {
  from: consulta,
  auth: {
    getSession: () => Promise.resolve({
      data: { session: { user: { id: PERFIL.id, email: PERFIL.email }, access_token: 'token-de-prueba' } }
    }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
    signInWithPassword: () => Promise.resolve({ error: null }),
    // El token 'vencido' simula un enlace ya usado o caducado.
    verifyOtp: ({ token_hash }) => Promise.resolve(
      token_hash === 'vencido'
        ? { data: null, error: { message: 'Token has expired or is invalid' } }
        : { data: { session: {} }, error: null }
    ),
    updateUser: (datos) => { registrar('updateUser', 'auth', datos); return Promise.resolve({ error: null }); },
    signOut: () => Promise.resolve({ error: null })
  },
  storage: {
    from: () => ({
      upload: (ruta) => {
        registrar('storage', 'evidencia', { ruta });
        return Promise.resolve({ error: null });
      }
    })
  }
};

export const IDS = { COMUNIDAD_ID, CONTROL_ID, PROSPECTO_ID, PERFIL };
