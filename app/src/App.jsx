import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useSesion } from './lib/sesion';
import Ingreso from './paginas/Ingreso';
import Clave from './paginas/Clave';
import Inicio from './paginas/panel/Inicio';
import Plantillas from './paginas/panel/Plantillas';
import EditorPlantilla from './paginas/panel/Plantilla';
import Programar from './paginas/panel/Programar';
import Equipo from './paginas/panel/Equipo';
import Historico from './paginas/panel/Historico';

/* El mapa se carga aparte: Leaflet y sus estilos pesan, y no tienen por qué
 * viajar en el paquete que abre quien solo va a terreno. */
const Mapa = lazy(() => import('./paginas/panel/Mapa'));
import Levantamiento from './paginas/terreno/Control';

function Privada({ children }) {
  const { sesion, perfil, cargando } = useSesion();
  if (cargando) return <p className="cargando">Cargando…</p>;
  if (!sesion) return <Navigate to="/ingreso" replace />;
  // Un usuario dado de baja conserva su cuenta en auth pero no entra.
  if (perfil && !perfil.activo) {
    return (
      <div className="cuerpo">
        <div className="aviso aviso-critico">
          Tu cuenta está desactivada. Habla con administración.
        </div>
      </div>
    );
  }
  return children;
}

export default function App() {
  const { sesion } = useSesion();
  return (
    <Routes>
      {/* Fuera de Privada: se llega con un enlace, no con sesión iniciada. */}
      <Route path="/clave" element={<Clave />} />
      <Route path="/ingreso" element={sesion ? <Navigate to="/" replace /> : <Ingreso />} />
      <Route path="/" element={<Privada><Inicio /></Privada>} />
      <Route path="/plantillas" element={<Privada><Plantillas /></Privada>} />
      <Route path="/plantillas/:id" element={<Privada><EditorPlantilla /></Privada>} />
      <Route path="/equipo" element={<Privada><Equipo /></Privada>} />
      <Route path="/historico" element={<Privada><Historico /></Privada>} />
      <Route path="/mapa" element={
        <Privada>
          <Suspense fallback={<p className="cargando">Cargando el mapa…</p>}>
            <Mapa />
          </Suspense>
        </Privada>
      } />
      <Route path="/nuevo" element={<Privada><Programar /></Privada>} />
      <Route path="/control/:id/editar" element={<Privada><Programar /></Privada>} />
      <Route path="/control/:id" element={<Privada><Levantamiento /></Privada>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
