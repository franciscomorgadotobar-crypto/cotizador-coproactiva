/* Regenera el logotipo del correo a partir del SVG del sitio.
 *
 * Los clientes de correo no dibujan SVG, así que hace falta un PNG. Se genera
 * al doble del tamaño con que se muestra, para que no se vea pixelado en
 * pantallas densas, y con fondo transparente porque la tarjeta ya es blanca.
 *
 * Correrlo solo cuando cambie el logotipo. Deja el PNG y el módulo con el
 * base64 que las funciones importan.
 *
 *     node supabase/logo.mjs
 */
import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'node:fs';

const ANCHO = 300, ALTO = 60;          // se muestra a 150x30
const ORIGEN  = 'app/public/logo-coproactiva.svg';
const DESTINO = 'supabase/functions/_compartido';

const nav = await chromium.launch();
const pag = await nav.newPage({ viewport: { width: ANCHO, height: ALTO } });
await pag.setContent(
  `<style>html,body{margin:0;padding:0}svg{display:block;width:${ANCHO}px;height:${ALTO}px}</style>` +
  readFileSync(ORIGEN, 'utf8'));
await pag.screenshot({ path: `${DESTINO}/logo.png`, omitBackground: true });
await nav.close();

const b64 = readFileSync(`${DESTINO}/logo.png`).toString('base64');
writeFileSync(`${DESTINO}/logo.ts`, `/* El logotipo de CoproActiva, en PNG y ya codificado.
 *
 * Va acá dentro y no como una dirección de imagen a propósito. Una imagen
 * remota depende de que el servidor conteste años después de enviado el
 * correo, y de paso deja en el código fuente dónde está alojado el sistema.
 * Incrustada viaja con el correo y se ve siempre que el cliente muestre
 * imágenes, sin pedirle nada a nadie.
 *
 * Es PNG y no el SVG del sitio porque Gmail, Outlook y Apple Mail no dibujan
 * SVG en un correo. Mide ${ANCHO}x${ALTO} y se muestra a la mitad, para que no se vea
 * pixelado en pantallas densas. Sale de ${ORIGEN} con
 * el guión que hay en ese mismo directorio.
 */
export const LOGO_PNG =
  '${b64}';
`);
console.log(`logo.ts regenerado — ${b64.length} caracteres`);
