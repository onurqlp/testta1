// AYDA ÖSD A1 demo v0.12: offline cache is strictly same-origin and contains no personal records.
// Index navigation uses network-first so an updated web demo does not remain stuck on an old build.
const CACHE='ayda-a1-demo-v12-brand';
const GUIDE=['/rehber/a1/','/rehber/a1/index.html','/rehber/a1/content.js','/rehber/a1/app.js','/rehber/a1/style.css','/rehber/a1/ux-review.css','/rehber/a1/ux-review.js','/rehber/a1/ayda-brand.css','/branding/ayda-logo.png'];
const AUDIO=[
 '/audio/alltag-01-aufgabe1.mp3','/audio/alltag-01-aufgabe2.mp3','/audio/alltag-01-aufgabe3.mp3',
 '/audio/unterwegs-02-aufgabe1.mp3','/audio/unterwegs-02-aufgabe2.mp3','/audio/unterwegs-02-aufgabe3.mp3'
];
const OFFLINE_TEXT='İnternet bağlantısı yok. Önce çevrim içi açılan dersler ve sesler kullanılabilir.';
self.addEventListener('install',event=>{
 event.waitUntil((async()=>{
  const cache=await caches.open(CACHE);
  await Promise.allSettled(['/',...AUDIO,...GUIDE].map(url=>cache.add(url)));
  await self.skipWaiting();
 })());
});
self.addEventListener('activate',event=>{
 event.waitUntil((async()=>{
  for(const name of await caches.keys())if(name.startsWith('ayda-a1-demo-')&&name!==CACHE)await caches.delete(name);
  await self.clients.claim();
 })());
});
const isOK=response=>response.ok&&response.type==='basic';
const offline=()=>new Response(OFFLINE_TEXT,{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}});
async function fromCachedRange(request,cache){
 const full=await cache.match(new URL(request.url).pathname);
 if(!full)return undefined;
 const data=await full.arrayBuffer();
 const length=data.byteLength;
 const match=/^bytes=(\d*)-(\d*)$/.exec(request.headers.get('range')||'');
 if(!match)return full;
 const suffix=match[1]===''?Number(match[2]):null;
 const start=suffix!==null?Math.max(0,length-suffix):Number(match[1]);
 const end=match[1]===''?length-1:(match[2]?Math.min(length-1,Number(match[2])):length-1);
 if(!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||start>=length||start>end)
  return new Response(null,{status:416,headers:{'Content-Range':'bytes */'+length}});
 return new Response(data.slice(start,end+1),{status:206,headers:{
  'Content-Type':full.headers.get('content-type')||'audio/mpeg',
  'Content-Range':'bytes '+start+'-'+end+'/'+length,
  'Content-Length':String(end-start+1),
  'Accept-Ranges':'bytes'
 }});
}
self.addEventListener('fetch',event=>{
 const r=event.request;
 if(r.method!=='GET')return;
 const url=new URL(r.url);
 if(url.origin!==self.location.origin)return;
 const audio=url.pathname.startsWith('/audio/')&&url.pathname.endsWith('.mp3');
 const asset=url.pathname.startsWith('/assets/')||url.pathname.startsWith('/branding/');
 const nav=r.mode==='navigate';
 const guideAsset=url.pathname.startsWith('/rehber/a1/')&&/\.(?:js|css)$/.test(url.pathname);
 const guideNav=nav&&url.pathname.startsWith('/rehber/a1/');
 if(!(audio||asset||nav||guideAsset))return;
 event.respondWith((async()=>{
  const cache=await caches.open(CACHE);
  if(audio&&r.headers.has('range')){
   try{return await fetch(r)}
   catch{return (await fromCachedRange(r,cache))||offline()}
  }
  const hit=await cache.match(r);
  if((audio||asset||guideAsset)&&hit)return hit;
  try{
   const response=await fetch(r);
   if(isOK(response))await cache.put(nav?(guideNav?'/rehber/a1/':'/'):r,response.clone());
   return response;
  }catch{
   if(hit)return hit;
   if(nav)return (await cache.match(guideNav?'/rehber/a1/':'/'))||offline();
   return offline();
  }
 })());
});
