/* Nabeeh — core helpers shared by every question generator.
   Generators are written once and produce English or Arabic from the same logic.
   Signature of every generator: fn(d, L, opts) where
     d    = difficulty 1..9  (test level 1 -> 1..3, level 2 -> 4..6, level 3 -> 7..9)
     L    = "en" | "ar"
     opts = {id} optional, asks a bank generator for one specific item (used by the mistakes notebook)
*/
(function(){
"use strict";
const NB = window.NB = window.NB || {};

/* ---------- random & small utils ---------- */
const rnd = (a,b) => Math.floor(Math.random()*(b-a+1))+a;
const pick = arr => arr[Math.floor(Math.random()*arr.length)];
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
const pad = n => String(n).padStart(2,"0");
const esc = s => String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const clamp = (v,a,b) => Math.max(a,Math.min(b,v));
const gcd = (a,b) => b ? gcd(b,a%b) : Math.abs(a);
function nearNums(ans, cands, opt){
  opt=opt||{}; const min=opt.min==null?0:opt.min;
  const out=[]; for(const c of shuffle(cands)){ if(Number.isFinite(c) && c!==ans && c>=min && Number.isInteger(c)===Number.isInteger(ans) && !out.includes(c)) out.push(c); if(out.length===3) break; }
  let k=1; while(out.length<3){ const c=ans+k*(k%2?1:-1)*Math.ceil(k/2); if(c>=min&&c!==ans&&!out.includes(c)) out.push(c); k++; }
  return out;
}
const tr = L => (en,ar) => L==="ar" ? ar : en;
/* Arabic counted nouns written with digits: 3–10 take the plural, 11+ the singular (accusative) */
const arc = (n,pl,sg) => n+" "+(n>=3&&n<=10?pl:sg);
const tierOf = d => d<=3?1:d<=6?2:3;           // which test level a difficulty belongs to
const stageOf = d => ((d-1)%3)+1;              // 1..3 inside that level

/* ---------- Arabic-Indic digits for the Arabic version ----------
   Only text outside HTML/SVG tags is changed, so coordinates in markup stay intact. */
const AD = "٠١٢٣٤٥٦٧٨٩";
function loc(html, L){
  if(L!=="ar"||html==null) return html;
  return String(html).replace(/(<[^>]*>)|(\d)\.(?=\d)|(\d)|%/g,(m,tag,dd,d)=>{
    if(tag) return tag;
    if(dd!=null) return AD[+dd]+"٫";
    if(d!=null) return AD[+d];
    return "٪";
  });
}
const num = (n,L) => loc(String(n),L);

/* ---------- names (with gender, so Arabic verbs agree) ---------- */
const PEOPLE = [
  {en:"Ali",ar:"علي",g:"m"},{en:"Fahad",ar:"فهد",g:"m"},{en:"Sami",ar:"سامي",g:"m"},{en:"Omar",ar:"عمر",g:"m"},
  {en:"Khalid",ar:"خالد",g:"m"},{en:"Saad",ar:"سعد",g:"m"},{en:"Yousef",ar:"يوسف",g:"m"},{en:"Nawaf",ar:"نواف",g:"m"},
  {en:"Turki",ar:"تركي",g:"m"},{en:"Hamad",ar:"حمد",g:"m"},{en:"Sara",ar:"سارة",g:"f"},{en:"Noura",ar:"نورة",g:"f"},
  {en:"Reem",ar:"ريم",g:"f"},{en:"Lama",ar:"لمى",g:"f"},{en:"Dana",ar:"دانة",g:"f"},{en:"Maha",ar:"مها",g:"f"},
  {en:"Lina",ar:"لينا",g:"f"},{en:"Huda",ar:"هدى",g:"f"},{en:"Jana",ar:"جنى",g:"f"},{en:"Ruba",ar:"ربى",g:"f"}
];
function person(L,g){const p=pick(g?PEOPLE.filter(x=>x.g===g):PEOPLE);return {name:p[L==="ar"?"ar":"en"],g:p.g,he:L==="ar"?"":(p.g==="m"?"he":"she"),his:p.g==="m"?"his":"her",
  v:(m,f)=>p.g==="m"?m:f};}
function people(n,L,g){const ps=shuffle(g?PEOPLE.filter(x=>x.g===g):PEOPLE).slice(0,n);return ps.map(p=>p[L==="ar"?"ar":"en"]);}

/* ---------- colours & shapes ---------- */
const COLORS = [{c:"#E2457A",en:"pink",ar:"الوردي"},{c:"#2F7FD8",en:"blue",ar:"الأزرق"},{c:"#F2A900",en:"yellow",ar:"الأصفر"},{c:"#2BA57F",en:"green",ar:"الأخضر"},{c:"#7B5CD6",en:"purple",ar:"البنفسجي"}];
const SHAPES = ["circle","square","triangle","diamond","star","hexagon"];
const SHAPE_NAME = {circle:{en:"circle",ar:"الدائرة",pl:"circles",apl:"دوائر"},square:{en:"square",ar:"المربع",pl:"squares",apl:"مربعات"},
  triangle:{en:"triangle",ar:"المثلث",pl:"triangles",apl:"مثلثات"},diamond:{en:"diamond",ar:"المعيّن",pl:"diamonds",apl:"معيّنات"},
  star:{en:"star",ar:"النجمة",pl:"stars",apl:"نجوم"},hexagon:{en:"hexagon",ar:"السداسي",pl:"hexagons",apl:"أشكال سداسية"}};
const INK = "currentColor";

/* ---------- SVG helpers ---------- */
let UID=0;
function shp(t,c,cx,cy,r,x2){
  x2=x2||"";
  switch(t){
    case "circle": return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${c}" ${x2}/>`;
    case "square": {const s=r*1.6;return `<rect x="${cx-s/2}" y="${cy-s/2}" width="${s}" height="${s}" rx="3" fill="${c}" ${x2}/>`;}
    case "triangle": return `<polygon points="${cx},${cy-r} ${cx+r*.95},${cy+r*.75} ${cx-r*.95},${cy+r*.75}" fill="${c}" ${x2}/>`;
    case "diamond": return `<polygon points="${cx},${cy-r} ${cx+r*.85},${cy} ${cx},${cy+r} ${cx-r*.85},${cy}" fill="${c}" ${x2}/>`;
    case "star": {let p=[];for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,rr=i%2?r*.45:r;p.push((cx+rr*Math.cos(a)).toFixed(1)+","+(cy+rr*Math.sin(a)).toFixed(1));}return `<polygon points="${p.join(" ")}" fill="${c}" ${x2}/>`;}
    case "hexagon": {let p=[];for(let i=0;i<6;i++){const a=i*Math.PI/3;p.push((cx+r*Math.cos(a)).toFixed(1)+","+(cy+r*Math.sin(a)).toFixed(1));}return `<polygon points="${p.join(" ")}" fill="${c}" ${x2}/>`;}
  }
  return "";
}
const svg = (w,h,inner,label,cls="vis",maxw) => `<svg viewBox="0 0 ${w} ${h}" class="${cls}" role="img" aria-label="${esc(label||"picture")}" ${maxw?`style="max-width:${maxw}px"`:""} xmlns="http://www.w3.org/2000/svg" direction="ltr">${inner}</svg>`;
const optSvg = (inner,label) => svg(80,80,inner,label,"");
function arrow(dir){return `<g transform="rotate(${dir} 40 40)"><rect x="34" y="34" width="12" height="30" rx="3" fill="${INK}"/><polygon points="40,10 60,38 20,38" fill="#E2457A"/></g>`;}
function dots(n,x,y,w){
  let s=`<rect x="${x}" y="${y}" width="${w}" height="${w}" rx="10" fill="none" stroke="${INK}" stroke-opacity=".35" stroke-width="2"/>`;
  const cols=n<=4?2:n<=9?3:4, gap=w/(cols+1);
  for(let i=0;i<n;i++){const r=Math.floor(i/cols),c=i%cols;s+=`<circle cx="${x+gap*(c+1)}" cy="${y+gap*(r+1)}" r="${w/(cols*4.2)}" fill="#2F7FD8"/>`;}
  return s;
}
function pat(kind,col){
  if(kind==="solid")return {fill:col,defs:""};
  if(kind==="empty")return {fill:"none",defs:""};
  const id="p"+(++UID)+Math.random().toString(36).slice(2,6);let inner;
  if(kind==="striped")inner=`<path d="M-1,9 l10,-10 M-1,1 l2,-2 M7,11 l4,-4" stroke="${col}" stroke-width="2.6"/>`;
  else if(kind==="dotted")inner=`<circle cx="4" cy="4" r="1.9" fill="${col}"/>`;
  else inner=`<path d="M0,0 l8,8 M8,0 l-8,8" stroke="${col}" stroke-width="1.5"/>`;
  return {fill:`url(#${id})`,defs:`<defs><pattern id="${id}" width="8" height="8" patternUnits="userSpaceOnUse">${inner}</pattern></defs>`};
}
const FILLS=["solid","empty","striped","dotted","hatched"];
function shapeF(t,cx,cy,r,col,kind){kind=kind||"solid";const p=pat(kind,col);const extra=kind==="solid"?"":`stroke="${col}" stroke-width="2.6"`;return p.defs+shp(t,p.fill,cx,cy,r,extra);}
function shapeR(t,cx,cy,r,col,ang){return `<g transform="rotate(${ang} ${cx} ${cy})">${shp(t,col,cx,cy,r)}<circle cx="${cx}" cy="${cy-r*0.6}" r="${Math.max(3,r*0.2)}" fill="#fff" stroke="${col}" stroke-width="2"/></g>`;}
const qmark=(x,y,s)=>`<text x="${x}" y="${y}" text-anchor="middle" font-size="${s}" font-family="Baloo 2, sans-serif" font-weight="800" fill="#E2457A">?</text>`;
const box=(x,y,w,h,dash)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="none" stroke="${dash?"#E2457A":INK}" stroke-opacity="${dash?1:.3}" stroke-width="2"${dash?' stroke-dasharray="6 5"':""}/>`;
const txt=(x,y,s,content,o)=>{o=o||{};return `<text x="${x}" y="${y}" text-anchor="${o.a||"middle"}" font-size="${s}" font-weight="${o.w||700}" font-family="${o.f||"Baloo 2, Tajawal, sans-serif"}" fill="${o.c||INK}">${content}</text>`;};

/* ---------- question builder ---------- */
function make(sec,prompt,visual,correct,wrongs,explain,kind,key){
  kind=kind||"text";
  const seen=new Set([String(correct)]),ws=[];
  for(const w of wrongs){const s=String(w);if(!seen.has(s)){seen.add(s);ws.push(w);}}
  const items=shuffle([{v:correct,ok:true},...ws.slice(0,3).map(v=>({v,ok:false}))]);
  return {sec,prompt,visual,kind,options:items.map(i=>i.v),answer:items.findIndex(i=>i.ok),explain,
    key:key||(String(prompt).replace(/<[^>]*>/g,"")+"|"+(visual?visual.length:0)+"|"+correct)};
}

/* ---------- generator registry ----------
   NB.reg(name, sec, fn, {en,ar,bank,min,max}) — min/max are the difficulties the generator suits. */
const REG = {};
function reg(name,sec,fn,o){o=o||{};REG[name]={name,sec,fn,label:{en:o.en||name,ar:o.ar||o.en||name},bank:!!o.bank,min:o.min||1,max:o.max||9,lang:o.lang||null};}
function run(name,d,L,opts){
  const g=REG[name]; if(!g) throw new Error("No generator "+name);
  const q=g.fn(d,L,opts||{});
  q.gen=name; q.d=d; q.lang=L;
  if(L==="ar"){q.prompt=loc(q.prompt,L);q.visual=loc(q.visual,L);q.explain=loc(q.explain,L);q.options=q.options.map(o=>loc(o,L));}
  return q;
}
/* pick from a bank by difficulty window; opts.id forces one item (for re-asking a missed question) */
function bpick(bank,d,opts,spread){
  if(opts&&opts.id!=null&&bank[opts.id]) return {item:bank[opts.id],id:opts.id};
  spread=spread==null?2:spread;
  /* banks are either objects with .d or rows whose first value is the difficulty */
  const lv=it=>Array.isArray(it)?it[0]:it.d;
  let pool=[];bank.forEach((it,i)=>{if(lv(it)<=d&&lv(it)>=d-spread)pool.push(i);});
  if(!pool.length)bank.forEach((it,i)=>{if(lv(it)<=d)pool.push(i);});
  if(!pool.length)pool=bank.map((_,i)=>i);
  const id=pick(pool);return {item:bank[id],id};
}

Object.assign(NB,{rnd,pick,shuffle,pad,esc,clamp,gcd,nearNums,tr,arc,tierOf,stageOf,loc,num,PEOPLE,person,people,COLORS,SHAPES,SHAPE_NAME,INK,
  shp,svg,optSvg,arrow,dots,pat,FILLS,shapeF,shapeR,qmark,box,txt,make,REG,reg,run,bpick});
})();
