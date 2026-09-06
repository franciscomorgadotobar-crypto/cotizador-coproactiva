import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useSesion } from '../../lib/sesion';
import { AvisoConexion } from '../../lib/estado';
import CampoPunto from '../../componentes/CampoPunto';
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
  const [pausas, setPausas] = useState([]);

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

      const [rc, ri, rp] = await Promise.all([
        supabase
          .from('controles')
          .select('id, comunidad_id, estado, periodo, checkin_en, checkin_precision, creado_en, comunidades(nombre, direccion, comuna)')
          .eq('id', id)
          .maybeSingle(),
        supabase
          .from('control_items')
          .select('id, grupo, texto, orden, estado, nota, respuesta, tipo_ingreso, config, plantilla_item_id')
          .eq('control_id', id)
          .order('orden'),
        supabase
          .from('control_pausas')
          .select('*')
          .eq('control_id', id)
          .order('pausado_en', { ascending: false })
      ]);
      if (!vigente) return;
      if (rp.data) setPausas(rp.data);

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
  const fotosDe = itemId => fotos
    .filter(f => f.control_item_id === itemId && f.clase !== 'firma')
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

  // ----------------------------------------------------------- Pausar

  /* Pausar deja el levantamiento donde está y registra por qué. Lo evaluado no
   * se toca: al volver, el recorrido sigue desde donde iba. El motivo no es
   * burocracia — tres levantamientos pausados porque nadie tenía la llave del
   * subterráneo son un hallazgo de la administración. */
  async function pausar(motivo) {
    const pos = await posicionActual();
    const fila = {
      id: nuevoId(),
      control_id: id,
      pausado_en: new Date().toISOString(),
      pausado_por: perfil?.id ?? null,
      motivo: motivo?.trim() || null,
      lat: pos?.lat ?? null,
      lng: pos?.lng ?? null,
      reanudado_en: null
    };

    const actualizado = { ...control, estado: 'pausado' };
    setControl(actualizado);
    setPausas(xs => [fila, ...xs]);
    await guardarControl(actualizado);
    await encolar({ tipo: 'pausa', fila });
    await encolar({ tipo: 'control', id, cambios: { estado: 'pausado' } });
    sincronizar();
    navegar('/');
  }

  async function reanudar() {
    const abiertaAhora = pausas.find(p => !p.reanudado_en);
    const actualizado = { ...control, estado: 'en_curso' };
    setControl(actualizado);
    await guardarControl(actualizado);

    if (abiertaAhora) {
      const cerrada = { ...abiertaAhora, reanudado_en: new Date().toISOString() };
      setPausas(xs => xs.map(p => (p.id === cerrada.id ? cerrada : p)));
      await encolar({ tipo: 'pausa', fila: cerrada });
    }
    await encolar({ tipo: 'control', id, cambios: { estado: 'en_curso' } });
    sincronizar();
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

  /* Las respuestas de los demás tipos viajan por el mismo camino que el estado:
   * al teléfono primero, a la cola después. La firma trae además un blob, que
   * se guarda como adjunto de clase 'firma'. */
  async function guardarRespuesta(item, respuesta) {
    if (respuesta?.blob) {
      const { blob, ...resto } = respuesta;
      const firma = {
        id: nuevoId(),
        control_id: id,
        control_item_id: item.id,
        comunidad_id: control.comunidad_id,
        clase: 'firma',
        blob,
        firmante_nombre: resto.firmante_nombre ?? null,
        firmante_rut: resto.firmante_rut ?? null,
        tomada_en: new Date().toISOString(),
        orden: 0,
        subida_por: perfil?.id ?? null,
        pendiente: 1
      };
      await guardarFoto(firma);
      setFotos(xs => [...xs.filter(f => !(f.control_item_id === item.id && f.clase === 'firma')), firma]);
      await encolar({ tipo: 'foto', id: firma.id, control_id: id });
      respuesta = resto;
    }

    const actualizado = { ...item, respuesta, pendiente: true };
    setItems(xs => xs.map(x => (x.id === item.id ? actualizado : x)));
    await guardarItem(actualizado);
    await encolar({ tipo: 'item', id: item.id, cambios: { respuesta } });
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
          tipo_ingreso: i.tipo_ingreso,
          config: i.config,
          respuesta: i.respuesta,
          fotos: fotosDe(i.id).map(f => ({
            url: URL.createObjectURL(f.blob),
            descripcion: f.descripcion
          }))
        }))
      })),
      pausas: pausas.map(p => ({
        pausado_en: p.pausado_en,
        reanudado_en: p.reanudado_en,
        motivo: p.motivo
      })),
      firmas: fotos
        .filter(f => f.clase === 'firma')
        .map(f => ({
          url: URL.createObjectURL(f.blob),
          nombre: f.firmante_nombre,
          rut: f.firmante_rut
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

        {control.estado === 'pausado' && (
          <div className="aviso" style={{ marginBottom: 10 }}>
            <p style={{ margin: 0 }}>
              Levantamiento en pausa
              {pausas[0]?.motivo ? `: ${pausas[0].motivo}` : '.'}
            </p>
            <button className="boton boton-texto" style={{ padding: '6px 0 0' }}
                    onClick={reanudar}>
              Reanudar
            </button>
          </div>
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
                  onRespuesta={guardarRespuesta}
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
          <button className="boton boton-secundario boton-movil crece"
                  onClick={() => {
                    const motivo = prompt(
                      'Motivo de la pausa (opcional)\n\nPor ejemplo: sin acceso a sala de máquinas, ' +
                      'fin de turno, conserje no disponible.'
                    );
                    // Cancelar el diálogo no pausa; dejarlo vacío sí.
                    if (motivo !== null) pausar(motivo);
                  }}>
            Pausar
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
function Punto({ item, fotos, cerrado, onMarcar, onNota, onRespuesta, onFotos, onDescribir, onQuitar }) {
  const entrada = useRef(null);
  const necesitaNota = item.estado === 'observacion' || item.estado === 'critico';

  return (
    <article className="tarjeta punto">
      <p style={{ margin: '0 0 12px' }}>{item.texto}</p>

      <CampoPunto
        item={item}
        cerrado={cerrado}
        onEstado={valor => onMarcar(item, valor)}
        onRespuesta={respuesta => onRespuesta(item, respuesta)}
      />

      {/* La nota aparece solo cuando hay algo que explicar: un "conforme" no
          necesita justificación, una observación sí. */}
      {item.tipo_ingreso === 'estado' && necesitaNota && (
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
            <input ref={entrada} type="file" accept="image/*"
                   {...(item.config?.origen === 'galeria' ? {} : { capture: 'environment' })}
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
