import { useEffect, useState } from 'react';
import { alCambiarPendientes, hayConexion, sincronizar } from './sincronizacion';
import { pendientes } from './local';

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

  useEffect(() => {
    const conectado = () => { setEnLinea(true); sincronizar(); };
    const desconectado = () => setEnLinea(false);

    window.addEventListener('online', conectado);
    window.addEventListener('offline', desconectado);
    const soltar = alCambiarPendientes(setPorSubir);

    pendientes().then(setPorSubir);

    return () => {
      window.removeEventListener('online', conectado);
      window.removeEventListener('offline', desconectado);
      soltar();
    };
  }, []);

  return { enLinea, porSubir, sincronizar };
}

/* Barra de estado. Solo aparece cuando hay algo que decir: con señal y nada
 * pendiente, no ocupa espacio en una pantalla que ya es chica. */
export function AvisoConexion() {
  const { enLinea, porSubir, sincronizar } = useEstadoTerreno();

  if (enLinea && porSubir.total === 0) return null;

  const partes = [];
  if (porSubir.cambios) partes.push(`${porSubir.cambios} cambio${porSubir.cambios > 1 ? 's' : ''}`);
  if (porSubir.fotos) partes.push(`${porSubir.fotos} foto${porSubir.fotos > 1 ? 's' : ''}`);

  return (
    <div className={'barra-conexion' + (enLinea ? '' : ' sin-senal')} role="status">
      <span className="crece">
        {enLinea
          ? `Quedan ${partes.join(' y ')} por subir`
          : partes.length
            ? `Sin señal · ${partes.join(' y ')} guardados en el teléfono`
            : 'Sin señal · todo guardado en el teléfono'}
      </span>
      {enLinea && porSubir.total > 0 && (
        <button type="button" className="boton boton-texto" onClick={sincronizar}>
          Subir ahora
        </button>
      )}
    </div>
  );
}
