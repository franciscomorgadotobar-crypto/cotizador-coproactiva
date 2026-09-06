import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ProveedorSesion } from './lib/sesion';
import App from './App';
import './estilos/tokens.css';
import './estilos/base.css';

/* Bajo GitHub Pages la app vive en /cotizador-coproactiva/, así que el router
 * tiene que descontar ese prefijo o ninguna ruta calza. BASE_URL lo entrega
 * Vite a partir de `base`; en la raíz vale '/' y el basename queda vacío. */
const raiz = import.meta.env.BASE_URL.replace(/\/$/, '');

createRoot(document.getElementById('raiz')).render(
  <StrictMode>
    <BrowserRouter basename={raiz}>
      <ProveedorSesion>
        <App />
      </ProveedorSesion>
    </BrowserRouter>
  </StrictMode>
);
