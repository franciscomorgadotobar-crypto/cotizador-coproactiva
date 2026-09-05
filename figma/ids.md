# IDs del archivo de Figma

Archivo: `gf0OFDhZICYDTya9sHSzMm`

Los scripts de esta carpeta usan estos IDs como literales. Si se rehace el archivo
desde cero hay que actualizarlos.

## Páginas

| ID | Nombre |
|----|--------|
| `0:1` | Fundaciones |
| `3:37` | Terreno · app móvil |
| `3:38` | Gestión · web |

## Variables de color (colección `Color`)

| ID | Nombre | Hex |
|----|--------|-----|
| `VariableID:2:3` | marca/naranja | `#d5863b` |
| `VariableID:2:4` | marca/pizarra | `#4a5a68` |
| `VariableID:2:5` | marca/tinta | `#2b3138` |
| `VariableID:2:6` | marca/papel | `#f7f4f0` |
| `VariableID:2:7` | marca/niebla | `#e9e6e2` |
| `VariableID:2:8` | superficie/fondo-app | `#e6e2dd` |
| `VariableID:2:9` | superficie/tarjeta | `#ffffff` |
| `VariableID:2:10` | superficie/hover | `#faf8f5` |
| `VariableID:2:11` | borde/base | `#ddd7cf` |
| `VariableID:2:12` | borde/suave | `#e9e6e2` |
| `VariableID:2:13` | borde/foco | `#d5863b` |
| `VariableID:2:14` | texto/titulo | `#2b3138` |
| `VariableID:2:15` | texto/cuerpo | `#3a4149` |
| `VariableID:2:16` | texto/apagado | `#5a636c` |
| `VariableID:2:17` | texto/suave | `#6b7480` |
| `VariableID:2:18` | texto/tenue | `#8b939b` |
| `VariableID:2:19` | texto/inverso | `#ffffff` |
| `VariableID:2:20` | estado/ok-texto | `#4e6b4a` |
| `VariableID:2:21` | estado/ok-fondo | `#eef1e9` |
| `VariableID:2:22` | estado/ok-borde | `#d8e0cf` |
| `VariableID:2:23` | estado/alerta-texto | `#8a5f22` |
| `VariableID:2:24` | estado/alerta-fondo | `#fdf3e6` |
| `VariableID:2:25` | estado/alerta-borde | `#f0dcbd` |
| `VariableID:2:26` | estado/critico-texto | `#93392b` |
| `VariableID:2:27` | estado/critico-fondo | `#fbeeeb` |
| `VariableID:2:28` | estado/critico-borde | `#edd2cb` |
| `VariableID:2:29` | estado/info-texto | `#4a5a68` |
| `VariableID:2:30` | estado/info-fondo | `#eef0f2` |
| `VariableID:2:31` | estado/info-borde | `#d7dde2` |

## Variables de medida

Espaciado: `VariableID:3:3` a `VariableID:3:16` (`esp/2`, `esp/4`, `esp/6`, `esp/8`,
`esp/10`, `esp/12`, `esp/16`, `esp/18`, `esp/20`, `esp/22`, `esp/24`, `esp/28`,
`esp/32`, `esp/44`, en ese orden).

| ID | Nombre | Valor |
|----|--------|-------|
| `VariableID:3:18` | radio/control | 2 |
| `VariableID:3:19` | radio/tarjeta | 3 |
| `VariableID:3:20` | radio/pastilla | 999 |

## Estilos de texto

Se buscan por nombre con `figma.getLocalTextStylesAsync()`, no por ID.

`display/h1`, `display/h2`, `display/h3`, `display/dato`, `display/dato-chico`,
`etiqueta/grupo`, `etiqueta/campo`, `etiqueta/boton`, `etiqueta/tabla`,
`etiqueta/chip`, `cuerpo/lead`, `cuerpo/base`, `cuerpo/campo`, `cuerpo/fuerte`,
`cuerpo/chico`, `cuerpo/micro`.

## Componentes (página Fundaciones)

| Set | ID del set | Variantes |
|-----|-----------|-----------|
| Botón | `5:14` | `5:2` Primario/Web · `5:4` Primario/Móvil · `5:6` Secundario/Web · `5:8` Secundario/Móvil · `5:10` Texto/Web · `5:12` Texto/Móvil |
| Chip de estado | `8:10` | `8:2` Cumple · `8:4` Alerta · `8:6` Crítico · `8:8` Pendiente |
| Campo | `9:26` | `9:2` Normal/Web · `9:6` Normal/Móvil · `9:10` Foco/Web · `9:14` Foco/Móvil · `9:18` Error/Web · `9:22` Error/Móvil |
| Ítem de control | `10:62` | `10:2` Sin evaluar · `10:16` Cumple · `10:30` Observación · `10:46` Crítico |
| Tarjeta de visita | `13:32` | `13:2` Pendiente · `13:12` En curso · `13:22` Completada |
| Badge de rol | `13:42` | `13:33` Admin · `13:36` Jefatura · `13:39` Terreno |
| KPI | `15:16` | `15:8` Móvil · `15:12` Web |
| Navegación inferior | `15:17` | componente simple, sin variantes |

## Pantallas ya construidas

| ID | Nombre | Página |
|----|--------|--------|
| `11:2` | Control en terreno | Terreno · app móvil |
| `16:66` | Inicio · Terreno | Terreno · app móvil |
| `17:124` | Nuevo hallazgo (encabezado; cuerpo en `17:132`) | Terreno · app móvil |

## IDs que crean los scripts pendientes

Anotar acá después de ejecutar cada script, para poder retomarlos.

Los scripts 04, 05 y 06 buscan los componentes por nombre, así que anotar estos IDs es
opcional; sirve para ajustes puntuales posteriores.

- 01 — Chip `estado=En curso`: _(pendiente)_
- 02 — Ítem de menú (set): _(pendiente)_
- 02 — Barra lateral: _(pendiente)_
- 03 — Encabezado de tabla: _(pendiente)_
- 03 — Fila de control (set): _(pendiente)_
- 03 — Panel de sección: _(pendiente)_
- 04 — Supervisión · Jefatura: _(pendiente)_
- 05 — Controles recibidos: _(pendiente)_
- 06 — Detalle de control: _(pendiente)_
- 07 — Tarjeta de oportunidad (set): _(pendiente)_
- 07 — Celda de calendario (set): _(pendiente)_
- 07 — Fila de conversación (set): _(pendiente)_
- 08 — Panel · Admin: _(pendiente)_
- 09 — CRM · Oportunidades: _(pendiente)_
- 10 — Detalle de oportunidad: _(pendiente)_
- 11 — Contratos: _(pendiente)_
- 12 — Calendario: _(pendiente)_
- 13 — Correo · contacto@coproactiva: _(pendiente)_
- 14 — Mensajes · Terreno: _(pendiente)_
