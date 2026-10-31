/* Nabeeh — offline support. Bump VERSION whenever files change so phones pick up the update. */
const VERSION="nabeeh-v23";
const FILES=["app.html",
 "css/app.css?v=20",
 "js/config.js?v=20",
 "js/core.js?v=20",
 "js/gen-math.js?v=20",
 "js/gen-flex.js?v=20",
 "js/gen-science.js?v=20",
 "js/verbal-en.js?v=20",
 "js/verbal-ar.js?v=20",
 "js/gen-official-verbal.js?v=20",
 "js/gen-official-flex.js?v=20",
 "js/gen-official-scimath.js?v=20",
 "js/bank-more.js?v=20",
 "js/blueprint.js?v=20",
 "js/fx.js?v=20",
 "js/i18n.js?v=20",
 "js/store.js?v=20",
 "js/cloud.js?v=20",
 "js/engine.js?v=20",
 "js/platform.js?v=20",
 "js/iap.js?v=20",
 "js/ads.js?v=20",
 "js/badges.js?v=20",
 "js/speech.js?v=20",
 "js/notify.js?v=20",
 "js/app.js?v=20",
 "img/logo.svg",
 "img/icon-192.png",
 "img/icon-512.png",
 "manifest.webmanifest"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()));});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener("fetch",e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=="GET"||u.origin!==location.origin)return;           /* Firebase and fonts go to the network */
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{const c=res.clone();caches.open(VERSION).then(x=>x.put(e.request,c));return res;}).catch(()=>caches.match("app.html"))));
});
