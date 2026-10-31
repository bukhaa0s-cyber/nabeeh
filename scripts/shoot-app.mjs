/* Nabeeh — captures the raw app screens for the App Store (store-shots2/n-<lang>-<n>.png, 1206×2622)
   with a seeded child so every screen has real-looking data.  node scripts/shoot-app.mjs [ar|en] */
import {chromium} from "playwright";import http from "node:http";import fs from "node:fs";import path from "node:path";
const ROOT=path.resolve(path.dirname(new URL(import.meta.url).pathname),"..");
const srv=http.createServer((q,r)=>{let f=path.join(ROOT,q.url.split("?")[0]);fs.readFile(f,(e,d)=>{if(e){r.statusCode=404;r.end();}else{r.setHeader("content-type",f.endsWith(".js")?"text/javascript":f.endsWith(".html")?"text/html":f.endsWith(".css")?"text/css":"application/octet-stream");r.end(d);}});}).listen(8766);
const U="http://localhost:8766/app.html";
const langs=process.argv[2]?[process.argv[2]]:["ar","en"];
const b=await chromium.launch();
const DAY=864e5,NOW=Date.parse("2026-10-24T10:00:00");
for(const lang of langs){
  const c=await b.newContext({viewport:{width:402,height:874},deviceScaleFactor:3,serviceWorkers:"block"});const p=await c.newPage();
  await p.clock.install({time:NOW-20*DAY});
  await p.goto(U);await p.waitForTimeout(400);
  const name=lang==="ar"?"سارة":"Sara";
  await p.evaluate(({lang,name})=>{NBStore.S.ui.lang=lang;NBStore.S.ui.notifAsked=1;NBStore.S.ui.updChk=Date.now()+1e12;NBStore.S.ui.lessSeen={};NBStore.S.pro={code:"store"};const d=new Date(Date.now()+40*864e5);NBStore.addKid({name,grade:5,lang:lang==="ar"?"ar":"en",avatar:"🦊",testDate:d.toISOString().slice(0,10)});NBStore.save();},{lang,name});
  /* 18 days of practice with rising accuracy */
  for(let day=0;day<19;day++){
    await p.clock.setFixedTime(NOW-(19-day)*DAY+3600e3*(day%3));
    if(day%6===4)continue;
    const n=10+(day%4)*4,acc=.5+day*.02;
    await p.evaluate(({n,acc})=>{const k=NBStore.activeKid();for(let i=0;i<n;i++){const sec=NB.SEC_KEYS[i%4];const q=NBEngine.sectionSet(k,sec,1)[0];if(!q)continue;const ok=Math.random()<(sec==="verbal"?acc+.15:sec==="flex"?acc-.12:acc);NBStore.record(q,ok,20000+Math.random()*50000,"p");}},{n,acc});
    if(day===8||day===15){await p.evaluate(()=>{const k=NBStore.activeKid();const ex=NBEngine.buildExam(k,"mini");const answers=ex.parts.map(pp=>pp.qs.map(q=>Math.random()<.68?q.answer:(q.answer+1)%4));const r=NBEngine.score(ex,answers);NBStore.addMock({kind:"mini",level:ex.level,lang:ex.lang,total:r.total,correct:r.correct,by:r.by,ready:r.ready,secs:1310,items:r.items,pace:{ms:ex.parts.map(pp=>pp.qs.map(()=>Math.round(40+Math.random()*90))),tq:ex.parts.map(pp=>Math.round(pp.secs/pp.qs.length))},q:ex.parts.map(pp=>pp.qs.map(q=>({sec:q.sec,prompt:q.prompt,visual:q.visual,kind:q.kind,options:q.options,answer:q.answer,explain:q.explain,lang:q.lang,gen:q.gen})))},k.id);});}
  }
  await p.clock.setFixedTime(NOW);
  await p.evaluate(()=>{const k=NBStore.activeKid();NBBadges.check(k);const kd=NBStore.kid();kd.lvl=NBBadges.level(kd.xp||0).i;NBStore.save(k.id);});
  const shot=async(n)=>{await p.waitForTimeout(700);await p.screenshot({path:path.join(ROOT,"store-shots2",`n-${lang}-${n}.png`)});};
  await p.goto(U+"#/home");await p.reload();await p.waitForTimeout(900);await p.evaluate(()=>{document.querySelector("#modal")?.remove();});await shot(1);
  await p.goto(U+"#/lessons");await p.waitForTimeout(400);await p.click("[data-act=lesson][data-f=pattern]");await p.waitForTimeout(300);await p.click(".lesson summary");await shot(2);
  await p.goto(U+"#/mock");await p.waitForTimeout(300);await p.click("[data-act=speed]");await p.waitForTimeout(500);await p.click("[data-act=opt] >> nth=1");await shot(3);
  await p.goto(U+"#/mock");await p.waitForTimeout(400);const id=await p.evaluate(()=>NBStore.kid().mocks[0].id);await p.goto(U+"#/result/"+id);await shot(4);
  await p.goto(U+"#/report");await shot(5);
  await p.goto(U+"#/badges");await shot(6);
  await p.goto(U+"#/result/"+id);await p.waitForTimeout(300);await p.evaluate(()=>{window.__noGate=1;});
  await p.click("[data-act=share][data-k=mock]");await p.waitForTimeout(300);
  {const q=await p.evaluate(()=>document.querySelector("#modal p").textContent);const ar="٠١٢٣٤٥٦٧٨٩";const nums=[...q].map(ch=>ar.includes(ch)?ar.indexOf(ch):/\d/.test(ch)?+ch:null).filter(x=>x!==null);await p.fill("#pgIn",String(nums[0]*nums[1]));await p.click("[data-act=pgOk]");await p.waitForTimeout(1500);}
  await p.click("[data-act=shareName]");await p.waitForTimeout(1500);await shot(7);
  await c.close();console.log("done",lang);
}
await b.close();srv.close();
