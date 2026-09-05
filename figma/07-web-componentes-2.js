// 07 — Componentes de los módulos comerciales y de gestión:
// "Tarjeta de oportunidad", "Celda de calendario" y "Fila de conversación".
//
// Los usan los scripts 09 (CRM), 12 (Calendario), 13 (Correo) y 14 (Mensajes móvil).
// Se crean en la página Fundaciones, bajo los componentes ya existentes.

const page = figma.root.children.find(p => p.name === 'Fundaciones');
await figma.setCurrentPageAsync(page);
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
  blanco: 'VariableID:2:9', papel: 'VariableID:2:6', niebla: 'VariableID:2:7',
  bordeBase: 'VariableID:2:11', bordeSuave: 'VariableID:2:12', titulo: 'VariableID:2:14',
  apagado: 'VariableID:2:16', tenue: 'VariableID:2:18', naranja: 'VariableID:2:3',
  pizarra: 'VariableID:2:4', okT: 'VariableID:2:20', alT: 'VariableID:2:23',
  crT: 'VariableID:2:26', infoT: 'VariableID:2:29',
  radioControl: 'VariableID:3:18', radioTarjeta: 'VariableID:3:19', radioPastilla: 'VariableID:3:20'
};
const V = {};
await Promise.all(Object.entries(ids).map(async ([k, i]) => { V[k] = await gv(i); }));

const H = {
  blanco: { r: 1, g: 1, b: 1 }, papel: { r: 0.969, g: 0.957, b: 0.941 },
  niebla: { r: 0.914, g: 0.902, b: 0.886 }, bordeBase: { r: 0.867, g: 0.843, b: 0.812 },
  bordeSuave: { r: 0.914, g: 0.902, b: 0.886 }, titulo: { r: 0.169, g: 0.192, b: 0.220 },
  apagado: { r: 0.353, g: 0.388, b: 0.424 }, tenue: { r: 0.545, g: 0.576, b: 0.608 },
  naranja: { r: 0.835, g: 0.525, b: 0.231 }, pizarra: { r: 0.290, g: 0.353, b: 0.408 },
  okT: { r: 0.306, g: 0.420, b: 0.290 }, alT: { r: 0.541, g: 0.373, b: 0.133 },
  crT: { r: 0.576, g: 0.224, b: 0.169 }, infoT: { r: 0.290, g: 0.353, b: 0.408 }
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
const creados = [];

// ------------------------------------------------------ Tarjeta de oportunidad
// El valor mensual usa el mismo cálculo del generador de propuestas: gasto común
// base por el porcentaje de honorario. El total con IVA se muestra en el detalle.
const etapas = [
  ['Contacto', V.pizarra, H.pizarra, '$1.260.000', '12 días en contacto inicial'],
  ['Propuesta', V.naranja, H.naranja, '$1.800.000', 'Propuesta enviada hace 4 días'],
  ['Negociación', V.alT, H.alT, '$2.340.000', 'Reunión de directorio el 11 de sep'],
  ['Ganada', V.okT, H.okT, '$1.980.000', 'Contrato en firma']
];

const tarjetas = [];
for (const [etapa, vAcento, hAcento, valor, detalle] of etapas) {
  const c = figma.createComponent();
  c.name = `etapa=${etapa}`;
  c.layoutMode = 'VERTICAL';
  c.itemSpacing = 8;
  c.counterAxisSizingMode = 'FIXED';
  c.resize(268, 120);
  c.primaryAxisSizingMode = 'AUTO';
  c.paddingTop = 14; c.paddingBottom = 14; c.paddingLeft = 14; c.paddingRight = 14;
  c.fills = [paint(V.blanco, H.blanco)];
  c.strokes = [paint(V.bordeBase, H.bordeBase)];
  c.strokeWeight = 1;
  radios(c, V.radioTarjeta);

  // Filete de color: marca la etapa sin recurrir a un chip más en la tarjeta.
  const filete = figma.createRectangle();
  filete.name = 'Filete de etapa';
  filete.resize(28, 3);
  filete.fills = [paint(vAcento, hAcento)];
  filete.cornerRadius = 2;
  c.appendChild(filete);

  const nombre = txt('Edificio Los Aromos', 'cuerpo/fuerte', V.titulo, H.titulo);
  c.appendChild(nombre);
  nombre.layoutSizingHorizontal = 'FILL';
  nombre.textAutoResize = 'HEIGHT';

  const meta = txt('Providencia · 96 unidades', 'cuerpo/micro', V.tenue, H.tenue);
  c.appendChild(meta);
  meta.layoutSizingHorizontal = 'FILL';
  meta.textAutoResize = 'HEIGHT';

  const fila = figma.createFrame();
  fila.name = 'Valor';
  fila.layoutMode = 'HORIZONTAL';
  fila.itemSpacing = 8;
  fila.counterAxisAlignItems = 'CENTER';
  fila.counterAxisSizingMode = 'AUTO';
  fila.paddingTop = 8;
  fila.fills = [];
  c.appendChild(fila);
  fila.layoutSizingHorizontal = 'FILL';
  const val = txt(valor, 'display/dato-chico', V.titulo, H.titulo);
  fila.appendChild(val);
  val.layoutSizingHorizontal = 'FILL';
  val.textAutoResize = 'HEIGHT';
  fila.appendChild(txt('mensual', 'cuerpo/micro', V.tenue, H.tenue));

  const det = txt(detalle, 'cuerpo/micro', vAcento, hAcento);
  c.appendChild(det);
  det.layoutSizingHorizontal = 'FILL';
  det.textAutoResize = 'HEIGHT';

  tarjetas.push(c);
}

const setOportunidad = figma.combineAsVariants(tarjetas, page);
setOportunidad.name = 'Tarjeta de oportunidad';
setOportunidad.description = 'Comunidad en el embudo comercial. El valor mensual es el honorario neto: gasto común base por el porcentaje pactado, igual que en el generador de propuestas.';
setOportunidad.x = 80; setOportunidad.y = 3600;
setOportunidad.layoutMode = 'HORIZONTAL';
setOportunidad.itemSpacing = 20;
setOportunidad.paddingTop = 24; setOportunidad.paddingBottom = 24; setOportunidad.paddingLeft = 24; setOportunidad.paddingRight = 24;
setOportunidad.primaryAxisSizingMode = 'AUTO';
setOportunidad.counterAxisSizingMode = 'AUTO';
creados.push(setOportunidad.id, ...tarjetas.map(t => t.id));

// -------------------------------------------------------- Celda de calendario
// Tres slots de evento: en cada instancia se ocultan los que sobran con visible=false.
const celdas = [];
for (const tipo of ['Normal', 'Hoy', 'Otro mes']) {
  const c = figma.createComponent();
  c.name = `tipo=${tipo}`;
  c.layoutMode = 'VERTICAL';
  c.itemSpacing = 5;
  c.counterAxisSizingMode = 'FIXED';
  c.primaryAxisSizingMode = 'FIXED';
  c.resize(150, 112);
  c.paddingTop = 8; c.paddingBottom = 8; c.paddingLeft = 8; c.paddingRight = 8;
  c.fills = [tipo === 'Otro mes' ? paint(V.papel, H.papel) : paint(V.blanco, H.blanco)];
  c.strokes = [paint(V.bordeSuave, H.bordeSuave)];
  c.strokeWeight = 1;
  c.clipsContent = true;

  const dia = txt('12', 'etiqueta/campo', tipo === 'Otro mes' ? V.tenue : V.titulo, tipo === 'Otro mes' ? H.tenue : H.titulo);
  if (tipo === 'Hoy') {
    // El día de hoy va en una pastilla naranja, no solo en negrita.
    const marca = figma.createFrame();
    marca.name = 'Hoy';
    marca.layoutMode = 'HORIZONTAL';
    marca.primaryAxisAlignItems = 'CENTER';
    marca.counterAxisAlignItems = 'CENTER';
    marca.primaryAxisSizingMode = 'FIXED';
    marca.counterAxisSizingMode = 'FIXED';
    marca.resize(24, 20);
    marca.fills = [paint(V.naranja, H.naranja)];
    radios(marca, V.radioControl);
    c.appendChild(marca);
    dia.fills = [paint(V.blanco, H.blanco)];
    marca.appendChild(dia);
  } else {
    c.appendChild(dia);
    dia.layoutSizingHorizontal = 'FILL';
    dia.textAutoResize = 'HEIGHT';
  }

  for (let i = 0; i < 3; i++) {
    const ev = figma.createFrame();
    ev.name = 'Evento ' + (i + 1);
    ev.layoutMode = 'HORIZONTAL';
    ev.itemSpacing = 5;
    ev.counterAxisAlignItems = 'CENTER';
    ev.counterAxisSizingMode = 'AUTO';
    ev.fills = [];
    c.appendChild(ev);
    ev.layoutSizingHorizontal = 'FILL';
    const punto = figma.createEllipse();
    punto.name = 'Punto';
    punto.resize(5, 5);
    punto.fills = [paint(V.naranja, H.naranja)];
    ev.appendChild(punto);
    const t = txt('Control · P. Bustamante', 'cuerpo/micro', V.apagado, H.apagado);
    t.textTruncation = 'ENDING';
    t.maxLines = 1;
    ev.appendChild(t);
    t.layoutSizingHorizontal = 'FILL';
    t.textAutoResize = 'HEIGHT';
    if (i > 0) ev.visible = false;
  }

  celdas.push(c);
}

const setCelda = figma.combineAsVariants(celdas, page);
setCelda.name = 'Celda de calendario';
setCelda.description = 'Día de la grilla mensual. Tres slots de evento; los que no se usan se ocultan en la instancia. El punto se recolorea según el tipo de evento.';
setCelda.x = 1300; setCelda.y = 3600;
setCelda.layoutMode = 'HORIZONTAL';
setCelda.itemSpacing = 20;
setCelda.paddingTop = 24; setCelda.paddingBottom = 24; setCelda.paddingLeft = 24; setCelda.paddingRight = 24;
setCelda.primaryAxisSizingMode = 'AUTO';
setCelda.counterAxisSizingMode = 'AUTO';
creados.push(setCelda.id, ...celdas.map(c => c.id));

// ------------------------------------------------------ Fila de conversación
const convs = [];
for (const leida of [false, true]) {
  const c = figma.createComponent();
  c.name = `estado=${leida ? 'Leída' : 'No leída'}`;
  c.layoutMode = 'HORIZONTAL';
  c.itemSpacing = 12;
  c.counterAxisAlignItems = 'MIN';
  c.counterAxisSizingMode = 'FIXED';
  c.resize(400, 90);
  c.primaryAxisSizingMode = 'AUTO';
  c.paddingTop = 14; c.paddingBottom = 14; c.paddingLeft = 16; c.paddingRight = 16;
  c.fills = [leida ? paint(V.blanco, H.blanco) : paint(V.papel, H.papel)];
  bordeInferior(c);

  // Barra de no leída: 3 px en naranja al costado izquierdo.
  const marca = figma.createRectangle();
  marca.name = 'Marca de no leída';
  marca.resize(3, 40);
  marca.fills = [paint(V.naranja, H.naranja)];
  marca.cornerRadius = 2;
  marca.visible = !leida;
  c.appendChild(marca);

  const col = figma.createFrame();
  col.name = 'Contenido';
  col.layoutMode = 'VERTICAL';
  col.itemSpacing = 4;
  col.counterAxisSizingMode = 'AUTO';
  col.fills = [];
  c.appendChild(col);
  col.layoutSizingHorizontal = 'FILL';

  const cab = figma.createFrame();
  cab.layoutMode = 'HORIZONTAL';
  cab.itemSpacing = 8;
  cab.counterAxisAlignItems = 'CENTER';
  cab.counterAxisSizingMode = 'AUTO';
  cab.fills = [];
  cab.name = 'Cabecera';
  col.appendChild(cab);
  cab.layoutSizingHorizontal = 'FILL';
  const de = txt('Comité Parque Bustamante', leida ? 'cuerpo/campo' : 'cuerpo/fuerte', V.titulo, H.titulo);
  cab.appendChild(de);
  de.layoutSizingHorizontal = 'FILL';
  de.textAutoResize = 'HEIGHT';
  cab.appendChild(txt('09:41', 'cuerpo/micro', V.tenue, H.tenue));

  const asunto = txt('Consulta por el control de septiembre', leida ? 'cuerpo/chico' : 'cuerpo/fuerte', V.titulo, H.titulo);
  col.appendChild(asunto);
  asunto.layoutSizingHorizontal = 'FILL';
  asunto.textAutoResize = 'HEIGHT';

  const extracto = txt('Buenos días, queríamos saber si ya está el informe de la visita del jueves y qué pasó con la luminaria del subterráneo…', 'cuerpo/micro', V.tenue, H.tenue);
  extracto.maxLines = 2;
  extracto.textTruncation = 'ENDING';
  col.appendChild(extracto);
  extracto.layoutSizingHorizontal = 'FILL';
  extracto.textAutoResize = 'HEIGHT';

  convs.push(c);
}

const setConv = figma.combineAsVariants(convs, page);
setConv.name = 'Fila de conversación';
setConv.description = 'Correo o mensaje en la bandeja de contacto@coproactiva. Sin leer va sobre papel y con filete naranja.';
setConv.x = 1300; setConv.y = 3900;
setConv.layoutMode = 'VERTICAL';
setConv.itemSpacing = 20;
setConv.paddingTop = 24; setConv.paddingBottom = 24; setConv.paddingLeft = 24; setConv.paddingRight = 24;
setConv.primaryAxisSizingMode = 'AUTO';
setConv.counterAxisSizingMode = 'AUTO';
creados.push(setConv.id, ...convs.map(c => c.id));

return {
  createdNodeIds: creados,
  oportunidadSetId: setOportunidad.id,
  celdaSetId: setCelda.id,
  conversacionSetId: setConv.id
};
