# Herramientas CoproActiva

Sitio estático (sin build): portada + generador de propuestas comerciales.

## Estructura

La carpeta sitio/ contiene index.html (portada), styles.css (tokens de marca), fonts/ (Montserrat, Source Sans Pro, Retro Signature), logo-coproactiva.svg, propuestas/ (generador de propuestas comerciales) y netlify.toml (configuración de publicación).

## Publicar en Netlify

Repo: franciscomorgadotobar-crypto/cotizador-coproactiva, rama main. La carpeta sitio/ vive en la raíz del repo. En Netlify (proyecto cotizador-coproactiva), en Project configuration → Build & deploy → Build settings, el Base directory está en sitio — Netlify toma netlify.toml, publish e index.html desde ahí. Cada push a main vuelve a desplegar solo. Sitio: https://cotizador-coproactiva.netlify.app.

## Notas

No hay servidor ni base de datos: cada navegador guarda sus propios datos (localStorage). React y Babel se cargan desde CDN; para uso sin internet habría que precompilar.
