const CACHE_NAME = 'team-logos-and-headshots';
const DOMAINS_TO_CACHE = [
  'yahoosports-res.cloudinary.com',
  's.yimg.com',
];

const urlsToCache = [
  // Add any static assets you want to cache immediately
];

// Helper function to check if URL should be cached
const shouldCacheUrl = (url) => {
  try {
    const urlObj = new URL(url);
    return DOMAINS_TO_CACHE.some(domain => urlObj.hostname.includes(domain));
  } catch (e) {
    return false;
  }
};

// Install event - cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Fetch event - intercept network requests
self.addEventListener('fetch', event => {
  // Cache images from specific domains OR any request with 'logo' in the URL
  if (shouldCacheUrl(event.request.url) || 
      event.request.url.includes('logo') || 
      event.request.destination === 'image') {
    
    event.respondWith(
      caches.open(CACHE_NAME).then(cache => {
        return cache.match(event.request).then(response => {
          if (response) {
            return response; // Return cached version
          }
          
          // Fetch from network and cache
          return fetch(event.request).then(fetchResponse => {
            // Only cache successful responses
            if (fetchResponse && fetchResponse.status === 200) {
              cache.put(event.request, fetchResponse.clone());
            }
            return fetchResponse;
          }).catch(() => {
            // Return a fallback if network fails and no cache
            return new Response('Image not available', { status: 404 });
          });
        });
      })
    );
  }
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
