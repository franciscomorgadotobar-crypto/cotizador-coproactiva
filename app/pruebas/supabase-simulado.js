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
  rol: 'admin',
  activo: true
};

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

const TABLAS = {
  perfiles: [PERFIL],
  comunidades: [{ id: COMUNIDAD_ID, nombre: 'Edificio de prueba', comuna: 'San Bernardo' }],
  prospectos: [{ id: PROSPECTO_ID, nombre_condominio: 'Las Palmeras', comuna: 'Providencia', etapa: 'diagnostico' }],
  controles: [CONTROL],
  controles_con_avance: [CONTROL],
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
  const filas = [...(TABLAS[tabla] ?? [])];
  const api = {
    select: () => api,
    eq: () => api,
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
      data: { session: { user: { id: PERFIL.id, email: PERFIL.email } } }
    }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
    signInWithPassword: () => Promise.resolve({ error: null }),
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
