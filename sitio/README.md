# Herramientas CoproActiva

Sitio estático (sin build): portada + generador de propuestas + cotizador de honorarios.

## Estructura

    sitio/
      index.html            portada con los enlaces
      styles.css            fuentes y tokens de marca
      fonts/                Montserrat, Source Sans Pro, Retro Signature
      logo-coproactiva.svg
      propuestas/           generador de propuestas comerciales
      cotizador/            cotizador de honorarios
    netlify.toml            configuración de publicación

## Publicar en Netlify

1. Sube **el contenido** de esta carpeta (no la carpeta misma) a la raíz del repositorio `franciscomorgadotobar-crypto/cotizador-coproactiva` (rama `main`).
2. En Netlify: **Add new site → Import an existing project → GitHub →** elige el repositorio.
3. Deja *Build command* vacío y *Publish directory* en `.` (Netlify ya lo lee de `netlify.toml`).
4. **Deploy**. Cada push a `main` vuelve a desplegar solo.
5. Dominio: **Site configuration → Domain management → Options → Edit site name** → `cotizador-coproactiva` (queda `https://cotizador-coproactiva.netlify.app`).

## Notas

- No hay servidor ni base de datos: cada navegador guarda sus propios datos (localStorage).
- React y Babel se cargan desde CDN; para uso sin internet habría que precompilar.
