// 05 — Bandeja "Controles recibidos" (1440x900) en la página Gestión · web.
//
// Requiere los scripts 02 y 03. Usa Barra lateral, Panel de sección, Encabezado de
// tabla, Fila de control, Campo y Botón. Los componentes se buscan por nombre.

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
  bordeBase: 'VariableID:2:11', bordeSuave: 'VariableID:2:12', titulo: 'VariableID:2:14',
  apagado: 'VariableID:2:16', tenue: 'VariableID:2:18', naranja: 'VariableID:2:3',
  radioControl: 'VariableID:3:18'
};
const V = {};
await Promise.all(Object.entries(ids).map(async ([k, i]) => { V[k] = await gv(i); }));

const H = {
  fondoApp: { r: 0.902, g: 0.886, b: 0.867 }, blanco: { r: 1, g: 1, b: 1 },
  papel: { r: 0.969, g: 0.957, b: 0.941 }, bordeBase: { r: 0.867, g: 0.843, b: 0.812 },
  bordeSuave: { r: 0.914, g: 0.902, b: 0.886 }, titulo: { r: 0.169, g: 0.192, b: 0.220 },
  apagado: { r: 0.353, g: 0.388, b: 0.424 }, tenue: { r: 0.545, g: 0.576, b: 0.608 },
  naranja: { r: 0.835, g: 0.525, b: 0.231 }
};

const txt = (c, e, vv, hh) => {
  const t = figma.createText();
  t.characters = c; t.textStyleId = S(e); t.fills = [paint(vv, hh)];
  return t;
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
const cabTabla = buscarComp('Encabezado de tabla');
const campoWeb = variante('Campo', 'estado=Normal, tamaño=Web');
const btnPri = variante('Botón', 'tipo=Primario, tamaño=Web');
const btnSec = variante('Botón', 'tipo=Secundario, tamaño=Web');
const filaDe = nom => variante('Fila de control', `estado=${nom}`);

if (!barraLateral || !panelComp || !cabTabla || !filaDe('Enviado')) {
  throw new Error('Faltan componentes: ejecuta primero 02-web-navegacion.js y 03-web-tabla.js');
}

// ------------------------------------------------------------------ Pantalla
const p = figma.createFrame();
p.name = 'Controles recibidos';
p.resize(1440, 900);
p.layoutMode = 'HORIZONTAL';
p.primaryAxisSizingMode = 'FIXED';
p.counterAxisSizingMode = 'FIXED';
p.clipsContent = true;
p.fills = [paint(V.fondoApp, H.fondoApp)];
web.appendChild(p);
p.x = 1640; p.y = 100;

const barra = barraLateral.createInstance();
p.appendChild(barra);
barra.layoutSizingVertical = 'FILL';

const cont = figma.createFrame();
cont.name = 'Contenido';
cont.layoutMode = 'VERTICAL';
cont.itemSpacing = 20;
cont.paddingTop = 32; cont.paddingBottom = 32; cont.paddingLeft = 32; cont.paddingRight = 32;
cont.counterAxisSizingMode = 'FIXED';
cont.fills = [paint(V.fondoApp, H.fondoApp)];
cont.clipsContent = true;
p.appendChild(cont);
cont.layoutSizingHorizontal = 'FILL';
cont.layoutSizingVertical = 'FILL';

// ---------------------------------------------------------------- Encabezado
const cab = figma.createFrame();
cab.name = 'Encabezado';
cab.layoutMode = 'HORIZONTAL';
cab.itemSpacing = 16;
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
const h = txt('Controles recibidos', 'display/h2', V.titulo, H.titulo);
cabCol.appendChild(h);
h.layoutSizingHorizontal = 'FILL';
h.textAutoResize = 'HEIGHT';
const hs = txt('34 controles enviados desde terreno este mes · 4 con hallazgos críticos', 'cuerpo/chico', V.apagado, H.apagado);
cabCol.appendChild(hs);
hs.layoutSizingHorizontal = 'FILL';
hs.textAutoResize = 'HEIGHT';

for (const [comp, label] of [[btnSec, 'Descargar CSV'], [btnPri, 'Nuevo control']]) {
  if (!comp) continue;
  const b = comp.createInstance();
  cab.appendChild(b);
  const bt = b.children.find(n => n.type === 'TEXT');
  if (bt) bt.characters = label;
}

// ------------------------------------------------------------------- Filtros
const filtros = figma.createFrame();
filtros.name = 'Filtros';
filtros.layoutMode = 'HORIZONTAL';
filtros.itemSpacing = 12;
filtros.counterAxisAlignItems = 'MAX';
filtros.counterAxisSizingMode = 'AUTO';
filtros.paddingTop = 16; filtros.paddingBottom = 16; filtros.paddingLeft = 18; filtros.paddingRight = 18;
filtros.fills = [paint(V.blanco, H.blanco)];
filtros.strokes = [paint(V.bordeBase, H.bordeBase)];
filtros.strokeWeight = 1;
const radioTarjeta = await gv('VariableID:3:19');
for (const k of ['topLeftRadius', 'topRightRadius', 'bottomLeftRadius', 'bottomRightRadius']) filtros.setBoundVariable(k, radioTarjeta);
cont.appendChild(filtros);
filtros.layoutSizingHorizontal = 'FILL';

for (const [label, valor] of [
  ['Comunidad', 'Todas las comunidades'],
  ['Periodo', 'Septiembre 2025'],
  ['Responsable', 'Todo el equipo'],
  ['Estado', 'Todos']
]) {
  if (!campoWeb) break;
  const c = campoWeb.createInstance();
  filtros.appendChild(c);
  c.layoutSizingHorizontal = 'FILL';
  const ts = c.findAllWithCriteria({ types: ['TEXT'] });
  if (ts[0]) ts[0].characters = label;
  if (ts[1]) {
    ts[1].characters = valor;
    ts[1].fills = [paint(V.titulo, H.titulo)];
  }
}
if (btnSec) {
  const b = btnSec.createInstance();
  filtros.appendChild(b);
  const bt = b.children.find(n => n.type === 'TEXT');
  if (bt) bt.characters = 'Filtrar';
}

// --------------------------------------------------------------------- Tabla
const panel = panelComp.createInstance();
cont.appendChild(panel);
panel.layoutSizingHorizontal = 'FILL';
panel.layoutSizingVertical = 'FILL';
const panelTs = panel.findAllWithCriteria({ types: ['TEXT'] });
if (panelTs[0]) panelTs[0].characters = 'Septiembre 2025';
if (panelTs[1]) panelTs[1].characters = 'Ordenar por fecha';
const cuerpoPanel = panel.findOne(n => n.name === 'Cuerpo');

const cabInst = cabTabla.createInstance();
cuerpoPanel.appendChild(cabInst);
cabInst.layoutSizingHorizontal = 'FILL';

const registros = [
  ['Crítico', 'Edificio Costanera Norte', 'Vitacura · 120 unidades', 'Ana Pizarro', '04 sep', '26/26', '1 crítico · 2 obs.'],
  ['Con observaciones', 'Condominio Los Almendros', 'Las Condes · 42 casas', 'Marcelo Ríos', '04 sep', '31/31', '3 observaciones'],
  ['Enviado', 'Edificio Parque Bustamante', 'Providencia · 84 unidades', 'Marcelo Ríos', '03 sep', '28/28', 'Sin hallazgos'],
  ['Con observaciones', 'Edificio Mirador del Parque', 'Ñuñoa · 96 unidades', 'Ana Pizarro', '03 sep', '28/28', '1 observación'],
  ['Enviado', 'Condominio Alto Macul', 'Macul · 60 casas', 'Jorge Vera', '02 sep', '24/24', 'Sin hallazgos'],
  ['Enviado', 'Edificio Plaza Ñuñoa', 'Ñuñoa · 54 unidades', 'Jorge Vera', '02 sep', '28/28', 'Sin hallazgos']
];

for (const [estado, comunidad, comuna, responsable, fecha, items, hallazgos] of registros) {
  const comp = filaDe(estado);
  if (!comp) continue;
  const f = comp.createInstance();
  cuerpoPanel.appendChild(f);
  f.layoutSizingHorizontal = 'FILL';
  // Orden de documento en la fila: comunidad, comuna, responsable, fecha, ítems,
  // hallazgos. El texto del chip vive en una instancia anidada y no se toca acá.
  const ts = f.findAllWithCriteria({ types: ['TEXT'] });
  const valores = [comunidad, comuna, responsable, fecha, items, hallazgos];
  valores.forEach((v, i) => { if (ts[i]) ts[i].characters = v; });
}

// ---------------------------------------------------------------- Paginación
const pie = figma.createFrame();
pie.name = 'Paginación';
pie.layoutMode = 'HORIZONTAL';
pie.itemSpacing = 8;
pie.counterAxisAlignItems = 'CENTER';
pie.counterAxisSizingMode = 'AUTO';
pie.fills = [];
cont.appendChild(pie);
pie.layoutSizingHorizontal = 'FILL';

const cuenta = txt('Mostrando 6 de 34 controles', 'cuerpo/chico', V.tenue, H.tenue);
pie.appendChild(cuenta);
cuenta.layoutSizingHorizontal = 'FILL';
cuenta.textAutoResize = 'HEIGHT';

for (const [n, activa] of [['1', true], ['2', false], ['3', false], ['4', false], ['5', false], ['6', false]]) {
  const b = figma.createFrame();
  b.name = 'Página ' + n;
  b.resize(30, 30);
  b.layoutMode = 'HORIZONTAL';
  b.primaryAxisAlignItems = 'CENTER';
  b.counterAxisAlignItems = 'CENTER';
  b.primaryAxisSizingMode = 'FIXED';
  b.counterAxisSizingMode = 'FIXED';
  b.fills = [activa ? paint(V.blanco, H.blanco) : paint(V.papel, H.papel)];
  b.strokes = [paint(V.bordeBase, H.bordeBase)];
  b.strokeWeight = 1;
  for (const k of ['topLeftRadius', 'topRightRadius', 'bottomLeftRadius', 'bottomRightRadius']) b.setBoundVariable(k, V.radioControl);
  pie.appendChild(b);
  b.appendChild(txt(n, 'etiqueta/chip', activa ? V.titulo : V.tenue, activa ? H.titulo : H.tenue));
}

return { createdNodeIds: [p.id, cont.id, panel.id], pantallaId: p.id };
