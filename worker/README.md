# Servidor de IA (Cloudflare Workers)

Guarda la clave de Gemini como **secreto** en Cloudflare. La herramienta le pide a este servidor que hable con Gemini, así la clave nunca aparece en la página, en el navegador ni en GitHub, y nadie tiene que pegarla.

Plan gratuito de Cloudflare: 100.000 pedidos por día, de sobra para esta herramienta.

## Instalación desde el panel (unos 10 minutos, se puede hacer desde el celular o la tablet)

1. Entrá a https://dash.cloudflare.com y creá una cuenta gratis (o iniciá sesión).
2. En el menú, abrí **Workers & Pages** → **Create** → **Create Worker** (plantilla *Hello World*).
3. Nombre: `mejorador-ia` → **Deploy**.
4. Tocá **Edit code**, borrá todo el código de ejemplo y pegá el contenido de este archivo:
   https://raw.githubusercontent.com/tomasquinteros059-svg/Mejora-de-sitios-/claude/website-improvement-tool-1qduro/worker/worker.js
   Después tocá **Deploy**.
5. Volvé al Worker → **Settings** → **Variables and Secrets** → **Add**:
   - Type: **Secret**
   - Variable name: `GEMINI_API_KEY`
   - Value: tu clave de Gemini (la de https://aistudio.google.com/apikey)
   - Guardá con **Deploy**.
6. Abrí la dirección del Worker, por ejemplo `https://mejorador-ia.TU-CUENTA.workers.dev/`. Tiene que mostrar `"claveConfigurada": true`.
7. Pasale esa dirección a quien mantiene la herramienta para dejarla fija en `IA_SERVER_DEFAULT` (`index.html`). No es secreta. Mientras tanto se puede pegar en **Agentes de IA → Servidor de IA (Cloudflare)**.

## Seguridad

- El servidor solo reenvía dos cosas: la lista de modelos y los pedidos de generación de Gemini. Cualquier otra ruta se rechaza.
- Solo atiende a páginas permitidas. Por defecto: `https://raw.githack.com` y `https://tomasquinteros059-svg.github.io`. Para cambiarlas, agregá la variable de texto `ALLOWED_ORIGINS` con las direcciones separadas por coma.
- `raw.githack.com` es compartido por otros proyectos: conviene activar GitHub Pages y dejar solo `https://tomasquinteros059-svg.github.io` en `ALLOWED_ORIGINS`.
- Límite de uso opcional (20 pedidos por minuto por persona): se activa publicando con la línea de comandos (`npx wrangler deploy` dentro de esta carpeta), que usa `wrangler.toml`.
- En Google AI Studio podés ver el consumo de la clave y ponerle límites.
