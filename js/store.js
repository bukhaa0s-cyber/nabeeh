/* Nabeeh — app state, saved on the device and (when an account is signed in) synced to Firebase.
   Children are stored by nickname only; nothing else about them leaves the device except progress numbers. */
(function(){
"use strict";
const C=window.NB_CONFIG, KEY="nabeeh.v1", LOG_MAX=4000, BOOK_MAX=120, MOCK_MAX=40, MOCK_KEEP_Q=3;
const pad=n=>String(n).padStart(2,"0");
const dayKey=(t)=>{const d=t?new Date(t):new Date();return d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate());};
const uid=()=>Math.random().toString(36).slice(2,10)+Date.now().toString(36).slice(-4);

function blank(){return {v:1,ui:{lang:null,theme:"auto"},acct:null,pro:null,kids:[],active:null,data:{},usage:{day:"",n:0,minis:0},live:null,updated:0};}
function blankKid(){return {log:[],sec:{},book:{},mocks:[],days:{},xp:0,words:{known:{}},badges:{},updated:0};}
function safeGet(){try{return localStorage.getItem(KEY);}catch(e){return null;}}
function safeSet(v){try{localStorage.setItem(KEY,v);return true;}catch(e){return false;}}
/* A WebView's localStorage can be cleared by the phone when storage runs low, so the app keeps a second
   copy in a real file and restores it on the next start when the local copy is gone. The copy is written
   to a file rather than to Preferences because it holds the whole progress, far more than settings storage
   is meant to carry. */
const NATIVE=()=>!!(window.Capacitor&&Capacitor.isNativePlatform&&Capacitor.isNativePlatform());
const FS=()=>window.Capacitor&&Capacitor.Plugins&&Capacitor.Plugins.Filesystem;
const BK={path:"nabeeh-backup.json",directory:"DATA",encoding:"utf8"};
let bkTimer=null,bkBusy=false,bkAgain=false;
async function writeBackup(){
  if(bkBusy){bkAgain=true;return;}
  bkBusy=true;
  try{await FS().writeFile(Object.assign({data:JSON.stringify(S)},BK));}catch(e){console.warn("backup",e&&e.message);}
  finally{bkBusy=false;if(bkAgain){bkAgain=false;writeBackup();}}
}
/* writes are spaced out: the file holds the whole progress, so saving it on every answer would be wasteful */
function backup(now){
  if(!NATIVE()||!FS())return;
  clearTimeout(bkTimer);
  if(now)writeBackup();else bkTimer=setTimeout(writeBackup,5000);
}
/* called once before the first screen is drawn */
async function hydrate(){
  if(!NATIVE()||!FS())return false;
  try{
    const r=JSON.parse((await FS().readFile(BK)).data||"null");
    if(!r||r.v!==1)return false;
    if((r.updated||0)>(S.updated||0)||(!S.kids.length&&r.kids&&r.kids.length)){
      const b=blank();S=Object.assign(b,r,{ui:Object.assign(b.ui,r.ui||{}),usage:Object.assign(b.usage,r.usage||{})});
      safeSet(JSON.stringify(S));listeners.forEach(f=>{try{f();}catch(e){}});return true;
    }
  }catch(e){}
  return false;
}
/* restoring a backup file the parent saved earlier */
function importJSON(text){
  const d=JSON.parse(text);
  if(!d||!Array.isArray(d.kids)||!d.data)throw new Error("badFile");
  const seen=new Set(S.kids.map(k=>k.id));
  for(const k of d.kids)if(!seen.has(k.id))S.kids.push(k);
  for(const [id,rd] of Object.entries(d.data))if(!S.data[id])S.data[id]=Object.assign(blankKid(),rd);
  if(!S.active&&S.kids[0])S.active=S.kids[0].id;
  save();return d.kids.length;
}

let S=(()=>{try{const s=JSON.parse(safeGet());if(s&&s.v===1){const b=blank();return Object.assign(b,s,{ui:Object.assign(b.ui,s.ui||{}),usage:Object.assign(b.usage,s.usage||{})});}}catch(e){}return blank();})();
const listeners=new Set();
let pushTimer=null,dirtyKids=new Set(),dirtyRoot=false;

function save(kidId){
  S.updated=Date.now();
  if(kidId){kid(kidId).updated=S.updated;dirtyKids.add(kidId);}else dirtyRoot=true;
  if(!safeSet(JSON.stringify(S))){ /* storage full: trim stored mock questions and try again */
    for(const k of Object.values(S.data))for(const m of k.mocks)delete m.q;safeSet(JSON.stringify(S));
  }
  schedulePush();backup();
  listeners.forEach(f=>{try{f();}catch(e){}});
}
function kid(id){id=id||S.active;if(!id)return null;if(!S.data[id])S.data[id]=blankKid();return S.data[id];}
function activeKid(){return S.kids.find(k=>k.id===S.active)||S.kids[0]||null;}

/* ---------- children ---------- */
function addKid(p){const k={id:uid(),name:String(p.name||"").trim().slice(0,24),avatar:p.avatar||"🦉",grade:+p.grade,lang:p.lang==="en"?"en":"ar",testDate:p.testDate||"",created:Date.now()};
  S.kids.push(k);S.active=k.id;kid(k.id);save();save(k.id);return k;}
function updateKid(id,p){const k=S.kids.find(x=>x.id===id);if(!k)return;Object.assign(k,{name:String(p.name??k.name).trim().slice(0,24),avatar:p.avatar||k.avatar,grade:+(p.grade??k.grade),lang:(p.lang??k.lang)==="en"?"en":"ar",testDate:p.testDate??k.testDate});save();}
function removeKid(id){S.kids=S.kids.filter(k=>k.id!==id);delete S.data[id];if(S.active===id)S.active=S.kids[0]?S.kids[0].id:null;save();if(window.NBCloud)NBCloud.deleteKid(id);}
function setActive(id){if(S.kids.some(k=>k.id===id)){S.active=id;save();}}

/* ---------- recording answers ---------- */
function rec1(q,ok,ms,mode,kidId){
  const k=kid(kidId);if(!k)return;
  const t=Date.now(),dk=dayKey(t);
  k.log.push({t,g:q.gen,s:q.sec,d:q.d,ok:ok?1:0,ms:Math.round(ms||0),m:mode||"p"});
  if(k.log.length>LOG_MAX)k.log.splice(0,k.log.length-LOG_MAX);
  const day=k.days[dk]||(k.days[dk]={n:0,ok:0,ms:0});day.n++;day.ok+=ok?1:0;day.ms+=Math.round(ms||0);
  k.xp+=ok?10:2;
  /* mistakes notebook: wrong → box 0, due tomorrow; right on a notebook item → next box */
  const b=k.book[q.key];
  if(!ok){k.book[q.key]={key:q.key,g:q.gen,s:q.sec,d:q.d,lang:q.lang,box:0,miss:(b?b.miss:0)+1,due:t+20*3600e3,t,q:slimQ(q)};trimBook(k);}
  else if(b){b.box++;b.due=t+[1,3,7,14,30][Math.min(b.box,4)]*86400e3;if(b.box>=4)b.done=1;}
  if(mode!=="x"&&!isPro()){ if(S.usage.day!==dk){S.usage.day=dk;S.usage.n=0;} S.usage.n++; }
}
function record(q,ok,ms,mode,kidId){rec1(q,ok,ms,mode,kidId);save(kidId||S.active);}
/* a finished mock test records up to 120 answers: writing them in one go keeps older phones responsive */
function recordMany(list,mode,kidId){for(const e of list)rec1(e.q,e.ok,e.ms,mode,kidId);save(kidId||S.active);}
function slimQ(q){return {sec:q.sec,prompt:q.prompt,visual:q.visual,kind:q.kind,options:q.options,answer:q.answer,explain:q.explain,key:q.key,gen:q.gen,d:q.d,lang:q.lang};}
function trimBook(k){const e=Object.values(k.book);if(e.length<=BOOK_MAX)return;e.sort((a,b)=>(a.done?0:1)-(b.done?0:1)||a.t-b.t);for(const x of e.slice(0,e.length-BOOK_MAX))delete k.book[x.key];}
function dueBook(kidId,all){const k=kid(kidId);if(!k)return [];const t=Date.now();return Object.values(k.book).filter(b=>!b.done&&(all||b.due<=t)).sort((a,b)=>a.due-b.due);}

function addMock(m,kidId){const k=kid(kidId);m.id=uid();m.t=Date.now();k.mocks.unshift(m);if(k.mocks.length>MOCK_MAX)k.mocks.length=MOCK_MAX;
  /* the stored question text and pictures are by far the biggest thing saved, so only the newest few keep theirs */
  k.mocks.forEach((x,i)=>{if(i>=MOCK_KEEP_Q)delete x.q;});
  if(m.kind==="mini"&&!isPro())S.usage.minis++;save(kidId||S.active);return m.id;}

/* ---------- section difficulty (stage 1–3 inside the child's level) ---------- */
function stage(sec,kidId){const k=kid(kidId);const s=k.sec[sec];return s?s.stage:null;}
function setStage(sec,v,kidId){const k=kid(kidId);(k.sec[sec]||(k.sec[sec]={})).stage=v;}

/* ---------- plan / pro ---------- */
function isPro(){return !!(S.pro&&S.pro.code);}
function freeLeft(){if(isPro())return Infinity;const dk=dayKey();const used=S.usage.day===dk?S.usage.n:0;return Math.max(0,C.trial.dailyQuestions-used);}
function miniLeft(){return isPro()?Infinity:Math.max(0,C.trial.miniMocks-S.usage.minis);}
function setPro(p){S.pro=p;save();}

/* ---------- stats helpers ---------- */
function streak(kidId){const k=kid(kidId);if(!k)return 0;let n=0;const d=new Date();
  if(!(k.days[dayKey(d)]&&k.days[dayKey(d)].n>=1))d.setDate(d.getDate()-1);
  for(;;){const e=k.days[dayKey(d)];if(e&&e.n>=1){n++;d.setDate(d.getDate()-1);}else break;}return n;}

/* merge data from the cloud (keeps the newest copy of each child, joins answer logs) */
function mergeRemote(root,kids){
  if(root){if(root.pro)S.pro=root.pro;if(root.ui&&!S.ui.lang)S.ui.lang=root.ui.lang;
    if(Array.isArray(root.kids))for(const rk of root.kids){const lk=S.kids.find(x=>x.id===rk.id);if(!lk)S.kids.push(rk);else if((root.updated||0)>(S.updated||0))Object.assign(lk,rk);}
    if(root.deleted)for(const id of root.deleted){S.kids=S.kids.filter(k=>k.id!==id);delete S.data[id];}}
  for(const [id,rd] of Object.entries(kids||{})){
    const ld=S.data[id];
    if(!ld){S.data[id]=Object.assign(blankKid(),rd);continue;}
    const seen=new Set(ld.log.map(e=>e.t+":"+e.g));for(const e of rd.log||[])if(!seen.has(e.t+":"+e.g))ld.log.push(e);ld.log.sort((a,b)=>a.t-b.t);
    for(const [dk,v] of Object.entries(rd.days||{}))if(!ld.days[dk]||ld.days[dk].n<v.n)ld.days[dk]=v;
    const mids=new Set(ld.mocks.map(m=>m.id));for(const m of rd.mocks||[])if(!mids.has(m.id))ld.mocks.push(m);ld.mocks.sort((a,b)=>b.t-a.t);
    for(const [kk,b] of Object.entries(rd.book||{}))if(!ld.book[kk]||(ld.book[kk].t||0)<(b.t||0))ld.book[kk]=Object.assign({},b,{q:ld.book[kk]&&ld.book[kk].q});
    for(const [sec,v] of Object.entries(rd.sec||{}))if(!ld.sec[sec])ld.sec[sec]=v;
    ld.xp=Math.max(ld.xp||0,rd.xp||0);ld.perfect=Math.max(ld.perfect||0,rd.perfect||0);if(rd.badges)ld.badges=Object.assign({},rd.badges,ld.badges||{});ld.words=ld.words||{known:{}};Object.assign(ld.words.known,(rd.words||{}).known||{});
  }
  if(!S.active&&S.kids[0])S.active=S.kids[0].id;
  safeSet(JSON.stringify(S));listeners.forEach(f=>{try{f();}catch(e){}});
}
/* what is sent to the cloud for one child: no stored question text (keeps documents small) */
function kidForCloud(id){const k=kid(id);return {log:k.log.slice(-2500),sec:k.sec,days:k.days,xp:k.xp,words:k.words,badges:k.badges||{},perfect:k.perfect||0,updated:k.updated,
  book:Object.fromEntries(Object.entries(k.book).map(([kk,b])=>[kk,Object.assign({},b,{q:null})])),
  mocks:k.mocks.map(m=>Object.assign({},m,{q:null}))};}
function rootForCloud(){return {kids:S.kids,ui:{lang:S.ui.lang},updated:S.updated};}

function schedulePush(){if(!window.NBCloud||!NBCloud.user())return;clearTimeout(pushTimer);pushTimer=setTimeout(flush,2500);}
async function flush(){if(!window.NBCloud||!NBCloud.user())return;const ks=[...dirtyKids],root=dirtyRoot;dirtyKids.clear();dirtyRoot=false;
  try{await NBCloud.push(root||ks.length?rootForCloud():null,Object.fromEntries(ks.filter(id=>S.data[id]).map(id=>[id,kidForCloud(id)])));}
  catch(e){ks.forEach(id=>dirtyKids.add(id));dirtyRoot=dirtyRoot||root;console.warn("sync failed",e);}}

function exportJSON(){return JSON.stringify({exported:new Date().toISOString(),kids:S.kids,data:S.data},null,1);}
function resetAll(){const ui=S.ui;S=blank();S.ui=ui;safeSet(JSON.stringify(S));backup(true);listeners.forEach(f=>f());}

window.NBStore={get S(){return S;},save,kid,activeKid,addKid,updateKid,removeKid,setActive,record,recordMany,dueBook,addMock,stage,setStage,
  isPro,freeLeft,miniLeft,setPro,streak,dayKey,uid,mergeRemote,kidForCloud,rootForCloud,flush,exportJSON,importJSON,hydrate,backupNow:()=>backup(true),resetAll,
  on:f=>{listeners.add(f);return ()=>listeners.delete(f);}};
})();
