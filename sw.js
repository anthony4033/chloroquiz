
// Service Worker amélioré pour ChloroQuiz
const CACHE_NAME = 'chloroquiz-v23';
const urlsToCache = [
  '/',
  '/index-improved.html',
  '/chloroquiz-optimized.css',
  '/chloroquiz-improved.js',
  'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,600;1,700&family=DM+Sans:wght@300;400;500;600;700&family=Nunito:wght@400;500;600;700;800&family=Montserrat:wght@700&display=swap'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Précaching des ressources');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
