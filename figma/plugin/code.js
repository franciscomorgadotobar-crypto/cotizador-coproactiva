// ARCHIVO GENERADO — no editar a mano.
// Se regenera con:  node build.mjs
// Fuente: los scripts NN-*.js de la carpeta figma/
//
// Plugin de desarrollo para construir la interfaz de CoproActiva dentro de Figma sin
// depender del conector MCP ni de su cuota mensual.

const PASOS = [
  {
    id: "01",
    archivo: "01-hallazgo-cuerpo.js",
    nombre: "Cuerpo de Nuevo hallazgo",
    pagina: "Terreno · app móvil",
    requiere: [],
    ejecutar: async function () {
      // 01 — Cuerpo de la pantalla "Nuevo hallazgo" (390x844) + variante "En curso" del chip.
      //
      // Construye dentro del cuerpo 17:132: evidencia fotográfica, ubicación, descripción,
      // severidad, bloque de geolocalización y generación de orden de trabajo. Agrega el pie
      // de acciones a la pantalla 17:124.
      //
      // Además arregla el chip de la tarjeta de visita en curso, que mostraba "Con
      // observación": crea la variante estado=En curso en el set 8:10 y la intercambia en el
      // componente 13:12 (no en la instancia, para que el cambio se propague).

      const page = figma.root.children.find(p => p.name === 'Terreno · app móvil');
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
        blanco: 'VariableID:2:9', bordeBase: 'VariableID:2:11', bordeSuave: 'VariableID:2:12',
        titulo: 'VariableID:2:14', apagado: 'VariableID:2:16', tenue: 'VariableID:2:18',
        niebla: 'VariableID:2:7', naranja: 'VariableID:2:3',
        crT: 'VariableID:2:26', crF: 'VariableID:2:27', crB: 'VariableID:2:28',
        alT: 'VariableID:2:23', alF: 'VariableID:2:24', alB: 'VariableID:2:25',
        okT: 'VariableID:2:20',
        radioControl: 'VariableID:3:18', radioTarjeta: 'VariableID:3:19', radioPastilla: 'VariableID:3:20'
      };
      const V = {};
      await Promise.all(Object.entries(ids).map(async ([k, i]) => { V[k] = await gv(i); }));

      const H = {
        blanco: { r: 1, g: 1, b: 1 }, bordeBase: { r: 0.867, g: 0.843, b: 0.812 },
        bordeSuave: { r: 0.914, g: 0.902, b: 0.886 }, titulo: { r: 0.169, g: 0.192, b: 0.220 },
        apagado: { r: 0.353, g: 0.388, b: 0.424 }, tenue: { r: 0.545, g: 0.576, b: 0.608 },
        niebla: { r: 0.914, g: 0.902, b: 0.886 }, naranja: { r: 0.835, g: 0.525, b: 0.231 },
        crT: { r: 0.576, g: 0.224, b: 0.169 }, crF: { r: 0.984, g: 0.933, b: 0.922 }, crB: { r: 0.929, g: 0.824, b: 0.796 },
        alT: { r: 0.541, g: 0.373, b: 0.133 }, alF: { r: 0.992, g: 0.953, b: 0.902 }, alB: { r: 0.941, g: 0.863, b: 0.741 },
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

      const [pantalla, cuerpo, campoMovil, btnSec, btnPri, chipSet, tarjetaEnCurso] = await Promise.all([
        figma.getNodeByIdAsync('17:124'), figma.getNodeByIdAsync('17:132'), figma.getNodeByIdAsync('9:6'),
        figma.getNodeByIdAsync('5:8'), figma.getNodeByIdAsync('5:4'), figma.getNodeByIdAsync('8:10'),
        figma.getNodeByIdAsync('13:12')
      ]);

      const creados = [];
      const mutados = [];

      cuerpo.itemSpacing = 12;

      // ---------------------------------------------------------------- Evidencia
      const tituloGrupo = nombre => {
        const g = figma.createFrame();
        g.name = 'Título grupo';
        g.layoutMode = 'VERTICAL';
        g.counterAxisSizingMode = 'AUTO';
        g.paddingBottom = 8;
        g.fills = [];
        g.strokes = [paint(V.bordeSuave, H.bordeSuave)];
        g.strokeWeight = 1; g.strokeAlign = 'INSIDE';
        g.strokeTopWeight = 0; g.strokeLeftWeight = 0; g.strokeRightWeight = 0; g.strokeBottomWeight = 1;
        cuerpo.appendChild(g);
        g.layoutSizingHorizontal = 'FILL';
        const t = txt(nombre, 'etiqueta/grupo', V.titulo, H.titulo);
        g.appendChild(t);
        t.layoutSizingHorizontal = 'FILL';
        t.textAutoResize = 'HEIGHT';
        return g;
      };

      creados.push(tituloGrupo('Evidencia').id);

      const CAMARA = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 8.5A1.5 1.5 0 0 1 4.5 7h2.2l1.1-2h8.4l1.1 2h2.2A1.5 1.5 0 0 1 21 8.5v9A1.5 1.5 0 0 1 19.5 19h-15A1.5 1.5 0 0 1 3 17.5v-9Z" stroke="#8b939b" stroke-width="1.5" stroke-linejoin="round"/><circle cx="12" cy="13" r="3.4" stroke="#8b939b" stroke-width="1.5"/></svg>';
      const MAS = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 5v14M5 12h14" stroke="#8b939b" stroke-width="1.6" stroke-linecap="round"/></svg>';

      const fotos = figma.createFrame();
      fotos.name = 'Fotos';
      fotos.layoutMode = 'HORIZONTAL';
      fotos.itemSpacing = 10;
      fotos.counterAxisSizingMode = 'AUTO';
      fotos.fills = [];
      cuerpo.appendChild(fotos);
      fotos.layoutSizingHorizontal = 'FILL';
      creados.push(fotos.id);

      for (const etiqueta of ['IMG_0421', 'IMG_0422', null]) {
        const slot = figma.createFrame();
        slot.name = etiqueta ? 'Foto adjunta' : 'Agregar foto';
        slot.layoutMode = 'VERTICAL';
        slot.primaryAxisAlignItems = 'CENTER';
        slot.counterAxisAlignItems = 'CENTER';
        slot.itemSpacing = 6;
        slot.counterAxisSizingMode = 'FIXED';
        slot.primaryAxisSizingMode = 'FIXED';
        slot.resize(112, 88);
        slot.fills = [etiqueta ? paint(V.niebla, H.niebla) : paint(V.blanco, H.blanco)];
        slot.strokes = [paint(V.bordeBase, H.bordeBase)];
        slot.strokeWeight = 1;
        if (!etiqueta) slot.dashPattern = [4, 3];
        radios(slot, V.radioControl);
        fotos.appendChild(slot);
        slot.layoutSizingHorizontal = 'FILL';
        slot.layoutSizingVertical = 'FIXED';
        const ico = figma.createNodeFromSvg(etiqueta ? CAMARA : MAS);
        ico.name = 'icono';
        ico.resize(24, 24);
        slot.appendChild(ico);
        slot.appendChild(txt(etiqueta || 'Agregar', 'cuerpo/micro', V.tenue, H.tenue));
      }

      // ------------------------------------------------------------------ Detalle
      for (const [label, valor] of [
        ['Ubicación exacta dentro de la comunidad', 'Subterráneo -1, sector estacionamientos'],
        ['Descripción del hallazgo', 'Luminaria de emergencia sin funcionar; la batería no responde al corte de energía.']
      ]) {
        const i = campoMovil.createInstance();
        cuerpo.appendChild(i);
        i.layoutSizingHorizontal = 'FILL';
        const ts = i.findAllWithCriteria({ types: ['TEXT'] });
        ts[0].characters = label;
        ts[1].characters = valor;
        ts[1].fills = [paint(V.titulo, H.titulo)];
        creados.push(i.id);
      }

      // ----------------------------------------------------------------- Severidad
      const sevBloque = figma.createFrame();
      sevBloque.name = 'Severidad';
      sevBloque.layoutMode = 'VERTICAL';
      sevBloque.itemSpacing = 6;
      sevBloque.counterAxisSizingMode = 'AUTO';
      sevBloque.fills = [];
      cuerpo.appendChild(sevBloque);
      sevBloque.layoutSizingHorizontal = 'FILL';
      creados.push(sevBloque.id);

      const sevLbl = txt('Severidad', 'etiqueta/campo', V.tenue, H.tenue);
      sevBloque.appendChild(sevLbl);
      sevLbl.layoutSizingHorizontal = 'FILL';
      sevLbl.textAutoResize = 'HEIGHT';

      const sevSeg = figma.createFrame();
      sevSeg.name = 'Selector';
      sevSeg.layoutMode = 'HORIZONTAL';
      sevSeg.itemSpacing = 6;
      sevSeg.counterAxisSizingMode = 'AUTO';
      sevSeg.fills = [];
      sevBloque.appendChild(sevSeg);
      sevSeg.layoutSizingHorizontal = 'FILL';

      // Misma anatomía que el selector del Ítem de control: celdas de 44 px táctiles.
      for (const [lab, activo] of [['Menor', false], ['Importante', false], ['Crítica', true]]) {
        const cel = figma.createFrame();
        cel.name = lab;
        cel.layoutMode = 'HORIZONTAL';
        cel.primaryAxisAlignItems = 'CENTER';
        cel.counterAxisAlignItems = 'CENTER';
        cel.counterAxisSizingMode = 'FIXED';
        cel.resize(100, 44);
        cel.fills = [activo ? paint(V.crF, H.crF) : paint(V.blanco, H.blanco)];
        cel.strokes = [activo ? paint(V.crB, H.crB) : paint(V.bordeBase, H.bordeBase)];
        cel.strokeWeight = activo ? 1.5 : 1;
        radios(cel, V.radioControl);
        cel.appendChild(txt(lab, 'etiqueta/chip', activo ? V.crT : V.tenue, activo ? H.crT : H.tenue));
        sevSeg.appendChild(cel);
        cel.layoutSizingHorizontal = 'FILL';
        cel.layoutSizingVertical = 'FIXED';
      }

      // ----------------------------------------------------------- Geolocalización
      const geo = figma.createFrame();
      geo.name = 'Geolocalización';
      geo.layoutMode = 'VERTICAL';
      geo.itemSpacing = 10;
      geo.counterAxisSizingMode = 'AUTO';
      geo.paddingTop = 14; geo.paddingBottom = 14; geo.paddingLeft = 14; geo.paddingRight = 14;
      geo.fills = [paint(V.blanco, H.blanco)];
      geo.strokes = [paint(V.bordeBase, H.bordeBase)];
      geo.strokeWeight = 1;
      radios(geo, V.radioTarjeta);
      cuerpo.appendChild(geo);
      geo.layoutSizingHorizontal = 'FILL';
      creados.push(geo.id);

      const geoFila = figma.createFrame();
      geoFila.layoutMode = 'HORIZONTAL';
      geoFila.itemSpacing = 6;
      geoFila.counterAxisAlignItems = 'CENTER';
      geoFila.counterAxisSizingMode = 'AUTO';
      geoFila.fills = [];
      geoFila.name = 'Cabecera';
      geo.appendChild(geoFila);
      geoFila.layoutSizingHorizontal = 'FILL';
      const pin = figma.createNodeFromSvg('<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" stroke="#4e6b4a" stroke-width="1.7" stroke-linejoin="round"/><circle cx="12" cy="10" r="2.6" stroke="#4e6b4a" stroke-width="1.7"/></svg>');
      pin.name = 'icono/ubicacion';
      pin.resize(14, 14);
      geoFila.appendChild(pin);
      const geoT = txt('Ubicación registrada automáticamente', 'etiqueta/campo', V.okT, H.okT);
      geoFila.appendChild(geoT);
      geoT.layoutSizingHorizontal = 'FILL';
      geoT.textAutoResize = 'HEIGHT';

      // Mapa de referencia: marcador de posición dibujado, no una imagen real.
      const mapa = figma.createFrame();
      mapa.name = 'Mapa (marcador de posición)';
      mapa.resize(330, 48);
      mapa.fills = [paint(V.niebla, H.niebla)];
      mapa.strokes = [paint(V.bordeSuave, H.bordeSuave)];
      mapa.strokeWeight = 1;
      mapa.clipsContent = true;
      radios(mapa, V.radioControl);
      geo.appendChild(mapa);
      mapa.layoutSizingHorizontal = 'FILL';
      mapa.layoutSizingVertical = 'FIXED';

      for (const [x, y, w, h] of [[0, 18, 330, 1.5], [0, 34, 330, 1.5], [96, 0, 1.5, 48], [214, 0, 1.5, 48]]) {
        const linea = figma.createRectangle();
        linea.name = 'Calle';
        linea.resize(w, h);
        linea.x = x; linea.y = y;
        linea.fills = [paint(V.bordeBase, H.bordeBase)];
        mapa.appendChild(linea);
      }
      const marca = figma.createEllipse();
      marca.name = 'Marcador';
      marca.resize(12, 12);
      marca.x = 158; marca.y = 18;
      marca.fills = [paint(V.naranja, H.naranja)];
      marca.strokes = [paint(V.blanco, H.blanco)];
      marca.strokeWeight = 2;
      mapa.appendChild(marca);

      const coords = txt('-33,4489  -70,6339 · precisión 8 m · registrado 15:42', 'cuerpo/micro', V.apagado, H.apagado);
      geo.appendChild(coords);
      coords.layoutSizingHorizontal = 'FILL';
      coords.textAutoResize = 'HEIGHT';

      // ------------------------------------------------------- Orden de trabajo
      const ot = figma.createFrame();
      ot.name = 'Generar OT';
      ot.layoutMode = 'HORIZONTAL';
      ot.itemSpacing = 12;
      ot.counterAxisAlignItems = 'CENTER';
      ot.counterAxisSizingMode = 'AUTO';
      ot.paddingTop = 14; ot.paddingBottom = 14; ot.paddingLeft = 14; ot.paddingRight = 14;
      ot.fills = [paint(V.blanco, H.blanco)];
      ot.strokes = [paint(V.bordeBase, H.bordeBase)];
      ot.strokeWeight = 1;
      radios(ot, V.radioTarjeta);
      cuerpo.appendChild(ot);
      ot.layoutSizingHorizontal = 'FILL';
      creados.push(ot.id);

      const otCol = figma.createFrame();
      otCol.layoutMode = 'VERTICAL';
      otCol.itemSpacing = 3;
      otCol.counterAxisSizingMode = 'AUTO';
      otCol.fills = [];
      otCol.name = 'Texto';
      ot.appendChild(otCol);
      otCol.layoutSizingHorizontal = 'FILL';
      const otT = txt('Generar orden de trabajo', 'cuerpo/base', V.titulo, H.titulo);
      otCol.appendChild(otT);
      otT.layoutSizingHorizontal = 'FILL';
      otT.textAutoResize = 'HEIGHT';
      const otS = txt('Se asigna a mantención · vence en 48 h', 'cuerpo/micro', V.tenue, H.tenue);
      otCol.appendChild(otS);
      otS.layoutSizingHorizontal = 'FILL';
      otS.textAutoResize = 'HEIGHT';

      const sw = figma.createFrame();
      sw.name = 'Interruptor';
      sw.resize(44, 26);
      sw.fills = [paint(V.naranja, H.naranja)];
      sw.clipsContent = false;
      radios(sw, V.radioPastilla);
      ot.appendChild(sw);
      const perilla = figma.createEllipse();
      perilla.name = 'Perilla';
      perilla.resize(20, 20);
      perilla.x = 21; perilla.y = 3;
      perilla.fills = [paint(V.blanco, H.blanco)];
      sw.appendChild(perilla);

      // ------------------------------------------------------------- Pie de acciones
      const pie = figma.createFrame();
      pie.name = 'Acciones';
      pie.layoutMode = 'HORIZONTAL';
      pie.itemSpacing = 10;
      pie.paddingTop = 14; pie.paddingBottom = 30; pie.paddingLeft = 16; pie.paddingRight = 16;
      pie.counterAxisSizingMode = 'AUTO';
      pie.fills = [paint(V.blanco, H.blanco)];
      pie.strokes = [paint(V.bordeBase, H.bordeBase)];
      pie.strokeWeight = 1; pie.strokeAlign = 'INSIDE';
      pie.strokeBottomWeight = 0; pie.strokeLeftWeight = 0; pie.strokeRightWeight = 0; pie.strokeTopWeight = 1;
      pantalla.appendChild(pie);
      pie.layoutSizingHorizontal = 'FILL';
      creados.push(pie.id);

      for (const [comp, label] of [[btnSec, 'Descartar'], [btnPri, 'Registrar hallazgo']]) {
        const b = comp.createInstance();
        pie.appendChild(b);
        b.layoutSizingHorizontal = 'FILL';
        const bt = b.children.find(n => n.type === 'TEXT');
        if (bt) bt.characters = label;
        creados.push(b.id);
      }

      // -------------------------------------------- Variante "En curso" del chip
      let enCurso = chipSet.children.find(c => c.name === 'estado=En curso');
      if (!enCurso) {
        const base = chipSet.children.find(c => c.name === 'estado=Alerta');
        enCurso = base.clone();
        enCurso.name = 'estado=En curso';
        const t = enCurso.children.find(n => n.type === 'TEXT');
        if (t) t.characters = 'En curso';
        chipSet.appendChild(enCurso);
        creados.push(enCurso.id);
      }

      // El swap va en el componente, no en la instancia: así se propaga a la pantalla.
      const chipEnTarjeta = tarjetaEnCurso
        .findAllWithCriteria({ types: ['INSTANCE'] })
        .find(i => i.mainComponent && i.mainComponent.parent && i.mainComponent.parent.id === chipSet.id);
      if (chipEnTarjeta) {
        chipEnTarjeta.swapComponent(enCurso);
        mutados.push(chipEnTarjeta.id);
      }

      return { createdNodeIds: creados, mutatedNodeIds: mutados, chipEnCursoId: enCurso.id };

    }
  },
  {
    id: "02",
    archivo: "02-web-navegacion.js",
    nombre: "Componentes: Ítem de menú y Barra lateral",
    pagina: "Fundaciones",
    requiere: [],
    ejecutar: async function () {
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

    }
  },
  {
    id: "03",
    archivo: "03-web-tabla.js",
    nombre: "Componentes: tabla y Panel de sección",
    pagina: "Fundaciones",
    requiere: [],
    ejecutar: async function () {
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

    }
  },
  {
    id: "04",
    archivo: "04-web-supervision.js",
    nombre: "Supervisión · Jefatura",
    pagina: "Gestión · web",
    requiere: ["02","03"],
    ejecutar: async function () {
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

    }
  },
  {
    id: "05",
    archivo: "05-web-controles.js",
    nombre: "Controles recibidos",
    pagina: "Gestión · web",
    requiere: ["02","03"],
    ejecutar: async function () {
      // 05 — Bandeja "Controles recibidos" (1440x900) en la página Gestión · web.
      //
      // Requiere los scripts 02 y 03. Usa Barra lateral, Panel de sección, Encabezado de
      // tabla, Fila de control, Campo y Botón. Los componentes se buscan por nombre.

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
        radioControl: 'VariableID:3:18'
      };
      const V = {};
      await Promise.all(Object.entries(ids).map(async ([k, i]) => { V[k] = await gv(i); }));

      const H = {
        fondoApp: { r: 0.902, g: 0.886, b: 0.867 }, blanco: { r: 1, g: 1, b: 1 },
        papel: { r: 0.969, g: 0.957, b: 0.941 }, bordeBase: { r: 0.867, g: 0.843, b: 0.812 },
        bordeSuave: { r: 0.914, g: 0.902, b: 0.886 }, titulo: { r: 0.169, g: 0.192, b: 0.220 },
        apagado: { r: 0.353, g: 0.388, b: 0.424 }, tenue: { r: 0.545, g: 0.576, b: 0.608 },
        naranja: { r: 0.835, g: 0.525, b: 0.231 }
      };

      const txt = (c, e, vv, hh) => {
        const t = figma.createText();
        t.characters = c; t.textStyleId = S(e); t.fills = [paint(vv, hh)];
        return t;
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
      const cabTabla = buscarComp('Encabezado de tabla');
      const campoWeb = variante('Campo', 'estado=Normal, tamaño=Web');
      const btnPri = variante('Botón', 'tipo=Primario, tamaño=Web');
      const btnSec = variante('Botón', 'tipo=Secundario, tamaño=Web');
      const filaDe = nom => variante('Fila de control', `estado=${nom}`);

      if (!barraLateral || !panelComp || !cabTabla || !filaDe('Enviado')) {
        throw new Error('Faltan componentes: ejecuta primero 02-web-navegacion.js y 03-web-tabla.js');
      }

      // ------------------------------------------------------------------ Pantalla
      const p = figma.createFrame();
      p.name = 'Controles recibidos';
      p.resize(1440, 900);
      p.layoutMode = 'HORIZONTAL';
      p.primaryAxisSizingMode = 'FIXED';
      p.counterAxisSizingMode = 'FIXED';
      p.clipsContent = true;
      p.fills = [paint(V.fondoApp, H.fondoApp)];
      web.appendChild(p);
      p.x = 1640; p.y = 100;

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
      const h = txt('Controles recibidos', 'display/h2', V.titulo, H.titulo);
      cabCol.appendChild(h);
      h.layoutSizingHorizontal = 'FILL';
      h.textAutoResize = 'HEIGHT';
      const hs = txt('34 controles enviados desde terreno este mes · 4 con hallazgos críticos', 'cuerpo/chico', V.apagado, H.apagado);
      cabCol.appendChild(hs);
      hs.layoutSizingHorizontal = 'FILL';
      hs.textAutoResize = 'HEIGHT';

      for (const [comp, label] of [[btnSec, 'Descargar CSV'], [btnPri, 'Nuevo control']]) {
        if (!comp) continue;
        const b = comp.createInstance();
        cab.appendChild(b);
        const bt = b.children.find(n => n.type === 'TEXT');
        if (bt) bt.characters = label;
      }

      // ------------------------------------------------------------------- Filtros
      const filtros = figma.createFrame();
      filtros.name = 'Filtros';
      filtros.layoutMode = 'HORIZONTAL';
      filtros.itemSpacing = 12;
      filtros.counterAxisAlignItems = 'MAX';
      filtros.counterAxisSizingMode = 'AUTO';
      filtros.paddingTop = 16; filtros.paddingBottom = 16; filtros.paddingLeft = 18; filtros.paddingRight = 18;
      filtros.fills = [paint(V.blanco, H.blanco)];
      filtros.strokes = [paint(V.bordeBase, H.bordeBase)];
      filtros.strokeWeight = 1;
      const radioTarjeta = await gv('VariableID:3:19');
      for (const k of ['topLeftRadius', 'topRightRadius', 'bottomLeftRadius', 'bottomRightRadius']) filtros.setBoundVariable(k, radioTarjeta);
      cont.appendChild(filtros);
      filtros.layoutSizingHorizontal = 'FILL';

      for (const [label, valor] of [
        ['Comunidad', 'Todas las comunidades'],
        ['Periodo', 'Septiembre 2025'],
        ['Responsable', 'Todo el equipo'],
        ['Estado', 'Todos']
      ]) {
        if (!campoWeb) break;
        const c = campoWeb.createInstance();
        filtros.appendChild(c);
        c.layoutSizingHorizontal = 'FILL';
        const ts = c.findAllWithCriteria({ types: ['TEXT'] });
        if (ts[0]) ts[0].characters = label;
        if (ts[1]) {
          ts[1].characters = valor;
          ts[1].fills = [paint(V.titulo, H.titulo)];
        }
      }
      if (btnSec) {
        const b = btnSec.createInstance();
        filtros.appendChild(b);
        const bt = b.children.find(n => n.type === 'TEXT');
        if (bt) bt.characters = 'Filtrar';
      }

      // --------------------------------------------------------------------- Tabla
      const panel = panelComp.createInstance();
      cont.appendChild(panel);
      panel.layoutSizingHorizontal = 'FILL';
      panel.layoutSizingVertical = 'FILL';
      const panelTs = panel.findAllWithCriteria({ types: ['TEXT'] });
      if (panelTs[0]) panelTs[0].characters = 'Septiembre 2025';
      if (panelTs[1]) panelTs[1].characters = 'Ordenar por fecha';
      const cuerpoPanel = panel.findOne(n => n.name === 'Cuerpo');

      const cabInst = cabTabla.createInstance();
      cuerpoPanel.appendChild(cabInst);
      cabInst.layoutSizingHorizontal = 'FILL';

      const registros = [
        ['Crítico', 'Edificio Costanera Norte', 'Vitacura · 120 unidades', 'Ana Pizarro', '04 sep', '26/26', '1 crítico · 2 obs.'],
        ['Con observaciones', 'Condominio Los Almendros', 'Las Condes · 42 casas', 'Marcelo Ríos', '04 sep', '31/31', '3 observaciones'],
        ['Enviado', 'Edificio Parque Bustamante', 'Providencia · 84 unidades', 'Marcelo Ríos', '03 sep', '28/28', 'Sin hallazgos'],
        ['Con observaciones', 'Edificio Mirador del Parque', 'Ñuñoa · 96 unidades', 'Ana Pizarro', '03 sep', '28/28', '1 observación'],
        ['Enviado', 'Condominio Alto Macul', 'Macul · 60 casas', 'Jorge Vera', '02 sep', '24/24', 'Sin hallazgos'],
        ['Enviado', 'Edificio Plaza Ñuñoa', 'Ñuñoa · 54 unidades', 'Jorge Vera', '02 sep', '28/28', 'Sin hallazgos']
      ];

      for (const [estado, comunidad, comuna, responsable, fecha, items, hallazgos] of registros) {
        const comp = filaDe(estado);
        if (!comp) continue;
        const f = comp.createInstance();
        cuerpoPanel.appendChild(f);
        f.layoutSizingHorizontal = 'FILL';
        // Orden de documento en la fila: comunidad, comuna, responsable, fecha, ítems,
        // hallazgos. El texto del chip vive en una instancia anidada y no se toca acá.
        const ts = f.findAllWithCriteria({ types: ['TEXT'] });
        const valores = [comunidad, comuna, responsable, fecha, items, hallazgos];
        valores.forEach((v, i) => { if (ts[i]) ts[i].characters = v; });
      }

      // ---------------------------------------------------------------- Paginación
      const pie = figma.createFrame();
      pie.name = 'Paginación';
      pie.layoutMode = 'HORIZONTAL';
      pie.itemSpacing = 8;
      pie.counterAxisAlignItems = 'CENTER';
      pie.counterAxisSizingMode = 'AUTO';
      pie.fills = [];
      cont.appendChild(pie);
      pie.layoutSizingHorizontal = 'FILL';

      const cuenta = txt('Mostrando 6 de 34 controles', 'cuerpo/chico', V.tenue, H.tenue);
      pie.appendChild(cuenta);
      cuenta.layoutSizingHorizontal = 'FILL';
      cuenta.textAutoResize = 'HEIGHT';

      for (const [n, activa] of [['1', true], ['2', false], ['3', false], ['4', false], ['5', false], ['6', false]]) {
        const b = figma.createFrame();
        b.name = 'Página ' + n;
        b.resize(30, 30);
        b.layoutMode = 'HORIZONTAL';
        b.primaryAxisAlignItems = 'CENTER';
        b.counterAxisAlignItems = 'CENTER';
        b.primaryAxisSizingMode = 'FIXED';
        b.counterAxisSizingMode = 'FIXED';
        b.fills = [activa ? paint(V.blanco, H.blanco) : paint(V.papel, H.papel)];
        b.strokes = [paint(V.bordeBase, H.bordeBase)];
        b.strokeWeight = 1;
        for (const k of ['topLeftRadius', 'topRightRadius', 'bottomLeftRadius', 'bottomRightRadius']) b.setBoundVariable(k, V.radioControl);
        pie.appendChild(b);
        b.appendChild(txt(n, 'etiqueta/chip', activa ? V.titulo : V.tenue, activa ? H.titulo : H.tenue));
      }

      return { createdNodeIds: [p.id, cont.id, panel.id], pantallaId: p.id };

    }
  },
  {
    id: "06",
    archivo: "06-web-detalle.js",
    nombre: "Detalle de control",
    pagina: "Gestión · web",
    requiere: ["02","03"],
    ejecutar: async function () {
      // 06 — "Detalle de control" (1440x900) en la página Gestión · web.
      //
      // Cierra el circuito del módulo: el control que se llenó en terreno visto desde la
      // web, con sus hallazgos y fotos, el check-in geolocalizado y la orden de trabajo que
      // se generó. Requiere los scripts 02 y 03.

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
        naranja: 'VariableID:2:3', okT: 'VariableID:2:20', alT: 'VariableID:2:23',
        crT: 'VariableID:2:26', crF: 'VariableID:2:27', crB: 'VariableID:2:28',
        alF: 'VariableID:2:24', alB: 'VariableID:2:25',
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
        okT: { r: 0.306, g: 0.420, b: 0.290 }, alT: { r: 0.541, g: 0.373, b: 0.133 },
        crT: { r: 0.576, g: 0.224, b: 0.169 }, crF: { r: 0.984, g: 0.933, b: 0.922 },
        crB: { r: 0.929, g: 0.824, b: 0.796 }, alF: { r: 0.992, g: 0.953, b: 0.902 },
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
      const chip = nom => variante('Chip de estado', `estado=${nom}`);

      if (!barraLateral || !panelComp) {
        throw new Error('Faltan componentes: ejecuta primero 02-web-navegacion.js y 03-web-tabla.js');
      }

      // ------------------------------------------------------------------ Pantalla
      const p = figma.createFrame();
      p.name = 'Detalle de control';
      p.resize(1440, 900);
      p.layoutMode = 'HORIZONTAL';
      p.primaryAxisSizingMode = 'FIXED';
      p.counterAxisSizingMode = 'FIXED';
      p.clipsContent = true;
      p.fills = [paint(V.fondoApp, H.fondoApp)];
      web.appendChild(p);
      p.x = 3180; p.y = 100;

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

      const migas = txt('Controles  ›  Septiembre 2025  ›  Edificio Parque Bustamante', 'cuerpo/micro', V.tenue, H.tenue);
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
      const h = txt('Edificio Parque Bustamante', 'display/h2', V.titulo, H.titulo);
      cabCol.appendChild(h);
      h.layoutSizingHorizontal = 'FILL';
      h.textAutoResize = 'HEIGHT';
      const hs = txt('Control mensual · 4 de septiembre · Ana Pizarro · 28 de 28 ítems', 'cuerpo/chico', V.apagado, H.apagado);
      cabCol.appendChild(hs);
      hs.layoutSizingHorizontal = 'FILL';
      hs.textAutoResize = 'HEIGHT';

      const chipCritico = chip('Crítico');
      if (chipCritico) cab.appendChild(chipCritico.createInstance());
      for (const [comp, label] of [[btnSec, 'Enviar por correo'], [btnPri, 'Descargar PDF']]) {
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

      // ------------------------------------------------------------------ Hallazgos
      const hall = nuevoPanel(colIzq, 'Hallazgos del control', '2 registrados');

      const hallazgos = [
        ['Crítico', 'Luminarias de emergencia operativas', 'Luminaria de emergencia del subterráneo -1 sin funcionar. Riesgo de evacuación.', 'Subterráneo -1, sector estacionamientos · 15:42', V.crT, H.crT, V.crF, H.crF, V.crB, H.crB],
        ['Alerta', 'Muros y cielo sin filtraciones', 'Filtración leve en muro poniente del hall. Se mantiene en observación hasta la próxima visita.', 'Hall de acceso, muro poniente · 15:12', V.alT, H.alT, V.alF, H.alF, V.alB, H.alB]
      ];

      for (const [chipNom, item, descripcion, ubicacion, vT, hT, vF, hF, vB, hB] of hallazgos) {
        const f = figma.createFrame();
        f.name = 'Hallazgo · ' + item;
        f.layoutMode = 'HORIZONTAL';
        f.itemSpacing = 16;
        f.counterAxisAlignItems = 'MIN';
        f.counterAxisSizingMode = 'AUTO';
        f.paddingTop = 16; f.paddingBottom = 16; f.paddingLeft = 18; f.paddingRight = 18;
        f.fills = [];
        bordeInferior(f);
        hall.cuerpo.appendChild(f);
        f.layoutSizingHorizontal = 'FILL';

        const col = figma.createFrame();
        col.layoutMode = 'VERTICAL';
        col.itemSpacing = 6;
        col.counterAxisSizingMode = 'AUTO';
        col.fills = [];
        col.name = 'Texto';
        f.appendChild(col);
        col.layoutSizingHorizontal = 'FILL';

        const t1 = txt(item, 'cuerpo/fuerte', V.titulo, H.titulo);
        col.appendChild(t1);
        t1.layoutSizingHorizontal = 'FILL';
        t1.textAutoResize = 'HEIGHT';

        const nota = figma.createFrame();
        nota.name = 'Nota de terreno';
        nota.layoutMode = 'VERTICAL';
        nota.counterAxisSizingMode = 'AUTO';
        nota.paddingTop = 10; nota.paddingBottom = 10; nota.paddingLeft = 12; nota.paddingRight = 12;
        nota.fills = [paint(vF, hF)];
        nota.strokes = [paint(vB, hB)];
        nota.strokeWeight = 1;
        radios(nota, V.radioControl);
        col.appendChild(nota);
        nota.layoutSizingHorizontal = 'FILL';
        const t2 = txt(descripcion, 'cuerpo/chico', vT, hT);
        nota.appendChild(t2);
        t2.layoutSizingHorizontal = 'FILL';
        t2.textAutoResize = 'HEIGHT';

        const t3 = txt(ubicacion, 'cuerpo/micro', V.tenue, H.tenue);
        col.appendChild(t3);
        t3.layoutSizingHorizontal = 'FILL';
        t3.textAutoResize = 'HEIGHT';

        // Miniaturas de las fotos tomadas en terreno
        const fotos = figma.createFrame();
        fotos.name = 'Fotos';
        fotos.layoutMode = 'HORIZONTAL';
        fotos.itemSpacing = 8;
        fotos.counterAxisSizingMode = 'AUTO';
        fotos.primaryAxisSizingMode = 'AUTO';
        fotos.fills = [];
        f.appendChild(fotos);
        for (let i = 0; i < 2; i++) {
          const th = figma.createFrame();
          th.name = 'Miniatura';
          th.resize(64, 64);
          th.fills = [paint(V.niebla, H.niebla)];
          th.strokes = [paint(V.bordeBase, H.bordeBase)];
          th.strokeWeight = 1;
          radios(th, V.radioControl);
          fotos.appendChild(th);
          const ico = figma.createNodeFromSvg('<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 8.5A1.5 1.5 0 0 1 4.5 7h2.2l1.1-2h8.4l1.1 2h2.2A1.5 1.5 0 0 1 21 8.5v9A1.5 1.5 0 0 1 19.5 19h-15A1.5 1.5 0 0 1 3 17.5v-9Z" stroke="#8b939b" stroke-width="1.5" stroke-linejoin="round"/><circle cx="12" cy="13" r="3.4" stroke="#8b939b" stroke-width="1.5"/></svg>');
          ico.name = 'icono/foto';
          ico.resize(20, 20);
          ico.x = 22; ico.y = 22;
          th.appendChild(ico);
        }

        const chipComp = chip(chipNom);
        if (chipComp) {
          const cw = figma.createFrame();
          cw.name = 'Estado';
          cw.layoutMode = 'HORIZONTAL';
          cw.primaryAxisAlignItems = 'MAX';
          cw.counterAxisSizingMode = 'AUTO';
          cw.primaryAxisSizingMode = 'FIXED';
          cw.resize(150, 24);
          cw.fills = [];
          f.appendChild(cw);
          cw.appendChild(chipComp.createInstance());
        }
      }

      // ------------------------------------------------------- Resumen del checklist
      const resumen = nuevoPanel(colIzq, 'Resumen por grupo', '28 ítems');
      for (const [grupo, cumple, obs, crit] of [
        ['Acceso y hall', '8 cumplen', '1 observación', ''],
        ['Áreas comunes', '7 cumplen', '', ''],
        ['Seguridad', '5 cumplen', '', '1 crítico'],
        ['Instalaciones', '6 cumplen', '', '']
      ]) {
        const f = figma.createFrame();
        f.name = 'Grupo · ' + grupo;
        f.layoutMode = 'HORIZONTAL';
        f.itemSpacing = 16;
        f.counterAxisAlignItems = 'CENTER';
        f.counterAxisSizingMode = 'AUTO';
        f.paddingTop = 12; f.paddingBottom = 12; f.paddingLeft = 18; f.paddingRight = 18;
        f.fills = [];
        bordeInferior(f);
        resumen.cuerpo.appendChild(f);
        f.layoutSizingHorizontal = 'FILL';

        const g = txt(grupo, 'cuerpo/campo', V.titulo, H.titulo);
        f.appendChild(g);
        g.layoutSizingHorizontal = 'FILL';
        g.textAutoResize = 'HEIGHT';

        for (const [valor, vv, hh] of [[cumple, V.okT, H.okT], [obs, V.alT, H.alT], [crit, V.crT, H.crT]]) {
          const t = txt(valor || '—', 'cuerpo/micro', valor ? vv : V.tenue, valor ? hh : H.tenue);
          f.appendChild(t);
          t.textAutoResize = 'HEIGHT';
          t.resize(110, t.height);
          t.layoutSizingHorizontal = 'FIXED';
        }
      }

      // ------------------------------------------------------- Datos de la visita
      const visita = nuevoPanel(colDer, 'Datos de la visita', 'Ver historial');
      visita.cuerpo.paddingTop = 4;
      for (const [etiqueta, valor, vv, hh] of [
        ['Responsable', 'Ana Pizarro · Terreno', V.titulo, H.titulo],
        ['Check-in', '4 sep, 14:58 · a 12 m del acceso', V.okT, H.okT],
        ['Check-out', '4 sep, 16:10 · 1 h 12 min en terreno', V.titulo, H.titulo],
        ['Coordenadas', '-33,4489  -70,6339 · precisión 8 m', V.apagado, H.apagado],
        ['Evidencia', '9 fotos · 2 con hallazgo asociado', V.apagado, H.apagado]
      ]) {
        const f = figma.createFrame();
        f.name = etiqueta;
        f.layoutMode = 'VERTICAL';
        f.itemSpacing = 3;
        f.counterAxisSizingMode = 'AUTO';
        f.paddingTop = 12; f.paddingBottom = 12; f.paddingLeft = 18; f.paddingRight = 18;
        f.fills = [];
        bordeInferior(f);
        visita.cuerpo.appendChild(f);
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

      // --------------------------------------------------------- Orden de trabajo
      const ot = nuevoPanel(colDer, 'Orden de trabajo', 'OT-1042');
      const otCuerpo = figma.createFrame();
      otCuerpo.name = 'Detalle OT';
      otCuerpo.layoutMode = 'VERTICAL';
      otCuerpo.itemSpacing = 10;
      otCuerpo.counterAxisSizingMode = 'AUTO';
      otCuerpo.paddingTop = 16; otCuerpo.paddingBottom = 16; otCuerpo.paddingLeft = 18; otCuerpo.paddingRight = 18;
      otCuerpo.fills = [];
      ot.cuerpo.appendChild(otCuerpo);
      otCuerpo.layoutSizingHorizontal = 'FILL';

      const otT = txt('Reposición de luminaria de emergencia', 'cuerpo/fuerte', V.titulo, H.titulo);
      otCuerpo.appendChild(otT);
      otT.layoutSizingHorizontal = 'FILL';
      otT.textAutoResize = 'HEIGHT';

      const otFila = figma.createFrame();
      otFila.layoutMode = 'HORIZONTAL';
      otFila.itemSpacing = 8;
      otFila.counterAxisAlignItems = 'CENTER';
      otFila.counterAxisSizingMode = 'AUTO';
      otFila.fills = [];
      otFila.name = 'Estado';
      otCuerpo.appendChild(otFila);
      otFila.layoutSizingHorizontal = 'FILL';
      const chipPend = chip('Pendiente');
      if (chipPend) otFila.appendChild(chipPend.createInstance());
      const otVence = txt('Vence el 6 de septiembre', 'cuerpo/micro', V.crT, H.crT);
      otFila.appendChild(otVence);
      otVence.layoutSizingHorizontal = 'FILL';
      otVence.textAutoResize = 'HEIGHT';

      const otResp = txt('Asignada a Mantención · Jorge Vera', 'cuerpo/chico', V.apagado, H.apagado);
      otCuerpo.appendChild(otResp);
      otResp.layoutSizingHorizontal = 'FILL';
      otResp.textAutoResize = 'HEIGHT';

      if (btnSec) {
        const b = btnSec.createInstance();
        otCuerpo.appendChild(b);
        b.layoutSizingHorizontal = 'FILL';
        const bt = b.children.find(n => n.type === 'TEXT');
        if (bt) bt.characters = 'Ver orden de trabajo';
      }

      return {
        createdNodeIds: [p.id, cont.id, hall.inst.id, resumen.inst.id, visita.inst.id, ot.inst.id],
        pantallaId: p.id
      };

    }
  },
  {
    id: "07",
    archivo: "07-web-componentes-2.js",
    nombre: "Componentes: oportunidad, calendario y conversación",
    pagina: "Fundaciones",
    requiere: [],
    ejecutar: async function () {
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

    }
  },
  {
    id: "08",
    archivo: "08-web-panel-admin.js",
    nombre: "Panel · Admin",
    pagina: "Gestión · web",
    requiere: ["02","03"],
    ejecutar: async function () {
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

    }
  },
  {
    id: "09",
    archivo: "09-web-crm.js",
    nombre: "CRM · Oportunidades",
    pagina: "Gestión · web",
    requiere: ["02","07"],
    ejecutar: async function () {
      // 09 — "CRM · Oportunidades" (1440x900) en la página Gestión · web.
      //
      // Embudo comercial en cuatro columnas. Requiere 02, 03 y 07.
      //
      // Los montos son honorarios netos mensuales calculados como en el generador de
      // propuestas: gasto común base por el porcentaje pactado (9% de referencia).

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
        alT: 'VariableID:2:23', radioControl: 'VariableID:3:18'
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
        alT: { r: 0.541, g: 0.373, b: 0.133 }
      };

      const txt = (c, e, vv, hh) => {
        const t = figma.createText();
        t.characters = c; t.textStyleId = S(e); t.fills = [paint(vv, hh)];
        return t;
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
      const oportunidad = etapa => variante('Tarjeta de oportunidad', `etapa=${etapa}`);

      if (!barraLateral || !oportunidad('Contacto')) {
        throw new Error('Faltan componentes: ejecuta primero 02-web-navegacion.js y 07-web-componentes-2.js');
      }

      // ------------------------------------------------------------------ Pantalla
      const p = figma.createFrame();
      p.name = 'CRM · Oportunidades';
      p.resize(1440, 900);
      p.layoutMode = 'HORIZONTAL';
      p.primaryAxisSizingMode = 'FIXED';
      p.counterAxisSizingMode = 'FIXED';
      p.clipsContent = true;
      p.fills = [paint(V.fondoApp, H.fondoApp)];
      web.appendChild(p);
      p.x = 1640; p.y = 1100;

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
      const h = txt('Oportunidades', 'display/h2', V.titulo, H.titulo);
      cabCol.appendChild(h);
      h.layoutSizingHorizontal = 'FILL';
      h.textAutoResize = 'HEIGHT';
      const hs = txt('7 comunidades en el embudo · $7.380.000 en honorarios mensuales potenciales', 'cuerpo/chico', V.apagado, H.apagado);
      cabCol.appendChild(hs);
      hs.layoutSizingHorizontal = 'FILL';
      hs.textAutoResize = 'HEIGHT';

      for (const [comp, label] of [[btnSec, 'Ver por lista'], [btnPri, 'Nueva oportunidad']]) {
        if (!comp) continue;
        const b = comp.createInstance();
        cab.appendChild(b);
        const bt = b.children.find(n => n.type === 'TEXT');
        if (bt) bt.characters = label;
      }

      // -------------------------------------------------------------------- Embudo
      const tablero = figma.createFrame();
      tablero.name = 'Embudo';
      tablero.layoutMode = 'HORIZONTAL';
      tablero.itemSpacing = 16;
      tablero.counterAxisSizingMode = 'FIXED';
      tablero.fills = [];
      cont.appendChild(tablero);
      tablero.layoutSizingHorizontal = 'FILL';
      tablero.layoutSizingVertical = 'FILL';

      // Cada columna: etapa, total, y las oportunidades que van en ella.
      const columnas = [
        ['Contacto', 'Contacto inicial', '$2.520.000', [
          ['Edificio Los Aromos', 'Providencia · 96 unidades', '$1.260.000', '12 días en contacto inicial'],
          ['Condominio El Peral', 'Peñalolén · 38 casas', '$1.260.000', 'Primera reunión el 9 de sep']
        ]],
        ['Propuesta', 'Propuesta enviada', '$3.060.000', [
          ['Edificio Vista Andes', 'La Reina · 72 unidades', '$1.800.000', 'Propuesta enviada hace 4 días'],
          ['Edificio Santa Elena', 'Ñuñoa · 48 unidades', '$1.260.000', 'Propuesta enviada hace 9 días']
        ]],
        ['Negociación', 'En negociación', '$2.340.000', [
          ['Condominio Vallemar', 'Colina · 110 casas', '$2.340.000', 'Reunión de directorio el 11 de sep']
        ]],
        ['Ganada', 'Ganadas este mes', '$3.240.000', [
          ['Edificio Plaza Ñuñoa', 'Ñuñoa · 54 unidades', '$1.180.000', 'Contrato firmado el 2 de sep'],
          ['Condominio Alto Macul', 'Macul · 60 casas', '$2.060.000', 'Contrato en firma']
        ]]
      ];

      const creados = [p.id, cont.id];

      for (const [etapa, titulo, total, items] of columnas) {
        const col = figma.createFrame();
        col.name = 'Columna · ' + titulo;
        col.layoutMode = 'VERTICAL';
        col.itemSpacing = 10;
        col.counterAxisSizingMode = 'FIXED';
        col.paddingTop = 14; col.paddingBottom = 14; col.paddingLeft = 12; col.paddingRight = 12;
        col.fills = [paint(V.papel, H.papel)];
        col.strokes = [paint(V.bordeSuave, H.bordeSuave)];
        col.strokeWeight = 1;
        col.clipsContent = true;
        tablero.appendChild(col);
        col.layoutSizingHorizontal = 'FILL';
        col.layoutSizingVertical = 'FILL';
        creados.push(col.id);

        const colCab = figma.createFrame();
        colCab.name = 'Cabecera';
        colCab.layoutMode = 'VERTICAL';
        colCab.itemSpacing = 3;
        colCab.counterAxisSizingMode = 'AUTO';
        colCab.paddingBottom = 10; colCab.paddingLeft = 2;
        colCab.fills = [];
        colCab.strokes = [paint(V.bordeBase, H.bordeBase)];
        colCab.strokeWeight = 1; colCab.strokeAlign = 'INSIDE';
        colCab.strokeTopWeight = 0; colCab.strokeLeftWeight = 0; colCab.strokeRightWeight = 0; colCab.strokeBottomWeight = 1;
        col.appendChild(colCab);
        colCab.layoutSizingHorizontal = 'FILL';

        const ct = txt(`${titulo} · ${items.length}`, 'etiqueta/grupo', V.titulo, H.titulo);
        colCab.appendChild(ct);
        ct.layoutSizingHorizontal = 'FILL';
        ct.textAutoResize = 'HEIGHT';
        const cv = txt(total + ' mensuales', 'cuerpo/micro', V.tenue, H.tenue);
        colCab.appendChild(cv);
        cv.layoutSizingHorizontal = 'FILL';
        cv.textAutoResize = 'HEIGHT';

        const comp = oportunidad(etapa);
        for (const [nombre, meta, valor, detalle] of items) {
          if (!comp) break;
          const i = comp.createInstance();
          col.appendChild(i);
          i.layoutSizingHorizontal = 'FILL';
          // Orden de documento en la tarjeta: nombre, meta, valor, "mensual", detalle.
          const ts = i.findAllWithCriteria({ types: ['TEXT'] });
          if (ts[0]) ts[0].characters = nombre;
          if (ts[1]) ts[1].characters = meta;
          if (ts[2]) ts[2].characters = valor;
          if (ts[4]) ts[4].characters = detalle;
        }
      }

      return { createdNodeIds: creados, pantallaId: p.id };

    }
  },
  {
    id: "10",
    archivo: "10-web-oportunidad.js",
    nombre: "Detalle de oportunidad",
    pagina: "Gestión · web",
    requiere: ["02","03"],
    ejecutar: async function () {
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

    }
  },
  {
    id: "11",
    archivo: "11-web-contratos.js",
    nombre: "Contratos",
    pagina: "Gestión · web",
    requiere: ["02","03"],
    ejecutar: async function () {
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

    }
  },
  {
    id: "12",
    archivo: "12-web-calendario.js",
    nombre: "Calendario",
    pagina: "Gestión · web",
    requiere: ["02","03","07"],
    ejecutar: async function () {
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

    }
  },
  {
    id: "13",
    archivo: "13-web-correo.js",
    nombre: "Correo · contacto@coproactiva",
    pagina: "Gestión · web",
    requiere: ["02","07"],
    ejecutar: async function () {
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

    }
  },
  {
    id: "14",
    archivo: "14-movil-mensajes.js",
    nombre: "Mensajes · Terreno",
    pagina: "Terreno · app móvil",
    requiere: [],
    ejecutar: async function () {
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

    }
  }
];

figma.showUI(__html__, { width: 460, height: 620, title: 'CoproActiva · Constructor de interfaz' });

figma.ui.postMessage({
  tipo: 'pasos',
  pasos: PASOS.map(p => ({ id: p.id, nombre: p.nombre, pagina: p.pagina, requiere: p.requiere, archivo: p.archivo }))
});

figma.ui.onmessage = async msg => {
  if (!msg || msg.tipo !== 'ejecutar') return;

  const ids = Array.isArray(msg.ids) ? msg.ids : [];
  let fallo = false;

  for (const id of ids) {
    const paso = PASOS.find(p => p.id === id);
    if (!paso) continue;

    figma.ui.postMessage({ tipo: 'inicio', id, nombre: paso.nombre });
    try {
      const resultado = await paso.ejecutar();
      const creados = resultado && resultado.createdNodeIds ? resultado.createdNodeIds.length : 0;
      const mutados = resultado && resultado.mutatedNodeIds ? resultado.mutatedNodeIds.length : 0;
      figma.ui.postMessage({ tipo: 'ok', id, creados, mutados });
    } catch (e) {
      figma.ui.postMessage({ tipo: 'error', id, mensaje: String((e && e.message) || e) });
      fallo = true;
      break;
    }
  }

  figma.ui.postMessage({ tipo: 'fin', fallo });
};
