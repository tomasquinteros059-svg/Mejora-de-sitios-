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
4. **Agentes de IA (opcional, recomendado para sitios completos).** Con una clave de Gemini, cuatro agentes trabajan en cadena:
   - **Explorador:** visita el sitio en vivo con las herramientas *URL context* y *Google Search* de Gemini y releva todo el contenido: secciones, textos, precios, imágenes, contacto y colores. También funciona con sitios que arman su contenido con JavaScript o que bloquean la descarga directa.
   - **Estratega:** con ese relevamiento y la auditoría escribe el *prompt del sitio*: objetivo, público, paleta con códigos hex, tipografías, estructura sección por sección con su contenido y llamados a la acción, mejoras obligatorias y restricciones. El prompt aparece en pantalla: se puede copiar, editar y rehacer el sitio con él. Si marcás *Quiero leer y editar el prompt*, el proceso se detiene hasta que lo confirmes.
   - **Constructor:** sigue el prompt del Estratega y rehace el sitio completo como una página nueva, mejorada y responsive, sin inventar datos. Si la respuesta se corta por largo, la retoma sola.
   - **Revisor:** compara la página nueva con el original y, si falta contenido, lo agrega.

   El modelo se elige solo (el Gemini Pro más nuevo disponible) o se puede fijar a mano. También se puede usar Claude (Anthropic) como proveedor.

   **Sin pegar claves:** la clave de Gemini se guarda como secreto en un servidor propio y gratuito de Cloudflare (carpeta `worker/`, instrucciones en `worker/README.md`). La herramienta le habla a ese servidor y nadie necesita cargar una clave. También se puede usar una clave personal, que queda solo en tu navegador.
5. **Genera el link del sitio mejorado.** El HTML mejorado se comprime y viaja dentro del propio link (`index.html#v=…`). Quien lo abra ve el sitio mejorado, sin servidor ni dominio. También se puede descargar el `.html`.

## Límites conocidos

- Algunos sitios bloquean las descargas desde otros dominios; en ese caso conviene subir el archivo o pegar el código (en el navegador: clic derecho → *Ver código fuente*).
- Sin agentes de IA, los sitios que arman todo su contenido con JavaScript reciben mejoras parciales. El motor local sí muestra el contenido que queda oculto a la espera de animaciones, las imágenes con carga diferida y las pantallas de carga.
- Los links de sitios muy grandes pueden ser largos; para compartirlos por mensajería conviene descargar el `.html` y subirlo gratis a Netlify Drop o GitHub Pages.

## Estructura

- `index.html`: la aplicación completa (interfaz, motor de análisis, motor de mejoras, IA y visor de links).
- `worker/`: servidor de IA para Cloudflare Workers que guarda la clave de Gemini como secreto.
- `.github/workflows/pages.yml`: publica la herramienta en GitHub Pages en cada push.
