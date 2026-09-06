import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';

const simulado = fileURLToPath(new URL('./supabase-simulado.js', import.meta.url));

/* Configuración solo para pruebas: sustituye el cliente de Supabase por el
 * simulado. Un alias por ruta no sirve —los módulos lo importan como
 * './supabase', '../lib/supabase' y '../../lib/supabase'—, así que se
 * intercepta por el final del especificador.
 *
 * Sin PWA: el service worker cachearía la versión anterior entre corridas y las
 * pruebas empezarían a mentir. */
function usarSupabaseSimulado() {
  return {
    name: 'supabase-simulado',
    enforce: 'pre',
    resolveId(fuente) {
      if (/(^|\/)lib\/supabase(\.js)?$/.test(fuente) || fuente === './supabase') {
        return simulado;
      }
      return null;
    }
  };
}

export default defineConfig({
  root: fileURLToPath(new URL('..', import.meta.url)),
  plugins: [usarSupabaseSimulado(), react()],
  server: { port: 5190, host: '127.0.0.1' }
});
