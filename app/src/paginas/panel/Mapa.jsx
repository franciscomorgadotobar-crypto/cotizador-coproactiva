import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { supabase } from '../../lib/supabase';

/* Mapa de lo hecho en terreno.
 *
 * Responde una pregunta que ninguna lista contesta bien: dónde estuvo el equipo
 * y qué encontró. Un check-in es una coordenada con hora y precisión; puesto en
 * el mapa se ve de inmediato si alguien pasó por los seis edificios del día o
 * si dos quedaron sin visitar.
 *
 * Los mapas son de OpenStreetMap: no necesitan clave ni tarjeta. A cambio, esta
 * pantalla sí necesita señal —las baldosas se descargan— y por eso es de
 * oficina, no de terreno.
 */

const RANGOS = [
  ['hoy', 'Hoy', 0],
  ['semana', '7 días', 7],
  ['mes', '30 días', 30],
  ['todo', 'Todo', null]
];

// El color dice el estado del levantamiento sin tener que abrirlo.
const COLORES = {
  enviado:   '#38603f',
  en_curso:  '#d5863b',
  pausado:   '#4a5a68',
  pendiente: '#8a8a8a',
  anulado:   '#a4402f'
};

function marcador(color, critico) {
  /* Se dibuja el pin en SVG en vez de usar una imagen: así el color sale de los
   * tokens de marca y no hay que mantener cinco archivos png. */
  return L.divIcon({
    className: 'pin-vacio',
    html: `<svg width="26" height="34" viewBox="0 0 26 34" xmlns="http://www.w3.org/2000/svg">
             <path d="M13 0C5.8 0 0 5.8 0 13c0 9.7 13 21 13 21s13-11.3 13-21C26 5.8 20.2 0 13 0z"
                   fill="${color}" stroke="#fff" stroke-width="1.5"/>
             <circle cx="13" cy="13" r="5" fill="#fff" opacity="${critico ? 1 : 0.85}"/>
             ${critico ? '<circle cx="13" cy="13" r="2.6" fill="#a4402f"/>' : ''}
           </svg>`,
    iconSize: [26, 34],
    iconAnchor: [13, 34],
    popupAnchor: [0, -30]
  });
}

export default function Mapa() {
  const navegar = useNavigate();
  const contenedor = useRef(null);
  const mapa = useRef(null);
  const capa = useRef(null);

  const [controles, setControles] = useState(null);
  const [rango, setRango] = useState('mes');
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');
  const [error, setError] = useState(null);
  const [elegido, setElegido] = useState(null);

  useEffect(() => {
    supabase
      .from('controles_con_avance')
      .select('id, estado, periodo, checkin_en, checkin_lat, checkin_lng, checkin_precision, enviado_en, programado_para, items_evaluados, items_totales, items_criticos, fotos, destino_nombre, destino_direccion, destino_comuna, destino_tipo')
      .not('checkin_lat', 'is', null)
      .order('checkin_en', { ascending: false })
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setControles(data ?? []);
      });
  }, []);

  /* El rango filtra por el check-in, que es cuando se estuvo en el lugar. Usar
   * la fecha de creación mostraría el día en que se programó la visita, que no
   * es lo que se está preguntando. */
  const visibles = useMemo(() => {
    if (!controles) return [];
    const opcion = RANGOS.find(r => r[0] === rango);

    if (rango === 'personalizado') {
      const a = desde ? new Date(desde + 'T00:00:00').getTime() : -Infinity;
      const b = hasta ? new Date(hasta + 'T23:59:59').getTime() : Infinity;
      return controles.filter(c => {
        const t = new Date(c.checkin_en).getTime();
        return t >= a && t <= b;
      });
    }

    if (opcion?.[2] == null) return controles;

    const limite = opcion[2] === 0
      ? new Date(new Date().setHours(0, 0, 0, 0)).getTime()
      : Date.now() - opcion[2] * 24 * 60 * 60 * 1000;
    return controles.filter(c => new Date(c.checkin_en).getTime() >= limite);
  }, [controles, rango, desde, hasta]);

  // Montaje del mapa, una sola vez.
  useEffect(() => {
    if (mapa.current || !contenedor.current) return;

    mapa.current = L.map(contenedor.current, { zoomControl: false })
      .setView([-33.45, -70.66], 11);   // Santiago, hasta que haya puntos

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
      maxZoom: 19
    }).addTo(mapa.current);

    L.control.zoom({ position: 'bottomright' }).addTo(mapa.current);
    capa.current = L.layerGroup().addTo(mapa.current);

    return () => { mapa.current?.remove(); mapa.current = null; };
  }, []);

  // Los marcadores se rehacen cuando cambia el filtro.
  useEffect(() => {
    if (!mapa.current || !capa.current) return;
    capa.current.clearLayers();
    if (!visibles.length) return;

    const puntos = [];
    for (const c of visibles) {
      const lat = Number(c.checkin_lat);
      const lng = Number(c.checkin_lng);
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;
      puntos.push([lat, lng]);

      const pin = L.marker([lat, lng], {
        icon: marcador(COLORES[c.estado] ?? COLORES.pendiente, c.items_criticos > 0)
      }).addTo(capa.current);

      pin.bindPopup(`
        <strong>${c.destino_nombre ?? 'Sin nombre'}</strong><br>
        ${new Date(c.checkin_en).toLocaleString('es-CL', { dateStyle: 'medium', timeStyle: 'short' })}<br>
        ${c.items_evaluados} de ${c.items_totales} puntos
        ${c.items_criticos ? ` · ${c.items_criticos} crítico${c.items_criticos > 1 ? 's' : ''}` : ''}
      `);
      pin.on('click', () => setElegido(c.id));

      /* La precisión del GPS se dibuja como un círculo. Un check-in con 300
       * metros de margen no prueba presencia en un edificio concreto, y verlo
       * es más honesto que mostrar un pin exacto que no lo es. */
      if (c.checkin_precision > 40) {
        L.circle([lat, lng], {
          radius: Number(c.checkin_precision),
          color: '#4a5a68', weight: 1, opacity: 0.35,
          fillColor: '#4a5a68', fillOpacity: 0.08
        }).addTo(capa.current);
      }
    }

    if (puntos.length === 1) mapa.current.setView(puntos[0], 16);
    else if (puntos.length > 1) mapa.current.fitBounds(puntos, { padding: [40, 40] });
  }, [visibles]);

  const resumen = useMemo(() => ({
    visitas: visibles.length,
    comunidades: new Set(visibles.map(c => c.destino_nombre)).size,
    criticos: visibles.reduce((n, c) => n + (c.items_criticos ?? 0), 0),
    fotos: visibles.reduce((n, c) => n + (c.fotos ?? 0), 0)
  }), [visibles]);

  return (
    <div className="pantalla pantalla-mapa">
      <header className="encabezado">
        <div className="fila" style={{ marginBottom: 8 }}>
          <button className="boton boton-texto" style={{ padding: '4px 8px 4px 0' }}
                  onClick={() => navegar('/')}>
            ‹ Inicio
          </button>
          <span className="crece" />
          <span className="micro">{visibles.length} visitas</span>
        </div>

        <div className="filtros-rango">
          {RANGOS.map(([valor, etiqueta]) => (
            <button key={valor} type="button"
                    className={rango === valor ? 'activo' : ''}
                    onClick={() => setRango(valor)}>
              {etiqueta}
            </button>
          ))}
          <button type="button" className={rango === 'personalizado' ? 'activo' : ''}
                  onClick={() => setRango('personalizado')}>
            Rango
          </button>
        </div>

        {rango === 'personalizado' && (
          <div className="fila" style={{ gap: 8, marginTop: 8 }}>
            <div className="campo crece" style={{ marginBottom: 0 }}>
              <label className="etiqueta-campo" htmlFor="desde">Desde</label>
              <input id="desde" type="date" value={desde} onChange={e => setDesde(e.target.value)} />
            </div>
            <div className="campo crece" style={{ marginBottom: 0 }}>
              <label className="etiqueta-campo" htmlFor="hasta">Hasta</label>
              <input id="hasta" type="date" value={hasta} onChange={e => setHasta(e.target.value)} />
            </div>
          </div>
        )}
      </header>

      {error && <div className="aviso aviso-critico" style={{ margin: 12 }}>{error}</div>}

      <div ref={contenedor} className="lienzo-mapa" />

      <div className="panel-mapa">
        <div className="tablero" style={{ marginBottom: 12 }}>
          <div><p className="n">{resumen.visitas}</p><p className="r">Visitas</p></div>
          <div><p className="n">{resumen.comunidades}</p><p className="r">Lugares</p></div>
          <div className={resumen.criticos ? 'critico' : ''}>
            <p className="n">{resumen.criticos}</p><p className="r">Críticos</p>
          </div>
          <div><p className="n">{resumen.fotos}</p><p className="r">Fotos</p></div>
        </div>

        {controles === null && !error && <p className="cargando">Cargando…</p>}
        {controles && visibles.length === 0 && (
          <p className="vacio">No hay check-in registrados en este periodo.</p>
        )}

        {visibles.map(c => (
          <Link key={c.id} to={`/control/${c.id}`}
                className={'visita' + (elegido === c.id ? ' elegida' : '')}>
            <span className="punto-estado"
                  style={{ background: COLORES[c.estado] ?? COLORES.pendiente }} />
            <span className="crece">
              <span className="nombre">{c.destino_nombre}</span>
              <span className="detalle">
                {new Date(c.checkin_en).toLocaleString('es-CL', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                {' · '}{c.items_evaluados} de {c.items_totales}
                {c.checkin_precision > 40 && ` · precisión ${Math.round(c.checkin_precision)} m`}
              </span>
            </span>
            {c.items_criticos > 0 && (
              <span className="chip chip-critico">{c.items_criticos}</span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
