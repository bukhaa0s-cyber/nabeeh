/* Nabeeh — what the phone apps sell (v1.6):
     nabeeh.plus   Nabeeh Plus, one-time: unlimited mock tests, the full report, the whole plan, up to 5 children, no ads
     nabeeh.full   Remove Ads, one-time: turns the advertisement off and nothing else
   Everyone who bought Remove Ads before Plus launched (NB_CONFIG.plus.launch), and anyone who ever had the old
   monthly plan (nabeeh.monthly, no longer sold), gets Plus free.
   App Store through StoreKit and Google Play through Play Billing, with cordova-plugin-purchase. */
(function(){
"use strict";
const P=(window.NB_CONFIG&&NB_CONFIG.plus)||{};
const PLUS=P.id||"nabeeh.plus",NOADS=P.noAds||"nabeeh.full",MONTHLY=P.oldMonthly||"nabeeh.monthly";
const LAUNCH=Date.parse((P.launch||"2026-11-22")+"T00:00:00+03:00");
const native=()=>!!(window.NBPlat&&NBPlat.native());
const target=()=>window.NBPlat&&NBPlat.android()?"GOOGLE_PLAY":"APPLE_APPSTORE";
let store=null,ready=false,busy=false;const prices={};
const listeners=new Set();const emit=()=>listeners.forEach(f=>{try{f();}catch(e){}});
const owns=id=>{const p=store&&store.get(id);return !!(p&&p.owned);};
/* every transaction the store knows about on this device, including old and expired ones from the receipt */
function txs(){try{return (store.localReceipts||[]).flatMap(r=>r.transactions||[]);}catch(e){return [];}}
const txOf=id=>txs().filter(t=>(t.products||[]).some(p=>p.id===id));
const time=t=>{const d=t&&t.purchaseDate;return d?+new Date(d):NaN;};

function sync(){
  if(!store||!ready)return;
  const S=NBStore.S,cur=S.pro&&S.pro.code==="IAP"?S.pro:null;
  /* whoever bought Remove Ads in an earlier version already has it saved on the phone, without the v:16 mark */
  const savedBefore=!!(cur&&cur.kind!=="plus"&&!cur.v);
  const noAds=owns(NOADS)||txOf(NOADS).length>0;
  const noAdsEarly=noAds&&(savedBefore||txOf(NOADS).some(t=>time(t)<LAUNCH));
  const monthly=owns(MONTHLY)||txOf(MONTHLY).length>0;
  const legacy=!!(cur&&cur.legacy)||noAdsEarly||monthly;
  const plus=owns(PLUS)||legacy;
  if(plus){
    if(!cur||cur.kind!=="plus"||(legacy&&!cur.legacy)){
      NBStore.setPro({code:"IAP",kind:"plus",v:16,since:cur&&cur.since||Date.now(),platform:NBPlat.plat(),legacy:legacy||undefined});
      if(legacy&&!S.ui.plusThanks){S.ui.plusThanks="due";NBStore.save();}
    }
  }else if(noAds){
    if(!cur||cur.kind!=="noads")NBStore.setPro({code:"IAP",kind:"noads",v:16,since:cur&&cur.since||Date.now(),platform:NBPlat.plat()});
  }else if(cur&&!cur.legacy)NBStore.setPro(null);
  emit();
}
function readPrice(p){const o=p.getOffer();return o&&o.pricingPhases&&o.pricingPhases[0]?o.pricingPhases[0].price:"";}
function init(){
  if(!native()||store)return;
  const go=()=>{
    if(!window.CdvPurchase){console.warn("IAP plugin missing");return;}
    const {store:S,ProductType,Platform,LogLevel}=CdvPurchase;store=S;S.verbosity=LogLevel.WARNING;
    const plat=Platform[target()];
    S.register([{id:PLUS,type:ProductType.NON_CONSUMABLE,platform:plat},{id:NOADS,type:ProductType.NON_CONSUMABLE,platform:plat},
      {id:MONTHLY,type:ProductType.PAID_SUBSCRIPTION,platform:plat}]);
    S.when().approved(t=>t.verify()).verified(r=>r.finish()).finished(()=>{busy=false;sync();})
      .receiptUpdated(()=>sync())
      .productUpdated(p=>{if(p.id===PLUS||p.id===NOADS){prices[p.id]=readPrice(p);emit();}sync();});
    S.error(e=>{busy=false;console.warn("IAP",e&&e.message);emit();});
    S.initialize([plat]).then(()=>{ready=true;sync();});
  };
  if(window.CdvPurchase)go();else document.addEventListener("deviceready",go,{once:true});
}
async function buy(id){
  id=id||PLUS;
  if(!store||busy)return;const p=store.get(id);const o=p&&p.getOffer();if(!o)return;
  busy=true;emit();const err=await o.order();if(err){busy=false;emit();}
}
async function restore(){if(!store)return;busy=true;emit();try{await store.restorePurchases();}finally{busy=false;sync();emit();}}

window.NBIAP={init,buy,restore,sync,get price(){return prices[PLUS]||"";},priceOf:id=>prices[id]||"",get ready(){return ready;},get busy(){return busy;},
  on:f=>{listeners.add(f);return ()=>listeners.delete(f);},PLUS,NOADS,owns:id=>owns(id)};
})();
