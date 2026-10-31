/* Nabeeh — achievements and the owl's levels. Everything is derived from the child's own progress on the device. */
(function(){
"use strict";
const St=window.NBStore;
const LEVELS=[
 {xp:0,ico:"🥚",ar:"بيضة نبيه",en:"Nabeeh egg"},
 {xp:100,ico:"🐣",ar:"فرخ نبيه",en:"Chick"},
 {xp:350,ico:"🦉",ar:"بومة مجتهدة",en:"Busy owl"},
 {xp:800,ico:"🌟",ar:"بومة ذكية",en:"Smart owl"},
 {xp:1600,ico:"🎓",ar:"بومة خبيرة",en:"Expert owl"},
 {xp:3000,ico:"👑",ar:"بومة حكيمة",en:"Wise owl"},
 {xp:6000,ico:"🏆",ar:"ملك البوم",en:"Owl champion"}
];
function level(xp){let i=0;LEVELS.forEach((l,j)=>{if(xp>=l.xp)i=j;});const cur=LEVELS[i],nx=LEVELS[i+1]||null;
  return {i,cur,next:nx,pct:nx?Math.round((xp-cur.xp)/(nx.xp-cur.xp)*100):100};}
function stats(k){
  const kd=St.kid(k.id),total=Object.values(kd.days).reduce((a,d)=>a+(d.n||0),0),log=kd.log.filter(e=>e.m!=="z");
  const last50=log.slice(-50),acc50=last50.length>=50?last50.reduce((a,e)=>a+e.ok,0)/50:0;
  return {total,acc50,streak:St.streak(k.id),mocks:kd.mocks.length,words:Object.keys((kd.words||{}).known||{}).length,
    mastered:Object.values(kd.book).filter(b=>b.done).length,secs:new Set(log.map(e=>e.s)).size,perfect:kd.perfect||0,
    fulls:kd.mocks.filter(m=>m.kind==="full").length,xp:kd.xp||0,
    puz:Object.values(kd.days).filter(d=>d.pz).length,wc:Object.keys(kd.wcWins||{}).length};
}
const D=(id,ico,ar,en,dar,den,f,goal)=>({id,ico,ar,en,dar,den,f,goal});
const DEFS=[
 D("first","🌱","أول خطوة","First step","أجب عن أول سؤال","Answer your first question",s=>s.total,1),
 D("q50","✏️","٥٠ سؤالًا","50 questions","أجب عن ٥٠ سؤالًا","Answer 50 questions",s=>s.total,50),
 D("q200","📚","٢٠٠ سؤال","200 questions","أجب عن ٢٠٠ سؤال","Answer 200 questions",s=>s.total,200),
 D("q1000","🚀","ألف سؤال","1,000 questions","أجب عن ١٠٠٠ سؤال","Answer 1,000 questions",s=>s.total,1000),
 D("st3","🔥","ثلاثة أيام متتالية","3-day streak","تمرّن ٣ أيام متتالية","Practise 3 days in a row",s=>s.streak,3),
 D("st7","🔥","أسبوع كامل","7-day streak","تمرّن ٧ أيام متتالية","Practise 7 days in a row",s=>s.streak,7),
 D("st14","⚡","أسبوعان","14-day streak","تمرّن ١٤ يومًا متتاليًا","Practise 14 days in a row",s=>s.streak,14),
 D("st30","🌋","شهر كامل","30-day streak","تمرّن ٣٠ يومًا متتاليًا","Practise 30 days in a row",s=>s.streak,30),
 D("acc","🎯","دقة عالية","Sharp shooter","٨٠٪ دقة في آخر ٥٠ سؤالًا","80% accuracy over the last 50 questions",s=>s.acc50>=.8?1:0,1),
 D("perfect","💯","جولة كاملة","Perfect round","أجب عن كل أسئلة جولة (١٠ أو أكثر) إجابة صحيحة","Get every question right in a round of 10 or more",s=>s.perfect,1),
 D("secs","🧭","كل الأقسام","All sections","جرّب الأقسام الأربعة","Try all four sections",s=>s.secs,4),
 D("mock1","📝","أول اختبار تجريبي","First mock test","أنهِ اختبارًا تجريبيًا","Finish a mock test",s=>s.mocks,1),
 D("full1","🏁","اختبار كامل","Full mock test","أنهِ اختبارًا تجريبيًا كاملًا","Finish a full mock test",s=>s.fulls,1),
 D("mastered","🧠","تعلّمت من أخطائي","Learned from mistakes","أتقن ١٠ أسئلة من دفتر الأخطاء","Master 10 questions from the mistakes notebook",s=>s.mastered,10),
 D("w25","🔤","٢٥ كلمة","25 words","احفظ ٢٥ كلمة","Learn 25 words",s=>s.words,25),
 D("puz7","🧩","محلّل الألغاز","Puzzle solver","حلّ ٧ ألغاز يومية","Solve 7 daily puzzles",s=>s.puz,7),
 D("wc1","🏆","بطل الأسبوع","Champion of the week","أجب عن ٨ من ١٠ في تحدي الأسبوع","Get 8 of 10 in a weekly challenge",s=>s.wc,1),
 D("w100","📖","مئة كلمة","100 words","احفظ ١٠٠ كلمة","Learn 100 words",s=>s.words,100)
];
function list(k){const s=stats(k),kd=St.kid(k.id),got=kd.badges||{};return DEFS.map(d=>{const v=d.f(s);return Object.assign({},d,{v:Math.min(v,d.goal),ok:!!got[d.id]||v>=d.goal,at:got[d.id]||0});});}
/* awards any newly reached badge and returns them (so the app can celebrate); safe to call often */
let busy=false;
function check(k){
  if(!k||busy)return [];busy=true;try{
    const kd=St.kid(k.id),silent=!kd.badges;kd.badges=kd.badges||{};const fresh=[];
    for(const d of list(k)){if(d.ok&&!kd.badges[d.id]){kd.badges[d.id]=Date.now();fresh.push(d);}}
    if(fresh.length)St.save(k.id);
    return silent?[]:fresh;
  }finally{busy=false;}
}
window.NBBadges={list,check,level,stats,LEVELS,DEFS};
})();
