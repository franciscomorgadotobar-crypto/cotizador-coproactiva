# Funciones edge

    _compartido/correo.ts   plantillas y envío por SMTP — fuente única
    equipo/index.ts         alta y mantención de usuarios (exige sesión)
    acceso/index.ts         pedir un enlace nuevo sin sesión (público, con límite)

`correo.ts` vive una sola vez. Al desplegar hay que copiarlo dentro de cada
función, porque el despliegue sube archivos planos y no resuelve `../`:

    node supabase/armar.mjs      # deja los paquetes en supabase/.armado/

Después se sube el contenido de cada carpeta. `.armado/` no se versiona: es
producto de la copia, y editarlo ahí perdería el cambio en la próxima corrida.
