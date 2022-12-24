const OFFLINE_VERSION = 1;
const CACHE_NAME = "render_piston_offline";
const OFFLINE_URL = "/piston/index.html";

self.addEventListener("install", (evt) => {
  evt.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.add(new Request(OFFLINE_URL, {cache: "reload"}));
  })());
});

self.addEventListener("activate", (evt) => {
  evt.waitUntil((async () => {
    if ("navigationPreload" in self.registration) {
      await self.registration.navigationPreload.enable();
    }
  })());
  self.clients.claim();
});
