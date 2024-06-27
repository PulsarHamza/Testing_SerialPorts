const CACHE_NAME = "xml-cache-v1";
const urlsToCache = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./sample.xml", // Path to your XML file
];

// Install event
self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)));
  self.console.log("Installed!");
});

// Fetch event
self.addEventListener("fetch", (event) => {
  const requestUrl = new URL(event.request.url);

  if (requestUrl.pathname.endsWith("./sample.xml")) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response) {
            self.console.log("From cache!");
            return response;
          } else {
            return fetch(event.request).then((networkResponse) => {
              cache.put(event.request, networkResponse.clone());
              self.console.log("Network response!");
              return networkResponse;
            });
          }
        });
      })
    );
  } else {
    event.respondWith(
      caches.match(event.request).then((response) => {
        self.console.log("Path URL not match!");
        return response || fetch(event.request);
      })
    );
  }
});
