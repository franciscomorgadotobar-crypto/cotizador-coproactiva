// 09 — "CRM · Oportunidades" (1440x900) en la página Gestión · web.
//
// Embudo comercial en cuatro columnas. Requiere 02, 03 y 07.
//
// Los montos son honorarios netos mensuales calculados como en el generador de
// propuestas: gasto común base por el porcentaje pactado (9% de referencia).

const fund = figma.root.children.find(p => p.name === 'Fundaciones');
await figma.setCurrentPageAsync(fund);
const web = figma.root.children.find(p => p.name === 'Gestión · web');
await web.loadAsync();

await Promise.all([
  figma.loadFontAsync({ family: 'Montserrat', style: 'Light' }),
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
  naranja: 'VariableID:2:3', pizarra: 'VariableID:2:4', okT: 'VariableID:2:20',
  alT: 'VariableID:2:23', radioControl: 'VariableID:3:18'
};
const V = {};
await Promise.all(Object.entries(ids).map(async ([k, i]) => { V[k] = await gv(i); }));

const H = {
  fondoApp: { r: 0.902, g: 0.886, b: 0.867 }, blanco: { r: 1, g: 1, b: 1 },
  papel: { r: 0.969, g: 0.957, b: 0.941 }, niebla: { r: 0.914, g: 0.902, b: 0.886 },
  bordeBase: { r: 0.867, g: 0.843, b: 0.812 }, bordeSuave: { r: 0.914, g: 0.902, b: 0.886 },
  titulo: { r: 0.169, g: 0.192, b: 0.220 }, apagado: { r: 0.353, g: 0.388, b: 0.424 },
  tenue: { r: 0.545, g: 0.576, b: 0.608 }, naranja: { r: 0.835, g: 0.525, b: 0.231 },
  pizarra: { r: 0.290, g: 0.353, b: 0.408 }, okT: { r: 0.306, g: 0.420, b: 0.290 },
  alT: { r: 0.541, g: 0.373, b: 0.133 }
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
const btnPri = variante('Botón', 'tipo=Primario, tamaño=Web');
const btnSec = variante('Botón', 'tipo=Secundario, tamaño=Web');
const oportunidad = etapa => variante('Tarjeta de oportunidad', `etapa=${etapa}`);

if (!barraLateral || !oportunidad('Contacto')) {
  throw new Error('Faltan componentes: ejecuta primero 02-web-navegacion.js y 07-web-componentes-2.js');
}

// ------------------------------------------------------------------ Pantalla
const p = figma.createFrame();
p.name = 'CRM · Oportunidades';
p.resize(1440, 900);
p.layoutMode = 'HORIZONTAL';
p.primaryAxisSizingMode = 'FIXED';
p.counterAxisSizingMode = 'FIXED';
p.clipsContent = true;
p.fills = [paint(V.fondoApp, H.fondoApp)];
web.appendChild(p);
p.x = 1640; p.y = 1100;

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
const h = txt('Oportunidades', 'display/h2', V.titulo, H.titulo);
cabCol.appendChild(h);
h.layoutSizingHorizontal = 'FILL';
h.textAutoResize = 'HEIGHT';
const hs = txt('7 comunidades en el embudo · $7.380.000 en honorarios mensuales potenciales', 'cuerpo/chico', V.apagado, H.apagado);
cabCol.appendChild(hs);
hs.layoutSizingHorizontal = 'FILL';
hs.textAutoResize = 'HEIGHT';

for (const [comp, label] of [[btnSec, 'Ver por lista'], [btnPri, 'Nueva oportunidad']]) {
  if (!comp) continue;
  const b = comp.createInstance();
  cab.appendChild(b);
  const bt = b.children.find(n => n.type === 'TEXT');
  if (bt) bt.characters = label;
}

// -------------------------------------------------------------------- Embudo
const tablero = figma.createFrame();
tablero.name = 'Embudo';
tablero.layoutMode = 'HORIZONTAL';
tablero.itemSpacing = 16;
tablero.counterAxisSizingMode = 'FIXED';
tablero.fills = [];
cont.appendChild(tablero);
tablero.layoutSizingHorizontal = 'FILL';
tablero.layoutSizingVertical = 'FILL';

// Cada columna: etapa, total, y las oportunidades que van en ella.
const columnas = [
  ['Contacto', 'Contacto inicial', '$2.520.000', [
    ['Edificio Los Aromos', 'Providencia · 96 unidades', '$1.260.000', '12 días en contacto inicial'],
    ['Condominio El Peral', 'Peñalolén · 38 casas', '$1.260.000', 'Primera reunión el 9 de sep']
  ]],
  ['Propuesta', 'Propuesta enviada', '$3.060.000', [
    ['Edificio Vista Andes', 'La Reina · 72 unidades', '$1.800.000', 'Propuesta enviada hace 4 días'],
    ['Edificio Santa Elena', 'Ñuñoa · 48 unidades', '$1.260.000', 'Propuesta enviada hace 9 días']
  ]],
  ['Negociación', 'En negociación', '$2.340.000', [
    ['Condominio Vallemar', 'Colina · 110 casas', '$2.340.000', 'Reunión de directorio el 11 de sep']
  ]],
  ['Ganada', 'Ganadas este mes', '$3.240.000', [
    ['Edificio Plaza Ñuñoa', 'Ñuñoa · 54 unidades', '$1.180.000', 'Contrato firmado el 2 de sep'],
    ['Condominio Alto Macul', 'Macul · 60 casas', '$2.060.000', 'Contrato en firma']
  ]]
];

const creados = [p.id, cont.id];

for (const [etapa, titulo, total, items] of columnas) {
  const col = figma.createFrame();
  col.name = 'Columna · ' + titulo;
  col.layoutMode = 'VERTICAL';
  col.itemSpacing = 10;
  col.counterAxisSizingMode = 'FIXED';
  col.paddingTop = 14; col.paddingBottom = 14; col.paddingLeft = 12; col.paddingRight = 12;
  col.fills = [paint(V.papel, H.papel)];
  col.strokes = [paint(V.bordeSuave, H.bordeSuave)];
  col.strokeWeight = 1;
  col.clipsContent = true;
  tablero.appendChild(col);
  col.layoutSizingHorizontal = 'FILL';
  col.layoutSizingVertical = 'FILL';
  creados.push(col.id);

  const colCab = figma.createFrame();
  colCab.name = 'Cabecera';
  colCab.layoutMode = 'VERTICAL';
  colCab.itemSpacing = 3;
  colCab.counterAxisSizingMode = 'AUTO';
  colCab.paddingBottom = 10; colCab.paddingLeft = 2;
  colCab.fills = [];
  colCab.strokes = [paint(V.bordeBase, H.bordeBase)];
  colCab.strokeWeight = 1; colCab.strokeAlign = 'INSIDE';
  colCab.strokeTopWeight = 0; colCab.strokeLeftWeight = 0; colCab.strokeRightWeight = 0; colCab.strokeBottomWeight = 1;
  col.appendChild(colCab);
  colCab.layoutSizingHorizontal = 'FILL';

  const ct = txt(`${titulo} · ${items.length}`, 'etiqueta/grupo', V.titulo, H.titulo);
  colCab.appendChild(ct);
  ct.layoutSizingHorizontal = 'FILL';
  ct.textAutoResize = 'HEIGHT';
  const cv = txt(total + ' mensuales', 'cuerpo/micro', V.tenue, H.tenue);
  colCab.appendChild(cv);
  cv.layoutSizingHorizontal = 'FILL';
  cv.textAutoResize = 'HEIGHT';

  const comp = oportunidad(etapa);
  for (const [nombre, meta, valor, detalle] of items) {
    if (!comp) break;
    const i = comp.createInstance();
    col.appendChild(i);
    i.layoutSizingHorizontal = 'FILL';
    // Orden de documento en la tarjeta: nombre, meta, valor, "mensual", detalle.
    const ts = i.findAllWithCriteria({ types: ['TEXT'] });
    if (ts[0]) ts[0].characters = nombre;
    if (ts[1]) ts[1].characters = meta;
    if (ts[2]) ts[2].characters = valor;
    if (ts[4]) ts[4].characters = detalle;
  }
}

return { createdNodeIds: creados, pantallaId: p.id };
