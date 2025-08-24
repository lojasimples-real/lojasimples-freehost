/// <reference lib="webworker" />
const CACHE_NAME = "loja-simples-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/logo192.png",
  "/logo512.png"
];

self.addEventListener("install", (event) => {
  console.log("[Service Worker] Install Event processing");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Caching all: app shell and content");
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", (event) => {
  console.log(`[Service Worker] Fetching resource: ${event.request.url}`);
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).then((response) => {
        return caches.open(CACHE_NAME).then((cache) => {
          console.log(`[Service Worker] Caching new resource: ${event.request.url}`);
          cache.put(event.request, response.clone());
          return response;
        });
      });
    })
  );
});

self.addEventListener("activate", (event) => {
  console.log("[Service Worker] Activate Event processing");
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(
        keyList.map((key) => {
          if (!cacheWhitelist.includes(key)) {
            console.log(`[Service Worker] Deleting cache: ${key}`);
            return caches.delete(key);
          }
        })
      )
    )
  );
});