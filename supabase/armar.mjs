/* Copia correo.ts dentro de cada función y reescribe el import.
 *
 * El despliegue sube archivos planos: `../_compartido/correo.ts` no existe del
 * otro lado. En vez de mantener dos copias que se van a desincronizar, la
 * fuente es una sola y la copia se hace acá, en cada despliegue.
 */
import { mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = join(dirname(fileURLToPath(import.meta.url)), 'functions');
const salida = join(raiz, '..', '.armado');
const correo = readFileSync(join(raiz, '_compartido', 'correo.ts'), 'utf8')
  .replace("'../_compartido/logo.ts'", "'./logo.ts'");
const logo = readFileSync(join(raiz, '_compartido', 'logo.ts'), 'utf8');

rmSync(salida, { recursive: true, force: true });

for (const fn of ['equipo', 'acceso']) {
  const destino = join(salida, fn);
  mkdirSync(destino, { recursive: true });
  const indice = readFileSync(join(raiz, fn, 'index.ts'), 'utf8')
    .replace("'../_compartido/correo.ts'", "'./correo.ts'");
  writeFileSync(join(destino, 'index.ts'), indice);
  writeFileSync(join(destino, 'correo.ts'), correo);
  writeFileSync(join(destino, 'logo.ts'), logo);
  console.log('armado:', fn);
}
