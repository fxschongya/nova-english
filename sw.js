const CACHE='nova-english-v3-import-2';
const CORE=['./','./index.html','./manifest.webmanifest'];
const OPTIONAL=['./icons/icon-192.png','./icons/icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil((async()=>{const c=await caches.open(CACHE);await c.addAll(CORE);await Promise.all(OPTIONAL.map(a=>c.add(a).catch(()=>{})));await self.skipWaiting()})())});
self.addEventListener('activate',e=>{e.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.filter(k=>k.startsWith('nova-english-')&&k!==CACHE).map(k=>caches.delete(k)));await self.clients.claim()})())});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||new URL(e.request.url).origin!==self.location.origin)return;
if(e.request.mode==='navigate'){e.respondWith(fetch(e.request).then(r=>{if(r.ok){const copy=r.clone();caches.open(CACHE).then(c=>c.put('./index.html',copy))}return r}).catch(()=>caches.match('./index.html')));return}
e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request).then(r=>{if(r.ok){const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy))}return r})))});
