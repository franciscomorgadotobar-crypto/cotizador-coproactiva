// 01 — Cuerpo de la pantalla "Nuevo hallazgo" (390x844) + variante "En curso" del chip.
//
// Construye dentro del cuerpo 17:132: evidencia fotográfica, ubicación, descripción,
// severidad, bloque de geolocalización y generación de orden de trabajo. Agrega el pie
// de acciones a la pantalla 17:124.
//
// Además arregla el chip de la tarjeta de visita en curso, que mostraba "Con
// observación": crea la variante estado=En curso en el set 8:10 y la intercambia en el
// componente 13:12 (no en la instancia, para que el cambio se propague).

const page = figma.root.children.find(p => p.name === 'Terreno · app móvil');
await figma.setCurrentPageAsync(page);
await Promise.all([
  figma.loadFontAsync({ family: 'Montserrat', style: 'Bold' }),
  figma.loadFontAsync({ family: 'Montserrat', style: 'SemiBold' }),
  figma.loadFontAsync({ family: 'Source Sans Pro', style: 'Regular' })
]);

const tS = await figma.getLocalTextStylesAsync();
const S = n => tS.find(s => s.name === n).id;
const gv = id => figma.variables.getVariableByIdAsync(id);
const paint = (v, fb) => figma.variables.setBoundVariableForPaint({ type: 'SOLID', color: fb }, 'color', v);

const ids = {
  blanco: 'VariableID:2:9', bordeBase: 'VariableID:2:11', bordeSuave: 'VariableID:2:12',
  titulo: 'VariableID:2:14', apagado: 'VariableID:2:16', tenue: 'VariableID:2:18',
  niebla: 'VariableID:2:7', naranja: 'VariableID:2:3',
  crT: 'VariableID:2:26', crF: 'VariableID:2:27', crB: 'VariableID:2:28',
  alT: 'VariableID:2:23', alF: 'VariableID:2:24', alB: 'VariableID:2:25',
  okT: 'VariableID:2:20',
  radioControl: 'VariableID:3:18', radioTarjeta: 'VariableID:3:19', radioPastilla: 'VariableID:3:20'
};
const V = {};
await Promise.all(Object.entries(ids).map(async ([k, i]) => { V[k] = await gv(i); }));

const H = {
  blanco: { r: 1, g: 1, b: 1 }, bordeBase: { r: 0.867, g: 0.843, b: 0.812 },
  bordeSuave: { r: 0.914, g: 0.902, b: 0.886 }, titulo: { r: 0.169, g: 0.192, b: 0.220 },
  apagado: { r: 0.353, g: 0.388, b: 0.424 }, tenue: { r: 0.545, g: 0.576, b: 0.608 },
  niebla: { r: 0.914, g: 0.902, b: 0.886 }, naranja: { r: 0.835, g: 0.525, b: 0.231 },
  crT: { r: 0.576, g: 0.224, b: 0.169 }, crF: { r: 0.984, g: 0.933, b: 0.922 }, crB: { r: 0.929, g: 0.824, b: 0.796 },
  alT: { r: 0.541, g: 0.373, b: 0.133 }, alF: { r: 0.992, g: 0.953, b: 0.902 }, alB: { r: 0.941, g: 0.863, b: 0.741 },
  okT: { r: 0.306, g: 0.420, b: 0.290 }
};

const txt = (c, e, vv, hh) => {
  const t = figma.createText();
  t.characters = c; t.textStyleId = S(e); t.fills = [paint(vv, hh)];
  return t;
};
const radios = (n, v) => {
  for (const k of ['topLeftRadius', 'topRightRadius', 'bottomLeftRadius', 'bottomRightRadius']) n.setBoundVariable(k, v);
};

const [pantalla, cuerpo, campoMovil, btnSec, btnPri, chipSet, tarjetaEnCurso] = await Promise.all([
  figma.getNodeByIdAsync('17:124'), figma.getNodeByIdAsync('17:132'), figma.getNodeByIdAsync('9:6'),
  figma.getNodeByIdAsync('5:8'), figma.getNodeByIdAsync('5:4'), figma.getNodeByIdAsync('8:10'),
  figma.getNodeByIdAsync('13:12')
]);

const creados = [];
const mutados = [];

cuerpo.itemSpacing = 12;

// ---------------------------------------------------------------- Evidencia
const tituloGrupo = nombre => {
  const g = figma.createFrame();
  g.name = 'Título grupo';
  g.layoutMode = 'VERTICAL';
  g.counterAxisSizingMode = 'AUTO';
  g.paddingBottom = 8;
  g.fills = [];
  g.strokes = [paint(V.bordeSuave, H.bordeSuave)];
  g.strokeWeight = 1; g.strokeAlign = 'INSIDE';
  g.strokeTopWeight = 0; g.strokeLeftWeight = 0; g.strokeRightWeight = 0; g.strokeBottomWeight = 1;
  cuerpo.appendChild(g);
  g.layoutSizingHorizontal = 'FILL';
  const t = txt(nombre, 'etiqueta/grupo', V.titulo, H.titulo);
  g.appendChild(t);
  t.layoutSizingHorizontal = 'FILL';
  t.textAutoResize = 'HEIGHT';
  return g;
};

creados.push(tituloGrupo('Evidencia').id);

const CAMARA = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 8.5A1.5 1.5 0 0 1 4.5 7h2.2l1.1-2h8.4l1.1 2h2.2A1.5 1.5 0 0 1 21 8.5v9A1.5 1.5 0 0 1 19.5 19h-15A1.5 1.5 0 0 1 3 17.5v-9Z" stroke="#8b939b" stroke-width="1.5" stroke-linejoin="round"/><circle cx="12" cy="13" r="3.4" stroke="#8b939b" stroke-width="1.5"/></svg>';
const MAS = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 5v14M5 12h14" stroke="#8b939b" stroke-width="1.6" stroke-linecap="round"/></svg>';

const fotos = figma.createFrame();
fotos.name = 'Fotos';
fotos.layoutMode = 'HORIZONTAL';
fotos.itemSpacing = 10;
fotos.counterAxisSizingMode = 'AUTO';
fotos.fills = [];
cuerpo.appendChild(fotos);
fotos.layoutSizingHorizontal = 'FILL';
creados.push(fotos.id);

for (const etiqueta of ['IMG_0421', 'IMG_0422', null]) {
  const slot = figma.createFrame();
  slot.name = etiqueta ? 'Foto adjunta' : 'Agregar foto';
  slot.layoutMode = 'VERTICAL';
  slot.primaryAxisAlignItems = 'CENTER';
  slot.counterAxisAlignItems = 'CENTER';
  slot.itemSpacing = 6;
  slot.counterAxisSizingMode = 'FIXED';
  slot.primaryAxisSizingMode = 'FIXED';
  slot.resize(112, 88);
  slot.fills = [etiqueta ? paint(V.niebla, H.niebla) : paint(V.blanco, H.blanco)];
  slot.strokes = [paint(V.bordeBase, H.bordeBase)];
  slot.strokeWeight = 1;
  if (!etiqueta) slot.dashPattern = [4, 3];
  radios(slot, V.radioControl);
  fotos.appendChild(slot);
  slot.layoutSizingHorizontal = 'FILL';
  slot.layoutSizingVertical = 'FIXED';
  const ico = figma.createNodeFromSvg(etiqueta ? CAMARA : MAS);
  ico.name = 'icono';
  ico.resize(24, 24);
  slot.appendChild(ico);
  slot.appendChild(txt(etiqueta || 'Agregar', 'cuerpo/micro', V.tenue, H.tenue));
}

// ------------------------------------------------------------------ Detalle
for (const [label, valor] of [
  ['Ubicación exacta dentro de la comunidad', 'Subterráneo -1, sector estacionamientos'],
  ['Descripción del hallazgo', 'Luminaria de emergencia sin funcionar; la batería no responde al corte de energía.']
]) {
  const i = campoMovil.createInstance();
  cuerpo.appendChild(i);
  i.layoutSizingHorizontal = 'FILL';
  const ts = i.findAllWithCriteria({ types: ['TEXT'] });
  ts[0].characters = label;
  ts[1].characters = valor;
  ts[1].fills = [paint(V.titulo, H.titulo)];
  creados.push(i.id);
}

// ----------------------------------------------------------------- Severidad
const sevBloque = figma.createFrame();
sevBloque.name = 'Severidad';
sevBloque.layoutMode = 'VERTICAL';
sevBloque.itemSpacing = 6;
sevBloque.counterAxisSizingMode = 'AUTO';
sevBloque.fills = [];
cuerpo.appendChild(sevBloque);
sevBloque.layoutSizingHorizontal = 'FILL';
creados.push(sevBloque.id);

const sevLbl = txt('Severidad', 'etiqueta/campo', V.tenue, H.tenue);
sevBloque.appendChild(sevLbl);
sevLbl.layoutSizingHorizontal = 'FILL';
sevLbl.textAutoResize = 'HEIGHT';

const sevSeg = figma.createFrame();
sevSeg.name = 'Selector';
sevSeg.layoutMode = 'HORIZONTAL';
sevSeg.itemSpacing = 6;
sevSeg.counterAxisSizingMode = 'AUTO';
sevSeg.fills = [];
sevBloque.appendChild(sevSeg);
sevSeg.layoutSizingHorizontal = 'FILL';

// Misma anatomía que el selector del Ítem de control: celdas de 44 px táctiles.
for (const [lab, activo] of [['Menor', false], ['Importante', false], ['Crítica', true]]) {
  const cel = figma.createFrame();
  cel.name = lab;
  cel.layoutMode = 'HORIZONTAL';
  cel.primaryAxisAlignItems = 'CENTER';
  cel.counterAxisAlignItems = 'CENTER';
  cel.counterAxisSizingMode = 'FIXED';
  cel.resize(100, 44);
  cel.fills = [activo ? paint(V.crF, H.crF) : paint(V.blanco, H.blanco)];
  cel.strokes = [activo ? paint(V.crB, H.crB) : paint(V.bordeBase, H.bordeBase)];
  cel.strokeWeight = activo ? 1.5 : 1;
  radios(cel, V.radioControl);
  cel.appendChild(txt(lab, 'etiqueta/chip', activo ? V.crT : V.tenue, activo ? H.crT : H.tenue));
  sevSeg.appendChild(cel);
  cel.layoutSizingHorizontal = 'FILL';
  cel.layoutSizingVertical = 'FIXED';
}

// ----------------------------------------------------------- Geolocalización
const geo = figma.createFrame();
geo.name = 'Geolocalización';
geo.layoutMode = 'VERTICAL';
geo.itemSpacing = 10;
geo.counterAxisSizingMode = 'AUTO';
geo.paddingTop = 14; geo.paddingBottom = 14; geo.paddingLeft = 14; geo.paddingRight = 14;
geo.fills = [paint(V.blanco, H.blanco)];
geo.strokes = [paint(V.bordeBase, H.bordeBase)];
geo.strokeWeight = 1;
radios(geo, V.radioTarjeta);
cuerpo.appendChild(geo);
geo.layoutSizingHorizontal = 'FILL';
creados.push(geo.id);

const geoFila = figma.createFrame();
geoFila.layoutMode = 'HORIZONTAL';
geoFila.itemSpacing = 6;
geoFila.counterAxisAlignItems = 'CENTER';
geoFila.counterAxisSizingMode = 'AUTO';
geoFila.fills = [];
geoFila.name = 'Cabecera';
geo.appendChild(geoFila);
geoFila.layoutSizingHorizontal = 'FILL';
const pin = figma.createNodeFromSvg('<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" stroke="#4e6b4a" stroke-width="1.7" stroke-linejoin="round"/><circle cx="12" cy="10" r="2.6" stroke="#4e6b4a" stroke-width="1.7"/></svg>');
pin.name = 'icono/ubicacion';
pin.resize(14, 14);
geoFila.appendChild(pin);
const geoT = txt('Ubicación registrada automáticamente', 'etiqueta/campo', V.okT, H.okT);
geoFila.appendChild(geoT);
geoT.layoutSizingHorizontal = 'FILL';
geoT.textAutoResize = 'HEIGHT';

// Mapa de referencia: marcador de posición dibujado, no una imagen real.
const mapa = figma.createFrame();
mapa.name = 'Mapa (marcador de posición)';
mapa.resize(330, 48);
mapa.fills = [paint(V.niebla, H.niebla)];
mapa.strokes = [paint(V.bordeSuave, H.bordeSuave)];
mapa.strokeWeight = 1;
mapa.clipsContent = true;
radios(mapa, V.radioControl);
geo.appendChild(mapa);
mapa.layoutSizingHorizontal = 'FILL';
mapa.layoutSizingVertical = 'FIXED';

for (const [x, y, w, h] of [[0, 18, 330, 1.5], [0, 34, 330, 1.5], [96, 0, 1.5, 48], [214, 0, 1.5, 48]]) {
  const linea = figma.createRectangle();
  linea.name = 'Calle';
  linea.resize(w, h);
  linea.x = x; linea.y = y;
  linea.fills = [paint(V.bordeBase, H.bordeBase)];
  mapa.appendChild(linea);
}
const marca = figma.createEllipse();
marca.name = 'Marcador';
marca.resize(12, 12);
marca.x = 158; marca.y = 18;
marca.fills = [paint(V.naranja, H.naranja)];
marca.strokes = [paint(V.blanco, H.blanco)];
marca.strokeWeight = 2;
mapa.appendChild(marca);

const coords = txt('-33,4489  -70,6339 · precisión 8 m · registrado 15:42', 'cuerpo/micro', V.apagado, H.apagado);
geo.appendChild(coords);
coords.layoutSizingHorizontal = 'FILL';
coords.textAutoResize = 'HEIGHT';

// ------------------------------------------------------- Orden de trabajo
const ot = figma.createFrame();
ot.name = 'Generar OT';
ot.layoutMode = 'HORIZONTAL';
ot.itemSpacing = 12;
ot.counterAxisAlignItems = 'CENTER';
ot.counterAxisSizingMode = 'AUTO';
ot.paddingTop = 14; ot.paddingBottom = 14; ot.paddingLeft = 14; ot.paddingRight = 14;
ot.fills = [paint(V.blanco, H.blanco)];
ot.strokes = [paint(V.bordeBase, H.bordeBase)];
ot.strokeWeight = 1;
radios(ot, V.radioTarjeta);
cuerpo.appendChild(ot);
ot.layoutSizingHorizontal = 'FILL';
creados.push(ot.id);

const otCol = figma.createFrame();
otCol.layoutMode = 'VERTICAL';
otCol.itemSpacing = 3;
otCol.counterAxisSizingMode = 'AUTO';
otCol.fills = [];
otCol.name = 'Texto';
ot.appendChild(otCol);
otCol.layoutSizingHorizontal = 'FILL';
const otT = txt('Generar orden de trabajo', 'cuerpo/base', V.titulo, H.titulo);
otCol.appendChild(otT);
otT.layoutSizingHorizontal = 'FILL';
otT.textAutoResize = 'HEIGHT';
const otS = txt('Se asigna a mantención · vence en 48 h', 'cuerpo/micro', V.tenue, H.tenue);
otCol.appendChild(otS);
otS.layoutSizingHorizontal = 'FILL';
otS.textAutoResize = 'HEIGHT';

const sw = figma.createFrame();
sw.name = 'Interruptor';
sw.resize(44, 26);
sw.fills = [paint(V.naranja, H.naranja)];
sw.clipsContent = false;
radios(sw, V.radioPastilla);
ot.appendChild(sw);
const perilla = figma.createEllipse();
perilla.name = 'Perilla';
perilla.resize(20, 20);
perilla.x = 21; perilla.y = 3;
perilla.fills = [paint(V.blanco, H.blanco)];
sw.appendChild(perilla);

// ------------------------------------------------------------- Pie de acciones
const pie = figma.createFrame();
pie.name = 'Acciones';
pie.layoutMode = 'HORIZONTAL';
pie.itemSpacing = 10;
pie.paddingTop = 14; pie.paddingBottom = 30; pie.paddingLeft = 16; pie.paddingRight = 16;
pie.counterAxisSizingMode = 'AUTO';
pie.fills = [paint(V.blanco, H.blanco)];
pie.strokes = [paint(V.bordeBase, H.bordeBase)];
pie.strokeWeight = 1; pie.strokeAlign = 'INSIDE';
pie.strokeBottomWeight = 0; pie.strokeLeftWeight = 0; pie.strokeRightWeight = 0; pie.strokeTopWeight = 1;
pantalla.appendChild(pie);
pie.layoutSizingHorizontal = 'FILL';
creados.push(pie.id);

for (const [comp, label] of [[btnSec, 'Descartar'], [btnPri, 'Registrar hallazgo']]) {
  const b = comp.createInstance();
  pie.appendChild(b);
  b.layoutSizingHorizontal = 'FILL';
  const bt = b.children.find(n => n.type === 'TEXT');
  if (bt) bt.characters = label;
  creados.push(b.id);
}

// -------------------------------------------- Variante "En curso" del chip
let enCurso = chipSet.children.find(c => c.name === 'estado=En curso');
if (!enCurso) {
  const base = chipSet.children.find(c => c.name === 'estado=Alerta');
  enCurso = base.clone();
  enCurso.name = 'estado=En curso';
  const t = enCurso.children.find(n => n.type === 'TEXT');
  if (t) t.characters = 'En curso';
  chipSet.appendChild(enCurso);
  creados.push(enCurso.id);
}

// El swap va en el componente, no en la instancia: así se propaga a la pantalla.
const chipEnTarjeta = tarjetaEnCurso
  .findAllWithCriteria({ types: ['INSTANCE'] })
  .find(i => i.mainComponent && i.mainComponent.parent && i.mainComponent.parent.id === chipSet.id);
if (chipEnTarjeta) {
  chipEnTarjeta.swapComponent(enCurso);
  mutados.push(chipEnTarjeta.id);
}

return { createdNodeIds: creados, mutatedNodeIds: mutados, chipEnCursoId: enCurso.id };
