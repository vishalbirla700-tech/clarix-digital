/* ═══════════════════════════════════════════════
   CLARIX — SERVICE WORKER v5.0
   Network-first for HTML + CSS + JS
   v5: Force update banner on all devices
═══════════════════════════════════════════════ */

const CACHE_VERSION = 'v5';
const CACHE_NAME    = `clarix-${CACHE_VERSION}`;
const STATIC_CACHE  = `clarix-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `clarix-dynamic-${CACHE_VERSION}`;

/* ─── INSTALL: skip waiting immediately ─────── */
self.addEventListener('install', (event) => {
  // Skip waiting so new SW activates immediately
  self.skipWaiting();
});

/* ─── ACTIVATE: delete ALL old caches ───────── */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter(k => !k.includes(CACHE_VERSION)) // delete anything not v4
          .map(k => {
            console.log('[SW] Deleting old cache:', k);
            return caches.delete(k);
          })
      );
    }).then(() => {
      console.log('[SW] v4 activated, old caches cleared');
      return self.clients.claim(); // take control of all open pages
    })
  );
});

/* ─── FETCH: smart strategy per request type ── */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET and chrome-extension requests
  if (request.method !== 'GET') return;
  if (url.protocol === 'chrome-extension:') return;

  // Network-only for AI API calls
  if (url.hostname.includes('anthropic') || url.hostname.includes('openai') ||
      url.hostname.includes('googleapis') || url.hostname.includes('google')) {
    event.respondWith(fetch(request));
    return;
  }

  // Cache-first for Google Fonts (rarely changes)
  if (url.hostname.includes('fonts.googleapis') || url.hostname.includes('fonts.gstatic')) {
    event.respondWith(cacheFirst(request, DYNAMIC_CACHE));
    return;
  }

  // Network-first for ALL local HTML pages
  if (url.origin === location.origin &&
      (request.headers.get('accept')?.includes('text/html') || url.pathname.endsWith('.html'))) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Network-first for ALL local CSS and JS (ensures style/logic updates reach users)
  if (url.origin === location.origin &&
      (url.pathname.endsWith('.css') || url.pathname.endsWith('.js'))) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Cache-first for images and icons (stable assets)
  if (url.origin === location.origin &&
      (url.pathname.match(/\.(png|jpg|jpeg|svg|ico|webp|gif)$/))) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // Default: network first, fall back to cache
  event.respondWith(networkFirst(request));
});

/* ─── STRATEGY: Network-First ───────────────── */
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    return cached || offlineFallback(request);
  }
}

/* ─── STRATEGY: Cache-First ─────────────────── */
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return offlineFallback(request);
  }
}

/* ─── OFFLINE FALLBACK ───────────────────────── */
function offlineFallback(request) {
  if (request.headers.get('accept')?.includes('text/html')) {
    return caches.match('/index.html');
  }
  return new Response('Offline — Clarix', { status: 503, statusText: 'Service Unavailable' });
}

/* ─── NOTIFY CLIENTS OF UPDATE ───────────────── */
// When a new SW is installed, tell all open pages to show the update banner
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
