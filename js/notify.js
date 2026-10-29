/* Nabeeh — smart daily practice reminder (iPhone app only), built on Capacitor Local Notifications.
   Reminders are scheduled on the device for the next two weeks and re-planned whenever the app is used:
   a day the child has already practised is skipped, a running streak is protected, and the test countdown is exact.
   Nothing is sent to a server and no personal data leaves the phone. */
(function(){
"use strict";
const native=()=>!!(window.Capacitor&&Capacitor.isNativePlatform&&Capacitor.isNativePlatform());
const P=()=>window.Capacitor&&Capacitor.Plugins&&Capacitor.Plugins.LocalNotifications;
const available=()=>native()&&!!P();
const OLD=[1,2,3,4,5,6,7],NEW=Array.from({length:14},(_,i)=>101+i),WEEKLY=130;
const ALL=OLD.concat(NEW).concat([WEEKLY]).map(id=>({id}));
/* the app writes numbers in Arabic-Indic digits, so the notifications do too */
const AD="٠١٢٣٤٥٦٧٨٩";
const ar=n=>String(n).replace(/\d/g,d=>AD[+d]);
/* Arabic counts a noun differently at 1, 2, 3-10 and 11+ */
const arDays=n=>n===1?"يوم واحد":n===2?"يومان":n<=10?ar(n)+" أيام":ar(n)+" يومًا";
const T={
 ar:{title:"نبيه 🦉",
  gen:["تمرين اليوم ينتظرك، عشر دقائق تكفي!","كل يوم خطوة، وخلّ الاختبار أسهل بإذن الله.","جرّب اليوم قسماً جديداً وشوف تقدّمك.","دفتر الأخطاء يحتاج مراجعة سريعة اليوم.","اختبار تجريبي قصير اليوم؟ الوقت مناسب.","مراجعة المفردات اليوم تثبّت الكلمات الجديدة.","جرّب «تدريب نقاط الضعف» اليوم."],
  streak:n=>`سلسلتك ${arDays(n)} 🔥 تمرين بسيط اليوم يحميها من الانقطاع!`,
  count:(n,nm)=>`${nm?nm+"، ":""}باقي ${arDays(n)} على الاختبار. تمرين اليوم يقرّبك.`,
  eve:"غدًا الاختبار! مراجعة خفيفة اليوم ثم نوم مبكر 🌙",
  hi:nm=>`${nm}، تمرين اليوم ينتظرك، عشر دقائق تكفي!`},
 en:{title:"Nabeeh 🦉",
  gen:["Today's practice is waiting, ten minutes is enough!","One step a day makes the test easier.","Try a new section today and see your progress.","Your mistakes notebook needs a quick review today.","How about a short mock test today?","A quick word review today helps new words stick.","Try “Weak-spot practice” today."],
  streak:n=>`Your ${n}-day streak 🔥 A short practice today keeps it alive!`,
  count:(n,nm)=>`${nm?nm+", ":""}${n} day${n===1?"":"s"} to the test. Today's practice gets you closer.`,
  eve:"The test is tomorrow! A light review today, then an early night 🌙",
  hi:nm=>`${nm}, today's practice is waiting, ten minutes is enough!`}
};
const day0=d=>{const x=new Date(d);x.setHours(0,0,0,0);return x;};
/* the notification list for the next 14 days */
function build(ctx,now){
  const L=ctx.lang==="en"?"en":"ar",X=T[L],out=[],p=ctx.prefs;
  for(let i=0;i<14;i++){
    const at=new Date(now);at.setDate(at.getDate()+i);at.setHours(p.h,p.m,0,0);
    if(at<=now)continue;if(i===0&&ctx.practicedToday)continue;
    let dl=null;if(ctx.testDate){dl=Math.round((day0(ctx.testDate+"T12:00:00")-day0(at))/86400e3);if(dl<=0)continue;}
    let body;
    if(dl===1)body=X.eve;
    else if(i===0&&ctx.streak>=2)body=X.streak(ctx.streak);
    else if(dl&&dl<=30&&(i%2===0||dl<=7))body=X.count(dl,ctx.name);
    else body=(i%3===0&&ctx.name)?X.hi(ctx.name):X.gen[at.getDay()];
    out.push({id:101+i,title:X.title,body,schedule:{at,allowWhileIdle:true}});
  }
  /* the fourteen above cover a fortnight; this one repeats weekly after that, so a parent who stops
     opening the app still hears from it instead of the reminders simply running out */
  if(!ctx.testDate){
    const at=new Date(now);at.setDate(at.getDate()+21);at.setHours(p.h,p.m,0,0);
    out.push({id:WEEKLY,title:X.title,body:X.gen[0],schedule:{at,repeats:true,every:"week",allowWhileIdle:true}});
  }
  return out;
}
async function cancel(){const p=P();if(!p)return;try{await p.cancel({notifications:ALL});}catch(e){}}
let last="";
async function plan(ctx,force){
  const p=P();if(!p||!ctx||!ctx.prefs||!ctx.prefs.on)return false;
  const key=JSON.stringify([ctx.prefs,ctx.lang,ctx.streak,ctx.practicedToday,ctx.testDate,ctx.name,new Date().toDateString()]);
  if(!force&&key===last)return true;
  try{const s=await p.checkPermissions();if(s.display!=="granted")return false;}catch(e){return false;}
  await cancel();
  const list=build(ctx,new Date());if(list.length)await p.schedule({notifications:list});
  last=key;return true;
}
/* returns "ok" | "denied" | "unavailable" */
async function enable(ctx){
  const p=P();if(!available())return "unavailable";
  try{
    let s=await p.checkPermissions();
    if(s.display!=="granted")s=await p.requestPermissions();
    if(s.display!=="granted")return "denied";
    await plan(ctx,true);return "ok";
  }catch(e){console.warn("notify",e&&e.message);return "unavailable";}
}
async function disable(){last="";await cancel();}
window.NBNotify={available,enable,disable,plan,build};
})();
