import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const hayCredenciales = Boolean(url && anon);

if (!hayCredenciales) {
  console.warn(
    'Faltan VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY. ' +
    'Copia app/.env.example a app/.env y completa las credenciales del proyecto.'
  );
}

/* createClient exige una URL con forma válida: pasarle cadena vacía lanza
 * "supabaseUrl is required" y deja la app en blanco antes de renderizar nada.
 * Con el marcador la app arranca, muestra la pantalla de ingreso y explica que
 * falta configurar el entorno, en vez de fallar sin decir por qué.
 * El cliente no llega a usarse: `hayCredenciales` bloquea el botón de entrar. */
export const supabase = createClient(
  url || 'https://sin-configurar.supabase.co',
  anon || 'sin-configurar',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      // En terreno la sesión tiene que sobrevivir a que el teléfono se bloquee
      // o la app quede en segundo plano.
      detectSessionInUrl: false
    }
  }
);
