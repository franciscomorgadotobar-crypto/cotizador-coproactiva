import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function MapaPortalCliente({ comunidades = [] }) {
  const contenedor = useRef(null);
  const mapa = useRef(null);

  useEffect(() => {
    if (!contenedor.current || mapa.current) return;

    const m = L.map(contenedor.current, { scrollWheelZoom: false });
    mapa.current = m;
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap'
    }).addTo(m);

    const puntos = comunidades
      .filter(c => Number.isFinite(Number(c.latitud)) && Number.isFinite(Number(c.longitud)))
      .map(c => {
        const latlng = [Number(c.latitud), Number(c.longitud)];
        const marcador = L.circleMarker(latlng, { radius: 8, weight: 2, fillOpacity: 0.75 }).addTo(m);
        marcador.bindPopup(`<strong>${escapar(c.nombre)}</strong>${c.direccion ? `<br>${escapar(c.direccion)}` : ''}`);
        return latlng;
      });

    if (puntos.length === 1) m.setView(puntos[0], 16);
    else if (puntos.length > 1) m.fitBounds(puntos, { padding: [24, 24] });
    else m.setView([-33.45, -70.67], 10);

    return () => {
      m.remove();
      mapa.current = null;
    };
  }, []);

  useEffect(() => {
    // La lista de comunidades es estable durante una carga del dashboard. Si
    // cambia por navegación, se recrea el mapa mediante key en el padre.
  }, [comunidades]);

  return <div ref={contenedor} className="portal-mapa" aria-label="Mapa de comunidades" />;
}

function escapar(valor) {
  return String(valor ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
