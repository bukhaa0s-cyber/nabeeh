/* Nabeeh — offline support. Bump VERSION whenever files change so phones pick up the update. */
const VERSION="nabeeh-v35";
const FILES=["app.html",
 "css/app.css?v=31",
 "js/config.js?v=31",
 "js/core.js?v=31",
 "js/gen-math.js?v=31",
 "js/gen-flex.js?v=31",
 "js/gen-science.js?v=31",
 "js/verbal-en.js?v=31",
 "js/verbal-ar.js?v=31",
 "js/gen-official-verbal.js?v=31",
 "js/gen-official-flex.js?v=31",
 "js/gen-official-scimath.js?v=31",
 "js/bank-more.js?v=31",
 "js/blueprint.js?v=31",
 "js/lessons.js?v=31",
 "js/anim.js?v=31",
 "js/icons.js?v=31",
 "js/fx.js?v=31",
 "js/i18n.js?v=31",
 "js/store.js?v=31",
 "js/cloud.js?v=31",
 "js/engine.js?v=31",
 "js/platform.js?v=31",
 "js/iap.js?v=31",
 "js/ads.js?v=31",
 "js/badges.js?v=31",
 "js/speech.js?v=31",
 "js/notify.js?v=31",
 "js/app.js?v=31",
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
