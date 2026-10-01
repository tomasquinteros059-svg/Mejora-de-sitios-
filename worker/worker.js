/**
 * Servidor de IA del Mejorador de Sitios (Cloudflare Worker).
 *
 * Guarda la clave de Gemini como secreto (GEMINI_API_KEY) y reenvía a Google
 * solo los pedidos que la herramienta necesita: listar modelos y generar
 * contenido. La clave nunca llega al navegador ni al repositorio.
 *
 * Configuración: wrangler.toml (raíz del repositorio). Variables (Settings → Variables and Secrets):
 *   GEMINI_API_KEY   (secreto, obligatorio)  clave de https://aistudio.google.com/apikey
 *   ALLOWED_ORIGINS  (texto, opcional)       sitios que pueden usarlo, separados por coma
 *   LIMITER          (enlace)                límite de pedidos por minuto, definido en wrangler.toml
 */
const GOOGLE = 'https://generativelanguage.googleapis.com';
const DEFAULT_ORIGINS = 'https://raw.githack.com,https://tomasquinteros059-svg.github.io,http://localhost:8765';
const MAX_BODY = 4 * 1024 * 1024; // 4 MB por pedido
const GENERATE = /^\/v1beta\/models\/[A-Za-z0-9._-]+:(streamGenerateContent|generateContent)$/;

function json(data, status, headers) {
  return new Response(JSON.stringify(data), { status, headers: { ...headers, 'content-type': 'application/json; charset=utf-8' } });
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const allowed = (env.ALLOWED_ORIGINS || DEFAULT_ORIGINS).split(',').map(s => s.trim()).filter(Boolean);
    const originOk = allowed.includes('*') || allowed.includes(origin);
    const cors = {
      'Access-Control-Allow-Origin': originOk ? origin : allowed[0],
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'content-type',
      'Access-Control-Max-Age': '86400',
      'Vary': 'Origin',
    };
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });

    const url = new URL(request.url);
    // Chequeo rápido desde el navegador: https://<tu-worker>.workers.dev/
    if (url.pathname === '/' && request.method === 'GET') {
      return json({ servicio: 'Mejorador de Sitios', claveConfigurada: !!env.GEMINI_API_KEY, limite: !!env.LIMITER }, 200, cors);
    }
    if (!originOk) return json({ error: { message: 'Este servidor solo atiende a la herramienta Mejorador de Sitios.' } }, 403, cors);
    if (!env.GEMINI_API_KEY) return json({ error: { message: 'Falta configurar el secreto GEMINI_API_KEY en Cloudflare.' } }, 500, cors);

    const listing = request.method === 'GET' && url.pathname === '/v1beta/models';
    const generating = request.method === 'POST' && GENERATE.test(url.pathname);
    if (!listing && !generating) return json({ error: { message: 'Ruta no permitida.' } }, 404, cors);

    if (generating && env.LIMITER) {
      const { success } = await env.LIMITER.limit({ key: request.headers.get('CF-Connecting-IP') || 'anon' });
      if (!success) return json({ error: { message: 'Demasiados pedidos seguidos. Esperá un minuto.' } }, 429, cors);
    }

    const init = { method: request.method, headers: { 'x-goog-api-key': env.GEMINI_API_KEY } };
    if (generating) {
      const body = await request.text();
      if (body.length > MAX_BODY) return json({ error: { message: 'El sitio es demasiado grande para procesarlo.' } }, 413, cors);
      init.headers['content-type'] = 'application/json';
      init.body = body;
    }
    const upstream = await fetch(GOOGLE + url.pathname + url.search, init);
    const headers = new Headers(cors);
    headers.set('content-type', upstream.headers.get('content-type') || 'application/json');
    headers.set('cache-control', 'no-store');
    return new Response(upstream.body, { status: upstream.status, headers });
  },
};
