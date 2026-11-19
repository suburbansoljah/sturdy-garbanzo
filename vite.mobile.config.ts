import { resolve } from "node:path";
import type { Plugin } from "vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

/** Android WebView drops module scripts marked crossorigin, which leaves a blank screen. */
function androidShellPlugin(): Plugin {
  return {
    name: "android-shell",
    transformIndexHtml(html) {
      return html
        .replace(
          /<script type="module"(?: crossorigin)? src="([^"]+)"><\/script>/g,
          '<script defer src="$1"></script>',
        )
        .replace(/ crossorigin/g, "");
    },
  };
}

/** Cache the built app so the Toughpad keeps working after it leaves the dock. */
function pwaPlugin(): Plugin {
  return {
    name: "mdc-pwa",
    apply: "build",
    generateBundle(_, bundle) {
      const assets = [
        ...new Set([
          "./index.html",
          "./manifest.webmanifest",
          "./icons/icon-192.png",
          "./icons/icon-512.png",
          ...Object.keys(bundle)
            .filter((name) => !name.endsWith(".map"))
            .map((name) => `./${name}`),
        ]),
      ];
      const source = `const CACHE = ${JSON.stringify(`nvsp-${assets.length}-${assets.join("").length}`)};
const SHELL = ${JSON.stringify(assets)};
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
`;
      this.emitFile({ type: "asset", fileName: "sw.js", source });
    },
  };
}

export default defineConfig({
  root: resolve(import.meta.dirname, "mobile"),
  envDir: resolve(import.meta.dirname),
  base: "./",
  plugins: [react(), tailwindcss(), androidShellPlugin(), pwaPlugin()],
  resolve: {
    alias: [
      { find: "@/lib/nrs-api", replacement: resolve(import.meta.dirname, "src/lib/nrs-api.mobile.ts") },
      { find: "@", replacement: resolve(import.meta.dirname, "src") },
    ],
  },
  build: {
    outDir: resolve(import.meta.dirname, "dist-mobile"),
    emptyOutDir: true,
    modulePreload: false,
    target: "es2020",
    assetsInlineLimit: 100000,
  },
});
