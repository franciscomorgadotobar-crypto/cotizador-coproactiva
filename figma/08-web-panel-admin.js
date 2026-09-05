// 08 — "Panel · Admin" (1440x900) en la página Gestión · web.
//
// Vista de cartera del rol Admin: qué comunidades administra, cuánto factura, qué
// contratos vencen y qué pasa en el embudo comercial. Requiere 02 y 03.

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
  alT: 'VariableID:2:23', crT: 'VariableID:2:26',
  radioControl: 'VariableID:3:18', radioPastilla: 'VariableID:3:20'
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
  alT: { r: 0.541, g: 0.373, b: 0.133 }, crT: { r: 0.576, g: 0.224, b: 0.169 }
};

const txt = (c, e, vv, hh) => {
  const t = figma.createText();
  t.characters = c; t.textStyleId = S(e); t.fills = [paint(vv, hh)];
  return t;
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
const kpiWeb = variante('KPI', 'tamaño=Web');
const badgeAdmin = variante('Badge de rol', 'rol=Admin');
const btnPri = variante('Botón', 'tipo=Primario, tamaño=Web');
const btnSec = variante('Botón', 'tipo=Secundario, tamaño=Web');
const chip = nom => variante('Chip de estado', `estado=${nom}`);

if (!barraLateral || !panelComp) {
  throw new Error('Faltan componentes: ejecuta primero 02-web-navegacion.js y 03-web-tabla.js');
}

// ------------------------------------------------------------------ Pantalla
const p = figma.createFrame();
p.name = 'Panel · Admin';
p.resize(1440, 900);
p.layoutMode = 'HORIZONTAL';
p.primaryAxisSizingMode = 'FIXED';
p.counterAxisSizingMode = 'FIXED';
p.clipsContent = true;
p.fills = [paint(V.fondoApp, H.fondoApp)];
web.appendChild(p);
p.x = 100; p.y = 1100;

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
const h = txt('Panel general', 'display/h2', V.titulo, H.titulo);
cabCol.appendChild(h);
h.layoutSizingHorizontal = 'FILL';
h.textAutoResize = 'HEIGHT';
const hs = txt('12 comunidades administradas · 1.284 unidades · septiembre 2025', 'cuerpo/chico', V.apagado, H.apagado);
cabCol.appendChild(hs);
hs.layoutSizingHorizontal = 'FILL';
hs.textAutoResize = 'HEIGHT';

if (badgeAdmin) cab.appendChild(badgeAdmin.createInstance());
for (const [comp, label] of [[btnSec, 'Exportar cartera'], [btnPri, 'Nueva comunidad']]) {
  if (!comp) continue;
  const b = comp.createInstance();
  cab.appendChild(b);
  const bt = b.children.find(n => n.type === 'TEXT');
  if (bt) bt.characters = label;
}

// ---------------------------------------------------------------------- KPIs
const kpis = figma.createFrame();
kpis.name = 'Indicadores';
kpis.layoutMode = 'HORIZONTAL';
kpis.itemSpacing = 16;
kpis.counterAxisSizingMode = 'AUTO';
kpis.fills = [];
cont.appendChild(kpis);
kpis.layoutSizingHorizontal = 'FILL';

// Honorarios netos del mes; el IVA se calcula como en el generador de propuestas.
for (const [etiqueta, dato, pie] of [
  ['Comunidades activas', '12', '2 en marcha blanca'],
  ['Honorarios del mes', '$18.400.000', 'neto, sin IVA'],
  ['Contratos por vencer', '3', 'en los próximos 60 días'],
  ['Embudo comercial', '$7.380.000', '7 oportunidades abiertas']
]) {
  if (!kpiWeb) break;
  const k = kpiWeb.createInstance();
  kpis.appendChild(k);
  k.layoutSizingHorizontal = 'FILL';
  const ts = k.children.filter(n => n.type === 'TEXT');
  if (ts[0]) ts[0].characters = etiqueta;
  if (ts[1]) ts[1].characters = dato;
  if (ts[2]) ts[2].characters = pie;
}

// -------------------------------------------------------------------- Paneles
const fila = figma.createFrame();
fila.name = 'Paneles';
fila.layoutMode = 'HORIZONTAL';
fila.itemSpacing = 16;
fila.counterAxisSizingMode = 'FIXED';
fila.fills = [];
cont.appendChild(fila);
fila.layoutSizingHorizontal = 'FILL';
fila.layoutSizingVertical = 'FILL';

const nuevoPanel = (titulo, accion, ancho) => {
  const inst = panelComp.createInstance();
  fila.appendChild(inst);
  if (ancho) {
    inst.resize(ancho, inst.height);
    inst.layoutSizingHorizontal = 'FIXED';
  } else {
    inst.layoutSizingHorizontal = 'FILL';
  }
  inst.layoutSizingVertical = 'FILL';
  const ts = inst.findAllWithCriteria({ types: ['TEXT'] });
  if (ts[0]) ts[0].characters = titulo;
  if (ts[1]) ts[1].characters = accion;
  return { inst, cuerpo: inst.findOne(n => n.name === 'Cuerpo') };
};

// Cartera de comunidades
const cartera = nuevoPanel('Cartera de comunidades', 'Ver todas', null);
for (const [comunidad, comuna, unidades, honorario, vence, estado] of [
  ['Edificio Parque Bustamante', 'Providencia', '84 unidades', '$1.800.000', 'mar 2026', 'Cumple'],
  ['Condominio Los Almendros', 'Las Condes', '42 casas', '$1.260.000', 'ene 2026', 'Cumple'],
  ['Edificio Costanera Norte', 'Vitacura', '120 unidades', '$2.520.000', 'oct 2025', 'Alerta'],
  ['Edificio Mirador del Parque', 'Ñuñoa', '96 unidades', '$1.980.000', 'jun 2026', 'Cumple'],
  ['Condominio Alto Macul', 'Macul', '60 casas', '$1.440.000', 'nov 2025', 'Alerta'],
  ['Edificio Plaza Ñuñoa', 'Ñuñoa', '54 unidades', '$1.180.000', 'ago 2026', 'Cumple']
]) {
  const f = figma.createFrame();
  f.name = 'Comunidad · ' + comunidad;
  f.layoutMode = 'HORIZONTAL';
  f.itemSpacing = 16;
  f.counterAxisAlignItems = 'CENTER';
  f.counterAxisSizingMode = 'AUTO';
  f.paddingTop = 12; f.paddingBottom = 12; f.paddingLeft = 18; f.paddingRight = 18;
  f.fills = [];
  bordeInferior(f);
  cartera.cuerpo.appendChild(f);
  f.layoutSizingHorizontal = 'FILL';

  const col = figma.createFrame();
  col.layoutMode = 'VERTICAL';
  col.itemSpacing = 2;
  col.counterAxisSizingMode = 'AUTO';
  col.fills = [];
  col.name = 'Comunidad';
  f.appendChild(col);
  col.layoutSizingHorizontal = 'FILL';
  const c1 = txt(comunidad, 'cuerpo/fuerte', V.titulo, H.titulo);
  col.appendChild(c1);
  c1.layoutSizingHorizontal = 'FILL';
  c1.textAutoResize = 'HEIGHT';
  const c2 = txt(comuna + ' · ' + unidades, 'cuerpo/micro', V.tenue, H.tenue);
  col.appendChild(c2);
  c2.layoutSizingHorizontal = 'FILL';
  c2.textAutoResize = 'HEIGHT';

  for (const [valor, ancho, estilo, vv, hh] of [
    [honorario, 120, 'cuerpo/campo', V.titulo, H.titulo],
    ['Vence ' + vence, 120, 'cuerpo/micro', estado === 'Alerta' ? V.alT : V.tenue, estado === 'Alerta' ? H.alT : H.tenue]
  ]) {
    const t = txt(valor, estilo, vv, hh);
    f.appendChild(t);
    t.textAutoResize = 'HEIGHT';
    t.resize(ancho, t.height);
    t.layoutSizingHorizontal = 'FIXED';
  }

  const chipComp = chip(estado);
  const cw = figma.createFrame();
  cw.name = 'Estado';
  cw.layoutMode = 'HORIZONTAL';
  cw.primaryAxisAlignItems = 'MAX';
  cw.counterAxisSizingMode = 'AUTO';
  cw.primaryAxisSizingMode = 'FIXED';
  cw.resize(140, 24);
  cw.fills = [];
  f.appendChild(cw);
  cw.layoutSizingHorizontal = 'FIXED';
  if (chipComp) cw.appendChild(chipComp.createInstance());
}

// Actividad reciente
const act = nuevoPanel('Actividad reciente', 'Ver bitácora', 380);
act.cuerpo.paddingTop = 4;
for (const [hora, texto, vv, hh] of [
  ['09:41', 'Comité Parque Bustamante escribió a contacto@coproactiva', V.pizarra, H.pizarra],
  ['09:12', 'Ana Pizarro envió el control de Costanera Norte con 1 hallazgo crítico', V.crT, H.crT],
  ['Ayer', 'Contrato de Los Almendros firmado por ambas partes', V.okT, H.okT],
  ['Ayer', 'Propuesta enviada a Edificio Los Aromos por $1.800.000 mensuales', V.naranja, H.naranja],
  ['2 sep', 'OT-1038 cerrada en Alto Macul', V.pizarra, H.pizarra],
  ['1 sep', 'Contrato de Costanera Norte vence en 45 días', V.alT, H.alT]
]) {
  const f = figma.createFrame();
  f.name = 'Actividad';
  f.layoutMode = 'HORIZONTAL';
  f.itemSpacing = 10;
  f.counterAxisAlignItems = 'MIN';
  f.counterAxisSizingMode = 'AUTO';
  f.paddingTop = 12; f.paddingBottom = 12; f.paddingLeft = 18; f.paddingRight = 18;
  f.fills = [];
  bordeInferior(f);
  act.cuerpo.appendChild(f);
  f.layoutSizingHorizontal = 'FILL';

  const punto = figma.createEllipse();
  punto.name = 'Punto';
  punto.resize(6, 6);
  punto.y = 5;
  punto.fills = [paint(vv, hh)];
  f.appendChild(punto);

  const col = figma.createFrame();
  col.layoutMode = 'VERTICAL';
  col.itemSpacing = 2;
  col.counterAxisSizingMode = 'AUTO';
  col.fills = [];
  col.name = 'Texto';
  f.appendChild(col);
  col.layoutSizingHorizontal = 'FILL';
  const t1 = txt(texto, 'cuerpo/chico', V.titulo, H.titulo);
  col.appendChild(t1);
  t1.layoutSizingHorizontal = 'FILL';
  t1.textAutoResize = 'HEIGHT';
  const t2 = txt(hora, 'cuerpo/micro', V.tenue, H.tenue);
  col.appendChild(t2);
  t2.layoutSizingHorizontal = 'FILL';
  t2.textAutoResize = 'HEIGHT';
}

return { createdNodeIds: [p.id, cont.id, cartera.inst.id, act.inst.id], pantallaId: p.id };
