// Genera code.js a partir de los scripts numerados de la carpeta figma/.
//
// Cada script fue escrito para el parámetro `code` de use_figma, que lo envuelve en un
// contexto async. Acá se hace lo mismo: cada uno pasa a ser el cuerpo de una función
// async del plugin. El código no se toca — se copia literal, así que los .js siguen
// sirviendo para el MCP sin mantener dos versiones.
//
//   node build.mjs
//
// Correr después de editar cualquier script de figma/.

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const aqui = dirname(fileURLToPath(import.meta.url));
const raiz = join(aqui, '..');

// Nombre visible y dependencias de cada paso. Las dependencias las valida la interfaz
// antes de dejar ejecutar, para que ningún script se caiga a media pantalla.
const META = {
  '01': { nombre: 'Cuerpo de Nuevo hallazgo', pagina: 'Terreno · app móvil', requiere: [] },
  '02': { nombre: 'Componentes: Ítem de menú y Barra lateral', pagina: 'Fundaciones', requiere: [] },
  '03': { nombre: 'Componentes: tabla y Panel de sección', pagina: 'Fundaciones', requiere: [] },
  '04': { nombre: 'Supervisión · Jefatura', pagina: 'Gestión · web', requiere: ['02', '03'] },
  '05': { nombre: 'Controles recibidos', pagina: 'Gestión · web', requiere: ['02', '03'] },
  '06': { nombre: 'Detalle de control', pagina: 'Gestión · web', requiere: ['02', '03'] },
  '07': { nombre: 'Componentes: oportunidad, calendario y conversación', pagina: 'Fundaciones', requiere: [] },
  '08': { nombre: 'Panel · Admin', pagina: 'Gestión · web', requiere: ['02', '03'] },
  '09': { nombre: 'CRM · Oportunidades', pagina: 'Gestión · web', requiere: ['02', '07'] },
  '10': { nombre: 'Detalle de oportunidad', pagina: 'Gestión · web', requiere: ['02', '03'] },
  '11': { nombre: 'Contratos', pagina: 'Gestión · web', requiere: ['02', '03'] },
  '12': { nombre: 'Calendario', pagina: 'Gestión · web', requiere: ['02', '03', '07'] },
  '13': { nombre: 'Correo · contacto@coproactiva', pagina: 'Gestión · web', requiere: ['02', '07'] },
  '14': { nombre: 'Mensajes · Terreno', pagina: 'Terreno · app móvil', requiere: [] }
};

const archivos = readdirSync(raiz)
  .filter(f => /^\d\d-.*\.js$/.test(f))
  .sort();

if (!archivos.length) {
  console.error('No se encontró ningún script NN-*.js en ' + raiz);
  process.exit(1);
}

const bloques = archivos.map(archivo => {
  const id = archivo.slice(0, 2);
  const meta = META[id];
  if (!meta) {
    console.error(`Falta la entrada "${id}" en META (archivo ${archivo}).`);
    process.exit(1);
  }
  const fuente = readFileSync(join(raiz, archivo), 'utf8');
  // Indentar el cuerpo para que el archivo generado siga siendo legible.
  const cuerpo = fuente.split('\n').map(l => (l ? '      ' + l : '')).join('\n');
  return `  {
    id: ${JSON.stringify(id)},
    archivo: ${JSON.stringify(archivo)},
    nombre: ${JSON.stringify(meta.nombre)},
    pagina: ${JSON.stringify(meta.pagina)},
    requiere: ${JSON.stringify(meta.requiere)},
    ejecutar: async function () {
${cuerpo}
    }
  }`;
});

const salida = `// ARCHIVO GENERADO — no editar a mano.
// Se regenera con:  node build.mjs
// Fuente: los scripts NN-*.js de la carpeta figma/
//
// Plugin de desarrollo para construir la interfaz de CoproActiva dentro de Figma sin
// depender del conector MCP ni de su cuota mensual.

const PASOS = [
${bloques.join(',\n')}
];

figma.showUI(__html__, { width: 460, height: 620, title: 'CoproActiva · Constructor de interfaz' });

figma.ui.postMessage({
  tipo: 'pasos',
  pasos: PASOS.map(p => ({ id: p.id, nombre: p.nombre, pagina: p.pagina, requiere: p.requiere, archivo: p.archivo }))
});

figma.ui.onmessage = async msg => {
  if (!msg || msg.tipo !== 'ejecutar') return;

  const ids = Array.isArray(msg.ids) ? msg.ids : [];
  let fallo = false;

  for (const id of ids) {
    const paso = PASOS.find(p => p.id === id);
    if (!paso) continue;

    figma.ui.postMessage({ tipo: 'inicio', id, nombre: paso.nombre });
    try {
      const resultado = await paso.ejecutar();
      const creados = resultado && resultado.createdNodeIds ? resultado.createdNodeIds.length : 0;
      const mutados = resultado && resultado.mutatedNodeIds ? resultado.mutatedNodeIds.length : 0;
      figma.ui.postMessage({ tipo: 'ok', id, creados, mutados });
    } catch (e) {
      figma.ui.postMessage({ tipo: 'error', id, mensaje: String((e && e.message) || e) });
      fallo = true;
      break;
    }
  }

  figma.ui.postMessage({ tipo: 'fin', fallo });
};
`;

writeFileSync(join(aqui, 'code.js'), salida, 'utf8');
console.log(`code.js generado con ${archivos.length} pasos (${archivos.join(', ')})`);
