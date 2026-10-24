/* Nabeeh — test levels, grades, exam blueprints and question pools.
   Sources: mawhiba.sa (levels by grade, four domains, Arabic/English), saudipedia.com (64 / 96 / 120 questions),
   mawhiba.org (one model per level for all its grades, score 1000–2000 weighted by grade).
   Level 1 timing (12 timed parts, 103 min) matches the official booking details.
   Level 2 and 3 timing is NOT published officially; the figures below come from public prep material and are marked approximate. */
(function(){
"use strict";
const NB=window.NB;
const SECS={
  verbal:{en:"Linguistic reasoning & reading",ar:"الاستدلال اللغوي وفهم المقروء",short:{en:"Verbal",ar:"اللغوي"},ico:"📖",cls:"c-verbal",color:"#FF5C93"},
  math:{en:"Mathematical & spatial reasoning",ar:"الاستدلال الرياضي والمكاني",short:{en:"Math & spatial",ar:"الرياضي والمكاني"},ico:"🔢",cls:"c-math",color:"#3E86FF"},
  flex:{en:"Mental flexibility",ar:"المرونة العقلية",short:{en:"Flexibility",ar:"المرونة"},ico:"🧩",cls:"c-flex",color:"#FF9A1F"},
  science:{en:"Scientific & mechanical reasoning",ar:"الاستدلال العلمي والميكانيكي",short:{en:"Science",ar:"العلمي والميكانيكي"},ico:"⚙️",cls:"c-science",color:"#12B886"}
};
const SEC_KEYS=["verbal","math","flex","science"];
const GRADES=[
  {g:3,en:"Grade 3",ar:"الثالث الابتدائي"},{g:4,en:"Grade 4",ar:"الرابع الابتدائي"},{g:5,en:"Grade 5",ar:"الخامس الابتدائي"},
  {g:6,en:"Grade 6",ar:"السادس الابتدائي"},{g:7,en:"Grade 7 (Intermediate 1)",ar:"الأول المتوسط"},{g:8,en:"Grade 8 (Intermediate 2)",ar:"الثاني المتوسط"},
  {g:9,en:"Grade 9 (Intermediate 3)",ar:"الثالث المتوسط"},{g:10,en:"Grade 10 (Secondary 1)",ar:"الأول الثانوي"}
];
const levelForGrade=g=>g<=5?1:g<=8?2:3;
const LEVELS={
  1:{grades:"3–5",q:64,min:103,approx:false,
     parts:(()=>{const small=[],big=[];for(const k of SEC_KEYS){small.push(k,k);big.push(k);}return {small,big};})(),
     plan(){const out=[];for(const k of NB.shuffle(this.parts.small))out.push({sec:k,n:4,secs:360});for(const k of NB.shuffle(this.parts.big))out.push({sec:k,n:8,secs:825});return NB.shuffle(out);}},
  2:{grades:"6–8",q:96,min:120,approx:true,plan(){return SEC_KEYS.map(k=>({sec:k,n:24,secs:1800}));}},
  3:{grades:"9–10",q:120,min:168,approx:true,plan(){return SEC_KEYS.map(k=>({sec:k,n:30,secs:2520}));}}
};
const MOCK={1:{per:5,min:25},2:{per:6,min:30},3:{per:7,min:39}};
const STAGE={1:{en:"Starter",ar:"مبتدئ"},2:{en:"Challenger",ar:"متقدم"},3:{en:"Champion",ar:"متميز"}};
const diffOf=(tl,stage)=>(tl-1)*3+stage;

/* how often each kind of question appears (default 1) */
const WEIGHT={analogyEn:3,analogyAr:3,sentenceEn:2,sentenceAr:2,readingEn:3,readingAr:3,contextEn:2,contextAr:2,oddWordEn:1.5,oddWordAr:1.5,
  oppositeEn:1,oppositeAr:1.5,synonymEn:1,synonymAr:1.5,partWholeEn:.6,toolJobEn:.6,storyEn:1,storyAr:1,order:1.2,syllogism:1,
  seq:2.5,word:2.5,fraction:1.2,cubeNet:1.2,cubeCount:1.2,fact:3,data:1.3,matrix:2,series:1.5,group:1.5,
  /* item types seen in the official practice tests */
  triadEn:2.5,triadAr:2.5,unknownEn:2.5,unknownAr:2.5,inferEn:2.5,inferAr:2.5,
  unreal:3,catPair:3,motive:1.8,shapePair:1.5,rate:1,well:.8,decline:.8,timeZone:.8,
  backward:1.5,ineq:1.5,mirrorClock:1.2,cycle:1.5,forces:1.2,gravity:1,doubling:1.2};
function poolFor(sec,L,d){return Object.values(NB.REG).filter(g=>g.sec===sec&&(!g.lang||g.lang===L)&&d>=g.min&&d<=g.max);}
function pickGen(sec,L,d,avoid){
  let pool=poolFor(sec,L,d);if(avoid&&pool.length>2){const f=pool.filter(g=>!avoid.has(g.name));if(f.length)pool=f;}
  const tot=pool.reduce((a,g)=>a+(WEIGHT[g.name]||1),0);let r=Math.random()*tot;
  for(const g of pool){r-=WEIGHT[g.name]||1;if(r<=0)return g;}return pool[pool.length-1];
}
/* build a list of questions; items: [{sec,d}] */
function build(items,L){
  const used=new Set(),out=[],recent=[];
  for(const it of items){
    let q=null,t=0;
    while(t<25){const g=pickGen(it.sec,L,it.d,new Set(recent.slice(-2)));try{q=NB.run(g.name,it.d,L);}catch(e){q=null;}t++;if(q&&!used.has(q.key))break;}
    if(!q)continue;used.add(q.key);recent.push(q.gen);out.push(q);
  }
  return out;
}
/* parse a bank question's key back into options for re-asking it */
function keyOpts(key){const m=/:(a|j)?(\d+)$/.exec(key||"");return m?{id:+m[2],act:m[1]==="a"}:{};}

Object.assign(NB,{SECS,SEC_KEYS,GRADES,levelForGrade,LEVELS,MOCK,STAGE,diffOf,poolFor,build,keyOpts,WEIGHT});
})();
