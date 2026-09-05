# Plugin: CoproActiva · Constructor de interfaz

Ejecuta los 14 scripts de diseño **dentro de Figma**, sin el conector MCP y sin límite
de llamadas. Es la vía recomendada mientras el conector no esté disponible.

## Instalar

1. Descarga o clona el repositorio en tu computador. Necesitas la carpeta completa
   `figma/plugin/` (con `manifest.json`, `code.js` y `ui.html`).
2. Abre la **app de escritorio de Figma** (los plugins en desarrollo no se importan
   desde el navegador).
3. Menú **Plugins → Development → Import plugin from manifest…**
4. Elige el archivo `figma/plugin/manifest.json`.

Queda instalado como plugin de desarrollo, visible solo para ti.

## Usar

1. Abre el archivo de diseño: <https://www.figma.com/design/gf0OFDhZICYDTya9sHSzMm>
2. **Plugins → Development → CoproActiva · Constructor de interfaz**
3. Marca los pasos y pulsa **Ejecutar**.

### Dos advertencias que importan

**Solo en el archivo de CoproActiva.** Los scripts referencian variables, estilos y
componentes por ID (`VariableID:2:3`, el nodo `17:132`, etc.). En otro archivo esos IDs
no existen y el plugin va a fallar o, peor, a dibujar sobre lo que no corresponde.

**Cada paso se corre una sola vez.** No detecta si ya se ejecutó: repetirlo vuelve a
dibujar todo y te deja componentes y pantallas duplicados. Si algo salió mal, deshaz con
⌘Z antes de reintentar.

### Orden sugerido

La primera vez, márcalos todos: la interfaz los ejecuta en orden numérico, que ya
respeta las dependencias. Si prefieres ir por partes:

1. **02, 03 y 07** — los componentes. Todo lo demás depende de ellos.
2. **01 y 14** — las pantallas móviles que faltan.
3. **04, 05, 06** — el módulo de control en terreno en la web.
4. **08 al 13** — comercial y gestión.

Cada script que depende de otro aborta con un mensaje claro si no encuentra los
componentes, así que no vas a terminar con una pantalla a medio dibujar.

Si un paso falla, la ejecución se detiene ahí y los anteriores quedan aplicados. Corriges
y vuelves a marcar solo lo que falta.

## Modificar un script

Los `.js` numerados de `figma/` son la fuente única: sirven tanto para el conector MCP
como para este plugin. Después de editar cualquiera:

```bash
cd figma/plugin
node build.mjs
```

Eso regenera `code.js`. En Figma, **Plugins → Development → Hot reload plugin** (o
cierra y vuelve a abrir el plugin) para tomar los cambios.

No edites `code.js` a mano: se sobrescribe en cada build.

## Cómo está armado

- `manifest.json` — declara `documentAccess: "dynamic-page"`, que es lo que habilita
  `page.loadAsync()` y `getNodeByIdAsync()` tal como los usan los scripts. La red está
  bloqueada: el plugin solo dibuja en el documento.
- `build.mjs` — copia cada script literal como cuerpo de una función `async`. Es
  exactamente lo que hacía el conector MCP con el parámetro `code`, y por eso los
  scripts no necesitan dos versiones.
- `code.js` — generado. Contiene los 14 pasos y el puente con la interfaz.
- `ui.html` — la lista de pasos, el botón de ejecutar y el registro de lo que pasó.
  Usa los colores de marca; la tipografía es la del sistema porque el manifest bloquea
  la red y no se pueden cargar Montserrat ni Source Sans Pro desde Google Fonts.
