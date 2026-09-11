import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useSesion } from '../../lib/sesion';
import MapaPortalCliente from './MapaPortalCliente';
import './PortalCliente.css';

const TABS = [
  ['resumen', 'Resumen'],
  ['levantamientos', 'Levantamientos'],
  ['mantencion', 'Plan de mantención'],
  ['agenda', 'Agenda']
];

function fechaCL(valor, conHora = false) {
  if (!valor) return 'Sin fecha';
  const soloFecha = typeof valor === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(valor);
  const d = new Date(soloFecha ? `${valor}T12:00:00` : valor);
  if (Number.isNaN(d.getTime())) return 'Sin fecha';
  return d.toLocaleString('es-CL', conHora
    ? { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }
    : { day: '2-digit', month: 'short', year: 'numeric' });
}

function hoyChile() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Santiago', year: 'numeric', month: '2-digit', day: '2-digit'
  }).format(new Date());
}

function frecuencia(m) {
  if (m.frecuencia_unidad === 'unica') return 'Intervención única';
  if (!m.frecuencia_valor) return 'Frecuencia sin definir';
  const nombres = { dias: 'día', semanas: 'semana', meses: 'mes', anos: 'año' };
  const n = nombres[m.frecuencia_unidad] ?? m.frecuencia_unidad;
  return `Cada ${m.frecuencia_valor} ${n}${m.frecuencia_valor === 1 ? '' : 's'}`;
}

function etiquetaEstado(valor) {
  const mapa = {
    pendiente: 'Pendiente', en_curso: 'En curso', pausado: 'En pausa', enviado: 'Finalizado',
    agendada: 'Agendada', completada: 'Completada', cancelada: 'Cancelada'
  };
  return mapa[valor] ?? valor ?? 'Sin estado';
}

export default function PortalCliente() {
  const { id } = useParams();
  return id ? <DetalleCliente id={id} /> : <DashboardCliente />;
}

function DashboardCliente() {
  const { perfil } = useSesion();
  const [comunidades, setComunidades] = useState(null);
  const [notificaciones, setNotificaciones] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!perfil?.id) return;
    let vigente = true;
    Promise.all([
      supabase.rpc('portal_cliente_dashboard'),
      supabase.from('notificaciones_mantenimiento')
        .select('id, comunidad_id, titulo, mensaje, creado_en')
        .eq('destinatario_id', perfil.id)
        .eq('leida', false)
        .order('creado_en', { ascending: false })
        .limit(10)
    ]).then(([rd, rn]) => {
      if (!vigente) return;
      if (rd.error) setError(rd.error.message);
      else setComunidades(rd.data ?? []);
      if (!rn.error) setNotificaciones(rn.data ?? []);
    });
    return () => { vigente = false; };
  }, [perfil?.id]);

  const totales = useMemo(() => (comunidades ?? []).reduce((a, c) => ({
    por_agendar: a.por_agendar + Number(c.por_agendar ?? 0),
    agendados: a.agendados + Number(c.agendados ?? 0),
    pendientes: a.pendientes + Number(c.pendientes ?? 0)
  }), { por_agendar: 0, agendados: 0, pendientes: 0 }), [comunidades]);

  return (
    <div className="pantalla">
      <header className="encabezado">
        <h1 className="h3">Mi portal</h1>
        <p className="chico apagado" style={{ margin: '4px 0 0' }}>
          Seguimiento de tus comunidades, levantamientos y mantenciones.
        </p>
      </header>

      <div className="cuerpo">
        {error && <div className="aviso aviso-critico" style={{ marginBottom: 14 }}>{error}</div>}
        {comunidades === null && !error && <p className="cargando">Cargando…</p>}

        {comunidades && (
          <>
            <section className="portal-kpis" aria-label="Resumen de trabajos">
              <Kpi valor={totales.por_agendar} etiqueta="Por agendar" />
              <Kpi valor={totales.agendados} etiqueta="Agendados" />
              <Kpi valor={totales.pendientes} etiqueta="Pendientes" alerta={totales.pendientes > 0} />
            </section>

            {notificaciones.length > 0 && (
              <section className="portal-seccion">
                <h2 className="h4">Avisos recientes</h2>
                <div className="portal-lista">
                  {notificaciones.map(n => (
                    <Link key={n.id} to={`/portal/comunidades/${n.comunidad_id}`} className="tarjeta portal-aviso">
                      <strong>{n.titulo}</strong>
                      <span className="micro">{n.mensaje}</span>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            <section className="portal-seccion">
              <h2 className="h4">Tus comunidades</h2>
              {comunidades.length === 0 ? (
                <p className="vacio">Tu cuenta aún no tiene comunidades asociadas.</p>
              ) : (
                <div className="portal-comunidades">
                  {comunidades.map(c => (
                    <Link key={c.comunidad_id} to={`/portal/comunidades/${c.comunidad_id}`} className="tarjeta portal-comunidad">
                      <div className="fila">
                        <strong className="crece">{c.nombre}</strong>
                        <span aria-hidden="true">›</span>
                      </div>
                      <div className="micro apagado portal-meta">
                        {c.comuna && <span>{c.comuna}</span>}
                        {c.direccion && <span>{c.direccion}</span>}
                      </div>
                      <div className="portal-mini-kpis">
                        <span>{c.por_agendar} por agendar</span>
                        <span>{c.agendados} agendados</span>
                        <span>{c.pendientes} pendientes</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>

            {comunidades.some(c => c.latitud != null && c.longitud != null) && (
              <section className="portal-seccion">
                <h2 className="h4">Mapa</h2>
                <MapaPortalCliente key={comunidades.map(c => c.comunidad_id).join(',')} comunidades={comunidades} />
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function Kpi({ valor, etiqueta, alerta = false }) {
  return (
    <div className={'portal-kpi' + (alerta ? ' portal-kpi-alerta' : '')}>
      <strong>{valor}</strong>
      <span>{etiqueta}</span>
    </div>
  );
}

function DetalleCliente({ id }) {
  const navegar = useNavigate();
  const { perfil } = useSesion();
  const [params, setParams] = useSearchParams();
  const tabInicial = TABS.some(([x]) => x === params.get('seccion')) ? params.get('seccion') : 'resumen';
  const [tab, setTab] = useState(tabInicial);
  const [comunidad, setComunidad] = useState(null);
  const [levantamientos, setLevantamientos] = useState([]);
  const [mantenciones, setMantenciones] = useState([]);
  const [requerimientos, setRequerimientos] = useState([]);
  const [notificaciones, setNotificaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!perfil?.id) return;
    let vigente = true;
    setCargando(true);
    Promise.all([
      supabase.rpc('portal_cliente_dashboard'),
      supabase.rpc('portal_cliente_levantamientos', { p_comunidad_id: id }),
      supabase.rpc('portal_cliente_mantenciones', { p_comunidad_id: id }),
      supabase.rpc('portal_cliente_requerimientos', { p_comunidad_id: id }),
      supabase.from('notificaciones_mantenimiento')
        .select('id, titulo, mensaje, leida, creado_en')
        .eq('destinatario_id', perfil.id)
        .eq('comunidad_id', id)
        .order('creado_en', { ascending: false })
        .limit(20)
    ]).then(([rd, rl, rm, rr, rn]) => {
      if (!vigente) return;
      const fallo = [rd, rl, rm, rr].find(r => r.error)?.error;
      if (fallo) setError(fallo.message);
      else {
        const c = (rd.data ?? []).find(x => x.comunidad_id === id);
        if (!c) setError('Esta comunidad no está asociada a tu cuenta.');
        setComunidad(c ?? null);
        setLevantamientos(rl.data ?? []);
        setMantenciones(rm.data ?? []);
        setRequerimientos(rr.data ?? []);
      }
      if (!rn.error) setNotificaciones(rn.data ?? []);
      setCargando(false);
    });
    return () => { vigente = false; };
  }, [id, perfil?.id]);

  function cambiarTab(nuevo) {
    setTab(nuevo);
    setParams({ seccion: nuevo }, { replace: true });
  }

  async function marcarLeida(n) {
    if (n.leida) return;
    const { error } = await supabase.from('notificaciones_mantenimiento')
      .update({ leida: true, leida_en: new Date().toISOString() })
      .eq('id', n.id);
    if (!error) setNotificaciones(xs => xs.map(x => x.id === n.id ? { ...x, leida: true } : x));
  }

  const hoy = hoyChile();
  const porAgendar = [
    ...requerimientos.filter(r => !r.tiene_agendamiento).map(r => ({
      id: `r-${r.id}`, tipo: 'Levantamiento', titulo: r.nombre, fecha: r.proxima_exigible
    })),
    ...mantenciones.filter(m => !m.programado_para && (!m.proxima_exigible || m.proxima_exigible >= hoy)).map(m => ({
      id: `m-${m.actividad_id}`, tipo: 'Mantención', titulo: `${m.activo_nombre}: ${m.trabajo}`, fecha: m.proxima_exigible
    }))
  ];

  const agenda = [
    ...levantamientos.filter(l => l.programado_para && !['enviado', 'anulado'].includes(l.estado)).map(l => ({
      id: `l-${l.id}`, tipo: 'Levantamiento', titulo: l.plantilla_nombre, fecha: l.programado_para, estado: l.estado,
      pendiente: new Date(l.programado_para) <= new Date()
    })),
    ...mantenciones.filter(m => m.programado_para && ['agendada', 'en_curso'].includes(m.estado_agendamiento)).map(m => ({
      id: `m-${m.actividad_id}`, tipo: 'Mantención', titulo: `${m.activo_nombre}: ${m.trabajo}`, fecha: m.programado_para, estado: m.estado_agendamiento,
      exigible: m.vencimiento_original || m.proxima_exigible,
      pendiente: Boolean((m.vencimiento_original || m.proxima_exigible) && (m.vencimiento_original || m.proxima_exigible) < hoy)
    }))
  ].sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

  const pendientes = agenda.filter(a => a.pendiente).length +
    mantenciones.filter(m => m.proxima_exigible && m.proxima_exigible < hoy && !m.programado_para).length;
  const agendados = agenda.filter(a => !a.pendiente && new Date(a.fecha) > new Date()).length;

  if (cargando) return <p className="cargando">Cargando…</p>;

  return (
    <div className="pantalla">
      <header className="encabezado">
        <button className="boton boton-texto" style={{ padding: '4px 8px 8px 0' }} onClick={() => navegar('/portal')}>
          ‹ Mis comunidades
        </button>
        <h1 className="h3">{comunidad?.nombre ?? 'Comunidad'}</h1>
        <p className="chico apagado" style={{ margin: '4px 0 0' }}>
          {[comunidad?.direccion, comunidad?.comuna].filter(Boolean).join(' · ')}
        </p>
      </header>

      <div className="cuerpo">
        {error && <div className="aviso aviso-critico" style={{ marginBottom: 14 }}>{error}</div>}
        {!comunidad ? null : (
          <>
            <nav className="portal-tabs" aria-label="Secciones de la comunidad">
              {TABS.map(([clave, texto]) => (
                <button key={clave} type="button" className={'portal-tab' + (tab === clave ? ' activa' : '')}
                        onClick={() => cambiarTab(clave)}>
                  {texto}
                </button>
              ))}
            </nav>

            {tab === 'resumen' && (
              <>
                <section className="portal-kpis">
                  <Kpi valor={porAgendar.length} etiqueta="Por agendar" />
                  <Kpi valor={agendados} etiqueta="Agendados" />
                  <Kpi valor={pendientes} etiqueta="Pendientes" alerta={pendientes > 0} />
                </section>

                {notificaciones.length > 0 && (
                  <section className="portal-seccion">
                    <h2 className="h4">Avisos</h2>
                    <div className="portal-lista">
                      {notificaciones.map(n => (
                        <button key={n.id} type="button"
                                className={'tarjeta portal-aviso portal-aviso-boton' + (n.leida ? ' leido' : '')}
                                onClick={() => marcarLeida(n)}>
                          <strong>{n.titulo}</strong>
                          <span className="micro">{n.mensaje}</span>
                          <span className="micro apagado">{fechaCL(n.creado_en, true)}</span>
                        </button>
                      ))}
                    </div>
                  </section>
                )}

                <section className="portal-seccion">
                  <h2 className="h4">Próximos trabajos</h2>
                  {agenda.length === 0 ? <p className="vacio">No hay trabajos agendados.</p> : (
                    <div className="portal-lista">
                      {agenda.slice(0, 6).map(a => <FilaAgenda key={a.id} item={a} />)}
                    </div>
                  )}
                </section>
              </>
            )}

            {tab === 'levantamientos' && (
              <section className="portal-seccion portal-seccion-sin-margen">
                <h2 className="h4">Levantamientos habilitados</h2>
                {levantamientos.length === 0 ? <p className="vacio">No hay levantamientos visibles para esta comunidad.</p> : (
                  <div className="portal-lista">
                    {levantamientos.map(l => (
                      <div key={l.id} className="tarjeta portal-item">
                        <div className="fila">
                          <strong className="crece">{l.plantilla_nombre}</strong>
                          <span className="micro portal-estado">{etiquetaEstado(l.estado)}</span>
                        </div>
                        <div className="micro apagado portal-meta">
                          {l.periodo && <span>{l.periodo}</span>}
                          <span>{l.programado_para ? `Programado: ${fechaCL(l.programado_para, true)}` : `Creado: ${fechaCL(l.creado_en)}`}</span>
                          {l.enviado_en && <span>Finalizado: {fechaCL(l.enviado_en, true)}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {porAgendar.filter(x => x.tipo === 'Levantamiento').length > 0 && (
                  <>
                    <h3 className="h4 portal-subtitulo">Por agendar</h3>
                    <div className="portal-lista">
                      {porAgendar.filter(x => x.tipo === 'Levantamiento').map(x => (
                        <div key={x.id} className="tarjeta portal-item">
                          <strong>{x.titulo}</strong>
                          <span className="micro apagado">{x.fecha ? `Fecha exigible: ${fechaCL(x.fecha)}` : 'Sin fecha programada'}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </section>
            )}

            {tab === 'mantencion' && (
              <section className="portal-seccion portal-seccion-sin-margen">
                <h2 className="h4">Plan de mantención</h2>
                {mantenciones.length === 0 ? <p className="vacio">No hay actividades de mantención registradas.</p> : (
                  <div className="portal-lista">
                    {mantenciones.map(m => (
                      <div key={m.actividad_id} className="tarjeta portal-item">
                        <div className="fila">
                          <strong className="crece">{m.activo_nombre}</strong>
                          <span className="micro portal-estado">{m.activo_categoria}</span>
                        </div>
                        <p style={{ margin: '6px 0 0' }}>{m.trabajo}</p>
                        <div className="micro apagado portal-meta">
                          <span>{frecuencia(m)}</span>
                          {m.proxima_exigible && <span>Próxima exigible: {fechaCL(m.proxima_exigible)}</span>}
                          {m.programado_para && <span>Agendada: {fechaCL(m.programado_para, true)}</span>}
                          {m.proveedor && <span>Proveedor: {m.proveedor}</span>}
                        </div>
                        {m.ultima_ejecucion && (
                          <div className="portal-ejecucion">
                            <strong className="micro">Última ejecución: {fechaCL(m.ultima_ejecucion, true)}</strong>
                            {m.ejecutor && <span className="micro">Realizada por {m.ejecutor}</span>}
                            {m.observaciones && <span className="micro apagado">{m.observaciones}</span>}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {tab === 'agenda' && (
              <section className="portal-seccion portal-seccion-sin-margen">
                <h2 className="h4">Agenda</h2>
                {agenda.length === 0 ? <p className="vacio">No hay trabajos agendados.</p> : (
                  <div className="portal-lista">
                    {agenda.map(a => <FilaAgenda key={a.id} item={a} />)}
                  </div>
                )}
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function FilaAgenda({ item }) {
  const vencida = Boolean(item.pendiente ?? (new Date(item.fecha) <= new Date()));
  return (
    <div className={'tarjeta portal-item' + (vencida ? ' portal-item-pendiente' : '')}>
      <div className="fila">
        <strong className="crece">{item.titulo}</strong>
        <span className="micro portal-estado">{item.tipo}</span>
      </div>
      <div className="micro apagado portal-meta">
        <span>{fechaCL(item.fecha, true)}</span>
        {item.estado && <span>{etiquetaEstado(item.estado)}</span>}
        {item.exigible && <span>Exigible: {fechaCL(item.exigible)}</span>}
        {vencida && <span>Pendiente</span>}
      </div>
    </div>
  );
}
