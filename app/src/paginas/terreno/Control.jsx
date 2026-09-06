import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useSesion } from '../../lib/sesion';
import { AvisoConexion } from '../../lib/estado';
import { informeHtml, imprimirInforme } from '../../lib/informe';
import { comprimir, hayConexion, sincronizar } from '../../lib/sincronizacion';
import {
  nuevoId, leerControl, guardarControl, leerItems, fusionarItems, guardarItem,
  leerFotosDeControl, guardarFoto, borrarFoto, encolar
} from '../../lib/local';

const ESTADOS = [
  ['cumple', 'Conforme'],
  ['observacion', 'Observa'],
  ['critico', 'Crítico']
];

export default function Levantamiento() {
  const { id } = useParams();
  const navegar = useNavigate();
  const { perfil } = useSesion();

  const [control, setControl] = useState(null);
  const [items, setItems] = useState([]);
  const [fotos, setFotos] = useState([]);
  const [error, setError] = useState(null);
  const [ubicando, setUbicando] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [abierta, setAbierta] = useState(null);   // categoría desplegada

  /* Primero el teléfono, después el servidor. Al revés, entrar a un
   * levantamiento en un subterráneo mostraría una pantalla vacía mientras la
   * petición agoniza contra una red que no está. */
  useEffect(() => {
    let vigente = true;

    (async () => {
      const [c, i, f] = await Promise.all([
        leerControl(id), leerItems(id), leerFotosDeControl(id)
      ]);
      if (!vigente) return;
      if (c) setControl(c);
      if (i.length) setItems(i.sort(orden));
      setFotos(f);

      if (!hayConexion()) {
        if (!c) setError('Este levantamiento no está descargado y no hay señal.');
        return;
      }

      const [rc, ri] = await Promise.all([
        supabase
          .from('controles')
          .select('id, comunidad_id, estado, periodo, checkin_en, checkin_precision, creado_en, comunidades(nombre, direccion, comuna)')
          .eq('id', id)
          .maybeSingle(),
        supabase
          .from('control_items')
          .select('id, grupo, texto, orden, estado, nota, plantilla_item_id')
          .eq('control_id', id)
          .order('orden')
      ]);
      if (!vigente) return;

      if (rc.error) { if (!c) setError(rc.error.message); return; }
      if (!rc.data) { if (!c) setError('Este levantamiento no existe o no tienes acceso.'); return; }

      setControl(rc.data);
      await guardarControl(rc.data);

      if (ri.data) {
        await fusionarItems(id, ri.data);
        const frescos = await leerItems(id);
        if (vigente) setItems(frescos.sort(orden));
      }
    })().catch(e => vigente && setError(e.message));

    return () => { vigente = false; };
  }, [id]);

  const orden = (a, b) => (a.orden ?? 0) - (b.orden ?? 0);

  /* El recorrido tiene una secuencia —se entra por el acceso y se termina en la
   * azotea— y el orden de las categorías la refleja. */
  const categorias = useMemo(() => {
    const m = new Map();
    for (const it of items) {
      if (!m.has(it.grupo)) m.set(it.grupo, []);
      m.get(it.grupo).push(it);
    }
    return [...m.entries()].map(([nombre, lista]) => ({
      nombre,
      items: lista,
      evaluados: lista.filter(i => i.estado !== 'sin_evaluar').length,
      criticos: lista.filter(i => i.estado === 'critico').length
    }));
  }, [items]);

  const evaluados = items.filter(i => i.estado !== 'sin_evaluar').length;
  const pct = items.length ? Math.round((evaluados / items.length) * 100) : 0;
  const faltantes = items.length - evaluados;
  const fotosDe = itemId => fotos.filter(f => f.control_item_id === itemId)
                                 .sort((a, b) => a.orden - b.orden);

  // ------------------------------------------------------------- Check-in

  function hacerCheckIn() {
    if (!navigator.geolocation) {
      setError('Este teléfono no permite obtener la ubicación.');
      return;
    }
    setUbicando(true);
    navigator.geolocation.getCurrentPosition(
      async pos => {
        const { latitude, longitude, accuracy } = pos.coords;
        const cambios = {
          estado: 'en_curso',
          checkin_en: new Date().toISOString(),
          checkin_lat: latitude,
          checkin_lng: longitude,
          checkin_precision: accuracy
        };
        const actualizado = { ...control, ...cambios };
        setControl(actualizado);
        setUbicando(false);
        await guardarControl(actualizado);
        await encolar({ tipo: 'control', id, cambios });
        sincronizar();
      },
      err => {
        setUbicando(false);
        setError(
          err.code === err.PERMISSION_DENIED
            ? 'Falta permiso de ubicación. Actívalo para poder registrar el check-in.'
            : 'No se pudo obtener la ubicación. Inténtalo de nuevo.'
        );
      },
      // El GPS bajo losa demora. 25 segundos da margen sin que la espera se
      // vuelva eterna; una posición de red imprecisa sirve más que ninguna.
      { enableHighAccuracy: true, timeout: 25000, maximumAge: 0 }
    );
  }

  // ----------------------------------------------------- Evaluar y anotar

  async function marcar(item, estado) {
    const nuevo = item.estado === estado ? 'sin_evaluar' : estado;
    const cambios = {
      estado: nuevo,
      evaluado_en: nuevo === 'sin_evaluar' ? null : new Date().toISOString()
    };
    const actualizado = { ...item, ...cambios, pendiente: true };

    setItems(xs => xs.map(x => (x.id === item.id ? actualizado : x)));
    await guardarItem(actualizado);
    await encolar({ tipo: 'item', id: item.id, cambios });
    sincronizar();
  }

  async function guardarNota(item, nota) {
    const actualizado = { ...item, nota, pendiente: true };
    setItems(xs => xs.map(x => (x.id === item.id ? actualizado : x)));
    await guardarItem(actualizado);
    await encolar({ tipo: 'item', id: item.id, cambios: { nota } });
    sincronizar();
  }

  // ---------------------------------------------------------------- Fotos

  async function agregarFotos(item, archivos) {
    const yaHay = fotosDe(item.id).length;
    const pos = await posicionActual();

    for (const [n, archivo] of [...archivos].entries()) {
      try {
        const { blob } = await comprimir(archivo);
        const foto = {
          id: nuevoId(),
          control_id: id,
          control_item_id: item.id,
          comunidad_id: control.comunidad_id,
          blob,
          nombre_original: archivo.name,
          lat: pos?.lat ?? null,
          lng: pos?.lng ?? null,
          // La hora de captura la pone el teléfono: los metadatos EXIF se
          // pierden al recomprimir, así que el dato se guarda aparte.
          tomada_en: new Date().toISOString(),
          descripcion: '',
          orden: yaHay + n,
          subida_por: perfil?.id ?? null,
          pendiente: 1
        };
        await guardarFoto(foto);
        setFotos(xs => [...xs, foto]);
        await encolar({ tipo: 'foto', id: foto.id, control_id: id });
      } catch (e) {
        setError('No se pudo procesar una de las fotos: ' + e.message);
      }
    }
    sincronizar();
  }

  async function describirFoto(foto, descripcion) {
    const actualizada = { ...foto, descripcion, pendiente: 1 };
    setFotos(xs => xs.map(f => (f.id === foto.id ? actualizada : f)));
    await guardarFoto(actualizada);
    await encolar({ tipo: 'foto', id: foto.id, control_id: id });
  }

  async function quitarFoto(foto) {
    setFotos(xs => xs.filter(f => f.id !== foto.id));
    await borrarFoto(foto.id);
    // Solo se borra localmente: una foto ya subida es evidencia y su
    // eliminación en el servidor la decide administración.
  }

  function posicionActual() {
    if (!navigator.geolocation) return Promise.resolve(null);
    return new Promise(resolver => {
      navigator.geolocation.getCurrentPosition(
        p => resolver({ lat: p.coords.latitude, lng: p.coords.longitude }),
        () => resolver(null),
        { enableHighAccuracy: false, timeout: 4000, maximumAge: 60000 }
      );
    });
  }

  // -------------------------------------------------------------- Informe

  function verInforme() {
    const html = informeHtml({
      comunidad: control.comunidades ?? { nombre: 'Comunidad' },
      control: { ...control, responsable: perfil?.nombre },
      logo: import.meta.env.BASE_URL + 'logo-coproactiva.svg',
      categorias: categorias.map(c => ({
        nombre: c.nombre,
        items: c.items.map(i => ({
          texto: i.texto,
          estado: i.estado,
          nota: i.nota,
          fotos: fotosDe(i.id).map(f => ({
            url: URL.createObjectURL(f.blob),
            descripcion: f.descripcion
          }))
        }))
      }))
    });
    if (!imprimirInforme(html)) {
      setError('El navegador bloqueó la ventana del informe. Permite las ventanas emergentes para este sitio.');
    }
  }

  async function enviar() {
    setEnviando(true);
    const cambios = { estado: 'enviado', enviado_en: new Date().toISOString() };
    const actualizado = { ...control, ...cambios };
    await guardarControl(actualizado);
    await encolar({ tipo: 'control', id, cambios });
    await sincronizar();
    setEnviando(false);
    navegar('/');
  }

  // --------------------------------------------------------------- Vistas

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
      <AvisoConexion />

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
              <span className="etiqueta-campo crece" style={{ margin: 0 }}>Avance</span>
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
          <p className="vacio">Este levantamiento todavía no tiene puntos que revisar.</p>
        )}

        {/* Categorías plegadas: con veinte o treinta puntos, una lista corrida
            obliga a desplazarse a ciegas buscando dónde se quedó uno. */}
        {categorias.map(cat => {
          const desplegada = abierta === cat.nombre;
          return (
            <section key={cat.nombre} className="categoria">
              <button
                type="button"
                className={'categoria-titulo' + (desplegada ? ' abierta' : '')}
                aria-expanded={desplegada}
                onClick={() => setAbierta(desplegada ? null : cat.nombre)}
              >
                <span className="crece">{cat.nombre}</span>
                {cat.criticos > 0 && <span className="punto-critico" aria-label="Tiene críticos" />}
                <span className="micro">{cat.evaluados}/{cat.items.length}</span>
                <span className="flecha" aria-hidden="true">{desplegada ? '−' : '+'}</span>
              </button>

              {desplegada && cat.items.map(item => (
                <Punto
                  key={item.id}
                  item={item}
                  fotos={fotosDe(item.id)}
                  cerrado={cerrado}
                  onMarcar={marcar}
                  onNota={guardarNota}
                  onFotos={agregarFotos}
                  onDescribir={describirFoto}
                  onQuitar={quitarFoto}
                />
              ))}
            </section>
          );
        })}

        {items.length > 0 && (
          <button className="boton boton-secundario boton-movil boton-ancho"
                  style={{ marginTop: 8 }} onClick={verInforme}>
            Ver informe / Guardar PDF
          </button>
        )}
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
                    : faltantes > 0 ? `Faltan ${faltantes} puntos por evaluar`
                    : undefined
                  }>
            {enviando ? 'Enviando…' : faltantes > 0 ? `Faltan ${faltantes}` : 'Enviar levantamiento'}
          </button>
        </footer>
      )}
    </div>
  );
}

/* Un punto del levantamiento: estado, nota y fotos. */
function Punto({ item, fotos, cerrado, onMarcar, onNota, onFotos, onDescribir, onQuitar }) {
  const entrada = useRef(null);
  const necesitaNota = item.estado === 'observacion' || item.estado === 'critico';

  return (
    <article className="tarjeta punto">
      <p style={{ margin: '0 0 12px' }}>{item.texto}</p>

      <div className="selector">
        {ESTADOS.map(([valor, etiqueta]) => (
          <button key={valor} type="button" className={valor}
                  aria-pressed={item.estado === valor} disabled={cerrado}
                  onClick={() => onMarcar(item, valor)}>
            {etiqueta}
          </button>
        ))}
      </div>

      {/* La nota aparece solo cuando hay algo que explicar: un "conforme" no
          necesita justificación, una observación sí. */}
      {necesitaNota && (
        <div className="campo" style={{ marginTop: 12, marginBottom: 0 }}>
          <label className="etiqueta-campo" htmlFor={'nota-' + item.id}>Qué se observó</label>
          <textarea id={'nota-' + item.id} defaultValue={item.nota ?? ''}
                    placeholder="Describe el hallazgo y dónde está" disabled={cerrado}
                    onBlur={e => onNota(item, e.target.value)} />
        </div>
      )}

      <div className="fotos-punto">
        {fotos.map(f => (
          <figure key={f.id}>
            <img src={URL.createObjectURL(f.blob)} alt={f.descripcion || 'Fotografía'} />
            {!f.pendiente && <span className="subida" title="Subida" />}
            <input
              type="text" defaultValue={f.descripcion ?? ''} placeholder="Pie de foto"
              disabled={cerrado} onBlur={e => onDescribir(f, e.target.value)}
            />
            {!cerrado && (
              <button type="button" className="quitar" aria-label="Quitar foto"
                      onClick={() => onQuitar(f)}>×</button>
            )}
          </figure>
        ))}

        {!cerrado && (
          <>
            {/* `capture` abre la cámara directo en el teléfono en vez del
                selector de archivos; `multiple` deja adjuntar varias del rollo
                cuando ya se fotografió antes de abrir la app. */}
            <input ref={entrada} type="file" accept="image/*" capture="environment"
                   multiple hidden
                   onChange={e => { onFotos(item, e.target.files); e.target.value = ''; }} />
            <button type="button" className="agregar-foto" onClick={() => entrada.current?.click()}>
              <span aria-hidden="true">＋</span>
              Foto
            </button>
          </>
        )}
      </div>
    </article>
  );
}
