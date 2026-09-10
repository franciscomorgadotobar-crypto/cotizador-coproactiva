import { Link, useLocation } from 'react-router-dom';
import { useSesion } from '../lib/sesion';

/* Barra lateral de escritorio.
 *
 * En el teléfono no existe: el CSS la oculta por completo bajo el punto de
 * quiebre y esta pantalla vuelve a ser exactamente la de terreno, una
 * columna angosta con su propio "‹ Inicio". Recién en una ventana ancha
 * —oficina, no la vereda de un edificio— aparece como navegación fija, y el
 * contenido de cada pantalla se centra a su lado en vez de estirarse de
 * borde a borde.
 *
 * Por eso es un único componente que envuelve las pantallas de panel (no las
 * de terreno, que siguen sin esto): la lista de accesos depende del rol, y
 * repetirla pantalla por pantalla las haría fáciles de desalinear entre sí.
 */

function activa(pathname, ruta) {
  if (ruta === '/') return pathname === '/';
  return pathname === ruta || pathname.startsWith(ruta + '/');
}

export default function PanelEscritorio({ children, anchoCompleto = false }) {
  const { perfil, salir } = useSesion();
  const { pathname } = useLocation();

  const puedeConfigurar = perfil && ['superadmin', 'admin', 'jefatura'].includes(perfil.rol);
  const esAdministracion = perfil && ['superadmin', 'admin'].includes(perfil.rol);

  const accesos = [
    { ruta: '/', etiqueta: 'Inicio', mostrar: true },
    { ruta: '/nuevo', etiqueta: 'Nuevo levantamiento', mostrar: puedeConfigurar },
    { ruta: '/plantillas', etiqueta: 'Plantillas', mostrar: puedeConfigurar },
    { ruta: '/equipo', etiqueta: 'Equipo y permisos', mostrar: esAdministracion },
    { ruta: '/historico', etiqueta: 'Histórico por comunidad', mostrar: puedeConfigurar },
    { ruta: '/mapa', etiqueta: 'Mapa', mostrar: true }
  ];

  return (
    <div className="layout-escritorio">
      <nav className="barra-lateral" aria-label="Navegación">
        <Link to="/" className="marca-lateral">
          <img src={import.meta.env.BASE_URL + 'logo-coproactiva.svg'} alt="" />
          <span>CoproActiva</span>
        </Link>

        <div className="enlaces-lateral">
          {accesos.filter(a => a.mostrar).map(a => (
            <Link key={a.ruta} to={a.ruta}
                  className={'enlace-lateral' + (activa(pathname, a.ruta) ? ' activo' : '')}>
              {a.etiqueta}
            </Link>
          ))}
        </div>

        <div className="crece" />

        <div className="usuario-lateral">
          <span className="micro apagado" style={{ display: 'block', marginBottom: 6 }}>
            {perfil?.nombre}
          </span>
          <button type="button" className="boton boton-texto" style={{ padding: 0 }} onClick={salir}>
            Salir
          </button>
        </div>
      </nav>

      <div className={'area-escritorio' + (anchoCompleto ? ' ancho-completo' : '')}>
        {children}
      </div>
    </div>
  );
}
