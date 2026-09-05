// 14 — "Mensajes · Terreno" (390x844) en la página Terreno · app móvil.
//
// La cara app del módulo de comunicación: el hilo entre quien está en terreno y la
// oficina. Desde acá la jefatura pide una verificación y el equipo responde con la OT
// asociada, sin salir a un canal externo. Requiere 02 solo para los botones ya
// existentes del sistema (Botón), que se buscan por nombre.

const fund = figma.root.children.find(p => p.name === 'Fundaciones');
await figma.setCurrentPageAsync(fund);
const movil = figma.root.children.find(p => p.name === 'Terreno · app móvil');
await movil.loadAsync();

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
  niebla: 'VariableID:2:7', tinta: 'VariableID:2:5', bordeBase: 'VariableID:2:11',
  bordeSuave: 'VariableID:2:12', titulo: 'VariableID:2:14', apagado: 'VariableID:2:16',
  tenue: 'VariableID:2:18', inverso: 'VariableID:2:19', naranja: 'VariableID:2:3',
  crT: 'VariableID:2:26', crF: 'VariableID:2:27', crB: 'VariableID:2:28',
  radioControl: 'VariableID:3:18', radioTarjeta: 'VariableID:3:19', radioPastilla: 'VariableID:3:20'
};
const V = {};
await Promise.all(Object.entries(ids).map(async ([k, i]) => { V[k] = await gv(i); }));

const H = {
  fondoApp: { r: 0.902, g: 0.886, b: 0.867 }, blanco: { r: 1, g: 1, b: 1 },
  papel: { r: 0.969, g: 0.957, b: 0.941 }, niebla: { r: 0.914, g: 0.902, b: 0.886 },
  tinta: { r: 0.169, g: 0.192, b: 0.220 }, bordeBase: { r: 0.867, g: 0.843, b: 0.812 },
  bordeSuave: { r: 0.914, g: 0.902, b: 0.886 }, titulo: { r: 0.169, g: 0.192, b: 0.220 },
  apagado: { r: 0.353, g: 0.388, b: 0.424 }, tenue: { r: 0.545, g: 0.576, b: 0.608 },
  inverso: { r: 1, g: 1, b: 1 }, naranja: { r: 0.835, g: 0.525, b: 0.231 },
  crT: { r: 0.576, g: 0.224, b: 0.169 }, crF: { r: 0.984, g: 0.933, b: 0.922 },
  crB: { r: 0.929, g: 0.824, b: 0.796 }
};

const txt = (c, e, vv, hh) => {
  const t = figma.createText();
  t.characters = c; t.textStyleId = S(e); t.fills = [paint(vv, hh)];
  return t;
};
const radios = (n, v) => {
  for (const k of ['topLeftRadius', 'topRightRadius', 'bottomLeftRadius', 'bottomRightRadius']) n.setBoundVariable(k, v);
};

const buscarComp = nombre => fund.findOne(n => (n.type === 'COMPONENT' || n.type === 'COMPONENT_SET') && n.name === nombre);
const variante = (setNombre, varNombre) => {
  const s = buscarComp(setNombre);
  if (!s) return null;
  if (s.type === 'COMPONENT') return s;
  return s.children.find(c => c.name === varNombre) || s.defaultVariant;
};
const navInferior = buscarComp('Navegación inferior');

// ------------------------------------------------------------------ Pantalla
const p = figma.createFrame();
p.name = 'Mensajes · Terreno';
p.resize(390, 844);
p.layoutMode = 'VERTICAL';
p.primaryAxisSizingMode = 'FIXED';
p.counterAxisSizingMode = 'FIXED';
p.clipsContent = true;
p.fills = [paint(V.fondoApp, H.fondoApp)];
movil.appendChild(p);
p.x = 1480; p.y = 100;

// Espacio reservado para la barra de estado real del teléfono — no se dibuja.
const gap = figma.createFrame();
gap.name = 'Espacio barra de estado';
gap.resize(390, 47);
gap.fills = [paint(V.blanco, H.blanco)];
p.appendChild(gap);
gap.layoutSizingHorizontal = 'FILL';

// ------------------------------------------------------------------- Encabezado
const head = figma.createFrame();
head.name = 'Encabezado';
head.layoutMode = 'HORIZONTAL';
head.itemSpacing = 12;
head.counterAxisAlignItems = 'CENTER';
head.counterAxisSizingMode = 'AUTO';
head.paddingTop = 10; head.paddingBottom = 14; head.paddingLeft = 16; head.paddingRight = 16;
head.fills = [paint(V.blanco, H.blanco)];
head.strokes = [paint(V.bordeBase, H.bordeBase)];
head.strokeWeight = 1; head.strokeAlign = 'INSIDE';
head.strokeTopWeight = 0; head.strokeLeftWeight = 0; head.strokeRightWeight = 0; head.strokeBottomWeight = 1;
p.appendChild(head);
head.layoutSizingHorizontal = 'FILL';

const flecha = figma.createNodeFromSvg('<svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="m15 6-6 6 6 6" stroke="#2b3138" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>');
flecha.name = 'icono/volver';
flecha.resize(22, 22);
head.appendChild(flecha);

const av = figma.createFrame();
av.name = 'Avatar';
av.resize(36, 36);
av.layoutMode = 'HORIZONTAL';
av.primaryAxisAlignItems = 'CENTER';
av.counterAxisAlignItems = 'CENTER';
av.primaryAxisSizingMode = 'FIXED';
av.counterAxisSizingMode = 'FIXED';
av.fills = [paint(V.niebla, H.niebla)];
radios(av, V.radioPastilla);
head.appendChild(av);
av.appendChild(txt('PS', 'etiqueta/chip', V.titulo, H.titulo));

const headCol = figma.createFrame();
headCol.layoutMode = 'VERTICAL';
headCol.itemSpacing = 2;
headCol.counterAxisSizingMode = 'AUTO';
headCol.fills = [];
headCol.name = 'Título';
head.appendChild(headCol);
headCol.layoutSizingHorizontal = 'FILL';
const tit = txt('Paula Sepúlveda', 'display/h3', V.titulo, H.titulo);
headCol.appendChild(tit);
tit.layoutSizingHorizontal = 'FILL';
tit.textAutoResize = 'HEIGHT';
const sub = txt('Jefatura · oficina', 'cuerpo/micro', V.tenue, H.tenue);
headCol.appendChild(sub);
sub.layoutSizingHorizontal = 'FILL';
sub.textAutoResize = 'HEIGHT';

// ---------------------------------------------------------------------- Hilo
const hilo = figma.createFrame();
hilo.name = 'Hilo';
hilo.layoutMode = 'VERTICAL';
hilo.itemSpacing = 10;
hilo.paddingTop = 16; hilo.paddingBottom = 16; hilo.paddingLeft = 16; hilo.paddingRight = 16;
hilo.counterAxisSizingMode = 'FIXED';
hilo.fills = [paint(V.fondoApp, H.fondoApp)];
hilo.clipsContent = true;
p.appendChild(hilo);
hilo.layoutSizingHorizontal = 'FILL';
hilo.layoutSizingVertical = 'FILL';

const separador = etiqueta => {
  const f = figma.createFrame();
  f.name = 'Separador · ' + etiqueta;
  f.layoutMode = 'HORIZONTAL';
  f.primaryAxisAlignItems = 'CENTER';
  f.counterAxisSizingMode = 'AUTO';
  f.paddingTop = 4; f.paddingBottom = 4;
  f.fills = [];
  hilo.appendChild(f);
  f.layoutSizingHorizontal = 'FILL';
  f.appendChild(txt(etiqueta, 'etiqueta/chip', V.tenue, H.tenue));
};

// [texto, propio, ancho, hora]. El ancho se fija por mensaje: una burbuja corta con
// ancho de burbuja larga se ve rota.
const burbuja = (texto, propio, ancho, hora, extra) => {
  const w = figma.createFrame();
  w.name = propio ? 'Enviado' : 'Recibido';
  w.layoutMode = 'HORIZONTAL';
  w.primaryAxisAlignItems = propio ? 'MAX' : 'MIN';
  w.counterAxisSizingMode = 'AUTO';
  w.fills = [];
  hilo.appendChild(w);
  w.layoutSizingHorizontal = 'FILL';

  const b = figma.createFrame();
  b.name = 'Burbuja';
  b.layoutMode = 'VERTICAL';
  b.itemSpacing = 6;
  b.counterAxisSizingMode = 'FIXED';
  b.primaryAxisSizingMode = 'AUTO';
  b.resize(ancho, 40);
  b.paddingTop = 11; b.paddingBottom = 11; b.paddingLeft = 13; b.paddingRight = 13;
  b.fills = [propio ? paint(V.tinta, H.tinta) : paint(V.blanco, H.blanco)];
  if (!propio) {
    b.strokes = [paint(V.bordeBase, H.bordeBase)];
    b.strokeWeight = 1;
  }
  radios(b, V.radioTarjeta);
  w.appendChild(b);

  const t = txt(texto, 'cuerpo/chico', propio ? V.inverso : V.titulo, propio ? H.inverso : H.titulo);
  b.appendChild(t);
  t.layoutSizingHorizontal = 'FILL';
  t.textAutoResize = 'HEIGHT';

  if (extra) extra(b, propio);

  const hf = figma.createFrame();
  hf.layoutMode = 'HORIZONTAL';
  hf.primaryAxisAlignItems = 'MAX';
  hf.counterAxisSizingMode = 'AUTO';
  hf.fills = [];
  hf.name = 'Hora';
  b.appendChild(hf);
  hf.layoutSizingHorizontal = 'FILL';
  // En la burbuja propia el gris medio no contrasta contra la tinta: se usa niebla.
  hf.appendChild(txt(hora, 'cuerpo/micro', propio ? V.niebla : V.tenue, propio ? H.niebla : H.tenue));
  return b;
};

separador('Hoy');

burbuja('Marcelo, ¿alcanzaste a revisar la luminaria del subterráneo en Bustamante? El comité está preguntando.', false, 280, '10:14');

burbuja('Sí, quedó registrada como hallazgo crítico en el control. La batería no responde al corte de energía.', true, 280, '10:22');

// Mensaje con la OT adjunta: el hilo queda enganchado al trabajo, no suelto.
burbuja('Ya generé la orden de trabajo desde la app.', true, 250, '10:23', (b, propio) => {
  const adj = figma.createFrame();
  adj.name = 'OT adjunta';
  adj.layoutMode = 'VERTICAL';
  adj.itemSpacing = 4;
  adj.counterAxisSizingMode = 'AUTO';
  adj.paddingTop = 10; adj.paddingBottom = 10; adj.paddingLeft = 12; adj.paddingRight = 12;
  adj.fills = [paint(V.crF, H.crF)];
  adj.strokes = [paint(V.crB, H.crB)];
  adj.strokeWeight = 1;
  radios(adj, V.radioControl);
  b.appendChild(adj);
  adj.layoutSizingHorizontal = 'FILL';
  const a1 = txt('OT-1042 · Reposición de luminaria', 'cuerpo/micro', V.crT, H.crT);
  adj.appendChild(a1);
  a1.layoutSizingHorizontal = 'FILL';
  a1.textAutoResize = 'HEIGHT';
  const a2 = txt('Crítica · vence el 6 de septiembre', 'cuerpo/micro', V.crT, H.crT);
  adj.appendChild(a2);
  a2.layoutSizingHorizontal = 'FILL';
  a2.textAutoResize = 'HEIGHT';
});

burbuja('Perfecto. Le respondo al comité y les adjunto el informe del control.', false, 268, '10:30');

burbuja('El técnico entra mañana a las 09:00 por el acceso de servicio.', true, 250, '10:31');

// ------------------------------------------------------------ Caja de mensaje
const pie = figma.createFrame();
pie.name = 'Redactar';
pie.layoutMode = 'HORIZONTAL';
pie.itemSpacing = 10;
pie.counterAxisAlignItems = 'CENTER';
pie.counterAxisSizingMode = 'AUTO';
pie.paddingTop = 12; pie.paddingBottom = 12; pie.paddingLeft = 16; pie.paddingRight = 16;
pie.fills = [paint(V.blanco, H.blanco)];
pie.strokes = [paint(V.bordeBase, H.bordeBase)];
pie.strokeWeight = 1; pie.strokeAlign = 'INSIDE';
pie.strokeBottomWeight = 0; pie.strokeLeftWeight = 0; pie.strokeRightWeight = 0; pie.strokeTopWeight = 1;
p.appendChild(pie);
pie.layoutSizingHorizontal = 'FILL';

// Botón de adjuntar: 44 px, mínimo táctil.
const adjuntar = figma.createFrame();
adjuntar.name = 'Adjuntar';
adjuntar.resize(44, 44);
adjuntar.layoutMode = 'HORIZONTAL';
adjuntar.primaryAxisAlignItems = 'CENTER';
adjuntar.counterAxisAlignItems = 'CENTER';
adjuntar.primaryAxisSizingMode = 'FIXED';
adjuntar.counterAxisSizingMode = 'FIXED';
adjuntar.fills = [];
pie.appendChild(adjuntar);
const icoMas = figma.createNodeFromSvg('<svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 5v14M5 12h14" stroke="#5a636c" stroke-width="1.7" stroke-linecap="round"/></svg>');
icoMas.name = 'icono/adjuntar';
icoMas.resize(22, 22);
adjuntar.appendChild(icoMas);

const caja = figma.createFrame();
caja.name = 'Campo de mensaje';
caja.layoutMode = 'HORIZONTAL';
caja.counterAxisAlignItems = 'CENTER';
caja.counterAxisSizingMode = 'FIXED';
caja.primaryAxisSizingMode = 'FIXED';
caja.resize(240, 44);
caja.paddingTop = 11; caja.paddingBottom = 11; caja.paddingLeft = 14; caja.paddingRight = 14;
caja.fills = [paint(V.papel, H.papel)];
caja.strokes = [paint(V.bordeBase, H.bordeBase)];
caja.strokeWeight = 1;
radios(caja, V.radioPastilla);
pie.appendChild(caja);
caja.layoutSizingHorizontal = 'FILL';
caja.layoutSizingVertical = 'FIXED';
const cajaT = txt('Escribe un mensaje…', 'cuerpo/base', V.tenue, H.tenue);
caja.appendChild(cajaT);
cajaT.layoutSizingHorizontal = 'FILL';
cajaT.textAutoResize = 'HEIGHT';

const enviar = figma.createFrame();
enviar.name = 'Enviar';
enviar.resize(44, 44);
enviar.layoutMode = 'HORIZONTAL';
enviar.primaryAxisAlignItems = 'CENTER';
enviar.counterAxisAlignItems = 'CENTER';
enviar.primaryAxisSizingMode = 'FIXED';
enviar.counterAxisSizingMode = 'FIXED';
enviar.fills = [paint(V.tinta, H.tinta)];
radios(enviar, V.radioPastilla);
pie.appendChild(enviar);
const icoEnviar = figma.createNodeFromSvg('<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.5 11.8 19.5 5l-6.6 15-2-6.3-6.4-1.9Z" stroke="#ffffff" stroke-width="1.6" stroke-linejoin="round"/></svg>');
icoEnviar.name = 'icono/enviar';
icoEnviar.resize(20, 20);
enviar.appendChild(icoEnviar);

// Navegación inferior con "Controles" activo no aplica acá: el hilo ocupa la pantalla
// completa y se vuelve con la flecha del encabezado, igual que en Nuevo hallazgo.

return { createdNodeIds: [p.id, head.id, hilo.id, pie.id], pantallaId: p.id, navDisponible: !!navInferior };
