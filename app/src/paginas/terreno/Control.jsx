import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

const ESTADOS = [
  ['cumple', 'Cumple'],
  ['observacion', 'Observa'],
  ['critico', 'Crítico']
];

export default function Control() {
  const { id } = useParams();
  const navegar = useNavigate();

  const [control, setControl] = useState(null);
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [ubicando, setUbicando] = useState(false);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    let vigente = true;
    (async () => {
      const [c, i] = await Promise.all([
        supabase
          .from('controles')
          .select('id, estado, periodo, checkin_en, checkin_precision, comunidades(nombre, direccion, comuna)')
          .eq('id', id)
          .maybeSingle(),
        supabase
          .from('control_items')
          .select('id, grupo, texto, orden, estado, nota')
          .eq('control_id', id)
          .order('orden')
      ]);
      if (!vigente) return;
      if (c.error) setError(c.error.message);
      else if (!c.data) setError('Este control no existe o no tienes acceso.');
      else setControl(c.data);
      if (i.data) setItems(i.data);
    })();
    return () => { vigente = false; };
  }, [id]);

  // Los ítems vienen planos y se agrupan para mostrarlos; el orden dentro de
  // cada grupo lo define la plantilla.
  const grupos = useMemo(() => {
    const m = new Map();
    for (const it of items) {
      if (!m.has(it.grupo)) m.set(it.grupo, []);
      m.get(it.grupo).push(it);
    }
    return [...m.entries()];
  }, [items]);

  const evaluados = items.filter(i => i.estado !== 'sin_evaluar').length;
  const pct = items.length ? Math.round((evaluados / items.length) * 100) : 0;
  const faltantes = items.length - evaluados;

  /* El check-in es la evidencia de que alguien estuvo en el lugar. Se guarda la
   * precisión que informa el GPS: un check-in con precisión de 500 m no prueba
   * presencia y el detalle web lo muestra tal cual. */
  function hacerCheckIn() {
    if (!navigator.geolocation) {
      setError('Este teléfono no permite obtener la ubicación.');
      return;
    }
    setUbicando(true);
    navigator.geolocation.getCurrentPosition(
      async pos => {
        const { latitude, longitude, accuracy } = pos.coords;
        const { data, error } = await supabase
          .from('controles')
          .update({
            estado: 'en_curso',
            checkin_en: new Date().toISOString(),
            checkin_lat: latitude,
            checkin_lng: longitude,
            checkin_precision: accuracy
          })
          .eq('id', id)
          .select('id, estado, checkin_en, checkin_precision')
          .maybeSingle();
        setUbicando(false);
        if (error) setError(error.message);
        else if (data) setControl(c => ({ ...c, ...data }));
      },
      err => {
        setUbicando(false);
        setError(
          err.code === err.PERMISSION_DENIED
            ? 'Falta permiso de ubicación. Actívalo para poder registrar el check-in.'
            : 'No se pudo obtener la ubicación. Inténtalo de nuevo.'
        );
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  }

  /* Se pinta el cambio de inmediato y se guarda en segundo plano: en terreno la
   * conexión es mala y esperar al servidor por cada toque haría el formulario
   * inusable. Si falla, se revierte y se avisa. */
  async function marcar(item, estado) {
    const nuevo = item.estado === estado ? 'sin_evaluar' : estado;
    const antes = items;
    setItems(xs => xs.map(x => (x.id === item.id ? { ...x, estado: nuevo } : x)));

    const { error } = await supabase
      .from('control_items')
      .update({ estado: nuevo, evaluado_en: nuevo === 'sin_evaluar' ? null : new Date().toISOString() })
      .eq('id', item.id);

    if (error) {
      setItems(antes);
      setError('No se pudo guardar. Revisa la conexión.');
    }
  }

  async function guardarNota(item, nota) {
    setItems(xs => xs.map(x => (x.id === item.id ? { ...x, nota } : x)));
    await supabase.from('control_items').update({ nota }).eq('id', item.id);
  }

  async function enviar() {
    setEnviando(true);
    const { error } = await supabase
      .from('controles')
      .update({ estado: 'enviado', enviado_en: new Date().toISOString() })
      .eq('id', id);
    setEnviando(false);
    if (error) setError(error.message);
    else navegar('/');
  }

  if (error && !control) {
    return (
      <div className="cuerpo">
        <div className="aviso aviso-critico">{error}</div>
        <button className="boton boton-secundario boton-movil boton-ancho"
                style={{ marginTop: 14 }} onClick={() => navegar('/')}>
          Volver
        </button>
      </div>
    );
  }
  if (!control) return <p className="cargando">Cargando…</p>;

  const cerrado = control.estado === 'enviado' || control.estado === 'anulado';

  return (
    <div className="pantalla">
      <header className="encabezado">
        <div className="fila" style={{ marginBottom: 8 }}>
          <button className="boton boton-texto" style={{ padding: '4px 8px 4px 0' }}
                  onClick={() => navegar('/')} aria-label="Volver">
            ‹ Volver
          </button>
          <span className="crece" />
          {control.periodo && <span className="micro">{control.periodo}</span>}
        </div>

        <h1 className="h3">{control.comunidades?.nombre}</h1>
        <p className="chico apagado" style={{ margin: '3px 0 10px' }}>
          {[control.comunidades?.direccion, control.comunidades?.comuna].filter(Boolean).join(', ')}
        </p>

        {control.checkin_en ? (
          <p className="micro" style={{ color: 'var(--ok-texto)', margin: '0 0 10px' }}>
            Check-in {new Date(control.checkin_en).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}
            {control.checkin_precision != null && ` · precisión ${Math.round(control.checkin_precision)} m`}
          </p>
        ) : (
          <button className="boton boton-movil boton-ancho" style={{ marginBottom: 10 }}
                  onClick={hacerCheckIn} disabled={ubicando || cerrado}>
            {ubicando ? 'Obteniendo ubicación…' : 'Hacer check-in'}
          </button>
        )}

        {items.length > 0 && (
          <>
            <div className="fila" style={{ marginBottom: 5 }}>
              <span className="etiqueta-campo crece" style={{ margin: 0 }}>Avance del control</span>
              <span className="etiqueta-campo" style={{ margin: 0, color: 'var(--texto-titulo)' }}>
                {evaluados} de {items.length}
              </span>
            </div>
            <div className="barra"><div style={{ width: pct + '%' }} /></div>
          </>
        )}
      </header>

      <div className="cuerpo">
        {error && <div className="aviso aviso-critico" style={{ marginBottom: 12 }}>{error}</div>}

        {items.length === 0 && (
          <p className="vacio">Este control todavía no tiene ítems de checklist.</p>
        )}

        {grupos.map(([grupo, lista]) => (
          <section key={grupo} style={{ marginBottom: 20 }}>
            <div className="grupo-titulo">
              <span className="etiqueta-grupo">{grupo}</span>
            </div>

            {lista.map(item => (
              <article key={item.id} className="tarjeta" style={{ padding: 14, marginBottom: 10 }}>
                <p style={{ margin: '0 0 12px' }}>{item.texto}</p>

                <div className="selector">
                  {ESTADOS.map(([valor, etiqueta]) => (
                    <button
                      key={valor}
                      type="button"
                      className={valor}
                      aria-pressed={item.estado === valor}
                      disabled={cerrado}
                      onClick={() => marcar(item, valor)}
                    >
                      {etiqueta}
                    </button>
                  ))}
                </div>

                {/* La nota aparece solo cuando hay algo que explicar. Un
                    "cumple" no necesita justificación; una observación sí. */}
                {(item.estado === 'observacion' || item.estado === 'critico') && (
                  <div className="campo" style={{ marginTop: 12, marginBottom: 0 }}>
                    <label className="etiqueta-campo" htmlFor={'nota-' + item.id}>
                      Qué se observó
                    </label>
                    <textarea
                      id={'nota-' + item.id}
                      defaultValue={item.nota ?? ''}
                      placeholder="Describe el hallazgo y dónde está"
                      disabled={cerrado}
                      onBlur={e => guardarNota(item, e.target.value)}
                    />
                  </div>
                )}
              </article>
            ))}
          </section>
        ))}
      </div>

      {!cerrado && items.length > 0 && (
        <footer className="pie-fijo">
          <button className="boton boton-secundario boton-movil crece" onClick={() => navegar('/')}>
            Guardar borrador
          </button>
          <button className="boton boton-movil crece"
                  onClick={enviar}
                  disabled={enviando || faltantes > 0 || !control.checkin_en}
                  title={
                    !control.checkin_en ? 'Falta el check-in'
                    : faltantes > 0 ? `Faltan ${faltantes} ítems por evaluar`
                    : undefined
                  }>
            {enviando ? 'Enviando…' : faltantes > 0 ? `Faltan ${faltantes}` : 'Enviar control'}
          </button>
        </footer>
      )}
    </div>
  );
}
