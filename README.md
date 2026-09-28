# Mejorador de Sitios

Herramienta web que toma un sitio (por link, archivo `.html` o código pegado), lo **visita y lo renderiza**, lo audita y genera al instante una **versión mejorada con su propio link**. No necesita servidor, base de datos ni dominio: todo corre en el navegador.

## Cómo abrirla (sin dominio)

| Opción | Link | Requisitos |
|---|---|---|
| Inmediata | https://raw.githack.com/tomasquinteros059-svg/Mejora-de-sitios-/claude/website-improvement-tool-1qduro/index.html | Ninguno (el repo es público) |
| GitHub Pages | https://tomasquinteros059-svg.github.io/Mejora-de-sitios-/ | Activar una sola vez: **Settings → Pages → Source: GitHub Actions** |
| Local | Abrir `index.html` con doble clic | Ninguno |

## Qué hace

1. **Visita el sitio.** Lo descarga (directo o mediante puentes CORS públicos) y lo renderiza en un marco oculto, igual que un navegador, para medir colores, tamaños de letra, contraste, color de marca y desbordes.
2. **Audita 6 áreas** con puntaje de 0 a 100: SEO, accesibilidad, velocidad, móvil, diseño y seguridad.
3. **Aplica mejoras automáticas**, entre otras:
   - SEO: título, meta descripción, un único H1, Open Graph para WhatsApp/Facebook/X, URL canónica, idioma.
   - Accesibilidad: texto alternativo, nombres para campos y botones con ícono, corrección de contraste medido, región principal, enlace "Saltar al contenido", zoom habilitado.
   - Velocidad: carga diferida de imágenes e iframes, scripts de terceros asíncronos, preconexión a fuentes.
   - Móvil: viewport, tablas desplazables, imágenes fluidas.
   - Diseño: reemplazo de etiquetas obsoletas (`<font>`, `<center>`, `<marquee>`…), favicon con el color de marca y 4 estilos: **Conservar, Moderno, Elegante, Audaz**.
   - Seguridad: `rel="noopener"`, forzado a HTTPS, política de referencia.
4. **Rediseño con IA (opcional).** Con una clave de API de Anthropic, Claude reescribe el sitio completo conservando el contenido real. La clave queda solo en tu navegador.
5. **Genera el link del sitio mejorado.** El HTML mejorado se comprime y viaja dentro del propio link (`index.html#v=…`). Quien lo abra ve el sitio mejorado, sin servidor ni dominio. También se puede descargar el `.html`.

## Límites conocidos

- Algunos sitios bloquean las descargas desde otros dominios; en ese caso conviene subir el archivo o pegar el código (en el navegador: clic derecho → *Ver código fuente*).
- Los sitios que arman todo su contenido con JavaScript (SPA) reciben mejoras parciales.
- Los links de sitios muy grandes pueden ser largos; para compartirlos por mensajería conviene descargar el `.html` y subirlo gratis a Netlify Drop o GitHub Pages.

## Estructura

- `index.html`: la aplicación completa (interfaz, motor de análisis, motor de mejoras, IA y visor de links).
- `.github/workflows/pages.yml`: publica la herramienta en GitHub Pages en cada push.
