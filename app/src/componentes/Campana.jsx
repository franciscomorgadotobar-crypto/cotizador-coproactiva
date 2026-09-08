/* Campana de actividad pendiente.
 *
 * No es una notificación push —eso llega al teléfono aunque la app esté
 * cerrada, y hoy no hay ni claves ni servidor para eso—. Es un aviso que se ve
 * al entrar o al volver a la pestaña: cuánto hay por hacer, con lo crítico
 * destacado, y un salto directo a la lista completa.
 *
 * El número no es "nuevo desde la última vez que miraste": es lo pendiente en
 * este momento. Distinguir lo nuevo de lo de siempre exigiría guardar qué vio
 * cada persona y cuándo, y eso no existe todavía.
 */
export default function Campana({ pendientes, criticos, destino = '#por-hacer' }) {
  if (pendientes === 0) {
    return (
      <span className="campana sin-pendientes" title="Sin pendientes" aria-label="Sin pendientes">
        🔔
      </span>
    );
  }

  return (
    <a href={destino} className="campana" aria-label={
      criticos > 0
        ? `${pendientes} pendientes, ${criticos} con algo crítico`
        : `${pendientes} pendientes`
    }>
      🔔
      <span className={'globo' + (criticos > 0 ? ' critico' : '')}>
        {pendientes > 99 ? '99+' : pendientes}
      </span>
    </a>
  );
}
