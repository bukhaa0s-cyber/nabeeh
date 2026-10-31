/* Nabeeh — offline support. Bump VERSION whenever files change so phones pick up the update. */
const VERSION="nabeeh-v31";
const FILES=["app.html",
 "css/app.css?v=28",
 "js/config.js?v=28",
 "js/core.js?v=28",
 "js/gen-math.js?v=28",
 "js/gen-flex.js?v=28",
 "js/gen-science.js?v=28",
 "js/verbal-en.js?v=28",
 "js/verbal-ar.js?v=28",
 "js/gen-official-verbal.js?v=28",
 "js/gen-official-flex.js?v=28",
 "js/gen-official-scimath.js?v=28",
 "js/bank-more.js?v=28",
 "js/blueprint.js?v=28",
 "js/lessons.js?v=28",
 "js/anim.js?v=28",
 "js/icons.js?v=28",
 "js/fx.js?v=28",
 "js/i18n.js?v=28",
 "js/store.js?v=28",
 "js/cloud.js?v=28",
 "js/engine.js?v=28",
 "js/platform.js?v=28",
 "js/iap.js?v=28",
 "js/ads.js?v=28",
 "js/badges.js?v=28",
 "js/speech.js?v=28",
 "js/notify.js?v=28",
 "js/app.js?v=28",
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
