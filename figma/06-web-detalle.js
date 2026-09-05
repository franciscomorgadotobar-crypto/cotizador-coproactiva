// 06 — "Detalle de control" (1440x900) en la página Gestión · web.
//
// Cierra el circuito del módulo: el control que se llenó en terreno visto desde la
// web, con sus hallazgos y fotos, el check-in geolocalizado y la orden de trabajo que
// se generó. Requiere los scripts 02 y 03.

const fund = figma.root.children.find(p => p.name === 'Fundaciones');
await figma.setCurrentPageAsync(fund);
const web = figma.root.children.find(p => p.name === 'Gestión · web');
await web.loadAsync();

await Promise.all([
  figma.loadFontAsync({ family: 'Montserrat', style: 'Bold' }),
  figma.loadFontAsync({ family: 'Montserrat', style: 'SemiBold' }),
  figma.loadFontAsync({ family: 'Source Sans Pro', style: 'Regular' }),
  figma.loadFontAsync({ family: 'Source Sans Pro', style: 'Bold' })
]);

const tS = await figma.getLocalTextStylesAsync();
const S = n => tS.find(s => s.name === n).id;
const gv = id => figma.variables.getVariableByIdAsync(id);
const paint = (v, fb) => figma.variables.setBoundVariableForPaint({ type: 'SOLID', color: fb }, 'color', v);

const ids = {
  fondoApp: 'VariableID:2:8', blanco: 'VariableID:2:9', papel: 'VariableID:2:6',
  niebla: 'VariableID:2:7', bordeBase: 'VariableID:2:11', bordeSuave: 'VariableID:2:12',
  titulo: 'VariableID:2:14', apagado: 'VariableID:2:16', tenue: 'VariableID:2:18',
  naranja: 'VariableID:2:3', okT: 'VariableID:2:20', alT: 'VariableID:2:23',
  crT: 'VariableID:2:26', crF: 'VariableID:2:27', crB: 'VariableID:2:28',
  alF: 'VariableID:2:24', alB: 'VariableID:2:25',
  radioControl: 'VariableID:3:18', radioTarjeta: 'VariableID:3:19'
};
const V = {};
await Promise.all(Object.entries(ids).map(async ([k, i]) => { V[k] = await gv(i); }));

const H = {
  fondoApp: { r: 0.902, g: 0.886, b: 0.867 }, blanco: { r: 1, g: 1, b: 1 },
  papel: { r: 0.969, g: 0.957, b: 0.941 }, niebla: { r: 0.914, g: 0.902, b: 0.886 },
  bordeBase: { r: 0.867, g: 0.843, b: 0.812 }, bordeSuave: { r: 0.914, g: 0.902, b: 0.886 },
  titulo: { r: 0.169, g: 0.192, b: 0.220 }, apagado: { r: 0.353, g: 0.388, b: 0.424 },
  tenue: { r: 0.545, g: 0.576, b: 0.608 }, naranja: { r: 0.835, g: 0.525, b: 0.231 },
  okT: { r: 0.306, g: 0.420, b: 0.290 }, alT: { r: 0.541, g: 0.373, b: 0.133 },
  crT: { r: 0.576, g: 0.224, b: 0.169 }, crF: { r: 0.984, g: 0.933, b: 0.922 },
  crB: { r: 0.929, g: 0.824, b: 0.796 }, alF: { r: 0.992, g: 0.953, b: 0.902 },
  alB: { r: 0.941, g: 0.863, b: 0.741 }
};

const txt = (c, e, vv, hh) => {
  const t = figma.createText();
  t.characters = c; t.textStyleId = S(e); t.fills = [paint(vv, hh)];
  return t;
};
const radios = (n, v) => {
  for (const k of ['topLeftRadius', 'topRightRadius', 'bottomLeftRadius', 'bottomRightRadius']) n.setBoundVariable(k, v);
};
const bordeInferior = n => {
  n.strokes = [paint(V.bordeSuave, H.bordeSuave)];
  n.strokeWeight = 1; n.strokeAlign = 'INSIDE';
  n.strokeTopWeight = 0; n.strokeLeftWeight = 0; n.strokeRightWeight = 0; n.strokeBottomWeight = 1;
};

const buscarComp = nombre => fund.findOne(n => (n.type === 'COMPONENT' || n.type === 'COMPONENT_SET') && n.name === nombre);
const variante = (setNombre, varNombre) => {
  const s = buscarComp(setNombre);
  if (!s) return null;
  if (s.type === 'COMPONENT') return s;
  return s.children.find(c => c.name === varNombre) || s.defaultVariant;
};

const barraLateral = buscarComp('Barra lateral');
const panelComp = buscarComp('Panel de sección');
const btnPri = variante('Botón', 'tipo=Primario, tamaño=Web');
const btnSec = variante('Botón', 'tipo=Secundario, tamaño=Web');
const chip = nom => variante('Chip de estado', `estado=${nom}`);

if (!barraLateral || !panelComp) {
  throw new Error('Faltan componentes: ejecuta primero 02-web-navegacion.js y 03-web-tabla.js');
}

// ------------------------------------------------------------------ Pantalla
const p = figma.createFrame();
p.name = 'Detalle de control';
p.resize(1440, 900);
p.layoutMode = 'HORIZONTAL';
p.primaryAxisSizingMode = 'FIXED';
p.counterAxisSizingMode = 'FIXED';
p.clipsContent = true;
p.fills = [paint(V.fondoApp, H.fondoApp)];
web.appendChild(p);
p.x = 3180; p.y = 100;

const barra = barraLateral.createInstance();
p.appendChild(barra);
barra.layoutSizingVertical = 'FILL';

const cont = figma.createFrame();
cont.name = 'Contenido';
cont.layoutMode = 'VERTICAL';
cont.itemSpacing = 18;
cont.paddingTop = 28; cont.paddingBottom = 28; cont.paddingLeft = 32; cont.paddingRight = 32;
cont.counterAxisSizingMode = 'FIXED';
cont.fills = [paint(V.fondoApp, H.fondoApp)];
cont.clipsContent = true;
p.appendChild(cont);
cont.layoutSizingHorizontal = 'FILL';
cont.layoutSizingVertical = 'FILL';

const migas = txt('Controles  ›  Septiembre 2025  ›  Edificio Parque Bustamante', 'cuerpo/micro', V.tenue, H.tenue);
cont.appendChild(migas);
migas.layoutSizingHorizontal = 'FILL';
migas.textAutoResize = 'HEIGHT';

// ---------------------------------------------------------------- Encabezado
const cab = figma.createFrame();
cab.name = 'Encabezado';
cab.layoutMode = 'HORIZONTAL';
cab.itemSpacing = 14;
cab.counterAxisAlignItems = 'CENTER';
cab.counterAxisSizingMode = 'AUTO';
cab.fills = [];
cont.appendChild(cab);
cab.layoutSizingHorizontal = 'FILL';

const cabCol = figma.createFrame();
cabCol.layoutMode = 'VERTICAL';
cabCol.itemSpacing = 4;
cabCol.counterAxisSizingMode = 'AUTO';
cabCol.fills = [];
cabCol.name = 'Título';
cab.appendChild(cabCol);
cabCol.layoutSizingHorizontal = 'FILL';
const h = txt('Edificio Parque Bustamante', 'display/h2', V.titulo, H.titulo);
cabCol.appendChild(h);
h.layoutSizingHorizontal = 'FILL';
h.textAutoResize = 'HEIGHT';
const hs = txt('Control mensual · 4 de septiembre · Ana Pizarro · 28 de 28 ítems', 'cuerpo/chico', V.apagado, H.apagado);
cabCol.appendChild(hs);
hs.layoutSizingHorizontal = 'FILL';
hs.textAutoResize = 'HEIGHT';

const chipCritico = chip('Crítico');
if (chipCritico) cab.appendChild(chipCritico.createInstance());
for (const [comp, label] of [[btnSec, 'Enviar por correo'], [btnPri, 'Descargar PDF']]) {
  if (!comp) continue;
  const b = comp.createInstance();
  cab.appendChild(b);
  const bt = b.children.find(n => n.type === 'TEXT');
  if (bt) bt.characters = label;
}

// -------------------------------------------------------------------- Columnas
const cols = figma.createFrame();
cols.name = 'Columnas';
cols.layoutMode = 'HORIZONTAL';
cols.itemSpacing = 16;
cols.counterAxisSizingMode = 'FIXED';
cols.fills = [];
cont.appendChild(cols);
cols.layoutSizingHorizontal = 'FILL';
cols.layoutSizingVertical = 'FILL';

const colIzq = figma.createFrame();
colIzq.name = 'Columna principal';
colIzq.layoutMode = 'VERTICAL';
colIzq.itemSpacing = 16;
colIzq.counterAxisSizingMode = 'FIXED';
colIzq.fills = [];
cols.appendChild(colIzq);
colIzq.layoutSizingHorizontal = 'FILL';
colIzq.layoutSizingVertical = 'FILL';

const colDer = figma.createFrame();
colDer.name = 'Columna lateral';
colDer.layoutMode = 'VERTICAL';
colDer.itemSpacing = 16;
colDer.counterAxisSizingMode = 'FIXED';
colDer.primaryAxisSizingMode = 'FIXED';
colDer.resize(380, 400);
colDer.fills = [];
cols.appendChild(colDer);
colDer.layoutSizingHorizontal = 'FIXED';
colDer.layoutSizingVertical = 'FILL';

const nuevoPanel = (padre, titulo, accion) => {
  const inst = panelComp.createInstance();
  padre.appendChild(inst);
  inst.layoutSizingHorizontal = 'FILL';
  const ts = inst.findAllWithCriteria({ types: ['TEXT'] });
  if (ts[0]) ts[0].characters = titulo;
  if (ts[1]) ts[1].characters = accion;
  return { inst, cuerpo: inst.findOne(n => n.name === 'Cuerpo') };
};

// ------------------------------------------------------------------ Hallazgos
const hall = nuevoPanel(colIzq, 'Hallazgos del control', '2 registrados');

const hallazgos = [
  ['Crítico', 'Luminarias de emergencia operativas', 'Luminaria de emergencia del subterráneo -1 sin funcionar. Riesgo de evacuación.', 'Subterráneo -1, sector estacionamientos · 15:42', V.crT, H.crT, V.crF, H.crF, V.crB, H.crB],
  ['Alerta', 'Muros y cielo sin filtraciones', 'Filtración leve en muro poniente del hall. Se mantiene en observación hasta la próxima visita.', 'Hall de acceso, muro poniente · 15:12', V.alT, H.alT, V.alF, H.alF, V.alB, H.alB]
];

for (const [chipNom, item, descripcion, ubicacion, vT, hT, vF, hF, vB, hB] of hallazgos) {
  const f = figma.createFrame();
  f.name = 'Hallazgo · ' + item;
  f.layoutMode = 'HORIZONTAL';
  f.itemSpacing = 16;
  f.counterAxisAlignItems = 'MIN';
  f.counterAxisSizingMode = 'AUTO';
  f.paddingTop = 16; f.paddingBottom = 16; f.paddingLeft = 18; f.paddingRight = 18;
  f.fills = [];
  bordeInferior(f);
  hall.cuerpo.appendChild(f);
  f.layoutSizingHorizontal = 'FILL';

  const col = figma.createFrame();
  col.layoutMode = 'VERTICAL';
  col.itemSpacing = 6;
  col.counterAxisSizingMode = 'AUTO';
  col.fills = [];
  col.name = 'Texto';
  f.appendChild(col);
  col.layoutSizingHorizontal = 'FILL';

  const t1 = txt(item, 'cuerpo/fuerte', V.titulo, H.titulo);
  col.appendChild(t1);
  t1.layoutSizingHorizontal = 'FILL';
  t1.textAutoResize = 'HEIGHT';

  const nota = figma.createFrame();
  nota.name = 'Nota de terreno';
  nota.layoutMode = 'VERTICAL';
  nota.counterAxisSizingMode = 'AUTO';
  nota.paddingTop = 10; nota.paddingBottom = 10; nota.paddingLeft = 12; nota.paddingRight = 12;
  nota.fills = [paint(vF, hF)];
  nota.strokes = [paint(vB, hB)];
  nota.strokeWeight = 1;
  radios(nota, V.radioControl);
  col.appendChild(nota);
  nota.layoutSizingHorizontal = 'FILL';
  const t2 = txt(descripcion, 'cuerpo/chico', vT, hT);
  nota.appendChild(t2);
  t2.layoutSizingHorizontal = 'FILL';
  t2.textAutoResize = 'HEIGHT';

  const t3 = txt(ubicacion, 'cuerpo/micro', V.tenue, H.tenue);
  col.appendChild(t3);
  t3.layoutSizingHorizontal = 'FILL';
  t3.textAutoResize = 'HEIGHT';

  // Miniaturas de las fotos tomadas en terreno
  const fotos = figma.createFrame();
  fotos.name = 'Fotos';
  fotos.layoutMode = 'HORIZONTAL';
  fotos.itemSpacing = 8;
  fotos.counterAxisSizingMode = 'AUTO';
  fotos.primaryAxisSizingMode = 'AUTO';
  fotos.fills = [];
  f.appendChild(fotos);
  for (let i = 0; i < 2; i++) {
    const th = figma.createFrame();
    th.name = 'Miniatura';
    th.resize(64, 64);
    th.fills = [paint(V.niebla, H.niebla)];
    th.strokes = [paint(V.bordeBase, H.bordeBase)];
    th.strokeWeight = 1;
    radios(th, V.radioControl);
    fotos.appendChild(th);
    const ico = figma.createNodeFromSvg('<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 8.5A1.5 1.5 0 0 1 4.5 7h2.2l1.1-2h8.4l1.1 2h2.2A1.5 1.5 0 0 1 21 8.5v9A1.5 1.5 0 0 1 19.5 19h-15A1.5 1.5 0 0 1 3 17.5v-9Z" stroke="#8b939b" stroke-width="1.5" stroke-linejoin="round"/><circle cx="12" cy="13" r="3.4" stroke="#8b939b" stroke-width="1.5"/></svg>');
    ico.name = 'icono/foto';
    ico.resize(20, 20);
    ico.x = 22; ico.y = 22;
    th.appendChild(ico);
  }

  const chipComp = chip(chipNom);
  if (chipComp) {
    const cw = figma.createFrame();
    cw.name = 'Estado';
    cw.layoutMode = 'HORIZONTAL';
    cw.primaryAxisAlignItems = 'MAX';
    cw.counterAxisSizingMode = 'AUTO';
    cw.primaryAxisSizingMode = 'FIXED';
    cw.resize(150, 24);
    cw.fills = [];
    f.appendChild(cw);
    cw.appendChild(chipComp.createInstance());
  }
}

// ------------------------------------------------------- Resumen del checklist
const resumen = nuevoPanel(colIzq, 'Resumen por grupo', '28 ítems');
for (const [grupo, cumple, obs, crit] of [
  ['Acceso y hall', '8 cumplen', '1 observación', ''],
  ['Áreas comunes', '7 cumplen', '', ''],
  ['Seguridad', '5 cumplen', '', '1 crítico'],
  ['Instalaciones', '6 cumplen', '', '']
]) {
  const f = figma.createFrame();
  f.name = 'Grupo · ' + grupo;
  f.layoutMode = 'HORIZONTAL';
  f.itemSpacing = 16;
  f.counterAxisAlignItems = 'CENTER';
  f.counterAxisSizingMode = 'AUTO';
  f.paddingTop = 12; f.paddingBottom = 12; f.paddingLeft = 18; f.paddingRight = 18;
  f.fills = [];
  bordeInferior(f);
  resumen.cuerpo.appendChild(f);
  f.layoutSizingHorizontal = 'FILL';

  const g = txt(grupo, 'cuerpo/campo', V.titulo, H.titulo);
  f.appendChild(g);
  g.layoutSizingHorizontal = 'FILL';
  g.textAutoResize = 'HEIGHT';

  for (const [valor, vv, hh] of [[cumple, V.okT, H.okT], [obs, V.alT, H.alT], [crit, V.crT, H.crT]]) {
    const t = txt(valor || '—', 'cuerpo/micro', valor ? vv : V.tenue, valor ? hh : H.tenue);
    f.appendChild(t);
    t.textAutoResize = 'HEIGHT';
    t.resize(110, t.height);
    t.layoutSizingHorizontal = 'FIXED';
  }
}

// ------------------------------------------------------- Datos de la visita
const visita = nuevoPanel(colDer, 'Datos de la visita', 'Ver historial');
visita.cuerpo.paddingTop = 4;
for (const [etiqueta, valor, vv, hh] of [
  ['Responsable', 'Ana Pizarro · Terreno', V.titulo, H.titulo],
  ['Check-in', '4 sep, 14:58 · a 12 m del acceso', V.okT, H.okT],
  ['Check-out', '4 sep, 16:10 · 1 h 12 min en terreno', V.titulo, H.titulo],
  ['Coordenadas', '-33,4489  -70,6339 · precisión 8 m', V.apagado, H.apagado],
  ['Evidencia', '9 fotos · 2 con hallazgo asociado', V.apagado, H.apagado]
]) {
  const f = figma.createFrame();
  f.name = etiqueta;
  f.layoutMode = 'VERTICAL';
  f.itemSpacing = 3;
  f.counterAxisSizingMode = 'AUTO';
  f.paddingTop = 12; f.paddingBottom = 12; f.paddingLeft = 18; f.paddingRight = 18;
  f.fills = [];
  bordeInferior(f);
  visita.cuerpo.appendChild(f);
  f.layoutSizingHorizontal = 'FILL';
  const e = txt(etiqueta, 'etiqueta/campo', V.tenue, H.tenue);
  f.appendChild(e);
  e.layoutSizingHorizontal = 'FILL';
  e.textAutoResize = 'HEIGHT';
  const v = txt(valor, 'cuerpo/chico', vv, hh);
  f.appendChild(v);
  v.layoutSizingHorizontal = 'FILL';
  v.textAutoResize = 'HEIGHT';
}

// --------------------------------------------------------- Orden de trabajo
const ot = nuevoPanel(colDer, 'Orden de trabajo', 'OT-1042');
const otCuerpo = figma.createFrame();
otCuerpo.name = 'Detalle OT';
otCuerpo.layoutMode = 'VERTICAL';
otCuerpo.itemSpacing = 10;
otCuerpo.counterAxisSizingMode = 'AUTO';
otCuerpo.paddingTop = 16; otCuerpo.paddingBottom = 16; otCuerpo.paddingLeft = 18; otCuerpo.paddingRight = 18;
otCuerpo.fills = [];
ot.cuerpo.appendChild(otCuerpo);
otCuerpo.layoutSizingHorizontal = 'FILL';

const otT = txt('Reposición de luminaria de emergencia', 'cuerpo/fuerte', V.titulo, H.titulo);
otCuerpo.appendChild(otT);
otT.layoutSizingHorizontal = 'FILL';
otT.textAutoResize = 'HEIGHT';

const otFila = figma.createFrame();
otFila.layoutMode = 'HORIZONTAL';
otFila.itemSpacing = 8;
otFila.counterAxisAlignItems = 'CENTER';
otFila.counterAxisSizingMode = 'AUTO';
otFila.fills = [];
otFila.name = 'Estado';
otCuerpo.appendChild(otFila);
otFila.layoutSizingHorizontal = 'FILL';
const chipPend = chip('Pendiente');
if (chipPend) otFila.appendChild(chipPend.createInstance());
const otVence = txt('Vence el 6 de septiembre', 'cuerpo/micro', V.crT, H.crT);
otFila.appendChild(otVence);
otVence.layoutSizingHorizontal = 'FILL';
otVence.textAutoResize = 'HEIGHT';

const otResp = txt('Asignada a Mantención · Jorge Vera', 'cuerpo/chico', V.apagado, H.apagado);
otCuerpo.appendChild(otResp);
otResp.layoutSizingHorizontal = 'FILL';
otResp.textAutoResize = 'HEIGHT';

if (btnSec) {
  const b = btnSec.createInstance();
  otCuerpo.appendChild(b);
  b.layoutSizingHorizontal = 'FILL';
  const bt = b.children.find(n => n.type === 'TEXT');
  if (bt) bt.characters = 'Ver orden de trabajo';
}

return {
  createdNodeIds: [p.id, cont.id, hall.inst.id, resumen.inst.id, visita.inst.id, ot.inst.id],
  pantallaId: p.id
};
