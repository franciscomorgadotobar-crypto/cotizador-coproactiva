import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

/* Editor de una plantilla de levantamiento.
 *
 * Acá se define qué se pregunta, en qué orden y de qué forma se responde. Es lo
 * que hace que la app sirva para más de un tipo de recorrido sin tocar código:
 * un levantamiento de entrega, una revisión mensual y una auditoría preguntan
 * cosas distintas.
 *
 * El orden importa y no es decorativo: el recorrido de un edificio tiene una
 * secuencia —se entra por el acceso y se termina en la azotea— y el informe
 * sale en ese mismo orden.
 */

const TIPOS = [
  ['estado',    'Conforme / Observa / Crítico'],
  ['texto',     'Texto libre'],
  ['numero',    'Número o lectura'],
  ['escala',    'Escala del 1 al 10'],
  ['seleccion', 'Una opción de varias'],
  ['checklist', 'Varias opciones'],
  ['foto',      'Solo fotografía'],
  ['firma',     'Firma de quien recibe']
];

export default function EditorPlantilla() {
  const { id } = useParams();
  const navegar = useNavigate();

  const [plantilla, setPlantilla] = useState(null);
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [editando, setEditando] = useState(null);

  useEffect(() => {
    (async () => {
      const [p, i] = await Promise.all([
        supabase.from('plantillas_control').select('*').eq('id', id).maybeSingle(),
        supabase.from('plantilla_items').select('*').eq('plantilla_id', id)
          .order('orden_grupo').order('orden')
      ]);
      if (p.error) return setError(p.error.message);
      if (!p.data) return setError('Esta plantilla no existe o no tienes acceso.');
      setPlantilla(p.data);
      setItems(i.data ?? []);
    })();
  }, [id]);

  /* Las categorías salen de los ítems: `grupo` con su `orden_grupo`. No hay
   * tabla aparte porque una categoría sin ningún punto no significa nada. */
  const categorias = useMemo(() => {
    const m = new Map();
    for (const it of items) {
      if (!m.has(it.grupo)) m.set(it.grupo, { nombre: it.grupo, orden: it.orden_grupo, items: [] });
      m.get(it.grupo).items.push(it);
    }
    return [...m.values()].sort((a, b) => a.orden - b.orden);
  }, [items]);

  async function agregarCategoria() {
    const nombre = prompt('Nombre de la categoría');
    if (!nombre?.trim()) return;
    const orden = categorias.length ? Math.max(...categorias.map(c => c.orden)) + 1 : 0;
    await crearItem({ grupo: nombre.trim(), orden_grupo: orden, texto: 'Punto nuevo', orden: 0 });
  }

  async function renombrarCategoria(cat) {
    const nombre = prompt('Nuevo nombre de la categoría', cat.nombre);
    if (!nombre?.trim() || nombre === cat.nombre) return;
    setGuardando(true);
    const { error } = await supabase
      .from('plantilla_items')
      .update({ grupo: nombre.trim() })
      .eq('plantilla_id', id).eq('grupo', cat.nombre);
    setGuardando(false);
    if (error) return setError(error.message);
    setItems(xs => xs.map(x => (x.grupo === cat.nombre ? { ...x, grupo: nombre.trim() } : x)));
  }

  /* Mover una categoría intercambia su orden con la vecina y actualiza todos
   * sus ítems: el orden vive en cada fila porque es la plantilla la que se
   * consulta al armar el levantamiento. */
  async function moverCategoria(cat, direccion) {
    const i = categorias.findIndex(c => c.nombre === cat.nombre);
    const vecina = categorias[i + direccion];
    if (!vecina) return;

    setGuardando(true);
    const [a, b] = [cat.orden, vecina.orden];
    await Promise.all([
      supabase.from('plantilla_items').update({ orden_grupo: b })
        .eq('plantilla_id', id).eq('grupo', cat.nombre),
      supabase.from('plantilla_items').update({ orden_grupo: a })
        .eq('plantilla_id', id).eq('grupo', vecina.nombre)
    ]);
    setGuardando(false);
    setItems(xs => xs.map(x =>
      x.grupo === cat.nombre ? { ...x, orden_grupo: b }
      : x.grupo === vecina.nombre ? { ...x, orden_grupo: a }
      : x));
  }

  async function crearItem(datos) {
    setGuardando(true);
    const { data, error } = await supabase
      .from('plantilla_items')
      .insert({ plantilla_id: id, tipo_ingreso: 'estado', config: {}, ...datos })
      .select().single();
    setGuardando(false);
    if (error) return setError(error.message);
    setItems(xs => [...xs, data]);
    setEditando(data.id);
  }

  async function guardarItem(item, cambios) {
    const actualizado = { ...item, ...cambios };
    setItems(xs => xs.map(x => (x.id === item.id ? actualizado : x)));
    const { error } = await supabase.from('plantilla_items').update(cambios).eq('id', item.id);
    if (error) setError(error.message);
  }

  async function borrarItem(item) {
    if (!confirm(`¿Eliminar "${item.texto}"?`)) return;
    setItems(xs => xs.filter(x => x.id !== item.id));
    const { error } = await supabase.from('plantilla_items').delete().eq('id', item.id);
    if (error) setError(error.message);
  }

  if (error && !plantilla) {
    return (
      <div className="cuerpo">
        <div className="aviso aviso-critico">{error}</div>
        <button className="boton boton-secundario boton-movil boton-ancho"
                style={{ marginTop: 14 }} onClick={() => navegar('/plantillas')}>
          Volver
        </button>
      </div>
    );
  }
  if (!plantilla) return <p className="cargando">Cargando…</p>;

  return (
    <div className="pantalla">
      <header className="encabezado">
        <div className="fila" style={{ marginBottom: 8 }}>
          <button className="boton boton-texto" style={{ padding: '4px 8px 4px 0' }}
                  onClick={() => navegar('/plantillas')}>
            ‹ Plantillas
          </button>
          <span className="crece" />
          {guardando && <span className="micro apagado">Guardando…</span>}
        </div>
        <h1 className="h3">{plantilla.nombre}</h1>
        <p className="chico apagado" style={{ margin: '3px 0 0' }}>
          {items.length} puntos en {categorias.length} categorías
        </p>
      </header>

      <div className="cuerpo">
        {error && <div className="aviso aviso-critico" style={{ marginBottom: 12 }}>{error}</div>}

        {categorias.map((cat, i) => (
          <section key={cat.nombre} className="categoria">
            <div className="categoria-editable">
              <button type="button" className="crece nombre" onClick={() => renombrarCategoria(cat)}>
                {cat.nombre}
              </button>
              <button type="button" className="mover" aria-label="Subir categoría"
                      disabled={i === 0} onClick={() => moverCategoria(cat, -1)}>↑</button>
              <button type="button" className="mover" aria-label="Bajar categoría"
                      disabled={i === categorias.length - 1} onClick={() => moverCategoria(cat, 1)}>↓</button>
            </div>

            {cat.items.map(item => (
              <ItemPlantilla
                key={item.id}
                item={item}
                abierto={editando === item.id}
                onAbrir={() => setEditando(editando === item.id ? null : item.id)}
                onGuardar={cambios => guardarItem(item, cambios)}
                onBorrar={() => borrarItem(item)}
              />
            ))}

            <button type="button" className="boton boton-texto agregar-punto"
                    onClick={() => crearItem({
                      grupo: cat.nombre,
                      orden_grupo: cat.orden,
                      texto: 'Punto nuevo',
                      orden: cat.items.length
                    })}>
              + Agregar punto a {cat.nombre}
            </button>
          </section>
        ))}

        <button className="boton boton-secundario boton-movil boton-ancho"
                style={{ marginTop: 12 }} onClick={agregarCategoria}>
          Nueva categoría
        </button>
      </div>
    </div>
  );
}

/* Un punto de la plantilla: qué se pregunta y cómo se responde. */
function ItemPlantilla({ item, abierto, onAbrir, onGuardar, onBorrar }) {
  const cfg = item.config ?? {};
  const etiquetaTipo = TIPOS.find(([v]) => v === item.tipo_ingreso)?.[1] ?? item.tipo_ingreso;

  function cambiarConfig(clave, valor) {
    onGuardar({ config: { ...cfg, [clave]: valor } });
  }

  /* Las opciones se escriben una por línea. Es la forma más rápida de teclear
   * una lista en un teléfono; un editor con botón de "agregar" por cada opción
   * cuesta el triple de toques. */
  function cambiarOpciones(texto) {
    cambiarConfig('opciones', texto.split('\n').map(s => s.trim()).filter(Boolean));
  }

  return (
    <article className={'tarjeta item-plantilla' + (abierto ? ' abierto' : '')}>
      <button type="button" className="cabecera" onClick={onAbrir} aria-expanded={abierto}>
        <span className="crece">
          {item.texto}
          <span className="tipo">{etiquetaTipo}</span>
        </span>
        <span className="flecha" aria-hidden="true">{abierto ? '−' : '+'}</span>
      </button>

      {abierto && (
        <div className="detalle">
          <div className="campo">
            <label className="etiqueta-campo">Qué se pregunta</label>
            <input type="text" defaultValue={item.texto}
                   onBlur={e => onGuardar({ texto: e.target.value })} />
          </div>

          <div className="campo">
            <label className="etiqueta-campo">Cómo se responde</label>
            <select value={item.tipo_ingreso}
                    onChange={e => onGuardar({ tipo_ingreso: e.target.value, config: {} })}>
              {TIPOS.map(([valor, etiqueta]) => (
                <option key={valor} value={valor}>{etiqueta}</option>
              ))}
            </select>
          </div>

          {/* Parámetros propios del tipo elegido */}
          {(item.tipo_ingreso === 'seleccion' || item.tipo_ingreso === 'checklist') && (
            <div className="campo">
              <label className="etiqueta-campo">Opciones, una por línea</label>
              <textarea rows={4} defaultValue={(cfg.opciones ?? []).join('\n')}
                        placeholder={'Bueno\nRegular\nMalo'}
                        onBlur={e => cambiarOpciones(e.target.value)} />
            </div>
          )}

          {item.tipo_ingreso === 'escala' && (
            <div className="fila" style={{ gap: 8 }}>
              <div className="campo crece">
                <label className="etiqueta-campo">Desde</label>
                <input type="number" defaultValue={cfg.min ?? 1}
                       onBlur={e => cambiarConfig('min', Number(e.target.value))} />
              </div>
              <div className="campo crece">
                <label className="etiqueta-campo">Hasta</label>
                <input type="number" defaultValue={cfg.max ?? 10}
                       onBlur={e => cambiarConfig('max', Number(e.target.value))} />
              </div>
            </div>
          )}

          {item.tipo_ingreso === 'numero' && (
            <div className="campo">
              <label className="etiqueta-campo">Unidad</label>
              <input type="text" defaultValue={cfg.unidad ?? ''} placeholder="m³, bar, °C"
                     onBlur={e => cambiarConfig('unidad', e.target.value)} />
            </div>
          )}

          {item.tipo_ingreso === 'texto' && (
            <div className="campo">
              <label className="etiqueta-campo">Texto de ayuda</label>
              <input type="text" defaultValue={cfg.ejemplo ?? ''}
                     placeholder="Marca, modelo y año"
                     onBlur={e => cambiarConfig('ejemplo', e.target.value)} />
            </div>
          )}

          {/* La foto se puede pedir en cualquier tipo de punto, no solo en los
              de tipo "foto": una lectura de medidor también quiere su respaldo. */}
          <div className="campo">
            <label className="etiqueta-campo">Fotografías</label>
            <select defaultValue={cfg.origen ?? 'ambas'}
                    onChange={e => cambiarConfig('origen', e.target.value)}>
              <option value="ambas">Cámara o galería</option>
              <option value="camara">Solo cámara, en el momento</option>
              <option value="galeria">Solo galería</option>
            </select>
          </div>

          <label className="marca">
            <input type="checkbox" defaultChecked={item.requiere_foto}
                   onChange={e => onGuardar({ requiere_foto: e.target.checked })} />
            <span>Exigir al menos una foto</span>
          </label>

          <label className="marca">
            <input type="checkbox" defaultChecked={item.es_critico}
                   onChange={e => onGuardar({ es_critico: e.target.checked })} />
            <span>Es un punto crítico</span>
          </label>

          <button type="button" className="boton boton-texto peligro"
                  style={{ marginTop: 10 }} onClick={onBorrar}>
            Eliminar este punto
          </button>
        </div>
      )}
    </article>
  );
}
