import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { alCambiarPendientes, hayConexion, sincronizar } from './sincronizacion';
import { pendientes, pendientesPorControl, leerControl } from './local';

/* Estado de conexión y de trabajo sin subir.
 *
 * En terreno estas dos cosas son distintas y las dos importan: puede haber
 * señal y quedar cosas pendientes (una subida a medias), o no haber señal y
 * estar todo al día. La interfaz tiene que poder decir cuál de las dos es,
 * porque de eso depende si la persona puede irse del edificio tranquila.
 */
export function useEstadoTerreno() {
  const [enLinea, setEnLinea] = useState(hayConexion());
  const [porSubir, setPorSubir] = useState({ cambios: 0, fotos: 0, total: 0 });
  // Cuando todo lo pendiente pertenece a un único levantamiento, se guarda su
  // destino acá para poder nombrarlo y enlazarlo. Con varios de por medio no
  // hay un único lugar al que mandar a la persona, así que queda sin resolver
  // y el aviso vuelve al mensaje general.
  const [unico, setUnico] = useState(null);

  useEffect(() => {
    let vigente = true;

    async function actualizar(estado) {
      if (!vigente) return;
      setPorSubir(estado);

      const porControl = await pendientesPorControl();
      if (!vigente) return;
      if (porControl.length !== 1) return setUnico(null);

      const control = await leerControl(porControl[0].control_id);
      if (vigente) setUnico(control ? { ...porControl[0], control } : null);
    }

    const conectado = () => { setEnLinea(true); sincronizar(); };
    const desconectado = () => setEnLinea(false);

    window.addEventListener('online', conectado);
    window.addEventListener('offline', desconectado);
    const soltar = alCambiarPendientes(actualizar);

    pendientes().then(actualizar);

    return () => {
      vigente = false;
      window.removeEventListener('online', conectado);
      window.removeEventListener('offline', desconectado);
      soltar();
    };
  }, []);

  return { enLinea, porSubir, unico, sincronizar };
}

/* Barra de estado. Solo aparece cuando hay algo que decir: con señal y nada
 * pendiente, no ocupa espacio en una pantalla que ya es chica.
 *
 * Cuando lo pendiente es de un solo levantamiento, dice cuál y lleva a él:
 * antes solo decía cuánto faltaba, sin decir dónde ir a mirarlo, y "Subir
 * ahora" no tenía nada que retomar si lo que hacía falta no era reintentar el
 * envío sino, por ejemplo, entrar y revisar una foto exigida que no se tomó.
 */
export function AvisoConexion() {
  const { enLinea, porSubir, unico, sincronizar } = useEstadoTerreno();

  if (enLinea && porSubir.total === 0) return null;

  const partes = [];
  if (porSubir.cambios) partes.push(`${porSubir.cambios} cambio${porSubir.cambios > 1 ? 's' : ''}`);
  if (porSubir.fotos) partes.push(`${porSubir.fotos} foto${porSubir.fotos > 1 ? 's' : ''}`);

  const destino = unico?.control.destino_nombre;
  const texto = enLinea
    ? `Quedan ${partes.join(' y ')} por subir${destino ? ` · ${destino}` : ''}`
    : partes.length
      ? `Sin señal · ${partes.join(' y ')} guardados en el teléfono`
      : 'Sin señal · todo guardado en el teléfono';

  return (
    <div className={'barra-conexion' + (enLinea ? '' : ' sin-senal')} role="status">
      {unico ? (
        <Link to={`/control/${unico.control_id}`} className="crece">{texto}</Link>
      ) : (
        <span className="crece">{texto}</span>
      )}
      {enLinea && porSubir.total > 0 && (
        <button type="button" className="boton boton-texto" onClick={sincronizar}>
          Subir ahora
        </button>
      )}
    </div>
  );
}
