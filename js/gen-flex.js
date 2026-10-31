/* Nabeeh — Mental flexibility generators (picture patterns, rule switching, counting figures, codes, flexible uses). */
(function(){
"use strict";
const {rnd,pick,shuffle,nearNums,tr,make,reg,bpick,svg,optSvg,shp,shapeF,shapeR,qmark,box,dots,txt,INK,COLORS,SHAPES,SHAPE_NAME,FILLS}=NB;
const SEC="flex";
const cn=(c,L)=>c[L==="ar"?"ar":"en"];

/* ---------- 1. Picture grids (3×3 matrices) ---------- */
function genMatrix(d,L){
  const T=tr(L),sh=shuffle(SHAPES).slice(0,3),cols=shuffle(COLORS).slice(0,3),fills=shuffle(FILLS.filter(f=>f!=="hatched")).slice(0,3);
  const useFill=d>=3,useSize=d>=6,sizes=[14,20,26];
  const cell=80;let inner="";
  const F=(r,c)=>useFill?fills[(r+2*c)%3]:"solid",Z=(r,c)=>useSize?sizes[(2*r+c)%3]:24,S=(r,c)=>sh[(r+c)%3];
  for(let r=0;r<3;r++)for(let c=0;c<3;c++){
    const x=c*cell+40,y=r*cell+40;
    inner+=`<rect x="${c*cell+4}" y="${r*cell+4}" width="${cell-8}" height="${cell-8}" rx="10" fill="none" stroke="${INK}" stroke-opacity=".25" stroke-width="2"/>`;
    if(r===2&&c===2){inner+=qmark(x,y+12,34);continue;}
    inner+=shapeF(S(r,c),x,y,Z(r,c),cols[r].c,F(r,c));
  }
  const aS=S(2,2),aC=cols[2].c,aF=F(2,2),aZ=Z(2,2);
  const o=(s,c,f,z)=>optSvg(shapeF(s,40,40,z+2,c,f),"shape");
  const wrongs=[o(sh.find(x=>x!==aS),aC,aF,aZ),o(aS,cols[0].c,aF,aZ)];
  if(useFill)wrongs.push(o(aS,aC,fills.find(f=>f!==aF),aZ));
  if(useSize)wrongs.push(o(aS,aC,aF,sizes.find(z=>z!==aZ)));
  if(wrongs.length<3)wrongs.push(o(sh.filter(x=>x!==aS)[1],cols[1].c,aF,aZ));
  const parts=[T(`each row keeps one colour (this row is ${cols[2].en})`,`لكل صف لون واحد (هذا الصف ${cols[2].ar})`),T("the shapes shift one step along each row","الأشكال تنتقل خطوة في كل صف")];
  if(useFill)parts.push(T("the shading follows its own pattern","التظليل يتبع نمطًا خاصًا به"));
  if(useSize)parts.push(T("the sizes follow a pattern too","والأحجام تتبع نمطًا أيضًا"));
  return make(SEC,T("Which picture completes the grid?","أي صورة تكمل الشبكة؟"),svg(240,240,inner,"3 by 3 grid","vis",250),o(aS,aC,aF,aZ),shuffle(wrongs).slice(0,3),
    T("Look at one feature at a time: ","انظر إلى كل خاصية على حدة: ")+parts.join(T("; ","، "))+".","svg");
}
reg("matrix",SEC,genMatrix,{en:"Picture grids",ar:"المصفوفات الشكلية",min:1,max:9});

/* ---------- 2. Odd one out (pictures) ---------- */
function genGroup(d,L){
  const T=tr(L),mode=d<=2?pick(["shape","color"]):d<=5?pick(["shape","color","fill"]):pick(["fill","sides","rot"]);
  let items,why;
  if(mode==="shape"){const [s1,s2]=shuffle(SHAPES),cs=shuffle(COLORS).slice(0,4);items=[0,1,2,3].map(i=>({s:i===0?s2:s1,c:cs[i].c,f:"solid"}));why=T(`Three are ${SHAPE_NAME[s1].pl}; the colours don't matter here.`,`ثلاثة منها ${SHAPE_NAME[s1].apl}، والألوان لا تهم هنا.`);}
  else if(mode==="color"){const ss=shuffle(SHAPES).slice(0,4),[c1,c2]=shuffle(COLORS);items=[0,1,2,3].map(i=>({s:ss[i],c:i===0?c2.c:c1.c,f:"solid"}));why=T(`Three are ${c1.en}. The shapes are all different, so colour is the rule.`,`ثلاثة منها باللون ${c1.ar}. الأشكال كلها مختلفة، فاللون هو القاعدة.`);}
  else if(mode==="fill"){const f=pick(["solid","empty","striped","dotted"]),f2=pick(["solid","empty","striped","dotted"].filter(z=>z!==f)),ss=shuffle(SHAPES).slice(0,4),cs=shuffle(COLORS).slice(0,4);items=[0,1,2,3].map(i=>({s:ss[i],c:cs[i].c,f:i===0?f2:f}));why=T("Three are shaded the same way. Shapes and colours all differ, so shading is the rule.","ثلاثة منها مظللة بالطريقة نفسها. الأشكال والألوان كلها مختلفة، فالتظليل هو القاعدة.");}
  else if(mode==="sides"){
    const polys=[3,4,5,6,8],k=pick([3,4,5,6]),odd=pick(polys.filter(p=>p!==k)),col=pick(COLORS).c;
    const pg=(n,rot,sc)=>{const p=[];for(let i=0;i<n;i++){const a=rot+i*2*Math.PI/n;p.push((40+sc*Math.cos(a)).toFixed(1)+","+(40+sc*Math.sin(a)).toFixed(1));}return `<polygon points="${p.join(" ")}" fill="none" stroke="${col}" stroke-width="4"/>`;};
    const irr=(n)=>{const p=[];for(let i=0;i<n;i++){const a=i*2*Math.PI/n+rnd(-10,10)/40,r=rnd(20,30);p.push((40+r*Math.cos(a)).toFixed(1)+","+(40+r*Math.sin(a)).toFixed(1));}return `<polygon points="${p.join(" ")}" fill="none" stroke="${col}" stroke-width="4"/>`;};
    const correct=optSvg(irr(odd),"shape"),wrongs=[0,1,2].map(i=>optSvg(i===0?pg(k,rnd(0,6)/3,28):irr(k),"shape"));
    const nm=n=>T(n+" sides",n+" أضلاع");
    return make(SEC,T("Which one does not belong with the others?","أي شكل لا ينتمي إلى البقية؟"),null,correct,wrongs,T(`Count the sides: three shapes have ${nm(k)}, the odd one has ${nm(odd)}.`,`عُدّ الأضلاع: ثلاثة أشكال لها ${nm(k)}، والمختلف له ${nm(odd)}.`),"svg");
  }
  else{
    const s=pick(["triangle","star","square"]),col=pick(COLORS).c,base=rnd(0,3)*90;
    const arrowIn=(ang,flip)=>`<g transform="translate(40,40) scale(${flip?-1:1},1) rotate(${ang})"><polygon points="-6,-26 6,-26 6,10 18,10 0,28 -18,10 -6,10" fill="${col}"/><circle cx="10" cy="-18" r="5" fill="#1E2A4A"/></g>`;
    const correct=optSvg(arrowIn(base,true),"shape"),wrongs=[90,180,270].map(a=>optSvg(arrowIn(base+a,false),"shape"));
    return make(SEC,T("Three of these are the same shape just turned around. Which one is different?","ثلاثة من هذه الأشكال هي الشكل نفسه بعد تدويره. أيها المختلف؟"),null,correct,wrongs,T("Turning never swaps the side of the dot. The odd one is a mirror image, which no turn can make.","التدوير لا ينقل النقطة إلى الجهة الأخرى أبدًا. الشكل المختلف صورة مرآة، ولا يمكن الوصول إليها بالتدوير."),"svg");
  }
  const correct=optSvg(shapeF(items[0].s,40,40,26,items[0].c,items[0].f),"shape"),wrongs=items.slice(1).map(it=>optSvg(shapeF(it.s,40,40,26,it.c,it.f),"shape"));
  return make(SEC,T("Which one does not belong with the others?","أي شكل لا ينتمي إلى البقية؟"),null,correct,wrongs,why,"svg");
}
reg("group",SEC,genGroup,{en:"Odd one out (pictures)",ar:"الشكل المختلف",min:1,max:9});

/* ---------- 3. Growing patterns ---------- */
function genGrowth(d,L){
  const T=tr(L),t=d<=2?rnd(0,1):rnd(1,3);let seq,ans,why;
  if(t===0){const s=rnd(1,2);seq=[s,s+1,s+2];ans=s+3;why=T("One more dot each time.","نقطة واحدة إضافية في كل مرة.");}
  else if(t===1){const s=rnd(1,2);seq=[s,s+2,s+4];ans=s+6;why=T("Two more dots each time.","نقطتان إضافيتان في كل مرة.");}
  else if(t===2){seq=[1,3,6];ans=10;why=T("Add 2, then 3, so next add 4.","نضيف 2 ثم 3، إذن نضيف 4.");}
  else {seq=[1,4,9];ans=16;why=T("1×1, 2×2, 3×3 — next is 4×4.","1×1 ثم 2×2 ثم 3×3، والتالي 4×4.");}
  let inner="";seq.forEach((n,i)=>inner+=dots(n,i*90+5,5,80));
  inner+=`<rect x="275" y="5" width="80" height="80" rx="10" fill="none" stroke="#E2457A" stroke-width="2" stroke-dasharray="6 5"/>`+qmark(315,58,34);
  const mk=n=>optSvg(dots(n,4,4,72),n+" dots");
  const wr=nearNums(ans,[ans-1,ans+1,ans+2,seq[2],ans-2]);
  return make(SEC,T("Which box comes next?","أي مربع يأتي بعد ذلك؟"),svg(360,90,inner,"growing dots","vis",420),mk(ans),wr.map(mk),why,"svg");
}
reg("growth",SEC,genGrowth,{en:"Growing patterns",ar:"الأنماط المتنامية",min:1,max:6});

/* ---------- 4. Shape series ---------- */
function genSeries(d,L){
  const T=tr(L),sh=pick(SHAPES),col=pick(COLORS).c,mode=d<=2?"size":d<=5?pick(["fill","size","both"]):pick(["both","rot","alt"]);
  const F=["empty","dotted","hatched","striped","solid"];
  let draw,why;
  if(mode==="rot"){const step=pick([45,90]);const rs=pick(["triangle","square","star"]);draw=(i,x,y)=>shapeR(rs,x,y,22,col,i*step);why=T(`Each shape turns ${step}° more — follow the white dot.`,`كل شكل يدور ${step}° زيادة — تتبّع النقطة البيضاء.`);}
  else if(mode==="alt"){const s2=pick(SHAPES.filter(s=>s!==sh));draw=(i,x,y)=>shapeF(i%2?s2:sh,x,y,12+i*3,col,F[Math.min(4,i)]);why=T("Two shapes take turns, and each one is a little bigger and more filled in than the one before.","يتناوب شكلان، وكل واحد أكبر قليلًا وأكثر تظليلًا من الذي قبله.");}
  else{draw=(i,x,y)=>{const r=mode==="fill"?22:mode==="size"?12+i*4:12+i*4;return shapeF(sh,x,y,r,col,mode==="size"?"solid":F[Math.min(4,i)]);};why=mode==="fill"?T("Each shape is more filled in than the one before.","كل شكل أكثر تظليلًا من الذي قبله."):mode==="size"?T("Each shape is a little bigger than the one before.","كل شكل أكبر قليلًا من الذي قبله."):T("Each shape gets bigger and more filled in.","كل شكل يكبر ويزداد تظليلًا.");}
  let inner="";for(let i=0;i<4;i++){inner+=box(i*72+4,4,64,64);inner+=draw(i,i*72+36,36);}
  inner+=box(4*72+4,4,64,64,true)+qmark(4*72+36,48,30);
  const opt=i=>{const s=draw(i,0,0);return optSvg(`<g transform="translate(40,40)">${s}</g>`,"shape");};
  const correct=opt(4),wrongs=[opt(3),opt(2),optSvg(shapeF(pick(SHAPES.filter(s=>s!==sh)),40,40,26,col,"solid"),"shape")];
  if(mode==="rot"){wrongs[0]=opt(3);wrongs[1]=opt(5);wrongs[2]=opt(2);}
  return make(SEC,T("Which picture comes next in the row?","أي صورة تأتي بعد ذلك في الصف؟"),svg(5*72,76,inner,"shape series","vis",400),correct,wrongs,why,"svg");
}
reg("series",SEC,genSeries,{en:"Shape series",ar:"متسلسلات الأشكال",min:1,max:9});

/* ---------- 5. Rotating grids ---------- */
function genRotMatrix(d,L){
  const T=tr(L),sh=pick(["square","triangle","hexagon","star"]),col=pick(COLORS).c,step=d>=6?pick([45,135,90]):pick([45,90,90]);
  let inner="";const cell=80;
  for(let r=0;r<3;r++)for(let c=0;c<3;c++){const x=c*cell+40,y=r*cell+40,i=r*3+c;inner+=`<rect x="${c*cell+4}" y="${r*cell+4}" width="${cell-8}" height="${cell-8}" rx="10" fill="none" stroke="${INK}" stroke-opacity=".25" stroke-width="2"/>`;if(i===8){inner+=qmark(x,y+12,34);continue;}inner+=shapeR(sh,x,y,24,col,i*step);}
  const a=(8*step)%360,o=ang=>optSvg(shapeR(sh,40,40,26,col,ang),"shape");
  return make(SEC,T("The shape turns the same amount at every step, row by row. Which picture comes next?","يدور الشكل بالمقدار نفسه في كل خطوة، صفًا بعد صف. أي صورة تأتي بعد ذلك؟"),svg(240,240,inner,"rotating shapes","vis",250),
    o(a),[o((a+step)%360),o((a-step+360)%360),o((a+180)%360)],T(`Watch the white dot: it turns ${step}° each time.`,`تتبّع النقطة البيضاء: تدور ${step}° في كل مرة.`),"svg");
}
reg("rotMatrix",SEC,genRotMatrix,{en:"Rotating grids",ar:"شبكات الدوران",min:3,max:9});

/* ---------- 6. Picture analogies ---------- */
function genPicAnalogy(d,L){
  const T=tr(L),s1=pick(SHAPES),s2=pick(SHAPES.filter(s=>s!==s1)),c1=pick(COLORS).c,c2=pick(COLORS.filter(c=>c.c!==c1)).c;
  const R=[
    {a:(s,c,x,y)=>shapeF(s,x,y,26,c,"solid"),b:(s,c,x,y)=>shapeF(s,x,y,14,c,"solid"),why:T("Each shape becomes much smaller.","يصغر كل شكل كثيرًا.")},
    {a:(s,c,x,y)=>shapeF(s,x,y,26,c,"solid"),b:(s,c,x,y)=>shapeF(s,x,y,26,c,"empty"),why:T("Each filled shape becomes an empty outline.","يتحول كل شكل مملوء إلى إطار فارغ.")},
    {a:(s,c,x,y)=>shapeF(s,x,y,24,c,"solid"),b:(s,c,x,y)=>shapeF(s,x-15,y,13,c,"solid")+shapeF(s,x+15,y,13,c,"solid"),why:T("One shape becomes two smaller copies.","يتحول الشكل الواحد إلى نسختين أصغر.")}
  ];
  if(d>=5){
    R.push({a:(s,c,x,y)=>shapeF(s,x,y,26,c,"solid"),b:(s,c,x,y)=>shapeF(s,x,y,15,c,"striped"),why:T("Two changes at once: the shape gets smaller and becomes striped.","تغيّران معًا: يصغر الشكل ويصبح مخططًا.")});
    R.push({a:(s,c,x,y)=>shapeF(s,x,y,26,c,"empty")+shapeF("circle",x,y,6,c,"solid"),b:(s,c,x,y)=>shapeF(s,x,y,26,c,"solid")+shapeF("circle",x,y,6,"#fff","solid"),why:T("The colours swap: the outline fills in and the small dot turns white.","تتبادل الألوان: يمتلئ الإطار وتصبح النقطة الصغيرة بيضاء.")});
  }
  const r=pick(R),left=svg(300,80,r.a(s1,c1,40,40)+txt(92,50,24,":")+r.b(s1,c1,144,40)+txt(196,50,24,"::")+r.a(s2,c2,250,40),"analogy","vis",330);
  const o=s=>optSvg(s,"shape"),correct=o(r.b(s2,c2,40,40));
  const wr=[o(r.a(s2,c2,40,40)),o(r.b(s1,c2,40,40)),o(r.b(s2,c1,40,40))];
  return make(SEC,T("The first pair changes in a certain way. Complete the second pair the same way.","يتغيّر الزوج الأول بطريقة معيّنة. أكمل الزوج الثاني بالطريقة نفسها."),left,correct,wr,r.why+" "+T("The colour and kind of shape stay the same.","ويبقى اللون ونوع الشكل كما هما."),"svg");
}
reg("picAnalogy",SEC,genPicAnalogy,{en:"Picture analogies",ar:"التناظر الشكلي",min:2,max:9});

/* ---------- 7. Counting triangles ---------- */
function genCountTri(d,L){
  const T=tr(L),t=d<=3?0:d<=6?pick([0,1,2]):pick([1,2,3]);
  let inner="",ans,why;
  const A=[110,12],B=[12,182],C=[208,182];
  const line=(p,q,w)=>`<line x1="${p[0].toFixed(1)}" y1="${p[1].toFixed(1)}" x2="${q[0].toFixed(1)}" y2="${q[1].toFixed(1)}" stroke="${INK}" stroke-width="${w||3}" stroke-linecap="round"/>`;
  const fillTri=`<polygon points="${A.join()} ${B.join()} ${C.join()}" fill="#7B5CD6" fill-opacity=".12"/>`;
  const lerp=(p,q,t)=>[p[0]+(q[0]-p[0])*t,p[1]+(q[1]-p[1])*t];
  if(t===0||t===1){const k=t===0?rnd(2,3):rnd(3,4);inner=fillTri+line(A,B)+line(A,C)+line(B,C);for(let i=1;i<k;i++)inner+=line(A,lerp(B,C,i/k));ans=k*(k+1)/2;
    if(t===1){const m1=lerp(A,B,.55),m2=lerp(A,C,.55);inner+=line(m1,m2);ans=k*(k+1);why=T(`Lines from the top split the base into ${k} parts, making ${k*(k+1)/2} triangles above the line across and ${k*(k+1)/2} reaching the base: ${ans}.`,`الخطوط من القمة تقسم القاعدة إلى ${k} أجزاء، فتكوّن ${k*(k+1)/2} مثلثات فوق الخط العرضي و ${k*(k+1)/2} تصل إلى القاعدة: ${ans}.`);}
    else why=T(`The base is split into ${k} parts. Count triangles made of 1, 2, … ${k} parts: ${Array.from({length:k},(_,i)=>k-i).join(" + ")} = ${ans}.`,`القاعدة مقسومة إلى ${k} أجزاء. نعدّ المثلثات المكوّنة من جزء، جزأين، … ${k} أجزاء: ${Array.from({length:k},(_,i)=>k-i).join(" + ")} = ${ans}.`);}
  else if(t===2){inner=`<rect x="20" y="20" width="160" height="160" fill="#7B5CD6" fill-opacity=".12" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>`+line([20,20],[180,180])+line([180,20],[20,180]);ans=8;why=T("The two diagonals make 4 small triangles, plus 4 bigger ones each made of two small triangles: 8.","القطران يكوّنان 4 مثلثات صغيرة، و 4 أكبر كل منها من مثلثين صغيرين: 8.");}
  else{const n=pick([2,3,4]);
    /* inner lines of a triangular grid with n rows */
    inner=fillTri;inner+=line(A,B)+line(A,C)+line(B,C);for(let i=1;i<n;i++){const t0=i/n;inner+=line(lerp(A,B,t0),lerp(A,C,t0));inner+=line(lerp(B,A,t0),lerp(B,C,t0));inner+=line(lerp(C,A,t0),lerp(C,B,t0));}
    ans=Math.floor(n*(n+2)*(2*n+1)/8);why=T(`A triangle cut into ${n} rows has ${n*n} small triangles; counting all sizes, pointing up and down, gives ${ans}.`,`مثلث مقسوم إلى ${n} صفوف فيه ${n*n} مثلثات صغيرة، وبعدّ كل الأحجام المتجهة للأعلى وللأسفل يصبح المجموع ${ans}.`);}
  return make(SEC,T("How many triangles of any size are in this figure?","كم مثلثًا بأي حجم في هذا الشكل؟"),svg(220,200,inner,"figure","vis",240),String(ans),nearNums(ans,[ans-1,ans+1,ans-2,ans+2,ans*2]).map(String),why);
}
reg("countTri",SEC,genCountTri,{en:"Counting triangles",ar:"عدّ المثلثات",min:2,max:9});

/* ---------- 8. Counting squares and rectangles ---------- */
function genCountSq(d,L){
  const T=tr(L),rect=d>=7&&Math.random()<.5;
  const [m,n]=rect?pick([[1,4],[1,5],[2,2],[2,3],[2,4],[3,3]]):(()=>{const k=d<=4?rnd(2,3):rnd(3,4);return [k,k];})();
  const cs=Math.min(44,200/Math.max(m,n));let inner=`<rect x="10" y="10" width="${n*cs}" height="${m*cs}" fill="#7B5CD6" fill-opacity=".12"/>`;
  for(let r=0;r<m;r++)for(let c=0;c<n;c++)inner+=`<rect x="${10+c*cs}" y="${10+r*cs}" width="${cs}" height="${cs}" fill="none" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>`;
  let ans,why;
  if(rect){ans=(m*(m+1)/2)*(n*(n+1)/2);why=T(`Choose 2 of the ${m+1} horizontal lines (${m*(m+1)/2} ways) and 2 of the ${n+1} vertical lines (${n*(n+1)/2} ways): ${m*(m+1)/2} × ${n*(n+1)/2} = ${ans}.`,`نختار خطين من ${m+1} خطوط أفقية (${m*(m+1)/2} طرق) وخطين من ${n+1} خطوط رأسية (${n*(n+1)/2} طرق): ${m*(m+1)/2} × ${n*(n+1)/2} = ${ans}.`);}
  else{ans=0;const parts=[];for(let k=1;k<=m;k++){ans+=(m-k+1)*(n-k+1);parts.push((m-k+1)*(n-k+1));}why=T(`Count by size: ${parts.join(" + ")} = ${ans}.`,`نعدّ حسب الحجم: ${parts.join(" + ")} = ${ans}.`);}
  return make(SEC,rect?T("How many rectangles (including squares) are in this figure?","كم مستطيلًا (ومنها المربعات) في هذا الشكل؟"):T("How many squares of any size are in this figure?","كم مربعًا بأي حجم في هذا الشكل؟"),svg(n*cs+20,m*cs+20,inner,"grid","vis",Math.min(260,(n*cs+20)*1.3)),String(ans),nearNums(ans,[m*n,ans-1,ans+1,ans+m,ans-m*n+1]).map(String),why);
}
reg("countSq",SEC,genCountSq,{en:"Counting squares",ar:"عدّ المربعات",min:3,max:9});

/* ---------- 9. Codes ---------- */
const EN_AB="ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const AR_AB=["أ","ب","ت","ث","ج","ح","خ","د","ذ","ر","ز","س","ش","ص","ض","ط","ظ","ع","غ","ف","ق","ك","ل","م","ن","ه","و","ي"];
const EN_W=["CAT","DOG","SUN","HAT","PEN","BOX","CUP","MAP","BUS","FISH","BIRD","TREE","LAMP","DESK","MILK","STAR","RAIN"];
const AR_W=["قلم","شمس","بحر","نهر","جبل","سمك","ورد","قمر","عسل","ثلج","نمر","فيل","خبز","ريش","كتب","سور","حجر"];
function genCode(d,L){
  const T=tr(L),AB=L==="ar"?AR_AB:EN_AB,W=L==="ar"?AR_W:EN_W,n=AB.length;
  const split=w=>L==="ar"?Array.from(w):w.split("");
  const show=a=>`<b dir="${L==="ar"?"rtl":"ltr"}" style="letter-spacing:.35em;white-space:nowrap">${a.join(L==="ar"?" ":"")}</b>`;
  if(d>=6&&Math.random()<.45){
    const w=split(pick(W)),val=w.reduce((s,ch)=>s+AB.indexOf(ch)+1,0),ex=split(pick(W.filter(x=>x!==w.join(""))));const exv=ex.reduce((s,ch)=>s+AB.indexOf(ch)+1,0);
    return make(SEC,T(`Each letter has a value: A = 1, B = 2, C = 3, and so on. ${show(ex)} = ${exv}. What is ${show(w)} worth?`,`لكل حرف قيمة حسب ترتيبه في حروف الهجاء: أ = 1، ب = 2، ت = 3، وهكذا. ${show(ex)} = ${exv}. ما قيمة ${show(w)}؟`),null,String(val),nearNums(val,[val+1,val-1,val+2,val+n,val-3]).map(String),
      T(`${w.map(ch=>ch+" = "+(AB.indexOf(ch)+1)).join(", ")}; total ${val}.`,`${w.map(ch=>ch+" = "+(AB.indexOf(ch)+1)).join("، ")}؛ المجموع ${val}.`));
  }
  const k=d<=4?pick([1,2]):pick([1,2,3,-1]),sh=(w,s)=>w.map(ch=>AB[(AB.indexOf(ch)+s+n*4)%n]);
  const [w1,w2]=shuffle(W).slice(0,2).map(split),c1=sh(w1,k),ans=sh(w2,k);
  const wr=[sh(w2,k+1),sh(w2,k-1||-2),sh(w2,k).slice().reverse(),w2.map((ch,i)=>i===0?AB[(AB.indexOf(ch)+k+n)%n]:ch)].map(show);
  const step=Math.abs(k),dirw=k>0?T("forward","إلى الأمام"):T("back","إلى الخلف");
  return make(SEC,T(`In a secret code, ${show(w1)} is written as ${show(c1)}. How is ${show(w2)} written in the same code?`,`في شفرة سرية، تُكتب ${show(w1)} هكذا: ${show(c1)}. كيف تُكتب ${show(w2)} بالشفرة نفسها؟`),null,show(ans),wr,
    T(`Each letter moves ${step} place${step>1?"s":""} ${dirw} in the alphabet.`,`كل حرف ينتقل ${step===1?"خطوة واحدة":step===2?"خطوتين":step+" خطوات"} ${dirw} في ترتيب حروف الهجاء (أ ب ت ث …).`));
}
reg("code",SEC,genCode,{en:"Secret codes",ar:"الشفرات",min:3,max:9});

/* ---------- 10. Matchstick patterns ---------- */
function genSticks(d,L){
  const T=tr(L),kind=d<=4?pick(["sq","tri"]):pick(["sq","tri","grid"]);
  const st=(x1,y1,x2,y2)=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#C07A2C" stroke-width="5" stroke-linecap="round"/><circle cx="${x2}" cy="${y2}" r="3.5" fill="#E2457A"/>`;
  let inner="",ans,k,why;const s=24;let ox=8;
  if(kind==="grid"){
    k=rnd(4,5);
    for(let n=1;n<=3;n++){for(let r=0;r<=n;r++)for(let c=0;c<n;c++)inner+=st(ox+c*s,8+r*s,ox+(c+1)*s,8+r*s);for(let c=0;c<=n;c++)for(let r=0;r<n;r++)inner+=st(ox+c*s,8+r*s,ox+c*s,8+(r+1)*s);ox+=n*s+30;}
    ans=2*k*(k+1);
    why=T(`A grid of n × n squares needs 2 × n × (n + 1) sticks: 4, 12, 24… so ${k} × ${k} needs ${ans}.`,`شبكة n × n من المربعات تحتاج 2 × n × (n + 1) عودًا: 4، 12، 24… إذن ${k} × ${k} تحتاج ${ans}.`);
  } else if(kind==="tri"){
    /* a strip of triangles, pointing up and down in turn */
    k=rnd(6,14);const y0=8,y1=8+s*0.87;
    for(let n=2;n<=4;n++){
      const B=m=>[ox+m*s,y1],Tp=m=>[ox+m*s+s/2,y0];
      for(let j=0;j<=n;j++){const [a,b]=j%2===0?[B(j/2),Tp(j/2)]:[Tp((j-1)/2),B((j+1)/2)];inner+=st(a[0],a[1],b[0],b[1]);}
      for(let i=0;i<n;i++){if(i%2===0){const a=B(i/2),b=B(i/2+1);inner+=st(a[0],a[1],b[0],b[1]);}else{const a=Tp((i-1)/2),b=Tp((i+1)/2);inner+=st(a[0],a[1],b[0],b[1]);}}
      ox+=Math.ceil((n+1)/2)*s+30;
    }
    ans=2*k+1;
    why=T(`2 triangles need 5 sticks, 3 need 7, 4 need 9: each new triangle adds 2 sticks. So ${k} triangles need 2 × ${k} + 1 = ${ans}.`,`مثلثان يحتاجان 5 أعواد، و 3 مثلثات 7، و 4 مثلثات 9: كل مثلث جديد يضيف عودين. إذن ${k} مثلثًا تحتاج 2 × ${k} + 1 = ${ans}.`);
  } else {
    k=rnd(5,12);
    for(let n=1;n<=3;n++){for(let c=0;c<n;c++){inner+=st(ox+c*s,8,ox+(c+1)*s,8)+st(ox+c*s,8+s,ox+(c+1)*s,8+s);}for(let c=0;c<=n;c++)inner+=st(ox+c*s,8,ox+c*s,8+s);ox+=n*s+30;}
    ans=3*k+1;
    why=T(`Each new square needs 3 more sticks: 4, 7, 10… so ${k} squares need 3 × ${k} + 1 = ${ans}.`,`كل مربع جديد يحتاج 3 أعواد إضافية: 4، 7، 10… إذن ${k} مربعات تحتاج 3 × ${k} + 1 = ${ans}.`);
  }
  const W=ox,H=kind==="grid"?3*s+20:s+20;
  const kn=L==="ar"?(k<=10?k+" مثلثات":k+" مثلثًا"):"";
  const q=kind==="grid"?T(`Sticks make these square grids: 1 × 1, 2 × 2, 3 × 3. How many sticks make a ${k} × ${k} grid?`,`تكوّن الأعواد هذه الشبكات المربعة: 1 × 1، 2 × 2، 3 × 3. كم عودًا نحتاج لشبكة ${k} × ${k}؟`)
    :kind==="tri"?T(`Following this pattern, how many sticks are needed for a strip of ${k} triangles?`,`باتباع هذا النمط، كم عودًا نحتاج لشريط من ${kn}؟`)
    :T(`Following this pattern, how many sticks are needed to make ${k} squares in a row?`,`باتباع هذا النمط، كم عودًا نحتاج لتكوين ${L==="ar"&&k>10?k+" مربعًا":k+" مربعات"} في صف واحد؟`);
  return make(SEC,q,svg(W,H,inner,"matchsticks","vis",Math.min(380,W*1.4)),String(ans),nearNums(ans,[3*k,ans+1,ans-1,2*k,ans+k,4*k]).map(String),why);
}
reg("sticks",SEC,genSticks,{en:"Matchstick patterns",ar:"أنماط الأعواد",min:2,max:8});

/* ---------- 11. Made-up operations ---------- */
function genSymOp(d,L){
  const T=tr(L),O=[
    {f:(a,b)=>2*a+b,en:"2 × a + b",ar:"2 × أ + ب"},{f:(a,b)=>a*b-a,en:"a × b − a",ar:"أ × ب − أ"},{f:(a,b)=>a*a+b,en:"a × a + b",ar:"أ × أ + ب"},
    {f:(a,b)=>(a+b)*2,en:"(a + b) × 2",ar:"(أ + ب) × 2"},{f:(a,b)=>a*b+a+b,en:"a × b + a + b",ar:"أ × ب + أ + ب"}];
  const o=pick(O),sym=pick(["◆","★","⊕","▲"]),a=rnd(2,6),b=rnd(1,5);
  if(d>=7){const c=rnd(1,3),inner=o.f(a,b),ans=o.f(inner,c);
    return make(SEC,T(`If a ${sym} b = ${o.en}, what is (${a} ${sym} ${b}) ${sym} ${c}?`,`إذا كان أ ${sym} ب = ${o.ar}، فما قيمة (${a} ${sym} ${b}) ${sym} ${c}؟`),null,String(ans),nearNums(ans,[o.f(a,o.f(b,c)),inner,ans+1,ans-c,o.f(c,inner)]).map(String),
      T(`Work out the brackets first: ${a} ${sym} ${b} = ${inner}. Then ${inner} ${sym} ${c} = ${ans}.`,`نبدأ بما بين القوسين: ${a} ${sym} ${b} = ${inner}. ثم ${inner} ${sym} ${c} = ${ans}.`));}
  const ans=o.f(a,b);
  return make(SEC,T(`If a ${sym} b = ${o.en}, what is ${a} ${sym} ${b}?`,`إذا كان أ ${sym} ب = ${o.ar}، فما قيمة ${a} ${sym} ${b}؟`),null,String(ans),nearNums(ans,[o.f(b,a),a+b,a*b,ans+1,ans-2]).map(String),
    T(`Put a = ${a} and b = ${b} into the rule: ${o.en.replace(/a/g,a).replace(/b/g,b)} = ${ans}.`,`نعوّض أ = ${a} و ب = ${b} في القاعدة: ${o.ar.replace(/أ/g,a).replace(/ب/g,b)} = ${ans}.`));
}
reg("symOp",SEC,genSymOp,{en:"Made-up operations",ar:"العمليات المبتكرة",min:5,max:9});

/* ---------- 12. Odd number out ---------- */
const PROPS=[
  {f:n=>Number.isInteger(Math.sqrt(n)),en:"square numbers",ar:"أعداد مربعة"},
  {f:n=>{if(n<2)return false;for(let i=2;i*i<=n;i++)if(n%i===0)return false;return true;},en:"prime numbers",ar:"أعداد أولية"},
  {f:n=>n%4===0,en:"multiples of 4",ar:"مضاعفات العدد 4"},{f:n=>n%3===0,en:"multiples of 3",ar:"مضاعفات العدد 3"},
  {f:n=>n%5===0,en:"multiples of 5",ar:"مضاعفات العدد 5"},{f:n=>n%2===1,en:"odd numbers",ar:"أعداد فردية"},{f:n=>n%2===0,en:"even numbers",ar:"أعداد زوجية"},
  {f:n=>String(n).split("").reduce((a,b)=>a+ +b,0)===9,en:"numbers whose digits add up to 9",ar:"أعداد مجموع أرقامها 9"},
  {f:n=>n%7===0,en:"multiples of 7",ar:"مضاعفات العدد 7"}
];
function genOddNum(d,L){
  const T=tr(L);
  for(let t=0;t<300;t++){
    const P=pick(d>=7?PROPS:PROPS.slice(0,8)),pool=[];for(let n=2;n<=(d>=7?99:60);n++)if(P.f(n))pool.push(n);
    if(pool.length<3)continue;const three=shuffle(pool).slice(0,3);let odd;
    const nonp=[];for(let n=2;n<=(d>=7?99:60);n++)if(!P.f(n))nonp.push(n);odd=pick(nonp);
    const set=[...three,odd];
    /* reject if any other property singles out a different number (3 share it and one doesn't, or only one has it) */
    const outlier=Q=>{const hit=set.filter(Q.f);if(hit.length===3)return set.find(x=>!Q.f(x));if(hit.length===1)return hit[0];return null;};
    if(PROPS.some(Q=>Q!==P&&outlier(Q)!=null&&outlier(Q)!==odd))continue;
    return make(SEC,T("Which number does not belong with the others?","أي عدد لا ينتمي إلى البقية؟"),null,String(odd),three.map(String),T(`The others are all ${P.en}; ${odd} is not.`,`البقية كلها ${P.ar}، أما ${odd} فليس كذلك.`));
  }
  return genSymOp(Math.max(5,d),L);
}
reg("oddNum",SEC,genOddNum,{en:"Odd number out",ar:"العدد المختلف",min:4,max:9});

/* ---------- 13. Counting ways ---------- */
function genWays(d,L){
  const T=tr(L),t=d<=4?0:d<=6?pick([0,1,2]):pick([1,2,3,4]);
  if(t===0){const a=rnd(2,4),b=rnd(2,4);return make(SEC,T(`You have ${a} shirts and ${b} pairs of trousers. How many different outfits of one shirt and one pair of trousers can you make?`,`لديك ${a} قمصان و ${b} سراويل. كم طقمًا مختلفًا من قميص وسروال يمكنك تكوينه؟`),null,String(a*b),nearNums(a*b,[a+b,a*b+1,a*b-1,2*(a+b)]).map(String),T(`Each shirt goes with each pair of trousers: ${a} × ${b} = ${a*b}.`,`كل قميص يُلبس مع كل سروال: ${a} × ${b} = ${a*b}.`));}
  if(t===1){const n=pick([3,4]),ans=n===3?6:24;return make(SEC,T(`In how many different orders can ${n} friends stand in a line?`,`بكم طريقة مختلفة يمكن أن يقف ${n} أصدقاء في صف؟`),null,String(ans),nearNums(ans,[n*n,n*(n-1),n+n,ans/2,ans+n]).map(String),T(`${Array.from({length:n},(_,i)=>n-i).join(" × ")} = ${ans}: ${n} choices for first place, then one fewer each time.`,`${Array.from({length:n},(_,i)=>n-i).join(" × ")} = ${ans}: ${n} خيارات للمكان الأول، ثم يقل خيار في كل مرة.`));}
  if(t===2){const n=rnd(4,8),ans=n*(n-1)/2;return make(SEC,T(`${n} players each shake hands once with every other player. How many handshakes are there?`,`${n} لاعبين يصافح كل منهم كل لاعب آخر مرة واحدة. كم مصافحة تحدث؟`),null,String(ans),nearNums(ans,[n*(n-1),n*n,ans+n,ans-1,n]).map(String),T(`Each of ${n} players shakes ${n-1} hands, but that counts every handshake twice: ${n} × ${n-1} ÷ 2 = ${ans}.`,`كل لاعب من ${n} يصافح ${n-1}، لكن هذا يعدّ كل مصافحة مرتين: ${n} × ${n-1} ÷ 2 = ${ans}.`));}
  if(t===3){const digs=shuffle([1,2,3,4,5,6,7,8,9]).slice(0,pick([3,4])),k=digs.length,ans=k*(k-1);return make(SEC,T(`How many different two-digit numbers can be made from the digits ${digs.join(", ")} if no digit is used twice?`,`كم عددًا مختلفًا من رقمين يمكن تكوينه من الأرقام ${digs.join("، ")} دون تكرار أي رقم؟`),null,String(ans),nearNums(ans,[k*k,k,ans/2,ans+k,ans-1]).map(String),T(`${k} choices for the tens digit, then ${k-1} for the ones: ${k} × ${k-1} = ${ans}.`,`${k} خيارات لرقم العشرات، ثم ${k-1} لرقم الآحاد: ${k} × ${k-1} = ${ans}.`));}
  const r=pick([2,3]),c=pick([2,3,4]);const C=(n,k)=>{let v=1;for(let i=0;i<k;i++)v=v*(n-i)/(i+1);return v;},ans=C(r+c,r),s=34;
  let inner="";for(let i=0;i<=r;i++)inner+=`<line x1="20" y1="${20+i*s}" x2="${20+c*s}" y2="${20+i*s}" stroke="${INK}" stroke-width="2.5"/>`;for(let j=0;j<=c;j++)inner+=`<line x1="${20+j*s}" y1="20" x2="${20+j*s}" y2="${20+r*s}" stroke="${INK}" stroke-width="2.5"/>`;
  inner+=`<circle cx="20" cy="${20+r*s}" r="8" fill="#2BA57F"/><circle cx="${20+c*s}" cy="20" r="8" fill="#E2457A"/>`;
  return make(SEC,T("Moving only right or up along the lines, how many different shortest paths go from the green dot to the pink dot?","بالتحرك يمينًا أو للأعلى فقط على الخطوط، كم مسارًا مختلفًا من أقصر المسارات يصل من النقطة الخضراء إلى الوردية؟"),svg(c*s+40,r*s+40,inner,"path grid","vis",Math.min(240,(c*s+40)*1.4)),String(ans),nearNums(ans,[r*c,r+c,ans+2,ans-2,ans*2]).map(String),
    T(`Write at each corner the number of ways to reach it: every corner is the sum of the corner to its left and the one below. The pink corner gets ${ans}.`,`اكتب عند كل نقطة عدد طرق الوصول إليها: كل نقطة تساوي مجموع النقطة التي على يسارها والتي تحتها. نقطة الوصول تساوي ${ans}.`));
}
reg("ways",SEC,genWays,{en:"Counting ways",ar:"عدّ الطرق والاحتمالات",min:3,max:9});

/* ---------- 14. Flexible uses of things (bank) ---------- */
const USES=[
 {d:1,en:["Which object can be used both to carry water and to carry sand?","A bucket",["A sieve","A paper napkin","A fork"],"A bucket holds water without leaking and can also carry sand."],ar:["أي شيء يمكن استخدامه لحمل الماء ولحمل الرمل أيضًا؟","الدلو",["المصفاة","المنديل الورقي","الشوكة"],"الدلو يحمل الماء دون أن يتسرب، ويمكن أن يحمل الرمل أيضًا."]},
 {d:1,en:["Which object can be used both to keep dry in the rain and to make shade in the sun?","An umbrella",["Sunglasses","A towel","A fan"],"An umbrella blocks rain and sunlight."],ar:["أي شيء يحميك من المطر ويصنع لك ظلًّا من الشمس أيضًا؟","المظلة",["النظارة الشمسية","المنشفة","المروحة"],"المظلة تحجب المطر وأشعة الشمس معًا."]},
 {d:1,en:["Which object can be used both to measure a line and to draw a straight line?","A ruler",["An eraser","A pair of scissors","A clock"],"A ruler has marks for measuring and a straight edge for drawing."],ar:["أي أداة تقيس الطول وترسم خطًا مستقيمًا أيضًا؟","المسطرة",["الممحاة","المقص","الساعة"],"للمسطرة تدريج للقياس وحافة مستقيمة للرسم."]},
 {d:2,en:["Which object can help you see in the dark and also send a signal to someone far away?","A flashlight",["A whistle","A pillow","A pair of glasses"],"A flashlight lights your way, and flashing it on and off can send a signal."],ar:["أي شيء يساعدك على الرؤية في الظلام ويمكن أن ترسل به إشارة لشخص بعيد؟","المصباح اليدوي",["الصافرة","الوسادة","النظارة"],"المصباح يضيء الطريق، وتشغيله وإطفاؤه يرسل إشارة."]},
 {d:2,en:["Which object can keep food cold and also make ice?","A freezer",["An oven","A kettle","A toaster"],"A freezer keeps food very cold and freezes water into ice."],ar:["أي جهاز يحفظ الطعام باردًا ويصنع الثلج أيضًا؟","الفريزر",["الفرن","الغلاية","محمصة الخبز"],"الفريزر يبرّد الطعام ويجمّد الماء فيصبح ثلجًا."]},
 {d:2,en:["Which object can hold papers together and also be bent into a small hook?","A paper clip",["A rubber eraser","A sticky note","A crayon"],"A metal paper clip grips paper and can be bent into a hook."],ar:["أي شيء يجمع الأوراق معًا ويمكن ثنيه ليصبح خطافًا صغيرًا؟","مشبك الورق",["الممحاة","الورقة اللاصقة","قلم التلوين"],"مشبك الورق المعدني يمسك الأوراق ويمكن ثنيه ليصبح خطافًا."]},
 {d:3,en:["A coin, a key and a flat stick could all be used to…","turn a flat screw",["cut paper","light a room","hold water"],"All three have a thin flat edge that fits the slot of a flat screw."],ar:["العملة المعدنية والمفتاح والعود المسطح يمكن استخدامها جميعًا لـ…","تدوير برغي مسطح",["قص الورق","إضاءة غرفة","حمل الماء"],"لها جميعًا حافة رقيقة مسطحة تدخل في شق البرغي."]},
 {d:3,en:["A cup, a hat and a shoe box could all be used to…","catch a small insect to set it free outside",["write a letter","cut cardboard","make music by blowing"],"All three can cover a small insect and be carried outside."],ar:["الكوب والقبعة وعلبة الحذاء يمكن استخدامها جميعًا لـ…","الإمساك بحشرة صغيرة وإطلاقها خارج البيت",["كتابة رسالة","قص الكرتون","العزف بالنفخ"],"يمكن بكل منها تغطية حشرة صغيرة وحملها إلى الخارج."]},
 {d:4,en:["Which of these can be used as a mirror when there is no mirror?","The screen of a switched-off phone",["A sheet of paper","A wooden board","A wool blanket"],"A dark, smooth, shiny surface reflects light well enough to see yourself."],ar:["أي هذه يمكن أن يُستخدم مرآةً عند عدم وجود مرآة؟","شاشة هاتف مطفأ",["ورقة بيضاء","لوح خشبي","بطانية صوف"],"السطح الأملس اللامع الداكن يعكس الضوء بما يكفي لترى نفسك."]},
 {d:4,en:["A student has no ruler. Which of these could measure the length of a desk best?","A pencil, counting how many pencil-lengths fit",["A balloon","A sponge","A handful of sand"],"Anything with a fixed length can be laid end to end and counted."],ar:["طالب ليس معه مسطرة. أي هذه أفضل لقياس طول الطاولة؟","قلم رصاص، بعدّ كم مرة يتكرر طوله",["بالون","إسفنجة","حفنة رمل"],"أي شيء طوله ثابت يمكن وضعه متتاليًا وعدّه."]},
 {d:5,en:["Which object could be used both as a paperweight and to crack a nut?","A smooth heavy stone",["A feather","A sponge","A plastic bag"],"A heavy stone holds papers down and is hard enough to crack a shell."],ar:["أي شيء يمكن أن يثبّت الأوراق ويكسر حبة جوز أيضًا؟","حجر أملس ثقيل",["ريشة","إسفنجة","كيس بلاستيكي"],"الحجر الثقيل يثبت الأوراق، وصلب بما يكفي لكسر القشرة."]},
 {d:5,en:["Which shape of drinking straw would be MOST useful for building a strong small bridge?","Straws joined into triangles",["Straws laid side by side","One long straw","Straws joined into squares"],"Triangles keep their shape when pushed; squares fold into diamonds."],ar:["عند بناء جسر صغير قوي من مصاصات الشرب، أي ترتيب هو الأنفع؟","مصاصات موصولة على شكل مثلثات",["مصاصات متجاورة","مصاصة طويلة واحدة","مصاصات موصولة على شكل مربعات"],"المثلث يحافظ على شكله عند الضغط، أما المربع فينطوي إلى معيّن."]},
 {d:6,en:["Which pair of things could BOTH be used to tell roughly what time of day it is outdoors?","A shadow and the sun's height in the sky",["A thermometer and a ruler","A compass and a map","A cloud and a puddle"],"The sun's height and the length of shadows change through the day."],ar:["أي زوج من الأشياء يساعد كلاهما على معرفة الوقت تقريبًا في الخارج؟","الظل وارتفاع الشمس في السماء",["مقياس الحرارة والمسطرة","البوصلة والخريطة","السحابة وبركة الماء"],"ارتفاع الشمس وطول الظل يتغيران خلال اليوم."]},
 {d:7,en:["A team must keep an ice cube from melting for as long as possible. Which plan uses everyday things most cleverly?","Wrap it in newspaper and put it inside a cup inside a closed box",["Hold it in your warm hands","Put it in a metal bowl in the sun","Blow warm air on it"],"Layers of paper and air slow down heat getting to the ice."],ar:["على فريق أن يحفظ مكعب ثلج من الذوبان أطول وقت ممكن. أي خطة تستخدم الأشياء اليومية بذكاء أكبر؟","لفّه بورق الجرائد ووضعه في كوب داخل صندوق مغلق",["إمساكه باليدين الدافئتين","وضعه في وعاء معدني تحت الشمس","النفخ عليه بهواء دافئ"],"طبقات الورق والهواء تبطئ وصول الحرارة إلى الثلج."]},
 {d:8,en:["You need to find the middle of a long rope without a ruler. What is the quickest way?","Fold it so the two ends meet; the fold is the middle",["Guess by looking","Cut it into many pieces","Tie a knot at one end"],"Folding end to end splits any length exactly in half."],ar:["تريد معرفة منتصف حبل طويل دون مسطرة. ما أسرع طريقة؟","اثنِ الحبل حتى يلتقي طرفاه؛ مكان الثني هو المنتصف",["التخمين بالنظر","قطعه إلى قطع كثيرة","عقد عقدة في أحد طرفيه"],"ثني الحبل طرفًا على طرف يقسم أي طول إلى نصفين تمامًا."]},
 {d:9,en:["How could you measure the volume of an oddly shaped small stone using only a measuring jug of water?","Read the water level, drop in the stone, and read the rise",["Weigh the jug before filling it","Measure the stone's shadow","Count the stone's corners"],"The stone pushes aside water equal to its own volume."],ar:["كيف تقيس حجم حجر صغير غير منتظم الشكل باستخدام إبريق مدرّج فيه ماء فقط؟","نقرأ مستوى الماء، ثم نُسقط الحجر ونقرأ مقدار الارتفاع",["نزن الإبريق قبل ملئه","نقيس ظل الحجر","نعدّ زوايا الحجر"],"الحجر يزيح ماءً بقدر حجمه تمامًا."]}
];
function genUses(d,L,opts){
  const {item,id}=bpick(USES,d,opts,3),r=item[L==="ar"?"ar":"en"];
  return make(SEC,r[0],null,r[1],r[2],r[3],"text","uses:"+id);
}
reg("uses",SEC,genUses,{en:"Flexible uses",ar:"الاستخدامات المتعددة",min:1,max:9,bank:true});
NB.BANKS=NB.BANKS||{};NB.BANKS.uses=USES;
})();
