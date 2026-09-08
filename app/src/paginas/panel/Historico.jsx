import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

/* Histórico de levantamientos, agrupado por comunidad.
 *
 * Responde una pregunta distinta a la del inicio y a la del mapa: no "qué
 * falta hoy" sino "qué ha pasado en este edificio" — quién lo revisó y cuándo,
 * viendo la comunidad entera de una vez en vez de ir levantamiento por
 * levantamiento. Por eso es pantalla aparte y no una sección más del inicio.
 *
 * Solo comunidades administradas: un levantamiento de diagnóstico pertenece al
 * embudo comercial de un prospecto, no al historial de un edificio que todavía
 * no se administra.
 *
 * Las políticas ya resuelven quién ve qué: administración y jefatura ven todas
 * las comunidades, terreno solo las suyas. Esta pantalla no filtra nada por su
 * cuenta —ni falta, ni le sobra respecto de lo que la base ya entrega—.
 */

const CHIP = {
  pendiente: ['chip-pendiente', 'Pendiente'],
  en_curso: ['chip-alerta', 'En curso'],
  pausado: ['chip-pausado', 'En pausa'],
  enviado: ['chip-cumple', 'Enviado'],
  anulado: ['chip-pendiente', 'Anulado']
};

export default function Historico() {
  const navegar = useNavigate();
  const [comunidades, setComunidades] = useState(null);
  const [controles, setControles] = useState([]);
  const [error, setError] = useState(null);
  const [abiertas, setAbiertas] = useState(() => new Set());

  useEffect(() => {
    (async () => {
      const [rc, rl] = await Promise.all([
        supabase.from('comunidades').select('id, nombre, comuna').order('nombre'),
        supabase
          .from('controles_con_avance')
          .select('id, comunidad_id, estado, enviado_en, programado_para, creado_en, checkin_en, responsable_id, responsable_nombre, plantilla_nombre, items_criticos')
          .not('comunidad_id', 'is', null)
          .neq('estado', 'anulado')
          .order('enviado_en', { ascending: false, nullsFirst: false })
      ]);
      if (rc.error) return setError(rc.error.message);
      if (rl.error) return setError(rl.error.message);
      setComunidades(rc.data ?? []);
      setControles(rl.data ?? []);
    })();
  }, []);

  const porComunidad = useMemo(() => {
    const m = new Map();
    for (const c of controles) {
      if (!m.has(c.comunidad_id)) m.set(c.comunidad_id, []);
      m.get(c.comunidad_id).push(c);
    }
    return m;
  }, [controles]);

  function alternar(id) {
    setAbiertas(prev => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });
  }

  return (
    <div className="pantalla">
      <header className="encabezado">
        <div className="fila" style={{ marginBottom: 8 }}>
          <button className="boton boton-texto" style={{ padding: '4px 8px 4px 0' }}
                  onClick={() => navegar('/')}>
            ‹ Inicio
          </button>
        </div>
        <h1 className="h3">Histórico por comunidad</h1>
        <p className="chico apagado" style={{ margin: '4px 0 0' }}>
          Lo hecho y lo pendiente de cada comunidad, en un solo lugar.
        </p>
      </header>

      <div className="cuerpo">
        {error && <div className="aviso aviso-critico" style={{ marginBottom: 12 }}>{error}</div>}

        {comunidades === null && <p className="cargando">Cargando…</p>}

        {comunidades?.length === 0 && (
          <p className="vacio">No hay comunidades registradas todavía.</p>
        )}

        {comunidades?.map(comunidad => {
          const items = porComunidad.get(comunidad.id) ?? [];
          const desplegada = abiertas.has(comunidad.id);
          const criticos = items.reduce((n, c) => n + (c.items_criticos ?? 0), 0);

          return (
            <div key={comunidad.id} className="grupo-trabajador">
              <button type="button"
                      className={'cabecera-trabajador' + (desplegada ? ' abierta' : '')}
                      aria-expanded={desplegada}
                      onClick={() => alternar(comunidad.id)}>
                <span className="crece">
                  {comunidad.nombre}
                  {comunidad.comuna && <span className="micro apagado"> · {comunidad.comuna}</span>}
                </span>
                {criticos > 0 && <span className="punto-critico" aria-label="Tiene críticos" />}
                <span className="micro">
                  {items.length} levantamiento{items.length !== 1 ? 's' : ''}
                </span>
                <span className="flecha" aria-hidden="true">{desplegada ? '−' : '+'}</span>
              </button>

              {desplegada && (
                items.length === 0 ? (
                  <p className="vacio" style={{ padding: '0 4px 12px' }}>
                    Todavía no hay levantamientos en esta comunidad.
                  </p>
                ) : items.map(c => {
                  const [clase, texto] = CHIP[c.estado] ?? CHIP.pendiente;
                  const fecha = c.enviado_en ?? c.checkin_en ?? c.programado_para ?? c.creado_en;
                  return (
                    <Link key={c.id} to={`/control/${c.id}`}
                          className="tarjeta" style={{ padding: 14, marginBottom: 10, display: 'block' }}>
                      <div className="fila" style={{ marginBottom: 6, flexWrap: 'wrap', rowGap: 6 }}>
                        <span className="micro apagado crece">
                          {fecha
                            ? new Date(fecha).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' })
                            : 'Sin fecha'}
                        </span>
                        {c.plantilla_nombre && <span className="chip chip-tipo">{c.plantilla_nombre}</span>}
                        {c.items_criticos > 0 && (
                          <span className="chip chip-critico">{c.items_criticos} crítico{c.items_criticos > 1 ? 's' : ''}</span>
                        )}
                        <span className={'chip ' + clase}>{texto}</span>
                      </div>
                      <p className="dato-chico" style={{ margin: 0, color: 'inherit' }}>
                        {c.responsable_nombre ?? (c.responsable_id ? 'Otra persona del equipo' : 'Sin asignar')}
                      </p>
                    </Link>
                  );
                })
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
