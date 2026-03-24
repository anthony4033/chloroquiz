/* ══════════════════════════════════════════════════════
   ChloroQuiz — Service Worker
   Version: 2026-03-24-v47
══════════════════════════════════════════════════════ */

const CACHE_NAME = 'chloroquiz-v50';

const PRECACHE_ASSETS = [
  '/chloroquiz/',
  '/chloroquiz/index.html',
  '/chloroquiz/chloroquiz.css',
  '/chloroquiz/chloroquiz.js',
];

// ── Installation ──
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => self.skipWaiting()) // prendre le contrôle immédiatement
  );
});

// ── Activation : supprimer TOUS les anciens caches ──
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim()) // prendre contrôle de tous les onglets
  );
});

// ── Fetch : network-first pour HTML et JS (toujours la dernière version) ──
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Supabase → toujours réseau, jamais en cache
  if (url.hostname.includes('supabase.co')) {
    event.respondWith(fetch(event.request));
    return;
  }

  // HTML et JS → network-first (priorité au réseau, fallback cache)
  if (
    event.request.url.includes('.html') ||
    event.request.url.includes('.js') ||
    url.pathname.endsWith('/chloroquiz/') ||
    url.pathname.endsWith('/chloroquiz')
  ) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // CSS et assets → cache-first
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => caches.match('/chloroquiz/index.html'));
    })
  );
});
