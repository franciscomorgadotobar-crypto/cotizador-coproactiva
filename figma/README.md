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

| # | Archivo | Qué construye |
|---|---------|---------------|
| 01 | `01-hallazgo-cuerpo.js` | Cuerpo de la pantalla *Nuevo hallazgo* y variante `estado=En curso` del chip |
| 02 | `02-web-navegacion.js` | Componentes *Ítem de menú* y *Barra lateral* (con el logotipo real del sitio) |
| 03 | `03-web-tabla.js` | Componentes *Encabezado de tabla*, *Fila de control* y *Panel de sección* |
| 04 | `04-web-supervision.js` | Tablero *Supervisión · Jefatura* (1440×900) |
| 05 | `05-web-controles.js` | Bandeja *Controles recibidos* (1440×900) |
| 06 | `06-web-detalle.js` | *Detalle de control* con hallazgos, geolocalización y OT (1440×900) |

Correr en orden: el 04, 05 y 06 dependen de los componentes que crean el 02 y el 03, y
abortan con un error claro si no los encuentran. El 01 es independiente.

Los scripts 04, 05 y 06 buscan los componentes **por nombre**, no por ID, así que no
hay que copiar nada entre ejecuciones. Cargan la página Fundaciones como página actual
(ahí viven los componentes) y crean la pantalla en *Gestión · web* con
`page.loadAsync()`, porque `setCurrentPageAsync` solo puede llamarse una vez por
script.

Después de cada ejecución conviene una captura (`get_screenshot`) para revisar, pero
cada captura consume una llamada más. Con 20 al mes alcanza para los 6 scripts, sus
capturas y algún ajuste.

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
`Nuevo hallazgo` con solo el encabezado (lo completa el script 01).

**Gestión · web** — página vacía (la llenan los scripts 02 a 05).

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

Este archivo cubre las fundaciones del sistema y el módulo de **control en terreno**
en sus dos caras (captura móvil y gestión web), con los roles Admin, Jefatura y
Terreno.

Quedan fuera, para una etapa posterior: CRM, tableros de Admin, calendario,
gestión de correo por contacto@coproactiva, generación de contratos, valorización de
oportunidades y exportación a PDF.
