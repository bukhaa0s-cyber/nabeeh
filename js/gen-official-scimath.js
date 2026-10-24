/* Nabeeh — maths/spatial and science item types seen in the official practice tests that the first generators did not cover:
   working backwards, unbalanced scales, mirror clocks (maths & spatial);
   doubling/cell division, forces turning a wheel, gravity between bodies, life cycles, and more science facts for levels 2–3. */
(function(){
"use strict";
const {rnd,pick,shuffle,tr,make,reg,bpick,person,svg,optSvg,txt,INK,nearNums}=NB;
const LAB=L=>L==="ar"?["أ","ب","ج","د"]:["A","B","C","D"];

/* ================= MATHS: working backwards ================= */
const arFl=t=>t.replace(/ (\d+) طوابق/g,(m,n)=>" "+(+n>=3&&+n<=10?n+" طوابق":+n===1?"طابقًا واحدًا":+n===2?"طابقين":n+" طابقًا"));
function genBackward(d,L){
  const T=tr(L),who=person(L),v=who.v;
  if(d>=5&&Math.random()<.5){
    /* start s → up a → down b → lift to double → F */
    let s,a,b,m;do{s=rnd(3,20);a=rnd(3,12);b=rnd(2,a+s-2);m=s+a-b;}while(m<2||m>25);
    const F=2*m,wr=nearNums(s,[F/2,F/2+b,s+b-a,F-a+b,s+1].filter(x=>x>0),{min:1});
    return make("math",T(`${who.name} went up ${a} floors from ${who.his} office, then down ${b} floors. Then ${who.he} took the lift up to the floor whose number was <b>double</b> the floor ${who.he} was on, and arrived at floor ${F}. On which floor is ${who.his} office?`,
      `${v("صعد","صعدت")} ${who.name} ${a} طوابق من ${v("مكتبه","مكتبها")}، ثم ${v("نزل","نزلت")} ${b} طوابق، ثم ${v("ركب","ركبت")} المصعد إلى الطابق الذي رقمه <b>ضعف</b> رقم الطابق الذي ${v("كان","كانت")} فيه، ${v("فوصل","فوصلت")} إلى الطابق ${F}. في أي طابق ${v("مكتبه","مكتبها")}؟`).replace(/^[\s\S]*$/,x=>L==="ar"?arFl(x):x),null,
      String(s),wr.map(String),
      T(`Work backwards: ${F} ÷ 2 = ${m}; before going down ${b}: ${m} + ${b} = ${m+b}; before going up ${a}: ${m+b} − ${a} = ${s}.`,`نعكس الخطوات: ${F} ÷ 2 = ${m}، وقبل النزول ${b}: ${m} + ${b} = ${m+b}، وقبل الصعود ${a}: ${m+b} − ${a} = ${s}.`));
  }
  let s,a,b,c,F;do{s=rnd(1,d<=3?10:25);a=rnd(2,d<=3?6:15);b=rnd(1,s+a-1);c=rnd(1,d<=3?6:12);F=s+a-b+c;}while(F>60);
  const wr=nearNums(s,[F-a+b+c,F+a-b-c,F-a-b+c,F-c,s+2],{min:1});
  return make("math",T(`${who.name} started on a floor of a tall building, went up ${a} floors, down ${b} floors, then up ${c} floors and ended on floor ${F}. On which floor did ${who.he} start?`,
    `${v("بدأ","بدأت")} ${who.name} من أحد طوابق برج، ${v("فصعد","فصعدت")} ${a} طوابق، ثم ${v("نزل","نزلت")} ${b} طوابق، ثم ${v("صعد","صعدت")} ${c} طوابق ${v("فوصل","فوصلت")} إلى الطابق ${F}. من أي طابق ${v("بدأ","بدأت")}؟`).replace(/^[\s\S]*$/,x=>L==="ar"?arFl(x):x),null,
    String(s),wr.map(String),
    T(`Undo each move from the end: ${F} − ${c} = ${F-c}, then + ${b} = ${F-c+b}, then − ${a} = ${s}.`,`نعكس الحركات من النهاية: ${F} − ${c} = ${F-c}، ثم + ${b} = ${F-c+b}، ثم − ${a} = ${s}.`));
}
reg("backward",  "math",genBackward,{en:"Working backwards",ar:"الحل بالرجوع إلى الخلف",min:2,max:9});

/* ================= MATHS: a scale that must stay tipped ================= */
function genIneq(d,L){
  const T=tr(L),k=d<=3?rnd(1,2):rnd(2,4),c=rnd(0,d<=3?4:9),R=k*rnd(3,9)+c+rnd(-2,2),leftHeavy=Math.random()<.5;
  const t=(R-c)/k;let ans,wr;
  if(leftHeavy){ans=Math.floor(t)+1;wr=[Math.floor(t),Math.floor(t)-1,Math.floor(t)-2];}
  else{ans=Math.ceil(t)-1;wr=[Math.ceil(t),Math.ceil(t)+1,Math.ceil(t)+2];}
  if(ans<1||wr.some(x=>x<1))return genIneq(d,L);
  const ang=leftHeavy?-8:8,boxes=[];for(let i=0;i<k;i++)boxes.push(`<rect x="${26+i*26}" y="67" width="22" height="22" rx="4" fill="#DCEBFB" stroke="${INK}" stroke-width="2"/>${txt(37+i*26,84,16,"?",{c:"#E2457A"})}`);
  const cw=c?`<rect x="${28+k*26}" y="61" width="28" height="28" rx="4" fill="#F2A900"/>${txt(42+k*26,81,15,c,{c:"#1E2A4A"})}`:"";
  const inner=`<polygon points="190,150 174,182 206,182" fill="${INK}" fill-opacity=".5"/><line x1="190" y1="150" x2="190" y2="96" stroke="${INK}" stroke-width="4"/>
   <g transform="rotate(${ang} 190 92)"><line x1="16" y1="92" x2="364" y2="92" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>${boxes.join("")}${cw}<rect x="262" y="57" width="48" height="32" rx="4" fill="#2BA57F"/>${txt(286,79,17,R,{c:"#fff"})}</g>`;
  const rel=leftHeavy?">":"<";
  return make("math",T(`The scale stays tipped as shown. Each <b>?</b> stands for the same number. Which number can replace <b>?</b> so the scale stays this way?`,`يبقى الميزان مائلًا كما في الشكل، وكل <b>؟</b> يمثل العدد نفسه. ما العدد الذي يمكن وضعه مكان <b>؟</b> ليبقى الميزان على حاله؟`),
    svg(380,190,inner,"tipped scale","vis",380),String(ans),wr.map(String),
    T(`The ${leftHeavy?"left":"right"} side is lower, so it is heavier: ${k} × ? ${c?"+ "+c+" ":""}${rel} ${R}. Only ${ans} works: ${k} × ${ans}${c?" + "+c:""} = ${k*ans+c}, which is ${leftHeavy?"more":"less"} than ${R}.`,
      `الكفة ${leftHeavy?"اليسرى":"اليمنى"} أخفض فهي الأثقل: ${k} × ؟ ${c?"+ "+c+" ":""}${rel} ${R}. العدد ${ans} وحده يحقق ذلك: ${k} × ${ans}${c?" + "+c:""} = ${k*ans+c}، وهو ${leftHeavy?"أكبر":"أصغر"} من ${R}.`));
}
reg("ineq","math",genIneq,{en:"Unbalanced scales",ar:"الميزان غير المتوازن",min:2,max:8});

/* ================= SPATIAL: clocks in a mirror ================= */
/* flip: false = normal, true = seen in a side mirror (left↔right), "water" = seen in water (top↔bottom) */
function clockFace(h,m,mirror,size){
  const cx=50,cy=50,r=40,ha=((h%12)+m/60)*30,ma=m*6,fl=a=>mirror==="water"?180-a:mirror?-a:a;
  let ticks="";for(let i=0;i<12;i++){const a=i*30*Math.PI/180,x1=cx+Math.sin(a)*(i===0?28:33),y1=cy-Math.cos(a)*(i===0?28:33),x2=cx+Math.sin(a)*38,y2=cy-Math.cos(a)*38;ticks+=`<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${INK}" stroke-width="${i===0?5:i%3===0?3.5:1.8}"/>`;}
  const hand=(a,len,w,col)=>{const rad=fl(a)*Math.PI/180;return `<line x1="${cx}" y1="${cy}" x2="${(cx+Math.sin(rad)*len).toFixed(1)}" y2="${(cy-Math.cos(rad)*len).toFixed(1)}" stroke="${col}" stroke-width="${w}" stroke-linecap="round"/>`;};
  return svg(100,100,`<circle cx="${cx}" cy="${cy}" r="${r}" fill="#FFF8E6" stroke="${INK}" stroke-width="3"/>${ticks}${hand(ha,20,5,INK)}${hand(ma,31,3,"#E2457A")}<circle cx="${cx}" cy="${cy}" r="3" fill="${INK}"/>`,"clock","vis",size||130);
}
const tstr=(h,m)=>`${h}:${String(m).padStart(2,"0")}`;
function mirrorTime(h,m){let mh=(m===0?12-h:11-h),mm=(60-m)%60;mh=((mh%12)+12)%12;return [mh===0?12:mh,mm];}
function genMirrorClock(d,L){
  const T=tr(L),h=rnd(1,12),m=d<=5?pick([0,15,30,45]):pick([5,10,20,25,35,40,50,55]);
  const [mh,mm]=mirrorTime(h,m);
  if(mh===h&&mm===m)return genMirrorClock(d,L);
  if(d>=6&&Math.random()<.5){
    /* pick the mirror picture of a given time */
    const opts=[clockFace(h,m,true,90),clockFace(h,m,false,90),clockFace(h,m,"water",90),clockFace(h%12+1,m,true,90)];
    if(new Set(opts).size<4)return genMirrorClock(d,L);
    return make("math",T(`Which clock shows ${tstr(h,m)} as it would look <b>in a mirror</b>?`,`أي ساعة تُظهر الوقت ${tstr(h,m)} كما يبدو <b>في المرآة</b>؟`),null,opts[0],opts.slice(1),
      T(`A mirror swaps left and right, so the hands are flipped across the line from 12 to 6. The mirror picture of ${tstr(h,m)} looks like ${tstr(mh,mm)} on a normal clock.`,`المرآة تبدّل اليمين واليسار، فتنقلب العقارب حول الخط الواصل بين ١٢ و٦. صورة ${tstr(h,m)} في المرآة تشبه ${tstr(mh,mm)} على ساعة عادية.`),"svg");
  }
  const wr=[tstr(mh,mm),tstr(h,(m+30)%60),tstr((h%12)+1,m),tstr(((h+5)%12)+1,m)].filter(x=>x!==tstr(h,m));
  return make("math",T("This is a clock seen <b>in a mirror</b>. What time is it really?","هذه ساعة كما تظهر <b>في المرآة</b>. كم الساعة في الحقيقة؟"),clockFace(h,m,true),tstr(h,m),[...new Set(wr)].slice(0,3),
    T(`Flip the picture left to right in your head. A quick check: the real time and the mirror time add up to 12:00 (here ${tstr(mh,mm)} + ${tstr(h,m)} = 12:00).`,`اقلب الصورة يمينًا ويسارًا في ذهنك. وللتحقق: الوقت الحقيقي ووقت المرآة مجموعهما ١٢:٠٠ (هنا ${tstr(mh,mm)} + ${tstr(h,m)} = ١٢:٠٠).`));
}
reg("mirrorClock","math",genMirrorClock,{en:"Mirror clocks",ar:"الساعة في المرآة",min:3,max:9});

/* ================= SCIENCE: doubling (cell division, bacteria) ================= */
function genDoubling(d,L){
  const T=tr(L);
  if(d<=3){
    const gens=3,ask=d<=2?4:5;let inner="",y=18;
    for(let g=0;g<gens;g++){const n=2**g,w=300/n;for(let i=0;i<n;i++)inner+=`<circle cx="${(w*i+w/2).toFixed(1)}" cy="${y}" r="10" fill="#2BA57F" fill-opacity=".75" stroke="${INK}" stroke-width="1.5"/>`;y+=34;}
    inner+=txt(150,y+6,22,"?",{c:"#E2457A"});
    const ans=2**(ask-1);
    return make("science",T(`The picture shows ${gens} generations of a cell dividing: every cell splits into two. How many cells will there be in generation ${ask}?`,`يوضح الشكل ${gens} أجيال من انقسام خلية؛ كل خلية تنقسم إلى خليتين. كم خلية ستكون في الجيل ${ask === 4 ? "الرابع" : "الخامس"}؟`),
      svg(300,y+16,inner,"cell division","vis",320),String(ans),[ans-2,ans+2,ans/2,ans*2].filter(x=>x!==ans).slice(0,3).map(String),
      T(`The number doubles each generation: 1, 2, 4, 8, 16 …`,`يتضاعف العدد في كل جيل: ١، ٢، ٤، ٨، ١٦ …`));
  }
  if(d>=7&&Math.random()<.4){
    const N=rnd(10,40),thing=pick([{en:"water lilies",ar:"زنابق الماء"},{en:"algae",ar:"الطحالب"}]);
    return make("science",T(`${thing.en[0].toUpperCase()+thing.en.slice(1)} on a pond double the area they cover every day. On day ${N} the pond is completely covered. On which day was it half covered?`,`تتضاعف المساحة التي تغطيها ${thing.ar} في بركة كل يوم، وفي اليوم ${N} غطّت البركة كلها. في أي يوم كانت تغطي نصف البركة؟`),null,
      String(N-1),nearNums(N-1,[Math.floor(N/2),N-2,N,Math.ceil(N/2)+1],{min:1}).map(String),
      T(`Doubling means the day before full is half: day ${N-1}.`,`التضاعف يعني أن اليوم الذي يسبق التغطية الكاملة كانت فيه نصف البركة: اليوم ${N-1}.`));
  }
  const every=pick([10,15,20,30]),hours=d<=5?1:pick([1,2]),start=pick([1,2,3,5]),steps=hours*60/every,ans=start*2**steps;
  if(ans>100000)return genDoubling(d,L);
  return make("science",T(`A type of bacteria doubles every ${every} minutes. A dish starts with ${start} bacteri${start>1?"a":"um"}. How many will there be after ${hours} hour${hours>1?"s":""}?`,`نوع من البكتيريا يتضاعف عدده كل ${every} دقيقة. بدأ طبق بـ ${start} ${start===1?"خلية":start===2?"خليتين":"خلايا"}. كم سيكون العدد بعد ${hours===1?"ساعة":"ساعتين"}؟`).replace("بـ 2 خليتين","بخليتين").replace("بـ 1 خلية","بخلية واحدة"),null,
    String(ans),nearNums(ans,[start*2*steps,ans/2,ans*2,start+2*steps,ans*4,ans-start].filter(x=>Number.isInteger(x)),{min:1}).map(String),
    T(`${hours*60} ÷ ${every} = ${steps} doublings. ${start} × 2${steps>1&&steps<=6?" × 2".repeat(steps-1):steps>6?` × … (2 multiplied ${steps} times)`:""} = ${ans}.`,`${hours*60} ÷ ${every} = ${steps} ${steps<=10?"مرات":"مرة"} تضاعف. ${start} × 2${steps>1&&steps<=6?" × 2".repeat(steps-1):steps>6?` × … (العدد 2 مضروبًا في نفسه ${steps} ${steps<=10?"مرات":"مرة"})`:""} = ${ans}.`));
}
reg("doubling","science",genDoubling,{en:"Doubling and cell division",ar:"التضاعف وانقسام الخلايا",min:1,max:9});

/* ================= SCIENCE: forces that turn a wheel ================= */
/* positions on the rim; screen coords (y down). Torque sign: + = counter-clockwise */
const POS={top:{x:0,y:-1},bottom:{x:0,y:1},left:{x:-1,y:0},right:{x:1,y:0}};
function torque(p,dir,mag,arm){/* convert to maths coords (y up) */const px=POS[p].x*arm,py=-POS[p].y*arm,fx=dir.x*mag,fy=-dir.y*mag;return px*fy-py*fx;}
const DIRS={top:[{x:1,y:0},{x:-1,y:0}],bottom:[{x:1,y:0},{x:-1,y:0}],left:[{x:0,y:-1},{x:0,y:1}],right:[{x:0,y:-1},{x:0,y:1}]};
function genForces(d,L){
  const T=tr(L),cx=150,cy=105,R=62,n=2;
  const ps=shuffle(Object.keys(POS)).slice(0,n);
  const fs=ps.map(p=>({p,dir:pick(DIRS[p]),mag:d>=6?pick([1,2]):1,arm:d>=8&&Math.random()<.5?.5:1}));
  if(d>=6&&fs.every(f=>f.mag===fs[0].mag)&&fs.every(f=>f.arm===1))fs[0].mag=2;
  const tot=fs.reduce((a,f)=>a+torque(f.p,f.dir,f.mag,f.arm),0);
  let inner=`<circle cx="${cx}" cy="${cy}" r="${R}" fill="#DCEBFB" stroke="${INK}" stroke-width="4"/><circle cx="${cx}" cy="${cy}" r="${R/2}" fill="none" stroke="${INK}" stroke-opacity=".25" stroke-dasharray="4 4"/><circle cx="${cx}" cy="${cy}" r="6" fill="${INK}"/>`;
  for(const f of fs){
    const px=cx+POS[f.p].x*R*f.arm,py=cy+POS[f.p].y*R*f.arm,len=26+f.mag*16,ex=px+f.dir.x*len,ey=py+f.dir.y*len;
    const ah=8,bx=ex-f.dir.x*ah*1.6,by=ey-f.dir.y*ah*1.6,nx=-f.dir.y,ny=f.dir.x;
    inner+=`<circle cx="${px}" cy="${py}" r="4.5" fill="#E2457A"/><line x1="${px}" y1="${py}" x2="${bx}" y2="${by}" stroke="#E2457A" stroke-width="5"/><polygon points="${ex},${ey} ${bx+nx*ah},${by+ny*ah} ${bx-nx*ah},${by-ny*ah}" fill="#E2457A"/>`;
    inner+=txt(ex+f.dir.x*14+(f.dir.x===0?16:0),ey+f.dir.y*14+6+(f.dir.y===0?-10:0),15,f.mag===2?"2F":"F",{c:"#E2457A"});
  }
  const CW=T("It turns clockwise ↻","تدور مع عقارب الساعة ↻"),CCW=T("It turns counter-clockwise ↺","تدور عكس عقارب الساعة ↺"),NO=T("It does not turn","لا تدور"),SIDE=T("It slides sideways","تنزلق إلى الجانب");
  const ans=tot>0?CCW:tot<0?CW:NO;
  const halfNote=fs.some(f=>f.arm<1)?T(" A force pushing halfway to the centre has only half the turning effect."," والقوة المؤثرة في منتصف المسافة إلى المركز لها نصف أثر الدوران فقط."):"";
  return make("science",T(`A wheel can spin freely on a fixed axle at its centre. The forces shown act on it at the same moment. What happens to the wheel?`,`عجلة تدور بحرية حول محور ثابت في مركزها، وتؤثر فيها القوتان الموضحتان في اللحظة نفسها. ماذا يحدث للعجلة؟`),
    svg(300,215,inner,"forces on a wheel","vis",320),ans,[CW,CCW,NO,SIDE].filter(x=>x!==ans),
    T(`Look at which way each force tries to turn the wheel around the axle.${halfNote} ${tot===0?"The two turning effects are equal and opposite, so they cancel.":"The stronger turning effect wins."} The axle is fixed, so the wheel cannot slide.`,`انظر إلى الاتجاه الذي تحاول كل قوة أن تدير العجلة فيه حول المحور.${halfNote} ${tot===0?"أثرا الدوران متساويان ومتعاكسان فيلغي أحدهما الآخر.":"الأثر الأكبر هو الذي يحدد اتجاه الدوران."} والمحور ثابت فلا يمكن أن تنزلق العجلة.`));
}
reg("forces","science",genForces,{en:"Forces that turn",ar:"القوى وأثر الدوران",min:3,max:9});

/* ================= SCIENCE: gravity between two bodies ================= */
function genGravity(d,L){
  const T=tr(L),kg=L==="ar"?"كجم":"kg",mU=L==="ar"?"م":"m";
  let cfg,guard=0;
  do{cfg=[];const seen=new Set();while(cfg.length<4){const c={a:rnd(1,4),b:rnd(1,4),r:rnd(1,3)};const k=[Math.min(c.a,c.b),Math.max(c.a,c.b),c.r].join();if(seen.has(k))continue;seen.add(k);c.f=c.a*c.b/(c.r*c.r);cfg.push(c);}
    var sorted=cfg.slice().sort((x,y)=>y.f-x.f);guard++;}while((sorted[0].f<sorted[1].f*1.3)&&guard<200);
  const weakest=d>=8&&Math.random()<.4;if(weakest){sorted=cfg.slice().sort((x,y)=>x.f-y.f);if(sorted[0].f*1.3>sorted[1].f)return genGravity(d,L);}
  const pic=c=>{const ra=8+c.a*4,rb=8+c.b*4,gap=c.r*24;const x1=12+ra,x2=x1+ra+gap+rb;const w=x2+rb+12;
    return svg(Math.max(w,120),80,`<circle cx="${x1}" cy="40" r="${ra}" fill="#7B5CD6" fill-opacity=".8"/><circle cx="${x2}" cy="40" r="${rb}" fill="#7B5CD6" fill-opacity=".8"/><line x1="${x1}" y1="${40+Math.max(ra,rb)+6}" x2="${x2}" y2="${40+Math.max(ra,rb)+6}" stroke="${INK}" stroke-width="1.5" stroke-dasharray="3 3"/>`+
      txt(x1,44,11,c.a,{c:"#fff"})+txt(x2,44,11,c.b,{c:"#fff"})+txt((x1+x2)/2,40+Math.max(ra,rb)+18>78?76:40+Math.max(ra,rb)+18,11,`${c.r} ${mU}`),"two bodies","");};
  const best=sorted[0],opts=cfg.map(pic),ai=cfg.indexOf(best);
  return make("science",T(`Each picture shows two balls made of the same material; the number on each ball is its mass in ${kg}, and the dashed line is the distance between them. In which picture is the pull of gravity between the two balls the <b>${weakest?"weakest":"strongest"}</b>?`,`كل شكل فيه كرتان من المادة نفسها؛ الرقم على الكرة كتلتها بالـ${kg}، والخط المتقطع المسافة بينهما. في أي شكل تكون قوة التجاذب بين الكرتين <b>${weakest?"أضعف":"أكبر"}</b> ما يمكن؟`),null,
    opts[ai],opts.filter((_,i)=>i!==ai),
    T(`Gravity grows with the masses and weakens quickly with distance (twice as far → a quarter of the pull). Compare mass × mass ÷ (distance × distance): ${cfg.map(c=>`${c.a}×${c.b}÷${c.r*c.r} = ${+c.f.toFixed(2)}`).join(", ")}.`,
      `تزداد قوة التجاذب بزيادة الكتلتين وتضعف بسرعة مع المسافة (ضعف المسافة ← ربع القوة). قارن: الكتلة × الكتلة ÷ (المسافة × المسافة): ${cfg.map(c=>`${c.a}×${c.b}÷${c.r*c.r} = ${+c.f.toFixed(2)}`).join("، ")}.`),"svg");
}
reg("gravity","science",genGravity,{en:"Gravity between bodies",ar:"قوة التجاذب",min:6,max:9});

/* ================= SCIENCE: life cycles and other ordered processes ================= */
const CYC=[
 {d:1,en:["the life cycle of a butterfly",["Egg","Caterpillar","Chrysalis (pupa)","Butterfly"]],ar:["دورة حياة الفراشة",["بيضة","يرقة","عذراء (شرنقة)","فراشة"]]},
 {d:1,en:["how a person grows",["Baby","Child","Teenager","Adult","Elderly person"]],ar:["مراحل نمو الإنسان",["رضيع","طفل","مراهق","بالغ","مُسنّ"]]},
 {d:2,en:["the life cycle of a hen",["Egg","Chick hatching","Chick","Young hen","Hen laying eggs"]],ar:["دورة حياة الدجاجة",["بيضة","فقس الكتكوت","كتكوت","دجاجة صغيرة","دجاجة تضع البيض"]]},
 {d:2,en:["the life cycle of a bean plant",["Seed","Root and shoot appear","Seedling","Plant with flowers","Pods with new seeds"]],ar:["دورة حياة نبات الفاصولياء",["بذرة","ظهور الجذر والساق","بادرة صغيرة","نبات مزهر","قرون فيها بذور جديدة"]]},
 {d:3,en:["the life cycle of a frog",["Eggs (frogspawn)","Tadpole","Tadpole with legs","Young frog","Adult frog"]],ar:["دورة حياة الضفدع",["بيض","شرغوف (أبو ذنيبة)","شرغوف له أرجل","ضفدع صغير","ضفدع بالغ"]]},
 {d:3,en:["how dates ripen on a palm",["Flower cluster (tal')","Green, hard dates (khalal)","Soft, half-ripe dates (rutab)","Dry, fully ripe dates (tamr)"]],ar:["مراحل نضج ثمر النخيل",["طَلْع","خَلال (بلح أخضر صلب)","رُطَب","تمر"]]},
 {d:4,en:["the water cycle",["Sun warms the sea","Water evaporates","Vapour cools and forms clouds","Rain falls","Water flows back to the sea"]],ar:["دورة الماء في الطبيعة",["تسخّن الشمس ماء البحر","يتبخّر الماء","يبرد البخار فتتكوّن الغيوم","يهطل المطر","يعود الماء إلى البحر"]]},
 {d:4,en:["how bread is made",["Wheat is harvested","Grain is ground into flour","Flour, water and yeast are mixed","Dough rises","Dough is baked"]],ar:["مراحل صناعة الخبز",["حصاد القمح","طحن الحبوب","خلط الطحين بالماء والخميرة","تخمّر العجين","خَبز العجين"]]},
 {d:5,en:["a scientific investigation",["Ask a question","Make a prediction","Do a fair test","Record the results","Draw a conclusion"]],ar:["خطوات البحث العلمي",["طرح سؤال","وضع فرضية","إجراء تجربة عادلة","تسجيل النتائج","استخلاص النتيجة"]]},
 {d:6,en:["the path of food through the body",["Mouth","Oesophagus","Stomach","Small intestine","Large intestine"]],ar:["مسار الطعام في الجسم",["الفم","المريء","المعدة","الأمعاء الدقيقة","الأمعاء الغليظة"]]},
 {d:7,en:["the life of a star like the Sun",["Cloud of gas and dust","Young star forms","Main-sequence star (like the Sun now)","Red giant","White dwarf"]],ar:["مراحل حياة نجم مثل الشمس",["سحابة من الغاز والغبار","تكوّن نجم ناشئ","نجم مستقر (مثل الشمس الآن)","عملاق أحمر","قزم أبيض"]]},
 {d:8,en:["how a sound reaches your brain",["An object vibrates","The air vibrates","The eardrum vibrates","Tiny ear bones pass on the vibration","A nerve carries the signal to the brain"]],ar:["كيف يصل الصوت إلى الدماغ",["يهتز الجسم","يهتز الهواء","تهتز طبلة الأذن","تنقل عظيمات الأذن الاهتزاز","ينقل العصب الإشارة إلى الدماغ"]]}
];
function genCycle(d,L,opts){
  const {item,id}=bpick(CYC,d,opts,3),[title,steps]=item[L==="ar"?"ar":"en"],T=tr(L);
  const n=steps.length,order=shuffle(steps.map((_,i)=>i));        /* order[k] = step shown with label k+1 */
  const label=k=>String(k+1);
  const list=order.map((s,k)=>`<li><b>${label(k)}</b> ${steps[s]}</li>`).join("");
  const correct=steps.map((_,s)=>label(order.indexOf(s)));       /* labels in the true order */
  const seq=a=>a.join(L==="ar"?" ، ":", ");
  const wrongs=[],seen=new Set([correct.join()]);let g=0;
  while(wrongs.length<3&&g++<100){const w=correct.slice();const i=rnd(0,n-2);if(Math.random()<.5){[w[i],w[i+1]]=[w[i+1],w[i]];}else{const j=rnd(0,n-1);[w[i],w[j]]=[w[j],w[i]];}
    if(g>40)shuffle(w).forEach((x,k)=>w[k]=x);const k=w.join();if(!seen.has(k)){seen.add(k);wrongs.push(seq(w));}}
  return make("science",T(`Put the stages of <b>${title}</b> in the right order:`,`رتّب مراحل <b>${title}</b> ترتيبًا صحيحًا:`)+`<ul class="steps">${list}</ul>`,null,seq(correct),wrongs,
    T(`The right order is: ${steps.join(" → ")}.`,`الترتيب الصحيح: ${steps.join(" ← ")}.`),"text","cyc:"+id);
}
reg("cycle","science",genCycle,{en:"Life cycles and processes",ar:"دورات الحياة وترتيب العمليات",min:1,max:9,bank:true});

/* ================= SCIENCE: more facts, mostly for levels 2 and 3 ================= */
const F=(d,en,ar)=>({d,en,ar});
const MORE=[
F(2,["Which tool would you use to see tiny living cells?","A microscope",["A telescope","A thermometer","A magnet"],"A microscope makes very small things look bigger."],["أي أداة تستخدمها لرؤية الخلايا الحية الدقيقة؟","المجهر",["المنظار الفلكي","ميزان الحرارة","المغناطيس"],"المجهر يكبّر الأشياء الصغيرة جدًّا."]),
F(3,["Why do people often wear light-coloured clothes in summer?","They reflect more sunlight, so they stay cooler",["They are heavier","They soak up more heat","They dry more slowly"],"Light colours reflect sunlight; dark colours absorb it and get hot."],["لماذا يلبس الناس غالبًا ملابس فاتحة اللون في الصيف؟","لأنها تعكس أشعة الشمس أكثر فتبقى أبرد",["لأنها أثقل","لأنها تمتص حرارة أكثر","لأنها تجف ببطء"],"الألوان الفاتحة تعكس أشعة الشمس، والداكنة تمتصها فتسخن."]),
F(3,["A globe is a small round copy of the Earth. In science, a globe is an example of …","A model",["An experiment","A measurement","A machine"],"A model is a simpler copy of something that helps us understand it."],["مجسّم الكرة الأرضية نسخة صغيرة مستديرة من الأرض. يُعدّ في العلوم مثالًا على …","النموذج",["التجربة","القياس","الآلة"],"النموذج نسخة مبسّطة من شيء ما تساعدنا على فهمه."]),
F(4,["Which of these makes a solution when stirred into a glass of water?","Sugar",["Sand","Cooking oil","Small pebbles"],"Sugar dissolves completely and spreads evenly through the water; the others stay separate."],["أي هذه المواد تكوّن محلولًا عند تقليبها في كوب ماء؟","السكر",["الرمل","زيت الطبخ","الحصى الصغيرة"],"السكر يذوب كليًّا وينتشر في الماء بالتساوي، أما الأخرى فتبقى منفصلة."]),
F(4,["Which material lets electricity flow through it best?","Copper wire",["A rubber band","A plastic ruler","A wooden stick"],"Metals such as copper are good conductors; rubber, plastic and wood are insulators."],["أي هذه المواد يمرّر الكهرباء أفضل من غيره؟","سلك النحاس",["الشريط المطاطي","المسطرة البلاستيكية","العصا الخشبية"],"الفلزات مثل النحاس موصلة جيدة، أما المطاط والبلاستيك والخشب فعوازل."]),
F(4,["Which change can easily be reversed?","Melting chocolate",["Burning paper","Baking a cake","Frying an egg"],"Melted chocolate can be cooled and turned solid again. The others make new substances."],["أي هذه التغيّرات يمكن عكسه بسهولة؟","انصهار الشوكولاتة",["احتراق الورق","خَبز الكعك","قلي البيضة"],"الشوكولاتة المنصهرة تتجمّد ثانية إذا بردت، أما الأخرى فتنتج مواد جديدة."]),
F(4,["Which animal eats only plants?","A camel",["A lion","An eagle","A shark"],"Camels are herbivores; the others hunt animals."],["أي هذه الحيوانات يأكل النباتات فقط؟","الجمل",["الأسد","النسر","القرش"],"الجمل من آكلات الأعشاب، أما الأخرى فتصطاد الحيوانات."]),
F(5,["What causes day and night on Earth?","The Earth spinning on its axis",["The Earth moving around the Sun","The Moon blocking the Sun","Clouds covering the sky"],"As the Earth spins, each place turns towards the Sun (day) and away from it (night)."],["ما سبب تعاقب الليل والنهار على الأرض؟","دوران الأرض حول محورها",["دوران الأرض حول الشمس","حجب القمر للشمس","تغطية الغيوم للسماء"],"عندما تدور الأرض حول محورها يواجه كل مكان الشمس (نهار) ثم يبتعد عنها (ليل)."]),
F(5,["What happens to most materials when they are heated?","They expand",["They shrink","They become heavier","They lose their colour"],"Heating makes particles move more and spread out."],["ماذا يحدث لمعظم المواد عند تسخينها؟","تتمدّد",["تنكمش","يزداد وزنها","تفقد لونها"],"التسخين يجعل الجزيئات تتحرك أكثر وتتباعد."]),
F(5,["A bean seed is planted in damp soil. Which part grows out of it first?","The root",["The leaves","The flower","The fruit"],"The root comes out first to take in water."],["زُرعت بذرة فاصولياء في تربة رطبة. أي جزء يخرج منها أولًا؟","الجذر",["الأوراق","الزهرة","الثمرة"],"يخرج الجذر أولًا ليمتص الماء."]),
F(6,["Why do we see the Moon change shape during the month?","We see different parts of its sunlit half as it circles the Earth",["The Earth's shadow covers it every night","Clouds hide part of it","The Moon grows and shrinks"],"Half of the Moon is always lit by the Sun; how much of that half we see changes as it orbits."],["لماذا نرى شكل القمر يتغيّر خلال الشهر؟","لأننا نرى أجزاء مختلفة من نصفه المضاء أثناء دورانه حول الأرض",["لأن ظل الأرض يغطيه كل ليلة","لأن الغيوم تحجب جزءًا منه","لأن القمر يكبر ويصغر"],"نصف القمر مضاء بالشمس دائمًا، ويتغيّر ما نراه من هذا النصف أثناء دورانه."]),
F(6,["A ball rolled on grass stops sooner than one rolled on a smooth floor. Why?","Grass causes more friction",["Grass has more gravity","The floor is colder","The ball gets heavier on grass"],"Rough surfaces rub against the ball more and slow it down."],["تتوقف الكرة المتدحرجة على العشب أسرع منها على أرضية ملساء. لماذا؟","لأن العشب يسبّب احتكاكًا أكبر",["لأن جاذبية العشب أكبر","لأن الأرضية أبرد","لأن الكرة تثقل على العشب"],"السطح الخشن يحتك بالكرة أكثر فيبطئها."]),
F(6,["A cyclist brakes suddenly and his body lurches forward. Why?","His body tends to keep moving (inertia)",["The brakes push him forward","The wind pushes him","Gravity suddenly increases"],"A moving body keeps moving unless a force stops it."],["يضغط دراج على المكابح فجأة فيندفع جسمه إلى الأمام. لماذا؟","لأن جسمه يميل إلى الاستمرار في الحركة (القصور الذاتي)",["لأن المكابح تدفعه إلى الأمام","لأن الريح تدفعه","لأن الجاذبية تزداد فجأة"],"الجسم المتحرك يبقى متحركًا ما لم تؤثر فيه قوة توقفه."]),
F(6,["In the food chain grass → rabbit → fox, where does the energy come from in the first place?","The Sun",["The fox","The soil only","Rainwater"],"Grass uses sunlight to make food; the energy then passes along the chain."],["في السلسلة الغذائية: عشب ← أرنب ← ثعلب، من أين تأتي الطاقة في الأصل؟","الشمس",["الثعلب","التربة فقط","ماء المطر"],"يستخدم العشب ضوء الشمس لصنع غذائه، ثم تنتقل الطاقة عبر السلسلة."]),
F(6,["Which of these is a renewable source of energy?","Wind",["Coal","Natural gas","Petrol"],"Wind will not run out; coal, gas and petrol take millions of years to form."],["أي هذه مصدر متجدّد للطاقة؟","الرياح",["الفحم","الغاز الطبيعي","البنزين"],"الرياح لا تنفد، أما الفحم والغاز والبنزين فتحتاج ملايين السنين لتتكوّن."]),
F(6,["A ramp used to push a heavy box onto a truck is which simple machine?","An inclined plane",["A lever","A pulley","A wheel and axle"],"A ramp is a sloping surface: an inclined plane."],["المنحدر الذي نرفع عليه صندوقًا ثقيلًا إلى شاحنة مثال على أي آلة بسيطة؟","السطح المائل",["الرافعة","البكرة","العجلة والمحور"],"المنحدر سطح مائل."]),
F(7,["A plant is kept in a dark cupboard for a week and becomes pale and weak. Which process could it not carry out?","Photosynthesis",["Respiration","Digestion","Melting"],"Without light, the plant cannot make its food."],["وُضع نبات في خزانة مظلمة أسبوعًا فأصبح شاحبًا ضعيفًا. أي عملية لم يستطع القيام بها؟","البناء الضوئي",["التنفّس","الهضم","الانصهار"],"بدون ضوء لا يستطيع النبات صنع غذائه."]),
F(7,["Mixing baking soda with vinegar makes lots of bubbles. The bubbles are …","A new gas made by a chemical reaction",["Air that was trapped in the jar","Steam from boiling","Pieces of vinegar"],"Baking soda and vinegar react and produce carbon dioxide gas."],["عند خلط بيكربونات الصوديوم بالخل تتكوّن فقاعات كثيرة. هذه الفقاعات …","غاز جديد ناتج عن تفاعل كيميائي",["هواء كان محبوسًا في الإناء","بخار ناتج عن الغليان","قطع من الخل"],"يتفاعل البيكربونات مع الخل فينتج غاز ثاني أكسيد الكربون."]),
F(7,["Sound travels fastest through which of these?","Steel",["Air","Water","Empty space"],"Sound moves fastest through solids, slower through liquids and gases, and cannot travel through empty space."],["ينتقل الصوت بأكبر سرعة خلال أي مما يأتي؟","الفولاذ",["الهواء","الماء","الفراغ"],"ينتقل الصوت أسرع في المواد الصلبة، ثم السوائل، ثم الغازات، ولا ينتقل في الفراغ."]),
F(7,["Why do we see lightning before we hear the thunder?","Light travels much faster than sound",["Thunder happens later","Our eyes are closer to the sky than our ears","Sound travels faster than light"],"Both happen together, but light reaches us almost instantly."],["لماذا نرى البرق قبل أن نسمع الرعد؟","لأن الضوء أسرع بكثير من الصوت",["لأن الرعد يحدث لاحقًا","لأن العين أقرب إلى السماء من الأذن","لأن الصوت أسرع من الضوء"],"يحدثان معًا، لكن الضوء يصل إلينا في لحظة تقريبًا."]),
F(7,["Which gas do we breathe out in larger amounts than we breathe in?","Carbon dioxide",["Oxygen","Hydrogen","Helium"],"The body uses oxygen and gives off carbon dioxide."],["أي غاز نُخرجه في الزفير بكمية أكبر مما نستنشقه؟","ثاني أكسيد الكربون",["الأكسجين","الهيدروجين","الهيليوم"],"يستهلك الجسم الأكسجين ويُخرج ثاني أكسيد الكربون."]),
F(8,["A pencil standing in a glass of water looks bent. This is because light …","Changes direction as it passes from water into air",["Is reflected by the pencil","Is absorbed by the water","Always travels in curves"],"Light bends when it moves from one material into another (refraction)."],["يبدو القلم الموضوع في كوب ماء مكسورًا. السبب أن الضوء …","يغيّر اتجاهه عند انتقاله من الماء إلى الهواء",["ينعكس عن القلم","يمتصه الماء","يسير دائمًا في خطوط منحنية"],"ينكسر الضوء عندما ينتقل من وسط إلى آخر."]),
F(8,["Which of these is a periodic change (one that repeats regularly)?","The seasons of the year",["An earthquake","A volcano erupting","A child growing up"],"Seasons repeat in the same order every year."],["أي هذه تغيّر دوري (يتكرر بانتظام)؟","فصول السنة",["الزلزال","ثوران البركان","نمو الطفل"],"تتكرر الفصول بالترتيب نفسه كل عام."]),
F(8,["Long metal bridges are built with small gaps in them. Why?","To let the metal expand in hot weather",["To save metal","To let rain drain away","To make the bridge lighter"],"Metal expands when it is hot; the gaps stop the bridge from buckling."],["تُترك فواصل صغيرة في الجسور المعدنية الطويلة. لماذا؟","ليتمدّد المعدن في الجو الحار",["لتوفير المعدن","لتصريف ماء المطر","لتخفيف وزن الجسر"],"المعدن يتمدّد بالحرارة، والفواصل تمنع الجسر من الالتواء."]),
F(8,["As a ball falls from a high shelf, which energy change happens?","Potential energy changes into kinetic energy",["Kinetic energy changes into potential energy","Sound energy changes into heat","No energy changes"],"Height (stored energy) turns into movement as it falls."],["عندما تسقط كرة من رف عالٍ، أي تحوّل للطاقة يحدث؟","تتحوّل الطاقة الكامنة إلى طاقة حركية",["تتحوّل الطاقة الحركية إلى كامنة","تتحوّل الطاقة الصوتية إلى حرارية","لا تتحوّل الطاقة"],"تتحوّل طاقة الارتفاع المخزنة إلى حركة أثناء السقوط."]),
F(8,["An ice cube floats in a glass of water. This tells us that …","Ice is less dense than liquid water",["Ice is heavier than water","Ice is not made of water","Water pushes every solid upwards"],"Water expands as it freezes, so ice is less dense and floats."],["يطفو مكعب الثلج في كوب الماء. يدل ذلك على أن …","كثافة الجليد أقل من كثافة الماء السائل",["الجليد أثقل من الماء","الجليد ليس مصنوعًا من الماء","الماء يدفع كل جسم صلب إلى أعلى"],"يتمدّد الماء عند تجمّده فتقل كثافته فيطفو."]),
F(9,["An iron cube and a wooden cube are exactly the same size. Which statement is true?","The iron cube has more mass",["They have the same mass","The wooden cube has more mass","Mass depends only on size"],"Iron is much denser than wood, so the same size holds more mass."],["مكعب من الحديد ومكعب من الخشب لهما الحجم نفسه تمامًا. أي العبارات صحيحة؟","كتلة مكعب الحديد أكبر",["كتلتاهما متساويتان","كتلة مكعب الخشب أكبر","الكتلة تعتمد على الحجم فقط"],"كثافة الحديد أكبر بكثير من كثافة الخشب، فالحجم نفسه يحمل كتلة أكبر."]),
F(9,["In a sealed jar, 20 g of one liquid reacts with 30 g of another and a solid forms. What is the total mass inside the jar afterwards?","50 g",["Less than 50 g","More than 50 g","It depends on the colour"],"In a closed container no matter escapes, so the total mass stays the same."],["في إناء مغلق تفاعل ٢٠ جم من سائل مع ٣٠ جم من سائل آخر فتكوّنت مادة صلبة. كم الكتلة الكلية داخل الإناء بعد التفاعل؟","٥٠ جم",["أقل من ٥٠ جم","أكثر من ٥٠ جم","تعتمد على اللون"],"في الإناء المغلق لا تخرج أي مادة، فتبقى الكتلة الكلية ثابتة."]),
F(9,["Why does a hot-air balloon rise?","The hot air inside is less dense than the cooler air outside",["Hot air is heavier than cold air","The balloon has no weight","The flame pushes it like a rocket"],"Less dense air floats up through denser air, carrying the balloon."],["لماذا يرتفع المنطاد الهوائي الساخن؟","لأن الهواء الساخن داخله أقل كثافة من الهواء البارد خارجه",["لأن الهواء الساخن أثقل من البارد","لأن المنطاد بلا وزن","لأن اللهب يدفعه كالصاروخ"],"الهواء الأقل كثافة يرتفع خلال الهواء الأكثف فيحمل المنطاد معه."]),
F(9,["Which organs remove waste from the blood and make urine?","The kidneys",["The lungs","The heart","The stomach"],"The kidneys filter the blood."],["أي الأعضاء ينقّي الدم من الفضلات ويكوّن البول؟","الكليتان",["الرئتان","القلب","المعدة"],"الكليتان تُرشّحان الدم."]),
F(9,["Earth takes about 365 days to …","Travel once around the Sun",["Spin once on its axis","Travel once around the Moon","Pass through all the Moon's phases"],"One orbit of the Sun is one year."],["تستغرق الأرض نحو ٣٦٥ يومًا لكي …","تدور دورة كاملة حول الشمس",["تدور دورة واحدة حول محورها","تدور حول القمر","تمر بجميع أطوار القمر"],"الدورة الكاملة حول الشمس سنة واحدة."])
];
for(const m of MORE)NB.BANKS.facts.push(m);
})();
