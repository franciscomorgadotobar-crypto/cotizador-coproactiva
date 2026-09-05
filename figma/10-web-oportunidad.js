// 10 — "Detalle de oportunidad" (1440x900) en la página Gestión · web.
//
// Es la pantalla que conecta el CRM con el generador de propuestas que ya existe en
// sitio/propuestas: la valorización reproduce exactamente computeAll() de
// propuesta-app.jsx — base por porcentaje da el neto, el neto por 19% da el IVA, y la
// suma da el total mensual. Los montos van en formato es-CL / CLP, como clp().
//
// Requiere 02 y 03.

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
  alT: 'VariableID:2:23', alF: 'VariableID:2:24', alB: 'VariableID:2:25',
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
  pizarra: { r: 0.290, g: 0.353, b: 0.408 }, okT: { r: 0.306, g: 0.420, b: 0.290 },
  alT: { r: 0.541, g: 0.373, b: 0.133 }, alF: { r: 0.992, g: 0.953, b: 0.902 },
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
const btnTxt = variante('Botón', 'tipo=Texto, tamaño=Web');
const chip = nom => variante('Chip de estado', `estado=${nom}`);

if (!barraLateral || !panelComp) {
  throw new Error('Faltan componentes: ejecuta primero 02-web-navegacion.js y 03-web-tabla.js');
}

// ------------------------------------------------------------------ Pantalla
const p = figma.createFrame();
p.name = 'Detalle de oportunidad';
p.resize(1440, 900);
p.layoutMode = 'HORIZONTAL';
p.primaryAxisSizingMode = 'FIXED';
p.counterAxisSizingMode = 'FIXED';
p.clipsContent = true;
p.fills = [paint(V.fondoApp, H.fondoApp)];
web.appendChild(p);
p.x = 3180; p.y = 1100;

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

const migas = txt('Oportunidades  ›  Propuesta enviada  ›  Edificio Vista Andes', 'cuerpo/micro', V.tenue, H.tenue);
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
const h = txt('Edificio Vista Andes', 'display/h2', V.titulo, H.titulo);
cabCol.appendChild(h);
h.layoutSizingHorizontal = 'FILL';
h.textAutoResize = 'HEIGHT';
const hs = txt('Av. Larraín 5820, La Reina · 72 unidades · contacto: Rodrigo Meza, presidente del comité', 'cuerpo/chico', V.apagado, H.apagado);
cabCol.appendChild(hs);
hs.layoutSizingHorizontal = 'FILL';
hs.textAutoResize = 'HEIGHT';

const chipAlerta = chip('Alerta');
if (chipAlerta) {
  const ci = chipAlerta.createInstance();
  cab.appendChild(ci);
}
for (const [comp, label] of [[btnSec, 'Enviar por correo'], [btnPri, 'Descargar propuesta']]) {
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

// --------------------------------------------------------------- Valorización
const val = nuevoPanel(colIzq, 'Valorización', 'Editar en el generador');

// Mismas operaciones que computeAll(): 20.000.000 x 9% = 1.800.000 neto;
// 1.800.000 x 19% = 342.000 de IVA; total 2.142.000.
const lineas = [
  ['Gasto común mensual (base de cálculo)', '$20.000.000', false, V.apagado, H.apagado],
  ['Honorario de administración', '9%', false, V.apagado, H.apagado],
  ['Honorario neto mensual', '$1.800.000', false, V.titulo, H.titulo],
  ['IVA (19%)', '$342.000', false, V.apagado, H.apagado],
  ['Total mensual con IVA', '$2.142.000', true, V.titulo, H.titulo]
];

for (const [etiqueta, monto, destacado, vv, hh] of lineas) {
  const f = figma.createFrame();
  f.name = etiqueta;
  f.layoutMode = 'HORIZONTAL';
  f.itemSpacing = 16;
  f.counterAxisAlignItems = 'CENTER';
  f.counterAxisSizingMode = 'AUTO';
  f.paddingTop = destacado ? 16 : 13;
  f.paddingBottom = destacado ? 16 : 13;
  f.paddingLeft = 18; f.paddingRight = 18;
  f.fills = destacado ? [paint(V.papel, H.papel)] : [];
  if (!destacado) bordeInferior(f);
  val.cuerpo.appendChild(f);
  f.layoutSizingHorizontal = 'FILL';

  const e = txt(etiqueta, destacado ? 'etiqueta/grupo' : 'cuerpo/campo', vv, hh);
  f.appendChild(e);
  e.layoutSizingHorizontal = 'FILL';
  e.textAutoResize = 'HEIGHT';
  const m = txt(monto, destacado ? 'display/dato-chico' : 'cuerpo/fuerte', vv, hh);
  f.appendChild(m);
  m.textAutoResize = 'HEIGHT';
}

// Aviso con el mismo tratamiento ámbar del generador de propuestas.
const aviso = figma.createFrame();
aviso.name = 'Aviso';
aviso.layoutMode = 'VERTICAL';
aviso.counterAxisSizingMode = 'AUTO';
aviso.paddingTop = 10; aviso.paddingBottom = 10; aviso.paddingLeft = 12; aviso.paddingRight = 12;
aviso.fills = [paint(V.alF, H.alF)];
aviso.strokes = [paint(V.alB, H.alB)];
aviso.strokeWeight = 1;
radios(aviso, V.radioControl);
const avisoCont = figma.createFrame();
avisoCont.name = 'Margen';
avisoCont.layoutMode = 'VERTICAL';
avisoCont.counterAxisSizingMode = 'AUTO';
avisoCont.paddingTop = 14; avisoCont.paddingBottom = 16; avisoCont.paddingLeft = 18; avisoCont.paddingRight = 18;
avisoCont.fills = [];
val.cuerpo.appendChild(avisoCont);
avisoCont.layoutSizingHorizontal = 'FILL';
avisoCont.appendChild(aviso);
aviso.layoutSizingHorizontal = 'FILL';
const avisoT = txt('Los valores son referenciales y se ajustan al gasto común efectivo de cada mes. El honorario habitual va entre 8% y 10%.', 'cuerpo/chico', V.alT, H.alT);
aviso.appendChild(avisoT);
avisoT.layoutSizingHorizontal = 'FILL';
avisoT.textAutoResize = 'HEIGHT';

// ------------------------------------------------------------- Antecedentes
const ant = nuevoPanel(colIzq, 'Condiciones de la propuesta', 'Historial de versiones');
const condiciones = [
  ['Vigencia de la propuesta', '30 días desde el 1 de septiembre'],
  ['Duración del contrato', '12 meses renovables'],
  ['Plazo de pago', '5 días corridos desde la facturación'],
  ['Inicio estimado', '1 de octubre de 2025']
];
for (const [etiqueta, valor] of condiciones) {
  const f = figma.createFrame();
  f.name = etiqueta;
  f.layoutMode = 'HORIZONTAL';
  f.itemSpacing = 16;
  f.counterAxisAlignItems = 'CENTER';
  f.counterAxisSizingMode = 'AUTO';
  f.paddingTop = 12; f.paddingBottom = 12; f.paddingLeft = 18; f.paddingRight = 18;
  f.fills = [];
  bordeInferior(f);
  ant.cuerpo.appendChild(f);
  f.layoutSizingHorizontal = 'FILL';
  const e = txt(etiqueta, 'cuerpo/campo', V.apagado, H.apagado);
  f.appendChild(e);
  e.layoutSizingHorizontal = 'FILL';
  e.textAutoResize = 'HEIGHT';
  const v = txt(valor, 'cuerpo/fuerte', V.titulo, H.titulo);
  f.appendChild(v);
  v.textAutoResize = 'HEIGHT';
}

// -------------------------------------------------------------- Seguimiento
const seg = nuevoPanel(colDer, 'Seguimiento', 'Agendar');
for (const [etiqueta, valor, vv, hh] of [
  ['Etapa', 'Propuesta enviada · hace 4 días', V.alT, H.alT],
  ['Responsable', 'Paula Sepúlveda · Jefatura', V.titulo, H.titulo],
  ['Próxima acción', 'Llamar al comité el 8 de septiembre', V.titulo, H.titulo],
  ['Origen', 'Recomendación de Edificio Mirador del Parque', V.apagado, H.apagado]
]) {
  const f = figma.createFrame();
  f.name = etiqueta;
  f.layoutMode = 'VERTICAL';
  f.itemSpacing = 3;
  f.counterAxisSizingMode = 'AUTO';
  f.paddingTop = 12; f.paddingBottom = 12; f.paddingLeft = 18; f.paddingRight = 18;
  f.fills = [];
  bordeInferior(f);
  seg.cuerpo.appendChild(f);
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

// --------------------------------------------------------------- Documentos
const doc = nuevoPanel(colDer, 'Documentos', 'Subir');
for (const [nombre, meta, accion] of [
  ['Propuesta comercial · v2', 'PDF · 4 páginas · 1 de septiembre', 'Descargar'],
  ['Borrador de contrato', 'Generado desde la propuesta · sin firmar', 'Abrir'],
  ['Reglamento de copropiedad', 'Enviado por el comité · 28 de agosto', 'Descargar']
]) {
  const f = figma.createFrame();
  f.name = nombre;
  f.layoutMode = 'HORIZONTAL';
  f.itemSpacing = 12;
  f.counterAxisAlignItems = 'CENTER';
  f.counterAxisSizingMode = 'AUTO';
  f.paddingTop = 12; f.paddingBottom = 12; f.paddingLeft = 18; f.paddingRight = 18;
  f.fills = [];
  bordeInferior(f);
  doc.cuerpo.appendChild(f);
  f.layoutSizingHorizontal = 'FILL';

  const ico = figma.createNodeFromSvg('<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 3.5h8L19 8v12.5H6z" stroke="#8b939b" stroke-width="1.6" stroke-linejoin="round"/><path d="M14 3.5V8h5" stroke="#8b939b" stroke-width="1.6" stroke-linejoin="round"/></svg>');
  ico.name = 'icono/documento';
  ico.resize(18, 18);
  f.appendChild(ico);

  const col = figma.createFrame();
  col.layoutMode = 'VERTICAL';
  col.itemSpacing = 2;
  col.counterAxisSizingMode = 'AUTO';
  col.fills = [];
  col.name = 'Texto';
  f.appendChild(col);
  col.layoutSizingHorizontal = 'FILL';
  const t1 = txt(nombre, 'cuerpo/chico', V.titulo, H.titulo);
  col.appendChild(t1);
  t1.layoutSizingHorizontal = 'FILL';
  t1.textAutoResize = 'HEIGHT';
  const t2 = txt(meta, 'cuerpo/micro', V.tenue, H.tenue);
  col.appendChild(t2);
  t2.layoutSizingHorizontal = 'FILL';
  t2.textAutoResize = 'HEIGHT';

  f.appendChild(txt(accion, 'etiqueta/chip', V.naranja, H.naranja));
}

// Registro de envío: deja explícito desde qué casilla salió el correo.
const envio = figma.createFrame();
envio.name = 'Último envío';
envio.layoutMode = 'VERTICAL';
envio.itemSpacing = 3;
envio.counterAxisSizingMode = 'AUTO';
envio.paddingTop = 12; envio.paddingBottom = 14; envio.paddingLeft = 18; envio.paddingRight = 18;
envio.fills = [];
doc.cuerpo.appendChild(envio);
envio.layoutSizingHorizontal = 'FILL';
const e1 = txt('Último envío', 'etiqueta/campo', V.tenue, H.tenue);
envio.appendChild(e1);
e1.layoutSizingHorizontal = 'FILL';
e1.textAutoResize = 'HEIGHT';
const e2 = txt('1 sep, 14:20 · de contacto@coproactiva.cl a rmeza@vistaandes.cl', 'cuerpo/micro', V.okT, H.okT);
envio.appendChild(e2);
e2.layoutSizingHorizontal = 'FILL';
e2.textAutoResize = 'HEIGHT';

return {
  createdNodeIds: [p.id, cont.id, val.inst.id, ant.inst.id, seg.inst.id, doc.inst.id],
  pantallaId: p.id
};
