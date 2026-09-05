// 03 — Componentes de tabla web: "Panel de sección", "Encabezado de tabla" y el
// component set "Fila de control" (Enviado / Con observaciones / Crítico).
//
// El ancho de trabajo es 1104 px: 1440 de pantalla menos la barra lateral de 240 y
// 48 px de margen a cada lado. Las columnas de la fila y del encabezado coinciden
// exactamente para que la tabla quede alineada.

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
  blanco: 'VariableID:2:9', papel: 'VariableID:2:6', niebla: 'VariableID:2:7',
  bordeBase: 'VariableID:2:11', bordeSuave: 'VariableID:2:12',
  titulo: 'VariableID:2:14', apagado: 'VariableID:2:16', tenue: 'VariableID:2:18',
  naranja: 'VariableID:2:3', crT: 'VariableID:2:26', alT: 'VariableID:2:23',
  radioTarjeta: 'VariableID:3:19'
};
const V = {};
await Promise.all(Object.entries(ids).map(async ([k, i]) => { V[k] = await gv(i); }));

const H = {
  blanco: { r: 1, g: 1, b: 1 }, papel: { r: 0.969, g: 0.957, b: 0.941 },
  niebla: { r: 0.914, g: 0.902, b: 0.886 }, bordeBase: { r: 0.867, g: 0.843, b: 0.812 },
  bordeSuave: { r: 0.914, g: 0.902, b: 0.886 }, titulo: { r: 0.169, g: 0.192, b: 0.220 },
  apagado: { r: 0.353, g: 0.388, b: 0.424 }, tenue: { r: 0.545, g: 0.576, b: 0.608 },
  naranja: { r: 0.835, g: 0.525, b: 0.231 }, crT: { r: 0.576, g: 0.224, b: 0.169 },
  alT: { r: 0.541, g: 0.373, b: 0.133 }
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

// Anchos fijos de las columnas de la derecha; la primera toma el resto.
const COLS = { responsable: 160, fecha: 104, items: 78, hallazgos: 96, estado: 150, accion: 24 };
const creados = [];

// -------------------------------------------------------- Encabezado de tabla
const cab = figma.createComponent();
cab.name = 'Encabezado de tabla';
cab.description = 'Fila de títulos de la bandeja de controles. Columnas alineadas con Fila de control.';
cab.resize(1104, 40);
cab.x = 900; cab.y = 2300;
cab.layoutMode = 'HORIZONTAL';
cab.counterAxisAlignItems = 'CENTER';
cab.primaryAxisSizingMode = 'FIXED';
cab.counterAxisSizingMode = 'FIXED';
cab.itemSpacing = 16;
cab.paddingTop = 10; cab.paddingBottom = 10; cab.paddingLeft = 18; cab.paddingRight = 18;
cab.fills = [paint(V.papel, H.papel)];
bordeInferior(cab);
creados.push(cab.id);

const cabCols = [
  ['Comunidad', 0], ['Responsable', COLS.responsable], ['Fecha', COLS.fecha],
  ['Ítems', COLS.items], ['Hallazgos', COLS.hallazgos], ['Estado', COLS.estado]
];
for (const [etiqueta, ancho] of cabCols) {
  const t = txt(etiqueta, 'etiqueta/tabla', V.tenue, H.tenue);
  cab.appendChild(t);
  if (ancho === 0) {
    t.layoutSizingHorizontal = 'FILL';
  } else {
    t.textAutoResize = 'HEIGHT';
    t.resize(ancho, t.height);
    t.layoutSizingHorizontal = 'FIXED';
  }
}
// La columna de acción no lleva título: un espaciador mantiene la alineación con la fila.
const espaciador = figma.createFrame();
espaciador.name = 'Espaciador';
espaciador.resize(COLS.accion, 12);
espaciador.fills = [];
cab.appendChild(espaciador);
espaciador.layoutSizingHorizontal = 'FIXED';

// ------------------------------------------------------------ Fila de control
const filas = [
  ['Enviado', 'Edificio Parque Bustamante', 'Providencia · 84 unidades', 'Marcelo Ríos', '05 sep', '28/28', 'Sin hallazgos', '8:2', V.apagado, H.apagado],
  ['Con observaciones', 'Condominio Los Almendros', 'Las Condes · 42 casas', 'Marcelo Ríos', '04 sep', '31/31', '3 observaciones', '8:4', V.alT, H.alT],
  ['Crítico', 'Edificio Costanera Norte', 'Vitacura · 120 unidades', 'Ana Pizarro', '04 sep', '26/26', '1 crítico · 2 obs.', '8:6', V.crT, H.crT]
];

const variantes = [];
for (const [nom, comunidad, comuna, responsable, fecha, items, hallazgos, chipId, vHall, hHall] of filas) {
  const chipComp = await figma.getNodeByIdAsync(chipId);
  const c = figma.createComponent();
  c.name = `estado=${nom}`;
  c.resize(1104, 64);
  c.layoutMode = 'HORIZONTAL';
  c.counterAxisAlignItems = 'CENTER';
  c.primaryAxisSizingMode = 'FIXED';
  c.counterAxisSizingMode = 'AUTO';
  c.itemSpacing = 16;
  c.paddingTop = 14; c.paddingBottom = 14; c.paddingLeft = 18; c.paddingRight = 18;
  c.fills = [paint(V.blanco, H.blanco)];
  bordeInferior(c);

  // Comunidad — dos líneas, ocupa el ancho sobrante
  const col1 = figma.createFrame();
  col1.name = 'Comunidad';
  col1.layoutMode = 'VERTICAL';
  col1.itemSpacing = 2;
  col1.counterAxisSizingMode = 'AUTO';
  col1.fills = [];
  c.appendChild(col1);
  col1.layoutSizingHorizontal = 'FILL';
  const n1 = txt(comunidad, 'cuerpo/fuerte', V.titulo, H.titulo);
  col1.appendChild(n1);
  n1.layoutSizingHorizontal = 'FILL';
  n1.textAutoResize = 'HEIGHT';
  const n2 = txt(comuna, 'cuerpo/micro', V.tenue, H.tenue);
  col1.appendChild(n2);
  n2.layoutSizingHorizontal = 'FILL';
  n2.textAutoResize = 'HEIGHT';

  const columnas = [
    [responsable, COLS.responsable, 'cuerpo/campo', V.apagado, H.apagado],
    [fecha, COLS.fecha, 'cuerpo/campo', V.apagado, H.apagado],
    [items, COLS.items, 'cuerpo/campo', V.apagado, H.apagado],
    [hallazgos, COLS.hallazgos, 'cuerpo/chico', vHall, hHall]
  ];
  for (const [valor, ancho, estilo, vv, hh] of columnas) {
    const t = txt(valor, estilo, vv, hh);
    c.appendChild(t);
    t.textAutoResize = 'HEIGHT';
    t.resize(ancho, t.height);
    t.layoutSizingHorizontal = 'FIXED';
  }

  // Estado — chip del sistema
  const colEstado = figma.createFrame();
  colEstado.name = 'Estado';
  colEstado.layoutMode = 'HORIZONTAL';
  colEstado.counterAxisSizingMode = 'AUTO';
  colEstado.primaryAxisSizingMode = 'FIXED';
  colEstado.resize(COLS.estado, 24);
  colEstado.fills = [];
  c.appendChild(colEstado);
  colEstado.layoutSizingHorizontal = 'FIXED';
  if (chipComp) colEstado.appendChild(chipComp.createInstance());

  const chevron = figma.createNodeFromSvg('<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="m9 6 6 6-6 6" stroke="#8b939b" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>');
  chevron.name = 'icono/abrir';
  chevron.resize(18, 18);
  c.appendChild(chevron);

  variantes.push(c);
}

const setFila = figma.combineAsVariants(variantes, page);
setFila.name = 'Fila de control';
setFila.description = 'Registro de la bandeja de controles recibidos. El recuento de hallazgos se tiñe con el color del estado.';
setFila.x = 900; setFila.y = 2420;
setFila.layoutMode = 'VERTICAL';
setFila.itemSpacing = 20;
setFila.paddingTop = 24; setFila.paddingBottom = 24; setFila.paddingLeft = 24; setFila.paddingRight = 24;
setFila.primaryAxisSizingMode = 'AUTO';
setFila.counterAxisSizingMode = 'AUTO';
creados.push(setFila.id, ...variantes.map(v => v.id));

// ----------------------------------------------------------- Panel de sección
const panel = figma.createComponent();
panel.name = 'Panel de sección';
panel.description = 'Contenedor blanco con cabecera y cuerpo, para agrupar tablas, listas y bloques de un tablero.';
panel.resize(700, 240);
panel.x = 900; panel.y = 3000;
panel.layoutMode = 'VERTICAL';
panel.primaryAxisSizingMode = 'AUTO';
panel.counterAxisSizingMode = 'FIXED';
panel.itemSpacing = 0;
panel.fills = [paint(V.blanco, H.blanco)];
panel.strokes = [paint(V.bordeBase, H.bordeBase)];
panel.strokeWeight = 1;
radios(panel, V.radioTarjeta);
panel.clipsContent = true;
creados.push(panel.id);

const panelCab = figma.createFrame();
panelCab.name = 'Cabecera';
panelCab.layoutMode = 'HORIZONTAL';
panelCab.counterAxisAlignItems = 'CENTER';
panelCab.itemSpacing = 12;
panelCab.counterAxisSizingMode = 'AUTO';
panelCab.paddingTop = 16; panelCab.paddingBottom = 16; panelCab.paddingLeft = 18; panelCab.paddingRight = 18;
panelCab.fills = [];
bordeInferior(panelCab);
panel.appendChild(panelCab);
panelCab.layoutSizingHorizontal = 'FILL';

const pt = txt('Controles de hoy', 'etiqueta/grupo', V.titulo, H.titulo);
panelCab.appendChild(pt);
pt.layoutSizingHorizontal = 'FILL';
pt.textAutoResize = 'HEIGHT';
const pa = txt('Ver todos', 'etiqueta/chip', V.naranja, H.naranja);
panelCab.appendChild(pa);

const panelCuerpo = figma.createFrame();
panelCuerpo.name = 'Cuerpo';
panelCuerpo.layoutMode = 'VERTICAL';
panelCuerpo.itemSpacing = 0;
panelCuerpo.counterAxisSizingMode = 'AUTO';
panelCuerpo.fills = [];
panel.appendChild(panelCuerpo);
panelCuerpo.layoutSizingHorizontal = 'FILL';

return {
  createdNodeIds: creados,
  encabezadoTablaId: cab.id,
  filaSetId: setFila.id,
  filas: variantes.map(v => ({ name: v.name, id: v.id })),
  panelId: panel.id
};
