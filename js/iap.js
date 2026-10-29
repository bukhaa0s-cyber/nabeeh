/* Nabeeh — the one thing the phone apps sell: removing the advertisement.
   Every question, mock test and report is free; this purchase only turns advertising off,
   on the App Store with StoreKit and on Google Play with Play Billing, through cordova-plugin-purchase. */
(function(){
"use strict";
const NOADS="nabeeh.full";
const native=()=>!!(window.NBPlat&&NBPlat.native());
const target=()=>window.NBPlat&&NBPlat.android()?"GOOGLE_PLAY":"APPLE_APPSTORE";
let store=null,ready=false,busy=false,price="";
const listeners=new Set();const emit=()=>listeners.forEach(f=>{try{f();}catch(e){}});
const owns=()=>{const p=store&&store.get(NOADS);return !!(p&&p.owned);};
const bought=()=>!!(NBStore.S.pro&&NBStore.S.pro.code);

function sync(){
  if(!store||!ready)return;
  if(owns()){if(!bought())NBStore.setPro({code:"IAP",since:Date.now(),platform:NBPlat.plat(),kind:"noads"});}
  else if(bought()&&NBStore.S.pro.code==="IAP")NBStore.setPro(null);
  emit();
}
function init(){
  if(!native()||store)return;
  const go=()=>{
    if(!window.CdvPurchase){console.warn("IAP plugin missing");return;}
    const {store:S,ProductType,Platform,LogLevel}=CdvPurchase;store=S;S.verbosity=LogLevel.WARNING;
    const plat=Platform[target()];
    S.register([{id:NOADS,type:ProductType.NON_CONSUMABLE,platform:plat}]);
    S.when().approved(t=>t.verify()).verified(r=>r.finish()).finished(()=>{busy=false;sync();})
      .productUpdated(p=>{if(p.id===NOADS){const o=p.getOffer();price=o&&o.pricingPhases&&o.pricingPhases[0]?o.pricingPhases[0].price:"";sync();emit();}});
    S.error(e=>{busy=false;console.warn("IAP",e&&e.message);emit();});
    S.initialize([plat]).then(()=>{ready=true;sync();});
  };
  if(window.CdvPurchase)go();else document.addEventListener("deviceready",go,{once:true});
}
async function buy(){
  if(!store||busy)return;const p=store.get(NOADS);const o=p&&p.getOffer();if(!o)return;
  busy=true;emit();const err=await o.order();if(err){busy=false;emit();}
}
async function restore(){if(!store)return;busy=true;emit();try{await store.restorePurchases();}finally{busy=false;sync();emit();}}

window.NBIAP={init,buy,restore,sync,get price(){return price;},get ready(){return ready;},get busy(){return busy;},
  on:f=>{listeners.add(f);return ()=>listeners.delete(f);},NOADS};
})();
