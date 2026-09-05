import { Navigate, Route, Routes } from 'react-router-dom';
import { useSesion } from './lib/sesion';
import Ingreso from './paginas/Ingreso';
import InicioTerreno from './paginas/terreno/Inicio';
import Control from './paginas/terreno/Control';

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
      <Route path="/ingreso" element={sesion ? <Navigate to="/" replace /> : <Ingreso />} />
      <Route path="/" element={<Privada><InicioTerreno /></Privada>} />
      <Route path="/control/:id" element={<Privada><Control /></Privada>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
