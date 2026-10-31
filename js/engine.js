/* Nabeeh — chooses questions, adapts difficulty, builds mock exams and scores them. */
(function(){
"use strict";
const {SEC_KEYS,LEVELS,MOCK,levelForGrade,shuffle}=NB;
const St=NBStore;

const levelOf=k=>levelForGrade(k.grade);
const base=L=>(L-1)*3;                                  /* difficulty d = base + stage (1..3) */
/* where a child starts inside their level: younger grades start easier; the test itself is the same for every grade in the level */
const START={3:1,4:2,5:2,6:1,7:2,8:2,9:2,10:2};
function stageFor(k,sec){return St.stage(sec,k.id)||START[k.grade]||1;}
function diffFor(k,sec,jitter){
  const L=levelOf(k);let s=stageFor(k,sec);
  if(jitter){const r=Math.random();if(r<.2)s--;else if(r>.85)s++;}
  s=Math.max(1,Math.min(3,s));return base(L)+s;
}
/* after each answer: look at the last 8 answers in that section at the current stage.
   Answers from an earlier stage are left out, otherwise the ones that earned a promotion
   would immediately earn the next one too. */
function adapt(k,sec){
  const kd=St.kid(k.id),L=levelOf(k),s=stageFor(k,sec),d=base(L)+s;
  const recent=kd.log.filter(e=>e.s===sec&&e.d===d).slice(-8);
  if(recent.length<6)return;
  const acc=recent.reduce((a,e)=>a+e.ok,0)/recent.length;
  if(acc>=.8&&s<3){St.setStage(sec,s+1,k.id);return 1;}
  else if(acc<=.4&&s>1){St.setStage(sec,s-1,k.id);return -1;}
  return 0;
}

function gen(sec,d,lang,avoid){
  /* weighted choice of generator, avoiding the last two kinds */
  const pool=NB.poolFor(sec,lang,d).filter(g=>!(avoid&&avoid.includes(g.name)));
  const list=pool.length?pool:NB.poolFor(sec,lang,d);
  const tot=list.reduce((a,g)=>a+(NB.WEIGHT[g.name]||1),0);let r=Math.random()*tot;
  for(const g of list){r-=NB.WEIGHT[g.name]||1;if(r<=0)return g.name;}return list[list.length-1].name;
}
function one(sec,d,lang,used,recent,forceGen){
  for(let t=0;t<30;t++){
    const g=forceGen||gen(sec,d,lang,recent&&recent.slice(-2));
    let q;try{q=NB.run(g,d,lang);}catch(e){continue;}
    if(used&&used.has(q.key))continue;
    used&&used.add(q.key);recent&&recent.push(g);return q;
  }
  return null;
}

/* ---------- practice sets ---------- */
function weakest(k){
  const kd=St.kid(k.id),out=SEC_KEYS.map(sec=>{const r=kd.log.filter(e=>e.s===sec&&e.m!=="z").slice(-30);
    const acc=r.length?r.reduce((a,e)=>a+e.ok,0)/r.length:.5;return {sec,acc,n:r.length};});
  return out.sort((a,b)=>(a.n<5?-.2:0)+a.acc-((b.n<5?-.2:0)+b.acc));
}
function mission(k,n){
  n=n||10;const lang=k.lang,used=new Set(),recent=[],items=[];
  /* 1–2 due notebook items first */
  for(const b of St.dueBook(k.id).slice(0,2)){if(b.q){items.push(Object.assign({},b.q,{fromBook:1}));used.add(b.key);}}
  const order=weakest(k).map(x=>x.sec),plan=[];
  const left=n-items.length;const share=[3,3,2,2];
  order.forEach((sec,i)=>{for(let j=0;j<share[i];j++)plan.push(sec);});
  while(plan.length>left)plan.pop();
  for(const sec of shuffle(plan)){const q=one(sec,diffFor(k,sec,true),lang,used,recent);if(q)items.push(q);}
  return items;
}
function sectionSet(k,sec,n){const used=new Set(),recent=[],out=[];for(let i=0;i<(n||10);i++){const q=one(sec,diffFor(k,sec,true),k.lang,used,recent);if(q)out.push(q);}return out;}
function skillSet(k,g,n){
  const R=NB.REG[g],L=levelOf(k),used=new Set(),out=[];
  for(let i=0;i<(n||8);i++){let d=diffFor(k,R.sec,true);d=Math.max(R.min,Math.min(R.max,d));const q=one(R.sec,d,k.lang,used,null,g);if(q)out.push(q);}
  return out;
}
function bookSet(k,all){
  const out=[];for(const b of St.dueBook(k.id,all).slice(0,12)){
    if(b.q){out.push(Object.assign({},b.q,{fromBook:1}));continue;}
    /* synced from another device without the stored question: ask the same item (word banks) or a close one */
    try{const q=NB.run(b.g,b.d,b.lang||k.lang,NB.keyOpts(b.key));q.key=b.key;q.fromBook=1;out.push(q);}catch(e){}
  }
  return out;
}
/* which skills exist for a child's level and language, grouped by section */
function skills(k){
  const L=levelOf(k),lo=base(L)+1,hi=base(L)+3,out={};
  for(const sec of SEC_KEYS)out[sec]=Object.values(NB.REG).filter(g=>g.sec===sec&&(!g.lang||g.lang===k.lang)&&g.max>=lo&&g.min<=hi);
  return out;
}

/* ---------- mock exams ----------
   full: the official structure for the child's level (Level 1: 12 timed parts, 64 questions, 103 minutes).
   mini: a short timed version with the same four sections. */
const MIX=[1,1,2,2,2,3,3,2,3,1]; /* stage mix inside the level, roughly 30% easy, 40% medium, 30% hard */
function examQuestions(k,sec,n,used,recent){
  const L=levelOf(k),out=[];
  for(let i=0;i<n;i++){const s=MIX[i%MIX.length];const q=one(sec,base(L)+s,k.lang,used,recent);if(q)out.push(q);}
  return out.sort((a,b)=>a.d-b.d);
}
function buildExam(k,kind){
  const L=levelOf(k),used=new Set(),recent=[];
  if(kind==="mini"){
    const m=MOCK[L],qs=[];for(const sec of SEC_KEYS)qs.push(...examQuestions(k,sec,m.per,used,recent));
    return {kind,level:L,lang:k.lang,parts:[{sec:"mixed",secs:m.min*60,qs}]};
  }
  const parts=LEVELS[L].plan().map(p=>({sec:p.sec,secs:p.secs,qs:examQuestions(k,p.sec,p.n,used,recent)}));
  return {kind:"full",level:L,lang:k.lang,parts};
}
function score(exam,answers){
  /* answers: per part, array of chosen indexes (or null) */
  const by={};SEC_KEYS.forEach(s=>by[s]=[0,0]);let c=0,n=0;const items=[];
  exam.parts.forEach((p,pi)=>p.qs.forEach((q,qi)=>{const a=answers[pi]&&answers[pi][qi];const ok=a===q.answer;by[q.sec][1]++;if(ok){by[q.sec][0]++;c++;}n++;
    items.push({pi,qi,key:q.key,gen:q.gen,sec:q.sec,d:q.d,pick:a==null?null:a,ok:ok?1:0});}));
  /* readiness: harder questions count a little more */
  const L=exam.level;let w=0,wt=0;items.forEach(it=>{const s=it.d-base(L);const wi=s===3?1.5:s===2?1.25:1;wt+=wi;if(it.ok)w+=wi;});
  return {correct:c,total:n,by,items,ready:Math.round(100*w/Math.max(1,wt))};
}
function band(p){return p>=85?"top":p>=70?"good":p>=50?"mid":"low";}

/* per-section and per-skill summaries for reports */
function summary(k,days){
  const kd=St.kid(k.id),since=days?Date.now()-days*86400e3:0,log=kd.log.filter(e=>e.t>=since&&e.m!=="z");
  const sec={},gen={};
  for(const e of log){(sec[e.s]||(sec[e.s]={n:0,ok:0,ms:0})).n++;sec[e.s].ok+=e.ok;sec[e.s].ms+=e.ms;
    const g=gen[e.g]||(gen[e.g]={n:0,ok:0,ms:0,sec:e.s});g.n++;g.ok+=e.ok;g.ms+=e.ms;}
  return {n:log.length,ok:log.reduce((a,e)=>a+e.ok,0),sec,gen};
}


/* ---------- weak-spot practice: the skills this child misses most, plus due notebook items ---------- */
function weakSet(k,n){
  n=n||10;const kd=St.kid(k.id),ok=new Set(Object.values(skills(k)).flat().map(g=>g.name)),by={};
  for(const e of kd.log.slice(-600)){if(e.m==="z"||!ok.has(e.g))continue;const o=by[e.g]||(by[e.g]={g:e.g,n:0,ok:0});o.n++;o.ok+=e.ok;}
  const weak=Object.values(by).filter(o=>o.n>=3&&o.ok/o.n<.75).sort((a,b)=>a.ok/a.n-b.ok/b.n).slice(0,4);
  const used=new Set(),items=[];
  for(const b of St.dueBook(k.id).slice(0,2)){if(b.q){items.push(Object.assign({},b.q,{fromBook:1}));used.add(b.key);}}
  const left=n-items.length;
  if(weak.length>=2){const per=Math.ceil(left/weak.length);for(const w of weak){for(const q of skillSet(k,w.g,per))items.push(q);}}
  else{const sec=weakest(k).slice(0,2).map(x=>x.sec);sec.forEach((sc,i)=>{for(const q of sectionSet(k,sc,Math.ceil(left/sec.length)))items.push(q);});}
  return shuffle(items).slice(0,n);
}
function hasWeak(k){const kd=St.kid(k.id);return kd.log.filter(e=>e.m!=="z").length>=15;}
/* ---------- daily plan counting down to the test date ---------- */
function daysToTest(k){if(!k.testDate)return null;return Math.ceil((new Date(k.testDate+"T08:00:00")-new Date())/86400e3);}
function plan(k){
  const dl=daysToTest(k);if(dl==null||dl<0)return null;
  const kd=St.kid(k.id),today=kd.days[St.dayKey()]||{n:0};
  let target,phase;
  if(dl>45){target=10;phase="build";}else if(dl>21){target=15;phase="practice";}else if(dl>7){target=20;phase="sharpen";}else if(dl>1){target=15;phase="final";}else{target=8;phase="rest";}
  const steps=[{id:"mission",done:!!today.mis}];
  if(St.dueBook(k.id).length&&phase!=="rest")steps.push({id:"book",done:!!today.bk});
  if(hasWeak(k)&&phase!=="rest")steps.push({id:"weak",done:!!today.wk});
  const last=(kd.mocks[0]||{}).t||0;
  if((phase==="sharpen"||phase==="final")&&(Date.now()-last>(phase==="final"?2:3)*86400e3||today.mk))steps.push({id:"mock",done:!!today.mk});
  if(phase==="rest")steps.push({id:"rest",done:false});
  return {dl,target,phase,n:today.n||0,steps};
}
window.NBEngine={weakSet,hasWeak,plan,daysToTest,levelOf,stageFor,diffFor,adapt,mission,sectionSet,skillSet,bookSet,skills,buildExam,score,band,summary,weakest,base};
})();
