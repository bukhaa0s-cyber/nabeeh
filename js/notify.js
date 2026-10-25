/* Nabeeh — daily practice reminder (iPhone app only). Uses Capacitor Local Notifications: everything is scheduled on the device,
   nothing is sent to a server and no personal data is involved. */
(function(){
"use strict";
const native=()=>!!(window.Capacitor&&Capacitor.isNativePlatform&&Capacitor.isNativePlatform());
const P=()=>window.Capacitor&&Capacitor.Plugins&&Capacitor.Plugins.LocalNotifications;
const available=()=>native()&&!!P();
const IDS=[1,2,3,4,5,6,7];
const TITLE={ar:"نبيه 🦉",en:"Nabeeh 🦉"};
const BODY={
 ar:["تمرين اليوم ينتظرك، عشر دقائق تكفي!","كل يوم خطوة، وخلّ الاختبار أسهل بإذن الله.","جرّب اليوم قسماً جديداً وشوف تقدّمك.","دفتر الأخطاء يحتاج مراجعة سريعة اليوم.","اختبار تجريبي قصير اليوم؟ الوقت مناسب.","سلسلة أيامك تستحق الاستمرار، تمرين بسيط يكفي.","مراجعة المفردات اليوم تثبّت الكلمات الجديدة."],
 en:["Today's practice is waiting, ten minutes is enough!","One step a day makes the test easier.","Try a new section today and see your progress.","Your mistakes notebook needs a quick review today.","How about a short mock test today?","Your streak deserves to continue, a short practice is enough.","A quick word review today helps new words stick."]
};
async function cancel(){const p=P();if(!p)return;try{await p.cancel({notifications:IDS.map(id=>({id}))});}catch(e){}}
async function schedule(h,m,lang){
  const p=P();if(!p)return false;const L=lang==="en"?"en":"ar";
  await cancel();
  await p.schedule({notifications:IDS.map((id,i)=>({id,title:TITLE[L],body:BODY[L][i],schedule:{on:{weekday:i+1,hour:h,minute:m},allowWhileIdle:true}}))});
  return true;
}
/* returns "ok" | "denied" | "unavailable" */
async function enable(h,m,lang){
  const p=P();if(!available())return "unavailable";
  try{
    let s=await p.checkPermissions();
    if(s.display!=="granted")s=await p.requestPermissions();
    if(s.display!=="granted")return "denied";
    await schedule(h,m,lang);return "ok";
  }catch(e){console.warn("notify",e&&e.message);return "unavailable";}
}
async function disable(){await cancel();}
async function resync(prefs,lang){if(available()&&prefs&&prefs.on){try{const s=await P().checkPermissions();if(s.display==="granted")await schedule(prefs.h,prefs.m,lang);}catch(e){}}}
window.NBNotify={available,enable,disable,schedule,resync};
})();
