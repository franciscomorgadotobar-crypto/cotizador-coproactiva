import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';

/* Definir la contraseña propia desde un enlace de un solo uso.
 *
 * El enlace trae un token que se canjea por una sesión momentánea, y con esa
 * sesión la persona escribe su clave. Nadie más la conoce: ni quien la dio de
 * alta ni quien administra el sistema.
 *
 * Se usa el token directamente con verifyOtp en vez del enlace que arma
 * Supabase, que redirige dejando los tokens en el fragmento de la URL. El
 * fragmento no siempre sobrevive al 404.html con que GitHub Pages resuelve las
 * rutas, y depender de eso haría que el acceso fallara sin explicación.
 */
export default function Clave() {
  const [params] = useSearchParams();
  const navegar = useNavigate();

  const [estado, setEstado] = useState('validando');  // validando | listo | vencido | guardado
  const [error, setError] = useState(null);
  const [clave, setClave] = useState('');
  const [repetida, setRepetida] = useState('');
  const [guardando, setGuardando] = useState(false);

  const token = params.get('t');

  useEffect(() => {
    if (!token) { setEstado('vencido'); return; }

    supabase.auth
      .verifyOtp({ token_hash: token, type: params.get('tipo') === 'magiclink' ? 'magiclink' : 'recovery' })
      .then(({ error }) => setEstado(error ? 'vencido' : 'listo'));
  }, [token]);

  async function guardar(e) {
    e.preventDefault();
    if (clave.length < 8) return setError('La contraseña debe tener al menos 8 caracteres.');
    if (clave !== repetida) return setError('Las dos contraseñas no coinciden.');

    setGuardando(true);
    setError(null);
    const { error } = await supabase.auth.updateUser({ password: clave });
    setGuardando(false);
    if (error) return setError(error.message);

    setEstado('guardado');
    // Se queda la sesión abierta: acaba de demostrar que controla el correo y
    // que sabe su clave. Pedirle iniciar sesión de nuevo no agrega seguridad.
    setTimeout(() => navegar('/', { replace: true }), 1600);
  }

  return (
    <div className="pantalla" style={{ justifyContent: 'center', padding: '24px 20px' }}>
      <div style={{ width: '100%', maxWidth: 380, margin: '0 auto' }}>
        <img src={import.meta.env.BASE_URL + 'logo-coproactiva.svg'}
             alt="CoproActiva" style={{ height: 26, marginBottom: 28 }} />

        {estado === 'validando' && <p className="cargando">Comprobando el enlace…</p>}

        {estado === 'vencido' && (
          <>
            <h1 className="h2" style={{ marginBottom: 6 }}>Enlace vencido</h1>
            <p className="chico apagado" style={{ margin: '0 0 20px' }}>
              Los enlaces de acceso sirven una sola vez y caducan. Pídele uno nuevo
              a administración y ábrelo apenas te llegue.
            </p>
            <button className="boton boton-secundario boton-movil boton-ancho"
                    onClick={() => navegar('/ingreso', { replace: true })}>
              Ir a ingresar
            </button>
          </>
        )}

        {estado === 'guardado' && (
          <>
            <h1 className="h2" style={{ marginBottom: 6 }}>Listo</h1>
            <p className="chico apagado" style={{ margin: 0 }}>
              Tu contraseña quedó guardada. Entrando…
            </p>
          </>
        )}

        {estado === 'listo' && (
          <>
            <h1 className="h2" style={{ marginBottom: 6 }}>Crea tu contraseña</h1>
            <p className="chico apagado" style={{ margin: '0 0 24px' }}>
              La eliges tú y nadie más la conoce.
            </p>

            <form onSubmit={guardar}>
              <div className={'campo' + (error ? ' campo-error' : '')}>
                <label className="etiqueta-campo" htmlFor="clave">Contraseña</label>
                <input id="clave" type="password" value={clave} autoComplete="new-password"
                       required minLength={8}
                       onChange={e => setClave(e.target.value)} />
                <p className="micro apagado" style={{ margin: '5px 0 0' }}>Mínimo 8 caracteres</p>
              </div>

              <div className={'campo' + (error ? ' campo-error' : '')}>
                <label className="etiqueta-campo" htmlFor="repetida">Repítela</label>
                <input id="repetida" type="password" value={repetida} autoComplete="new-password"
                       required onChange={e => setRepetida(e.target.value)} />
              </div>

              {error && <p className="mensaje-error" role="alert">{error}</p>}

              <button className="boton boton-movil boton-ancho" style={{ marginTop: 16 }}
                      disabled={guardando}>
                {guardando ? 'Guardando…' : 'Guardar y entrar'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
