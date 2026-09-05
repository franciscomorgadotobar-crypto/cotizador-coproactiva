// 13 — "Correo · contacto@coproactiva" (1440x900) en la página Gestión · web.
//
// Bandeja compartida de la casilla contacto@coproactiva.cl: cada conversación queda
// asociada a una comunidad, y desde el hilo se adjunta el informe de control o se
// deriva a una OT. Requiere 02, 03 y 07.

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
  naranja: 'VariableID:2:3', pizarra: 'VariableID:2:4', okT: 'VariableID:2:20',
  radioControl: 'VariableID:3:18', radioTarjeta: 'VariableID:3:19', radioPastilla: 'VariableID:3:20'
};
const V = {};
await Promise.all(Object.entries(ids).map(async ([k, i]) => { V[k] = await gv(i); }));

const H = {
  fondoApp: { r: 0.902, g: 0.886, b: 0.867 }, blanco: { r: 1, g: 1, b: 1 },
  papel: { r: 0.969, g: 0.957, b: 0.941 }, niebla: { r: 0.914, g: 0.902, b: 0.886 },
  bordeBase: { r: 0.867, g: 0.843, b: 0.812 }, bordeSuave: { r: 0.914, g: 0.902, b: 0.886 },
  titulo: { r: 0.169, g: 0.192, b: 0.220 }, apagado: { r: 0.353, g: 0.388, b: 0.424 },
  tenue: { r: 0.545, g: 0.576, b: 0.608 }, naranja: { r: 0.835, g: 0.525, b: 0.231 },
  pizarra: { r: 0.290, g: 0.353, b: 0.408 }, okT: { r: 0.306, g: 0.420, b: 0.290 }
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
const btnPri = variante('Botón', 'tipo=Primario, tamaño=Web');
const btnSec = variante('Botón', 'tipo=Secundario, tamaño=Web');
const conv = estado => variante('Fila de conversación', `estado=${estado}`);
const chip = nom => variante('Chip de estado', `estado=${nom}`);

if (!barraLateral || !conv('No leída')) {
  throw new Error('Faltan componentes: ejecuta primero 02-web-navegacion.js y 07-web-componentes-2.js');
}

const p = figma.createFrame();
p.name = 'Correo · contacto@coproactiva';
p.resize(1440, 900);
p.layoutMode = 'HORIZONTAL';
p.primaryAxisSizingMode = 'FIXED';
p.counterAxisSizingMode = 'FIXED';
p.clipsContent = true;
p.fills = [paint(V.fondoApp, H.fondoApp)];
web.appendChild(p);
p.x = 3180; p.y = 2100;

const barra = barraLateral.createInstance();
p.appendChild(barra);
barra.layoutSizingVertical = 'FILL';

const cont = figma.createFrame();
cont.name = 'Contenido';
cont.layoutMode = 'VERTICAL';
cont.itemSpacing = 0;
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
cab.paddingTop = 22; cab.paddingBottom = 22; cab.paddingLeft = 28; cab.paddingRight = 28;
cab.fills = [paint(V.blanco, H.blanco)];
bordeInferior(cab);
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
const h = txt('contacto@coproactiva.cl', 'display/h2', V.titulo, H.titulo);
cabCol.appendChild(h);
h.layoutSizingHorizontal = 'FILL';
h.textAutoResize = 'HEIGHT';
const hs = txt('Casilla compartida · 8 conversaciones sin responder · 3 requieren respuesta hoy', 'cuerpo/chico', V.apagado, H.apagado);
cabCol.appendChild(hs);
hs.layoutSizingHorizontal = 'FILL';
hs.textAutoResize = 'HEIGHT';

for (const [comp, label] of [[btnSec, 'Filtrar'], [btnPri, 'Redactar']]) {
  if (!comp) continue;
  const b = comp.createInstance();
  cab.appendChild(b);
  const bt = b.children.find(n => n.type === 'TEXT');
  if (bt) bt.characters = label;
}

// -------------------------------------------------------------- Dos columnas
const cuerpo = figma.createFrame();
cuerpo.name = 'Bandeja';
cuerpo.layoutMode = 'HORIZONTAL';
cuerpo.itemSpacing = 0;
cuerpo.counterAxisSizingMode = 'FIXED';
cuerpo.fills = [];
cont.appendChild(cuerpo);
cuerpo.layoutSizingHorizontal = 'FILL';
cuerpo.layoutSizingVertical = 'FILL';

// Lista de conversaciones
const lista = figma.createFrame();
lista.name = 'Conversaciones';
lista.layoutMode = 'VERTICAL';
lista.itemSpacing = 0;
lista.counterAxisSizingMode = 'FIXED';
lista.primaryAxisSizingMode = 'FIXED';
lista.resize(400, 700);
lista.fills = [paint(V.blanco, H.blanco)];
lista.strokes = [paint(V.bordeBase, H.bordeBase)];
lista.strokeWeight = 1; lista.strokeAlign = 'INSIDE';
lista.strokeTopWeight = 0; lista.strokeBottomWeight = 0; lista.strokeLeftWeight = 0; lista.strokeRightWeight = 1;
lista.clipsContent = true;
cuerpo.appendChild(lista);
lista.layoutSizingVertical = 'FILL';

const pestanas = figma.createFrame();
pestanas.name = 'Pestañas';
pestanas.layoutMode = 'HORIZONTAL';
pestanas.itemSpacing = 18;
pestanas.counterAxisSizingMode = 'AUTO';
pestanas.paddingTop = 14; pestanas.paddingBottom = 14; pestanas.paddingLeft = 16; pestanas.paddingRight = 16;
pestanas.fills = [paint(V.papel, H.papel)];
bordeInferior(pestanas);
lista.appendChild(pestanas);
pestanas.layoutSizingHorizontal = 'FILL';
for (const [etiqueta, activa] of [['Sin responder · 8', true], ['Todas', false], ['Enviados', false]]) {
  pestanas.appendChild(txt(etiqueta, 'etiqueta/chip', activa ? V.titulo : V.tenue, activa ? H.titulo : H.tenue));
}

const conversaciones = [
  ['No leída', 'Comité Parque Bustamante', '09:41', 'Consulta por el control de septiembre', 'Buenos días, queríamos saber si ya está el informe de la visita del jueves y qué pasó con la luminaria del subterráneo.'],
  ['No leída', 'Rodrigo Meza · Vista Andes', '08:20', 'Re: Propuesta de administración', 'Gracias por la propuesta. El comité la revisa el jueves 11 y les confirmamos esa misma semana.'],
  ['No leída', 'Conserjería Costanera Norte', 'Ayer', 'Filtración en el hall del piso 3', 'Se detectó una filtración en el hall del piso 3 después de la lluvia de anoche. Adjunto fotos.'],
  ['Leída', 'Contabilidad Los Almendros', 'Ayer', 'Facturación de septiembre', 'Confirmamos recepción de la factura 4821 por $1.499.400 con IVA incluido.'],
  ['Leída', 'Municipalidad de Vitacura', '2 sep', 'Certificado de recepción definitiva', 'Adjuntamos el certificado solicitado para el edificio de Av. Santa María 5400.'],
  ['Leída', 'Comité Alto Macul', '1 sep', 'Cotización de mantención de bombas', 'Quedamos a la espera de las tres cotizaciones que nos mencionaron en la asamblea.']
];

for (const [estado, de, hora, asunto, extracto] of conversaciones) {
  const comp = conv(estado);
  if (!comp) continue;
  const c = comp.createInstance();
  lista.appendChild(c);
  c.layoutSizingHorizontal = 'FILL';
  // Orden de documento: remitente, hora, asunto, extracto.
  const ts = c.findAllWithCriteria({ types: ['TEXT'] });
  if (ts[0]) ts[0].characters = de;
  if (ts[1]) ts[1].characters = hora;
  if (ts[2]) ts[2].characters = asunto;
  if (ts[3]) ts[3].characters = extracto;
}

// Conversación abierta
const hilo = figma.createFrame();
hilo.name = 'Conversación';
hilo.layoutMode = 'VERTICAL';
hilo.itemSpacing = 0;
hilo.counterAxisSizingMode = 'FIXED';
hilo.fills = [paint(V.fondoApp, H.fondoApp)];
hilo.clipsContent = true;
cuerpo.appendChild(hilo);
hilo.layoutSizingHorizontal = 'FILL';
hilo.layoutSizingVertical = 'FILL';

const hiloCab = figma.createFrame();
hiloCab.name = 'Cabecera del hilo';
hiloCab.layoutMode = 'VERTICAL';
hiloCab.itemSpacing = 8;
hiloCab.counterAxisSizingMode = 'AUTO';
hiloCab.paddingTop = 20; hiloCab.paddingBottom = 18; hiloCab.paddingLeft = 28; hiloCab.paddingRight = 28;
hiloCab.fills = [paint(V.blanco, H.blanco)];
bordeInferior(hiloCab);
hilo.appendChild(hiloCab);
hiloCab.layoutSizingHorizontal = 'FILL';

const asunto = txt('Consulta por el control de septiembre', 'display/h3', V.titulo, H.titulo);
hiloCab.appendChild(asunto);
asunto.layoutSizingHorizontal = 'FILL';
asunto.textAutoResize = 'HEIGHT';

const meta = figma.createFrame();
meta.name = 'Meta';
meta.layoutMode = 'HORIZONTAL';
meta.itemSpacing = 10;
meta.counterAxisAlignItems = 'CENTER';
meta.counterAxisSizingMode = 'AUTO';
meta.fills = [];
hiloCab.appendChild(meta);
meta.layoutSizingHorizontal = 'FILL';
const part = txt('comite@parquebustamante.cl · 3 mensajes', 'cuerpo/chico', V.apagado, H.apagado);
meta.appendChild(part);
part.layoutSizingHorizontal = 'FILL';
part.textAutoResize = 'HEIGHT';

// Vínculo con la comunidad: el hilo no queda suelto, cuelga de una ficha.
const vinculo = figma.createFrame();
vinculo.name = 'Comunidad vinculada';
vinculo.layoutMode = 'HORIZONTAL';
vinculo.itemSpacing = 6;
vinculo.counterAxisAlignItems = 'CENTER';
vinculo.counterAxisSizingMode = 'AUTO';
vinculo.paddingTop = 5; vinculo.paddingBottom = 5; vinculo.paddingLeft = 10; vinculo.paddingRight = 11;
vinculo.fills = [paint(V.niebla, H.niebla)];
vinculo.strokes = [paint(V.bordeBase, H.bordeBase)];
vinculo.strokeWeight = 1;
radios(vinculo, V.radioPastilla);
meta.appendChild(vinculo);
const vp = figma.createEllipse();
vp.resize(6, 6);
vp.name = 'Punto';
vp.fills = [paint(V.naranja, H.naranja)];
vinculo.appendChild(vp);
vinculo.appendChild(txt('Edificio Parque Bustamante', 'etiqueta/chip', V.titulo, H.titulo));

// Mensajes
const mensajes = figma.createFrame();
mensajes.name = 'Mensajes';
mensajes.layoutMode = 'VERTICAL';
mensajes.itemSpacing = 14;
mensajes.counterAxisSizingMode = 'FIXED';
mensajes.paddingTop = 20; mensajes.paddingBottom = 20; mensajes.paddingLeft = 28; mensajes.paddingRight = 28;
mensajes.fills = [];
mensajes.clipsContent = true;
hilo.appendChild(mensajes);
mensajes.layoutSizingHorizontal = 'FILL';
mensajes.layoutSizingVertical = 'FILL';

for (const [iniciales, autor, hora, cuerpoMsg, propio] of [
  ['CP', 'Comité Parque Bustamante', 'Hoy 09:41', 'Buenos días, queríamos saber si ya está el informe de la visita del jueves y qué pasó con la luminaria del subterráneo. Varios vecinos han preguntado por el tema.', false],
  ['PS', 'Paula Sepúlveda · CoproActiva', 'Hoy 10:12', 'Estimados, el control del 4 de septiembre está cerrado con 28 de 28 ítems revisados. La luminaria del subterráneo -1 quedó registrada como hallazgo crítico y ya se emitió la OT-1042, con vencimiento el 6 de septiembre. Les adjunto el informe.', true],
  ['CP', 'Comité Parque Bustamante', 'Hoy 10:30', 'Perfecto, gracias. ¿Podemos coordinar que el técnico entre por el acceso de servicio?', false]
]) {
  const m = figma.createFrame();
  m.name = 'Mensaje · ' + autor;
  m.layoutMode = 'HORIZONTAL';
  m.itemSpacing = 12;
  m.counterAxisAlignItems = 'MIN';
  m.counterAxisSizingMode = 'AUTO';
  m.paddingTop = 16; m.paddingBottom = 16; m.paddingLeft = 18; m.paddingRight = 18;
  m.fills = [propio ? paint(V.papel, H.papel) : paint(V.blanco, H.blanco)];
  m.strokes = [paint(V.bordeBase, H.bordeBase)];
  m.strokeWeight = 1;
  radios(m, V.radioTarjeta);
  mensajes.appendChild(m);
  m.layoutSizingHorizontal = 'FILL';

  const av = figma.createFrame();
  av.name = 'Avatar';
  av.resize(34, 34);
  av.layoutMode = 'HORIZONTAL';
  av.primaryAxisAlignItems = 'CENTER';
  av.counterAxisAlignItems = 'CENTER';
  av.primaryAxisSizingMode = 'FIXED';
  av.counterAxisSizingMode = 'FIXED';
  av.fills = [paint(V.niebla, H.niebla)];
  radios(av, V.radioPastilla);
  m.appendChild(av);
  av.appendChild(txt(iniciales, 'etiqueta/chip', V.pizarra, H.pizarra));

  const col = figma.createFrame();
  col.layoutMode = 'VERTICAL';
  col.itemSpacing = 6;
  col.counterAxisSizingMode = 'AUTO';
  col.fills = [];
  col.name = 'Texto';
  m.appendChild(col);
  col.layoutSizingHorizontal = 'FILL';

  const fila = figma.createFrame();
  fila.layoutMode = 'HORIZONTAL';
  fila.itemSpacing = 8;
  fila.counterAxisSizingMode = 'AUTO';
  fila.fills = [];
  fila.name = 'Cabecera';
  col.appendChild(fila);
  fila.layoutSizingHorizontal = 'FILL';
  const a = txt(autor, 'cuerpo/fuerte', V.titulo, H.titulo);
  fila.appendChild(a);
  a.layoutSizingHorizontal = 'FILL';
  a.textAutoResize = 'HEIGHT';
  fila.appendChild(txt(hora, 'cuerpo/micro', V.tenue, H.tenue));

  const t = txt(cuerpoMsg, 'cuerpo/chico', V.apagado, H.apagado);
  col.appendChild(t);
  t.layoutSizingHorizontal = 'FILL';
  t.textAutoResize = 'HEIGHT';

  // El mensaje de la oficina lleva el informe adjunto.
  if (propio) {
    const adj = figma.createFrame();
    adj.name = 'Adjunto';
    adj.layoutMode = 'HORIZONTAL';
    adj.itemSpacing = 10;
    adj.counterAxisAlignItems = 'CENTER';
    adj.counterAxisSizingMode = 'AUTO';
    adj.paddingTop = 10; adj.paddingBottom = 10; adj.paddingLeft = 12; adj.paddingRight = 14;
    adj.fills = [paint(V.blanco, H.blanco)];
    adj.strokes = [paint(V.bordeBase, H.bordeBase)];
    adj.strokeWeight = 1;
    radios(adj, V.radioControl);
    col.appendChild(adj);
    const ico = figma.createNodeFromSvg('<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 3.5h8L19 8v12.5H6z" stroke="#8b939b" stroke-width="1.6" stroke-linejoin="round"/><path d="M14 3.5V8h5" stroke="#8b939b" stroke-width="1.6" stroke-linejoin="round"/></svg>');
    ico.name = 'icono/documento';
    ico.resize(18, 18);
    adj.appendChild(ico);
    const ac = figma.createFrame();
    ac.layoutMode = 'VERTICAL';
    ac.itemSpacing = 2;
    ac.counterAxisSizingMode = 'AUTO';
    ac.fills = [];
    ac.name = 'Texto';
    adj.appendChild(ac);
    const a1 = txt('Control septiembre · Parque Bustamante.pdf', 'cuerpo/micro', V.titulo, H.titulo);
    ac.appendChild(a1);
    a1.textAutoResize = 'HEIGHT';
    const a2 = txt('6 páginas · incluye las 9 fotos del control', 'cuerpo/micro', V.tenue, H.tenue);
    ac.appendChild(a2);
    a2.textAutoResize = 'HEIGHT';
  }
}

// Caja de respuesta
const respuesta = figma.createFrame();
respuesta.name = 'Respuesta';
respuesta.layoutMode = 'VERTICAL';
respuesta.itemSpacing = 12;
respuesta.counterAxisSizingMode = 'AUTO';
respuesta.paddingTop = 16; respuesta.paddingBottom = 20; respuesta.paddingLeft = 28; respuesta.paddingRight = 28;
respuesta.fills = [paint(V.blanco, H.blanco)];
respuesta.strokes = [paint(V.bordeBase, H.bordeBase)];
respuesta.strokeWeight = 1; respuesta.strokeAlign = 'INSIDE';
respuesta.strokeBottomWeight = 0; respuesta.strokeLeftWeight = 0; respuesta.strokeRightWeight = 0; respuesta.strokeTopWeight = 1;
hilo.appendChild(respuesta);
respuesta.layoutSizingHorizontal = 'FILL';

const caja = figma.createFrame();
caja.name = 'Campo de respuesta';
caja.layoutMode = 'VERTICAL';
caja.counterAxisSizingMode = 'FIXED';
caja.primaryAxisSizingMode = 'FIXED';
caja.resize(600, 72);
caja.paddingTop = 12; caja.paddingBottom = 12; caja.paddingLeft = 14; caja.paddingRight = 14;
caja.fills = [paint(V.blanco, H.blanco)];
caja.strokes = [paint(V.bordeBase, H.bordeBase)];
caja.strokeWeight = 1;
radios(caja, V.radioControl);
respuesta.appendChild(caja);
caja.layoutSizingHorizontal = 'FILL';
const cajaT = txt('Escribe la respuesta al comité…', 'cuerpo/campo', V.tenue, H.tenue);
caja.appendChild(cajaT);
cajaT.layoutSizingHorizontal = 'FILL';
cajaT.textAutoResize = 'HEIGHT';

const acciones = figma.createFrame();
acciones.name = 'Acciones';
acciones.layoutMode = 'HORIZONTAL';
acciones.itemSpacing = 10;
acciones.counterAxisAlignItems = 'CENTER';
acciones.counterAxisSizingMode = 'AUTO';
acciones.fills = [];
respuesta.appendChild(acciones);
acciones.layoutSizingHorizontal = 'FILL';
const desde = txt('Se enviará desde contacto@coproactiva.cl', 'cuerpo/micro', V.tenue, H.tenue);
acciones.appendChild(desde);
desde.layoutSizingHorizontal = 'FILL';
desde.textAutoResize = 'HEIGHT';
for (const [comp, label] of [[btnSec, 'Adjuntar informe'], [btnSec, 'Crear OT'], [btnPri, 'Responder']]) {
  if (!comp) continue;
  const b = comp.createInstance();
  acciones.appendChild(b);
  const bt = b.children.find(n => n.type === 'TEXT');
  if (bt) bt.characters = label;
}

return { createdNodeIds: [p.id, cont.id, lista.id, hilo.id], pantallaId: p.id };
