import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useSesion } from '../../lib/sesion';
import { AvisoConexion } from '../../lib/estado';
import MapaPrevio from '../../componentes/MapaPrevio';
import { hayConexion } from '../../lib/sincronizacion';
import { leerControles, guardarControl } from '../../lib/local';

const CHIP = {
  pendiente: ['chip-pendiente', 'Pendiente'],
  en_curso: ['chip-alerta', 'En curso'],
  pausado: ['chip-pausado', 'En pausa'],
  enviado: ['chip-cumple', 'Enviado'],
  anulado: ['chip-pendiente', 'Anulado']
};

export default function Inicio() {
  const { perfil, salir } = useSesion();
  const [controles, setControles] = useState(null);
  const [error, setError] = useState(null);
  const [ajustes, setAjustes] = useState(false);
  // Qué grupos de trabajador están abiertos. Se abre el propio al llegar: lo
  // primero que uno mira al entrar es su propio día.
  const [abiertos, setAbiertos] = useState(null);

  const puedeConfigurar = perfil && ['superadmin', 'admin', 'jefatura'].includes(perfil.rol);
  // Jefatura arma plantillas y programa visitas, pero no da de alta usuarios.
  const esAdministracion = perfil && ['superadmin', 'admin'].includes(perfil.rol);

  useEffect(() => {
    let vigente = true;

    // Sin señal se muestra lo descargado: llegar a un edificio y ver una lista
    // vacía porque no hay red haría la app inútil justo cuando se necesita.
    if (!hayConexion()) {
      leerControles().then(l => vigente && setControles(l));
      return () => { vigente = false; };
    }

    supabase
      .from('controles_con_avance')
      .select('id, comunidad_id, prospecto_id, estado, periodo, programado_para, enviado_en, checkin_en, checkin_lat, checkin_lng, responsable_id, responsable_nombre, items_evaluados, items_totales, items_criticos, fotos, destino_nombre, destino_direccion, destino_comuna, destino_tipo')
      .order('programado_para', { ascending: true })
      .then(({ data, error }) => {
        if (!vigente) return;
        if (error) {
          setError(error.message);
          leerControles().then(l => vigente && setControles(l));
        } else {
          setControles(data ?? []);
          for (const c of data ?? []) guardarControl(c);
        }
      });

    return () => { vigente = false; };
  }, []);

  /* El resumen mira los últimos 30 días. Un acumulado histórico deja de decir
   * nada al tercer mes: lo que importa es si el trabajo de este mes va al día. */
  const resumen = useMemo(() => {
    if (!controles) return null;
    const desde = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const recientes = controles.filter(c => {
      const f = c.enviado_en ?? c.programado_para ?? c.creado_en;
      return f && new Date(f).getTime() >= desde;
    });

    return {
      pendientes: controles.filter(c => c.estado === 'pendiente').length,
      // Los pausados cuentan como trabajo abierto: quedaron a medias y alguien
      // tiene que volver.
      enCurso:    controles.filter(c => c.estado === 'en_curso' || c.estado === 'pausado').length,
      enviados:   recientes.filter(c => c.estado === 'enviado').length,
      criticos:   controles.reduce((n, c) => n + (c.items_criticos ?? 0), 0)
    };
  }, [controles]);

  const pendientes = controles?.filter(c => c.estado !== 'enviado' && c.estado !== 'anulado') ?? [];
  const cerrados = controles?.filter(c => c.estado === 'enviado') ?? [];

  /* El trabajo pendiente se agrupa por persona. Una lista plana no responde la
   * pregunta que importa al mirar el día: quién va sobrecargado y quién tiene
   * hueco. Sin asignar va al final, porque es lo que hay que repartir. */
  const porTrabajador = useMemo(() => {
    const m = new Map();
    for (const c of pendientes) {
      const clave = c.responsable_id ?? 'sin-asignar';
      if (!m.has(clave)) {
        m.set(clave, {
          id: clave,
          nombre: c.responsable_nombre ?? 'Sin asignar',
          items: []
        });
      }
      m.get(clave).items.push(c);
    }
    return [...m.values()].sort((a, b) =>
      a.id === 'sin-asignar' ? 1 : b.id === 'sin-asignar' ? -1
        : a.nombre.localeCompare(b.nombre, 'es'));
  }, [controles]);

  useEffect(() => {
    if (abiertos !== null || !porTrabajador.length) return;
    // El grupo propio si existe; si no, el primero. Dejarlos todos cerrados
    // haría que al entrar no se vea trabajo alguno.
    const mio = porTrabajador.find(g => g.id === perfil?.id);
    setAbiertos(new Set([(mio ?? porTrabajador[0]).id]));
  }, [porTrabajador, perfil]);

  function alternar(id) {
    setAbiertos(prev => {
      const s = new Set(prev ?? []);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });
  }

  const hoy = new Date().toLocaleDateString('es-CL', {
    weekday: 'long', day: 'numeric', month: 'long'
  });

  return (
    <div className="pantalla">
      <AvisoConexion />

      <header className="encabezado">
        <div className="fila">
          <div className="crece">
            <h1 className="h3">Hola, {perfil?.nombre?.split(' ')[0] ?? ''}</h1>
            <p className="chico apagado" style={{ margin: '2px 0 0' }}>
              {hoy.charAt(0).toUpperCase() + hoy.slice(1)}
            </p>
          </div>
          <button className="boton boton-texto" onClick={salir}>Salir</button>
        </div>
      </header>

      <div className="cuerpo">
        {error && <div className="aviso aviso-critico">{error}</div>}

        {/* El mapa primero: antes de saber cuánto falta, importa dónde está. */}
        {controles?.some(c => c.checkin_lat != null) && (
          <MapaPrevio controles={controles} />
        )}

        {/* Resumen de los últimos 30 días */}
        {resumen && (
          <div className="tablero">
            <div>
              <p className="n">{resumen.pendientes}</p>
              <p className="r">Pendientes</p>
            </div>
            <div className={resumen.enCurso ? 'alerta' : ''}>
              <p className="n">{resumen.enCurso}</p>
              <p className="r">En curso</p>
            </div>
            <div className="ok">
              <p className="n">{resumen.enviados}</p>
              <p className="r">Enviados 30 d</p>
            </div>
            <div className={resumen.criticos ? 'critico' : ''}>
              <p className="n">{resumen.criticos}</p>
              <p className="r">Críticos</p>
            </div>
          </div>
        )}

        {puedeConfigurar && (
          <>
            <Link to="/nuevo" className="acceso acceso-principal">
              <span className="crece">Nuevo levantamiento</span>
              <span aria-hidden="true">+</span>
            </Link>

            {/* Plantillas y equipo se tocan poco y no son trabajo del día:
                agrupadas ocupan una línea en vez de tres. */}
            <div className={'configuracion' + (ajustes ? ' abierta' : '')}>
              <button type="button" className="acceso" aria-expanded={ajustes}
                      onClick={() => setAjustes(v => !v)}>
                <span className="crece">Configuración</span>
                <span aria-hidden="true">{ajustes ? '−' : '+'}</span>
              </button>
              {ajustes && (
                <div className="dentro">
                  <Link to="/plantillas">Plantillas de levantamiento</Link>
                  {esAdministracion && <Link to="/equipo">Equipo y permisos</Link>}
                </div>
              )}
            </div>
          </>
        )}

        <div className="grupo-titulo">
          <span className="etiqueta-grupo">Por hacer</span>
        </div>

        {controles === null && !error && <p className="cargando">Cargando…</p>}
        {controles && pendientes.length === 0 && (
          <p className="vacio">No hay levantamientos pendientes.</p>
        )}

        {porTrabajador.map(grupo => {
          const desplegado = abiertos?.has(grupo.id) ?? false;
          const criticos = grupo.items.reduce((n, c) => n + (c.items_criticos ?? 0), 0);

          return (
            <div key={grupo.id} className="grupo-trabajador">
              <button type="button"
                      className={'cabecera-trabajador' + (desplegado ? ' abierta' : '')}
                      aria-expanded={desplegado}
                      onClick={() => alternar(grupo.id)}>
                <span className="crece">{grupo.nombre}</span>
                {criticos > 0 && <span className="punto-critico" aria-label="Tiene críticos" />}
                <span className="micro">
                  {grupo.items.length} pendiente{grupo.items.length > 1 ? 's' : ''}
                </span>
                <span className="flecha" aria-hidden="true">{desplegado ? '−' : '+'}</span>
              </button>

              {desplegado && grupo.items.map(c => (
                <Tarjeta key={c.id} c={c} puedeEditar={puedeConfigurar} />
              ))}
            </div>
          );
        })}

        {cerrados.length > 0 && (
          <>
            <div className="grupo-titulo" style={{ marginTop: 20 }}>
              <span className="etiqueta-grupo">Realizados</span>
            </div>
            {cerrados.map(c => <Tarjeta key={c.id} c={c} puedeEditar={puedeConfigurar} />)}
          </>
        )}
      </div>
    </div>
  );
}

function Tarjeta({ c, puedeEditar }) {
  const [clase, texto] = CHIP[c.estado] ?? CHIP.pendiente;
  const pct = c.items_totales ? Math.round((c.items_evaluados / c.items_totales) * 100) : 0;

  return (
    <article className="tarjeta" style={{ padding: 16, marginBottom: 12 }}>
      <div className="fila" style={{ marginBottom: 8 }}>
        <span className="etiqueta-campo crece" style={{ margin: 0 }}>
          {c.enviado_en
            ? new Date(c.enviado_en).toLocaleDateString('es-CL', { day: '2-digit', month: 'short' })
            : c.programado_para
              ? new Date(c.programado_para).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })
              : c.periodo ?? ''}
        </span>
        {c.destino_tipo === 'prospecto' && (
          <span className="chip chip-diagnostico">Diagnóstico</span>
        )}
        {c.items_criticos > 0 && (
          <span className="chip chip-critico">{c.items_criticos} crítico{c.items_criticos > 1 ? 's' : ''}</span>
        )}
        <span className={'chip ' + clase}>{texto}</span>
      </div>

      <div className="fila" style={{ alignItems: 'flex-start' }}>
        <Link to={`/control/${c.id}`} className="crece" style={{ color: 'inherit' }}>
          <p className="dato-chico" style={{ margin: 0 }}>
            {c.destino_nombre ?? c.comunidades?.nombre}
          </p>
          <p className="micro" style={{ margin: '3px 0 0' }}>
            {[c.destino_direccion, c.destino_comuna].filter(Boolean).join(', ')}
          </p>
        </Link>
        {puedeEditar && (
          <Link to={`/control/${c.id}/editar`} className="editar" aria-label="Editar levantamiento">
            Editar
          </Link>
        )}
      </div>

      {c.items_totales > 0 && (
        <div style={{ marginTop: 12 }}>
          <div className="fila" style={{ marginBottom: 5 }}>
            <span className="micro crece">
              {c.checkin_en
                ? `Check-in ${new Date(c.checkin_en).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}`
                : 'Sin check-in'}
            </span>
            <span className="micro">{c.items_evaluados} de {c.items_totales}</span>
          </div>
          <div className="barra"><div style={{ width: pct + '%' }} /></div>
        </div>
      )}
    </article>
  );
}
