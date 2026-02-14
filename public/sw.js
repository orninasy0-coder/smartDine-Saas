// Service Worker for SmartDine PWA
const CACHE_NAME = 'smartdine-v1';
const RUNTIME_CACHE = 'smartdine-runtime-v1';
const IMAGE_CACHE = 'smartdine-images-v1';
const API_CACHE = 'smartdine-api-v1';

// Cache size limits
const MAX_RUNTIME_CACHE_SIZE = 50;
const MAX_IMAGE_CACHE_SIZE = 60;
const MAX_API_CACHE_SIZE = 30;

// Cache expiration times (in milliseconds)
const CACHE_EXPIRATION = {
  images: 7 * 24 * 60 * 60 * 1000, // 7 days
  api: 5 * 60 * 1000, // 5 minutes
  runtime: 24 * 60 * 60 * 1000, // 1 day
};

// Assets to cache on install
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/vite.svg',
];

// Install event - cache essential assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Precaching assets');
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter(
            (name) =>
              name !== CACHE_NAME &&
              name !== RUNTIME_CACHE &&
              name !== IMAGE_CACHE &&
              name !== API_CACHE
          )
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    })
  );
  self.clients.claim();
});

// Helper: Check if cache entry is expired
const isCacheExpired = (response, maxAge) => {
  if (!response) return true;
  
  const cachedTime = response.headers.get('sw-cache-time');
  if (!cachedTime) return true;
  
  const age = Date.now() - parseInt(cachedTime, 10);
  return age > maxAge;
};

// Helper: Add timestamp to cached response
const addCacheTimestamp = (response) => {
  const clonedResponse = response.clone();
  const headers = new Headers(clonedResponse.headers);
  headers.set('sw-cache-time', Date.now().toString());
  
  return clonedResponse.blob().then((body) => {
    return new Response(body, {
      status: clonedResponse.status,
      statusText: clonedResponse.statusText,
      headers: headers,
    });
  });
};

// Helper: Limit cache size
const limitCacheSize = async (cacheName, maxSize) => {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  
  if (keys.length > maxSize) {
    // Delete oldest entries
    const deleteCount = keys.length - maxSize;
    for (let i = 0; i < deleteCount; i++) {
      await cache.delete(keys[i]);
    }
  }
};

// Fetch event - smart caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // API requests - Network first with short-lived cache fallback
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then(async (response) => {
          if (response.ok) {
            const cache = await caches.open(API_CACHE);
            const responseWithTimestamp = await addCacheTimestamp(response);
            cache.put(request, responseWithTimestamp.clone());
            limitCacheSize(API_CACHE, MAX_API_CACHE_SIZE);
            return responseWithTimestamp;
          }
          return response;
        })
        .catch(async () => {
          // Fallback to cache if offline
          const cachedResponse = await caches.match(request);
          if (cachedResponse && !isCacheExpired(cachedResponse, CACHE_EXPIRATION.api)) {
            console.log('[SW] Serving stale API data from cache:', url.pathname);
            return cachedResponse;
          }
          
          // Return offline response
          return new Response(
            JSON.stringify({ 
              error: 'Offline', 
              message: 'No network connection available' 
            }),
            {
              status: 503,
              statusText: 'Service Unavailable',
              headers: { 'Content-Type': 'application/json' },
            }
          );
        })
    );
    return;
  }

  // Navigation requests - Network first with cache fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(async (response) => {
          if (response.ok) {
            const cache = await caches.open(RUNTIME_CACHE);
            const responseWithTimestamp = await addCacheTimestamp(response);
            cache.put(request, responseWithTimestamp.clone());
            limitCacheSize(RUNTIME_CACHE, MAX_RUNTIME_CACHE_SIZE);
            return responseWithTimestamp;
          }
          return response;
        })
        .catch(async () => {
          // Try cache first
          const cachedResponse = await caches.match(request);
          if (cachedResponse) {
            return cachedResponse;
          }
          
          // Fallback to index.html for SPA routing
          const indexResponse = await caches.match('/index.html');
          if (indexResponse) {
            return indexResponse;
          }
          
          // Last resort: offline page
          return new Response(
            `<!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Offline - SmartDine</title>
              <style>
                body {
                  font-family: system-ui, -apple-system, sans-serif;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  min-height: 100vh;
                  margin: 0;
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                  color: white;
                  text-align: center;
                  padding: 20px;
                }
                .container {
                  max-width: 500px;
                }
                h1 { font-size: 3rem; margin: 0 0 1rem; }
                p { font-size: 1.2rem; opacity: 0.9; }
                button {
                  margin-top: 2rem;
                  padding: 12px 24px;
                  font-size: 1rem;
                  background: white;
                  color: #667eea;
                  border: none;
                  border-radius: 8px;
                  cursor: pointer;
                  font-weight: 600;
                }
                button:hover { transform: scale(1.05); }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>📡</h1>
                <h1>You're Offline</h1>
                <p>Please check your internet connection and try again.</p>
                <button onclick="window.location.reload()">Retry</button>
              </div>
            </body>
            </html>`,
            {
              status: 503,
              statusText: 'Service Unavailable',
              headers: { 'Content-Type': 'text/html' },
            }
          );
        })
    );
    return;
  }

  // Images - Cache first with network fallback
  if (request.destination === 'image') {
    event.respondWith(
      caches.match(request).then(async (cachedResponse) => {
        // Return cached if not expired
        if (cachedResponse && !isCacheExpired(cachedResponse, CACHE_EXPIRATION.images)) {
          return cachedResponse;
        }

        // Fetch from network
        return fetch(request)
          .then(async (response) => {
            if (response.ok) {
              const cache = await caches.open(IMAGE_CACHE);
              const responseWithTimestamp = await addCacheTimestamp(response);
              cache.put(request, responseWithTimestamp.clone());
              limitCacheSize(IMAGE_CACHE, MAX_IMAGE_CACHE_SIZE);
              return responseWithTimestamp;
            }
            return response;
          })
          .catch(() => {
            // Return cached even if expired when offline
            if (cachedResponse) {
              return cachedResponse;
            }
            
            // Return placeholder image
            return new Response(
              '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect fill="#f0f0f0" width="400" height="300"/><text x="50%" y="50%" text-anchor="middle" fill="#999" font-family="sans-serif" font-size="18">Image Unavailable</text></svg>',
              {
                headers: { 'Content-Type': 'image/svg+xml' },
              }
            );
          });
      })
    );
    return;
  }

  // Static assets (CSS, JS, fonts) - Cache first
  if (
    request.destination === 'font' ||
    request.destination === 'style' ||
    request.destination === 'script'
  ) {
    event.respondWith(
      caches.match(request).then(async (cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(request).then(async (response) => {
          if (response.ok) {
            const cache = await caches.open(RUNTIME_CACHE);
            cache.put(request, response.clone());
            limitCacheSize(RUNTIME_CACHE, MAX_RUNTIME_CACHE_SIZE);
          }
          return response;
        });
      })
    );
    return;
  }

  // Default: Network first with cache fallback
  event.respondWith(
    fetch(request)
      .then(async (response) => {
        if (response.ok) {
          const cache = await caches.open(RUNTIME_CACHE);
          const responseWithTimestamp = await addCacheTimestamp(response);
          cache.put(request, responseWithTimestamp.clone());
          limitCacheSize(RUNTIME_CACHE, MAX_RUNTIME_CACHE_SIZE);
          return responseWithTimestamp;
        }
        return response;
      })
      .catch(async () => {
        const cachedResponse = await caches.match(request);
        return cachedResponse || new Response('Offline', { status: 503 });
      })
  );
});

// Handle messages from clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((name) => caches.delete(name))
        );
      }).then(() => {
        event.ports[0].postMessage({ success: true });
      })
    );
  }
  
  if (event.data && event.data.type === 'GET_CACHE_SIZE') {
    event.waitUntil(
      Promise.all([
        caches.open(CACHE_NAME).then(cache => cache.keys()),
        caches.open(RUNTIME_CACHE).then(cache => cache.keys()),
        caches.open(IMAGE_CACHE).then(cache => cache.keys()),
        caches.open(API_CACHE).then(cache => cache.keys()),
      ]).then(([precache, runtime, images, api]) => {
        event.ports[0].postMessage({
          precache: precache.length,
          runtime: runtime.length,
          images: images.length,
          api: api.length,
          total: precache.length + runtime.length + images.length + api.length,
        });
      })
    );
  }
});

// Background sync for offline actions (if supported)
if ('sync' in self.registration) {
  self.addEventListener('sync', (event) => {
    console.log('[SW] Background sync triggered:', event.tag);
    
    if (event.tag === 'sync-orders') {
      event.waitUntil(syncOfflineOrders());
    }
  });
}

// Sync offline orders when back online
async function syncOfflineOrders() {
  try {
    // Get pending orders from IndexedDB or cache
    // This is a placeholder - implement based on your needs
    console.log('[SW] Syncing offline orders...');
    
    // Notify clients that sync is complete
    const clients = await self.clients.matchAll();
    clients.forEach((client) => {
      client.postMessage({
        type: 'SYNC_COMPLETE',
        tag: 'sync-orders',
      });
    });
  } catch (error) {
    console.error('[SW] Sync failed:', error);
    throw error; // Retry sync
  }
}

// Periodic background sync (if supported)
if ('periodicSync' in self.registration) {
  self.addEventListener('periodicsync', (event) => {
    console.log('[SW] Periodic sync triggered:', event.tag);
    
    if (event.tag === 'update-menu') {
      event.waitUntil(updateMenuCache());
    }
  });
}

// Update menu cache periodically
async function updateMenuCache() {
  try {
    console.log('[SW] Updating menu cache...');
    // Fetch latest menu data
    // This is a placeholder - implement based on your needs
  } catch (error) {
    console.error('[SW] Menu update failed:', error);
  }
}

console.log('[SW] Service Worker loaded successfully');
