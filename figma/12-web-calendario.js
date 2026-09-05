// 12 — "Calendario" (1440x900) en la página Gestión · web.
//
// Grilla mensual de septiembre de 2025 (el 1 cae lunes, así que la primera semana
// empieza completa) con visitas de control, vencimientos de OT y de contrato,
// asambleas y reuniones comerciales. Requiere 02, 03 y 07.

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
  bordeBase: 'VariableID:2:11', bordeSuave: 'VariableID:2:12', titulo: 'VariableID:2:14',
  apagado: 'VariableID:2:16', tenue: 'VariableID:2:18', naranja: 'VariableID:2:3',
  pizarra: 'VariableID:2:4', crT: 'VariableID:2:26', okT: 'VariableID:2:20',
  radioControl: 'VariableID:3:18'
};
const V = {};
await Promise.all(Object.entries(ids).map(async ([k, i]) => { V[k] = await gv(i); }));

const H = {
  fondoApp: { r: 0.902, g: 0.886, b: 0.867 }, blanco: { r: 1, g: 1, b: 1 },
  papel: { r: 0.969, g: 0.957, b: 0.941 }, bordeBase: { r: 0.867, g: 0.843, b: 0.812 },
  bordeSuave: { r: 0.914, g: 0.902, b: 0.886 }, titulo: { r: 0.169, g: 0.192, b: 0.220 },
  apagado: { r: 0.353, g: 0.388, b: 0.424 }, tenue: { r: 0.545, g: 0.576, b: 0.608 },
  naranja: { r: 0.835, g: 0.525, b: 0.231 }, pizarra: { r: 0.290, g: 0.353, b: 0.408 },
  crT: { r: 0.576, g: 0.224, b: 0.169 }, okT: { r: 0.306, g: 0.420, b: 0.290 }
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
const btnPri = variante('Botón', 'tipo=Primario, tamaño=Web');
const btnSec = variante('Botón', 'tipo=Secundario, tamaño=Web');
const celdaDe = tipo => variante('Celda de calendario', `tipo=${tipo}`);

if (!barraLateral || !panelComp || !celdaDe('Normal')) {
  throw new Error('Faltan componentes: ejecuta primero 02-web-navegacion.js, 03-web-tabla.js y 07-web-componentes-2.js');
}

// Tipos de evento y su color
const TIPO = {
  control: [V.naranja, H.naranja],
  vence: [V.crT, H.crT],
  reunion: [V.pizarra, H.pizarra],
  hecho: [V.okT, H.okT]
};

const p = figma.createFrame();
p.name = 'Calendario';
p.resize(1440, 900);
p.layoutMode = 'HORIZONTAL';
p.primaryAxisSizingMode = 'FIXED';
p.counterAxisSizingMode = 'FIXED';
p.clipsContent = true;
p.fills = [paint(V.fondoApp, H.fondoApp)];
web.appendChild(p);
p.x = 1640; p.y = 2100;

const barra = barraLateral.createInstance();
p.appendChild(barra);
barra.layoutSizingVertical = 'FILL';

const cont = figma.createFrame();
cont.name = 'Contenido';
cont.layoutMode = 'VERTICAL';
cont.itemSpacing = 16;
cont.paddingTop = 28; cont.paddingBottom = 28; cont.paddingLeft = 32; cont.paddingRight = 32;
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
const h = txt('Septiembre 2025', 'display/h2', V.titulo, H.titulo);
cabCol.appendChild(h);
h.layoutSizingHorizontal = 'FILL';
h.textAutoResize = 'HEIGHT';
const hs = txt('24 visitas de control programadas · 4 vencimientos · 2 asambleas', 'cuerpo/chico', V.apagado, H.apagado);
cabCol.appendChild(hs);
hs.layoutSizingHorizontal = 'FILL';
hs.textAutoResize = 'HEIGHT';

// Navegación de mes
const nav = figma.createFrame();
nav.name = 'Navegación';
nav.layoutMode = 'HORIZONTAL';
nav.itemSpacing = 0;
nav.counterAxisSizingMode = 'AUTO';
nav.fills = [];
cab.appendChild(nav);
for (const [nombre, d] of [['anterior', 'm15 6-6 6 6 6'], ['siguiente', 'm9 6 6 6-6 6']]) {
  const b = figma.createFrame();
  b.name = 'Mes ' + nombre;
  b.resize(38, 38);
  b.layoutMode = 'HORIZONTAL';
  b.primaryAxisAlignItems = 'CENTER';
  b.counterAxisAlignItems = 'CENTER';
  b.primaryAxisSizingMode = 'FIXED';
  b.counterAxisSizingMode = 'FIXED';
  b.fills = [paint(V.blanco, H.blanco)];
  b.strokes = [paint(V.bordeBase, H.bordeBase)];
  b.strokeWeight = 1;
  for (const k of ['topLeftRadius', 'topRightRadius', 'bottomLeftRadius', 'bottomRightRadius']) b.setBoundVariable(k, V.radioControl);
  nav.appendChild(b);
  const ico = figma.createNodeFromSvg(`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="${d}" stroke="#2b3138" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`);
  ico.name = 'icono';
  ico.resize(18, 18);
  b.appendChild(ico);
}
for (const [comp, label] of [[btnSec, 'Sincronizar'], [btnPri, 'Programar visita']]) {
  if (!comp) continue;
  const b = comp.createInstance();
  cab.appendChild(b);
  const bt = b.children.find(n => n.type === 'TEXT');
  if (bt) bt.characters = label;
}

// -------------------------------------------------------------------- Leyenda
const leyenda = figma.createFrame();
leyenda.name = 'Leyenda';
leyenda.layoutMode = 'HORIZONTAL';
leyenda.itemSpacing = 20;
leyenda.counterAxisAlignItems = 'CENTER';
leyenda.counterAxisSizingMode = 'AUTO';
leyenda.fills = [];
cont.appendChild(leyenda);
leyenda.layoutSizingHorizontal = 'FILL';
for (const [etiqueta, tipo] of [
  ['Control en terreno', 'control'], ['Vencimiento de OT o contrato', 'vence'],
  ['Asamblea o reunión', 'reunion'], ['Completado', 'hecho']
]) {
  const g = figma.createFrame();
  g.name = etiqueta;
  g.layoutMode = 'HORIZONTAL';
  g.itemSpacing = 6;
  g.counterAxisAlignItems = 'CENTER';
  g.counterAxisSizingMode = 'AUTO';
  g.fills = [];
  leyenda.appendChild(g);
  const punto = figma.createEllipse();
  punto.name = 'Punto';
  punto.resize(6, 6);
  punto.fills = [paint(TIPO[tipo][0], TIPO[tipo][1])];
  g.appendChild(punto);
  g.appendChild(txt(etiqueta, 'cuerpo/micro', V.apagado, H.apagado));
}

// --------------------------------------------------------------------- Cuerpo
const fila = figma.createFrame();
fila.name = 'Mes y agenda';
fila.layoutMode = 'HORIZONTAL';
fila.itemSpacing = 16;
fila.counterAxisSizingMode = 'FIXED';
fila.fills = [];
cont.appendChild(fila);
fila.layoutSizingHorizontal = 'FILL';
fila.layoutSizingVertical = 'FILL';

// Grilla mensual
const grilla = figma.createFrame();
grilla.name = 'Grilla del mes';
grilla.layoutMode = 'VERTICAL';
grilla.itemSpacing = 0;
grilla.counterAxisSizingMode = 'FIXED';
grilla.fills = [paint(V.blanco, H.blanco)];
grilla.strokes = [paint(V.bordeBase, H.bordeBase)];
grilla.strokeWeight = 1;
grilla.clipsContent = true;
fila.appendChild(grilla);
grilla.layoutSizingHorizontal = 'FILL';
grilla.layoutSizingVertical = 'FILL';

const diasCab = figma.createFrame();
diasCab.name = 'Días de la semana';
diasCab.layoutMode = 'HORIZONTAL';
diasCab.itemSpacing = 0;
diasCab.counterAxisSizingMode = 'AUTO';
diasCab.paddingTop = 10; diasCab.paddingBottom = 10;
diasCab.fills = [paint(V.papel, H.papel)];
bordeInferior(diasCab);
grilla.appendChild(diasCab);
diasCab.layoutSizingHorizontal = 'FILL';
for (const d of ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']) {
  const w = figma.createFrame();
  w.layoutMode = 'HORIZONTAL';
  w.primaryAxisAlignItems = 'CENTER';
  w.counterAxisSizingMode = 'AUTO';
  w.fills = [];
  w.name = d;
  diasCab.appendChild(w);
  w.layoutSizingHorizontal = 'FILL';
  w.appendChild(txt(d, 'etiqueta/tabla', V.tenue, H.tenue));
}

// Cada entrada: [número, tipo de celda, eventos]. Septiembre parte lunes 1.
const dias = [
  ['1', 'Normal', []],
  ['2', 'Normal', [['Control · Alto Macul', 'hecho']]],
  ['3', 'Normal', [['Control · Plaza Ñuñoa', 'hecho']]],
  ['4', 'Normal', [['Control · Costanera Norte', 'hecho'], ['Asamblea · Los Almendros', 'reunion']]],
  ['5', 'Hoy', [['Control · P. Bustamante', 'control'], ['Vence OT-1042', 'vence'], ['Llamada · Vista Andes', 'reunion']]],
  ['6', 'Normal', []],
  ['7', 'Normal', []],
  ['8', 'Normal', [['Control · Los Almendros', 'control']]],
  ['9', 'Normal', [['Reunión · El Peral', 'reunion']]],
  ['10', 'Normal', []],
  ['11', 'Normal', [['Directorio · Vallemar', 'reunion']]],
  ['12', 'Normal', [['Control · Mirador', 'control']]],
  ['13', 'Normal', []],
  ['14', 'Normal', []],
  ['15', 'Normal', [['Control · Santa Elena', 'control']]],
  ['16', 'Normal', []],
  ['17', 'Normal', [['Vence OT-1044', 'vence']]],
  ['18', 'Normal', []],
  ['19', 'Normal', []],
  ['20', 'Normal', []],
  ['21', 'Normal', []],
  ['22', 'Normal', [['Control · El Peral', 'control']]],
  ['23', 'Normal', [['Asamblea · Costanera', 'reunion']]],
  ['24', 'Normal', []],
  ['25', 'Normal', [['Control · Vista Andes', 'control']]],
  ['26', 'Normal', []],
  ['27', 'Normal', []],
  ['28', 'Normal', []],
  ['29', 'Normal', [['Control · Alto Macul', 'control']]],
  ['30', 'Normal', [['Vence contrato · Costanera', 'vence']]],
  ['1', 'Otro mes', []],
  ['2', 'Otro mes', []],
  ['3', 'Otro mes', []],
  ['4', 'Otro mes', []],
  ['5', 'Otro mes', []]
];

for (let semana = 0; semana < 5; semana++) {
  const f = figma.createFrame();
  f.name = 'Semana ' + (semana + 1);
  f.layoutMode = 'HORIZONTAL';
  f.itemSpacing = 0;
  f.counterAxisSizingMode = 'AUTO';
  f.fills = [];
  grilla.appendChild(f);
  f.layoutSizingHorizontal = 'FILL';

  for (let d = 0; d < 7; d++) {
    const [numero, tipo, eventos] = dias[semana * 7 + d];
    const comp = celdaDe(tipo);
    if (!comp) continue;
    const celda = comp.createInstance();
    f.appendChild(celda);
    celda.layoutSizingHorizontal = 'FILL';

    // El número del día: suelto en Normal / Otro mes, dentro de la pastilla en Hoy.
    if (tipo === 'Hoy') {
      const marca = celda.children.find(n => n.name === 'Hoy');
      const t = marca && marca.children.find(n => n.type === 'TEXT');
      if (t) t.characters = numero;
    } else {
      const t = celda.children.find(n => n.type === 'TEXT');
      if (t) t.characters = numero;
    }

    const slots = celda.children.filter(n => n.name.indexOf('Evento') === 0);
    slots.forEach((s, i) => {
      if (i < eventos.length) {
        s.visible = true;
        const [texto, tipoEv] = eventos[i];
        const punto = s.children.find(n => n.type === 'ELLIPSE');
        if (punto) punto.fills = [paint(TIPO[tipoEv][0], TIPO[tipoEv][1])];
        const t = s.children.find(n => n.type === 'TEXT');
        if (t) t.characters = texto;
      } else {
        s.visible = false;
      }
    });
  }
}

// Agenda del día
const agendaInst = panelComp.createInstance();
fila.appendChild(agendaInst);
agendaInst.resize(320, agendaInst.height);
agendaInst.layoutSizingHorizontal = 'FIXED';
agendaInst.layoutSizingVertical = 'FILL';
const agTs = agendaInst.findAllWithCriteria({ types: ['TEXT'] });
if (agTs[0]) agTs[0].characters = 'Viernes 5';
if (agTs[1]) agTs[1].characters = 'Agregar';
const agCuerpo = agendaInst.findOne(n => n.name === 'Cuerpo');

for (const [hora, titulo, detalle, tipo] of [
  ['09:00', 'Control · Edificio Parque Bustamante', 'Marcelo Ríos · en curso desde las 11:34', 'control'],
  ['12:00', 'Vence OT-1042', 'Reposición de luminaria · Costanera Norte', 'vence'],
  ['16:00', 'Llamada con el comité de Vista Andes', 'Seguimiento de la propuesta enviada el 1 de sep', 'reunion'],
  ['17:30', 'Revisión de controles del día', 'Paula Sepúlveda · interna', 'reunion']
]) {
  const f = figma.createFrame();
  f.name = 'Evento · ' + titulo;
  f.layoutMode = 'HORIZONTAL';
  f.itemSpacing = 10;
  f.counterAxisAlignItems = 'MIN';
  f.counterAxisSizingMode = 'AUTO';
  f.paddingTop = 13; f.paddingBottom = 13; f.paddingLeft = 18; f.paddingRight = 18;
  f.fills = [];
  bordeInferior(f);
  agCuerpo.appendChild(f);
  f.layoutSizingHorizontal = 'FILL';

  const punto = figma.createEllipse();
  punto.name = 'Punto';
  punto.resize(6, 6);
  punto.y = 6;
  punto.fills = [paint(TIPO[tipo][0], TIPO[tipo][1])];
  f.appendChild(punto);

  const col = figma.createFrame();
  col.layoutMode = 'VERTICAL';
  col.itemSpacing = 3;
  col.counterAxisSizingMode = 'AUTO';
  col.fills = [];
  col.name = 'Texto';
  f.appendChild(col);
  col.layoutSizingHorizontal = 'FILL';
  const t0 = txt(hora, 'etiqueta/campo', V.tenue, H.tenue);
  col.appendChild(t0);
  t0.layoutSizingHorizontal = 'FILL';
  t0.textAutoResize = 'HEIGHT';
  const t1 = txt(titulo, 'cuerpo/chico', V.titulo, H.titulo);
  col.appendChild(t1);
  t1.layoutSizingHorizontal = 'FILL';
  t1.textAutoResize = 'HEIGHT';
  const t2 = txt(detalle, 'cuerpo/micro', V.tenue, H.tenue);
  col.appendChild(t2);
  t2.layoutSizingHorizontal = 'FILL';
  t2.textAutoResize = 'HEIGHT';
}

return { createdNodeIds: [p.id, cont.id, grilla.id, agendaInst.id], pantallaId: p.id };
