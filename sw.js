const CACHE='nova-english-v3-1-audit-20261031';
const CORE=['./','./index.html','./manifest.webmanifest'];
const OPTIONAL=['./icons/icon-192.png','./icons/icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil((async()=>{const c=await caches.open(CACHE);await c.addAll(CORE);await Promise.all(OPTIONAL.map(u=>c.add(u).catch(()=>{})));await self.skipWaiting()})())});
self.addEventListener('activate',e=>{e.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.filter(k=>k.startsWith('nova-english-')&&k!==CACHE).map(k=>caches.delete(k)));await self.clients.claim()})())});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||new URL(e.request.url).origin!==self.location.origin)return;
if(e.request.mode==='navigate'){e.respondWith(fetch(e.request,{cache:'no-store'}).then(r=>{if(r.ok&&new URL(e.request.url).pathname.endsWith('/index.html')||r.ok&&new URL(e.request.url).pathname.endsWith('/nova-english/')){const copy=r.clone();e.waitUntil(caches.open(CACHE).then(c=>c.put('./index.html',copy)))}return r}).catch(()=>caches.match('./index.html')));return}
e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request).then(r=>{if(r.ok){const copy=r.clone();e.waitUntil(caches.open(CACHE).then(c=>c.put(e.request,copy)))}return r}))) });
