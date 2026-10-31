/* Nabeeh — offline support. Bump VERSION whenever files change so phones pick up the update. */
const VERSION="nabeeh-v25";
const FILES=["app.html",
 "css/app.css?v=22",
 "js/config.js?v=22",
 "js/core.js?v=22",
 "js/gen-math.js?v=22",
 "js/gen-flex.js?v=22",
 "js/gen-science.js?v=22",
 "js/verbal-en.js?v=22",
 "js/verbal-ar.js?v=22",
 "js/gen-official-verbal.js?v=22",
 "js/gen-official-flex.js?v=22",
 "js/gen-official-scimath.js?v=22",
 "js/bank-more.js?v=22",
 "js/blueprint.js?v=22",
 "js/lessons.js?v=22",
 "js/fx.js?v=22",
 "js/i18n.js?v=22",
 "js/store.js?v=22",
 "js/cloud.js?v=22",
 "js/engine.js?v=22",
 "js/platform.js?v=22",
 "js/iap.js?v=22",
 "js/ads.js?v=22",
 "js/badges.js?v=22",
 "js/speech.js?v=22",
 "js/notify.js?v=22",
 "js/app.js?v=22",
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
