// 11 — "Contratos" (1440x900) en la página Gestión · web.
//
// Contratos vigentes, su estado de firma y los que vencen. El honorario mostrado es el
// neto mensual pactado, mismo criterio que el generador de propuestas. Requiere 02 y 03.

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
  bordeBase: 'VariableID:2:11', bordeSuave: 'VariableID:2:12', titulo: 'VariableID:2:14',
  apagado: 'VariableID:2:16', tenue: 'VariableID:2:18', naranja: 'VariableID:2:3',
  okT: 'VariableID:2:20', alT: 'VariableID:2:23', crT: 'VariableID:2:26',
  radioControl: 'VariableID:3:18'
};
const V = {};
await Promise.all(Object.entries(ids).map(async ([k, i]) => { V[k] = await gv(i); }));

const H = {
  fondoApp: { r: 0.902, g: 0.886, b: 0.867 }, blanco: { r: 1, g: 1, b: 1 },
  papel: { r: 0.969, g: 0.957, b: 0.941 }, bordeBase: { r: 0.867, g: 0.843, b: 0.812 },
  bordeSuave: { r: 0.914, g: 0.902, b: 0.886 }, titulo: { r: 0.169, g: 0.192, b: 0.220 },
  apagado: { r: 0.353, g: 0.388, b: 0.424 }, tenue: { r: 0.545, g: 0.576, b: 0.608 },
  naranja: { r: 0.835, g: 0.525, b: 0.231 }, okT: { r: 0.306, g: 0.420, b: 0.290 },
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
const btnPri = variante('Botón', 'tipo=Primario, tamaño=Web');
const btnSec = variante('Botón', 'tipo=Secundario, tamaño=Web');
const chip = nom => variante('Chip de estado', `estado=${nom}`);

if (!barraLateral || !panelComp) {
  throw new Error('Faltan componentes: ejecuta primero 02-web-navegacion.js y 03-web-tabla.js');
}

const p = figma.createFrame();
p.name = 'Contratos';
p.resize(1440, 900);
p.layoutMode = 'HORIZONTAL';
p.primaryAxisSizingMode = 'FIXED';
p.counterAxisSizingMode = 'FIXED';
p.clipsContent = true;
p.fills = [paint(V.fondoApp, H.fondoApp)];
web.appendChild(p);
p.x = 100; p.y = 2100;

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
const h = txt('Contratos', 'display/h2', V.titulo, H.titulo);
cabCol.appendChild(h);
h.layoutSizingHorizontal = 'FILL';
h.textAutoResize = 'HEIGHT';
const hs = txt('12 contratos vigentes · 3 vencen en los próximos 60 días · 2 en proceso de firma', 'cuerpo/chico', V.apagado, H.apagado);
cabCol.appendChild(hs);
hs.layoutSizingHorizontal = 'FILL';
hs.textAutoResize = 'HEIGHT';

for (const [comp, label] of [[btnSec, 'Plantillas'], [btnPri, 'Generar contrato']]) {
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
for (const [etiqueta, dato, pie] of [
  ['Contratos vigentes', '12', '$18.400.000 netos mensuales'],
  ['Vencen en 60 días', '3', 'renovación por confirmar'],
  ['En proceso de firma', '2', 'esperando al comité']
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

const lista = nuevoPanel('Contratos vigentes', 'Ver archivados', null);

// Encabezado de columnas propio: la tabla de contratos no comparte anchos con la
// bandeja de controles, así que no reutiliza el componente Encabezado de tabla.
const COLS = { numero: 110, inicio: 96, vigencia: 110, honorario: 120, estado: 140 };
const cabTabla = figma.createFrame();
cabTabla.name = 'Encabezado';
cabTabla.layoutMode = 'HORIZONTAL';
cabTabla.itemSpacing = 16;
cabTabla.counterAxisAlignItems = 'CENTER';
cabTabla.counterAxisSizingMode = 'AUTO';
cabTabla.paddingTop = 10; cabTabla.paddingBottom = 10; cabTabla.paddingLeft = 18; cabTabla.paddingRight = 18;
cabTabla.fills = [paint(V.papel, H.papel)];
bordeInferior(cabTabla);
lista.cuerpo.appendChild(cabTabla);
cabTabla.layoutSizingHorizontal = 'FILL';
for (const [etiqueta, ancho] of [
  ['Comunidad', 0], ['N° contrato', COLS.numero], ['Inicio', COLS.inicio],
  ['Vigencia', COLS.vigencia], ['Honorario neto', COLS.honorario], ['Estado', COLS.estado]
]) {
  const t = txt(etiqueta, 'etiqueta/tabla', V.tenue, H.tenue);
  cabTabla.appendChild(t);
  if (ancho === 0) {
    t.layoutSizingHorizontal = 'FILL';
  } else {
    t.textAutoResize = 'HEIGHT';
    t.resize(ancho, t.height);
    t.layoutSizingHorizontal = 'FIXED';
  }
}

for (const [comunidad, comuna, numero, inicio, vigencia, honorario, estado] of [
  ['Edificio Parque Bustamante', 'Providencia · 84 unidades', 'CT-2024-07', 'mar 2024', '24 meses', '$1.800.000', 'Cumple'],
  ['Condominio Los Almendros', 'Las Condes · 42 casas', 'CT-2025-02', 'ene 2025', '12 meses', '$1.260.000', 'Cumple'],
  ['Edificio Costanera Norte', 'Vitacura · 120 unidades', 'CT-2023-11', 'oct 2023', '24 meses', '$2.520.000', 'Alerta'],
  ['Edificio Mirador del Parque', 'Ñuñoa · 96 unidades', 'CT-2024-14', 'jun 2024', '24 meses', '$1.980.000', 'Cumple'],
  ['Condominio Alto Macul', 'Macul · 60 casas', 'CT-2024-21', 'nov 2024', '12 meses', '$1.440.000', 'Alerta'],
  ['Edificio Plaza Ñuñoa', 'Ñuñoa · 54 unidades', 'CT-2025-09', 'sep 2025', '12 meses', '$1.180.000', 'Pendiente']
]) {
  const f = figma.createFrame();
  f.name = 'Contrato · ' + numero;
  f.layoutMode = 'HORIZONTAL';
  f.itemSpacing = 16;
  f.counterAxisAlignItems = 'CENTER';
  f.counterAxisSizingMode = 'AUTO';
  f.paddingTop = 13; f.paddingBottom = 13; f.paddingLeft = 18; f.paddingRight = 18;
  f.fills = [];
  bordeInferior(f);
  lista.cuerpo.appendChild(f);
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
  const c2 = txt(comuna, 'cuerpo/micro', V.tenue, H.tenue);
  col.appendChild(c2);
  c2.layoutSizingHorizontal = 'FILL';
  c2.textAutoResize = 'HEIGHT';

  for (const [valor, ancho, estilo, vv, hh] of [
    [numero, COLS.numero, 'cuerpo/campo', V.apagado, H.apagado],
    [inicio, COLS.inicio, 'cuerpo/campo', V.apagado, H.apagado],
    [vigencia, COLS.vigencia, 'cuerpo/campo', V.apagado, H.apagado],
    [honorario, COLS.honorario, 'cuerpo/fuerte', V.titulo, H.titulo]
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
  cw.counterAxisSizingMode = 'AUTO';
  cw.primaryAxisSizingMode = 'FIXED';
  cw.resize(COLS.estado, 24);
  cw.fills = [];
  f.appendChild(cw);
  cw.layoutSizingHorizontal = 'FIXED';
  if (chipComp) cw.appendChild(chipComp.createInstance());
}

// Panel lateral — renovaciones
const ren = nuevoPanel('Renovaciones', 'Ver todas', 380);
ren.cuerpo.paddingTop = 4;
for (const [comunidad, dias, honorario, urgente] of [
  ['Edificio Costanera Norte', 'Vence en 26 días', '$2.520.000', true],
  ['Condominio Alto Macul', 'Vence en 57 días', '$1.440.000', false],
  ['Edificio Las Encinas', 'Vence en 58 días', '$1.620.000', false]
]) {
  const f = figma.createFrame();
  f.name = 'Renovación · ' + comunidad;
  f.layoutMode = 'VERTICAL';
  f.itemSpacing = 8;
  f.counterAxisSizingMode = 'AUTO';
  f.paddingTop = 14; f.paddingBottom = 14; f.paddingLeft = 18; f.paddingRight = 18;
  f.fills = [];
  bordeInferior(f);
  ren.cuerpo.appendChild(f);
  f.layoutSizingHorizontal = 'FILL';

  const t1 = txt(comunidad, 'cuerpo/fuerte', V.titulo, H.titulo);
  f.appendChild(t1);
  t1.layoutSizingHorizontal = 'FILL';
  t1.textAutoResize = 'HEIGHT';

  const meta = figma.createFrame();
  meta.layoutMode = 'HORIZONTAL';
  meta.itemSpacing = 8;
  meta.counterAxisSizingMode = 'AUTO';
  meta.fills = [];
  meta.name = 'Meta';
  f.appendChild(meta);
  meta.layoutSizingHorizontal = 'FILL';
  const t2 = txt(dias, 'cuerpo/micro', urgente ? V.crT : V.alT, urgente ? H.crT : H.alT);
  meta.appendChild(t2);
  t2.layoutSizingHorizontal = 'FILL';
  t2.textAutoResize = 'HEIGHT';
  meta.appendChild(txt(honorario, 'cuerpo/micro', V.apagado, H.apagado));

  if (btnSec) {
    const b = btnSec.createInstance();
    f.appendChild(b);
    b.layoutSizingHorizontal = 'FILL';
    const bt = b.children.find(n => n.type === 'TEXT');
    if (bt) bt.characters = 'Preparar renovación';
  }
}

return { createdNodeIds: [p.id, cont.id, lista.inst.id, ren.inst.id], pantallaId: p.id };
