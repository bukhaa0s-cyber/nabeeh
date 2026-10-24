/* Nabeeh — in-app purchase for the iPhone app (App Store). The web version sells activation codes instead.
   One non-consumable product unlocks the full version; with Family Sharing turned on in App Store Connect
   it unlocks for the whole family's Apple devices too. Uses cordova-plugin-purchase (CdvPurchase) inside Capacitor. */
(function(){
"use strict";
const PRODUCT="nabeeh.full";
const native=()=>!!(window.Capacitor&&Capacitor.isNativePlatform&&Capacitor.isNativePlatform());
const ios=()=>native()&&Capacitor.getPlatform()==="ios";
let store=null,ready=false,price="",busy=false;
const listeners=new Set();const emit=()=>listeners.forEach(f=>{try{f();}catch(e){}});

function grant(){if(!NBStore.isPro()||NBStore.S.pro.code==="IAP"){NBStore.setPro({code:"IAP",since:Date.now(),platform:"ios"});}emit();}
function init(){
  if(!ios()||store)return;
  const go=()=>{
    if(!window.CdvPurchase){console.warn("IAP plugin missing");return;}
    const {store:S,ProductType,Platform,LogLevel}=CdvPurchase;store=S;S.verbosity=LogLevel.WARNING;
    S.register([{id:PRODUCT,type:ProductType.NON_CONSUMABLE,platform:Platform.APPLE_APPSTORE}]);
    /* StoreKit verifies the transaction on the device; finishing it unlocks the full version */
    S.when().approved(t=>t.verify()).verified(r=>r.finish()).finished(()=>{grant();busy=false;emit();})
      .productUpdated(p=>{if(p.id===PRODUCT){const o=p.getOffer();price=o&&o.pricingPhases&&o.pricingPhases[0]?o.pricingPhases[0].price:"";if(p.owned)grant();emit();}});
    S.error(e=>{busy=false;console.warn("IAP",e&&e.message);emit();});
    S.initialize([Platform.APPLE_APPSTORE]).then(()=>{ready=true;const p=S.get(PRODUCT);if(p&&p.owned)grant();emit();});
  };
  if(window.CdvPurchase)go();else document.addEventListener("deviceready",go,{once:true});
}
async function buy(){
  if(!store||busy)return;const p=store.get(PRODUCT);const o=p&&p.getOffer();if(!o)return;
  busy=true;emit();const err=await o.order();if(err){busy=false;emit();}
}
async function restore(){if(!store)return;busy=true;emit();try{await store.restorePurchases();}finally{busy=false;const p=store.get(PRODUCT);if(p&&p.owned)grant();emit();}}

window.NBIAP={native,ios,init,buy,restore,get price(){return price;},get ready(){return ready;},get busy(){return busy;},on:f=>{listeners.add(f);return ()=>listeners.delete(f);},PRODUCT};
})();
