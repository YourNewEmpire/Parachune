/// <reference types="@sveltejs/kit"
/// <reference types="@sveltejs/kit"
/// <reference lib="webworker"
import { build, files, version } from "$service-worker";

// console.log({ build, files, version });
const CACHE = `cache-${version}`;
const ASSETS = [...build, ...files];

self.addEventListener("install", (event) => {
  async function addFilesToCache() {
    const cache = await caches.open(CACHE);
    await cache.addAll(ASSETS);
  }
  //@ts-ignore
  event.waitUntil(addFilesToCache());
});

self.addEventListener("activate", (event) => {
  async function deleteOldCaches() {
    for (const key of await caches.keys()) {
      if (key != CACHE) {
        await caches.delete(key);
      }
    }
  }
  //@ts-ignore

  event.waitUntil(deleteOldCaches());
});

self.addEventListener("fetch", (event) => {
  //@ts-ignore

  if (event.request.method != "GET") return;

  async function respond() {
    //@ts-ignore

    const url = new URL(event.request.url);
    console.log(url);
  }
  //@ts-ignore
  //   event.respondWith(respond());
});
