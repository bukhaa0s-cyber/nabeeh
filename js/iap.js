/* Nabeeh — what the phone apps sell (v1.7): one thing.
     nabeeh.plus   Nabeeh Plus, one-time: everything unlimited, the full report, the whole plan, up to 5 children, no ads
   Remove Ads (nabeeh.full) is no longer sold on its own. Everyone who ever bought it, and anyone who ever had the
   old monthly plan (nabeeh.monthly), has Plus.
   App Store through StoreKit and Google Play through Play Billing, with cordova-plugin-purchase.

   What is saved on the phone is the record of the purchase. On the iPhone the store only tells the app about a
   finished purchase at the moment it is bought or restored, not on later starts, so "the store did not mention it"
   never takes a purchase away. */
(function(){
"use strict";
const P=(window.NB_CONFIG&&NB_CONFIG.plus)||{};
const PLUS=P.id||"nabeeh.plus",NOADS=P.noAds||"nabeeh.full",MONTHLY=P.oldMonthly||"nabeeh.monthly";
const native=()=>!!(window.NBPlat&&NBPlat.native());
const target=()=>window.NBPlat&&NBPlat.android()?"GOOGLE_PLAY":"APPLE_APPSTORE";
let store=null,ready=false,busy=false;const prices={};
const listeners=new Set();const emit=()=>listeners.forEach(f=>{try{f();}catch(e){}});
const owns=id=>{const p=store&&store.get(id);return !!(p&&p.owned);};
/* every transaction the store knows about on this device, including old and expired ones from the receipt */
function txs(){try{return (store.localReceipts||[]).flatMap(r=>r.transactions||[]);}catch(e){return [];}}
const txOf=id=>txs().filter(t=>(t.products||[]).some(p=>p.id===id));

function sync(){
  if(!store||!ready)return;
  const S=NBStore.S,cur=S.pro&&S.pro.code==="IAP"?S.pro:null;
  const old=owns(NOADS)||txOf(NOADS).length>0||owns(MONTHLY)||txOf(MONTHLY).length>0;   /* paid before Plus was the only product */
  const wasNoAds=!!(cur&&cur.kind!=="plus");                                            /* saved by a version that sold Remove Ads */
  const legacy=!!(cur&&cur.legacy)||old||wasNoAds;
  if(owns(PLUS)||legacy){
    if(!cur||cur.kind!=="plus"||(legacy&&!cur.legacy)){
      NBStore.setPro({code:"IAP",kind:"plus",v:17,since:cur&&cur.since||Date.now(),platform:NBPlat.plat(),legacy:legacy||undefined});
      if(legacy&&!S.ui.plusThanks){S.ui.plusThanks="due";NBStore.save();}
    }
  }
  /* nothing is ever taken away here: a store that is offline, slow or silent must not cost a family what it paid for */
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
      .productUpdated(p=>{if(p.id===PLUS||p.id===NOADS){prices[p.id]=readPrice(p);
        if(p.id===PLUS&&prices[p.id]&&!NBStore.S.ui.plusSeen){NBStore.S.ui.plusSeen=1;NBStore.save();}emit();}sync();});
    S.error(e=>{busy=false;console.warn("IAP",e&&e.message);emit();});
    S.initialize([plat]).then(()=>{ready=true;sync();});
  };
  if(window.CdvPurchase)go();else document.addEventListener("deviceready",go,{once:true});
}
async function buy(id){
  id=id||PLUS;
  if(!store||busy)return false;const p=store.get(id);const o=p&&p.getOffer();if(!o)return false;
  busy=true;emit();const err=await o.order();if(err){busy=false;emit();}
  return true;
}
/* the restored purchases reach the store object a moment after the store says it is done, so wait for them
   before telling the parent whether anything was found */
async function restore(){if(!store)return;busy=true;emit();
  try{await store.restorePurchases();for(let i=0;i<8&&!NBStore.hasPlus();i++){await new Promise(r=>setTimeout(r,250));sync();}}
  catch(e){console.warn("IAP restore",e&&e.message);}
  finally{busy=false;sync();emit();}}

window.NBIAP={init,buy,restore,sync,get price(){return prices[PLUS]||"";},priceOf:id=>prices[id]||"",get ready(){return ready;},get busy(){return busy;},
  on:f=>{listeners.add(f);return ()=>listeners.delete(f);},PLUS,NOADS,owns:id=>owns(id)};
})();
