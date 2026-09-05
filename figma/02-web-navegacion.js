// 02 — Navegación web: componente "Ítem de menú" (activo/normal) y "Barra lateral".
//
// La barra lateral usa el logotipo real de sitio/logo-coproactiva.svg, importado como
// vector. Los ítems replican el vocabulario del panel de propuestas: Montserrat en
// versalita con tracking, radio 2 px, fondos de marca.
//
// Crea los componentes en la página Fundaciones. Los scripts 04, 05 y 06 los instancian.

const page = figma.root.children.find(p => p.name === 'Fundaciones');
await figma.setCurrentPageAsync(page);
await Promise.all([
  figma.loadFontAsync({ family: 'Montserrat', style: 'Bold' }),
  figma.loadFontAsync({ family: 'Montserrat', style: 'SemiBold' }),
  figma.loadFontAsync({ family: 'Source Sans Pro', style: 'Regular' })
]);

const tS = await figma.getLocalTextStylesAsync();
const S = n => tS.find(s => s.name === n).id;
const gv = id => figma.variables.getVariableByIdAsync(id);
const paint = (v, fb) => figma.variables.setBoundVariableForPaint({ type: 'SOLID', color: fb }, 'color', v);

const ids = {
  blanco: 'VariableID:2:9', niebla: 'VariableID:2:7', bordeBase: 'VariableID:2:11',
  bordeSuave: 'VariableID:2:12', titulo: 'VariableID:2:14', apagado: 'VariableID:2:16',
  tenue: 'VariableID:2:18', naranja: 'VariableID:2:3', tinta: 'VariableID:2:5',
  radioControl: 'VariableID:3:18'
};
const V = {};
await Promise.all(Object.entries(ids).map(async ([k, i]) => { V[k] = await gv(i); }));

const H = {
  blanco: { r: 1, g: 1, b: 1 }, niebla: { r: 0.914, g: 0.902, b: 0.886 },
  bordeBase: { r: 0.867, g: 0.843, b: 0.812 }, bordeSuave: { r: 0.914, g: 0.902, b: 0.886 },
  titulo: { r: 0.169, g: 0.192, b: 0.220 }, apagado: { r: 0.353, g: 0.388, b: 0.424 },
  tenue: { r: 0.545, g: 0.576, b: 0.608 }, naranja: { r: 0.835, g: 0.525, b: 0.231 },
  tinta: { r: 0.169, g: 0.192, b: 0.220 }
};

const txt = (c, e, vv, hh) => {
  const t = figma.createText();
  t.characters = c; t.textStyleId = S(e); t.fills = [paint(vv, hh)];
  return t;
};
const radios = (n, v) => {
  for (const k of ['topLeftRadius', 'topRightRadius', 'bottomLeftRadius', 'bottomRightRadius']) n.setBoundVariable(k, v);
};

// Íconos de 18 px sobre grilla de 24, un solo estilo de trazo. COL se sustituye por color.
const ICONOS = {
  panel: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3.5" y="3.5" width="7.5" height="7.5" rx="1.5" stroke="COL" stroke-width="1.6"/><rect x="13" y="3.5" width="7.5" height="7.5" rx="1.5" stroke="COL" stroke-width="1.6"/><rect x="3.5" y="13" width="7.5" height="7.5" rx="1.5" stroke="COL" stroke-width="1.6"/><rect x="13" y="13" width="7.5" height="7.5" rx="1.5" stroke="COL" stroke-width="1.6"/></svg>',
  comunidades: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 21V6.5a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1V21M12 21V11h7a1 1 0 0 1 1 1v9M3 21h18" stroke="COL" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 9.5v0M7 13.5v0M9 9.5v0M9 13.5v0M15.5 15v0M15.5 18v0" stroke="COL" stroke-width="1.8" stroke-linecap="round"/></svg>',
  controles: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="4.5" width="14" height="16" rx="2" stroke="COL" stroke-width="1.6"/><path d="M9 3.5h6v3H9z" stroke="COL" stroke-width="1.6" stroke-linejoin="round"/><path d="m9 13 2 2 4-4.5" stroke="COL" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  ot: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.2 6.3a4.5 4.5 0 0 1 5.8 5.8l-8 8-4-4 8-8Z" stroke="COL" stroke-width="1.6" stroke-linejoin="round"/><path d="M4 20h4" stroke="COL" stroke-width="1.6" stroke-linecap="round"/></svg>',
  crm: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="9.5" cy="8.5" r="3.2" stroke="COL" stroke-width="1.6"/><path d="M3.8 19.5c.8-3 3.1-4.6 5.7-4.6s4.9 1.6 5.7 4.6" stroke="COL" stroke-width="1.6" stroke-linecap="round"/><path d="M16 6.2a3 3 0 0 1 0 5.6M18.4 19.5c-.3-1.5-.9-2.7-1.7-3.6" stroke="COL" stroke-width="1.6" stroke-linecap="round"/></svg>',
  oportunidades: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 20h16" stroke="COL" stroke-width="1.6" stroke-linecap="round"/><rect x="5.5" y="13" width="3.6" height="5" rx="1" stroke="COL" stroke-width="1.6"/><rect x="10.7" y="9" width="3.6" height="9" rx="1" stroke="COL" stroke-width="1.6"/><rect x="15.9" y="5" width="3.6" height="13" rx="1" stroke="COL" stroke-width="1.6"/></svg>',
  contratos: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 3.5h8L19 8v12.5H6z" stroke="COL" stroke-width="1.6" stroke-linejoin="round"/><path d="M14 3.5V8h5" stroke="COL" stroke-width="1.6" stroke-linejoin="round"/><path d="M9 16.5c1.4-2.6 2.3-2.6 3 0 .6 2.2 1.6 1.5 3-1" stroke="COL" stroke-width="1.6" stroke-linecap="round"/></svg>',
  calendario: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3.5" y="5" width="17" height="15.5" rx="2" stroke="COL" stroke-width="1.6"/><path d="M3.5 9.5h17M8 3.5V6.5M16 3.5V6.5" stroke="COL" stroke-width="1.6" stroke-linecap="round"/></svg>',
  correo: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3.5" y="5.5" width="17" height="13" rx="2" stroke="COL" stroke-width="1.6"/><path d="m4.5 7 7.5 5.5L19.5 7" stroke="COL" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>'
};

// ------------------------------------------------------------ Ítem de menú
const itemVariantes = [];
for (const activo of [true, false]) {
  const c = figma.createComponent();
  c.name = `activo=${activo ? 'Sí' : 'No'}`;
  c.layoutMode = 'HORIZONTAL';
  c.itemSpacing = 10;
  c.counterAxisAlignItems = 'CENTER';
  c.counterAxisSizingMode = 'FIXED';
  c.resize(204, 38);
  c.primaryAxisSizingMode = 'FIXED';
  c.paddingTop = 9; c.paddingBottom = 9; c.paddingLeft = 10; c.paddingRight = 10;
  c.fills = activo ? [paint(V.niebla, H.niebla)] : [];
  radios(c, V.radioControl);

  const ico = figma.createNodeFromSvg(ICONOS.controles.split('COL').join(activo ? '#d5863b' : '#8b939b'));
  ico.name = 'icono';
  ico.resize(18, 18);
  c.appendChild(ico);

  const t = txt('Controles', 'cuerpo/campo', activo ? V.titulo : V.apagado, activo ? H.titulo : H.apagado);
  c.appendChild(t);
  t.layoutSizingHorizontal = 'FILL';
  t.textAutoResize = 'HEIGHT';

  itemVariantes.push(c);
}
const setItem = figma.combineAsVariants(itemVariantes, page);
setItem.name = 'Ítem de menú';
setItem.description = 'Entrada de la barra lateral web. El ítem activo lleva fondo niebla e ícono en naranja de marca.';
setItem.x = 80; setItem.y = 2300;
setItem.layoutMode = 'VERTICAL';
setItem.itemSpacing = 12;
setItem.paddingTop = 20; setItem.paddingBottom = 20; setItem.paddingLeft = 20; setItem.paddingRight = 20;
setItem.primaryAxisSizingMode = 'AUTO';
setItem.counterAxisSizingMode = 'AUTO';

// ------------------------------------------------------------- Barra lateral
const barra = figma.createComponent();
barra.name = 'Barra lateral';
barra.description = 'Navegación principal de la web. Operación, Comercial y Gestión; el usuario conectado y su rol quedan al pie.';
barra.resize(240, 900);
barra.x = 500; barra.y = 2300;
barra.layoutMode = 'VERTICAL';
barra.primaryAxisSizingMode = 'FIXED';
barra.counterAxisSizingMode = 'FIXED';
barra.paddingTop = 22; barra.paddingBottom = 18; barra.paddingLeft = 18; barra.paddingRight = 18;
barra.itemSpacing = 18;
barra.fills = [paint(V.blanco, H.blanco)];
barra.strokes = [paint(V.bordeBase, H.bordeBase)];
barra.strokeWeight = 1; barra.strokeAlign = 'INSIDE';
barra.strokeTopWeight = 0; barra.strokeBottomWeight = 0; barra.strokeLeftWeight = 0; barra.strokeRightWeight = 1;

// Logotipo real del sitio (sitio/logo-coproactiva.svg), escalado a 24 px de alto.
const LOGO = '<svg width="200" height="40" fill="#2b3138" id="Capa_1" data-name="Capa 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 656.03 131.11"> <g> <g> <path class="cls-1" d="M153.26,67.84c0-13.65,10.53-23.34,25.27-23.34,9.52,0,17.02,4.13,20.3,11.54l-10.19,5.48c-2.44-4.3-6.07-6.23-10.19-6.23-6.66,0-11.88,4.63-11.88,12.55s5.22,12.55,11.88,12.55c4.13,0,7.75-1.85,10.19-6.23l10.19,5.56c-3.29,7.24-10.78,11.46-20.3,11.46-14.74,0-25.27-9.69-25.27-23.34Z"></path> <path class="cls-1" d="M199.18,67.84c0-13.65,10.53-23.34,24.94-23.34s24.85,9.69,24.85,23.34-10.45,23.34-24.85,23.34-24.94-9.69-24.94-23.34ZM235.66,67.84c0-7.83-4.97-12.55-11.54-12.55s-11.63,4.72-11.63,12.55,5.05,12.55,11.63,12.55,11.54-4.72,11.54-12.55Z"></path> </g> <g> <path class="cls-1" d="M302.13,68.18c0,13.73-9.52,22.83-22.58,22.83-6.32,0-11.88-2.44-15.58-7.24v23.08h-8.09v-60.99h7.75v7.08c3.62-4.97,9.35-7.5,15.92-7.5,13.06,0,22.58,9.1,22.58,22.75ZM293.96,68.18c0-9.44-6.49-15.67-15.08-15.67s-15,6.23-15,15.67,6.49,15.75,15,15.75,15.08-6.23,15.08-15.75Z"></path> <path class="cls-1" d="M334.06,45.43v7.83c-.67-.08-1.26-.08-1.85-.08-8.68,0-14.07,5.31-14.07,15.08v22.24h-8.09v-44.65h7.75v7.5c2.86-5.22,8.42-7.92,16.26-7.92Z"></path> <path class="cls-1" d="M336.17,68.18c0-13.31,9.86-22.75,23.25-22.75s23.17,9.44,23.17,22.75-9.77,22.83-23.17,22.83-23.25-9.52-23.25-22.83ZM374.42,68.18c0-9.52-6.4-15.67-15-15.67s-15.08,6.15-15.08,15.67,6.49,15.75,15.08,15.75,15-6.23,15-15.75Z"></path> <path class="cls-1" d="M425.47,63.54v26.96h-7.67v-5.9c-2.7,4.04-7.67,6.4-14.66,6.4-10.11,0-16.51-5.39-16.51-13.14,0-7.16,4.63-13.06,17.94-13.06h12.8v-1.6c0-6.82-3.96-10.78-11.96-10.78-5.31,0-10.7,1.85-14.15,4.8l-3.37-6.07c4.63-3.71,11.29-5.73,18.45-5.73,12.22,0,19.12,5.9,19.12,18.11ZM417.38,76.85v-6.23h-12.47c-8,0-10.28,3.12-10.28,6.91,0,4.47,3.71,7.25,9.86,7.25s10.87-2.78,12.89-7.92Z"></path> <path class="cls-1" d="M433.22,68.18c0-13.31,9.86-22.75,23.59-22.75,8,0,14.66,3.29,18.2,9.52l-6.15,3.96c-2.87-4.38-7.25-6.4-12.13-6.4-8.76,0-15.33,6.15-15.33,15.67s6.57,15.75,15.33,15.75c4.89,0,9.27-2.02,12.13-6.4l6.15,3.88c-3.54,6.23-10.19,9.6-18.2,9.6-13.73,0-23.59-9.52-23.59-22.83Z"></path> <path class="cls-1" d="M507.78,87.89c-2.44,2.11-6.15,3.12-9.77,3.12-9.01,0-14.15-4.97-14.15-13.98v-24.51h-7.58v-6.66h7.58v-9.77h8.09v9.77h12.81v6.66h-12.81v24.18c0,4.8,2.53,7.5,6.99,7.5,2.36,0,4.63-.76,6.32-2.11l2.53,5.81Z"></path> <path class="cls-1" d="M512.84,32.04c0-2.95,2.36-5.31,5.48-5.31s5.48,2.27,5.48,5.14c0,3.03-2.27,5.39-5.48,5.39s-5.48-2.27-5.48-5.22ZM514.27,45.85h8.09v44.65h-8.09v-44.65Z"></path> <path class="cls-1" d="M574,45.85l-19.54,44.65h-8.26l-19.54-44.65h8.42l15.33,35.8,15.67-35.8h7.92Z"></path> <path class="cls-1" d="M612.25,63.54v26.96h-7.67v-5.9c-2.7,4.04-7.67,6.4-14.66,6.4-10.11,0-16.51-5.39-16.51-13.14,0-7.16,4.63-13.06,17.94-13.06h12.8v-1.6c0-6.82-3.96-10.78-11.96-10.78-5.31,0-10.7,1.85-14.15,4.8l-3.37-6.07c4.63-3.71,11.29-5.73,18.45-5.73,12.22,0,19.12,5.9,19.12,18.11ZM604.16,76.85v-6.23h-12.47c-8,0-10.28,3.12-10.28,6.91,0,4.47,3.71,7.25,9.86,7.25s10.87-2.78,12.89-7.92Z"></path> </g> </g> <g> <path class="cls-1" d="M86.49,37.96c-8.51,1.82-14.39,5.39-18.77,13.04-2.13,3.73-3.15,7.69-3.6,11.99l.07,17.57.12,21.02c0,.53-.6,1.54-1.06,1.38-.96-.35-1.46-1.12-2.23-1.7-7.68-5.82-13.2-13.86-15.69-23.23-3-11.26-1.64-23.23,3.69-33.54,6.26-12.12,17.5-20.51,30.94-23.13,7.35-1.43,14.87-1.4,22.26.01,7.98,1.52,17.94,6.72,23.42,12.75.39.42,1.1,1.7.65,2.18-3.55,3.73-7.26,7.46-11.3,10.52-.54.41-1.21.27-1.67-.14-2.42-2.15-4.78-4.11-7.6-5.7-5.91-3.35-12.58-4.44-19.24-3.01Z"></path> <path class="cls-1" d="M82.19,110.02c-.96-.16-1.62-.87-1.62-1.79v-15.94c.62-.35,1.29-.31,1.93-.17,2.52.56,4.86,1.27,7.46,1.45,8.84.6,17.4-2.81,23.28-9.33.44-.49,1.16-.56,1.61-.16l5.31,4.74,5.42,4.9c.83.75.92,2.09.11,2.95-11.34,12.04-27.23,16.02-43.5,13.35Z"></path> <path class="cls-1" d="M106.46,70.26c-1.5,4.32-6.61,6.28-10.67,6.56s-8.36.31-12.62.24c-.81-.01-1.95-.41-2.38-1.1l-.05-12.1c-.01-3.18.06-6.14.25-9.46,6.24-.78,13.56-.98,19.56.89,6.44,2.12,7.88,9.28,5.9,14.97Z"></path> </g> </svg>';
const logo = figma.createNodeFromSvg(LOGO);
logo.name = 'Logo CoproActiva';
logo.resize(120, 24);
barra.appendChild(logo);

const nav = figma.createFrame();
nav.name = 'Navegación';
nav.layoutMode = 'VERTICAL';
nav.itemSpacing = 2;
nav.counterAxisSizingMode = 'AUTO';
nav.fills = [];
barra.appendChild(nav);
nav.layoutSizingHorizontal = 'FILL';
nav.layoutSizingVertical = 'FILL';

const grupos = [
  ['Operación', [['panel', 'Panel', false], ['comunidades', 'Comunidades', false], ['controles', 'Controles', true], ['ot', 'Órdenes de trabajo', false]]],
  ['Comercial', [['crm', 'CRM', false], ['oportunidades', 'Oportunidades', false], ['contratos', 'Contratos', false]]],
  ['Gestión', [['calendario', 'Calendario', false], ['correo', 'Correo', false]]]
];

for (const [grupo, items] of grupos) {
  const g = txt(grupo, 'etiqueta/campo', V.tenue, H.tenue);
  const cont = figma.createFrame();
  cont.name = 'Grupo · ' + grupo;
  cont.layoutMode = 'VERTICAL';
  cont.itemSpacing = 6;
  cont.counterAxisSizingMode = 'AUTO';
  cont.paddingTop = 14; cont.paddingBottom = 4; cont.paddingLeft = 10;
  cont.fills = [];
  nav.appendChild(cont);
  cont.layoutSizingHorizontal = 'FILL';
  cont.appendChild(g);
  g.layoutSizingHorizontal = 'FILL';
  g.textAutoResize = 'HEIGHT';

  for (const [icono, etiqueta, activo] of items) {
    const i = itemVariantes[activo ? 0 : 1].createInstance();
    nav.appendChild(i);
    i.layoutSizingHorizontal = 'FILL';
    const t = i.children.find(n => n.type === 'TEXT');
    if (t) t.characters = etiqueta;
    const viejo = i.children.find(n => n.name === 'icono');
    if (viejo) {
      const nuevo = figma.createNodeFromSvg(ICONOS[icono].split('COL').join(activo ? '#d5863b' : '#8b939b'));
      nuevo.name = 'icono';
      nuevo.resize(18, 18);
      i.insertChild(i.children.indexOf(viejo), nuevo);
      viejo.remove();
    }
  }
}

// Usuario conectado
const usuario = figma.createFrame();
usuario.name = 'Usuario';
usuario.layoutMode = 'VERTICAL';
usuario.itemSpacing = 6;
usuario.counterAxisSizingMode = 'AUTO';
usuario.paddingTop = 14; usuario.paddingLeft = 10;
usuario.fills = [];
usuario.strokes = [paint(V.bordeSuave, H.bordeSuave)];
usuario.strokeWeight = 1; usuario.strokeAlign = 'INSIDE';
usuario.strokeBottomWeight = 0; usuario.strokeLeftWeight = 0; usuario.strokeRightWeight = 0; usuario.strokeTopWeight = 1;
barra.appendChild(usuario);
usuario.layoutSizingHorizontal = 'FILL';

const nombre = txt('Paula Sepúlveda', 'cuerpo/campo', V.titulo, H.titulo);
usuario.appendChild(nombre);
nombre.layoutSizingHorizontal = 'FILL';
nombre.textAutoResize = 'HEIGHT';

const badgeJefatura = await figma.getNodeByIdAsync('13:36');
const badge = badgeJefatura.createInstance();
usuario.appendChild(badge);

return {
  createdNodeIds: [setItem.id, barra.id, ...itemVariantes.map(v => v.id)],
  itemSetId: setItem.id,
  itemActivoId: itemVariantes[0].id,
  itemNormalId: itemVariantes[1].id,
  barraLateralId: barra.id
};
