# Servidor de IA (Cloudflare Workers)

Guarda la clave de Gemini como **secreto** en Cloudflare. La herramienta le pide a este servidor que hable con Gemini, así la clave nunca aparece en la página, en el navegador ni en GitHub, y nadie tiene que pegarla.

Plan gratuito de Cloudflare: 100.000 pedidos por día, de sobra para esta herramienta.

## Instalación (conectado a GitHub, se actualiza solo)

1. En https://dash.cloudflare.com → **Workers & Pages** → **Create** → **Import a repository**, elegí `Mejora-de-sitios-`. Nombre del Worker: `mejora-de-sitios`.
2. Configuración de build:
   - **Build command:** vacío
   - **Deploy command:** `npx wrangler deploy`
   - **Root directory:** `/`

   La configuración está en `wrangler.toml`, en la raíz del repositorio.
3. En el Worker → **Settings** → **Variables and Secrets** → **Add**: tipo **Secret**, nombre `GEMINI_API_KEY`, valor: tu clave de https://aistudio.google.com/apikey.
4. Abrí `https://mejora-de-sitios.TU-CUENTA.workers.dev/`. Tiene que mostrar `"claveConfigurada": true` y `"limite": true`.
5. Esa dirección va en `IA_SERVER_DEFAULT` (`index.html`). No es secreta.

## Seguridad

- El servidor solo reenvía dos cosas: la lista de modelos y los pedidos de generación de Gemini. Cualquier otra ruta se rechaza.
- Solo atiende a páginas permitidas. Por defecto: `https://raw.githack.com` y `https://tomasquinteros059-svg.github.io`. Para cambiarlas, agregá la variable de texto `ALLOWED_ORIGINS` con las direcciones separadas por coma.
- `raw.githack.com` es compartido por otros proyectos: conviene activar GitHub Pages y dejar solo `https://tomasquinteros059-svg.github.io` en `ALLOWED_ORIGINS`.
- Límite de uso: 20 pedidos por minuto por persona, configurado en `wrangler.toml`.
- En Google AI Studio podés ver el consumo de la clave y ponerle límites.
