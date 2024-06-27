self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("v1").then((cache) => cache.addAll(["./", "./index.html", "./style.css", "./app.js", "./sample.xml"]))
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.url.endsWith("./sample.xml")) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        if (response) {
          self.console.log("Serving from cache:", event.request.url);
          return response;
        } else {
          self.console.log("Fetching from network:", event.request.url);
          return fetch(event.request).then((networkResponse) => {
            return caches.open("v1").then((cache) => {
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            });
          });
        }
      })
    );
  }
});
