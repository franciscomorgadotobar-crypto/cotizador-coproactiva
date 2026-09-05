# App CoproActiva

Aplicación de administración de comunidades: React + Vite sobre Supabase.

Es un proyecto aparte del generador de propuestas (`sitio/`), que sigue
funcionando igual y no se tocó.

## Levantar en local

```bash
cd app
npm install
cp .env.example .env      # completar con las credenciales del proyecto Supabase
npm run dev
```

Las dos variables son públicas por diseño: la clave `anon` no da acceso a nada
que las políticas de RLS no permitan. La clave `service_role` no va acá ni en
ningún archivo que llegue al navegador.

Sin credenciales la app arranca igual y muestra el aviso en la pantalla de
ingreso, en vez de quedar en blanco.

## Desplegar en Netlify

Es un segundo sitio, distinto del actual:

1. Nuevo sitio desde el mismo repositorio.
2. **Base directory:** `app`
3. Build y publish los toma de `app/netlify.toml` (`npm run build` → `dist`).
4. En *Site configuration → Environment variables*, agregar `VITE_SUPABASE_URL`
   y `VITE_SUPABASE_ANON_KEY`.

El redirect `/*` → `/index.html` ya está configurado: sin él, entrar directo a
`/control/<id>` daría 404.

## Qué hay construido

| Ruta | Pantalla |
|---|---|
| `/ingreso` | Autenticación con correo y contraseña |
| `/` | Inicio de terreno: controles asignados con su avance |
| `/control/:id` | Formulario de control con check-in geolocalizado |

El diseño sale de `figma/` y usa los mismos valores del generador de propuestas:
padding 9/10 en campos, 11/12 en botones, tracking .16em en etiquetas, radio 2px.
No son aproximaciones.

## Tres decisiones que conviene conocer

**Los cambios se pintan antes de guardarse.** Al marcar un ítem del checklist la
interfaz responde de inmediato y el guardado va en segundo plano. En terreno la
conexión es mala y esperar al servidor por cada toque haría el formulario
inusable. Si el guardado falla, el cambio se revierte y aparece el aviso.

**El check-in guarda la precisión del GPS.** Un check-in con precisión de 500
metros no prueba que alguien estuvo en el lugar, así que el dato se conserva tal
cual y la vista web lo muestra.

**No se puede enviar un control incompleto ni sin check-in.** El botón queda
bloqueado y dice cuántos ítems faltan. Un control a medias enviado como completo
es peor que uno sin enviar.

## Estructura

```
src/
  lib/supabase.js      cliente
  lib/sesion.jsx       contexto de sesión con el perfil y el rol
  estilos/tokens.css   colores, tipografías y radios de marca
  estilos/base.css     componentes: botones, campos, chips, selector
  paginas/             pantallas
```

Los tokens están en tres lugares que deben cambiar juntos: `sitio/styles.css`,
las variables del archivo de Figma y `app/src/estilos/tokens.css`.

## Qué falta

- Subida de fotos a Supabase Storage: la tabla `adjuntos` y sus políticas ya
  están, la interfaz no.
- Registro de hallazgos como pantalla propia (hoy la nota del ítem cumple ese rol).
- Generación de órdenes de trabajo desde un hallazgo.
- Toda la cara web: supervisión, bandeja de controles, detalle, CRM y contratos.
- Funcionamiento sin conexión. Hoy la app necesita señal; en subterráneos no la
  hay, y ese es justamente donde se registran los hallazgos críticos.
