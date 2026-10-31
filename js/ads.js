/* Nabeeh — the single advertisement the free app shows.
   Where: only on the screen that follows a finished practice round. Never inside a timed mock test,
   never between questions, never on the first activity of the day.
   How often: after every finished activity (a round, a mission, a puzzle, a test).
   Banner: a small adaptive banner sits at the very bottom of the list screens only (home, practice, tests, report…),
   never during a round or a test; the tab bar and the page move up by the banner's height so nothing is covered.
   A full mock test also gets a second ad when the child leaves its result screen, at least 45 s after the first.
   What kind: Google's child-directed mode is switched on, so ads are contextual and non-personalised —
   nothing about the child is used to choose them, and no advertising identifier is requested.
   Buying "remove ads" switches this module off completely. */
(function(){
"use strict";
const C=window.NB_CONFIG,St=window.NBStore;
const P=()=>window.Capacitor&&Capacitor.Plugins&&Capacitor.Plugins.AdMob;
const native=()=>!!(window.NBPlat&&NBPlat.native());
const conf=()=>{const a=C.ads;return a&&a[NBPlat.plat()]||null;};
const unit=()=>{const c=conf();return c&&c.interstitial||"";};
const bannerUnit=()=>{const c=conf();return c&&c.banner||"";};
const available=()=>native()&&!!P()&&!!unit();

const EVERY=1;            /* show after every finished activity: a round, a mission, a puzzle or a test */
const DAY_MAX=Infinity;   /* no daily cap: the every-second-activity rule is the only limit */
const GAP_MS=0;           /* no minimum gap: every second activity is the only limit */

let started=false,loaded=false,loading=false,showing=false,lastAt=0,tries=0;

function stats(){
  const u=St.S.ui;const dk=St.dayKey();
  if(!u.ads||u.ads.day!==dk)u.ads={day:dk,n:0,rounds:0};
  return u.ads;
}
/* the purchase that turns advertising off */
const off=()=>!!(St.S.pro&&St.S.pro.code);

async function start(){
  if(started||!available()||off())return;
  started=true;
  try{
    await P().initialize({
      initializeForTesting:!!C.ads.testing,
      tagForChildDirectedTreatment:true,   /* COPPA: this app is used by children */
      tagForUnderAgeOfConsent:true,        /* and by children in Europe */
      maxAdContentRating:"General"
    });
    load();
  }catch(e){console.warn("ads init",e&&e.message);started=false;}
}
async function load(){
  if(loaded||loading||!available()||off())return;
  loading=true;
  try{await P().prepareInterstitial({adId:unit(),isTesting:!!C.ads.testing,npa:true});loaded=true;tries=0;}
  catch(e){console.warn("ads load",e&&e.message);
    /* Google often has nothing to send for a new app; ask again a little later, a few times a session */
    if(++tries<=5)setTimeout(load,tries*60000);}
  finally{loading=false;}
}
/* A full-screen ad can leave the iPhone web view nudged sideways or measuring the wrong width when it
   closes; put the page back square and let everything that sizes itself re-measure. */
function settle(){const fix=()=>{try{if(scrollX)scrollTo(0,scrollY);document.documentElement.scrollLeft=0;document.body.scrollLeft=0;dispatchEvent(new Event("resize"));}catch(e){}};fix();setTimeout(fix,300);setTimeout(fix,1200);}
/* called when a practice round ends; resolves to true only if an ad was actually shown */
/* counted the moment an activity ends, even if the child leaves the score screen straight away */
function count(){if(!available()||off())return;const s=stats();s.rounds++;St.save();if(s.rounds>=EVERY&&!loaded)load();}
/* test=true: a finished mock test always gets an ad, whatever the count */
async function afterRound(test){
  if(!available()||off()||showing)return false;
  const s=stats();if(test&&s.rounds<EVERY)s.rounds=EVERY;
  /* once enough activities are done the ad stays due: if none was ready at that moment, the next
     finished activity tries again instead of the count starting over */
  if(s.rounds<EVERY)return false;
  if(s.n>=DAY_MAX)return false;
  if(Date.now()-lastAt<GAP_MS)return false;
  if(!loaded){load();return false;}            /* nothing ready: never make the child wait for one */
  showing=true;
  try{
    await P().showInterstitial();
    loaded=false;lastAt=Date.now();s.n++;s.rounds=0;St.save();
    settle();
    load();                                     /* get the next one ready for later */
    return true;
  }catch(e){console.warn("ads show",e&&e.message);loaded=false;settle();return false;}
  finally{showing=false;}
}
/* the full mock test's second ad: shown when the child leaves the result screen (a user action), and only
   if at least 45 seconds have passed since the first one, so two ads never come one after the other
   (AdMob: no interstitial immediately after another has been closed) */
const BONUS_GAP=45000;
async function bonus(since){
  if(!available()||off()||showing)return false;
  if(lastAt>since&&Date.now()-lastAt<BONUS_GAP)return false;
  if(!loaded){load();return false;}
  showing=true;
  try{await P().showInterstitial();loaded=false;lastAt=Date.now();const s=stats();s.n++;St.save();settle();load();return true;}
  catch(e){console.warn("ads bonus",e&&e.message);loaded=false;settle();return false;}
  finally{showing=false;}
}
/* ---- the anchored banner ---- */
let bShown=false,bWanted=false,bListening=false,bH=0;
function setH(h){bH=h;document.documentElement.style.setProperty("--ad-h",(h||0)+"px");}
function listen(){
  if(bListening||!P())return;bListening=true;
  const onSize=e=>{const h=e&&(e.height||e.size&&e.size.height)||0;if(bWanted)setH(h);};
  try{P().addListener("bannerAdSizeChanged",onSize);P().addListener("bannerSizeChanged",onSize);}catch(e){}
  try{P().addListener("bannerAdFailedToLoad",()=>setH(0));}catch(e){}
}
/* called on every screen change: wanted=true on list screens, false during a round or a test */
async function banner(wanted){
  if(!available()||off()||!bannerUnit()){if(bH)setH(0);return;}
  bWanted=!!wanted;listen();
  try{
    if(bWanted){
      if(!started)await start();
      if(bShown){await P().resumeBanner();setH(bH);}
      else{await P().showBanner({adId:bannerUnit(),adSize:"ADAPTIVE_BANNER",position:"BOTTOM_CENTER",margin:0,isTesting:!!C.ads.testing,npa:true});bShown=true;}
    }else if(bShown){await P().hideBanner();setH(0);}
  }catch(e){console.warn("banner",e&&e.message);setH(0);}
}
/* after the parent buys "remove ads" */
function stop(){try{P()&&P().removeBanner&&P().removeBanner();}catch(e){}loaded=false;bShown=false;bWanted=false;setH(0);}

window.NBAds={available:()=>available()&&!off(),start,count,afterRound,bonus,banner,stop};
})();
