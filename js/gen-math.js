/* Nabeeh — Mathematical & spatial reasoning generators (English + Arabic). */
(function(){
"use strict";
const {rnd,pick,shuffle,nearNums,tr,arc,make,reg,svg,optSvg,arrow,shp,qmark,txt,INK,COLORS,SHAPES,SHAPE_NAME,person,people,gcd,clamp}=NB;
const SEC="math";
const SEP=L=>L==="ar"?"  ،  ":"  →  ";
const big=(s,L)=>`<span class="seq" dir="${L==="ar"?"rtl":"ltr"}">${s}</span>`;
const fr=(n,d)=>`<span class="fr"><b>${n}</b><i>${d}</i></span>`;
NB.fr=fr;

/* ---------- 1. Number series ---------- */
const SEQ=[
 [1,4,()=>{const s=rnd(1,9),k=rnd(2,6);return {t:[0,1,2,3].map(i=>s+i*k),a:s+4*k,why:["Each number goes up by "+k+".","كل عدد يزيد "+k+" على الذي قبله."]};}],
 [1,4,()=>{const s=rnd(40,70),k=rnd(3,7);return {t:[0,1,2,3].map(i=>s-i*k),a:s-4*k,why:["Each number goes down by "+k+".","كل عدد ينقص "+k+" عن الذي قبله."]};}],
 [2,5,()=>{const s=rnd(1,4);return {t:[s,s*2,s*4,s*8],a:s*16,why:["Each number is doubled (×2).","كل عدد ضعف الذي قبله (×2)."]};}],
 [2,5,()=>{const s=rnd(1,6);return {t:[s,s+1,s+3,s+6],a:s+10,why:["Add 1, then 2, then 3, so next add 4.","نضيف 1 ثم 2 ثم 3، إذن نضيف 4."]};}],
 [3,6,()=>{const s=rnd(6,12),a=rnd(4,6),b=rnd(1,3);return {t:[s,s+a,s+a-b,s+2*a-b,s+2*a-2*b],a:s+3*a-2*b,why:[`The pattern is +${a}, −${b}, +${a}, −${b}…`,`النمط: +${a} ثم −${b} ثم +${a} ثم −${b}…`]};}],
 [3,6,()=>{const s=rnd(1,3);let x=s;const t=[x];for(let i=0;i<3;i++){x=x*2+1;t.push(x);}return {t,a:x*2+1,why:["Double the number, then add 1.","نضرب العدد في 2 ثم نضيف 1."]};}],
 [4,7,()=>{const s=rnd(1,3);return {t:[1,2,3,4].map(i=>(i+s-1)**2),a:(s+4)**2,why:["These are square numbers: n × n.","هذه أعداد مربعة: العدد × نفسه."]};}],
 [4,7,()=>{const s=rnd(1,3);return {t:[s,s*3,s*9,s*27],a:s*81,why:["Each number is multiplied by 3.","كل عدد يُضرب في 3."]};}],
 [4,7,()=>{const a=rnd(2,5),b=rnd(20,30),da=rnd(2,3),db=rnd(1,2);return {t:[a,b,a+da,b-db,a+2*da,b-2*db],a:a+3*da,why:[`Two patterns take turns: ${a}, ${a+da}, ${a+2*da}… goes up by ${da}, and ${b}, ${b-db}… goes down by ${db}.`,`نمطان متداخلان: ${a}، ${a+da}، ${a+2*da}… يزيد ${da}، و ${b}، ${b-db}… ينقص ${db}.`]};}],
 [5,8,()=>{const a=rnd(1,3),b=rnd(2,4);const t=[a,b];while(t.length<6)t.push(t[t.length-1]+t[t.length-2]);return {t,a:t[4]+t[5],why:["Each number is the sum of the two before it.","كل عدد هو مجموع العددين اللذين قبله."]};}],
 [5,8,()=>{const s=rnd(2,4);let x=s;const t=[x];for(let i=0;i<3;i++){x=x*2-1;t.push(x);}return {t,a:x*2-1,why:["Double the number, then subtract 1.","نضرب العدد في 2 ثم نطرح 1."]};}],
 [5,8,()=>{return {t:[1,3,6,10,15],a:21,why:["Add 2, then 3, then 4, then 5, so next add 6.","نضيف 2 ثم 3 ثم 4 ثم 5، إذن نضيف 6."]};}],
 [6,9,()=>{const s=rnd(3,6)*16;return {t:[s,s/2,s/4,s/8],a:s/16,why:["Each number is halved (÷2).","كل عدد نصف الذي قبله (÷2)."]};}],
 [6,9,()=>{const s=rnd(1,2);return {t:[1,2,3,4].map(i=>(i+s-1)**3),a:(s+4)**3,why:["These are cube numbers: n × n × n.","هذه أعداد مكعبة: العدد × نفسه × نفسه."]};}],
 [6,9,()=>{const s=rnd(1,3);const t=[s];let x=s;const ops=[];for(let i=0;i<4;i++){if(i%2===0){x=x*2;ops.push("×2");}else{x=x+3;ops.push("+3");}t.push(x);}return {t,a:x*2,why:["The pattern is ×2, then +3, then ×2, then +3…","النمط: ×2 ثم +3 ثم ×2 ثم +3…"]};}],
 [7,9,()=>{const P=[2,3,5,7,11,13,17,19,23,29,31,37];const i=rnd(0,5);return {t:P.slice(i,i+5),a:P[i+5],why:["These are prime numbers in order: each can only be divided by 1 and itself.","هذه أعداد أولية بالترتيب: لا يقبل كل منها القسمة إلا على 1 وعلى نفسه."]};}],
 [7,9,()=>{const s=rnd(1,3);return {t:[1,2,3,4,5].map(i=>(i+s)**2-(i+s)),a:(s+6)**2-(s+6),why:["Each term is n × (n − 1): the gaps grow by 2 each time.","كل حد = ن × (ن − 1)، والفروق تزيد 2 في كل مرة."]};}],
 [7,9,()=>{const t=[1,1,2,6,24];return {t,a:120,why:["Multiply by 1, then 2, then 3, then 4, so next ×5.","نضرب في 1 ثم 2 ثم 3 ثم 4، إذن نضرب في 5."]};}],
 [8,9,()=>{const a=rnd(1,2),b=rnd(1,3),c=rnd(2,4);const t=[a,b,c];while(t.length<6)t.push(t[t.length-1]+t[t.length-2]+t[t.length-3]);return {t,a:t[3+0]+t[4]+t[5],why:["Each number is the sum of the three before it.","كل عدد هو مجموع الأعداد الثلاثة التي قبله."]};}],
 [8,9,()=>{const s=rnd(2,5);const t=[s];let x=s,k=1;for(let i=0;i<4;i++){x=x+k*k;t.push(x);k++;}return {t,a:x+k*k,why:["Add 1, 4, 9, 16 (the square numbers), so next add 25.","نضيف 1 ثم 4 ثم 9 ثم 16 (الأعداد المربعة)، إذن نضيف 25."]};}]
];
function genSeq(d,L){
  const T=tr(L);
  const pool=SEQ.filter(s=>d>=s[0]&&d<=s[1]);const r=pick(pool)[2]();
  const t=r.t,ans=r.a,last=t[t.length-1],prev=t[t.length-2];
  const wr=nearNums(ans,[ans+1,ans-1,ans+2,ans-2,last+(last-prev),last*2,ans+(last-prev)]);
  return make(SEC,`${T("What number comes next?","ما العدد التالي في المتسلسلة؟")}<br>${big(t.join(SEP(L))+SEP(L)+"?",L)}`,null,String(ans),wr.map(String),T(r.why[0],r.why[1]));
}
reg("seq",SEC,genSeq,{en:"Number series",ar:"المتسلسلات العددية",min:1,max:9});

/* ---------- 2. Word problems ---------- */
function genWord(d,L){
  const T=tr(L),p=person(L),n=p.name,v=p.v;
  const R=[];
  if(d<=4){
    R.push(()=>{const a=rnd(2,6),b=rnd(2,7);return [T(`${n} has ${a} bags. Each bag has ${b} apples. How many apples does ${n} have?`,`لدى ${n} ${a} أكياس، في كل كيس ${b} تفاحات. كم تفاحة لدى ${n}؟`),a*b,[a+b,a*b+b,a*b-a,a*b+1],T(`${a} bags × ${b} apples = ${a*b}.`,`${a} أكياس × ${b} تفاحات = ${a*b}.`)];});
    R.push(()=>{const a=rnd(9,16),b=rnd(2,6),c=rnd(2,6);const s=a-b+c;return [T(`${n} had ${a} stickers, gave ${b} to a friend, then got ${c} more. How many stickers now?`,`كان مع ${n} ${a} ملصقًا، ${v("أعطى","أعطت")} صديقًا ${b}، ثم ${v("حصل","حصلت")} على ${c} أخرى. كم ملصقًا ${v("معه","معها")} الآن؟`),s,[a+b+c,a-b-c,a-b,s+1],T(`${a} − ${b} = ${a-b}, then + ${c} = ${s}.`,`${a} − ${b} = ${a-b}، ثم + ${c} = ${s}.`)];});
    R.push(()=>{const k=rnd(3,5);return [T(`A spider has 8 legs. How many legs do ${k} spiders have?`,`للعنكبوت 8 أرجل. كم رجلًا لـ ${k} عناكب؟`),8*k,[8+k,8*k-8,8*k+8,6*k],T(`${k} × 8 = ${8*k}.`,`${k} × 8 = ${8*k}.`)];});
    R.push(()=>{const a=rnd(3,9)*2;return [T(`${n} cut a pizza into ${a} slices and ate half of them. How many slices are left?`,`${v("قطع","قطعت")} ${n} فطيرة إلى ${arc(a,"قطع","قطعة")}، ${v("وأكل","وأكلت")} نصفها. كم قطعة بقيت؟`),a/2,[a,a-2,a/2+1,a/2-1],T(`Half of ${a} is ${a/2}.`,`نصف ${a} هو ${a/2}.`)];});
    R.push(()=>{const p1=rnd(3,6),p2=rnd(3,6),pay=p1+p2+rnd(1,8);return [T(`${n} buys a juice for ${p1} riyals and a sandwich for ${p2} riyals, and pays with ${pay} riyals. How much change does ${p.he} get?`,`${v("اشترى","اشترت")} ${n} عصيرًا بـ ${p1} ريالات وشطيرة بـ ${p2} ريالات، ${v("ودفع","ودفعت")} ${arc(pay,"ريالات","ريالًا")}. كم ريالًا ${v("يتبقى له","يتبقى لها")}؟`),pay-p1-p2,[p1+p2,pay-p1,pay-p2,pay-p1-p2+1],T(`${p1} + ${p2} = ${p1+p2}, and ${pay} − ${p1+p2} = ${pay-p1-p2}.`,`${p1} + ${p2} = ${p1+p2}، و ${pay} − ${p1+p2} = ${pay-p1-p2}.`)];});
    R.push(()=>{const r=rnd(3,6),c=rnd(3,6);return [T(`Chairs are set in ${r} rows with ${c} chairs in each row. How many chairs are there?`,`رُتبت الكراسي في ${r} صفوف، في كل صف ${c} كراسي. كم كرسيًا هناك؟`),r*c,[r+c,r*c+r,r*c-c,r*c+1],T(`${r} × ${c} = ${r*c}.`,`${r} × ${c} = ${r*c}.`)];});
  }
  if(d>=3&&d<=6){
    R.push(()=>{const per=rnd(4,8),tot=per*rnd(4,9);return [T(`${tot} pencils are shared equally among ${tot/per} children. How many pencils does each child get?`,`وُزّع ${tot} قلمًا بالتساوي على ${tot/per} أطفال. كم قلمًا يأخذ كل طفل؟`),per,[per+1,per-1,tot-tot/per,per*2],T(`${tot} ÷ ${tot/per} = ${per}.`,`${tot} ÷ ${tot/per} = ${per}.`)];});
    R.push(()=>{const box=rnd(6,9),items=box*rnd(3,6)+rnd(1,box-1),full=Math.floor(items/box);return [T(`A box holds ${box} eggs. How many boxes can be completely filled with ${items} eggs?`,`يتسع الصندوق لـ ${box} بيضات. كم صندوقًا يمكن ملؤه بالكامل بـ ${items} بيضة؟`),full,[full+1,full-1,items-full*box,full+2],T(`${full} × ${box} = ${full*box}, and the ${items-full*box} left over cannot fill another box.`,`${full} × ${box} = ${full*box}، والمتبقي ${items-full*box} لا يكفي لملء صندوق آخر.`)];});
    R.push(()=>{const st=rnd(1,5)*10+rnd(0,1)*5,dur=rnd(3,8)*5,h=rnd(2,5);const end=st+dur,eh=h+Math.floor(end/60),em=end%60;const f=(a,b)=>a+":"+String(b).padStart(2,"0");
      return [T(`A lesson starts at ${f(h,st)} and lasts ${dur} minutes. When does it end?`,`يبدأ درس الساعة ${f(h,st)} ويستمر ${dur} دقيقة. متى ينتهي؟`),f(eh,em),[f(eh,(em+10)%60),f(h,(st+dur+50)%60),f(eh+1,em),f(eh,(em+55)%60)],T(`${st} + ${dur} = ${st+dur} minutes after ${h}:00, which is ${f(eh,em)}.`,`${st} + ${dur} = ${st+dur} دقيقة بعد الساعة ${h}:00، أي ${f(eh,em)}.`),true];});
    R.push(()=>{const a=rnd(3,6),pa=rnd(3,5),b=rnd(3,4),pb=rnd(4,9);const s=a*pa+b*pb;return [T(`Notebooks cost ${pa} riyals each and pens cost ${pb} riyals each. How much do ${a} notebooks and ${b} pens cost?`,`سعر الدفتر ${pa} ريالات وسعر القلم ${pb} ريالات. كم ثمن ${a} دفاتر و ${b} أقلام؟`),s,[a*pa+pb,(a+b)*pa,(a+b)*pb,s+pa],T(`${a} × ${pa} = ${a*pa}, ${b} × ${pb} = ${b*pb}, total ${s}.`,`${a} × ${pa} = ${a*pa}، و ${b} × ${pb} = ${b*pb}، المجموع ${s}.`)];});
    R.push(()=>{const h=rnd(3,6),sh=rnd(3,5),he=h+sh;return [T(`A farmer counted ${he} heads among his chickens and sheep. ${sh} of them are sheep. How many legs are there in total?`,`عدّ مزارع ${arc(he,"رؤوس","رأسًا")} من الدجاج والخراف، منها ${sh} خراف. كم رجلًا في المجموع؟`),h*2+sh*4,[he*2,he*4,h*4+sh*2,h*2+sh*4+2],T(`${h} chickens × 2 = ${h*2}, ${sh} sheep × 4 = ${sh*4}, total ${h*2+sh*4}.`,`${h} دجاجات × 2 = ${h*2}، و ${sh} خراف × 4 = ${sh*4}، المجموع ${h*2+sh*4}.`)];});
  }
  if(d>=5&&d<=8){
    R.push(()=>{const tot=pick([40,60,80,120,160,200]),pc=pick([25,50,75,10,20]);const a=tot*pc/100;return [T(`What is ${pc}% of ${tot}?`,`كم يساوي ${pc}% من ${tot}؟`),a,[tot-a,a*2,pc,a+10],T(`${pc}% means ${pc} out of 100: ${tot} × ${pc} ÷ 100 = ${a}.`,`${pc}% تعني ${pc} من كل 100: ${tot} × ${pc} ÷ 100 = ${a}.`)];});
    R.push(()=>{const b=rnd(2,4),g=rnd(1,5);if(g===b)return null;const k=rnd(3,7),tot=(b+g)*k;return [T(`In a class, the ratio of boys to girls is ${b} : ${g}. There are ${tot} students. How many girls are there?`,`النسبة بين البنين والبنات في فصل ${b} : ${g}، وعدد الطلاب ${tot}. كم عدد البنات؟`),g*k,[b*k,tot-g,g*k+k,tot/2],T(`${b} + ${g} = ${b+g} parts. ${tot} ÷ ${b+g} = ${k} per part, so girls = ${g} × ${k} = ${g*k}.`,`${b} + ${g} = ${b+g} أجزاء. ${tot} ÷ ${b+g} = ${k} لكل جزء، إذن البنات = ${g} × ${k} = ${g*k}.`)];});
    R.push(()=>{const m=rnd(6,12);const a=m+rnd(-4,4),b=m+rnd(-4,4);const c=3*m-a-b;if(c<1)return null;return [T(`The average of three numbers is ${m}. Two of them are ${a} and ${b}. What is the third?`,`متوسط ثلاثة أعداد ${m}. اثنان منها ${a} و ${b}. ما العدد الثالث؟`),c,[m,3*m,a+b-m,c+1],T(`Three numbers with average ${m} add up to ${3*m}. ${3*m} − ${a} − ${b} = ${c}.`,`مجموع ثلاثة أعداد متوسطها ${m} هو ${3*m}. ${3*m} − ${a} − ${b} = ${c}.`)];});
    R.push(()=>{const v1=pick([40,50,60,80,90]),h=pick([2,3,4]),hh=Math.random()<.5;const dist=v1*h+(hh?v1/2:0);const hs=hh?T(h+" and a half",h+" ساعات ونصف"):String(h);return [T(`A car travels at ${v1} km per hour for ${hs} hours. How far does it go?`,`تسير سيارة بسرعة ${v1} كم في الساعة لمدة ${hs}${hh?"":" ساعات"}. ما المسافة التي تقطعها؟`),dist,[v1*h,v1*(h+1),dist+v1/2,dist-10],T(`Distance = speed × time = ${v1} × ${hh?h+".5":h} = ${dist} km.`,`المسافة = السرعة × الزمن = ${v1} × ${hh?h+".5":h} = ${dist} كم.`)];});
    R.push(()=>{const dd=pick([3,4,5,6,8]),nn=rnd(1,dd-1);if(gcd(nn,dd)!==1)return null;const tot=dd*rnd(3,8);const a=tot/dd*nn;return [T(`${n} read ${nn}/${dd} of a ${tot}-page book. How many pages did ${p.he} read?`,`${v("قرأ","قرأت")} ${n} ${nn}/${dd} كتاب عدد صفحاته ${tot}. كم صفحة ${v("قرأ","قرأت")}؟`),a,[tot-a,tot/dd,a+tot/dd,nn*dd],T(`${tot} ÷ ${dd} = ${tot/dd}, then × ${nn} = ${a}.`,`${tot} ÷ ${dd} = ${tot/dd}، ثم × ${nn} = ${a}.`)];});
  }
  if(d>=7){
    R.push(()=>{const s=rnd(4,9),k=pick([3,4]),y=s*(k-2);/* father = k*s now; in y years father = 2*(son) */const f=k*s;if((f+y)!==2*(s+y))return null;return [T(`A father is ${k} times as old as his son. In ${y} years he will be twice as old as his son. How old is the son now?`,`عمر الأب ${k} أمثال عمر ابنه. بعد ${arc(y,"سنوات","سنة")} يصبح عمر الأب ضعف عمر ابنه. كم عمر الابن الآن؟`),s,[s+y,f,s*2,s-1],T(`Son = ${s}, father = ${f}. In ${y} years: ${s+y} and ${f+y}, and ${f+y} = 2 × ${s+y}.`,`الابن ${s} والأب ${f}. بعد ${arc(y,"سنوات","سنة")}: ${s+y} و ${f+y}، و ${f+y} = 2 × ${s+y}.`)];});
    R.push(()=>{const pr=pick([3,6,4,12]),rest={3:6,6:3,4:12,12:4}[pr];const tg=pr*rest/(pr+rest);return [T(`Tap A fills a tank in ${pr} hours and tap B fills it in ${rest} hours. How many hours do both taps take together?`,`يملأ الصنبور (أ) خزانًا في ${arc(pr,"ساعات","ساعة")}، ويملؤه الصنبور (ب) في ${arc(rest,"ساعات","ساعة")}. كم ساعة يستغرقان معًا؟`),tg,[(pr+rest)/2,pr+rest,Math.min(pr,rest),Math.abs(pr-rest)],T(`Each hour A fills 1/${pr} and B fills 1/${rest}, together 1/${pr} + 1/${rest} = 1/${tg}. So ${tg} hours.`,`في الساعة يملأ (أ) 1/${pr} و(ب) 1/${rest}، معًا 1/${pr} + 1/${rest} = 1/${tg}. إذن ${tg} ساعة.`)];});
    R.push(()=>{const pr=pick([200,250,400,500,800]),dc=pick([10,20,25]);const after=pr*(100-dc)/100;return [T(`A bike costs ${pr} riyals. It is sold with a ${dc}% discount. What is the new price?`,`سعر دراجة ${pr} ريال، وعليها خصم ${dc}%. ما السعر بعد الخصم؟`),after,[pr-dc,pr*dc/100,after-dc,pr+pr*dc/100],T(`${dc}% of ${pr} = ${pr*dc/100}. ${pr} − ${pr*dc/100} = ${after}.`,`${dc}% من ${pr} = ${pr*dc/100}. ${pr} − ${pr*dc/100} = ${after}.`)];});
    R.push(()=>{const x=rnd(8,30),c=pick([3,4,5]);const sum=c*x+c*(c-1)/2;return [T(`The sum of ${c} consecutive whole numbers is ${sum}. What is the smallest of them?`,`مجموع ${c} أعداد صحيحة متتالية يساوي ${sum}. ما أصغرها؟`),x,[x+1,x-1,Math.round(sum/c),x+c],T(`${Array.from({length:c},(_,i)=>x+i).join(" + ")} = ${sum}.`,`${Array.from({length:c},(_,i)=>x+i).join(" + ")} = ${sum}.`)];});
    R.push(()=>{const ch=rnd(4,12),sh=rnd(3,10),he=ch+sh,lg=ch*2+sh*4;return [T(`A farm has chickens and sheep: ${he} heads and ${lg} legs. How many sheep are there?`,`في مزرعة دجاج وخراف: ${arc(he,"رؤوس","رأسًا")} و ${lg} رجلًا. كم عدد الخراف؟`),sh,[ch,he-sh+1,lg/4,sh+2],T(`If all ${he} were chickens there would be ${he*2} legs. The extra ${lg-he*2} legs come from sheep, 2 extra each: ${(lg-he*2)/2} sheep.`,`لو كانت كلها دجاجًا لكانت الأرجل ${he*2}. الزيادة ${lg-he*2} من الخراف، لكل خروف رجلان زائدتان: ${(lg-he*2)/2} خرافًا.`)];});
  }
  let r=null,t=0;while(!r&&t<20){r=pick(R)();t++;}
  const [q,ans,cands,why,isText]=r;
  const wr=isText?[...new Set(cands.filter(c=>c!==ans))].slice(0,3):nearNums(ans,cands);
  return make(SEC,q,null,String(ans),wr.map(String),why);
}
reg("word",SEC,genWord,{en:"Word problems",ar:"المسائل اللفظية",min:1,max:9});

/* ---------- 3. Turning arrows ---------- */
function genRotate(d,L){
  const T=tr(L),start=pick([0,90,180,270]),t=rnd(0,d>=3?4:3);
  let end,text,why;
  if(t===0){end=(start+90)%360;text=T("turns a quarter turn clockwise","يدور ربع دورة مع عقارب الساعة");why=T("A quarter turn clockwise moves the arrow one step to the right around the circle.","ربع دورة مع عقارب الساعة يحرك السهم خطوة واحدة باتجاه دوران العقارب.");}
  else if(t===1){end=(start+270)%360;text=T("turns a quarter turn counter-clockwise","يدور ربع دورة عكس عقارب الساعة");why=T("Counter-clockwise is the opposite way to a clock's hands.","عكس عقارب الساعة هو الاتجاه المعاكس لدوران العقارب.");}
  else if(t===2){end=(start+180)%360;text=T("turns a half turn","يدور نصف دورة");why=T("A half turn makes the arrow point the opposite way.","نصف الدورة يجعل السهم يشير إلى الاتجاه المعاكس.");}
  else if(t===3){end=(360-start)%360;text=T("is seen in a mirror standing beside it","يُرى في مرآة موضوعة بجانبه");why=T("A side mirror swaps left and right, but up and down stay the same.","المرآة الجانبية تبدّل اليمين واليسار، ويبقى الأعلى والأسفل كما هما.");}
  else {end=(start+270+180)%360;text=T("turns a quarter turn clockwise three times in a row","يدور ربع دورة مع عقارب الساعة ثلاث مرات متتالية");end=(start+270)%360;why=T("Three quarter turns clockwise are the same as one quarter turn counter-clockwise.","ثلاثة أرباع دورة مع العقارب تساوي ربع دورة عكسها.");}
  const dirs=[0,90,180,270],opts=dirs.map(dd=>optSvg(arrow(dd),"arrow"));
  return make(SEC,T(`The arrow ${text}. Where does it point now?`,`السهم ${text}. إلى أين يشير الآن؟`),svg(80,80,arrow(start),"arrow","vis",110),opts[dirs.indexOf(end)],opts.filter((_,i)=>dirs[i]!==end),why,"svg");
}
reg("rotate",SEC,genRotate,{en:"Turning arrows",ar:"تدوير الأسهم",min:1,max:4});

/* ---------- 4. Dice ---------- */
const PIPS={1:[[0,0]],2:[[-1,-1],[1,1]],3:[[-1,-1],[0,0],[1,1]],4:[[-1,-1],[1,-1],[-1,1],[1,1]],5:[[-1,-1],[1,-1],[0,0],[-1,1],[1,1]],6:[[-1,-1],[1,-1],[-1,0],[1,0],[-1,1],[1,1]]};
const die=(v,x,y,s)=>{let o=`<rect x="${x}" y="${y}" width="${s}" height="${s}" rx="${s*0.18}" fill="#fff" stroke="${INK}" stroke-width="2.5"/>`;for(const[a,b]of PIPS[v])o+=`<circle cx="${x+s/2+a*s*0.26}" cy="${y+s/2+b*s*0.26}" r="${s*0.09}" fill="#1E2A4A"/>`;return o;};
function genDice(d,L){
  const T=tr(L),top=rnd(1,6),rule=T("On a dice, the numbers on opposite faces always add up to 7.","في حجر النرد، مجموع العددين على كل وجهين متقابلين يساوي دائمًا 7.");
  if(d>=4){
    const n=d>=6?3:2,ts=Array.from({length:n},()=>rnd(1,6));const tot=ts.reduce((a,v)=>a+(7-v),0);
    let inner="";ts.forEach((v,i)=>inner+=die(v,8+i*74,8,64));
    return make(SEC,`${rule} ${T(`These ${n} dice show their top faces. What do the bottom faces add up to?`,`يظهر الوجه العلوي لهذه الأحجار الـ ${n}. ما مجموع الأوجه السفلية؟`)}`,svg(n*74+10,80,inner,"dice","vis",n*80),String(tot),nearNums(tot,[ts.reduce((a,v)=>a+v,0),7*n,tot+1,tot-1,tot+2]).map(String),
      T(`Each bottom face is 7 minus the top: ${ts.map(v=>7-v).join(" + ")} = ${tot}.`,`كل وجه سفلي = 7 − العلوي: ${ts.map(v=>7-v).join(" + ")} = ${tot}.`));
  }
  return make(SEC,`${rule} ${T("If the top face shows this, what is on the bottom face?","إذا كان الوجه العلوي هكذا، فما العدد على الوجه السفلي؟")}`,svg(80,80,die(top,8,8,64),"dice","vis",110),String(7-top),nearNums(7-top,[top,7,8-top,6-top,6]).map(String),T(`7 − ${top} = ${7-top}.`,`7 − ${top} = ${7-top}.`));
}
reg("dice",SEC,genDice,{en:"Dice",ar:"حجر النرد",min:1,max:6});

/* ---------- 5. Block towers ---------- */
function genBlocks(d,L){
  const T=tr(L),rows=d>=3?rnd(4,5):rnd(3,4),cols=[];let tot=0;
  for(let i=0;i<rows;i++){const n=rows-i;cols.push(n);tot+=n;}
  const c=26,W=rows*c+20,H=rows*c+20;let inner="";
  for(let r=0;r<rows;r++)for(let i=0;i<cols[r];i++){const x=10+i*c,y=H-10-(r+1)*c;inner+=`<rect x="${x}" y="${y}" width="${c-2}" height="${c-2}" rx="3" fill="#F2A900" stroke="${INK}" stroke-width="2"/>`;}
  if(d>=3){const need=rows*rows-tot;return make(SEC,T("How many more blocks are needed to make a full square?","كم مكعبًا إضافيًا نحتاج لنكمل مربعًا كاملًا؟"),svg(W,H,inner,"blocks","vis",Math.min(260,W*1.6)),String(need),nearNums(need,[tot,rows*rows,need+rows,need-1,need+1]).map(String),T(`A full ${rows}×${rows} square needs ${rows*rows} blocks; there are ${tot}, so ${rows*rows-tot} more.`,`المربع الكامل ${rows}×${rows} يحتاج ${rows*rows} مكعبًا، والموجود ${tot}، إذن نحتاج ${rows*rows-tot}.`));}
  return make(SEC,T("How many blocks are in this tower?","كم مكعبًا في هذا البرج؟"),svg(W,H,inner,"blocks","vis",Math.min(240,W*1.6)),String(tot),nearNums(tot,[tot+rows,tot-rows,tot+1,tot-1,rows*rows]).map(String),T(`Count each row: ${cols.join(" + ")} = ${tot}.`,`نعدّ كل صف: ${cols.join(" + ")} = ${tot}.`));
}
reg("blocks",SEC,genBlocks,{en:"Block towers",ar:"أبراج المكعبات",min:1,max:4});

/* ---------- 6. Shape equations ---------- */
function genShapeEq(d,L){
  const T=tr(L),C="#E2457A",C2="#2F7FD8",C3="#2BA57F";
  if(d>=6){
    const a=rnd(2,7),b=rnd(2,8),c=rnd(2,9),n=pick([2,3]);
    const [sa,sb,sc]=shuffle(["triangle","star","square","circle","hexagon","diamond"]).slice(0,3);
    let inner="",y=34;
    const row=(items,res,yy,ask)=>{let x=26,o="";items.forEach((it,i)=>{o+=shp(it[0],it[1],x,yy,18);x+=42;if(i<items.length-1)o+=txt(x-21,yy+9,24,"+");});o+=txt(x-14,yy+9,24,"=");o+=ask?qmark(x+18,yy+12,32):txt(x+20,yy+10,26,res);return o;};
    inner+=row(Array(n).fill([sa,C]),a*n,y);y+=60;
    inner+=row([[sa,C],[sb,C2]],a+b,y);y+=60;
    inner+=row([[sb,C2],[sc,C3]],b+c,y);y+=60;
    inner+=row([[sc,C3]],0,y,true);
    return make(SEC,T("Each shape stands for a number. What number does the green shape stand for?","كل شكل يمثل عددًا. ما العدد الذي يمثله الشكل الأخضر؟"),svg(240,y+30,inner,"shape equations","vis",250),String(c),nearNums(c,[a,b,b+c,a+b,c+1,c-1]).map(String),
      T(`Pink = ${a*n} ÷ ${n} = ${a}. Blue = ${a+b} − ${a} = ${b}. Green = ${b+c} − ${b} = ${c}.`,`الوردي = ${a*n} ÷ ${n} = ${a}. الأزرق = ${a+b} − ${a} = ${b}. الأخضر = ${b+c} − ${b} = ${c}.`));
  }
  const a=rnd(2,6),b=rnd(2,8),n=d>=3?3:2,sa=pick(["triangle","star"]),sb=pick(["square","circle","hexagon"]),sum=a*n;
  let inner="",x=28;
  for(let i=0;i<n;i++){inner+=shp(sa,C,x,34,20);x+=46;if(i<n-1)inner+=txt(x-23,44,26,"+");}
  inner+=txt(x-18,44,26,"=")+txt(x+16,45,30,sum);
  inner+=shp(sa,C,28,100,20)+txt(60,110,26,"+")+shp(sb,C2,92,100,20)+txt(124,110,26,"=")+txt(158,111,30,a+b);
  inner+=shp(sb,C2,28,166,20)+txt(60,176,26,"=")+qmark(92,180,34);
  return make(SEC,T("What number does the blue shape stand for?","ما العدد الذي يمثله الشكل الأزرق؟"),svg(Math.max(200,x+40),200,inner,"shape equation","vis",230),String(b),nearNums(b,[a,a+b,sum,b+1,b-1]).map(String),
    T(`${n} pink shapes make ${sum}, so one = ${a}. Then ${a} + blue = ${a+b}, so blue = ${b}.`,`${n} أشكال وردية = ${sum}، إذن الواحد = ${a}. ثم ${a} + الأزرق = ${a+b}، إذن الأزرق = ${b}.`));
}
reg("shapeEq",SEC,genShapeEq,{en:"Shape equations",ar:"معادلات الأشكال",min:2,max:9});

/* ---------- 7. Paper folding ---------- */
function genFold(d,L){
  const T=tr(L),folds=d>=7?rnd(2,3):d>=4?2:d>=2?rnd(1,2):1,holes=d>=5?rnd(1,2):1,ans=holes*Math.pow(2,folds);
  const S=86,g=18;let inner=`<rect x="${g}" y="${g}" width="${S}" height="${S}" rx="4" fill="#fff" stroke="${INK}" stroke-width="2.5"/>`;
  let x=g+S+34,w=S,h=S;
  for(let f=0;f<folds;f++){
    inner+=`<path d="M${x-22},${g+S/2} l16,0 m-5,-5 l5,5 -5,5" stroke="#2F7FD8" stroke-width="3" fill="none"/>`;
    if(f%2===0)w=w/2;else h=h/2;
    const y=g+(S-h)/2;
    inner+=`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="#DCEBFB" stroke="${INK}" stroke-width="2.5"/>`;
    if(f===folds-1){for(let i=0;i<holes;i++)inner+=`<circle cx="${x+w/2}" cy="${y+h/2+(holes>1?(i?-h/5:h/5):0)}" r="${Math.min(6,w/5)}" fill="#1E2A4A"/>`;}
    x+=w+34;
  }
  const fw=[T("once","مرة واحدة"),T("twice","مرتين"),T("three times","ثلاث مرات")][folds-1];
  const hw=holes===1?T("a hole is punched","يُثقب ثقب واحد"):T(holes+" holes are punched","يُثقب ثقبان");
  return make(SEC,T(`A square paper is folded ${fw}, then ${hw} through all the layers. How many holes are there when it is opened?`,`تُطوى ورقة مربعة ${fw}، ثم ${hw} عبر كل الطبقات. كم ثقبًا يظهر عند فتحها؟`),
    svg(x+6,g+S+20,inner,"paper folding","vis",Math.min(460,x+6)),String(ans),nearNums(ans,[holes,ans/2,ans*2,ans+1,ans-1,folds*holes]).map(String),
    T(`Each fold doubles the layers: ${Math.pow(2,folds)} layers. ${holes} × ${Math.pow(2,folds)} = ${ans}.`,`كل طيّة تضاعف الطبقات: ${Math.pow(2,folds)} طبقات. ${holes} × ${Math.pow(2,folds)} = ${ans}.`));
}
reg("fold",SEC,genFold,{en:"Paper folding",ar:"طي الورق",min:2,max:9});

/* ---------- 8. Grid moves ---------- */
function genGrid(d,L){
  const T=tr(L),N=d>=5?5:4,c=40,pad=26,steps=d>=4?3:2;
  let x=rnd(0,1),y=rnd(N-2,N-1);const sx=x,sy=y,moves=[];
  const DIRS={right:[1,0,T("right","يمينًا")],left:[-1,0,T("left","يسارًا")],up:[0,-1,T("up","للأعلى")],down:[0,1,T("down","للأسفل")]};
  for(let i=0;i<steps;i++){
    const ok=Object.keys(DIRS).filter(k=>{const [dx,dy]=DIRS[k];return x+dx>=0&&x+dx<N&&y+dy>=0&&y+dy<N;});
    const k=pick(ok),[dx,dy,lab]=DIRS[k];let m=rnd(1,3);
    while(m>1&&!(x+dx*m>=0&&x+dx*m<N&&y+dy*m>=0&&y+dy*m<N))m--;
    x+=dx*m;y+=dy*m;moves.push(L==="ar"?`${m===1?"مربعًا واحدًا":m===2?"مربعين":m+" مربعات"} ${lab}`:`${m} square${m>1?"s":""} ${lab}`);
  }
  const COL=L==="ar"?"أبجدهو":"ABCDE";
  let inner="";
  for(let r=0;r<N;r++)for(let k=0;k<N;k++)inner+=`<rect x="${pad+k*c}" y="${pad+r*c}" width="${c}" height="${c}" fill="none" stroke="${INK}" stroke-opacity=".35" stroke-width="2"/>`;
  for(let i=0;i<N;i++){inner+=txt(pad+i*c+c/2,pad-8,15,COL[i],{w:600});inner+=txt(pad-11,pad+i*c+c/2+5,15,i+1,{w:600});}
  inner+=`<circle cx="${pad+sx*c+c/2}" cy="${pad+sy*c+c/2}" r="12" fill="#E2457A"/>`;
  const lab=(cx,cy)=>COL[cx]+(cy+1),ans=lab(x,y),all=[];
  for(let r=0;r<N;r++)for(let k=0;k<N;k++){const s=lab(k,r);if(s!==ans)all.push({s,dist:Math.abs(k-x)+Math.abs(r-y)});}
  all.sort((a,b)=>a.dist-b.dist);const wr=shuffle(all.slice(0,6)).slice(0,3).map(o=>o.s);
  return make(SEC,T(`The pink dot moves ${moves.join(", then ")}. Which square does it land on?`,`تتحرك النقطة الوردية ${moves.join("، ثم ")}. في أي مربع تستقر؟`),svg(pad*2+N*c,pad*2+N*c-10,inner,"grid","vis",250),ans,wr,
    T(`Follow the moves one at a time from the dot. It ends at ${ans}.`,`نتتبع الحركات واحدة تلو الأخرى من النقطة، فتستقر في ${ans}.`));
}
reg("grid",SEC,genGrid,{en:"Grid moves",ar:"الحركة على الشبكة",min:1,max:6});

/* ---------- 9. Mirror images ---------- */
function genMirror(d,L){
  const T=tr(L),water=d>=5&&Math.random()<.5;
  const flag=(ang,fx,fy)=>`<g transform="translate(40,40) scale(${fx?-1:1},${fy?-1:1}) rotate(${ang})"><rect x="-4" y="-26" width="8" height="52" rx="2" fill="#2F7FD8"/><polygon points="4,-26 30,-16 4,-6" fill="#E2457A"/><circle cx="0" cy="22" r="5" fill="#F2A900"/></g>`;
  const ang=pick([0,90,180,270]);
  const correct=optSvg(flag(ang,!water,water),"mirror");
  const wrongs=[optSvg(flag(ang,false,false),"shape"),optSvg(flag(ang,water,!water),"shape"),optSvg(flag((ang+90)%360,!water,water),"shape")];
  return make(SEC,water?T("Which picture shows this shape reflected in water below it?","أي صورة تمثل انعكاس هذا الشكل في الماء أسفله؟"):T("Which picture shows this shape in a mirror held beside it?","أي صورة تمثل هذا الشكل في مرآة موضوعة بجانبه؟"),
    svg(80,80,flag(ang,false,false),"flag","vis",110),correct,wrongs,water?T("Water below flips top and bottom; left and right stay the same.","الماء أسفل الشكل يقلب الأعلى والأسفل، ويبقى اليمين واليسار كما هما."):T("A mirror beside the shape swaps left and right; top and bottom stay the same.","المرآة الجانبية تبدّل اليمين واليسار، ويبقى الأعلى والأسفل كما هما."),"svg");
}
reg("mirror",SEC,genMirror,{en:"Mirror images",ar:"صور المرآة",min:2,max:7});

/* ---------- 10. Number wheels ---------- */
function genWheel(d,L){
  const T=tr(L),pairSum=rnd(10,20)+(d>=6?rnd(5,15):0);
  const vals=[];for(let i=0;i<3;i++){const x=rnd(2,pairSum-2);vals.push(x,pairSum-x);}
  const order=[vals[0],vals[2],vals[4],vals[1],vals[3],vals[5]],miss=rnd(0,5),ans=order[miss];
  const R=72,cx=86,cy=86;let inner=`<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${INK}" stroke-width="2.5"/>`;
  for(let i=0;i<6;i++){const a=i*Math.PI/3;inner+=`<line x1="${cx}" y1="${cy}" x2="${(cx+R*Math.cos(a)).toFixed(1)}" y2="${(cy+R*Math.sin(a)).toFixed(1)}" stroke="${INK}" stroke-opacity=".35" stroke-width="2"/>`;}
  for(let i=0;i<6;i++){const a=i*Math.PI/3+Math.PI/6,px=cx+R*0.62*Math.cos(a),py=cy+R*0.62*Math.sin(a)+8;inner+=i===miss?qmark(px,py,28):txt(px,py,22,order[i],{c:"#2F7FD8"});}
  return make(SEC,T("In this wheel, each number and the one straight across from it always add up to the same total. What is the missing number?","في هذه العجلة، مجموع كل عدد والعدد المقابل له تمامًا ثابت دائمًا. ما العدد المفقود؟"),svg(172,180,inner,"number wheel","vis",200),String(ans),nearNums(ans,[pairSum,pairSum-ans+1,ans+1,ans-1,ans+2]).map(String),
    T(`Opposite pairs add to ${pairSum}. The number across is ${order[(miss+3)%6]}, so ${pairSum} − ${order[(miss+3)%6]} = ${ans}.`,`مجموع كل زوج متقابل ${pairSum}. العدد المقابل ${order[(miss+3)%6]}، إذن ${pairSum} − ${order[(miss+3)%6]} = ${ans}.`));
}
reg("wheel",SEC,genWheel,{en:"Number wheels",ar:"عجلات الأعداد",min:3,max:8});

/* ---------- 11. Number pyramids ---------- */
function genPyramid(d,L){
  const T=tr(L),n=d>=4?4:3,bottom=Array.from({length:n},()=>rnd(1,d>=4?9:6));
  const rows=[bottom];while(rows[rows.length-1].length>1){const p=rows[rows.length-1];rows.push(p.slice(1).map((v,i)=>v+p[i]));}
  let hr,hc;
  if(d<=3){hr=n-1;hc=0;}else{const cand=[];rows.forEach((r,ri)=>r.forEach((_,ci)=>cand.push([ri,ci])));[hr,hc]=pick(d>=7?cand.filter(c=>c[0]===0):cand.filter(c=>c[0]<n-1||d>=5));}
  const ans=rows[hr][hc],bw=48,bh=30,W=n*bw+20,H=n*bh+20;let inner="";
  rows.forEach((r,ri)=>r.forEach((v,ci)=>{const x=10+ri*bw/2+ci*bw,y=H-10-(ri+1)*bh;inner+=`<rect x="${x}" y="${y}" width="${bw-3}" height="${bh-3}" rx="4" fill="${ri===hr&&ci===hc?"none":"#DCEBFB"}" stroke="${ri===hr&&ci===hc?"#E2457A":INK}" stroke-width="2" ${ri===hr&&ci===hc?'stroke-dasharray="5 4"':""}/>`;inner+=ri===hr&&ci===hc?qmark(x+bw/2-1,y+bh-7,22):txt(x+bw/2-1,y+bh-8,17,v);}));
  const why=hr===0?T("Each brick is the sum of the two bricks under it. Work out the brick above the missing one, then subtract its other neighbour.","كل لبنة تساوي مجموع اللبنتين تحتها. نحسب اللبنة فوق المفقودة ثم نطرح جارتها الأخرى."):T("Each brick is the sum of the two bricks directly under it.","كل لبنة تساوي مجموع اللبنتين اللتين تحتها مباشرة.");
  return make(SEC,T("In this pyramid, each brick is the sum of the two bricks below it. What is the missing number?","في هذا الهرم، كل لبنة تساوي مجموع اللبنتين تحتها. ما العدد المفقود؟"),svg(W,H,inner,"number pyramid","vis",Math.min(300,W*1.4)),String(ans),nearNums(ans,[ans+1,ans-1,ans+2,ans*2,ans-2]).map(String),why);
}
reg("pyramid",SEC,genPyramid,{en:"Number pyramids",ar:"أهرامات الأعداد",min:1,max:8});

/* ---------- 12. Magic squares ---------- */
function genMagic(d,L){
  const T=tr(L);let m=[[2,7,6],[9,5,1],[4,3,8]];
  for(let i=0,k=rnd(0,3);i<k;i++)m=m[0].map((_,c)=>m.map(r=>r[c]).reverse());
  if(Math.random()<.5)m=m.map(r=>r.slice().reverse());
  const add=d>=6?rnd(2,10):rnd(0,4),mul=d>=8?pick([1,2]):1;m=m.map(r=>r.map(v=>v*mul+add));const total=m[0].reduce((a,b)=>a+b,0);
  const ar=rnd(0,2),ac=rnd(0,2),hidden=[[ar,ac]];
  if(d>=7){let r2,c2;do{r2=rnd(0,2);c2=rnd(0,2);}while(r2===ar||(c2===ac&&r2===ar));hidden.push([r2,c2]);}
  const c=52;let inner="";
  for(let r=0;r<3;r++)for(let k=0;k<3;k++){const x=6+k*c,y=6+r*c,isH=hidden.some(h=>h[0]===r&&h[1]===k),isA=r===ar&&k===ac;inner+=`<rect x="${x}" y="${y}" width="${c}" height="${c}" fill="${isA?"none":"#FFF6D8"}" stroke="${INK}" stroke-width="2"/>`;inner+=isA?qmark(x+c/2,y+c/2+11,30):isH?txt(x+c/2,y+c/2+8,22,"□",{c:"#9AA6BF"}):txt(x+c/2,y+c/2+8,22,m[r][k]);}
  const ans=m[ar][ac];
  const rowOthers=m[ar].filter((_,k)=>k!==ac);
  return make(SEC,d>=7?T("In this square, every row, column and diagonal adds up to the same total. What number goes in place of the question mark?","في هذا المربع، مجموع كل صف وكل عمود وكل قطر متساوٍ. ما العدد مكان علامة الاستفهام؟"):T(`In this square, every row, column and diagonal adds up to ${total}. What is the missing number?`,`في هذا المربع، مجموع كل صف وعمود وقطر يساوي ${total}. ما العدد المفقود؟`),
    svg(168,168,inner,"magic square","vis",190),String(ans),nearNums(ans,[ans+1,ans-1,ans+mul,ans+2,total-ans]).map(String),
    T(`Each line adds to ${total}. In the question mark's row: ${total} − ${rowOthers.join(" − ")} = ${ans}.`,`مجموع كل خط ${total}. في صف علامة الاستفهام: ${total} − ${rowOthers.join(" − ")} = ${ans}.`));
}
reg("magic",SEC,genMagic,{en:"Magic squares",ar:"المربعات السحرية",min:4,max:9});

/* ---------- 13. Fractions ---------- */
/* wrong fractions: drop any whose value equals the answer, and repeats of the same value */
function frWrongs(an,ad,list){const out=[],vals=new Set([an/ad]);for(const [n,d] of list){if(!(n>0&&d>0))continue;const v=n/d;if(vals.has(v))continue;vals.add(v);out.push(fr(n,d));}return out;}
function genFraction(d,L){
  const T=tr(L);
  if(d>=6&&Math.random()<.45){
    const den=pick([5,6,7,8,9,10,12]),a=rnd(1,den-2),b=rnd(1,den-1-a),s=a+b,g=gcd(s,den);
    const ans=fr(s/g,den/g),uniq=frWrongs(s,den,[[s,den*2],[s+1,den],[a*b,den],[s,den+1],[Math.abs(a-b)||1,den],[s-1,den]]);
    return make(SEC,T(`${fr(a,den)} + ${fr(b,den)} = ? (in simplest form)`,`${fr(a,den)} + ${fr(b,den)} = ؟ (في أبسط صورة)`),null,ans,uniq,T(`Same denominator, so add the tops: ${a} + ${b} = ${s}, giving ${s}/${den}${g>1?` = ${s/g}/${den/g}`:""}.`,`المقام واحد، فنجمع البسطين: ${a} + ${b} = ${s}، فيكون ${s}/${den}${g>1?` = ${s/g}/${den/g}`:""}.`));
  }
  const [r,c]=pick([[2,3],[2,4],[3,4],[2,5],[3,3],[4,4],[2,6],[3,5]]),tot=r*c,k=rnd(1,tot-1),g=gcd(k,tot);
  const cells=shuffle([...Array(tot).keys()]).slice(0,k),cs=34;let inner="";
  for(let i=0;i<tot;i++){const x=6+(i%c)*cs,y=6+Math.floor(i/c)*cs;inner+=`<rect x="${x}" y="${y}" width="${cs}" height="${cs}" fill="${cells.includes(i)?"#2F7FD8":"#fff"}" fill-opacity="${cells.includes(i)?.75:1}" stroke="${INK}" stroke-width="2"/>`;}
  const ans=fr(k/g,tot/g);
  const wr=frWrongs(k,tot,[[tot-k,tot],[k,tot-k],[k/g+1,tot/g],[k,tot+1],[k+1,tot],[k-1,tot]]);
  return make(SEC,T("What fraction of the shape is shaded? (in simplest form)","ما الكسر الذي يمثل الجزء المظلل من الشكل؟ (في أبسط صورة)"),svg(c*cs+12,r*cs+12,inner,"fraction grid","vis",Math.min(260,(c*cs+12)*1.3)),ans,wr,
    T(`${k} of the ${tot} equal parts are shaded: ${k}/${tot}${g>1?` = ${k/g}/${tot/g}`:""}.`,`المظلل ${k} من ${tot} أجزاء متساوية: ${k}/${tot}${g>1?` = ${k/g}/${tot/g}`:""}.`));
}
reg("fraction",SEC,genFraction,{en:"Fractions",ar:"الكسور",min:4,max:9});

/* ---------- 14. Angles ---------- */
function genAngle(d,L){
  const T=tr(L),t=d>=7?rnd(0,3):rnd(0,1),deg="°";
  if(t===0){
    const a=rnd(3,8)*10,b=rnd(3,7)*10;if(a+b>=170)return genAngle(d,L);const c=180-a-b;
    const inner=`<polygon points="30,170 250,170 110,40" fill="#DCEBFB" stroke="${INK}" stroke-width="2.5"/>`+txt(58,160,16,a+deg)+txt(220,160,16,b+deg)+qmark(112,82,24);
    return make(SEC,T("What is the size of the missing angle in this triangle? (not drawn to scale)","ما قياس الزاوية المجهولة في هذا المثلث؟ (الرسم ليس بمقياس دقيق)"),svg(280,190,inner,"triangle","vis",300),c+deg,nearNums(c,[180-a,180-b,a+b,c+10,c-10]).map(x=>x+deg),
      T(`The angles of a triangle add up to 180°. 180 − ${a} − ${b} = ${c}°.`,`مجموع زوايا المثلث 180°. 180 − ${a} − ${b} = ${c}°.`));
  }
  if(t===1){
    const a=rnd(3,15)*10;const c=180-a;
    const inner=`<line x1="20" y1="120" x2="280" y2="120" stroke="${INK}" stroke-width="3"/><line x1="150" y1="120" x2="${150+100*Math.cos(Math.PI*a/180)}" y2="${120-100*Math.sin(Math.PI*a/180)}" stroke="${INK}" stroke-width="3"/>`+txt(190,108,16,a+deg)+qmark(110,104,22);
    return make(SEC,T("The two angles sit on a straight line. What is the missing angle?","الزاويتان على خط مستقيم. ما قياس الزاوية المجهولة؟"),svg(300,140,inner,"straight line angles","vis",300),c+deg,nearNums(c,[a,360-a,90,c+10,c-10]).map(x=>x+deg),
      T(`Angles on a straight line add up to 180°. 180 − ${a} = ${c}°.`,`مجموع الزوايا على خط مستقيم 180°. 180 − ${a} = ${c}°.`));
  }
  if(t===2){
    const top=rnd(2,10)*10,base=(180-top)/2;
    const inner=`<polygon points="40,170 240,170 140,30" fill="#FCE3EC" stroke="${INK}" stroke-width="2.5"/>`+txt(140,74,16,top+deg)+qmark(72,160,22)+`<path d="M86,98 l8,6 M192,98 l-8,6" stroke="${INK}" stroke-width="2.5"/>`;
    return make(SEC,T("The two marked sides of this triangle are equal. What is the size of the angle marked '?'","الضلعان المعلَّمان في هذا المثلث متساويان. ما قياس الزاوية المعلّمة بـ (؟)"),svg(280,190,inner,"isosceles triangle","vis",300),base+deg,nearNums(base,[top,180-top,base+10,90-top/2+10,base-5]).map(x=>x+deg),
      T(`Equal sides mean the two base angles are equal: (180 − ${top}) ÷ 2 = ${base}°.`,`الضلعان المتساويان يعنيان تساوي زاويتي القاعدة: (180 − ${top}) ÷ 2 = ${base}°.`));
  }
  const a=rnd(8,14)*10,b=rnd(6,12)*10,c=360-a-b;if(c<=40)return genAngle(d,L);
  const ang=(deg0,deg1)=>{const r=60,x=150+r*Math.cos(deg0*Math.PI/180),y=110-r*Math.sin(deg0*Math.PI/180);return `<line x1="150" y1="110" x2="${x}" y2="${y}" stroke="${INK}" stroke-width="3"/>`;};
  const mid=(s,e,r)=>{const m=(s+e)/2*Math.PI/180;return [150+r*Math.cos(m),110-r*Math.sin(m)+6];};
  let inner=ang(0)+ang(a)+ang(a+b);const [x1,y1]=mid(0,a,36),[x2,y2]=mid(a,a+b,36),[x3,y3]=mid(a+b,360,36);
  inner+=txt(x1,y1,14,a+deg)+txt(x2,y2,14,b+deg)+qmark(x3,y3+2,20)+`<circle cx="150" cy="110" r="4" fill="${INK}"/>`;
  return make(SEC,T("Three angles meet at a point. What is the missing angle? (not drawn to scale)","تلتقي ثلاث زوايا عند نقطة. ما قياس الزاوية المجهولة؟ (الرسم ليس بمقياس دقيق)"),svg(300,220,inner,"angles at a point","vis",280),c+deg,nearNums(c,[180-a,180-b,a+b,c+10,c-20]).map(x=>x+deg),
    T(`Angles around a point add up to 360°. 360 − ${a} − ${b} = ${c}°.`,`مجموع الزوايا حول نقطة 360°. 360 − ${a} − ${b} = ${c}°.`));
}
reg("angle",SEC,genAngle,{en:"Angles",ar:"الزوايا",min:5,max:9});

/* ---------- 15. Area & perimeter ---------- */
function genArea(d,L){
  const T=tr(L),u=T("cm","سم"),u2=T("cm²","سم²");
  if(d<=5){
    const w=rnd(3,9),h=rnd(2,7),perim=Math.random()<.5;const sc=18,inner=`<rect x="20" y="20" width="${w*sc}" height="${h*sc}" fill="#DDF3EA" stroke="${INK}" stroke-width="2.5"/>`+txt(20+w*sc/2,14,15,w+" "+u)+txt(w*sc+44,20+h*sc/2+5,15,h+" "+u);
    const ans=perim?2*(w+h):w*h;
    return make(SEC,perim?T("What is the perimeter of this rectangle?","ما محيط هذا المستطيل؟"):T("What is the area of this rectangle?","ما مساحة هذا المستطيل؟"),svg(w*sc+90,h*sc+40,inner,"rectangle","vis",Math.min(320,w*sc+90)),ans+" "+(perim?u:u2),nearNums(ans,perim?[w*h,w+h,ans+2,ans-2]:[2*(w+h),w+h,ans+w,ans-h]).map(x=>x+" "+(perim?u:u2)),
      perim?T(`Perimeter = ${w} + ${h} + ${w} + ${h} = ${ans} cm.`,`المحيط = ${w} + ${h} + ${w} + ${h} = ${ans} سم.`):T(`Area = length × width = ${w} × ${h} = ${ans} cm².`,`المساحة = الطول × العرض = ${w} × ${h} = ${ans} سم².`));
  }
  const W=rnd(7,12),H=rnd(6,10),a=rnd(2,W-3),b=rnd(2,H-3),perim=d>=8&&Math.random()<.5,sc=16,ox=58,oy=26;
  const P=[[0,0],[W-a,0],[W-a,b],[W,b],[W,H],[0,H]].map(([x,y])=>`${ox+x*sc},${oy+y*sc}`).join(" ");
  let inner=`<polygon points="${P}" fill="#FFF0CC" stroke="${INK}" stroke-width="2.5"/>`;
  inner+=txt(ox+(W-a)*sc/2,oy-8,14,(W-a)+" "+u);                       /* top edge */
  inner+=txt(ox+(W-a)*sc+a*sc/2,oy+b*sc-7,14,a+" "+u);                 /* step, horizontal */
  inner+=txt(ox+(W-a)*sc+6,oy+b*sc/2+5,14,b+" "+u,{a:"start"});         /* step, vertical */
  inner+=txt(ox+W*sc+6,oy+(b+H)*sc/2+5,14,(H-b)+" "+u,{a:"start"});     /* right edge */
  inner+=txt(ox+W*sc/2,oy+H*sc+18,14,W+" "+u);                          /* bottom edge */
  inner+=txt(ox-6,oy+H*sc/2+5,14,H+" "+u,{a:"end"});                    /* left edge */
  const ans=perim?2*(W+H):W*H-a*b;
  return make(SEC,perim?T("What is the perimeter of this shape? (all corners are right angles)","ما محيط هذا الشكل؟ (كل الزوايا قوائم)"):T("What is the area of this shape? (all corners are right angles)","ما مساحة هذا الشكل؟ (كل الزوايا قوائم)"),
    svg(ox+W*sc+62,oy+H*sc+30,inner,"L-shape","vis",Math.min(360,ox+W*sc+62)),ans+" "+(perim?u:u2),nearNums(ans,perim?[2*(W+H)-2*a,2*(W+H)+2*b,W*H-a*b,W+H+a+b]:[W*H,W*H-a,2*(W+H),ans+a*b/2|0]).map(x=>x+" "+(perim?u:u2)),
    perim?T(`Push the cut corner's edges outwards: they fill the gap exactly, so the perimeter equals the full rectangle's: 2 × (${W} + ${H}) = ${ans} cm.`,`لو دفعنا ضلعي الزاوية المقطوعة للخارج لأكملا المستطيل تمامًا، فالمحيط = محيط المستطيل الكامل: 2 × (${W} + ${H}) = ${ans} سم.`)
         :T(`Full rectangle ${W} × ${H} = ${W*H}, minus the missing corner ${a} × ${b} = ${a*b}: ${W*H} − ${a*b} = ${ans} cm².`,`المستطيل الكامل ${W} × ${H} = ${W*H}، نطرح الزاوية الناقصة ${a} × ${b} = ${a*b}: ${W*H} − ${a*b} = ${ans} سم².`));
}
reg("area",SEC,genArea,{en:"Area & perimeter",ar:"المساحة والمحيط",min:4,max:9});

/* ---------- 16. Cube nets ---------- */
function foldNet(cells){ /* cells: [[x,y]...]; returns face normals per cell, or null if two cells land on the same face */
  const key=(x,y)=>x+","+y,set=new Map(cells.map((c,i)=>[key(c[0],c[1]),i]));
  const res=new Array(cells.length),neg=v=>v.map(a=>-a);
  res[0]={n:[0,0,-1],u:[1,0,0],v:[0,1,0]};const q=[0];
  while(q.length){const i=q.shift(),[x,y]=cells[i],f=res[i];
    for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const j=set.get(key(x+dx,y+dy));if(j==null||res[j])continue;
      let g;if(dx===1)g={n:f.u,u:neg(f.n),v:f.v};else if(dx===-1)g={n:neg(f.u),u:f.n,v:f.v};else if(dy===1)g={n:f.v,u:f.u,v:neg(f.n)};else g={n:neg(f.v),u:f.u,v:f.n};
      res[j]=g;q.push(j);}}
  const ns=res.map(r=>r.n.join(","));return new Set(ns).size===6?ns:null;
}
const NETS=[[[1,0],[0,1],[1,1],[2,1],[3,1],[1,2]],[[0,0],[0,1],[1,1],[2,1],[3,1],[0,2]],[[0,0],[0,1],[1,1],[2,1],[3,1],[1,2]],[[0,0],[0,1],[1,1],[2,1],[3,1],[2,2]],[[0,0],[0,1],[1,1],[2,1],[3,1],[3,2]],
  [[0,0],[1,0],[1,1],[2,1],[3,1],[1,2]],[[0,0],[1,0],[1,1],[2,1],[3,1],[2,2]],[[0,0],[1,0],[1,1],[2,1],[3,1],[3,2]],[[0,0],[1,0],[1,1],[2,1],[2,2],[3,2]],[[0,0],[1,0],[2,0],[2,1],[3,1],[4,1]],[[1,0],[0,1],[1,1],[2,1],[3,1],[2,2]]];
/* random hexominoes that do NOT fold into a cube, kept small enough to draw in an answer box */
function badNet(){
  for(let t=0;t<500;t++){
    const cells=[[0,0]],has=(x,y)=>cells.some(c=>c[0]===x&&c[1]===y);
    while(cells.length<6){const [x,y]=pick(cells),[dx,dy]=pick([[1,0],[-1,0],[0,1],[0,-1]]);if(!has(x+dx,y+dy))cells.push([x+dx,y+dy]);}
    const mx=Math.min(...cells.map(c=>c[0])),my=Math.min(...cells.map(c=>c[1])),n=cells.map(([x,y])=>[x-mx,y-my]);
    const w=Math.max(...n.map(c=>c[0]))+1,h=Math.max(...n.map(c=>c[1]))+1;
    if(w<=4&&h<=4&&!foldNet(n))return n;
  }
  return [[0,0],[1,0],[2,0],[0,1],[1,1],[2,1]];
}
const BAD=[];
function genCubeNet(d,L){
  const T=tr(L);
  const trans=(cells)=>{let c=cells.map(a=>a.slice());const k=rnd(0,3);for(let i=0;i<k;i++)c=c.map(([x,y])=>[-y,x]);if(Math.random()<.5)c=c.map(([x,y])=>[-x,y]);const mx=Math.min(...c.map(a=>a[0])),my=Math.min(...c.map(a=>a[1]));return c.map(([x,y])=>[x-mx,y-my]);};
  if(d>=7&&Math.random()<.5){
    const goods=shuffle(NETS).slice(0,3).map(trans),bad=trans(badNet());
    const draw=(cells)=>{const s=14,mx=Math.max(...cells.map(a=>a[0]))+1,my=Math.max(...cells.map(a=>a[1]))+1,ox=(80-mx*s)/2,oy=(80-my*s)/2;return cells.map(([x,y])=>`<rect x="${ox+x*s}" y="${oy+y*s}" width="${s}" height="${s}" fill="#DCEBFB" stroke="${INK}" stroke-width="1.6"/>`).join("");};
    return make(SEC,T("Which of these cannot be folded to make a closed cube?","أيّ هذه الأشكال لا يمكن طيّه ليكوّن مكعبًا مغلقًا؟"),null,optSvg(draw(bad),"net"),goods.map(g=>optSvg(draw(g),"net")),
      T("Imagine folding each net around one square. In the odd one out, two squares end up on the same side of the cube and one side is left open.","تخيّل طي كل شكل حول أحد مربعاته. في الشكل المختلف ينطبق مربعان على الوجه نفسه ويبقى وجه مفتوح."),"svg");
  }
  const net=trans(pick(NETS)),ns=foldNet(net);if(!ns)return genCubeNet(d,L);
  const marks=shuffle(COLORS.map(c=>c.c).concat(["#1E2A4A"])).slice(0,6),forms=shuffle(SHAPES);
  const sym=i=>shp(forms[i],marks[i],0,0,1);
  const s=40,mx=Math.max(...net.map(a=>a[0]))+1,my=Math.max(...net.map(a=>a[1]))+1;let inner="";
  net.forEach(([x,y],i)=>{inner+=`<rect x="${6+x*s}" y="${6+y*s}" width="${s}" height="${s}" fill="#fff" stroke="${INK}" stroke-width="2"/>`+shp(forms[i],marks[i],6+x*s+s/2,6+y*s+s/2,12);});
  const ask=rnd(0,5),opp=ns.findIndex(v=>v===ns[ask].split(",").map(a=>-a).join(","));
  const fs=i=>optSvg(shp(forms[i],marks[i],40,40,24),"face");
  const others=[0,1,2,3,4,5].filter(i=>i!==ask&&i!==opp);
  const nm=SHAPE_NAME[forms[ask]][L==="ar"?"ar":"en"];
  return make(SEC,T(`This net is folded into a cube. Which face ends up opposite the ${nm}?`,`يُطوى هذا الشكل ليكوّن مكعبًا. أي وجه يقابل وجه ${nm}؟`),svg(mx*s+12,my*s+12,inner,"cube net","vis",Math.min(300,(mx*s+12)*1.2)),fs(opp),shuffle(others).slice(0,3).map(fs),
    T("Faces that touch in the net, or touch after one fold, are neighbours. In a straight row of three, the first and third squares are always opposite.","الأوجه المتجاورة في الشكل أو بعد طيّة واحدة تكون متجاورة في المكعب. وفي صف مستقيم من ثلاثة مربعات، يتقابل الأول والثالث دائمًا."),"svg");
}
reg("cubeNet",SEC,genCubeNet,{en:"Cube nets",ar:"شبكات المكعب",min:4,max:9});
NB.foldNet=foldNet;NB.NETS=NETS;NB.BADNETS=BAD;

/* ---------- 17. Counting cubes in a stack ---------- */
function genCubeCount(d,L){
  const T=tr(L),nx=d>=6?3:2+(d>=4?1:0),ny=d>=6?rnd(2,3):2,maxH=d>=5?3:2;
  const h=[];for(let x=0;x<nx;x++){h.push([]);for(let y=0;y<ny;y++){let lim=maxH;if(x>0)lim=Math.min(lim,h[x-1][y]);if(y>0)lim=Math.min(lim,h[x][y-1]);h[x].push(rnd(x===0&&y===0?1:0,lim));}}
  const tot=h.flat().reduce((a,b)=>a+b,0);if(tot<3)return genCubeCount(d,L);
  const s=22,cx=Math.cos(Math.PI/6)*s,sy=Math.sin(Math.PI/6)*s,ox=20+ny*cx,oy=20+maxH*s;
  const P=(x,y,z)=>[ox+(x-y)*cx,oy+(x+y)*sy-z*s];let inner="";const cubes=[];
  for(let x=0;x<nx;x++)for(let y=0;y<ny;y++)for(let z=0;z<h[x][y];z++)cubes.push([x,y,z]);
  cubes.sort((a,b)=>(a[0]+a[1])-(b[0]+b[1])||a[2]-b[2]);
  const poly=(pts,f)=>`<polygon points="${pts.map(p=>p.map(v=>v.toFixed(1)).join(",")).join(" ")}" fill="${f}" stroke="${INK}" stroke-width="1.5" stroke-linejoin="round"/>`;
  for(const [x,y,z] of cubes){
    inner+=poly([P(x,y,z+1),P(x+1,y,z+1),P(x+1,y+1,z+1),P(x,y+1,z+1)],"#FFE08A");
    inner+=poly([P(x+1,y,z),P(x+1,y+1,z),P(x+1,y+1,z+1),P(x+1,y,z+1)],"#F2A900");
    inner+=poly([P(x,y+1,z),P(x+1,y+1,z),P(x+1,y+1,z+1),P(x,y+1,z+1)],"#D18E00");
  }
  const W=ox+nx*cx+20,H=oy+(nx+ny)*sy+20;
  return make(SEC,T("How many cubes are in this stack? (Every cube sits on the floor or on another cube, so count the hidden ones too.)","كم مكعبًا في هذا التكوين؟ (كل مكعب يرتكز على الأرض أو على مكعب آخر، فاحسب المكعبات المخفية أيضًا.)"),svg(W,H,inner,"cube stack","vis",Math.min(300,W*1.5)),String(tot),nearNums(tot,[tot-1,tot+1,tot-2,tot+2,nx*ny*maxH]).map(String),
    T(`Count each column from its top: ${h.flat().filter(v=>v).join(" + ")} = ${tot}.`,`نعدّ كل عمود من قمته: ${h.flat().filter(v=>v).join(" + ")} = ${tot}.`));
}
reg("cubeCount",SEC,genCubeCount,{en:"Counting cubes",ar:"عدّ المكعبات",min:3,max:9});

/* ---------- 18. Lines of symmetry ---------- */
function regPoly(n,cx,cy,r,rot){const p=[];for(let i=0;i<n;i++){const a=rot+i*2*Math.PI/n;p.push((cx+r*Math.cos(a)).toFixed(1)+","+(cy+r*Math.sin(a)).toFixed(1));}return p.join(" ");}
function genSymmetry(d,L){
  const T=tr(L);
  const S=[
    {n:3,en:"equilateral triangle",ar:"مثلث متساوي الأضلاع",draw:()=>`<polygon points="${regPoly(3,60,64,48,-Math.PI/2)}" fill="#DCEBFB" stroke="${INK}" stroke-width="2.5"/>`},
    {n:4,en:"square",ar:"مربع",draw:()=>`<rect x="18" y="18" width="84" height="84" fill="#DCEBFB" stroke="${INK}" stroke-width="2.5"/>`},
    {n:2,en:"rectangle",ar:"مستطيل",draw:()=>`<rect x="8" y="32" width="104" height="56" fill="#DCEBFB" stroke="${INK}" stroke-width="2.5"/>`},
    {n:5,en:"regular pentagon",ar:"خماسي منتظم",draw:()=>`<polygon points="${regPoly(5,60,62,50,-Math.PI/2)}" fill="#DCEBFB" stroke="${INK}" stroke-width="2.5"/>`},
    {n:6,en:"regular hexagon",ar:"سداسي منتظم",draw:()=>`<polygon points="${regPoly(6,60,60,50,0)}" fill="#DCEBFB" stroke="${INK}" stroke-width="2.5"/>`},
    {n:8,en:"regular octagon",ar:"ثماني منتظم",draw:()=>`<polygon points="${regPoly(8,60,60,50,Math.PI/8)}" fill="#DCEBFB" stroke="${INK}" stroke-width="2.5"/>`},
    {n:1,en:"isosceles triangle",ar:"مثلث متطابق الضلعين",draw:()=>`<polygon points="60,10 100,110 20,110" fill="#DCEBFB" stroke="${INK}" stroke-width="2.5"/>`},
    {n:0,en:"parallelogram",ar:"متوازي أضلاع",draw:()=>`<polygon points="30,30 112,30 90,90 8,90" fill="#DCEBFB" stroke="${INK}" stroke-width="2.5"/>`},
    {n:2,en:"rhombus",ar:"معيّن",draw:()=>`<polygon points="60,6 100,60 60,114 20,60" fill="#DCEBFB" stroke="${INK}" stroke-width="2.5"/>`},
    {n:1,en:"kite",ar:"شكل طائرة ورقية",draw:()=>`<polygon points="60,6 96,44 60,114 24,44" fill="#DCEBFB" stroke="${INK}" stroke-width="2.5"/>`},
    {n:5,en:"five-pointed star",ar:"نجمة خماسية",draw:()=>shp("star","#DCEBFB",60,64,54,`stroke="${INK}" stroke-width="2.5"`)}
  ];
  const s=pick(d<=4?S.filter(x=>[3,4,2,1].includes(x.n)&&x.en!=="kite"):S);
  return make(SEC,T("How many lines of symmetry does this shape have?","كم محور تماثل لهذا الشكل؟"),svg(120,120,s.draw(),s.en,"vis",150),String(s.n),nearNums(s.n,[s.n+1,s.n-1,s.n*2,s.n+2,4]).map(String),
    T(`A ${s.en} has ${s.n} line${s.n===1?"":"s"} of symmetry: fold lines that make both halves match exactly.`,
      `الشكل (${s.ar}) ${s.n===0?"ليس له أي محور تماثل":s.n===1?"له محور تماثل واحد":s.n===2?"له محورا تماثل":"له "+s.n+" محاور تماثل"}. محور التماثل خط طيّ يجعل النصفين متطابقين تمامًا.`));
}
reg("symmetry",SEC,genSymmetry,{en:"Symmetry",ar:"التماثل",min:3,max:7});

/* ---------- 19. Clocks ---------- */
function clockFace(h,m){
  let o=`<circle cx="60" cy="60" r="52" fill="#fff" stroke="${INK}" stroke-width="3"/>`;
  for(let i=1;i<=12;i++){const a=(i*30-90)*Math.PI/180;o+=txt(60+40*Math.cos(a),60+40*Math.sin(a)+5,13,i,{w:600});}
  const ha=((h%12)*30+m*0.5-90)*Math.PI/180,ma=(m*6-90)*Math.PI/180;
  o+=`<line x1="60" y1="60" x2="${60+26*Math.cos(ha)}" y2="${60+26*Math.sin(ha)}" stroke="#1E2A4A" stroke-width="5" stroke-linecap="round"/><line x1="60" y1="60" x2="${60+38*Math.cos(ma)}" y2="${60+38*Math.sin(ma)}" stroke="#E2457A" stroke-width="3" stroke-linecap="round"/><circle cx="60" cy="60" r="4" fill="#1E2A4A"/>`;
  return o;
}
function genClock(d,L){
  const T=tr(L),f=(h,m)=>h+":"+String(m).padStart(2,"0");
  if(d>=4&&Math.random()<.6){
    const h=pick([1,2,3,4,5,6,9]),ang=Math.min(h*30,360-h*30);
    return make(SEC,T(`What is the smaller angle between the hands of a clock at ${h}:00?`,`ما قياس الزاوية الصغرى بين عقربي الساعة عند ${h}:00؟`),svg(120,120,clockFace(h,0),"clock","vis",140),ang+"°",nearNums(ang,[ang+30,ang-30,h*10,360-ang,ang+15]).map(x=>x+"°"),
      T(`Each hour mark is 30° apart (360 ÷ 12). ${Math.min(h,12-h)} × 30 = ${ang}°.`,`بين كل رقمين 30° (360 ÷ 12). ${Math.min(h,12-h)} × 30 = ${ang}°.`));
  }
  const h=rnd(1,11),m=d<=1?pick([0,30]):pick([0,15,30,45,10,20,40,50]);
  if(d<=2){
    const ans=f(h,m),wr=[f(h,(m+30)%60),f((h%12)+1,m),f(m/5||12,h*5%60),f(h,(m+15)%60),f(((h+10)%12)+1,m)].filter(w=>w!==ans);
    return make(SEC,T("What time does this clock show?","ما الوقت الذي تشير إليه الساعة؟"),svg(120,120,clockFace(h,m),"clock","vis",140),ans,[...new Set(wr)],T("The short hand shows the hour; the long hand shows the minutes (each number is 5 minutes).","العقرب القصير يدل على الساعة، والطويل على الدقائق (كل رقم = 5 دقائق)."));
  }
  const add=pick([15,25,35,45,50,70,90]),tm=h*60+m+add,eh=((Math.floor(tm/60)-1)%12)+1,em=tm%60;
  const ans=f(eh,em),wr=[f(eh,(em+5)%60),f(((eh)%12)+1,em),f(h,(m+add)%60),f(eh,(em+55)%60),f(((eh+10)%12)+1,em)].filter(w=>w!==ans);
  return make(SEC,T(`What time will it be ${add} minutes after the time on this clock?`,`كم ستكون الساعة بعد ${add} دقيقة من الوقت الظاهر؟`),svg(120,120,clockFace(h,m),"clock","vis",140),ans,[...new Set(wr)],
    T(`The clock shows ${f(h,m)}. Adding ${add} minutes gives ${ans}.`,`الساعة تشير إلى ${f(h,m)}. بإضافة ${add} دقيقة تصبح ${ans}.`));
}
reg("clock",SEC,genClock,{en:"Clocks",ar:"الساعة",min:1,max:5});

/* ---------- 20. Number detective ---------- */
function genNumLogic(d,L){
  const T=tr(L);
  const C=[
    {f:n=>n%3===0,en:"I can be divided by 3",ar:"أقبل القسمة على 3"},{f:n=>n%4===0,en:"I can be divided by 4",ar:"أقبل القسمة على 4"},
    {f:n=>n%5===0,en:"I can be divided by 5",ar:"أقبل القسمة على 5"},{f:n=>n%7===0,en:"I can be divided by 7",ar:"أقبل القسمة على 7"},
    {f:n=>n%2===1,en:"I am odd",ar:"أنا عدد فردي"},{f:n=>n%2===0,en:"I am even",ar:"أنا عدد زوجي"},
    {f:n=>Math.floor(n/10)>n%10,en:"my tens digit is bigger than my ones digit",ar:"رقم عشراتي أكبر من رقم آحادي"},{f:n=>Math.floor(n/10)<n%10,en:"my tens digit is smaller than my ones digit",ar:"رقم عشراتي أصغر من رقم آحادي"},
    {f:n=>n>50,en:"I am more than 50",ar:"أنا أكبر من 50"},{f:n=>n<50,en:"I am less than 50",ar:"أنا أصغر من 50"}
  ];
  for(let t=0;t<400;t++){
    const s=rnd(3,14),cs=shuffle(C).slice(0,d>=8?3:2);
    const all=[];for(let n=10;n<=99;n++){if(Math.floor(n/10)+n%10===s&&cs.every(c=>c.f(n)))all.push(n);}
    if(all.length!==1)continue;const ans=all[0];
    const near=[];for(let n=10;n<=99;n++){if(n===ans)continue;const okCount=cs.filter(c=>c.f(n)).length+(Math.floor(n/10)+n%10===s?1:0);if(okCount===cs.length)near.push(n);}
    if(near.length<3)continue;
    const clues=cs.map(c=>c[L==="ar"?"ar":"en"]).concat([T(`my digits add up to ${s}`,`مجموع رقميّ ${s}`)]);
    return make(SEC,T(`I am a two-digit number. ${clues.map(c=>c.charAt(0).toUpperCase()+c.slice(1)).join(". ")}. Who am I?`,`أنا عدد من رقمين. ${clues.join("، و")}. من أنا؟`),null,String(ans),shuffle(near).slice(0,3).map(String),
      T(`Only ${ans} passes every clue; each other choice fails exactly one.`,`العدد ${ans} وحده يحقق كل الشروط، وكل خيار آخر يخالف شرطًا واحدًا.`));
  }
  return genSeq(d,L);
}
reg("numLogic",SEC,genNumLogic,{en:"Number detective",ar:"لغز العدد",min:6,max:9});
})();
