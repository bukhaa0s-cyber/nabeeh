/* Nabeeh — Scientific & mechanical reasoning generators (English + Arabic). */
(function(){
"use strict";
const {rnd,pick,shuffle,nearNums,tr,make,reg,bpick,svg,optSvg,shp,qmark,txt,INK,COLORS}=NB;
const SEC="science";
const CW=L=>tr(L)("Clockwise ↻","مع عقارب الساعة ↻"),CCW=L=>tr(L)("Counter-clockwise ↺","عكس عقارب الساعة ↺");

/* ---------- 1. Gear chains and belts ---------- */
function gear(cx,cy,r,label,col){return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${col}" stroke-width="10" stroke-dasharray="7 6"/><circle cx="${cx}" cy="${cy}" r="${r-7}" fill="${col}" fill-opacity=".2" stroke="${col}" stroke-width="3"/>`+txt(cx,cy+9,26,label);}
function genGears(d,L){
  const T=tr(L),LAB=L==="ar"?["أ","ب","ج","د","هـ"]:["A","B","C","D","E"];
  if(d>=4&&Math.random()<.5){
    const crossed=Math.random()<.5,cw=Math.random()<.5,R=34,ax=60,bx=200,y=70;
    let inner=`<circle cx="${ax}" cy="${y}" r="${R}" fill="#DCEBFB" stroke="${INK}" stroke-width="3"/><circle cx="${bx}" cy="${y}" r="${R}" fill="#FCE3EC" stroke="${INK}" stroke-width="3"/>`+txt(ax,y+9,24,LAB[0])+txt(bx,y+9,24,LAB[1]);
    inner+=crossed?`<line x1="${ax}" y1="${y-R}" x2="${bx}" y2="${y+R}" stroke="${INK}" stroke-width="4"/><line x1="${ax}" y1="${y+R}" x2="${bx}" y2="${y-R}" stroke="${INK}" stroke-width="4"/>`
                  :`<line x1="${ax}" y1="${y-R}" x2="${bx}" y2="${y-R}" stroke="${INK}" stroke-width="4"/><line x1="${ax}" y1="${y+R}" x2="${bx}" y2="${y+R}" stroke="${INK}" stroke-width="4"/>`;
    inner+=txt(ax,22,28,cw?"↻":"↺",{c:"#E2457A"});
    const ansCw=crossed?!cw:cw;
    return make(SEC,T(`Wheel ${LAB[0]} turns ${cw?"clockwise ↻":"counter-clockwise ↺"} and drives wheel ${LAB[1]} with a ${crossed?"crossed":"straight"} belt. Which way does wheel ${LAB[1]} turn?`,`العجلة ${LAB[0]} تدور ${cw?"مع عقارب الساعة ↻":"عكس عقارب الساعة ↺"} وتحرّك العجلة ${LAB[1]} بحزام ${crossed?"متقاطع":"مستقيم"}. في أي اتجاه تدور العجلة ${LAB[1]}؟`),
      svg(260,140,inner,"belt drive","vis",320),ansCw?CW(L):CCW(L),[ansCw?CCW(L):CW(L),T("It does not move","لا تتحرك"),T("It turns one way, then the other","تدور مرة في اتجاه ثم في الاتجاه الآخر")],
      crossed?T("A crossed belt makes the second wheel turn the opposite way.","الحزام المتقاطع يجعل العجلة الثانية تدور في الاتجاه المعاكس."):T("A straight belt makes both wheels turn the same way.","الحزام المستقيم يجعل العجلتين تدوران في الاتجاه نفسه."),null,null,{anim:"belt",crossed,cw,lab:[LAB[0],LAB[1]]});
  }
  const n=d<=2?rnd(2,3):rnd(3,5),cw=Math.random()<.5,r=30,step=64,w=n*step+20;
  let inner="";const cols=["#2F7FD8","#F2A900","#2BA57F","#7B5CD6","#E2457A"];
  for(let i=0;i<n;i++)inner+=gear(42+i*step,70,r,LAB[i],cols[i]);
  inner+=txt(42,26,30,cw?"↻":"↺",{c:"#E2457A"});
  const ansCw=n%2===1?cw:!cw,last=LAB[n-1];
  return make(SEC,T(`Gear ${LAB[0]} turns ${cw?"clockwise ↻":"counter-clockwise ↺"}. Which way does gear ${last} turn?`,`الترس ${LAB[0]} يدور ${cw?"مع عقارب الساعة ↻":"عكس عقارب الساعة ↺"}. في أي اتجاه يدور الترس ${last}؟`),
    svg(w,112,inner,"row of gears","vis",Math.min(440,w*1.3)),ansCw?CW(L):CCW(L),[ansCw?CCW(L):CW(L),T("It does not move","لا يتحرك"),T("It turns one way, then the other","يدور مرة في اتجاه ثم في الآخر")],
    T("Touching gears always turn opposite ways, so the direction switches at every gear along the row.","الترسان المتلامسان يدوران دائمًا في اتجاهين متعاكسين، فيتبدل الاتجاه عند كل ترس في الصف."),null,null,{anim:"gears",n,cw,lab:LAB.slice(0,n)});
}
reg("gears",SEC,genGears,{en:"Gears and belts",ar:"التروس والأحزمة",min:1,max:7});

/* ---------- 2. Gear teeth and speed ---------- */
function genGearTeeth(d,L){
  const T=tr(L),LAB=L==="ar"?["أ","ب"]:["A","B"],t1=pick([8,10,12]),turns=pick([2,3,4]),t2=t1*turns;
  const g=(cx,cy,r,n,col,lab)=>`<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${col}" stroke-width="9" stroke-dasharray="6 6"/><circle cx="${cx}" cy="${cy}" r="${r-7}" fill="${col}" fill-opacity=".18" stroke="${col}" stroke-width="3"/>`+txt(cx,cy-2,19,lab)+txt(cx,cy+16,13,T(n+" teeth",n+" سنًّا"),{w:500});
  const inner=g(56,70,42,t1,"#2F7FD8",LAB[0])+g(166,70,62,t2,"#E2457A",LAB[1]);
  if(d>=7&&Math.random()<.5){const rpm=t2/t1*pick([10,15,20,30]),b=rpm/turns;
    return make(SEC,T(`Gear ${LAB[0]} (${t1} teeth) turns ${rpm} times a minute. How many times a minute does gear ${LAB[1]} (${t2} teeth) turn?`,`الترس ${LAB[0]} (${t1} سنًّا) يدور ${rpm} دورة في الدقيقة. كم دورة في الدقيقة يدور الترس ${LAB[1]} (${t2} سنًّا)؟`),svg(240,145,inner,"two gears","vis",280),String(b),nearNums(b,[rpm*turns,rpm,rpm-b,b*2,b+5]).map(String),
      T(`Teeth passing per minute match: ${rpm} × ${t1} = ${rpm*t1}, and ${rpm*t1} ÷ ${t2} = ${b}.`,`عدد الأسنان العابرة في الدقيقة متساوٍ: ${rpm} × ${t1} = ${rpm*t1}، و ${rpm*t1} ÷ ${t2} = ${b}.`));}
  return make(SEC,T(`Gear ${LAB[0]} has ${t1} teeth and gear ${LAB[1]} has ${t2} teeth. When gear ${LAB[1]} turns once, how many times does gear ${LAB[0]} turn?`,`للترس ${LAB[0]} ${t1} سنًّا وللترس ${LAB[1]} ${t2} سنًّا. عندما يدور الترس ${LAB[1]} دورة واحدة، كم دورة يدور الترس ${LAB[0]}؟`),
    svg(240,145,inner,"two gears","vis",280),String(turns),nearNums(turns,[1,turns+1,turns*2,t2-t1,turns-1]).map(String),
    T(`In one turn, gear ${LAB[1]} moves ${t2} teeth past. Gear ${LAB[0]} must turn ${t2} ÷ ${t1} = ${turns} times.`,`في دورة واحدة يمر ${t2} سنًّا من الترس ${LAB[1]}، فيدور الترس ${LAB[0]} ${t2} ÷ ${t1} = ${turns} دورات.`));
}
reg("gearTeeth",SEC,genGearTeeth,{en:"Gear teeth",ar:"أسنان التروس",min:4,max:9});

/* ---------- 3. Balances ---------- */
function seesaw(tilt,left,right){return `<polygon points="160,150 140,185 180,185" fill="${INK}" fill-opacity=".6"/><g transform="rotate(${tilt} 160 150)"><rect x="30" y="144" width="260" height="10" rx="5" fill="${INK}"/>${left}${right}</g>`;}
function genBalance(d,L){
  const T=tr(L),t=d<=2?0:d<=4?rnd(0,2):d<=6?rnd(1,3):rnd(2,3);
  const ITEMS=[{k:"box",en:"box",ar:"الصندوق",s:"square",c:"#F2A900"},{k:"ball",en:"ball",ar:"الكرة",s:"circle",c:"#2F7FD8"},{k:"star",en:"star",ar:"النجمة",s:"star",c:"#E2457A"},{k:"cup",en:"cup",ar:"الكوب",s:"diamond",c:"#2BA57F"}];
  if(t===0){
    const it=shuffle(ITEMS).slice(0,2),k=rnd(0,2),tilt=k===0?-12:k===1?12:0;
    const correct=k===2?T("They weigh the same","لهما الوزن نفسه"):T(`The ${it[k].en}`,it[k].ar);
    const all=[T(`The ${it[0].en}`,it[0].ar),T(`The ${it[1].en}`,it[1].ar),T("They weigh the same","لهما الوزن نفسه"),T("We can't tell","لا يمكن معرفة ذلك")].filter(x=>x!==correct);
    return make(SEC,T("Look at the seesaw. Which is heavier?","انظر إلى الميزان. أيهما أثقل؟"),svg(320,195,seesaw(tilt,shp(it[0].s,it[0].c,60,118,24),shp(it[1].s,it[1].c,260,118,24)),"seesaw","vis",340),correct,all,
      k===2?T("The seesaw is level, so both sides weigh the same.","الميزان متزن، إذن الجهتان متساويتان في الوزن."):T("The heavier side always goes down.","الجهة الأثقل تنخفض دائمًا."));
  }
  if(t===1){const a=rnd(2,5),b=a-1;return make(SEC,T(`${a} balls weigh the same as 1 box. Which is heavier: 1 box or ${b} balls?`,`${a} كرات تزن مثل صندوق واحد. أيهما أثقل: صندوق واحد أم ${b} كرات؟`),null,T("1 box","صندوق واحد"),[T(`${b} balls`,`${b} كرات`),T("They weigh the same","متساويان في الوزن"),T("We can't tell","لا يمكن معرفة ذلك")],
    T(`1 box = ${a} balls, and ${a} balls is more than ${b} balls.`,`الصندوق = ${a} كرات، و ${a} كرات أكثر من ${b} كرات.`));}
  if(t===2){const a=rnd(2,4),b=rnd(2,5);return make(SEC,T(`1 box balances ${a} cups. 1 cup balances ${b} marbles. How many marbles balance 1 box?`,`صندوق واحد يتزن مع ${a} أكواب، وكوب واحد يتزن مع ${b} كرات زجاجية. كم كرة زجاجية تتزن مع صندوق واحد؟`),null,String(a*b),nearNums(a*b,[a+b,a*b+b,a*b-a,b]).map(String),
    T(`${a} cups × ${b} marbles each = ${a*b} marbles.`,`${a} أكواب × ${b} كرات لكل كوب = ${a*b} كرة.`));}
  const p=rnd(2,3),q=rnd(p+1,5),m=rnd(2,3),k=p*rnd(1,3);const balls=k/p*q,ans=balls*m;
  return make(SEC,T(`${p} cubes balance ${q} balls, and 1 ball balances ${m} marbles. How many marbles balance ${k} cubes?`,`${p} مكعبات تتزن مع ${q} كرات، والكرة الواحدة تتزن مع ${m} كرات زجاجية. كم كرة زجاجية تتزن مع ${k} مكعبات؟`),null,String(ans),nearNums(ans,[k*m,q*m,balls,ans+m,k*q]).map(String),
    T(`${k} cubes = ${k/p} × ${q} = ${balls} balls, and ${balls} × ${m} = ${ans} marbles.`,`${k} مكعبات = ${k/p} × ${q} = ${balls} كرات، و ${balls} × ${m} = ${ans} كرة زجاجية.`));
}
reg("balance",SEC,genBalance,{en:"Balances",ar:"الموازين",min:1,max:9});

/* ---------- 4. Levers ---------- */
function genLever(d,L){
  const T=tr(L);
  const wt=(x,y,n)=>{let o="";for(let i=0;i<n;i++)o+=`<rect x="${x-14}" y="${y-18-i*15}" width="28" height="13" rx="2" fill="#2F7FD8" stroke="${INK}" stroke-width="1.5"/>`;return o;};
  const beam=(tilt,l,r,marks)=>{let o=`<polygon points="160,146 142,180 178,180" fill="${INK}" fill-opacity=".65"/><g transform="rotate(${tilt} 160 146)"><rect x="18" y="140" width="284" height="9" rx="4" fill="${INK}"/>${l}${r}`;for(let i=1;i<=marks;i++)o+=`<circle cx="${160-i*34}" cy="144" r="2.5" fill="#fff"/><circle cx="${160+i*34}" cy="144" r="2.5" fill="#fff"/>`;return o+`</g>`;};
  if(d>=6){
    const pairs=[[2,4,2],[3,2,6],[1,3,3],[2,1,4],[4,2,2],[3,3,3],[2,3,0]];let w1,d1,d2,w2;
    for(;;){d1=rnd(1,4);d2=rnd(1,4);w1=rnd(1,6);if((w1*d1)%d2===0&&d1!==d2){w2=w1*d1/d2;if(w2<=8)break;}}
    const inner=beam(0,wt(160-d1*34,140,Math.min(w1,6)),`<rect x="${160+d2*34-16}" y="104" width="32" height="34" rx="4" fill="none" stroke="#E2457A" stroke-width="2.5" stroke-dasharray="5 4"/>`+qmark(160+d2*34,132,24),4);
    return make(SEC,T(`The left side has ${w1} kg at ${d1} step${d1>1?"s":""} from the middle. How many kilograms must go at ${d2} step${d2>1?"s":""} on the right to balance the lever?`,`على اليسار ${w1} كجم على بُعد ${d1===1?"خطوة واحدة":d1===2?"خطوتين":d1+" خطوات"} من المنتصف. كم كيلوجرامًا يلزم وضعه على بُعد ${d2===1?"خطوة واحدة":d2===2?"خطوتين":d2+" خطوات"} يمينًا ليتزن الذراع؟`),
      svg(320,190,inner,"lever","vis",340),T(w2+" kg",w2+" كجم"),nearNums(w2,[w1,w1*d2/d1|0,w2+1,w2*2,d1*d2]).map(x=>T(x+" kg",x+" كجم")),
      T(`Weight × distance must match on both sides: ${w1} × ${d1} = ${w1*d1}, so ${w1*d1} ÷ ${d2} = ${w2} kg.`,`الوزن × المسافة يجب أن يتساوى في الجهتين: ${w1} × ${d1} = ${w1*d1}، إذن ${w1*d1} ÷ ${d2} = ${w2} كجم.`));
  }
  const d1=rnd(1,3),d2=rnd(1,3),w1=rnd(1,3),w2=rnd(1,3),m1=d1*w1,m2=d2*w2,tilt=m1>m2?-10:m1<m2?10:0;
  const correct=m1>m2?T("The left side goes down","تنخفض الجهة اليسرى"):m1<m2?T("The right side goes down","تنخفض الجهة اليمنى"):T("It stays balanced","يبقى متزنًا");
  const all=[T("The left side goes down","تنخفض الجهة اليسرى"),T("The right side goes down","تنخفض الجهة اليمنى"),T("It stays balanced","يبقى متزنًا"),T("Both sides go up","ترتفع الجهتان")].filter(x=>x!==correct);
  return make(SEC,T(`On this lever the left side has ${w1} block${w1>1?"s":""} at ${d1} step${d1>1?"s":""} from the middle, and the right side has ${w2} block${w2>1?"s":""} at ${d2} step${d2>1?"s":""}. What happens when it is let go?`,`على يسار هذا الذراع ${w1} ${w1===1?"قالب":w1===2?"قالبان":"قوالب"} على بُعد ${d1} من المنتصف، وعلى يمينه ${w2} ${w2===1?"قالب":w2===2?"قالبان":"قوالب"} على بُعد ${d2}. ماذا يحدث عند تركه؟`),
    svg(320,190,beam(0,wt(160-d1*34,140,w1),wt(160+d2*34,140,w2),3),"lever","vis",340),correct,all,
    T(`Multiply blocks × steps on each side. Left: ${w1}×${d1} = ${m1}. Right: ${w2}×${d2} = ${m2}. ${m1===m2?"Equal, so it balances.":"The bigger side goes down."}`,`نضرب عدد القوالب × المسافة لكل جهة. اليسار: ${w1}×${d1} = ${m1}. اليمين: ${w2}×${d2} = ${m2}. ${m1===m2?"متساويان، فيتزن.":"الجهة الأكبر تنخفض."}`));
}
reg("lever",SEC,genLever,{en:"Levers",ar:"الروافع",min:3,max:9});

/* ---------- 5. Pulleys ---------- */
function genPulley(d,L){
  const T=tr(L);
  if(d>=7){
    const n=pick([2,3,4]),W=n*pick([10,20,30,50]);let inner=`<rect x="20" y="10" width="220" height="8" fill="${INK}" fill-opacity=".6"/><rect x="60" y="120" width="${(n-1)*30+20}" height="16" rx="4" fill="#2BA57F"/><rect x="${60+((n-1)*30+20)/2-22}" y="138" width="44" height="30" rx="3" fill="#F2A900" stroke="${INK}" stroke-width="2"/>`;
    inner+=txt(60+((n-1)*30+20)/2,159,13,W+T(" N"," نيوتن"));
    for(let i=0;i<n;i++)inner+=`<line x1="${70+i*30}" y1="18" x2="${70+i*30}" y2="120" stroke="${INK}" stroke-width="2.5"/>`;
    inner+=`<line x1="${70+(n-1)*30+30}" y1="18" x2="${70+(n-1)*30+30}" y2="70" stroke="#E2457A" stroke-width="2.5"/><polygon points="${70+(n-1)*30+30},78 ${70+(n-1)*30+24},66 ${70+(n-1)*30+36},66" fill="#E2457A"/>`;
    return make(SEC,T(`In this pulley system ${n} rope parts hold up a load of ${W} newtons. Ignoring friction, how much force is needed on the free end to lift it?`,`في نظام البكرات هذا تحمل ${n} أجزاء من الحبل ثقلًا وزنه ${W} نيوتن. بإهمال الاحتكاك، ما القوة اللازمة على الطرف الحر لرفعه؟`),
      svg(260,180,inner,"pulley system","vis",280),T(W/n+" N",W/n+" نيوتن"),nearNums(W/n,[W,W*n,W/2===W/n?W/4:W/2,W-n]).map(x=>T(x+" N",x+" نيوتن")),
      T(`The load is shared by ${n} rope parts: ${W} ÷ ${n} = ${W/n} N. The trade-off is pulling ${n} times as much rope.`,`يتوزع الثقل على ${n} أجزاء من الحبل: ${W} ÷ ${n} = ${W/n} نيوتن. وفي المقابل نسحب حبلًا أطول ${n} مرات.`));
  }
  const draw=(mov)=>{let o=`<rect x="20" y="14" width="200" height="8" fill="${INK}" fill-opacity=".6"/><circle cx="70" cy="42" r="20" fill="none" stroke="#2F7FD8" stroke-width="6"/><circle cx="70" cy="42" r="4" fill="${INK}"/><path d="M50,42 L50,120" stroke="${INK}" stroke-width="2.5"/>`;
    if(!mov)o+=`<path d="M90,42 L90,120" stroke="${INK}" stroke-width="2.5"/><rect x="72" y="120" width="36" height="28" rx="3" fill="#F2A900" stroke="${INK}" stroke-width="2"/>`;
    else o+=`<path d="M90,42 L90,96" stroke="${INK}" stroke-width="2.5"/><circle cx="110" cy="96" r="18" fill="none" stroke="#2BA57F" stroke-width="6"/><path d="M128,96 L128,22" stroke="${INK}" stroke-width="2.5"/><rect x="92" y="118" width="36" height="28" rx="3" fill="#F2A900" stroke="${INK}" stroke-width="2"/>`;
    return o+`<polygon points="50,124 44,114 56,114" fill="${INK}"/>`;};
  if(Math.random()<.5)return make(SEC,T("A single fixed wheel at the top only changes the direction of your pull. Does it make the load feel lighter?","البكرة الثابتة الواحدة في الأعلى تغيّر اتجاه السحب فقط. هل تجعل الثقل يبدو أخف؟"),svg(240,160,draw(false),"pulley","vis",240),
    T("No, it only changes the direction","لا، هي تغيّر الاتجاه فقط"),[T("Yes, it halves the weight","نعم، تجعله نصف الوزن"),T("Yes, it doubles the weight","نعم، تضاعف الوزن"),T("It makes the load heavier","تجعل الثقل أثقل")],
    T("A fixed pulley lets you pull down instead of lifting up, but you still pull the full weight.","البكرة الثابتة تتيح لك السحب للأسفل بدل الرفع للأعلى، لكنك تسحب الوزن كاملًا."));
  return make(SEC,T("This system has one fixed wheel and one wheel that moves up with the load. What does the moving wheel do?","في هذا النظام بكرة ثابتة وبكرة متحركة ترتفع مع الثقل. ماذا تفعل البكرة المتحركة؟"),svg(240,160,draw(true),"pulley system","vis",240),
    T("It makes the pull feel about half as heavy","تجعل السحب أخف بنحو النصف"),[T("It makes the pull feel heavier","تجعل السحب أثقل"),T("It changes nothing","لا تغيّر شيئًا"),T("It makes the rope shorter","تجعل الحبل أقصر")],
    T("A moving pulley shares the weight between two rope parts, so you pull with about half the force, but you pull twice as much rope.","البكرة المتحركة توزع الوزن على جزأين من الحبل، فتسحب بنحو نصف القوة، لكنك تسحب ضعف طول الحبل."));
}
reg("pulley",SEC,genPulley,{en:"Pulleys",ar:"البكرات",min:4,max:9});

/* ---------- 6. Ramps ---------- */
function genIncline(d,L){
  const T=tr(L),LAB=L==="ar"?["أ","ب"]:["A","B"];
  const ramp=(h,x)=>`<polygon points="${x},150 ${x+120},150 ${x+120},${150-h}" fill="#DCEBFB" stroke="${INK}" stroke-width="2.5"/><circle cx="${x+100}" cy="${150-h*0.78}" r="13" fill="#F2A900" stroke="${INK}" stroke-width="2"/>`;
  const inner=ramp(40,14)+ramp(95,160)+txt(74,172,16,LAB[0])+txt(220,172,16,LAB[1]);
  if(Math.random()<.5)return make(SEC,T("Two balls roll down these ramps from the top. Which reaches the bottom faster?","كرتان تتدحرجان من أعلى هذين المنحدرين. أيهما تصل إلى الأسفل أسرع؟"),svg(292,180,inner,"two ramps","vis",320),
    T(`The ball on ramp ${LAB[1]}`,`الكرة على المنحدر ${LAB[1]}`),[T(`The ball on ramp ${LAB[0]}`,`الكرة على المنحدر ${LAB[0]}`),T("They arrive at the same time","تصلان في الوقت نفسه"),T("Neither ball moves","لا تتحرك أي منهما")],
    T(`Ramp ${LAB[1]} is steeper, so the ball speeds up more.`,`المنحدر ${LAB[1]} أشد ميلًا، فتتسارع الكرة أكثر.`));
  return make(SEC,T("You want to push a heavy box up to the same height. Which ramp needs less force?","تريد دفع صندوق ثقيل إلى الارتفاع نفسه. أي منحدر يحتاج قوة أقل؟"),svg(292,180,inner,"two ramps","vis",320),
    T(`Ramp ${LAB[0]}, the gentle one`,`المنحدر ${LAB[0]}، الأقل ميلًا`),[T(`Ramp ${LAB[1]}, the steep one`,`المنحدر ${LAB[1]}، الأشد ميلًا`),T("Both need the same force","كلاهما يحتاج القوة نفسها"),T("Neither ramp helps","لا يساعد أي منهما")],
    T("A gentler ramp needs less force, but you push the box over a longer distance.","المنحدر الأقل ميلًا يحتاج قوة أقل، لكنك تدفع الصندوق مسافة أطول."));
}
reg("incline",SEC,genIncline,{en:"Ramps",ar:"المستويات المائلة",min:2,max:6});

/* ---------- 7. States of matter ---------- */
function genStates(d,L){
  const T=tr(L),LAB=L==="ar"?["أ","ب","ج"]:["A","B","C"];
  const jar=(x,arr)=>{let o=`<path d="M${x},16 L${x},96 Q${x},106 ${x+10},106 L${x+56},106 Q${x+66},106 ${x+66},96 L${x+66},16" fill="none" stroke="${INK}" stroke-width="2.5"/>`;const dot=(dx,dy)=>`<circle cx="${x+dx}" cy="${dy}" r="4.5" fill="#2F7FD8"/>`;
    if(arr==="solid"){for(let r=0;r<3;r++)for(let c=0;c<3;c++)o+=dot(18+c*15,66+r*14);}
    else if(arr==="liquid"){for(const[a,b]of[[14,72],[28,78],[44,72],[20,90],[36,92],[52,86],[30,62],[48,58],[16,56]])o+=dot(a,b);}
    else{for(const[a,b]of[[14,28],[44,22],[26,52],[54,62],[18,82],[46,92],[34,38],[58,40],[10,62]])o+=dot(a,b);}return o;};
  const kinds=shuffle(["solid","liquid","gas"]),ask=pick(["solid","liquid","gas"]);
  let inner="";kinds.forEach((k,i)=>{inner+=jar(10+i*86,k)+txt(10+i*86+33,126,16,LAB[i]);});
  const idx=kinds.indexOf(ask),nm={solid:T("a solid, like ice","مادة صلبة مثل الثلج"),liquid:T("a liquid, like water","مادة سائلة مثل الماء"),gas:T("a gas, like steam","مادة غازية مثل البخار")}[ask];
  const why={solid:T("In a solid the tiny particles are packed in a neat pattern and hardly move.","في المادة الصلبة تكون الجسيمات متراصة بنظام ولا تكاد تتحرك."),liquid:T("In a liquid the particles stay close together at the bottom but slide around.","في السائل تبقى الجسيمات متقاربة في الأسفل لكنها تنزلق حول بعضها."),gas:T("In a gas the particles spread out to fill the whole container.","في الغاز تنتشر الجسيمات لتملأ الوعاء كله.")}[ask];
  return make(SEC,T(`These jars show the tiny particles inside three materials. Which jar shows ${nm}?`,`تُظهر هذه الأوعية الجسيمات الدقيقة في ثلاث مواد. أي وعاء يمثل ${nm}؟`),svg(272,136,inner,"three jars","vis",300),
    T("Jar ","الوعاء ")+LAB[idx],LAB.filter((_,i)=>i!==idx).map(l=>T("Jar ","الوعاء ")+l).concat([T("All three jars","الأوعية الثلاثة")]),why);
}
reg("states",SEC,genStates,{en:"States of matter",ar:"حالات المادة",min:1,max:6});

/* ---------- 8. Compass turns ---------- */
function genCompass(d,L){
  const T=tr(L),dirs=[T("North","الشمال"),T("East","الشرق"),T("South","الجنوب"),T("West","الغرب")],ini=L==="ar"?["ش","ق","ج","غ"]:["N","E","S","W"];
  const start=rnd(0,3),n=d>=5?rnd(2,3):rnd(1,2),cw=Math.random()<.5,end=((start+(cw?n:-n))%4+4)%4,R=58,cx=70,cy=70;
  let inner=`<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${INK}" stroke-opacity=".4" stroke-width="2.5"/>`;
  [[0,-R-4],[R+4,0],[0,R+4],[-R-4,0]].forEach((p,i)=>inner+=txt(cx+p[0],cy+p[1]+6,15,ini[i]));
  inner+=`<g transform="rotate(${start*90} ${cx} ${cy})"><polygon points="${cx},${cy-R+12} ${cx+12},${cy+8} ${cx-12},${cy+8}" fill="#E2457A"/></g><circle cx="${cx}" cy="${cy}" r="5" fill="${INK}"/>`;
  const turnTxt=L==="ar"?(n===1?"ربع دورة واحدة":n===2?"ربعَي دورة":n+" أرباع دورة"):`a quarter turn ${n} time${n>1?"s":""}`;
  return make(SEC,T(`The arrow points ${dirs[start]}. It turns ${turnTxt} ${cw?"clockwise":"counter-clockwise"}. Which way does it point now?`,`يشير السهم إلى ${dirs[start]}. يدور ${turnTxt} ${cw?"مع عقارب الساعة":"عكس عقارب الساعة"}. إلى أي اتجاه يشير الآن؟`),
    svg(140,146,inner,"compass","vis",170),dirs[end],dirs.filter((_,i)=>i!==end),
    T(`Step by step from ${dirs[start]}: ${Array.from({length:n},(_,i)=>dirs[((start+(cw?i+1:-(i+1)))%4+4)%4]).join(", then ")}.`,`خطوة بخطوة من ${dirs[start]}: ${Array.from({length:n},(_,i)=>dirs[((start+(cw?i+1:-(i+1)))%4+4)%4]).join("، ثم ")}.`));
}
reg("compass",SEC,genCompass,{en:"Compass turns",ar:"الاتجاهات والبوصلة",min:2,max:7});

/* ---------- 9. Electric circuits ---------- */
function genCircuit(d,L){
  const T=tr(L),A=L==="ar"?"أ":"A",B=L==="ar"?"ب":"B";
  const W=(x1,y1,x2,y2)=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`;
  const bulb=(x,y,lab)=>`<circle cx="${x}" cy="${y}" r="14" fill="#FFF6D8" stroke="${INK}" stroke-width="2.5"/><path d="M${x-9},${y-9} L${x+9},${y+9} M${x+9},${y-9} L${x-9},${y+9}" stroke="${INK}" stroke-width="2"/>`+txt(x,y-20,15,lab);
  const batt=(x,y)=>`<rect x="${x-14}" y="${y-6}" width="28" height="12" style="fill:var(--card,#fff)" stroke="none"/><line x1="${x-14}" y1="${y-5}" x2="${x+14}" y2="${y-5}" stroke="${INK}" stroke-width="3"/><line x1="${x-8}" y1="${y+5}" x2="${x+8}" y2="${y+5}" stroke="${INK}" stroke-width="5"/>`;
  const sw=(x,y,open,vert)=>vert?`<rect x="${x-6}" y="${y-16}" width="12" height="32" style="fill:var(--card,#fff)"/><circle cx="${x}" cy="${y+14}" r="3.5" fill="${INK}"/><circle cx="${x}" cy="${y-14}" r="3.5" fill="${INK}"/><line x1="${x}" y1="${y+14}" x2="${open?x+16:x}" y2="${open?y-8:y-14}" stroke="${INK}" stroke-width="3"/>`
                                 :`<rect x="${x-16}" y="${y-6}" width="32" height="12" style="fill:var(--card,#fff)"/><circle cx="${x-14}" cy="${y}" r="3.5" fill="${INK}"/><circle cx="${x+14}" cy="${y}" r="3.5" fill="${INK}"/><line x1="${x-14}" y1="${y}" x2="${open?x+8:x+14}" y2="${open?y-16:y}" stroke="${INK}" stroke-width="3"/>`;
  const OPT={both:T(`Both ${A} and ${B}`,`المصباحان ${A} و ${B}`),a:T(`${A} only`,`${A} فقط`),b:T(`${B} only`,`${B} فقط`),none:T("Neither bulb","لا يضيء أي منهما")};
  const types=d<=4?["s0","s1","p1"]:d<=6?["s0","s1","p1","p2","p3"]:["p1","p2","p3","short"];
  const t=pick(types);let inner="",ans,why;
  if(t==="s0"||t==="s1"){const open=t==="s1";
    inner=W(40,40,280,40)+W(280,40,280,150)+W(280,150,40,150)+W(40,150,40,40)+batt(40,95)+bulb(120,40,A)+bulb(200,40,B)+sw(160,150,open,false);
    ans=open?"none":"both";why=open?T("The switch is open, so the single loop is broken and no current flows through either bulb.","المفتاح مفتوح، فتنقطع الدائرة الوحيدة ولا يمر التيار في أي مصباح."):T("The switch is closed, so current flows around the one loop through both bulbs.","المفتاح مغلق، فيمر التيار في الدائرة عبر المصباحين.");}
  else{/* parallel: two branches between top and bottom wires */
    const swA=t==="p2",swB=t==="p1"||t==="p3",main=t==="p3",short=t==="short";
    inner=W(40,40,250,40)+W(40,150,250,150)+W(40,40,40,150)+batt(40,95)+W(150,40,150,150)+W(250,40,250,150)+bulb(150,80,A)+bulb(250,80,B);
    if(swA)inner+=sw(150,122,true,true);
    if(swB)inner+=sw(250,122,true,true);
    if(main)inner+=sw(95,150,false,false);
    if(short){inner=W(40,40,280,40)+W(280,40,280,150)+W(280,150,40,150)+W(40,150,40,40)+batt(40,95)+bulb(120,40,A)+bulb(220,40,B)+`<path d="M190,40 Q220,0 250,40" fill="none" stroke="#E2457A" stroke-width="3"/>`;}
    if(t==="p1"){ans="a";why=T(`The bulbs are on separate branches. ${B}'s branch has an open switch, so only ${A} has a complete path.`,`المصباحان على فرعين منفصلين. في فرع ${B} مفتاح مفتوح، فلا يكتمل المسار إلا عبر ${A}.`);}
    else if(t==="p2"){ans="b";why=T(`The open switch is on ${A}'s branch only, so ${B} still has a complete path.`,`المفتاح المفتوح في فرع ${A} فقط، فيبقى مسار ${B} مكتملًا.`);}
    else if(t==="p3"){ans="a";why=T(`The switch in the main wire is closed, but ${B}'s own switch is open, so only ${A} lights.`,`مفتاح السلك الرئيسي مغلق، لكن مفتاح ${B} مفتوح، فيضيء ${A} فقط.`);}
    else{ans="a";why=T(`The pink wire connects both ends of ${B}, so the current takes that easy path around ${B}. Only ${A} lights.`,`السلك الوردي يصل طرفي ${B}، فيسلك التيار هذا الطريق السهل متجاوزًا ${B}. يضيء ${A} فقط.`);}
  }
  const q=t==="short"?T("The pink wire is joined across bulb B. Which bulbs light up?","وُصل السلك الوردي بين طرفي المصباح ب. أي المصابيح تضيء؟"):T("Which bulbs light up in this circuit?","أي المصابيح تضيء في هذه الدائرة؟");
  return make(SEC,q.replace(/bulb B/,"bulb "+B),svg(310,180,inner,"circuit","vis",330),OPT[ans],Object.keys(OPT).filter(k=>k!==ans).map(k=>OPT[k]),why);
}
reg("circuit",SEC,genCircuit,{en:"Electric circuits",ar:"الدوائر الكهربائية",min:3,max:9});

/* ---------- 10. Shadows ---------- */
/* a sun-like lamp with short rays */
const lamp=(x,y)=>`<g>${[0,45,90,135,180,225,270,315].map(a=>`<line x1="${x+Math.cos(a*Math.PI/180)*22}" y1="${y+Math.sin(a*Math.PI/180)*22}" x2="${x+Math.cos(a*Math.PI/180)*29}" y2="${y+Math.sin(a*Math.PI/180)*29}" stroke="#E8A600" stroke-width="3" stroke-linecap="round"/>`).join("")}<circle cx="${x}" cy="${y}" r="16" fill="#FFC93C" stroke="#E8A600" stroke-width="3"/></g>`;
function genShadow(d,L){
  const T=tr(L),side=pick(["left","right"]),lx=side==="left"?40:240;
  if(d>=3&&Math.random()<.5){
    const inner=`<rect x="0" y="150" width="300" height="15" fill="#2BA57F" fill-opacity=".18"/><line x1="10" y1="150" x2="290" y2="150" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/><rect x="145" y="96" width="14" height="54" rx="3" fill="#2BA57F"/><rect x="141" y="92" width="22" height="8" rx="3" fill="#1F8F6D"/>${lamp(lx,40)}<path d="M${lx},70 L${lx},110" stroke="#E2457A" stroke-width="3" stroke-linecap="round"/><polygon points="${lx},118 ${lx-8},105 ${lx+8},105" fill="#E2457A"/>`;
    return make(SEC,T("The lamp is moved lower, closer to the ground (pink arrow). What happens to the post's shadow?","يُخفض المصباح ليقترب من الأرض (السهم الوردي). ماذا يحدث لظل العمود؟"),svg(300,165,inner,"lamp and post","vis",320),
      T("It gets longer","يصبح أطول"),[T("It gets shorter","يصبح أقصر"),T("It stays the same length","يبقى بالطول نفسه"),T("It disappears","يختفي")],
      T("A low light hits the post at a shallow angle, so the shadow stretches out. A high light makes a short shadow.","الضوء المنخفض يسقط على العمود بزاوية مائلة فيمتد الظل، والضوء المرتفع يصنع ظلًا قصيرًا."));
  }
  const inner=`<rect x="0" y="150" width="300" height="15" fill="#2BA57F" fill-opacity=".18"/><line x1="10" y1="150" x2="290" y2="150" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/><polygon points="150,56 128,100 172,100" fill="#2BA57F"/><polygon points="150,78 122,130 178,130" fill="#1F8F6D"/><rect x="144" y="128" width="12" height="22" rx="3" fill="#8B5A2B"/>${lamp(lx,60)}`;
  const corr=side==="left"?T("On the right of the tree","على يمين الشجرة"):T("On the left of the tree","على يسار الشجرة");
  return make(SEC,T("A lamp shines on this tree. Where does the tree's shadow fall?","يضيء مصباح على هذه الشجرة. أين يقع ظل الشجرة؟"),svg(300,165,inner,"lamp and tree","vis",320),corr,
    [side==="left"?T("On the left of the tree","على يسار الشجرة"):T("On the right of the tree","على يمين الشجرة"),T("Under the lamp","تحت المصباح"),T("There is no shadow","لا يوجد ظل")],
    T("A shadow falls on the side away from the light, because the tree blocks the light behind it.","يقع الظل في الجهة البعيدة عن الضوء، لأن الشجرة تحجب الضوء خلفها."));
}
reg("shadow",SEC,genShadow,{en:"Light and shadows",ar:"الضوء والظل",min:1,max:5});

/* ---------- 11. Density: float or sink ---------- */
function genDensity(d,L){
  const T=tr(L);
  if(d>=6&&Math.random()<.5){
    const LQ=[{en:"honey",ar:"العسل",r:1.4},{en:"water",ar:"الماء",r:1.0},{en:"cooking oil",ar:"زيت الطبخ",r:0.9}];
    const ord=LQ.map(x=>x[L==="ar"?"ar":"en"]),sep=L==="ar"?" ثم ":", then ";
    const ans=ord.slice().reverse().join(sep),wr=[ord.join(sep),[ord[1],ord[2],ord[0]].join(sep),[ord[2],ord[0],ord[1]].join(sep)];
    return make(SEC,T("Honey (1.4 g/cm³), water (1.0 g/cm³) and cooking oil (0.9 g/cm³) are poured into one jar and left to settle. What is the order from top to bottom?","يُسكب العسل (1.4 جم/سم³) والماء (1.0 جم/سم³) وزيت الطبخ (0.9 جم/سم³) في وعاء واحد ويُترك ليستقر. ما ترتيبها من الأعلى إلى الأسفل؟"),null,ans,wr,
      T("The less dense a liquid is, the higher it floats: oil on top, honey at the bottom.","كلما قلت كثافة السائل طفا أعلى: الزيت في الأعلى والعسل في القاع."));
  }
  const m=rnd(2,12)*10,v=pick([m/2,m*0.8,m*1.25,m*2,m*0.5]).toFixed(0)*1;if(v===m)return genDensity(d,L);
  const fl=m<v,den=Math.round(m/v*100)/100;
  const opts={f:T("It floats, because its density is less than water's","يطفو، لأن كثافته أقل من كثافة الماء"),s:T("It sinks, because its density is more than water's","يغوص، لأن كثافته أكبر من كثافة الماء"),s2:T("It sinks, because it weighs more than 1 gram","يغوص، لأن كتلته أكبر من جرام واحد"),f2:T("It floats, because it is bigger than a cup of water","يطفو، لأنه أكبر من كوب ماء")};
  return make(SEC,T(`A block has a mass of ${m} g and a volume of ${v} cm³. Water has a density of 1 g/cm³. What happens when the block is put in water?`,`قطعة كتلتها ${m} جم وحجمها ${v} سم³. كثافة الماء 1 جم/سم³. ماذا يحدث عند وضع القطعة في الماء؟`),null,fl?opts.f:opts.s,[fl?opts.s:opts.f,opts.s2,opts.f2],
    T(`Density = mass ÷ volume = ${m} ÷ ${v} = ${den} g/cm³, which is ${fl?"less":"more"} than water's 1 g/cm³.`,`الكثافة = الكتلة ÷ الحجم = ${m} ÷ ${v} = ${den} جم/سم³، وهي ${fl?"أقل":"أكبر"} من كثافة الماء 1 جم/سم³.`));
}
reg("density",SEC,genDensity,{en:"Density",ar:"الكثافة والطفو",min:5,max:9});

/* ---------- 12. Reading results (tables and graphs) ---------- */
function genData(d,L){
  const T=tr(L),t=d<=6?rnd(0,1):rnd(0,2);
  const table=(h,rows)=>`<table class="dt"><tr>${h.map(x=>`<th>${x}</th>`).join("")}</tr>${rows.map(r=>`<tr>${r.map(x=>`<td>${x}</td>`).join("")}</tr>`).join("")}</table>`;
  if(t===0){
    const k=pick([3,4,5]),h=[10,20,30];const rows=h.map(x=>[x,x*k]);const ask=40;
    return make(SEC,T(`A toy car is let go from ramps of different heights. The table shows how far it rolled. If the pattern continues, how far will it roll from a 40 cm ramp?${table(["Ramp height (cm)","Distance rolled (cm)"],rows)}`,`تُطلق سيارة لعبة من منحدرات بارتفاعات مختلفة. يبيّن الجدول المسافة التي قطعتها. إذا استمر النمط، كم ستقطع من منحدر ارتفاعه 40 سم؟${table(["ارتفاع المنحدر (سم)","المسافة (سم)"],rows)}`),null,
      T(ask*k+" cm",ask*k+" سم"),nearNums(ask*k,[ask*k+10,30*k+10,ask+k*10,ask*k-k*5]).map(x=>T(x+" cm",x+" سم")),
      T(`Each extra 10 cm of height adds ${10*k} cm of distance: ${30*k} + ${10*k} = ${40*k} cm.`,`كل 10 سم إضافية في الارتفاع تضيف ${10*k} سم للمسافة: ${30*k} + ${10*k} = ${40*k} سم.`));
  }
  if(t===1){
    const hrs=[2,4,6,8],base=rnd(2,4),gr=hrs.map(h=>base+h*pick([1,2]));gr.sort((a,b)=>a-b);
    const ans=T("More hours of light gave taller plants","كلما زادت ساعات الضوء زاد طول النبات");
    const wr=[T("Plants grow best in the dark","ينمو النبات أفضل في الظلام"),T("Light has no effect on plant height","الضوء لا يؤثر في طول النبات"),T("Water is what made the plants grow","الماء هو ما جعل النبات ينمو")];
    let inner=`<line x1="40" y1="150" x2="290" y2="150" stroke="${INK}" stroke-width="2"/><line x1="40" y1="150" x2="40" y2="14" stroke="${INK}" stroke-width="2"/>`;
    const mx=Math.max(...gr);hrs.forEach((h,i)=>{const bh=gr[i]/mx*120;inner+=`<rect x="${62+i*58}" y="${150-bh}" width="36" height="${bh}" rx="3" fill="#2BA57F"/>`+txt(80+i*58,166,13,h,{w:600})+txt(80+i*58,145-bh,12,gr[i],{w:600});});
    inner+=txt(165,182,12,T("hours of light per day","ساعات الضوء يوميًا"),{w:500});
    return make(SEC,T("Four identical plants got the same water but different hours of light. The chart shows their heights in cm after two weeks. Which conclusion does the chart support?","حصلت أربع نباتات متماثلة على الكمية نفسها من الماء وعدد مختلف من ساعات الضوء. يبيّن الرسم أطوالها بالسنتيمتر بعد أسبوعين. أي استنتاج يدعمه الرسم؟"),svg(300,190,inner,"bar chart","vis",330),ans,wr,
      T("Only the hours of light changed, and the height rose with them. Water was the same for all, so it can't explain the difference.","الذي تغيّر هو ساعات الضوء فقط، وازداد الطول بزيادتها. أما الماء فكان متساويًا للجميع، فلا يفسّر الفرق."));
  }
  const pts=[[0,20],[2,45],[4,70],[6,95],[8,100],[10,100],[12,100]];
  let inner=`<line x1="40" y1="150" x2="290" y2="150" stroke="${INK}" stroke-width="2"/><line x1="40" y1="150" x2="40" y2="10" stroke="${INK}" stroke-width="2"/>`;
  const X=t=>40+t*20,Y=v=>150-v*1.25;
  inner+=`<polyline points="${pts.map(p=>X(p[0])+","+Y(p[1])).join(" ")}" fill="none" stroke="#E2457A" stroke-width="3"/>`;
  [0,4,8,12].forEach(t=>inner+=txt(X(t),166,12,t,{w:600}));[0,50,100].forEach(v=>inner+=txt(26,Y(v)+4,12,v,{w:600}));
  inner+=txt(165,184,12,T("minutes","الدقائق"),{w:500});
  return make(SEC,T("Water is heated and its temperature (°C) is measured every 2 minutes. What does the flat part of the graph show?","يُسخَّن ماء وتُقاس درجة حرارته (°س) كل دقيقتين. ماذا يُظهر الجزء المستوي من الرسم؟"),svg(300,190,inner,"line graph","vis",330),
    T("The water is boiling, and the heat is turning it into steam","الماء يغلي، والحرارة تحوّله إلى بخار"),[T("The heater was switched off","أُطفئ السخان"),T("The water started to freeze","بدأ الماء يتجمد"),T("The thermometer broke","تعطل مقياس الحرارة")],
    T("At 100 °C water boils. The heat keeps going in, but it changes water into steam instead of raising the temperature.","عند 100 °س يغلي الماء. تستمر الحرارة في الدخول، لكنها تحوّل الماء إلى بخار بدل رفع درجة الحرارة."));
}
reg("data",SEC,genData,{en:"Reading results",ar:"قراءة النتائج والرسوم",min:4,max:9});

/* ---------- 13. Fair tests (which variable to keep the same) ---------- */
const FAIR=[
 {d:4,en:["how much sunlight a plant gets","how tall it grows","the type of plant and the amount of water"],ar:["كمية ضوء الشمس التي يحصل عليها النبات","مدى نموه في الطول","نوع النبات وكمية الماء"]},
 {d:4,en:["the temperature of water","how fast sugar dissolves in it","the amount of water and the amount of sugar"],ar:["درجة حرارة الماء","سرعة ذوبان السكر فيه","كمية الماء وكمية السكر"]},
 {d:5,en:["the height of a ramp","how far a toy car rolls","the car and the surface of the floor"],ar:["ارتفاع المنحدر","المسافة التي تقطعها سيارة لعبة","السيارة ونوع سطح الأرض"]},
 {d:5,en:["the type of ball","how high it bounces","the height it is dropped from"],ar:["نوع الكرة","ارتفاع ارتدادها","الارتفاع الذي تُسقط منه"]},
 {d:6,en:["the material of a cup","how fast hot water in it cools","the starting temperature and amount of water"],ar:["مادة الكوب","سرعة تبرّد الماء الساخن فيه","درجة الحرارة الابتدائية وكمية الماء"]},
 {d:7,en:["the size of a paper parachute","how long it takes to fall","the weight hanging from it and the drop height"],ar:["مساحة مظلة ورقية","الزمن الذي تستغرقه في السقوط","الثقل المعلق بها وارتفاع الإسقاط"]},
 {d:8,en:["the number of coils of wire on an electromagnet","how many paper clips it picks up","the battery and the type of nail"],ar:["عدد لفات السلك حول المغناطيس الكهربائي","عدد مشابك الورق التي يرفعها","البطارية ونوع المسمار"]},
 {d:9,en:["the amount of salt in water","the temperature at which the water boils","the amount of water and the heater"],ar:["كمية الملح في الماء","درجة الحرارة التي يغلي عندها الماء","كمية الماء والسخان المستخدم"]}
];
function genFair(d,L,opts){
  const T=tr(L),{item,id}=bpick(FAIR,d,opts,3),r=item[L==="ar"?"ar":"en"],p=NB.person(L),v=p.v;
  return make(SEC,T(`${p.name} wants to find out whether ${r[0]} changes ${r[1]}. To make it a fair test, what must stay the same in every trial?`,`${v("يريد","تريد")} ${p.name} معرفة أثر ${r[0]} في ${r[1]}. لكي تكون التجربة عادلة، ما الذي يجب أن يبقى ثابتًا في كل المحاولات؟`),null,
    cap(r[2]),[cap(r[0]),cap(r[1]),T("Nothing needs to stay the same","لا يلزم تثبيت أي شيء")],
    T(`Only the thing being tested (${r[0]}) should change. Everything else that could affect ${r[1]} must be kept the same.`,`يجب أن يتغير الشيء المراد اختباره فقط (${r[0]})، ويبقى كل ما قد يؤثر في ${r[1]} ثابتًا.`),"text","fair:"+id);
}
const cap=s=>s.charAt(0).toUpperCase()+s.slice(1);
reg("fair",SEC,genFair,{en:"Fair tests",ar:"التجربة العادلة",min:4,max:9,bank:true});

/* ---------- 14. Science facts (bank, by level) ---------- */
const F=(d,en,ar)=>({d,en,ar});
const FACTS=[
 F(1,["Which of these will float in water?","A wooden stick",["An iron nail","A stone","A metal coin"],"Wood is light for its size, so it floats."],["أي هذه الأشياء يطفو على الماء؟","عود خشب",["مسمار حديد","حجر","قطعة نقود معدنية"],"الخشب خفيف بالنسبة لحجمه، لذلك يطفو."]),
 F(1,["Which thing will a magnet pick up?","A paper clip",["A plastic spoon","An eraser","A wooden block"],"Magnets pull things made of iron or steel."],["أي شيء يجذبه المغناطيس؟","مشبك الورق",["ملعقة بلاستيك","ممحاة","مكعب خشبي"],"المغناطيس يجذب الأشياء المصنوعة من الحديد أو الفولاذ."]),
 F(1,["When is your shadow the shortest?","At noon, when the sun is high",["Early in the morning","Late in the afternoon","At sunset"],"When the sun is high above you, your shadow is small."],["متى يكون ظلك أقصر ما يمكن؟","وقت الظهر عندما تكون الشمس عالية",["في الصباح الباكر","في آخر العصر","عند الغروب"],"عندما تكون الشمس فوقك تمامًا يكون ظلك صغيرًا."]),
 F(1,["What do plants need to make their own food?","Sunlight",["Darkness","Noise","Sand only"],"Plants use sunlight, water and air to make food."],["ماذا يحتاج النبات ليصنع غذاءه؟","ضوء الشمس",["الظلام","الضوضاء","الرمل فقط"],"يستخدم النبات ضوء الشمس والماء والهواء لصنع غذائه."]),
 F(1,["An ice cube is left in the sun. What happens?","It melts into water",["It gets bigger","It turns into stone","Nothing happens"],"Heat melts ice into water."],["تُرك مكعب ثلج في الشمس. ماذا يحدث؟","يذوب ويصبح ماءً",["يكبر","يصبح حجرًا","لا يحدث شيء"],"الحرارة تُذيب الثلج فيتحول إلى ماء."]),
 F(1,["Which one is a living thing?","A tree",["A rock","A car","A cloud"],"Trees grow, need water, and make new plants."],["أي هذه كائن حي؟","الشجرة",["الصخرة","السيارة","السحابة"],"الشجرة تنمو وتحتاج إلى الماء وتنتج نباتات جديدة."]),
 F(1,["Which of these needs electricity to work?","A lamp",["A book","A ball","A spoon"],"A lamp needs electricity to make light."],["أي هذه يحتاج إلى الكهرباء ليعمل؟","المصباح",["الكتاب","الكرة","الملعقة"],"يحتاج المصباح إلى الكهرباء ليعطي الضوء."]),
 F(1,["Which animal lays eggs?","A hen",["A cow","A cat","A camel"],"Birds such as hens lay eggs."],["أي حيوان يبيض؟","الدجاجة",["البقرة","القطة","الناقة"],"الطيور مثل الدجاجة تضع البيض."]),
 F(2,["You put a metal spoon and a wooden spoon in hot soup. Which gets hot faster?","The metal spoon",["The wooden spoon","Both the same","Neither gets hot"],"Metal lets heat travel through it quickly."],["وضعت ملعقة معدنية وأخرى خشبية في حساء ساخن. أيهما تسخن أسرع؟","الملعقة المعدنية",["الملعقة الخشبية","تسخنان بالسرعة نفسها","لا تسخن أي منهما"],"المعدن ينقل الحرارة بسرعة."]),
 F(2,["Wet clothes on a line become dry. Where did the water go?","Into the air",["Into the clothes","Into the rope","It turned to ice"],"Water evaporates into the air as tiny bits we can't see."],["تجف الملابس المبللة على الحبل. أين ذهب الماء؟","إلى الهواء",["إلى داخل الملابس","إلى الحبل","تحول إلى ثلج"],"يتبخر الماء ويختلط بالهواء على شكل جسيمات لا نراها."]),
 F(2,["Light can pass through which of these?","Clear glass",["A wooden door","A metal plate","A brick wall"],"Clear glass is transparent, so light passes through it."],["أي هذه يسمح للضوء بالمرور خلاله؟","الزجاج الشفاف",["الباب الخشبي","اللوح المعدني","الجدار الطوبي"],"الزجاج الشفاف يسمح بمرور الضوء."]),
 F(2,["Which animal is a mammal?","A whale",["A shark","A frog","An eagle"],"Whales breathe air and feed their babies milk, like all mammals."],["أي هذه الحيوانات من الثدييات؟","الحوت",["القرش","الضفدع","النسر"],"الحوت يتنفس الهواء ويرضع صغاره، مثل كل الثدييات."]),
 F(2,["How can you make a drum sound louder?","Hit it harder",["Hit it more softly","Paint it","Put it in a bag"],"A harder hit makes bigger vibrations, which sound louder."],["كيف تجعل صوت الطبل أعلى؟","تضربه بقوة أكبر",["تضربه بلطف أكثر","تلونه","تضعه في كيس"],"الضربة الأقوى تصنع اهتزازات أكبر فيعلو الصوت."]),
 F(2,["What happens to water when you heat it a lot?","It boils and turns into steam",["It turns into ice","It turns into sand","It stays the same"],"Very hot water boils and becomes steam."],["ماذا يحدث للماء عند تسخينه كثيرًا؟","يغلي ويتحول إلى بخار",["يتحول إلى ثلج","يتحول إلى رمل","يبقى كما هو"],"الماء شديد الحرارة يغلي ويتحول إلى بخار."]),
 F(2,["Rub your hands together quickly. How do they feel?","Warm",["Cold","Wet","Sticky"],"Rubbing makes friction, and friction makes heat."],["افرك يديك بسرعة. كيف تشعر بهما؟","دافئتين",["باردتين","مبللتين","لزجتين"],"الفرك يسبب احتكاكًا، والاحتكاك ينتج حرارة."]),
 F(3,["You push two magnets together with the same ends facing (north to north). What happens?","They push each other away",["They stick together","They get hot","Nothing happens"],"Like poles push apart; opposite poles pull together."],["قرّبت مغناطيسين من قطبيهما المتشابهين (شمالي مع شمالي). ماذا يحدث؟","يتنافران",["يتجاذبان","يسخنان","لا يحدث شيء"],"الأقطاب المتشابهة تتنافر، والمختلفة تتجاذب."]),
 F(3,["A plant is put near a window. Which way does it grow?","Toward the light",["Away from the light","Straight down","It stops growing"],"Plants bend toward light because they need it."],["وُضع نبات قرب نافذة. في أي اتجاه ينمو؟","نحو الضوء",["بعيدًا عن الضوء","إلى الأسفل مباشرة","يتوقف عن النمو"],"ينحني النبات نحو الضوء لأنه يحتاج إليه."]),
 F(3,["Why can we see the Moon at night?","It reflects light from the Sun",["It makes its own fire","It is a giant lamp","The stars paint it"],"The Moon has no light of its own; it bounces sunlight to us."],["لماذا نرى القمر في الليل؟","لأنه يعكس ضوء الشمس",["لأنه يشتعل بنفسه","لأنه مصباح ضخم","لأن النجوم تلونه"],"القمر لا يصدر ضوءًا؛ إنه يعكس ضوء الشمس إلينا."]),
 F(3,["A heavy boy and a light boy want to balance on a seesaw. Where should the heavy boy sit?","Closer to the middle",["At the very end","On the same side as the light boy","It doesn't matter"],"Sitting nearer the middle gives the heavy side less turning effect."],["ولد ثقيل وولد خفيف يريدان أن يتزنا على الأرجوحة. أين يجلس الولد الثقيل؟","أقرب إلى المنتصف",["في الطرف تمامًا","في جهة الولد الخفيف نفسها","لا يهم"],"الجلوس قرب المنتصف يقلل أثر الجهة الثقيلة في التدوير."]),
 F(3,["Which is easier to push across the floor?","An empty box",["A box full of books","A box full of stones","A box full of water"],"Lighter things need less force to move."],["أي صندوق أسهل في الدفع على الأرض؟","صندوق فارغ",["صندوق مليء بالكتب","صندوق مليء بالحجارة","صندوق مليء بالماء"],"الأشياء الأخف تحتاج قوة أقل لتحريكها."]),
 F(3,["What makes day and night?","The Earth spinning",["The Sun going around the Earth each day","Clouds covering the Sun","The Moon blocking the Sun every evening"],"The Earth spins once a day; the side facing the Sun has day."],["ما سبب تعاقب الليل والنهار؟","دوران الأرض حول نفسها",["دوران الشمس حول الأرض كل يوم","غطاء السحب للشمس","حجب القمر للشمس كل مساء"],"تدور الأرض حول نفسها مرة كل يوم، والجهة المقابلة للشمس يكون فيها نهار."]),
 F(4,["A cold glass of water gets tiny drops on the outside. Where do they come from?","Water vapour in the air turns to liquid on the cold glass",["Water leaks through the glass","The glass is sweating from inside","The ice is melting through the glass"],"Cold surfaces cool the air next to them, and its water vapour condenses."],["تظهر قطرات صغيرة على السطح الخارجي لكوب ماء بارد. من أين جاءت؟","بخار الماء في الهواء يتكاثف على الكوب البارد",["الماء يتسرب عبر الزجاج","الكوب يتعرق من الداخل","الثلج يذوب عبر الزجاج"],"السطح البارد يبرد الهواء الملامس له فيتكاثف بخار الماء الذي فيه."]),
 F(4,["Sound travels fastest through which of these?","Steel",["Air","Water","Empty space"],"Sound travels faster in solids than in liquids or gases, and cannot travel through empty space."],["في أي مما يلي ينتقل الصوت أسرع؟","الفولاذ",["الهواء","الماء","الفراغ"],"ينتقل الصوت في المواد الصلبة أسرع من السوائل والغازات، ولا ينتقل في الفراغ."]),
 F(4,["Which part of a plant takes in water from the soil?","The roots",["The flowers","The leaves","The fruit"],"Roots absorb water and minerals from the soil."],["أي جزء من النبات يمتص الماء من التربة؟","الجذور",["الأزهار","الأوراق","الثمار"],"تمتص الجذور الماء والأملاح من التربة."]),
 F(4,["In a food chain grass → rabbit → fox, what would happen to the rabbits first if all the foxes disappeared?","There would be more rabbits",["There would be fewer rabbits","The rabbits would eat foxes","The rabbits would turn into foxes"],"Fewer predators means more rabbits survive, at least at first."],["في السلسلة الغذائية: عشب ← أرنب ← ثعلب، ماذا يحدث للأرانب أولًا لو اختفت الثعالب كلها؟","يزداد عدد الأرانب",["يقل عدد الأرانب","تأكل الأرانب الثعالب","تتحول الأرانب إلى ثعالب"],"قلة المفترسات تعني نجاة عدد أكبر من الأرانب، على الأقل في البداية."]),
 F(4,["Which material would be best for the handle of a cooking pot?","Wood",["Copper","Iron","Aluminium"],"Wood is a poor conductor of heat, so the handle stays cool."],["أي مادة هي الأفضل لصنع مقبض قدر الطبخ؟","الخشب",["النحاس","الحديد","الألمنيوم"],"الخشب موصل رديء للحرارة، فيبقى المقبض باردًا."]),
 F(4,["How can you separate sand from water?","Pour it through filter paper",["Use a magnet","Shake it","Add more water"],"Filter paper lets water through but holds back the sand."],["كيف تفصل الرمل عن الماء؟","بتمريره عبر ورق الترشيح",["باستخدام مغناطيس","برجّه","بإضافة مزيد من الماء"],"ورق الترشيح يسمح بمرور الماء ويحجز الرمل."]),
 F(5,["How can you get the salt back from salty water?","Let the water evaporate",["Pour it through filter paper","Freeze it and pick out the salt","Use a magnet"],"Salt is dissolved, so a filter won't catch it; evaporating the water leaves the salt behind."],["كيف تستعيد الملح من الماء المالح؟","بتبخير الماء",["بتمريره عبر ورق الترشيح","بتجميده والتقاط الملح","باستخدام مغناطيس"],"الملح ذائب فلا يحجزه المرشح، وتبخير الماء يترك الملح."]),
 F(5,["Why would an astronaut weigh less on the Moon than on Earth?","The Moon's gravity is weaker",["The astronaut's body has less mass there","There is no air on the Moon","The Moon is hotter"],"Mass stays the same, but the Moon pulls with less gravity, so weight is less."],["لماذا يقل وزن رائد الفضاء على القمر مقارنة بالأرض؟","لأن جاذبية القمر أضعف",["لأن كتلة جسمه تقل هناك","لأنه لا يوجد هواء على القمر","لأن القمر أشد حرارة"],"الكتلة تبقى نفسها، لكن جاذبية القمر أضعف فيقل الوزن."]),
 F(5,["Which gas do plants take in from the air to make food?","Carbon dioxide",["Oxygen","Nitrogen","Helium"],"Plants take in carbon dioxide and give out oxygen during photosynthesis."],["أي غاز يأخذه النبات من الهواء ليصنع غذاءه؟","ثاني أكسيد الكربون",["الأكسجين","النيتروجين","الهيليوم"],"يأخذ النبات ثاني أكسيد الكربون ويطلق الأكسجين أثناء البناء الضوئي."]),
 F(5,["White light passes through a glass prism and comes out as a band of colours. What does this show?","White light is a mix of colours",["The prism paints the light","Glass makes light hotter","Light travels in circles"],"A prism bends each colour by a different amount, splitting white light into a spectrum."],["يمر الضوء الأبيض عبر منشور زجاجي فيخرج حزمة من الألوان. ماذا يبيّن ذلك؟","الضوء الأبيض مزيج من الألوان",["المنشور يلوّن الضوء","الزجاج يجعل الضوء أسخن","الضوء يسير في دوائر"],"يكسر المنشور كل لون بمقدار مختلف، فيتحلل الضوء الأبيض إلى ألوانه."]),
 F(5,["Sugar dissolves fastest in which water?","Hot water, stirred",["Cold water, not stirred","Cold water, stirred","Ice"],"Heat and stirring both help sugar dissolve faster."],["في أي ماء يذوب السكر أسرع؟","ماء ساخن مع التحريك",["ماء بارد دون تحريك","ماء بارد مع التحريك","الثلج"],"الحرارة والتحريك كلاهما يسرّع ذوبان السكر."]),
 F(5,["Which of these is a non-living part of an ecosystem?","Sunlight",["Grass","Bacteria","A lizard"],"Sunlight, water, soil and air are non-living parts; plants, animals and microbes are living."],["أي مما يلي من المكونات غير الحية في النظام البيئي؟","ضوء الشمس",["العشب","البكتيريا","السحلية"],"ضوء الشمس والماء والتربة والهواء مكونات غير حية، والنباتات والحيوانات والميكروبات حية."]),
 F(6,["Why do we have seasons on Earth?","The Earth's axis is tilted as it goes around the Sun",["The Earth gets much closer to the Sun in summer","The Sun gets hotter in summer","The Moon blocks the Sun in winter"],"The tilt changes how directly sunlight hits each half of the Earth through the year."],["لماذا تحدث الفصول الأربعة على الأرض؟","لميل محور الأرض أثناء دورانها حول الشمس",["لأن الأرض تقترب كثيرًا من الشمس صيفًا","لأن الشمس تشتد حرارتها صيفًا","لأن القمر يحجب الشمس شتاءً"],"الميل يغيّر زاوية سقوط أشعة الشمس على كل نصف من الأرض خلال السنة."]),
 F(6,["A nail wrapped in a coil of wire connected to a battery picks up paper clips. What has been made?","An electromagnet",["A battery","A compass","A light bulb"],"Current flowing in a coil makes a magnetic field, turning the nail into a magnet."],["مسمار ملفوف بسلك موصول ببطارية يرفع مشابك الورق. ماذا صُنع؟","مغناطيس كهربائي",["بطارية","بوصلة","مصباح"],"مرور التيار في الملف يولد مجالًا مغناطيسيًا فيصبح المسمار مغناطيسًا."]),
 F(6,["Which is the best conductor of electricity?","A copper wire",["A rubber band","A glass rod","A plastic ruler"],"Metals such as copper let electric current flow easily."],["أي هذه أفضل موصل للكهرباء؟","سلك نحاس",["شريط مطاطي","قضيب زجاجي","مسطرة بلاستيك"],"المعادن مثل النحاس تسمح بمرور التيار بسهولة."]),
 F(6,["A ball is thrown straight up. At the very top of its path, what is its speed?","Zero, for an instant",["Its fastest","The same as when thrown","It keeps rising forever"],"Gravity slows the ball until it stops for a moment, then it falls."],["قُذفت كرة إلى الأعلى مباشرة. ما سرعتها عند أعلى نقطة؟","صفر للحظة",["أقصى سرعة لها","مثل سرعتها عند القذف","تستمر في الارتفاع للأبد"],"تبطئ الجاذبية الكرة حتى تتوقف لحظة ثم تسقط."]),
 F(6,["Which change is a chemical change?","An iron nail rusting",["Ice melting","Water boiling","Paper being cut"],"Rust is a new substance; the others only change shape or state."],["أي تغيّر مما يلي تغير كيميائي؟","صدأ مسمار حديد",["ذوبان الثلج","غليان الماء","قص الورق"],"الصدأ مادة جديدة، أما البقية فتغير في الشكل أو الحالة فقط."]),
 F(7,["You are in a car that stops suddenly. Why does your body move forward?","Your body tends to keep moving (inertia)",["The seat pushes you forward","The air pushes you forward","Gravity pulls you forward"],"Objects keep their motion unless a force acts on them; the seat belt supplies that force."],["توقفت السيارة التي تركبها فجأة. لماذا يندفع جسمك إلى الأمام؟","لأن جسمك يميل إلى الاستمرار في حركته (القصور الذاتي)",["لأن المقعد يدفعك للأمام","لأن الهواء يدفعك للأمام","لأن الجاذبية تشدك للأمام"],"الأجسام تحافظ على حركتها ما لم تؤثر فيها قوة، وحزام الأمان يوفر هذه القوة."]),
 F(7,["When you push against a wall, the wall pushes back on you. What law is this?","Every action has an equal and opposite reaction",["Objects at rest stay at rest","Heavier objects fall faster","Energy can be created"],"Newton's third law: forces come in equal, opposite pairs."],["عندما تدفع جدارًا يدفعك الجدار بالمقابل. أي قانون يصف ذلك؟","لكل فعل رد فعل مساوٍ له في المقدار ومعاكس في الاتجاه",["الجسم الساكن يبقى ساكنًا دائمًا","الأجسام الأثقل تسقط أسرع","الطاقة يمكن أن تُخلق"],"القانون الثالث لنيوتن: القوى تأتي أزواجًا متساوية ومتعاكسة."]),
 F(7,["Why does a sharp knife cut more easily than a blunt one?","The same force acts on a smaller area, giving more pressure",["A sharp knife is heavier","A blunt knife has more friction with air","Sharp metal is harder"],"Pressure = force ÷ area; a thin edge makes the pressure large."],["لماذا تقطع السكين الحادة بسهولة أكبر من غير الحادة؟","لأن القوة نفسها تؤثر في مساحة أصغر فيزداد الضغط",["لأن السكين الحادة أثقل","لأن غير الحادة تحتك بالهواء أكثر","لأن المعدن الحاد أصلب"],"الضغط = القوة ÷ المساحة، والحافة الرقيقة تجعل الضغط كبيرًا."]),
 F(7,["A huge steel ship floats, but a small steel nail sinks. Why?","The ship's shape pushes aside a lot of water, so the water pushes it up enough",["Steel floats in sea water","The ship is lighter than the nail","Ships have engines that hold them up"],"A hollow hull displaces water weighing as much as the ship, so it floats."],["تطفو سفينة ضخمة من الفولاذ ويغوص مسمار فولاذي صغير. لماذا؟","شكل السفينة يزيح كمية كبيرة من الماء فيدفعها الماء للأعلى بما يكفي",["الفولاذ يطفو في ماء البحر","السفينة أخف من المسمار","محركات السفينة تبقيها طافية"],"الهيكل المجوف يزيح ماءً يساوي وزن السفينة فتطفو."]),
 F(7,["A solar panel changes which form of energy into electrical energy?","Light energy",["Sound energy","Chemical energy","Nuclear energy"],"Solar cells turn sunlight directly into electricity."],["تحوّل الخلية الشمسية أي شكل من أشكال الطاقة إلى طاقة كهربائية؟","الطاقة الضوئية",["الطاقة الصوتية","الطاقة الكيميائية","الطاقة النووية"],"الخلايا الشمسية تحوّل ضوء الشمس مباشرة إلى كهرباء."]),
 F(7,["Why do we see lightning before we hear thunder?","Light travels much faster than sound",["Thunder happens later","Our eyes are closer to the cloud","Sound travels only at night"],"Light arrives almost instantly; sound takes about 3 seconds per kilometre."],["لماذا نرى البرق قبل أن نسمع الرعد؟","لأن الضوء أسرع كثيرًا من الصوت",["لأن الرعد يحدث بعد البرق","لأن أعيننا أقرب إلى السحاب","لأن الصوت لا ينتقل إلا ليلًا"],"يصل الضوء فورًا تقريبًا، أما الصوت فيحتاج نحو 3 ثوانٍ لكل كيلومتر."]),
 F(7,["Ice floats on water. What does this tell us?","Ice is less dense than liquid water",["Ice is heavier than water","Ice has no mass","Water is a solid"],"Water expands as it freezes, so ice is less dense and floats."],["يطفو الثلج على الماء. ماذا يدل ذلك؟","كثافة الثلج أقل من كثافة الماء السائل",["الثلج أثقل من الماء","الثلج ليس له كتلة","الماء مادة صلبة"],"يتمدد الماء عند تجمده فتقل كثافته فيطفو."]),
 F(8,["A pencil in a glass of water looks bent at the surface. What causes this?","Light bends when it passes from water into air (refraction)",["The water really bends the pencil","Light reflects off the pencil twice","The glass is curved inward"],"Light changes speed between water and air, so it changes direction."],["يبدو قلم في كوب ماء مكسورًا عند سطح الماء. ما السبب؟","انكسار الضوء عند انتقاله من الماء إلى الهواء",["الماء يثني القلم فعلًا","ينعكس الضوء عن القلم مرتين","الزجاج منحنٍ إلى الداخل"],"تتغير سرعة الضوء بين الماء والهواء فيتغير اتجاهه."]),
 F(8,["Heat from the Sun reaches Earth through empty space. How?","By radiation",["By conduction","By convection","By sound waves"],"Conduction and convection need matter; radiation can cross empty space."],["تصل حرارة الشمس إلى الأرض عبر الفضاء الخالي. كيف؟","بالإشعاع",["بالتوصيل","بالحمل","بالموجات الصوتية"],"التوصيل والحمل يحتاجان مادة، أما الإشعاع فيعبر الفراغ."]),
 F(8,["Two identical bulbs are connected in a row (series) to one battery, instead of just one bulb. What happens?","Both bulbs are dimmer than one bulb alone",["Both are brighter","One lights and one doesn't","Nothing changes"],"In series the battery pushes current through more resistance, so less current flows and each bulb is dimmer."],["وُصل مصباحان متماثلان على التوالي ببطارية واحدة بدلًا من مصباح واحد. ماذا يحدث؟","يصبح المصباحان أخفت من المصباح الواحد",["يصبحان أكثر إضاءة","يضيء أحدهما فقط","لا يتغير شيء"],"على التوالي تزداد المقاومة فيقل التيار، فيخفت كل مصباح."]),
 F(8,["Which of these is a compound, not an element?","Water",["Oxygen","Iron","Gold"],"Water is made of hydrogen and oxygen joined together; the others are single elements."],["أي مما يلي مركب وليس عنصرًا؟","الماء",["الأكسجين","الحديد","الذهب"],"الماء مكوّن من الهيدروجين والأكسجين متحدين، والبقية عناصر."]),
 F(8,["Lemon juice turns blue litmus paper red. What does this show?","Lemon juice is an acid",["Lemon juice is a base","Lemon juice is neutral","Lemon juice is a metal"],"Acids turn blue litmus red."],["عصير الليمون يحوّل ورقة تباع الشمس الزرقاء إلى حمراء. ماذا يبيّن ذلك؟","عصير الليمون حمضي",["عصير الليمون قاعدي","عصير الليمون متعادل","عصير الليمون فلز"],"الأحماض تحوّل ورقة تباع الشمس الزرقاء إلى حمراء."]),
 F(8,["Which part is found in plant cells but not in animal cells?","Chloroplasts",["A nucleus","A cell membrane","Cytoplasm"],"Chloroplasts, where photosynthesis happens, are only in plant cells."],["أي جزء يوجد في الخلية النباتية ولا يوجد في الخلية الحيوانية؟","البلاستيدات الخضراء",["النواة","الغشاء الخلوي","السيتوبلازم"],"البلاستيدات الخضراء، حيث يحدث البناء الضوئي، توجد في الخلايا النباتية فقط."]),
 F(8,["A tall, narrow vase tips over more easily than a short, wide one. Why?","Its centre of gravity is higher and its base is narrower",["It is always heavier","Air pushes it harder","Glass is slippery"],"A low centre of gravity and a wide base make an object more stable."],["تنقلب مزهرية طويلة ضيقة أسهل من قصيرة عريضة. لماذا؟","لأن مركز ثقلها أعلى وقاعدتها أضيق",["لأنها أثقل دائمًا","لأن الهواء يدفعها بقوة أكبر","لأن الزجاج زلق"],"انخفاض مركز الثقل واتساع القاعدة يجعلان الجسم أكثر ثباتًا."]),
 F(9,["In a vacuum, a feather and a hammer are dropped together. Which lands first?","They land together",["The hammer","The feather","Neither falls"],"Without air resistance, gravity speeds up all objects at the same rate."],["في الفراغ أُسقطت ريشة ومطرقة معًا. أيهما تصل أولًا؟","تصلان معًا",["المطرقة","الريشة","لا تسقط أي منهما"],"دون مقاومة الهواء تُكسب الجاذبية الأجسام كلها التسارع نفسه."]),
 F(9,["Water boils at a lower temperature on a high mountain. Why?","Air pressure is lower up there",["It is colder on mountains","There is more oxygen up there","The Sun is closer"],"Lower air pressure makes it easier for water to turn into vapour."],["يغلي الماء عند درجة حرارة أقل على قمة جبل عالٍ. لماذا؟","لأن الضغط الجوي هناك أقل",["لأن الجبال أبرد","لأن الأكسجين هناك أكثر","لأن الشمس أقرب"],"انخفاض الضغط الجوي يسهّل تحوّل الماء إلى بخار."]),
 F(9,["A ball rolls down a hill. As it goes down, what happens to its energy?","Stored (potential) energy changes into movement (kinetic) energy",["Energy disappears","Movement energy changes into stored energy","It gains energy from nowhere"],"Energy is never lost or made; it changes from one form to another."],["تتدحرج كرة إلى أسفل تلة. ماذا يحدث لطاقتها أثناء النزول؟","تتحول طاقة الوضع إلى طاقة حركية",["تختفي الطاقة","تتحول الطاقة الحركية إلى طاقة وضع","تكسب طاقة من لا شيء"],"الطاقة لا تفنى ولا تُستحدث، بل تتحول من شكل إلى آخر."]),
 F(9,["A vacuum flask keeps drinks hot for hours. What does its vacuum layer stop?","Heat moving by conduction and convection",["Light getting in","The drink from evaporating forever","Gravity"],"With no particles in the gap, heat cannot be passed on by conduction or convection."],["يحفظ الترمس المشروبات ساخنة لساعات. ماذا يمنع الفراغ الذي في جداره؟","انتقال الحرارة بالتوصيل والحمل",["دخول الضوء","تبخر المشروب إلى الأبد","الجاذبية"],"لا توجد جسيمات في الفراغ، فلا تنتقل الحرارة بالتوصيل ولا بالحمل."]),
 F(9,["Children often have some features like their parents. What carries this information?","Genes in DNA",["Blood type only","The food they eat","The air they breathe"],"Genes made of DNA are passed from parents to children."],["يشبه الأبناء آباءهم في بعض الصفات. ما الذي يحمل هذه المعلومات؟","الجينات في الحمض النووي",["فصيلة الدم فقط","الطعام الذي يأكلونه","الهواء الذي يتنفسونه"],"الجينات المكوّنة من الحمض النووي تنتقل من الآباء إلى الأبناء."]),
 F(9,["If the resistance in a circuit increases and the battery stays the same, what happens to the current?","It decreases",["It increases","It stays the same","It reverses direction"],"Current = voltage ÷ resistance, so more resistance means less current."],["إذا زادت المقاومة في دائرة وبقيت البطارية نفسها، ماذا يحدث للتيار؟","يقل",["يزداد","يبقى ثابتًا","ينعكس اتجاهه"],"التيار = الجهد ÷ المقاومة، فزيادة المقاومة تقلل التيار."])
];
function genFact(d,L,opts){
  const {item,id}=bpick(FACTS,d,opts,2),r=item[L==="ar"?"ar":"en"];
  return make(SEC,r[0],null,r[1],r[2],r[3],"text","fact:"+id);
}
reg("fact",SEC,genFact,{en:"Everyday science",ar:"العلوم في حياتنا",min:1,max:9,bank:true});
NB.BANKS=NB.BANKS||{};NB.BANKS.facts=FACTS;NB.BANKS.fair=FAIR;
})();
