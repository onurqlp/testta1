// AYDA ÖSD A1 demo v0.6: offline read/listen best-effort cache; no personal data uploaded.
const CACHE='ayda-a1-demo-v6-static';
const AUDIO=[
 '/audio/alltag-01-aufgabe1.mp3','/audio/alltag-01-aufgabe2.mp3','/audio/alltag-01-aufgabe3.mp3',
 '/audio/unterwegs-02-aufgabe1.mp3','/audio/unterwegs-02-aufgabe2.mp3','/audio/unterwegs-02-aufgabe3.mp3'
];
self.addEventListener('install',event=>{
 event.waitUntil((async()=>{
  const cache=await caches.open(CACHE);
  await Promise.allSettled(['/',...AUDIO].map(url=>cache.add(url)));
  await self.skipWaiting();
 })());
});
self.addEventListener('activate',event=>{
 event.waitUntil((async()=>{
  for(const name of await caches.keys())if(name.startsWith('ayda-a1-demo-')&&name!==CACHE)await caches.delete(name);
  await self.clients.claim();
 })());
});
self.addEventListener('fetch',event=>{
 const r=event.request;
 if(r.method!=='GET'||new URL(r.url).origin!==self.location.origin)return;
 const url=new URL(r.url);
 const isAudio=url.pathname.startsWith('/audio/')&&url.pathname.endsWith('.mp3');
 const isAsset=url.pathname.startsWith('/assets/');
 const isNav=r.mode==='navigate';
 if(!(isAudio||isAsset||isNav))return;
 event.respondWith((async()=>{
  const cache=await caches.open(CACHE);
  if(isAudio&&r.headers.has('range'))return fetch(r); // avoid caching partial audio as a complete file
  const hit=await cache.match(r);
  if((isAudio||isAsset)&&hit)return hit;
  try {
    const response=await fetch(r);
    if(response.ok&&response.type==='basic')await cache.put(r,response.clone());
    return response;
  }catch{
    if(hit)return hit;
    if(isNav){const cached=await cache.match('/');if(cached)return cached;}
    return new Response('Çevrim dışı: içerik henüz indirilmedi.',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}});
  }
 })());
});
