import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/* GitHub Pages sirve el sitio bajo /<repositorio>/, no en la raíz del dominio.
 * `base` hace que los assets se pidan a la ruta correcta; sin esto la página
 * carga en blanco porque busca /assets/... en la raíz del dominio.
 * Se pasa por variable para que `npm run dev` y cualquier otro hosting sigan
 * funcionando en la raíz. */
export default defineConfig({
  base: process.env.VITE_BASE ?? '/',
  plugins: [react()],
  server: { port: 5173 }
});
