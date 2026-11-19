const CACHE = "nvsp-6-127";
const SHELL = ["./index.html","./manifest.webmanifest","./icons/icon-192.png","./icons/icon-512.png","./assets/index-DQ2WIll8.js","./assets/index-CdDo5uYK.css"];
self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE && key !== "nrs-live").map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});
self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin === "https://www.leg.state.nv.us") {
    event.respondWith(networkThenCache(request, "nrs-live"));
    return;
  }
  if (url.origin !== self.location.origin) return;
  if (request.mode === "navigate") {
    event.respondWith(openApp(request));
    return;
  }
  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request).then((response) => {
      if (response.ok) caches.open(CACHE).then((cache) => cache.put(request, response.clone()));
      return response;
    })),
  );
});
function networkThenCache(request, name) {
  return fetch(request).then((response) => {
    if (response.ok) caches.open(name).then((cache) => cache.put(request, response.clone()));
    return response;
  }).catch(async () => (await caches.match(request)) || new Response("Offline", { status: 503, headers: { "content-type": "text/plain" } }));
}
async function openApp(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE);
      cache.put("./index.html", response.clone());
    }
    return response;
  } catch {
    return (await caches.match("./index.html")) || new Response("Offline", { status: 503, headers: { "content-type": "text/plain" } });
  }
}
