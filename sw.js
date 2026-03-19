/* ══════════════════════════════════════════════════════
   ChloroQuiz — Service Worker
   Version: 2026-03-19-v29c
══════════════════════════════════════════════════════ */

const CACHE_NAME = 'chloroquiz-v29c';

// Fichiers à mettre en cache immédiatement
const PRECACHE_ASSETS = [
  '/chloroquiz/',
  '/chloroquiz/index.html',
  '/chloroquiz/chloroquiz.css',
  '/chloroquiz/chloroquiz.js',
];

// ── Installation : précache des assets statiques ──
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[SW] Précache des assets statiques');
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// ── Activation : nettoyage des anciens caches ──
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE_NAME)
          .map(k => { console.log('[SW] Suppression ancien cache:', k); return caches.delete(k); })
      )
    ).then(() => self.clients.claim())
  );
});

// ── Fetch : cache-first pour les assets statiques, network-first pour Supabase ──
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Requêtes Supabase → toujours réseau
  if (url.hostname.includes('supabase.co')) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Assets statiques → cache-first
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        // Mettre en cache les nouvelles ressources statiques
        if (response.ok && (
          event.request.url.includes('.css') ||
          event.request.url.includes('.js') ||
          event.request.url.includes('.html') ||
          event.request.url.includes('.png') ||
          event.request.url.includes('.jpg') ||
          event.request.url.includes('.webp')
        )) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => caches.match('/chloroquiz/index.html'));
    })
  );
});
