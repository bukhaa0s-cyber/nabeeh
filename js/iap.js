/* Nabeeh — in-app purchase for the phone apps (App Store on iPhone, Google Play on Android). The web version sells activation codes instead.
   One non-consumable product unlocks the full version; a monthly subscription unlocks it while active.
   On iPhone, Family Sharing (turned on in App Store Connect) also unlocks it for the family's Apple devices.
   Uses cordova-plugin-purchase (CdvPurchase) inside Capacitor. */
(function(){
"use strict";
const LIFE="nabeeh.full",MONTH="nabeeh.monthly";
const native=()=>!!(window.Capacitor&&Capacitor.isNativePlatform&&Capacitor.isNativePlatform());
const plat=()=>native()?Capacitor.getPlatform():null;          /* "ios" | "android" | null */
const ios=()=>plat()==="ios";
const android=()=>plat()==="android";
let store=null,ready=false,busy=false;const prices={};
const listeners=new Set();const emit=()=>listeners.forEach(f=>{try{f();}catch(e){}});
const owns=id=>{const p=store&&store.get(id);return !!(p&&p.owned);};
/* entitlement = lifetime purchase OR an active monthly subscription; an expired subscription switches the full version off again */
function sync(){
  if(!store||!ready)return;
  const on=owns(LIFE)||owns(MONTH);
  if(on){if(!NBStore.isPro()||NBStore.S.pro.code==="IAP"){NBStore.setPro({code:"IAP",since:(NBStore.S.pro&&NBStore.S.pro.since)||Date.now(),platform:plat(),kind:owns(LIFE)?"life":"month"});}}
  else if(NBStore.isPro()&&NBStore.S.pro.code==="IAP"){NBStore.setPro(null);}
  emit();
}
function init(){
  if(!native()||store)return;
  const go=()=>{
    if(!window.CdvPurchase){console.warn("IAP plugin missing");return;}
    const {store:S,ProductType,Platform,LogLevel}=CdvPurchase;store=S;S.verbosity=LogLevel.WARNING;
    const target=android()?Platform.GOOGLE_PLAY:Platform.APPLE_APPSTORE;
    S.register([{id:LIFE,type:ProductType.NON_CONSUMABLE,platform:target},{id:MONTH,type:ProductType.PAID_SUBSCRIPTION,platform:target}]);
    /* the store verifies the transaction on the device; finishing it unlocks the full version */
    S.when().approved(t=>t.verify()).verified(r=>r.finish()).finished(()=>{busy=false;sync();})
      .productUpdated(p=>{if(p.id===LIFE||p.id===MONTH){const o=p.getOffer();prices[p.id]=o&&o.pricingPhases&&o.pricingPhases[0]?o.pricingPhases[0].price:"";sync();emit();}});
    S.error(e=>{busy=false;console.warn("IAP",e&&e.message);emit();});
    S.initialize([target]).then(()=>{ready=true;sync();});
  };
  if(window.CdvPurchase)go();else document.addEventListener("deviceready",go,{once:true});
}
async function buy(id){
  if(!store||busy)return;const p=store.get(id);const o=p&&p.getOffer();if(!o)return;
  busy=true;emit();const err=await o.order();if(err){busy=false;emit();}
}
async function restore(){if(!store)return;busy=true;emit();try{await store.restorePurchases();}finally{busy=false;sync();emit();}}

window.NBIAP={native,plat,ios,android,init,buy,restore,sync,price:id=>prices[id]||"",get ready(){return ready;},get busy(){return busy;},on:f=>{listeners.add(f);return ()=>listeners.delete(f);},LIFE,MONTH};
})();
