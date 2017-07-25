self.addEventListener('install', event => {
  event.waitUntil(
    caches
      .open('app-v1')
      .then(cache => {
        return cache.addAll([
          '/manifest.json',
          '/index.html',
          '/index.js',
          '/cat.png'
        ])
      })
      .catch(error => {
        console.log(error);
      })
  )
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches
      .match(event.request)
      .then(response => {
        if (response === undefined) {
          return fetch(event.request);
        }
        return response;
      })
      .catch(error => {
        // /index.html is initiating requests to other assets
        const url = new URL(event.request.url);
        if (url.pathname === '/') {
          return caches.match('/index.html');
        }
      })
  )
});