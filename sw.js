// ══════════════════════════════════════════════
//  ChloroQuiz — Service Worker v2
//  Précache automatique de toutes les photos
//  au premier démarrage en ligne
// ══════════════════════════════════════════════

const SW_VERSION   = 'chloroquiz-sw-v2';
const CACHE_SHELL  = 'cq-shell-v2';
const CACHE_IMAGES = 'cq-images-v2';
const CACHE_FONTS  = 'cq-fonts-v2';

// App shell à précacher
const SHELL_URLS = [
  '/chloroquiz/',
  '/chloroquiz/index.html',
  '/chloroquiz/manifest.json',
  '/chloroquiz/icon-192.png',
  '/chloroquiz/icon-512.png',
];

// Toutes les photos des plantes — précachées au démarrage
const PLANT_PHOTOS = [
  "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Lavandula_angustifolia_in_Murato.jpg/480px-Lavandula_angustifolia_in_Murato.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Buxus_sempervirens0.jpg/480px-Buxus_sempervirens0.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Rosa_canina_-_bloom_and_bud.jpg/480px-Rosa_canina_-_bloom_and_bud.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Carpinus_betulus_foliage.jpg/480px-Carpinus_betulus_foliage.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Hosta_sieboldiana.jpg/480px-Hosta_sieboldiana.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Phyllostachys_aurea_03.jpg/480px-Phyllostachys_aurea_03.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Hedera_helix_-_1.jpg/480px-Hedera_helix_-_1.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Thuja_occidentalis_foliage_and_cones.jpg/480px-Thuja_occidentalis_foliage_and_cones.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Achillea_millefolium_20070601.jpg/480px-Achillea_millefolium_20070601.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Forsythia_x_intermedia2.jpg/480px-Forsythia_x_intermedia2.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Prunus_laurocerasus2.jpg/480px-Prunus_laurocerasus2.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Prunus_lusitanica_flowers.jpg/480px-Prunus_lusitanica_flowers.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Berberis_julianae_flowers.jpg/480px-Berberis_julianae_flowers.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Buddleja_davidii0.jpg/480px-Buddleja_davidii0.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Buddleja_globosa_flowers.jpg/480px-Buddleja_globosa_flowers.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Salix_rosmarinifolia_1.jpg/480px-Salix_rosmarinifolia_1.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Thymus_vulgaris_2.jpg/480px-Thymus_vulgaris_2.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Magnolia_grandiflora.jpg/480px-Magnolia_grandiflora.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Magnolia_x_soulangeana.jpg/480px-Magnolia_x_soulangeana.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Magnolia_stellata1.jpg/480px-Magnolia_stellata1.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Cornus_alba_-_Flickr_-_peganum.jpg/480px-Cornus_alba_-_Flickr_-_peganum.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Cornus_sanguinea_fruits.JPG/480px-Cornus_sanguinea_fruits.JPG",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Viburnum_tinus_flowers.jpg/480px-Viburnum_tinus_flowers.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Syringa_vulgaris_Praha_2012_1.jpg/480px-Syringa_vulgaris_Praha_2012_1.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Nandina_domestica.jpg/480px-Nandina_domestica.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Pittosporum_tobira_MS_4276.jpg/480px-Pittosporum_tobira_MS_4276.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Pittosporum_tenuifolium_01.jpg/480px-Pittosporum_tenuifolium_01.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Pittosporum_tenuifolium_Variegatum_02.jpg/480px-Pittosporum_tenuifolium_Variegatum_02.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Agapanthus_africanus_flower.jpg/480px-Agapanthus_africanus_flower.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Arbutus_unedo_flowers_leaves.jpg/480px-Arbutus_unedo_flowers_leaves.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Photinia_x_fraseri_Red_Robin.jpg/480px-Photinia_x_fraseri_Red_Robin.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Cupressocyparis_leylandii.jpg/480px-Cupressocyparis_leylandii.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Elaeagnus_x_ebbingei.jpg/480px-Elaeagnus_x_ebbingei.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Feijoa_sellowiana_flowers.jpg/480px-Feijoa_sellowiana_flowers.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Cortaderia_selloana_in_Jardin_des_Plantes_de_Paris.jpg/480px-Cortaderia_selloana_in_Jardin_des_Plantes_de_Paris.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Osmanthus_burkwoodii_2.jpg/480px-Osmanthus_burkwoodii_2.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Osmanthus_fragrans.jpg/480px-Osmanthus_fragrans.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Euonymus_europaeus_fruits.jpg/480px-Euonymus_europaeus_fruits.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Euonymus_japonicus_2.jpg/480px-Euonymus_japonicus_2.jpg"
];

// ── Installation ──────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_SHELL)
      .then(cache => cache.addAll(SHELL_URLS))
      .then(() => self.skipWaiting())
  );
});

// ── Activation ────────────────────────────────
self.addEventListener('activate', event => {
  const CURRENT = [CACHE_SHELL, CACHE_IMAGES, CACHE_FONTS];
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => !CURRENT.includes(k)).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
      // Précacher les photos en arrière-plan après activation
      .then(() => precachePhotos())
  );
});

// ── Précache photos en arrière-plan ───────────
async function precachePhotos() {
  const cache = await caches.open(CACHE_IMAGES);
  const existing = await cache.keys();
  const cachedUrls = new Set(existing.map(r => r.url));

  let cached = 0, skipped = 0, failed = 0;

  for (const url of PLANT_PHOTOS) {
    if (cachedUrls.has(url)) { skipped++; continue; }
    try {
      const response = await fetch(url, { mode: 'cors' });
      if (response.ok) {
        await cache.put(url, response);
        cached++;
      }
    } catch {
      failed++;
    }
  }

  // Notifier les clients de l'avancement
  const clients = await self.clients.matchAll();
  clients.forEach(client => client.postMessage({
    type: 'photosCached',
    cached, skipped, failed,
    total: PLANT_PHOTOS.length
  }));
}

// ── Interception des requêtes ──────────────────
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // API Supabase → réseau d'abord, cache en fallback
  if (url.hostname.includes('supabase.co')) {
    event.respondWith(networkFirst(event.request));
    return;
  }

  // Google Fonts → cache d'abord
  if (url.hostname.includes('fonts.googleapis.com') ||
      url.hostname.includes('fonts.gstatic.com')) {
    event.respondWith(cacheFirst(event.request, CACHE_FONTS));
    return;
  }

  // Photos plantes + images externes → cache d'abord
  if (url.hostname.includes('upload.wikimedia.org') ||
      url.pathname.match(/\.(jpg|jpeg|png|webp|gif|svg)$/i)) {
    event.respondWith(cacheFirst(event.request, CACHE_IMAGES));
    return;
  }

  // App shell → cache d'abord
  if (url.hostname.includes('anthony4033.github.io')) {
    event.respondWith(cacheFirst(event.request, CACHE_SHELL));
    return;
  }

  // Reste → réseau
  event.respondWith(fetch(event.request).catch(() =>
    caches.match(event.request)
  ));
});

// ── Stratégies ────────────────────────────────
async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response('', { status: 503 });
  }
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_SHELL);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return await caches.match(request) ||
      new Response(JSON.stringify({ error: 'offline' }), {
        headers: { 'Content-Type': 'application/json' }
      });
  }
}

// ── Messages ──────────────────────────────────
self.addEventListener('message', event => {
  if (event.data === 'skipWaiting') self.skipWaiting();
  if (event.data === 'precachePhotos') precachePhotos();
});
