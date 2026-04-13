/* ═══════════════════════════════════════════════
   CLARIX SERVICE WORKER v20260413j
   Handles: offline cache + instant update notifications
═══════════════════════════════════════════════ */

const CACHE_VERSION = 'clarix-v20260413k';
const STATIC_CACHE  = CACHE_VERSION + '-static';

/* Assets to pre-cache for offline */
const PRECACHE = [
  '/',
  '/index.html',
  '/apps.html',
  '/write.html',
  '/inspire.html',
  '/profile.html',
  '/css/design.css',
  '/css/components.css',
  '/js/core.js',
  '/config.js'
];

/* ── Install: cache key assets ── */
self.addEventListener('install', function(e) {
  /* Skip waiting immediately — activate new SW right away */
  self.skipWaiting();
  e.waitUntil(
    caches.open(STATIC_CACHE).then(function(cache) {
      return cache.addAll(PRECACHE).catch(function() {
        /* Non-fatal — some assets may not be available offline */
      });
    })
  );
});

/* ── Activate: clear old caches & claim clients ── */
self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== STATIC_CACHE; })
            .map(function(k) { return caches.delete(k); })
      );
    }).then(function() {
      /* Take control of all open tabs immediately */
      return self.clients.claim();
    })
  );
  /* SW_UPDATED postMessage removed — pwa.js checkVersion() handles
     update notification via localStorage version comparison instead. */
});

/* ── SKIP_WAITING: allow pwa.js to activate this SW immediately on mobile ── */
self.addEventListener('message', function(e) {
  if (e.data && e.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/* ── Fetch: Network-first for HTML, Cache-first for assets ── */
self.addEventListener('fetch', function(e) {
  /* Only handle GET requests — POST/PUT cannot be cached */
  if (e.request.method !== 'GET') return;

  var url = new URL(e.request.url);

  /* Always fetch HTML fresh from network (no-cache) */
  if (e.request.mode === 'navigate' ||
      url.pathname.endsWith('.html') ||
      url.pathname === '/') {
    e.respondWith(
      fetch(e.request, { cache: 'no-store' }).catch(function() {
        /* Offline fallback: serve cached version if available */
        return caches.match(e.request).then(function(cached) {
          return cached || caches.match('/index.html');
        });
      })
    );
    return;
  }

  /* Critical JS files that must ALWAYS be fresh (never serve stale from cache).
     pwa.js contains CLARIX_APP_VERSION — if stale, wrong version triggers banners.
     sidebar.js / core.js contain critical UI init that must stay up to date.
     firebase-auth.js and config.js affect auth state across deployments. */
  var NEVER_CACHE = ['pwa.js', 'sidebar.js', 'core.js', 'firebase-auth.js', 'config.js'];
  var isCritical = NEVER_CACHE.some(function(f) { return url.pathname.includes(f); });

  /* For versioned JS/CSS (?v=...) — cache aggressively, EXCEPT critical files */
  if (url.search.includes('v=') && !isCritical) {
    e.respondWith(
      caches.match(e.request).then(function(cached) {
        return cached || fetch(e.request).then(function(res) {
          var clone = res.clone();
          caches.open(STATIC_CACHE).then(function(cache) { cache.put(e.request, clone); });
          return res;
        });
      })
    );
    return;
  }

  /* Default: network with cache fallback */
  e.respondWith(
    fetch(e.request, { cache: 'no-store' }).catch(function() {
      return caches.match(e.request);
    })
  );
});
