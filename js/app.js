/* Nabeeh — screens and navigation. */
(function(){
"use strict";
const C=window.NB_CONFIG,St=NBStore,E=NBEngine,$=s=>document.querySelector(s);
const esc=NB.esc,SECS=NB.SECS,SEC_KEYS=NB.SEC_KEYS;
let RUN=null,EXAM=null,TICK=null,WORD=null;

/* ---------- language, theme, numbers ---------- */
function uiLang(){return St.S.ui.lang||((navigator.language||"ar").startsWith("ar")?"ar":"ar");}
function applyUi(){
  const L=uiLang();window.NBUI_LANG=L;
  document.documentElement.lang=L;document.documentElement.dir=L==="ar"?"rtl":"ltr";
  const th=St.S.ui.theme;if(th==="light"||th==="dark")document.documentElement.setAttribute("data-theme",th);else document.documentElement.removeAttribute("data-theme");
  document.title=t("brand")+" | "+t("tagline");
}
const N=n=>uiLang()==="ar"?NB.loc(String(n),"ar"):String(n);
const P=n=>N(n)+(uiLang()==="ar"?"٪":"%");
const SEP=()=>uiLang()==="ar"?"، ":", ";
/* "3 of 10": a slash between Arabic digits reads backwards in right-to-left text, so Arabic uses the word من */
const FR=(a,b)=>uiLang()==="ar"?`${N(a)} من ${N(b)}`:`${a}/${b}`;
const pct=(a,b)=>b?Math.round(100*a/b):0;
const secName=(s,short)=>{const o=SECS[s];if(!o)return "";return short?o.short[uiLang()]:o[uiLang()];};
const gradeName=g=>{const x=NB.GRADES.find(y=>y.g===+g);return x?x[uiLang()]:"";};
const fmtT=s=>{s=Math.max(0,Math.round(s));const m=Math.floor(s/60),r=s%60;return N(`${m}:${String(r).padStart(2,"0")}`);};
const kid=()=>St.activeKid();
const FRAMED=window.top!==window||!!(window.NBIAP&&NBIAP.native()); /* inside a preview frame printing and file downloads are blocked, so those buttons are hidden */

/* ---------- icons ---------- */
const I={
 logo:`<svg viewBox="0 0 64 64" aria-hidden="true"><rect width="64" height="64" rx="17" fill="#0E8A6A"/><path d="M14 29c0 13 7.5 21 18 21s18-8 18-21" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round"/><circle cx="32" cy="18" r="6.5" fill="#FFD84D"/></svg>`,
 home:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>`,
 practice:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="7" r="2.5"/><circle cx="6" cy="17" r="2.5"/><path d="M11 7h9M11 17h9"/><circle cx="6" cy="17" r="1" fill="currentColor"/></svg>`,
 mock:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="18" rx="2"/><circle cx="9" cy="9" r="1.6"/><circle cx="15" cy="9" r="1.6" fill="currentColor"/><circle cx="9" cy="15" r="1.6" fill="currentColor"/><circle cx="15" cy="15" r="1.6"/></svg>`,
 report:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>`,
 gear:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>`,
 book:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h11a3 3 0 0 1 3 3v13H7a3 3 0 0 1-3-3z"/><path d="M8 9l4 4M12 9l-4 4"/></svg>`,
 cards:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="13" height="15" rx="2"/><path d="M8 3h11a2 2 0 0 1 2 2v12"/></svg>`,
 info:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/></svg>`,
 lock:`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>`,
 back:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg>`
};
const AV=["🦉","🦊","🐯","🐼","🐬","🦅","🐪","🚀","⭐","🌙","⚽","🎨"];

/* ---------- small UI pieces ---------- */
function toast(msg,mood){const d=document.createElement("div");d.className="toast"+(mood?" levelup":"");d.setAttribute("role","status");if(mood){d.innerHTML=FX.owl(mood,44)+"<span></span>";d.querySelector("span").textContent=msg;}else d.textContent=msg;document.body.appendChild(d);setTimeout(()=>d.remove(),mood?3200:2600);}
function modal(html){closeModal();const m=document.createElement("div");m.className="modal";m.id="modal";m.innerHTML=`<div class="sheet" role="dialog" aria-modal="true">${html}</div>`;
  m.addEventListener("click",e=>{if(e.target===m)closeModal();});document.body.appendChild(m);const f=m.querySelector("button,input");f&&f.focus();}
function closeModal(){const m=$("#modal");m&&m.remove();}
function header(back){
  const k=kid();
  return `<header class="top">${back?`<a class="iconbtn" href="${back}" aria-label="${uiLang()==="ar"?"رجوع":"Back"}" style="${uiLang()==="ar"?"transform:scaleX(-1)":""}">${I.back}</a>`:`<a class="brand" href="#/home">${I.logo}<span>${t("brand")}</span></a>`}
   <span class="sp"></span>${k?`<button class="kidchip" data-act="kids" aria-label="${t("kids")}"><span class="av">${k.avatar}</span><b>${esc(k.name)}</b><small>${t("level",{l:E.levelOf(k)})}</small></button>`:""}
   <a class="iconbtn" href="#/settings" aria-label="${t("settings")}">${I.gear}</a></header>`;
}
function tabs(cur){
  const it=[["home","#/home",I.home,t("tabHome")],["practice","#/practice",I.practice,t("tabPractice")],["mock","#/mock",I.mock,t("tabMock")],["report","#/report",I.report,t("tabReport")]];
  return `<div class="tabs"><nav>${it.map(([k,h,ic,l])=>`<a href="${h}" ${cur===k?'aria-current="page"':""}>${ic}<span>${l}</span></a>`).join("")}</nav></div>`;
}
function page(inner,cur,back){$("#app").innerHTML=`<div class="wrap">${header(back)}<div class="enter">${inner}</div></div>${cur?tabs(cur):""}`;window.scrollTo(0,0);
  document.querySelectorAll(".wrap>.enter>*").forEach((el,i)=>el.style.setProperty("--i",Math.min(i,10)));
  document.querySelectorAll("[data-count]").forEach(el=>FX.countUp(el,+el.dataset.count,900,v=>el.dataset.pct?P(v):N(v)));}
const tip=()=>{const a=t("owlTips");return a[Math.floor(Math.random()*a.length)];};
function meter(p){return `<div class="meter"><i style="width:${p}%"></i></div>`;}
function freeBanner(){if(St.isPro())return "";const n=St.freeLeft();
  return `<div class="banner"><p>${n>0?t("freeLeft",{n}):`<b>${t("freeOut")}</b><br><span class="small">${t("freeOutSub")}</span>`}</p><a class="btn sm marker" href="#/upgrade">${t("upgrade")}</a></div>`;}

/* ---------- welcome & child profile ---------- */
function kidForm(k){
  const g=k?k.grade:4,lang=k?k.lang:"ar",av=k?k.avatar:"🦉";
  return `<form id="kidf" autocomplete="off">
   <label class="f">${t("kidName")}<input class="in" name="name" required maxlength="24" value="${k?esc(k.name):""}"><small>${t("kidNameHint")}</small></label>
   <div class="f" style="margin-bottom:12px"><span style="font-weight:500">${t("avatar")}</span><div class="avs" style="margin-top:6px">${AV.map(a=>`<button type="button" data-act="av" data-v="${a}" aria-pressed="${a===av}">${a}</button>`).join("")}</div><input type="hidden" name="avatar" value="${av}"></div>
   <label class="f">${t("grade")}<select class="in" name="grade">${NB.GRADES.map(x=>`<option value="${x.g}" ${x.g===g?"selected":""}>${x[uiLang()]}</option>`).join("")}</select><small id="lvlhint">${t("levelAuto",{l:levelLabel(g)})}</small></label>
   <div class="f" style="margin-bottom:12px"><span style="font-weight:500">${t("testLang")}</span><div class="seg" style="margin-top:6px"><button type="button" data-act="tl" data-v="ar" aria-pressed="${lang==="ar"}">${t("langAr")}</button><button type="button" data-act="tl" data-v="en" aria-pressed="${lang==="en"}">${t("langEn")}</button></div><input type="hidden" name="lang" value="${lang}"></div>
   <label class="f">${t("testDate")}<input class="in" type="date" name="testDate" value="${k?esc(k.testDate||""):""}"></label>
   <p class="err hide" id="kerr"></p>
   <button class="btn wide" type="submit">${t("save")}</button>
   ${k?`<p class="center" style="margin:12px 0 0"><button type="button" class="link" data-act="delKid" data-id="${k.id}">${t("del")}</button></p>`:""}
  </form>`;
}
function levelLabel(g){const L=NB.levelForGrade(+g);return t("level",{l:L})+" ("+NB.LEVELS[L].grades.replace(/(\d)/g,d=>N(d))+")";}
function vWelcome(){
  $("#app").innerHTML=`<div class="wrap"><header class="top"><span class="brand">${I.logo}<span>${t("brand")}</span></span><span class="sp"></span>
    <div class="seg"><button data-act="ui" data-v="ar" aria-pressed="${uiLang()==="ar"}">عربي</button><button data-act="ui" data-v="en" aria-pressed="${uiLang()==="en"}">English</button></div></header>
    <div class="hello"><h1>${t("welcome")}</h1><p class="muted" style="margin:0">${t("welcomeSub")}</p></div>
    <div class="sheet">${kidForm(null)}</div>
    ${NBCloud.enabled()&&!NBCloud.user()?`<p class="center"><a href="#/auth">${t("haveAcc")}</a></p>`:""}
    <p class="note">${t("disclaimer")}</p></div>`;
}
function vKid(id){
  const k=id==="new"?null:St.S.kids.find(x=>x.id===id);
  if(id==="new"&&!St.isPro()&&St.S.kids.length>=C.trial.kids){page(`<div class="sheet"><h2>${t("kidLimit")}</h2><p class="sub">${t("upgradeSub")}</p><a class="btn" href="#/upgrade">${t("upgrade")}</a></div>`,null,"#/settings");return;}
  if(id==="new"&&St.S.kids.length>=C.proKids){page(`<div class="sheet"><p>${t("kidLimit")}</p></div>`,null,"#/settings");return;}
  page(`<h2 class="h">${k?t("editKid"):t("addKid")}</h2><div class="sheet">${kidForm(k)}</div>`,null,"#/settings");
  $("#kidf").dataset.id=k?k.id:"";
}
function saveKidForm(f){
  const d=Object.fromEntries(new FormData(f));
  if(!d.name.trim()){const e=$("#kerr");e.textContent=uiLang()==="ar"?"اكتب اسم الطفل":"Enter the child's name";e.classList.remove("hide");return;}
  if(f.dataset.id)St.updateKid(f.dataset.id,d);else St.addKid(d);
  toast(t("saved"));go("#/home");
}

/* ---------- home ---------- */
function vHome(){
  const k=kid(),kd=St.kid(),L=E.levelOf(k),today=kd.days[St.dayKey()]||{n:0,ok:0};
  let count="";
  if(k.testDate){const dl=Math.ceil((new Date(k.testDate+"T08:00:00")-new Date())/86400e3);
    count=dl>1?`<div class="count"><b>${N(dl)}</b><span>${t("daysLeft")}</span></div>`:dl===1?`<p style="margin:0">${t("dayLeft1")}</p>`:dl===0?`<p style="margin:0"><b>${t("testToday")}</b></p>`:"";}
  else count=`<a class="small" href="#/kid/${k.id}">${t("noDate")}</a>`;
  const misDone=!!today.mis;
  const S30=E.summary(k,30),due=St.dueBook(k.id).length;
  const secCards=SEC_KEYS.map(s=>{const x=S30.sec[s];const p=x?pct(x.ok,x.n):0;
    return `<a class="sec ${SECS[s].cls}" href="#/practice/${s}"><small>${x?P(p)+" "+t("acc"):t("noData")}</small><h3>${secName(s)}</h3>${meter(p)}</a>`;}).join("");
  const live=St.S.live&&St.S.live.kid===k.id?`<div class="banner"><p><b>${t("resumeQ")}</b></p><button class="btn sm" data-act="resume">${t("resume")}</button></div>`:"";
  const stk=St.streak(k.id),done10=Math.min(today.n,10);
  page(`<div class="hero-home"><button class="link" data-act="owl" aria-label="${t("brand")}" style="padding:0">${FX.owl(today.n>=10?"happy":"idle",92,"homeOwl")}</button><div><h1>${t("hi",{n:esc(k.name)})}</h1>${count}</div></div>
   ${live}${freeBanner()}
   <section class="sheet mission"><div><h2>${t("mission")}</h2><p>${misDone?t("missionDone"):t("missionSub",{n:10})}</p>
    <button class="btn" data-act="mission">${misDone?t("again"):t("start")}</button></div>${FX.ring(done10/10,100,N(done10),uiLang()==="ar"?"من "+N(10):"of 10")}</section>
   <div class="stats"><div class="stat"><b>${stk?'<span class="flame">🔥</span> ':""}<span data-count="${stk}">${N(stk)}</span></b><span>${t("streak")}</span></div><div class="stat"><b data-count="${today.n}">${N(today.n)}</b><span>${t("answered")}</span></div><div class="stat"><b data-count="${kd.xp}">${N(kd.xp)}</b><span>${t("xp")}</span></div></div>
   <h2 class="h">${t("yourSecs")}</h2><div class="secs">${secCards}</div>
   <h2 class="h">${t("shortcuts")}</h2>
   <div class="tiles">
    <a class="tile" href="#/book"><span class="ic">${I.book}</span><span><b>${t("book")}</b><small>${due?t("bookSub",{n:due}):t("bookEmpty")}</small></span></a>
    <a class="tile" href="#/words"><span class="ic">${I.cards}</span><span><b>${t("words")}</b><small>${t("wordsSub")}</small></span></a>
    <a class="tile" href="#/report"><span class="ic">${I.report}</span><span><b>${t("report")}</b><small>${t("reportSub")}</small></span></a>
    <a class="tile" href="#/guide"><span class="ic">${I.info}</span><span><b>${t("guide")}</b><small>${t("guideSub")}</small></span></a>
   </div>`,"home");
}

/* ---------- practice lists ---------- */
function vPractice(){
  const k=kid(),S30=E.summary(k);
  page(`<div class="hello"><h1>${t("practiceTitle")}</h1><p class="muted" style="margin:0">${t("practiceSub")}</p></div>${freeBanner()}
   <div class="list">${SEC_KEYS.map(s=>{const x=S30.sec[s];return `<a class="item sec ${SECS[s].cls}" href="#/practice/${s}" style="padding-inline-start:20px"><span class="grow"><b>${secName(s)}</b><small>${x?t("tries",{n:x.n}):t("noData")}</small></span><span class="pct">${x?P(pct(x.ok,x.n)):""}</span></a>`;}).join("")}</div>`,"practice");
}
function vSection(sec){
  const k=kid(),sk=E.skills(k)[sec]||[],S=E.summary(k);
  page(`<div class="hello"><h1>${secName(sec)}</h1></div>
   <button class="btn wide" data-act="secSet" data-s="${sec}" style="margin-bottom:16px">${t("mixed10")}</button>
   <h2 class="h">${t("skillsIn")}</h2>
   <div class="list">${sk.map(g=>{const x=S.gen[g.name];return `<button class="item" data-act="skill" data-g="${g.name}"><span class="grow"><b>${g.label[uiLang()]}</b><small>${x?t("tries",{n:x.n}):t("noData")}</small></span><span class="pct">${x?P(pct(x.ok,x.n)):""}</span></button>`;}).join("")}</div>`,"practice","#/practice");
}

/* ---------- practice runner ---------- */
function startRun(items,title,ret,mode){
  if(!items.length){toast(t("bookEmpty"));return;}
  if(!St.isPro()&&St.freeLeft()<=0){go("#/upgrade");return;}
  RUN={items,title,ret:ret||"#/home",mode:mode||"p",i:0,sel:null,checked:false,struck:new Set(),res:[],qt:performance.now(),anim:true,combo:0};
  go("#/run");
}
function qHTML(q,opts){
  /* opts: {sel, checked, struck, reveal(answerIdx), pick} */
  opts=opts||{};const L=q.lang,lab=L==="ar"?["أ","ب","ج","د"]:["A","B","C","D"],isSvg=q.kind==="svg";
  const o=q.options.map((x,i)=>{let cls="opt";if(opts.checked){if(i===q.answer)cls+=" right";else if(i===opts.sel)cls+=" wrong";}else if(i===opts.sel)cls+=" sel";if(opts.struck&&opts.struck.has(i)&&!opts.checked)cls+=" struck";
    return `<button class="${cls}" data-act="opt" data-i="${i}" ${opts.checked||opts.readonly?"disabled":""} aria-pressed="${i===opts.sel}"><span class="bub">${lab[i]}</span><span class="body">${x}</span>${!opts.checked&&!opts.readonly&&opts.strike?`<span class="x" data-act="strike" data-i="${i}" role="button" aria-label="${t("strike")}">✕</span>`:""}</button>`;}).join("");
  return `<div class="sheet qcard ${opts.anim?"qin":""}" dir="${L==="ar"?"rtl":"ltr"}" lang="${L}"><div class="qsec ${SECS[q.sec].cls}">${SECS[q.sec][L]}</div>
    <div class="prompt">${q.prompt}</div>${q.visual?`<div>${q.visual}</div>`:""}<div class="opts ${isSvg?"grid":""}">${o}</div>
    ${opts.checked?`<div class="fb ${opts.sel===q.answer?"ok":"no"}">${FX.owl(opts.sel===q.answer?"happy":"sad",54)}<div><b>${L==="ar"?(opts.sel===q.answer?"إجابة صحيحة":"ليست صحيحة"):(opts.sel===q.answer?"Correct":"Not this one")}</b>${opts.sel===q.answer?"":`<br>${L==="ar"?"الإجابة الصحيحة":"The right answer"}: <b>${lab[q.answer]}</b>`}<br>${q.explain}</div></div>`:""}</div>`;
}
function vRun(){
  if(!RUN){go("#/home");return;}
  const q=RUN.items[RUN.i],n=RUN.items.length;
  $("#app").innerHTML=`<div class="wrap"><div class="qtop"><button class="iconbtn" data-act="quitRun" aria-label="${t("quit")}">✕</button><div class="prog"><i style="width:${pct(RUN.i+(RUN.checked?1:0),n)}%"></i></div>${RUN.combo>=3?`<span class="combo">🔥 ${t("combo",{n:RUN.combo})}</span>`:`<span class="small muted">${FR(RUN.i+1,n)}</span>`}</div>
   ${q.fromBook?`<p class="small muted" style="margin:0 4px 8px">${t("book")}</p>`:""}
   ${qHTML(q,{sel:RUN.sel,checked:RUN.checked,struck:RUN.struck,strike:true,anim:RUN.anim})}
   <div class="qfoot"><span class="sp"></span>${RUN.checked?`<button class="btn" data-act="nextQ">${RUN.i+1<n?t("next"):t("finish")}</button>`:`<button class="btn" data-act="checkQ" ${RUN.sel==null?"disabled":""}>${t("check")}</button>`}</div></div>`;
  if(!RUN.checked)RUN.qt=RUN.qt||performance.now();
  RUN.anim=false;
}
function checkQ(){
  const q=RUN.items[RUN.i],ok=RUN.sel===q.answer,ms=performance.now()-RUN.qt;RUN.checked=true;
  RUN.res.push({q,pick:RUN.sel,ok});
  RUN.combo=ok?(RUN.combo||0)+1:0;
  St.record(q,ok,ms,RUN.mode);const up=E.adapt(kid(),q.sec);vRun();
  const right=document.querySelector(".opt.right");
  if(ok){FX.sound.right();FX.buzz(15);FX.burstAt(right,22,.8);FX.floatText(right,"+"+N(10));
    if([3,5,10].includes(RUN.combo)){setTimeout(()=>{FX.burstAt(document.querySelector(".combo"),30,1.1);FX.sound.level();},250);}}
  else{FX.sound.wrong();FX.buzz([30,40,30]);}
  if(up===1)setTimeout(()=>{toast(t("levelUp",{s:secName(q.sec,true)}),"cheer");FX.sound.level();},700);
  const fb=document.querySelector(".fb");fb&&fb.scrollIntoView({block:"nearest",behavior:"smooth"});
}
function nextQ(){
  RUN.i++;RUN.sel=null;RUN.checked=false;RUN.struck=new Set();RUN.qt=performance.now();RUN.anim=true;
  if(RUN.i>=RUN.items.length||(!St.isPro()&&St.freeLeft()<=0)){
    if(RUN.mode==="m"){const kd=St.kid();const dk=St.dayKey();(kd.days[dk]||(kd.days[dk]={n:0,ok:0,ms:0})).mis=1;St.save(kid().id);}
    go("#/done");return;}
  vRun();
}
function vDone(){
  if(!RUN){go("#/home");return;}
  const c=RUN.res.filter(r=>r.ok).length,n=RUN.res.length,stopped=RUN.res.length<RUN.items.length;
  const p=pct(c,n),mood=p>=70?"cheer":p>=40?"happy":"idle";
  page(`<div class="sheet center celebrate" style="padding:22px 18px">${FX.owl(mood,120)}<h2>${t("doneTitle")}</h2><div class="big" style="margin:6px 0"><span data-count="${c}">${N(c)}</span><span class="muted" style="font-size:1.6rem"> / ${N(n)}</span></div>
     <p style="margin:0 0 4px;font-weight:600">${t(p>=70?"done_top":p>=40?"done_mid":"done_low")}</p><p class="muted small" style="margin:0 0 16px">${t("doneScore",{c,n})}</p>
     <div class="row" style="justify-content:center"><button class="btn" data-act="moreRun">${t("more")}</button><a class="btn ghost" href="${RUN.ret}">${t("home")}</a></div></div>
   ${stopped?freeBanner():""}
   <h2 class="h">${t("review")}</h2><div class="sheet">${RUN.res.map(r=>reviewItem(r.q,r.pick)).join("")}</div>`,null,RUN.ret);
  if(!RUN.cheered){RUN.cheered=1;FX.sound.done();if(p>=70)setTimeout(FX.rain,250);}
}
function reviewItem(q,pick){
  const L=q.lang,lab=L==="ar"?["أ","ب","ج","د"]:["A","B","C","D"],ok=pick===q.answer,svgK=q.kind==="svg";
  const show=i=>i==null?`<i>${t("noAns")}</i>`:(svgK?`<span style="display:inline-block;width:70px;vertical-align:middle">${q.options[i]}</span> (${lab[i]})`:`${lab[i]}) ${q.options[i]}`);
  return `<div class="rev" dir="${L==="ar"?"rtl":"ltr"}" lang="${L}"><span class="tag ${ok?"ok":"no"}">${ok?(L==="ar"?"صحيحة":"Correct"):(L==="ar"?"خطأ":"Wrong")}</span> <span class="small muted">${SECS[q.sec][L]}</span>
    <div class="prompt" style="font-size:1rem;margin:8px 0">${q.prompt}</div>${q.visual?`<div style="max-width:260px">${q.visual}</div>`:""}
    <div class="small">${L==="ar"?"إجابتك":"Your answer"}: ${show(pick)}</div>${ok?"":`<div class="small">${L==="ar"?"الصحيحة":"Right answer"}: <b>${show(q.answer)}</b></div>`}
    <div class="small muted" style="margin-top:4px">${q.explain}</div></div>`;
}

/* ---------- mock tests ---------- */
function vMock(){
  const k=kid(),L=E.levelOf(k),lv=NB.LEVELS[L],m=NB.MOCK[L],kd=St.kid(),pro=St.isPro();
  const parts=L===1?12:4;
  const live=St.S.live&&St.S.live.kid===k.id;
  page(`<div class="hello"><h1>${t("mockTitle")}</h1><p class="muted" style="margin:0">${t("level",{l:L})}${SEP()}${t("testLang")}: ${k.lang==="ar"?t("langAr"):t("langEn")}</p></div>
   ${live?`<div class="banner"><p><b>${t("resumeQ")}</b></p><button class="btn sm" data-act="resume">${t("resume")}</button><button class="btn sm ghost" data-act="discard">${t("discard")}</button></div>`:""}
   <div class="sheet"><h2>${t("fullMock")} ${pro?"":I.lock}</h2><p class="sub">${t("fullMockSub",{q:lv.q,m:lv.min,p:parts})}</p>
     ${L===1?`<p class="small" style="margin-top:-6px">${t("fullMockSub1")}</p>`:`<p class="note">${t("approxNote")}</p>`}
     <button class="btn" data-act="mock" data-k="full" ${live?"disabled":""}>${pro?t("start"):t("upgrade")}</button></div>
   <div class="sheet"><h2>${t("miniMock")}</h2><p class="sub">${t("miniMockSub",{q:m.per*4,m:m.min})}</p>
     <button class="btn ghost" data-act="mock" data-k="mini" ${live?"disabled":""}>${pro||St.miniLeft()>0?t("start"):t("upgrade")}</button></div>
   <div class="sheet flat"><h2>${t("rules")}</h2><ul style="margin:6px 0 0;padding-inline-start:20px">${["rule1","rule2","rule3","rule4"].map(r=>`<li>${t(r)}</li>`).join("")}</ul></div>
   ${kd.mocks.length?`<h2 class="h">${t("history")}</h2><div class="list">${kd.mocks.map(mk=>`<a class="item" href="#/result/${mk.id}"><span class="grow"><b>${mk.kind==="full"?t("fullMock"):t("miniMock")}</b><small>${new Date(mk.t).toLocaleDateString(uiLang()==="ar"?"ar-SA-u-nu-arab":"en-GB",{day:"numeric",month:"short"})}${SEP()}${N(mk.correct)}/${N(mk.total)}</small></span><span class="pct">${P(mk.ready)}</span></a>`).join("")}</div>`:""}`,"mock");
}
function startExam(kind){
  const k=kid();
  if(kind==="full"&&!St.isPro()){go("#/upgrade");return;}
  if(kind==="mini"&&!St.isPro()&&St.miniLeft()<=0){go("#/upgrade");return;}
  const ex=E.buildExam(k,kind);
  EXAM={kid:k.id,exam:ex,answers:ex.parts.map(p=>p.qs.map(()=>null)),flags:ex.parts.map(p=>p.qs.map(()=>false)),ms:ex.parts.map(p=>p.qs.map(()=>0)),pi:0,qi:0,phase:"inter",deadline:0,used:0,started:Date.now()};
  persistExam();go("#/exam");
}
function persistExam(){St.S.live=EXAM;St.save();}
function vExam(){
  if(!EXAM){if(St.S.live){EXAM=St.S.live;EXAM.qt=null;}else{go("#/mock");return;}}
  clearInterval(TICK);
  const ex=EXAM.exam,P=ex.parts[EXAM.pi],np=ex.parts.length;
  if(EXAM.phase==="inter"){
    const L=ex.lang;
    $("#app").innerHTML=`<div class="wrap"><div class="sheet inter" dir="${uiLang()==="ar"?"rtl":"ltr"}"><p class="muted">${np>1?t("part",{i:EXAM.pi+1,n:np}):t("miniMock")}</p>
      <div class="big">${P.sec==="mixed"?t("miniMock"):secName(P.sec)}</div>
      <p>${t("partQs",{n:P.qs.length,t:fmtT(P.secs)})}</p><button class="btn" data-act="startPart">${t("startPart")}</button>
      ${EXAM.pi===0?`<p class="note" style="margin-top:18px;text-align:start">${t("rule2")}</p>`:""}</div></div>`;
    return;
  }
  const q=P.qs[EXAM.qi],left=(EXAM.deadline-Date.now())/1000;
  if(left<=0){endPart(true);return;}
  $("#app").innerHTML=`<div class="wrap"><div class="qtop"><span class="small muted">${np>1?t("part",{i:EXAM.pi+1,n:np}):""}</span><div class="prog"><i style="width:${pct(EXAM.qi+1,P.qs.length)}%"></i></div><span class="timer ${left<60?"low":""}" id="tm" role="timer">${fmtT(left)}</span></div>
    ${qHTML(q,{sel:EXAM.answers[EXAM.pi][EXAM.qi]})}
    <div class="qfoot"><button class="btn ghost sm" data-act="exPrev" ${EXAM.qi===0?"disabled":""}>${t("prev")}</button>
      <button class="btn ghost sm" data-act="exFlag">${EXAM.flags[EXAM.pi][EXAM.qi]?t("unflag"):t("flag")}</button><span class="sp"></span>
      ${EXAM.qi+1<P.qs.length?`<button class="btn" data-act="exNext">${t("next")}</button>`:`<button class="btn marker" data-act="exEnd">${t("endPart")}</button>`}</div>
    <div class="navgrid" aria-label="${t("qOf",{i:EXAM.qi+1,n:P.qs.length})}">${P.qs.map((_,i)=>`<button data-act="exGo" data-i="${i}" class="${EXAM.answers[EXAM.pi][i]!=null?"ans":""} ${i===EXAM.qi?"cur":""} ${EXAM.flags[EXAM.pi][i]?"flag":""}">${N(i+1)}</button>`).join("")}</div>
    ${EXAM.qi+1<P.qs.length?`<p class="center" style="margin-top:14px"><button class="link" data-act="exEnd">${t("endPart")}</button></p>`:""}</div>`;
  EXAM.qt=performance.now();
  TICK=setInterval(()=>{const l=(EXAM.deadline-Date.now())/1000,el=$("#tm");if(!el){clearInterval(TICK);return;}if(l<=0){clearInterval(TICK);toast(t("timeUp"));endPart(true);return;}el.textContent=fmtT(l);el.classList.toggle("low",l<60);},1000);
}
function exTime(){if(EXAM&&EXAM.phase==="q"&&EXAM.qt&&performance.now()>EXAM.qt){EXAM.ms[EXAM.pi][EXAM.qi]+=performance.now()-EXAM.qt;EXAM.qt=performance.now();}}
function endPart(auto){
  exTime();clearInterval(TICK);closeModal();
  const P=EXAM.exam.parts[EXAM.pi];EXAM.used+=Math.min(P.secs,Math.max(0,P.secs-(EXAM.deadline-Date.now())/1000));
  if(EXAM.pi+1<EXAM.exam.parts.length){EXAM.pi++;EXAM.qi=0;EXAM.phase="inter";persistExam();vExam();return;}
  finishExam();
}
function finishExam(){
  const ex=EXAM.exam,r=E.score(ex,EXAM.answers),k=St.S.kids.find(x=>x.id===EXAM.kid)||kid();
  ex.parts.forEach((p,pi)=>p.qs.forEach((q,qi)=>{const a=EXAM.answers[pi][qi];St.record(q,a===q.answer,EXAM.ms[pi][qi],"x",k.id);}));
  const id=St.addMock({kind:ex.kind,level:ex.level,lang:ex.lang,total:r.total,correct:r.correct,by:r.by,ready:r.ready,secs:Math.round(EXAM.used),items:r.items,
    q:ex.parts.map(p=>p.qs.map(q=>({sec:q.sec,prompt:q.prompt,visual:q.visual,kind:q.kind,options:q.options,answer:q.answer,explain:q.explain,lang:q.lang})))},k.id);
  EXAM=null;St.S.live=null;St.save();JUST=id;go("#/result/"+id);
}
function vResult(id){
  const kd=St.kid(),m=kd.mocks.find(x=>x.id===id);if(!m){go("#/mock");return;}
  const b=E.band(m.ready);
  const mood=m.ready>=70?"cheer":m.ready>=50?"happy":"idle";
  page(`<div class="sheet center celebrate" style="padding:22px 18px"><p class="muted" style="margin:0">${t("resultTitle")}</p>
     <div class="row" style="justify-content:center;gap:18px;margin:6px 0">${FX.owl(mood,96)}${FX.ring(m.ready/100,128,P(m.ready),t("ready"))}</div>
     <p style="margin:0">${t("band_"+b)}</p><p class="muted small" style="margin:8px 0 0">${t("doneScore",{c:m.correct,n:m.total})}${SEP()}${t("timeUsed")}: ${fmtT(m.secs)}</p></div>
   <p class="note">${t("readyNote")}</p>
   <div class="sheet"><h2>${t("bySec")}</h2><div class="bars">${SEC_KEYS.map(s=>{const [c,n]=m.by[s]||[0,0];return `<div class="bar ${SECS[s].cls}"><span>${secName(s,true)}</span><span class="tr"><i style="width:${pct(c,n)}%;background:var(--c)"></i></span><b>${N(c)}/${N(n)}</b></div>`;}).join("")}</div></div>
   ${m.q?`<button class="btn ghost wide" data-act="showRev" style="margin-bottom:14px">${t("review")}</button><div class="sheet hide" id="rev">${m.items.map(it=>{const q=m.q[it.pi]&&m.q[it.pi][it.qi];return q?reviewItem(Object.assign({},q,{sec:it.sec}),it.pick):"";}).join("")}</div>`:""}
   <div class="row"><a class="btn" href="#/mock">${t("mockTitle")}</a><a class="btn ghost" href="#/report">${t("report")}</a></div>`,null,"#/mock");
  if(JUST===id){JUST=null;FX.sound.done();if(m.ready>=70)setTimeout(FX.rain,300);}
}
let JUST=null;

/* ---------- mistakes notebook ---------- */
function vBook(){
  const k=kid(),due=St.dueBook(k.id),all=St.dueBook(k.id,true);
  page(`<div class="hello"><h1>${t("book")}</h1><p class="muted" style="margin:0">${due.length?t("bookSub",{n:due.length}):t("bookEmpty")}</p></div>
   <div class="row" style="margin-bottom:14px"><button class="btn" data-act="bookRun" ${due.length?"":"disabled"}>${t("start")}</button>${all.length>due.length?`<button class="btn ghost" data-act="bookAll">${uiLang()==="ar"?"راجع كل الأخطاء":"Review all mistakes"} (${N(all.length)})</button>`:""}</div>
   <div class="list">${all.slice(0,40).map(b=>`<div class="item"><span class="grow"><b>${(NB.REG[b.g]&&NB.REG[b.g].label[uiLang()])||b.g}</b><small>${secName(b.s)}</small></span><span class="small muted">${b.due<=Date.now()?(uiLang()==="ar"?"الآن":"now"):new Date(b.due).toLocaleDateString(uiLang()==="ar"?"ar-SA-u-nu-arab":"en-GB",{day:"numeric",month:"short"})}</span></div>`).join("")}</div>`,null,"#/home");
}

/* ---------- word cards ---------- */
function vWords(){
  const k=kid(),W=NB.WORDS[k.lang];if(!W){go("#/home");return;}
  const kd=St.kid(),known=Object.keys((kd.words||{}).known||{}).length;
  if(!WORD||WORD.lang!==k.lang)WORD={lang:k.lang,cat:Object.keys(W.cats)[0],card:null,flip:false};
  if(!WORD.card)WORD.card=W.card(WORD.cat,E.diffFor(k,"verbal"));
  const c=WORD.card,L=k.lang;
  page(`<div class="hello"><h1>${t("words")}</h1><p class="muted" style="margin:0">${t("knownCount",{n:known})}</p></div>
   <div class="chips" style="margin-bottom:12px">${Object.entries(W.cats).map(([key,v])=>`<button class="chip ${key===WORD.cat?"on":""}" data-act="wcat" data-v="${key}">${v.ico} ${v[uiLang()]}</button>`).join("")}</div>
   <button class="sheet wcard" data-act="wflip" style="width:100%;color:inherit" dir="${L==="ar"?"rtl":"ltr"}" lang="${L}">
     <div class="w">${esc(c.front)}</div>
     ${WORD.flip?`<div>${c.line}</div>${c.meaning?`<div class="m" dir="auto">${esc(c.meaning)}</div>`:""}${c.lineAr?`<div class="m" dir="rtl">${esc(c.lineAr)}</div>`:""}`:`<div class="m">${uiLang()==="ar"?"اضغط لرؤية المعنى":"Tap to see the meaning"}</div>`}
   </button>
   <div class="row" style="justify-content:center;margin-bottom:14px"><button class="btn ghost sm" data-act="wsay">🔊 ${t("listen")}</button><button class="btn ghost sm" data-act="wnext" data-k="0">${t("learning")}</button><button class="btn sm" data-act="wnext" data-k="1">${t("know")}</button></div>
   <button class="btn marker wide" data-act="wquiz">${t("wordsQuiz")}</button>`,null,"#/home");
}
function say(text,lang){try{const u=new SpeechSynthesisUtterance(text);u.lang=lang==="ar"?"ar-SA":"en-GB";u.rate=.85;speechSynthesis.cancel();speechSynthesis.speak(u);}catch(e){}}

/* ---------- report ---------- */
function vReport(){
  const k=kid(),kd=St.kid(),pro=St.isPro(),days=St.S.ui.repDays===0?0:30,S=E.summary(k,days||null);
  const genRows=Object.entries(S.gen).filter(([g])=>NB.REG[g]).map(([g,x])=>({g,label:NB.REG[g].label[uiLang()],sec:x.sec,n:x.n,p:pct(x.ok,x.n),ms:x.ms/x.n}));
  const rated=genRows.filter(r=>r.n>=4),strong=rated.slice().sort((a,b)=>b.p-a.p).slice(0,3),weak=rated.slice().sort((a,b)=>a.p-b.p).slice(0,3);
  const spark=[];for(let i=13;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);spark.push(kd.days[St.dayKey(d)]||{n:0});}
  const mx=Math.max(5,...spark.map(x=>x.n));
  const lockBox=`<div class="sheet center"><p>${I.lock} ${t("proOnly")}</p><a class="btn sm marker" href="#/upgrade">${t("upgrade")}</a></div>`;
  page(`<div class="hello"><h1>${t("reportTitle")}</h1><p class="muted" style="margin:0">${esc(k.name)}${SEP()}${gradeName(k.grade)}${SEP()}${t("level",{l:E.levelOf(k)})}</p></div>
   <div class="chips noprint" style="margin-bottom:12px"><button class="chip ${days?"on":""}" data-act="repDays" data-v="30">${t("last30")}</button><button class="chip ${days?"":"on"}" data-act="repDays" data-v="0">${t("allTime")}</button></div>
   <div class="stats"><div class="stat"><b>${N(S.n)}</b><span>${t("totalQ")}</span></div><div class="stat"><b>${P(pct(S.ok,S.n))}</b><span>${t("acc")}</span></div><div class="stat"><b>${N(S.n?Math.round(Object.values(S.sec).reduce((a,x)=>a+x.ms,0)/S.n/1000):0)}</b><span>${t("avgTime")}</span></div></div>
   <div class="sheet"><h2>${t("bySec")}</h2><div class="bars">${SEC_KEYS.map(s=>{const x=S.sec[s]||{n:0,ok:0};return `<div class="bar ${SECS[s].cls}"><span>${secName(s,true)}</span><span class="tr"><i style="width:${pct(x.ok,x.n)}%;background:var(--c)"></i></span><b>${x.n?P(pct(x.ok,x.n)):"–"}</b></div>`;}).join("")}</div></div>
   ${pro?`<div class="sheet"><h2>${t("daily")}</h2><div class="spark" aria-hidden="true">${spark.map(x=>x.n?`<i style="height:${Math.round(100*x.n/mx)}%"></i>`:`<i class="z"></i>`).join("")}</div></div>
   ${rated.length?`<div class="sheet"><h2>${t("strong")}</h2>${strong.map(r=>`<div class="row" style="padding:4px 0"><span class="grow">${r.label}</span><b>${P(r.p)}</b></div>`).join("")}
     <h2 style="margin-top:14px">${t("weak")}</h2>${weak.map(r=>`<div class="row" style="padding:4px 0"><span class="grow">${r.label}</span><b>${P(r.p)}</b><button class="btn sm ghost noprint" data-act="skill" data-g="${r.g}">${t("practiceThis")}</button></div>`).join("")}</div>`:""}
   <div class="sheet"><h2>${t("skillTable")}</h2><table class="sk"><thead><tr><th>${t("skill")}</th><th class="n">${uiLang()==="ar"?"محاولات":"Tries"}</th><th class="n">${t("acc")}</th></tr></thead><tbody>
     ${genRows.sort((a,b)=>a.sec.localeCompare(b.sec)||a.p-b.p).map(r=>`<tr><td><span class="qsec ${SECS[r.sec].cls}" style="margin:0"></span> ${r.label}</td><td class="n">${N(r.n)}</td><td class="n">${P(r.p)}</td></tr>`).join("")||`<tr><td colspan="3" class="muted">${t("noData")}</td></tr>`}</tbody></table></div>
   ${kd.mocks.length?`<div class="sheet"><h2>${t("history")}</h2>${kd.mocks.slice(0,10).map(m=>`<div class="row" style="padding:4px 0"><span class="grow">${m.kind==="full"?t("fullMock"):t("miniMock")} <span class="small muted">${new Date(m.t).toLocaleDateString(uiLang()==="ar"?"ar-SA-u-nu-arab":"en-GB")}</span></span><b>${P(m.ready)}</b></div>`).join("")}</div>`:""}
   ${FRAMED?"":`<button class="btn ghost noprint" data-act="print">${t("print")}</button>`}`:lockBox}`,"report");
}

/* ---------- guide ---------- */
const GUIDE={
ar:`<div class="sheet guide"><h2>ما مقياس موهبة؟</h2><p>مقياس موهبة للقدرات العقلية المتعددة اختبار محوسب تقدّمه مؤسسة موهبة بالتعاون مع هيئة تقويم التعليم والتدريب، ويُستخدم للترشيح لبرامج موهبة. يقيس أربعة مجالات، وأسئلته كلها اختيار من متعدد.</p>
<h3>كيف يُحدَّد المستوى؟</h3><p>المستوى يُحدَّد بالصف الدراسي وقت الاختبار، ولكل مستوى نموذج واحد لجميع صفوفه:</p>
<table><tr><th>المستوى</th><th>الصفوف</th><th>عدد الأسئلة</th></tr><tr><td>الأول</td><td>الثالث والرابع والخامس الابتدائي</td><td>٦٤</td></tr><tr><td>الثاني</td><td>السادس الابتدائي والأول والثاني المتوسط</td><td>٩٦</td></tr><tr><td>الثالث</td><td>الثالث المتوسط والأول الثانوي</td><td>١٢٠</td></tr></table>
<p>تتراوح الدرجة بين ١٠٠٠ و٢٠٠٠، ولا تعتمد على عدد الإجابات الصحيحة فقط، بل على صعوبة الأسئلة أيضًا. وتختلف الدرجة الموزونة بين صفوف المستوى نفسه حتى لا يتأثر الطالب الأصغر بعمره. ويُختبر الطالب مرة واحدة فقط في كل مستوى، وإذا سُجّل في صف غير صفه حُجبت درجته.</p>
<h3>الأقسام الأربعة</h3><table>
<tr><th>القسم</th><th>أنواع الأسئلة</th></tr>
<tr><td>الاستدلال اللغوي وفهم المقروء</td><td>التناظر اللفظي، العلاقات الثلاثية، المقصود بما تحته خط، الترتيب المنطقي، الاستنتاج والفكرة الرئيسة، إكمال الجمل، الخطأ السياقي، فهم المقروء</td></tr>
<tr><td>الاستدلال الرياضي والمكاني</td><td>المسائل اللفظية، المتتاليات، الميزان، الحل العكسي، طي الورق، المكعبات، المرآة والساعة، الأشكال الناقصة</td></tr>
<tr><td>الاستدلال العلمي والميكانيكي</td><td>التروس والبكرات، الروافع والقوى، الجاذبية، دورات الحياة، التجربة العادلة، تحولات المادة والطاقة</td></tr>
<tr><td>المرونة العقلية</td><td>المقدمات غير الواقعية، الكلمة والزوج المناسب، الشكل والزوج المناسب، استنتاج الصفات، الأنماط، الألغاز المنطقية</td></tr></table>
<h3>الزمن وطريقة العرض</h3><p>في المستوى الأول ١٢ قسمًا مؤقتًا: ٨ أقسام قصيرة في كل منها ٤ أسئلة و٦ دقائق، و٤ أقسام طويلة في كل منها ٨ أسئلة و١٣:٤٥ دقيقة، بمجموع ١٠٣ دقائق. ولا يمكن الرجوع إلى قسم بعد انتهاء وقته. أما المستويان الثاني والثالث فلم يُنشر زمنهما رسميًا، والمحاكاة في نبيه تستخدم تقديرًا قريبًا.</p>
<h3>العربي أم الإنجليزي؟</h3><p>يُقدَّم المقياس باللغتين حسب رغبة الطالب. وعند مقارنة النماذج التدريبية الرسمية بالنسختين وجدنا أن النسخة الإنجليزية ترجمة للعربية: الأسئلة نفسها وبالترتيب نفسه في الرياضيات والعلوم والمرونة. أما القسم اللغوي فيتكيّف مع اللغة؛ فسؤال "المقصود بما تحته خط" مثلًا يستخدم في العربي كلمة فصيحة نادرة، وفي الإنجليزي كلمة مخترعة يُفهم معناها من السياق. لذلك كتبنا أسئلة القسم اللغوي في نبيه بكل لغة على حدة.</p>
<p>اختر لغة الاختبار التي يدرس بها طفلك المواد، فالأهم أن يفهم السؤال بسرعة.</p>
<h3>نصائح ليوم الاختبار</h3><ul><li>النوم المبكر أهم من مراجعة الليلة الأخيرة.</li><li>لا تترك سؤالًا بلا إجابة، فالمتروك يُحسب خطأ.</li><li>إذا استعصى سؤال فاختر أقرب إجابة وعلّمه وانتقل، ثم ارجع إليه إن بقي وقت في القسم.</li><li>في المقدمات غير الواقعية التزم بما يقوله السؤال لا بما تعرفه عن الواقع.</li></ul>
<p class="note">المعلومات من الموقع الرسمي لموهبة ونماذجه التدريبية حتى أكتوبر ٢٠٢٦، وقد تتغير. راجع <a href="https://www.mawhiba.sa" target="_blank" rel="noopener">mawhiba.sa</a> لمواعيد التسجيل والرسوم.</p></div>`,
en:`<div class="sheet guide"><h2>What is the Mawhiba test?</h2><p>The Mawhiba Multiple Cognitive Aptitude Test (MMCAT) is a computer-based test run by Mawhiba with the Education and Training Evaluation Commission. It is used to nominate students for Mawhiba programmes. It measures four areas, and every question is multiple choice.</p>
<h3>How is the level decided?</h3><p>The level comes from the student's school grade at the time of the test. Each level has one test for all of its grades:</p>
<table><tr><th>Level</th><th>Grades</th><th>Questions</th></tr><tr><td>1</td><td>Grades 3, 4 and 5</td><td>64</td></tr><tr><td>2</td><td>Grade 6 and Intermediate 1–2 (grades 7–8)</td><td>96</td></tr><tr><td>3</td><td>Intermediate 3 and Secondary 1 (grades 9–10)</td><td>120</td></tr></table>
<p>Scores run from 1000 to 2000. They depend on how hard each question is, not only on how many are right, and the weighting differs by grade so younger students are not disadvantaged. A student can take the test only once per level, and a score is withheld if the student registers in the wrong grade.</p>
<h3>The four sections</h3><table>
<tr><th>Section</th><th>Question types</th></tr>
<tr><td>Linguistic reasoning and reading comprehension</td><td>Word-pair analogies, three-word sequences, meaning from context, ordering, conclusions and main idea, sentence completion, reading passages</td></tr>
<tr><td>Mathematical and spatial reasoning</td><td>Word problems, number series, scales, working backwards, paper folding, cubes, mirrors and clocks, missing shapes</td></tr>
<tr><td>Scientific and mechanical reasoning</td><td>Gears and pulleys, levers and forces, gravity, life cycles, fair tests, matter and energy changes</td></tr>
<tr><td>Mental flexibility</td><td>Unrealistic premises, word and category pairs, shape and category pairs, understanding people, patterns, logic puzzles</td></tr></table>
<h3>Timing and format</h3><p>Level 1 has 12 timed parts: 8 short parts with 4 questions in 6 minutes each, and 4 long parts with 8 questions in 13:45 each, 103 minutes in total. A part cannot be reopened once its time ends. Timing for Levels 2 and 3 has not been published, so Nabeeh uses a close estimate for them.</p>
<h3>Arabic or English?</h3><p>Students choose the language. We compared the official practice tests in both languages: the English version is a translation of the Arabic one, with the same questions in the same order for maths, science and flexibility. The verbal section is adapted to each language. For example, the "meaning from context" question uses a rare real word in Arabic and a made-up word in English. That is why Nabeeh's verbal questions are written separately in each language.</p>
<p>Pick the language your child studies their school subjects in. Understanding the question quickly matters most.</p>
<h3>Test-day tips</h3><ul><li>An early night helps more than last-minute revision.</li><li>Never leave a question blank; blanks count as wrong.</li><li>If a question is stuck, pick the best answer, flag it and move on, then return if time is left in that part.</li><li>With unrealistic premises, follow what the question says, not what is true in real life.</li></ul>
<p class="note">Based on Mawhiba's official website and practice tests as of October 2026; details may change. Check <a href="https://www.mawhiba.sa/en" target="_blank" rel="noopener">mawhiba.sa</a> for registration dates and fees.</p></div>`};
function vGuide(){page(`<div class="hello"><h1>${t("guide")}</h1></div>${GUIDE[uiLang()]}<p class="note">${t("disclaimer")}</p>`,null,"#/home");}

/* ---------- settings, account, upgrade ---------- */
function vSettings(){
  const u=NBCloud.user(),pro=St.isPro();
  page(`<div class="hello"><h1>${t("settings")}</h1></div>
   <div class="sheet"><h2>${t("chooseUi")}</h2><div class="seg"><button data-act="ui" data-v="ar" aria-pressed="${uiLang()==="ar"}">العربية</button><button data-act="ui" data-v="en" aria-pressed="${uiLang()==="en"}">English</button></div>
     <label class="switch" style="margin-top:12px"><span>${t("soundFx")}</span><input type="checkbox" id="sfx" data-act="sound" ${FX.sound.isOn()?"checked":""}></label>
     <h2 style="margin-top:16px">${t("theme")}</h2><div class="seg">${["auto","light","dark"].map(th=>`<button data-act="theme" data-v="${th}" aria-pressed="${(St.S.ui.theme||"auto")===th}">${t("theme"+th[0].toUpperCase()+th.slice(1))}</button>`).join("")}</div></div>
   <div class="sheet"><h2>${t("kids")}</h2><div class="list">${St.S.kids.map(k=>`<a class="item" href="#/kid/${k.id}"><span style="font-size:1.4rem">${k.avatar}</span><span class="grow"><b>${esc(k.name)}</b><small>${gradeName(k.grade)}${SEP()}${k.lang==="ar"?t("langAr"):t("langEn")}</small></span></a>`).join("")}</div>
     <a class="btn ghost sm" href="#/kid/new" style="margin-top:10px">${t("addKid")}</a></div>
   <div class="sheet"><h2>${t("upgrade")}</h2>${pro?`<p class="ok" style="margin:0"><b>${t("proOn")}</b></p>`:`<p class="sub">${t("upgradeSub")}</p><a class="btn marker" href="#/upgrade">${t("upgrade")}</a>`}</div>
   <div class="sheet"><h2>${t("account")}</h2>${NBCloud.enabled()?(u?`<p class="sub">${t("signedAs",{e:esc(u.email||"")})}</p><button class="btn ghost sm" data-act="signOut">${t("signOut")}</button>`:`<p class="sub">${t("signInSync")}</p><a class="btn sm" href="#/auth">${t("signIn")}</a>`):`<p class="sub" style="margin:0">${t("localOnly")}</p>`}</div>
   <div class="sheet"><h2>${t("data")}</h2><div class="row">${FRAMED?"":`<button class="btn ghost sm" data-act="export">${t("exportData")}</button>`}<button class="btn ghost sm" data-act="reset">${t("resetData")}</button></div></div>
   <p class="small center"><a href="privacy.html">${t("privacy")}</a> &nbsp; <a href="terms.html">${t("terms")}</a>${C.supportEmail?` &nbsp; <a href="mailto:${esc(C.supportEmail)}">${t("support")}</a>`:""}${C.whatsapp?` &nbsp; <a href="https://wa.me/${esc(C.whatsapp)}" target="_blank" rel="noopener">WhatsApp</a>`:""}</p>
   <p class="note">${t("disclaimer")}</p>`,null,"#/home");
}
function vUpgradeIOS(){
  const pro=St.isPro();
  page(`<div class="hero-home">${FX.owl(pro?"cheer":"happy",92)}<div><h1>${t("upgrade")}</h1><p class="muted" style="margin:0">${t("upgradeSub")}</p></div></div>
   ${pro?`<div class="sheet"><p class="ok"><b>${t("proOn")}</b></p></div>`:`
   <div class="sheet"><ul style="margin:0 0 14px;padding-inline-start:20px">${t("feats").map(f=>`<li style="margin-bottom:6px">${f}</li>`).join("")}</ul>
     <p style="margin:0 0 12px"><span class="big" style="font-size:2.2rem" dir="ltr">${NBIAP.price?esc(NBIAP.price):""}</span>${NBIAP.ready?"":`<span class="small muted">${t("storeLoading")}</span>`}</p>
     <button class="btn marker wide" data-act="iapBuy" ${NBIAP.ready&&!NBIAP.busy?"":"disabled"}>${NBIAP.busy?t("wait"):t("buyIap")}</button>
     <p class="note" style="margin-top:12px">${t("familyNote")}</p></div>`}
   <p class="center"><button class="link" data-act="iapRestore">${t("restore")}</button></p>
   <p class="small center"><a href="terms.html">${t("terms")}</a> &nbsp; <a href="privacy.html">${t("privacy")}</a></p>`,null,"#/home");
}
function vUpgrade(){
  if(window.NBIAP&&NBIAP.ios())return vUpgradeIOS();
  const pro=St.isPro(),local=!NBCloud.enabled();
  page(`<div class="hello"><h1>${t("upgrade")}</h1><p class="muted" style="margin:0">${t("upgradeSub")}</p></div>
   ${pro?`<div class="sheet"><p class="ok"><b>${t("proOn")}</b></p></div>`:`
   <div class="sheet"><ul style="margin:0 0 14px;padding-inline-start:20px">${t("feats").map(f=>`<li style="margin-bottom:6px">${f}</li>`).join("")}</ul>
     <p style="margin:0 0 12px"><span class="big" style="font-size:2.2rem">${N(C.price.sar)}</span> ${uiLang()==="ar"?"ريال":"SAR"}<br><span class="small muted">${C.price.note[uiLang()]}</span></p>
     ${C.buyUrl?`<a class="btn marker wide" href="${esc(C.buyUrl)}" target="_blank" rel="noopener">${t("buy")}</a>`:""}</div>
   <div class="sheet"><h2>${t("haveCode")}</h2>
     ${!local&&!NBCloud.user()?`<p class="sub">${t("e_needLogin")}</p><a class="btn sm" href="#/auth?next=upgrade">${t("signIn")}</a>`:`
     <form id="codef"><label class="f">${t("codeLabel")}<input class="in" name="code" placeholder="NB-XXXX-XXXX-XXXX" dir="ltr" autocomplete="off" autocapitalize="characters" required></label><p class="err hide" id="cerr"></p><button class="btn" type="submit">${t("activate")}</button></form>
     ${local?`<p class="note" style="margin-top:12px">${uiLang()==="ar"?"نسخة معاينة على هذا الجهاز: كود التجربة ":"Preview build on this device: demo code "}<b dir="ltr" style="white-space:nowrap">${esc(C.demoCode)}</b></p>`:""}`}</div>`}`,null,"#/home");
}
async function activateCode(f){
  const code=new FormData(f).get("code"),err=$("#cerr");err.classList.add("hide");
  if(!NBCloud.enabled()){
    if(String(code).toUpperCase().replace(/\s/g,"")===C.demoCode.toUpperCase()){St.setPro({code:"DEMO",since:Date.now()});toast(t("activated"));go("#/home");}
    else{err.textContent=t("e_badCode");err.classList.remove("hide");}return;}
  try{await NBCloud.activate(code);toast(t("activated"));go("#/home");}
  catch(e){err.textContent=t("e_"+(e.code||"unknown"));err.classList.remove("hide");}
}
function vAuth(){
  if(!NBCloud.enabled()){go("#/settings");return;}
  const mode=AUTHMODE||"in";
  page(`<div class="hello"><h1>${mode==="in"?t("signIn"):t("signUp")}</h1><p class="muted" style="margin:0">${t("signInSync")}</p></div>
   <div class="sheet"><div class="seg" style="margin-bottom:14px"><button data-act="amode" data-v="in" aria-pressed="${mode==="in"}">${t("haveAcc")}</button><button data-act="amode" data-v="up" aria-pressed="${mode==="up"}">${t("newAcc")}</button></div>
    <form id="authf"><label class="f">${t("email")}<input class="in" type="email" name="email" dir="ltr" autocomplete="email" required></label>
     <label class="f">${t("password")}<input class="in" type="password" name="pass" dir="ltr" autocomplete="${mode==="in"?"current-password":"new-password"}" minlength="6" required></label>
     <p class="err hide" id="aerr"></p><button class="btn wide" type="submit">${mode==="in"?t("signIn"):t("signUp")}</button></form>
    ${mode==="in"?`<p class="center" style="margin:10px 0 0"><button class="link" data-act="forgot">${t("forgot")}</button></p>`:""}
    <hr style="border:0;border-top:1.5px solid var(--rule);margin:16px 0"><button class="btn ghost wide" data-act="google">${t("google")}</button></div>`,null,"#/settings");
}
let AUTHMODE="in";
async function doAuth(f){
  const d=Object.fromEntries(new FormData(f)),err=$("#aerr");err.classList.add("hide");
  try{if(AUTHMODE==="in")await NBCloud.signIn(d.email,d.pass);else await NBCloud.signUp(d.email,d.pass);afterAuth();}
  catch(e){err.textContent=t("e_"+(e.code||"unknown"));err.classList.remove("hide");}
}
function afterAuth(){toast(t("saved"));const next=(location.hash.split("next=")[1]||"");go(St.S.kids.length?(next==="upgrade"?"#/upgrade":"#/home"):"#/home");}

/* ---------- router ---------- */
function go(h){if(location.hash===h)route();else location.hash=h;}
function route(){
  clearInterval(TICK);closeModal();applyUi();
  const h=(location.hash||"#/home").replace(/\?.*$/,""),[,r,a]=h.split("/");
  if(!St.S.kids.length&&!["auth","settings"].includes(r)){vWelcome();return;}
  if(!kid()){St.setActive(St.S.kids[0].id);}
  if(EXAM&&r!=="exam"){/* leaving an exam keeps it saved; it can be resumed */ exTime();persistExam();EXAM=null;}
  switch(r){
    case "home":return vHome();case "practice":return a?vSection(a):vPractice();case "run":return vRun();case "done":return vDone();
    case "mock":return vMock();case "exam":return vExam();case "result":return vResult(a);case "book":return vBook();case "words":return vWords();
    case "report":return vReport();case "guide":return vGuide();case "settings":return vSettings();case "kid":return vKid(a);
    case "upgrade":return vUpgrade();case "auth":return vAuth();default:return vHome();
  }
}

/* ---------- events ---------- */
document.addEventListener("click",e=>{
  const el=e.target.closest("[data-act]");if(!el)return;const act=el.dataset.act;const k=kid();
  switch(act){
    case "ui":St.S.ui.lang=el.dataset.v;St.save();route();break;
    case "theme":St.S.ui.theme=el.dataset.v;St.save();route();break;
    case "av":e.preventDefault();el.parentElement.querySelectorAll("button").forEach(b=>b.setAttribute("aria-pressed",b===el));el.closest("form").avatar.value=el.dataset.v;break;
    case "tl":e.preventDefault();el.parentElement.querySelectorAll("button").forEach(b=>b.setAttribute("aria-pressed",b===el));el.closest("form").lang.value=el.dataset.v;break;
    case "delKid":{const kk=St.S.kids.find(x=>x.id===el.dataset.id);modal(`<h2>${t("delKidQ",{n:esc(kk.name)})}</h2><div class="row" style="margin-top:14px"><button class="btn danger" data-act="delKidYes" data-id="${kk.id}">${t("del")}</button><button class="btn ghost" data-act="closeModal">${t("cancel")}</button></div>`);break;}
    case "delKidYes":St.removeKid(el.dataset.id);closeModal();go(St.S.kids.length?"#/settings":"#/home");break;
    case "closeModal":closeModal();break;
    case "owl":{const o=$("#homeOwl");FX.setMood(o,"happy");FX.sound.tap();FX.burstAt(o,14,.6);toast(tip(),"happy");setTimeout(()=>FX.setMood(o,"idle"),1300);break;}
    case "sound":FX.sound.set(el.checked);if(el.checked)FX.sound.right();break;
    case "iapBuy":NBIAP.buy();vUpgrade();break;
    case "iapRestore":NBIAP.restore().then(()=>{toast(St.isPro()?t("restored"):t("noRestore"),St.isPro()?"cheer":null);route();});break;
    case "kids":modal(`<h2>${t("kids")}</h2><div class="list" style="margin:12px 0">${St.S.kids.map(x=>`<button class="item" data-act="pickKid" data-id="${x.id}"><span style="font-size:1.4rem">${x.avatar}</span><span class="grow"><b>${esc(x.name)}</b><small>${gradeName(x.grade)}</small></span>${x.id===k.id?"✓":""}</button>`).join("")}</div><a class="btn ghost sm" href="#/kid/new">${t("addKid")}</a>`);break;
    case "pickKid":St.setActive(el.dataset.id);closeModal();WORD=null;route();break;
    case "mission":FX.sound.tap();startRun(E.mission(k,10),t("mission"),"#/home","m");break;
    case "secSet":startRun(E.sectionSet(k,el.dataset.s,10),secName(el.dataset.s),"#/practice/"+el.dataset.s);break;
    case "skill":startRun(E.skillSet(k,el.dataset.g,8),NB.REG[el.dataset.g].label[uiLang()],"#/practice/"+NB.REG[el.dataset.g].sec);break;
    case "bookRun":startRun(E.bookSet(k,false),t("book"),"#/book");break;
    case "bookAll":startRun(E.bookSet(k,true),t("book"),"#/book");break;
    case "opt":if(!RUN||RUN.checked||!location.hash.startsWith("#/run"))break;if(e.target.closest(".x"))break;RUN.sel=+el.dataset.i;RUN.struck.delete(RUN.sel);FX.sound.tap();vRun();break;
    case "strike":e.stopPropagation();{const i=+el.dataset.i;if(RUN.struck.has(i))RUN.struck.delete(i);else{RUN.struck.add(i);if(RUN.sel===i)RUN.sel=null;}vRun();}break;
    case "checkQ":checkQ();break;case "nextQ":nextQ();break;
    case "quitRun":RUN&&RUN.res.length?go("#/done"):go(RUN?RUN.ret:"#/home");break;
    case "moreRun":{const r=RUN;const m=r.mode;if(m==="m")startRun(E.mission(k,10),r.title,r.ret,"m");else if(r.ret.startsWith("#/practice/")){const s=r.ret.split("/")[2];const g=r.items[0].gen;const sameSkill=r.items.every(q=>q.gen===g);startRun(sameSkill?E.skillSet(k,g,8):E.sectionSet(k,s,10),r.title,r.ret);}else if(r.ret==="#/book")startRun(E.bookSet(k,true),r.title,r.ret);else startRun(E.mission(k,10),r.title,r.ret,"m");break;}
    case "mock":startExam(el.dataset.k);break;
    case "resume":EXAM=St.S.live;if(EXAM)EXAM.qt=null;go("#/exam");break;
    case "discard":St.S.live=null;St.save();route();break;
    case "startPart":{const P=EXAM.exam.parts[EXAM.pi];EXAM.phase="q";EXAM.qi=0;EXAM.deadline=Date.now()+P.secs*1000;persistExam();vExam();break;}
    case "exPrev":exTime();EXAM.qi--;persistExam();vExam();break;
    case "exNext":exTime();EXAM.qi++;persistExam();vExam();break;
    case "exGo":exTime();EXAM.qi=+el.dataset.i;persistExam();vExam();break;
    case "exFlag":EXAM.flags[EXAM.pi][EXAM.qi]=!EXAM.flags[EXAM.pi][EXAM.qi];persistExam();vExam();break;
    case "exEnd":{const un=EXAM.answers[EXAM.pi].filter(a=>a==null).length;modal(`<h2>${t("endPartQ")}</h2><p class="sub">${t("endPartWarn",{n:un})}</p><div class="row"><button class="btn marker" data-act="exEndYes">${t("confirm")}</button><button class="btn ghost" data-act="closeModal">${t("cancel")}</button></div>`);break;}
    case "exEndYes":endPart(false);break;
    case "showRev":$("#rev").classList.toggle("hide");break;
    case "wcat":WORD.cat=el.dataset.v;WORD.card=null;WORD.flip=false;vWords();break;
    case "wflip":WORD.flip=!WORD.flip;vWords();if(WORD.flip)say(WORD.card.say||WORD.card.front,kid().lang);break;
    case "wsay":say(WORD.card.say||WORD.card.front,kid().lang);break;
    case "wnext":{const kd=St.kid();kd.words=kd.words||{known:{}};if(el.dataset.k==="1")kd.words.known[WORD.card.front]=1;else delete kd.words.known[WORD.card.front];St.save(k.id);WORD.card=null;WORD.flip=false;vWords();break;}
    case "wquiz":{const W=NB.WORDS[k.lang];startRun(E.skillSet(k,W.quiz[WORD.cat],8),t("words"),"#/words");break;}
    case "repDays":St.S.ui.repDays=+el.dataset.v;St.save();vReport();break;
    case "print":window.print();break;
    case "export":{const b=new Blob([St.exportJSON()],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(b);a.download="nabeeh-progress.json";a.click();setTimeout(()=>URL.revokeObjectURL(a.href),2000);break;}
    case "reset":modal(`<h2>${t("resetQ")}</h2><div class="row" style="margin-top:14px"><button class="btn danger" data-act="resetYes">${t("del")}</button><button class="btn ghost" data-act="closeModal">${t("cancel")}</button></div>`);break;
    case "resetYes":St.resetAll();closeModal();go("#/home");break;
    case "signOut":NBCloud.signOut().then(()=>{St.resetAll();go("#/home");});break;
    case "amode":AUTHMODE=el.dataset.v;vAuth();break;
    case "google":NBCloud.google().then(afterAuth).catch(er=>{const x=$("#aerr");if(x){x.textContent=t("e_"+(er.code||"unknown"));x.classList.remove("hide");}});break;
    case "forgot":{const f=$("#authf"),em=f.email.value,x=$("#aerr");NBCloud.reset(em).then(()=>{x.textContent=t("resetSent");x.className="ok";}).catch(er=>{x.textContent=t("e_"+(er.code||"unknown"));x.classList.remove("hide");});break;}
  }
});
/* exam answer clicks reuse the option buttons */
document.addEventListener("click",e=>{
  if(!EXAM||EXAM.phase!=="q")return;const el=e.target.closest(".opt");if(!el||!$(".navgrid"))return;
  e.stopImmediatePropagation();FX.sound.tap();const i=+el.dataset.i;EXAM.answers[EXAM.pi][EXAM.qi]=EXAM.answers[EXAM.pi][EXAM.qi]===i?null:i;persistExam();
  document.querySelectorAll(".opt").forEach((b,j)=>{b.classList.toggle("sel",EXAM.answers[EXAM.pi][EXAM.qi]===j);b.setAttribute("aria-pressed",EXAM.answers[EXAM.pi][EXAM.qi]===j);});
  const nb=document.querySelectorAll(".navgrid button")[EXAM.qi];nb&&nb.classList.toggle("ans",EXAM.answers[EXAM.pi][EXAM.qi]!=null);
},true);
document.addEventListener("submit",e=>{
  e.preventDefault();const f=e.target;
  if(f.id==="kidf")saveKidForm(f);else if(f.id==="codef")activateCode(f);else if(f.id==="authf")doAuth(f);
});
document.addEventListener("change",e=>{if(e.target.name==="grade"){const h=$("#lvlhint");if(h)h.textContent=t("levelAuto",{l:levelLabel(e.target.value)});}});
window.addEventListener("hashchange",route);
document.addEventListener("visibilitychange",()=>{if(document.hidden){exTime();if(EXAM)persistExam();St.flush();}});

/* ---------- start ---------- */
async function boot(){
  applyUi();route();
  if(window.NBIAP&&NBIAP.ios()){NBIAP.init();let was=St.isPro();NBIAP.on(()=>{const now=St.isPro();if(now&&!was){toast(t("activated"),"cheer");FX.sound.level();FX.rain();}was=now;if(/^#\/upgrade/.test(location.hash))vUpgrade();});}
  if(NBCloud.enabled()){try{await NBCloud.init();NBCloud.onUser(()=>route());route();}catch(e){console.warn("cloud",e);}}
  /* offline support on the real site; skipped inside previews that embed the page in a frame */
  if("serviceWorker" in navigator&&location.protocol==="https:"&&window.top===window)navigator.serviceWorker.register("sw.js").catch(()=>{});
}
St.on(()=>{});
window.NBApp={go,route};
boot();
})();
