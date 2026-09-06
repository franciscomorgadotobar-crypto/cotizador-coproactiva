/* Plantilla del informe de levantamiento.
 *
 * Una sola plantilla para los dos destinos. En el teléfono se abre en una
 * ventana y se imprime a PDF con el diálogo del sistema —funciona sin señal—;
 * en el servidor se renderiza el mismo HTML con un navegador headless cuando se
 * quiere el archivo definitivo. Si hubiera dos maquetas, el informe saldría
 * distinto según dónde se generó, que es exactamente lo que no puede pasar con
 * un documento que se le entrega al comité.
 *
 * Las fotos llegan con su URL ya resuelta: en el teléfono son object URLs de
 * los blobs guardados localmente, en el servidor URLs firmadas del bucket. La
 * plantilla no sabe ni le importa de dónde vienen.
 */

const ESTADOS = {
  cumple:      { etiqueta: 'Conforme',    clase: 'e-cumple' },
  observacion: { etiqueta: 'Observación', clase: 'e-obs' },
  critico:     { etiqueta: 'Crítico',     clase: 'e-critico' },
  sin_evaluar: { etiqueta: 'Sin evaluar', clase: 'e-nulo' }
};

function escapar(texto) {
  return String(texto ?? '').replace(/[&<>"']/g, c => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

/* La zona va fija a Chile continental. El informe se puede generar en el
 * teléfono de quien hizo el levantamiento o en un servidor que corre en UTC, y
 * la hora del check-in tiene que ser la misma en los dos: es el dato que prueba
 * a qué hora estuvo esa persona en el lugar. */
const ZONA = 'America/Santiago';

function fecha(iso, conHora = false) {
  if (!iso) return '—';
  const d = new Date(iso);
  const opciones = conHora
    ? { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: ZONA }
    : { day: '2-digit', month: 'long', year: 'numeric', timeZone: ZONA };
  return d.toLocaleDateString('es-CL', opciones);
}

/* Las fotos van en grilla de tres columnas. Tres es el mínimo que pidió el
 * encargo y también el punto donde una foto de teléfono sigue leyéndose en
 * papel: con cuatro, un tablero eléctrico deja de distinguirse. */
function grillaFotos(fotos, columnas = 3) {
  if (!fotos?.length) return '';
  return `
    <div class="fotos" style="--columnas:${columnas}">
      ${fotos.map((f, i) => `
        <figure>
          <img src="${escapar(f.url)}" alt="${escapar(f.descripcion || 'Fotografía del levantamiento')}" loading="lazy">
          <figcaption>
            <span class="numero">${i + 1}</span>
            ${escapar(f.descripcion || 'Sin descripción')}
          </figcaption>
        </figure>`).join('')}
    </div>`;
}

function bloqueItem(item) {
  const estado = ESTADOS[item.estado] ?? ESTADOS.sin_evaluar;
  return `
    <article class="item">
      <header>
        <h3>${escapar(item.texto)}</h3>
        <span class="estado ${estado.clase}">${estado.etiqueta}</span>
      </header>
      ${item.nota ? `<p class="nota">${escapar(item.nota)}</p>` : ''}
      ${grillaFotos(item.fotos)}
    </article>`;
}

function bloqueCategoria(categoria) {
  return `
    <section class="categoria">
      <h2>${escapar(categoria.nombre)}</h2>
      ${categoria.items.map(bloqueItem).join('')}
    </section>`;
}

/**
 * @param {object} datos
 * @param {object} datos.comunidad  nombre, direccion, comuna
 * @param {object} datos.control    periodo, checkin_en, checkin_precision, responsable
 * @param {Array}  datos.categorias [{ nombre, items: [{ texto, estado, nota, fotos }] }]
 * @param {string} [datos.logo]     data URI o URL del logotipo
 */
export function informeHtml(datos) {
  const { comunidad, control, categorias, logo } = datos;

  const todos = categorias.flatMap(c => c.items);
  const cuenta = e => todos.filter(i => i.estado === e).length;
  const totalFotos = todos.reduce((n, i) => n + (i.fotos?.length ?? 0), 0);

  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<title>Levantamiento — ${escapar(comunidad.nombre)}</title>
<style>
  /* A4 con márgenes de informe. El pie con la paginación lo pone el navegador
     desde @page, así no hay que calcular saltos a mano. */
  @page { size: A4; margin: 18mm 15mm 16mm; }

  :root {
    --naranja: #d5863b;
    --pizarra: #4a5a68;
    --tinta:   #2b3138;
    --papel:   #f7f4f0;
    --niebla:  #e9e6e2;
  }

  * { box-sizing: border-box; }
  body {
    margin: 0;
    font: 400 10.5pt/1.5 'Source Sans Pro', -apple-system, system-ui, sans-serif;
    color: var(--tinta);
    background: #fff;
  }
  h1, h2, h3 { font-family: 'Montserrat', -apple-system, system-ui, sans-serif; margin: 0; }

  /* ------------------------------------------------------------- Portada */
  .portada { padding-bottom: 14mm; border-bottom: 2px solid var(--tinta); margin-bottom: 10mm; }
  .portada img { height: 26px; margin-bottom: 12mm; }
  .portada .tipo {
    font-size: 8pt; letter-spacing: .16em; text-transform: uppercase;
    color: var(--pizarra); margin-bottom: 3mm;
  }
  .portada h1 { font-size: 22pt; font-weight: 700; line-height: 1.15; margin-bottom: 2mm; }
  .portada .direccion { color: var(--pizarra); font-size: 11pt; }

  .ficha { display: flex; flex-wrap: wrap; gap: 8mm; margin-top: 8mm; }
  .ficha div { min-width: 34mm; }
  .ficha dt {
    font-size: 7.5pt; letter-spacing: .14em; text-transform: uppercase;
    color: var(--pizarra); margin-bottom: 1mm;
  }
  .ficha dd { margin: 0; font-size: 10pt; font-weight: 600; }

  /* -------------------------------------------------------------- Resumen */
  .resumen { display: flex; gap: 4mm; margin-bottom: 10mm; }
  .resumen div {
    flex: 1; padding: 4mm; background: var(--papel);
    border-left: 3px solid var(--niebla);
  }
  .resumen .n { font-family: 'Montserrat', sans-serif; font-size: 17pt; font-weight: 700; }
  .resumen .r { font-size: 7.5pt; letter-spacing: .12em; text-transform: uppercase; color: var(--pizarra); }
  .resumen .obs      { border-left-color: var(--naranja); }
  .resumen .critico  { border-left-color: #a4402f; }

  /* ------------------------------------------------------------ Contenido */
  .categoria { margin-bottom: 9mm; }
  .categoria > h2 {
    font-size: 8.5pt; letter-spacing: .16em; text-transform: uppercase;
    color: var(--naranja); padding-bottom: 2mm; margin-bottom: 4mm;
    border-bottom: 1px solid var(--niebla);
  }

  /* Un punto del levantamiento no se parte entre dos páginas: la foto tiene
     que quedar junto a lo que describe o deja de ser evidencia de nada. */
  .item { break-inside: avoid; page-break-inside: avoid; margin-bottom: 6mm; }
  .item header { display: flex; align-items: baseline; gap: 4mm; margin-bottom: 1.5mm; }
  .item h3 { font-size: 10.5pt; font-weight: 600; flex: 1; }

  .estado {
    font-size: 7pt; letter-spacing: .1em; text-transform: uppercase;
    padding: 1mm 2mm; white-space: nowrap; font-weight: 600;
  }
  .e-cumple  { background: #eaf0ea; color: #38603f; }
  .e-obs     { background: #fdf3e6; color: #8a5f22; }
  .e-critico { background: #f7e9e6; color: #a4402f; }
  .e-nulo    { background: var(--niebla); color: var(--pizarra); }

  .nota {
    margin: 0 0 3mm; padding-left: 3mm; border-left: 2px solid var(--niebla);
    color: var(--pizarra); font-size: 9.5pt;
  }

  /* --------------------------------------------------------------- Fotos */
  .fotos {
    display: grid;
    grid-template-columns: repeat(var(--columnas, 3), 1fr);
    gap: 3mm;
    margin-top: 3mm;
  }
  .fotos figure { margin: 0; break-inside: avoid; page-break-inside: avoid; }
  .fotos img {
    width: 100%; aspect-ratio: 4 / 3; object-fit: cover;
    display: block; background: var(--niebla);
    border: 1px solid var(--niebla);
  }
  .fotos figcaption {
    font-size: 7.5pt; line-height: 1.35; color: var(--pizarra);
    margin-top: 1mm; display: flex; gap: 1.5mm;
  }
  .fotos .numero {
    background: var(--tinta); color: #fff; font-weight: 600;
    min-width: 4mm; height: 4mm; display: inline-flex;
    align-items: center; justify-content: center; font-size: 6.5pt;
    flex: none;
  }

  .pie {
    margin-top: 10mm; padding-top: 4mm; border-top: 1px solid var(--niebla);
    font-size: 8pt; color: var(--pizarra);
  }

  @media screen {
    body { background: #eceae7; padding: 20px; }
    .hoja { background: #fff; max-width: 210mm; margin: 0 auto; padding: 18mm 15mm; }
  }
  @media print { .hoja { padding: 0; } }
</style>
</head>
<body>
<div class="hoja">

  <div class="portada">
    ${logo ? `<img src="${escapar(logo)}" alt="CoproActiva">` : ''}
    <p class="tipo">Levantamiento técnico en terreno</p>
    <h1>${escapar(comunidad.nombre)}</h1>
    <p class="direccion">${escapar([comunidad.direccion, comunidad.comuna].filter(Boolean).join(', '))}</p>

    <dl class="ficha">
      <div><dt>Fecha</dt><dd>${fecha(control.checkin_en ?? control.creado_en)}</dd></div>
      <div><dt>Responsable</dt><dd>${escapar(control.responsable ?? '—')}</dd></div>
      <div><dt>Periodo</dt><dd>${escapar(control.periodo ?? '—')}</dd></div>
      <div><dt>Puntos revisados</dt><dd>${todos.length}</dd></div>
      <div><dt>Fotografías</dt><dd>${totalFotos}</dd></div>
    </dl>
  </div>

  <div class="resumen">
    <div><p class="n">${cuenta('cumple')}</p><p class="r">Conformes</p></div>
    <div class="obs"><p class="n">${cuenta('observacion')}</p><p class="r">Observaciones</p></div>
    <div class="critico"><p class="n">${cuenta('critico')}</p><p class="r">Críticos</p></div>
  </div>

  ${categorias.map(bloqueCategoria).join('')}

  <div class="pie">
    ${control.checkin_en
      ? `Check-in registrado el ${fecha(control.checkin_en, true)}${
          control.checkin_precision != null
            ? `, con precisión de ${Math.round(control.checkin_precision)} metros`
            : ''}.`
      : 'Sin check-in geolocalizado.'}
    Documento generado por CoproActiva el ${fecha(new Date().toISOString(), true)}.
  </div>

</div>
</body>
</html>`;
}

/* Abre el informe en una ventana nueva y lanza el diálogo de impresión, donde
 * el sistema ofrece "Guardar como PDF". Funciona sin señal porque las imágenes
 * salen de los blobs locales. */
export function imprimirInforme(html) {
  const ventana = window.open('', '_blank');
  if (!ventana) return false;   // el navegador bloqueó la ventana emergente
  ventana.document.write(html);
  ventana.document.close();
  // Se espera a que las imágenes carguen: imprimir antes deja huecos en blanco
  // donde deberían ir las fotos.
  ventana.onload = () => { ventana.focus(); ventana.print(); };
  return true;
}
