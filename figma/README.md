# Interfaz CoproActiva en Figma

Scripts del Plugin API que construyen el archivo de diseño de la app de terreno y
gestión. Cada archivo `.js` de esta carpeta es **una sola llamada** a la herramienta
`use_figma` del MCP de Figma: se pega el contenido completo en el parámetro `code`.

**Archivo de destino:** `gf0OFDhZICYDTya9sHSzMm`
<https://www.figma.com/design/gf0OFDhZICYDTya9sHSzMm>

## Por qué están acá y no ejecutados

El plan Starter de Figma permite 20 llamadas al MCP por mes (`whoami` y crear archivo
no cuentan; los scripts de dibujo y las capturas sí). La cuota se agotó al terminar la
segunda pantalla móvil. Estos scripts quedan listos para correr cuando la cuota se
reponga —el primer día del mes siguiente— o de inmediato si se sube a un plan Pro con
asiento Full o Dev.

## Orden de ejecución

### Módulo de control en terreno

| # | Archivo | Qué construye |
|---|---------|---------------|
| 01 | `01-hallazgo-cuerpo.js` | Cuerpo de *Nuevo hallazgo* y variante `estado=En curso` del chip |
| 02 | `02-web-navegacion.js` | Componentes *Ítem de menú* y *Barra lateral* (con el logotipo real del sitio) |
| 03 | `03-web-tabla.js` | Componentes *Encabezado de tabla*, *Fila de control* y *Panel de sección* |
| 04 | `04-web-supervision.js` | Tablero *Supervisión · Jefatura* |
| 05 | `05-web-controles.js` | Bandeja *Controles recibidos* |
| 06 | `06-web-detalle.js` | *Detalle de control* con hallazgos, geolocalización y OT |

### Módulos comerciales y de gestión

| # | Archivo | Qué construye |
|---|---------|---------------|
| 07 | `07-web-componentes-2.js` | Componentes *Tarjeta de oportunidad*, *Celda de calendario* y *Fila de conversación* |
| 08 | `08-web-panel-admin.js` | *Panel · Admin*: cartera de comunidades, honorarios y actividad |
| 09 | `09-web-crm.js` | *CRM · Oportunidades*: embudo en cuatro columnas |
| 10 | `10-web-oportunidad.js` | *Detalle de oportunidad* con la valorización del generador de propuestas |
| 11 | `11-web-contratos.js` | *Contratos* vigentes, estado de firma y renovaciones |
| 12 | `12-web-calendario.js` | *Calendario* mensual con visitas, vencimientos y asambleas |
| 13 | `13-web-correo.js` | *Correo · contacto@coproactiva*: bandeja compartida y hilo abierto |
| 14 | `14-movil-mensajes.js` | *Mensajes · Terreno*: comunicación entre la app y la oficina |

Todas las pantallas web son de 1440×900 y las móviles de 390×844.

### Dependencias

- El 01 y el 14 son independientes de los demás (el 14 solo usa componentes ya creados).
- El 04, 05, 06, 08, 10, 11 y 13 necesitan el **02** y el **03**.
- El 09 y el 12 necesitan además el **07**.

Cada script que depende de otro aborta con un error claro si no encuentra los
componentes, así que no hay riesgo de dejar una pantalla a medio dibujar.

Los scripts buscan los componentes **por nombre**, no por ID, así que no hay que copiar
nada entre ejecuciones. Cargan la página Fundaciones como página actual (ahí viven los
componentes) y crean la pantalla en su página de destino con `page.loadAsync()`, porque
`setCurrentPageAsync` solo puede llamarse una vez por script.

### Costo en llamadas

Son 14 llamadas solo para ejecutar, más una por cada captura de revisión. El plan
Starter da 20 al mes, así que no alcanza para correrlos todos y revisarlos en un mismo
ciclo. Dos caminos:

- **Por tandas**: primero el 01 al 06 (control en terreno) con sus capturas; el mes
  siguiente el 07 al 14.
- **Subiendo de plan**: con Pro y asiento Full o Dev son 200 llamadas al día, y todo
  entra de una sentada con margen para ajustes.

## Cómo se ejecuta

Desde una sesión con el MCP de Figma conectado:

```
use_figma({
  fileKey: "gf0OFDhZICYDTya9sHSzMm",
  description: "<lo que hace el script>",
  skillNames: "resource:figma-use,resource:figma-generate-design",
  code: "<contenido completo del archivo .js>"
})
```

Los scripts devuelven los IDs de todo lo que crean o modifican. Anotarlos en
`ids.md` si se van a necesitar después.

## Qué ya está construido en el archivo

**Fundaciones** — 29 variables de color, 14 de espaciado, 3 de radio, 16 estilos de
texto y 8 componentes (Botón, Chip de estado, Campo, Ítem de control, Tarjeta de
visita, Badge de rol, KPI, Navegación inferior).

**Terreno · app móvil** — `Control en terreno` e `Inicio · Terreno` completas;
`Nuevo hallazgo` con solo el encabezado (lo completa el script 01). El script 14
agrega `Mensajes · Terreno`.

**Gestión · web** — página vacía (la llenan los scripts 04 al 13).

## De dónde salen los valores

Todo lo visual sale del código real del sitio, no de una paleta inventada:

- `sitio/styles.css` → tokens de marca y familias tipográficas.
- `sitio/propuestas/propuesta-app.jsx` (`panelStyles`) → padding de inputs 9/10 px,
  botones 11/12 px, bordes `#ddd7cf`, radio 2 px, etiquetas Montserrat Bold 9.5 px con
  tracking .16em, aviso ámbar `#fdf3e6` / `#f0dcbd` / `#8a5f22`.
- `sitio/propuestas/index.html` (media query ≤860 px) → en móvil los campos suben a
  16 px de tipografía y 11 px de padding vertical.

Los verdes, rojos y azules de estado no existían en el código: se derivaron del mismo
tono cálido de la marca siguiendo el patrón fondo claro / borde / texto oscuro del
aviso ámbar.

## Alcance

Con los 14 scripts ejecutados, el archivo cubre:

- **Fundaciones**: variables de color, espaciado y radio; estilos de texto; y los
  componentes del sistema.
- **Control en terreno**, en sus dos caras: captura móvil (inicio, formulario de
  control, hallazgo) y gestión web (supervisión, bandeja, detalle con OT).
- **Comercial**: embudo de oportunidades, detalle con valorización y contratos.
- **Gestión**: panel de Admin, calendario y bandeja de contacto@coproactiva.
- **Comunicación web ↔ app**: el hilo entre terreno y oficina, con la OT adjunta.

Los tres roles definidos son Admin, Jefatura y Terreno. No hay súper admin.

Lo que queda pendiente de definir con el negocio antes de diseñarlo: cómo se factura
(el módulo de facturación y cobranza no está), qué ve el copropietario si alguna vez
tiene acceso, y el detalle del flujo de firma electrónica de contratos —acá el
contrato solo muestra su estado, no el proceso de firma.
