// 04 — Tablero "Supervisión · Jefatura" (1440x900) en la página Gestión · web.
//
// Requiere los scripts 02 y 03 ya ejecutados: usa la Barra lateral y el Panel de
// sección. Los componentes se buscan por NOMBRE, no por ID, para no depender de lo
// que devolvieron esas ejecuciones.
//
// La página Fundaciones se carga como página actual (ahí viven los componentes) y la
// pantalla se crea en Gestión · web con page.loadAsync(), que carga una página sin
// cambiar la actual — setCurrentPageAsync solo puede llamarse una vez por script.

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
  naranja: 'VariableID:2:3', pizarra: 'VariableID:2:4', inverso: 'VariableID:2:19',
  okT: 'VariableID:2:20', radioControl: 'VariableID:3:18', radioTarjeta: 'VariableID:3:19',
  radioPastilla: 'VariableID:3:20'
};
const V = {};
await Promise.all(Object.entries(ids).map(async ([k, i]) => { V[k] = await gv(i); }));

const H = {
  fondoApp: { r: 0.902, g: 0.886, b: 0.867 }, blanco: { r: 1, g: 1, b: 1 },
  papel: { r: 0.969, g: 0.957, b: 0.941 }, niebla: { r: 0.914, g: 0.902, b: 0.886 },
  bordeBase: { r: 0.867, g: 0.843, b: 0.812 }, bordeSuave: { r: 0.914, g: 0.902, b: 0.886 },
  titulo: { r: 0.169, g: 0.192, b: 0.220 }, apagado: { r: 0.353, g: 0.388, b: 0.424 },
  tenue: { r: 0.545, g: 0.576, b: 0.608 }, naranja: { r: 0.835, g: 0.525, b: 0.231 },
  pizarra: { r: 0.290, g: 0.353, b: 0.408 }, inverso: { r: 1, g: 1, b: 1 },
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
const bordeInferior = n => {
  n.strokes = [paint(V.bordeSuave, H.bordeSuave)];
  n.strokeWeight = 1; n.strokeAlign = 'INSIDE';
  n.strokeTopWeight = 0; n.strokeLeftWeight = 0; n.strokeRightWeight = 0; n.strokeBottomWeight = 1;
};

// Componentes del sistema, por nombre
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

// ------------------------------------------------------------------ Pantalla
const p = figma.createFrame();
p.name = 'Supervisión · Jefatura';
p.resize(1440, 900);
p.layoutMode = 'HORIZONTAL';
p.primaryAxisSizingMode = 'FIXED';
p.counterAxisSizingMode = 'FIXED';
p.clipsContent = true;
p.itemSpacing = 0;
p.fills = [paint(V.fondoApp, H.fondoApp)];
web.appendChild(p);
p.x = 100; p.y = 100;

const barra = barraLateral.createInstance();
p.appendChild(barra);
barra.layoutSizingVertical = 'FILL';

const cont = figma.createFrame();
cont.name = 'Contenido';
cont.layoutMode = 'VERTICAL';
cont.itemSpacing = 24;
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
const h = txt('Supervisión de terreno', 'display/h2', V.titulo, H.titulo);
cabCol.appendChild(h);
h.layoutSizingHorizontal = 'FILL';
h.textAutoResize = 'HEIGHT';
const hs = txt('Viernes 5 de septiembre · 6 comunidades con visita programada', 'cuerpo/chico', V.apagado, H.apagado);
cabCol.appendChild(hs);
hs.layoutSizingHorizontal = 'FILL';
hs.textAutoResize = 'HEIGHT';

for (const [comp, label] of [[btnSec, 'Exportar informe'], [btnPri, 'Programar visita']]) {
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
  ['Controles enviados', '18', 'de 24 programados'],
  ['Hallazgos críticos', '3', 'en 2 comunidades'],
  ['OT abiertas', '11', '4 vencen esta semana'],
  ['Cumplimiento del mes', '92%', '+4 pts respecto de agosto']
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
  const cuerpo = inst.findOne(n => n.name === 'Cuerpo');
  return { inst, cuerpo };
};

// Panel izquierdo — controles del día en filas compactas
const izq = nuevoPanel('Controles de hoy', 'Ver todos', null);
for (const [comunidad, comuna, responsable, estado] of [
  ['Edificio Parque Bustamante', 'Providencia', 'Marcelo Ríos', 'En curso'],
  ['Condominio Los Almendros', 'Las Condes', 'Marcelo Ríos', 'Pendiente'],
  ['Edificio Costanera Norte', 'Vitacura', 'Ana Pizarro', 'Crítico'],
  ['Edificio Mirador del Parque', 'Ñuñoa', 'Ana Pizarro', 'Cumple'],
  ['Condominio Alto Macul', 'Macul', 'Jorge Vera', 'Cumple']
]) {
  const f = figma.createFrame();
  f.name = 'Control · ' + comunidad;
  f.layoutMode = 'HORIZONTAL';
  f.itemSpacing = 16;
  f.counterAxisAlignItems = 'CENTER';
  f.counterAxisSizingMode = 'AUTO';
  f.paddingTop = 13; f.paddingBottom = 13; f.paddingLeft = 18; f.paddingRight = 18;
  f.fills = [];
  bordeInferior(f);
  izq.cuerpo.appendChild(f);
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

  const r = txt(responsable, 'cuerpo/campo', V.apagado, H.apagado);
  f.appendChild(r);
  r.textAutoResize = 'HEIGHT';
  r.resize(140, r.height);
  r.layoutSizingHorizontal = 'FIXED';

  const chipComp = chip(estado) || chip('Pendiente');
  const cont2 = figma.createFrame();
  cont2.name = 'Estado';
  cont2.layoutMode = 'HORIZONTAL';
  cont2.primaryAxisAlignItems = 'MAX';
  cont2.counterAxisSizingMode = 'AUTO';
  cont2.primaryAxisSizingMode = 'FIXED';
  cont2.resize(140, 24);
  cont2.fills = [];
  f.appendChild(cont2);
  cont2.layoutSizingHorizontal = 'FIXED';
  if (chipComp) cont2.appendChild(chipComp.createInstance());
}

// Panel derecho — equipo en terreno, con mapa de referencia
const der = nuevoPanel('Equipo en terreno', 'Ver mapa', 380);

const mapa = figma.createFrame();
mapa.name = 'Mapa (marcador de posición)';
mapa.resize(342, 168);
mapa.fills = [paint(V.niebla, H.niebla)];
mapa.clipsContent = true;
der.cuerpo.appendChild(mapa);
mapa.layoutSizingHorizontal = 'FILL';
mapa.layoutSizingVertical = 'FIXED';
// El cuerpo del panel es vertical: el mapa necesita su propio margen.
der.cuerpo.paddingTop = 18; der.cuerpo.paddingLeft = 18; der.cuerpo.paddingRight = 18;
der.cuerpo.itemSpacing = 14;

for (const [x, y, w, hh] of [[0, 54, 342, 1.5], [0, 112, 342, 1.5], [92, 0, 1.5, 168], [232, 0, 1.5, 168]]) {
  const linea = figma.createRectangle();
  linea.name = 'Calle';
  linea.resize(w, hh);
  linea.x = x; linea.y = y;
  linea.fills = [paint(V.bordeBase, H.bordeBase)];
  mapa.appendChild(linea);
}
for (const [x, y, v, hx] of [[60, 32, V.naranja, H.naranja], [180, 88, V.naranja, H.naranja], [268, 130, V.pizarra, H.pizarra]]) {
  const m = figma.createEllipse();
  m.name = 'Marcador';
  m.resize(12, 12);
  m.x = x; m.y = y;
  m.fills = [paint(v, hx)];
  m.strokes = [paint(V.blanco, H.blanco)];
  m.strokeWeight = 2;
  mapa.appendChild(m);
}

const lista = figma.createFrame();
lista.name = 'Equipo';
lista.layoutMode = 'VERTICAL';
lista.itemSpacing = 0;
lista.counterAxisSizingMode = 'AUTO';
lista.fills = [];
der.cuerpo.appendChild(lista);
lista.layoutSizingHorizontal = 'FILL';

for (const [iniciales, nombre, detalle] of [
  ['MR', 'Marcelo Ríos', 'Parque Bustamante · check-in 11:34'],
  ['AP', 'Ana Pizarro', 'Costanera Norte · check-in 10:05'],
  ['JV', 'Jorge Vera', 'Alto Macul · sin check-in']
]) {
  const f = figma.createFrame();
  f.name = 'Persona · ' + nombre;
  f.layoutMode = 'HORIZONTAL';
  f.itemSpacing = 12;
  f.counterAxisAlignItems = 'CENTER';
  f.counterAxisSizingMode = 'AUTO';
  f.paddingTop = 12; f.paddingBottom = 12;
  f.fills = [];
  bordeInferior(f);
  lista.appendChild(f);
  f.layoutSizingHorizontal = 'FILL';

  const av = figma.createFrame();
  av.name = 'Avatar';
  av.resize(34, 34);
  av.layoutMode = 'HORIZONTAL';
  av.primaryAxisAlignItems = 'CENTER';
  av.counterAxisAlignItems = 'CENTER';
  av.primaryAxisSizingMode = 'FIXED';
  av.counterAxisSizingMode = 'FIXED';
  av.fills = [paint(V.papel, H.papel)];
  av.strokes = [paint(V.bordeBase, H.bordeBase)];
  av.strokeWeight = 1;
  radios(av, V.radioPastilla);
  f.appendChild(av);
  av.appendChild(txt(iniciales, 'etiqueta/chip', V.pizarra, H.pizarra));

  const col = figma.createFrame();
  col.layoutMode = 'VERTICAL';
  col.itemSpacing = 2;
  col.counterAxisSizingMode = 'AUTO';
  col.fills = [];
  col.name = 'Datos';
  f.appendChild(col);
  col.layoutSizingHorizontal = 'FILL';
  const n1 = txt(nombre, 'cuerpo/fuerte', V.titulo, H.titulo);
  col.appendChild(n1);
  n1.layoutSizingHorizontal = 'FILL';
  n1.textAutoResize = 'HEIGHT';
  const n2 = txt(detalle, 'cuerpo/micro', V.tenue, H.tenue);
  col.appendChild(n2);
  n2.layoutSizingHorizontal = 'FILL';
  n2.textAutoResize = 'HEIGHT';
}

return { createdNodeIds: [p.id, cont.id, izq.inst.id, der.inst.id], pantallaId: p.id };
