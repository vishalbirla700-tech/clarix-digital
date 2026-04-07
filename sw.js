/* ═══════════════════════════════════════════════
   CLARIX — SERVICE WORKER v2.0
   Cache-first for static, Network-first for API
═══════════════════════════════════════════════ */

const CACHE_NAME = 'clarix-v2';
const STATIC_CACHE = 'clarix-static-v2';
const DYNAMIC_CACHE = 'clarix-dynamic-v2';

// Static assets to pre-cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/write.html',
  '/inspire.html',
  '/library.html',
  '/apps.html',
  '/profile.html',
  '/history.html',
  '/community.html',
  '/config.js',
  '/css/design.css',
  '/css/components.css',
  '/css/sidebar.css',
  '/css/pages/home.css',
  '/css/pages/write.css',
  '/css/pages/inspire.css',
  '/css/pages/library.css',
  '/css/pages/apps.css',
  '/css/pages/profile.css',
  '/css/pages/history.css',
  '/css/pages/community.css',
  '/js/core.js',
  '/js/ai.js',
  '/js/voice.js',
  '/js/charts.js',
  '/js/share.js',
  '/js/languages.js',
  '/js/pages/home.js',
  '/js/pages/write.js',
  '/js/pages/inspire.js',
  '/js/pages/library.js',
  '/js/pages/apps.js',
  '/js/pages/profile.js',
  '/js/pages/history.js',
  '/js/pages/community.js',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

/* ─── INSTALL: pre-cache static assets ──────── */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      // Cache what's available, ignore failures (some files may not exist yet)
      return Promise.allSettled(
        STATIC_ASSETS.map(url => cache.add(url).catch(() => {}))
      );
    }).then(() => self.skipWaiting())
  );
});

/* ─── ACTIVATE: clean old caches ────────────── */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter(k => k !== STATIC_CACHE && k !== DYNAMIC_CACHE)
          .map(k => caches.delete(k))
      );
    }).then(() => self.clients.claim())
  );
});

/* ─── FETCH: smart caching strategy ─────────── */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET and chrome-extension requests
  if (request.method !== 'GET') return;
  if (url.protocol === 'chrome-extension:') return;

  // Network-first for AI API calls
  if (url.hostname.includes('anthropic') || url.hostname.includes('openai') ||
      url.hostname.includes('googleapis') || url.hostname.includes('google')) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Network-first for external fonts/CDN
  if (url.hostname.includes('fonts.googleapis') || url.hostname.includes('fonts.gstatic')) {
    event.respondWith(cacheFirst(request, DYNAMIC_CACHE));
    return;
  }

  // Cache-first for local static assets
  if (url.origin === location.origin) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // Default: network only
  event.respondWith(fetch(request).catch(() => offlineFallback(request)));
});

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

/* ─── OFFLINE FALLBACK ───────────────────────── */
function offlineFallback(request) {
  if (request.headers.get('accept')?.includes('text/html')) {
    return caches.match('/index.html');
  }
  return new Response('Offline — Clarix', { status: 503, statusText: 'Service Unavailable' });
}

/* ─── PUSH NOTIFICATIONS (future) ───────────── */
self.addEventListener('push', (event) => {
  if (!event.data) return;
  const data = event.data.json();
  event.waitUntil(
    self.registration.showNotification(data.title || 'Clarix', {
      body: data.body || 'New update from Clarix!',
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-72.png',
      tag: 'clarix-notification',
      data: { url: data.url || '/' }
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data?.url || '/'));
});
