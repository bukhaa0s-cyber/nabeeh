/* Nabeeh — short looping animations that show *why* an answer is right.
   Shown under the explanation after a wrong answer for the question types that are about movement:
   paper folding, mirrors, gears and belts, turning arrows. Pure SVG + CSS, no libraries. */
(function(){
"use strict";
const NB=window.NB;
let UID=0;
const INK="currentColor",PINK="#E2457A",BLUE="#2F7FD8",GOLD="#F2A900",PAPER="#E3EEFB";
const wrap=(w,h,style,inner,label)=>`<svg viewBox="0 0 ${w} ${h}" class="anim" role="img" aria-label="${label}" xmlns="http://www.w3.org/2000/svg" direction="ltr"><style>${style}</style>${inner}</svg>`;
const pct=(t,T)=>(100*t/T).toFixed(2)+"%";

/* ---- paper folding: the folded piece with its holes unfolds one fold at a time ---- */
function fold(q,L){
  const S=150,F=q.folds,holes=q.holes,id="f"+(++UID);
  let w=S,h=S;for(let i=0;i<F;i++){if(i%2===0)w/=2;else h/=2;}
  let region=`<rect x="0" y="0" width="${w}" height="${h}" fill="${PAPER}" stroke="${INK}" stroke-width="2"/>`;
  for(let i=0;i<holes;i++){const cy=h/2+(holes>1?(i?-h/4:h/4):0);region+=`<circle cx="${w/2}" cy="${cy}" r="${Math.max(4,Math.min(7,w/7))}" fill="#1E2A4A"/>`;}
  /* unfold the last fold first; every unfold mirrors the whole current region across its fold edge */
  const T=2+F*2+2;let css="",cur=region,t=1.6;
  for(let k=F-1;k>=0;k--){
    const vert=k%2===0,cls=id+"u"+k;
    const origin=vert?`${w}px 0px`:`0px ${h}px`,to=vert?"scale(-1,1)":"scale(1,-1)";
    css+=`.${cls}{transform-box:view-box;transform-origin:${origin};animation:${cls} ${T}s ease-in-out infinite}@keyframes ${cls}{0%,${pct(t,T)}{transform:scale(1,1)}${pct(t+1.2,T)},100%{transform:${to}}}`;
    cur=`<g>${cur}<g class="${cls}">${cur}</g></g>`;
    if(vert)w*=2;else h*=2;t+=2;
  }
  const line=(k)=>"";
  const cap=L==="ar"?"افتح الورقة طيّة طيّة: كل طيّة تضاعف الثقوب":"Open the paper one fold at a time: every fold doubles the holes";
  return [wrap(S+40,S+28,css,`<g transform="translate(20,14)">${cur}</g>`,"paper unfolding"),cap];
}

/* ---- mirror: a copy of the flag flips across the mirror line ---- */
function mirror(q,L){
  const id="m"+(++UID),water=q.water,ang=q.ang;
  const flag=`<g transform="translate(50,50) rotate(${ang})"><rect x="-5" y="-30" width="10" height="56" rx="3" fill="${BLUE}"/><polygon points="5,-30 34,-19 5,-8" fill="${PINK}"/><polygon points="5,-24 22,-19 5,-14" fill="#fff" fill-opacity=".55"/><rect x="-13" y="24" width="26" height="8" rx="3" fill="${GOLD}"/></g>`;
  const T=4,origin=water?"0px 100px":"100px 0px",to=water?"scale(1,-1)":"scale(-1,1)";
  const css=`.${id}{transform-box:view-box;transform-origin:${origin};animation:${id} ${T}s ease-in-out infinite}@keyframes ${id}{0%,20%{transform:scale(1,1);opacity:.0}25%{opacity:.9}55%,85%{transform:${to};opacity:.9}100%{transform:${to};opacity:0}}`;
  const bar=water?`<rect x="0" y="96" width="200" height="8" rx="3" fill="#6EC1FF" fill-opacity=".7"/>`:`<rect x="96" y="0" width="8" height="200" rx="3" fill="#9FB6CC"/><rect x="98" y="2" width="2" height="196" fill="#fff" fill-opacity=".7"/>`;
  const W=water?100:200,H=water?200:100;
  const cap=L==="ar"?(water?"الماء يقلب الأعلى والأسفل فقط":"المرآة تبدّل اليمين واليسار فقط"):(water?"Water flips top and bottom only":"A mirror swaps left and right only");
  return [wrap(W+20,H+12,css,`<g transform="translate(10,6)">${bar}${flag}<g class="${id}" opacity="0">${flag}</g></g>`,"mirror image"),cap];
}

/* ---- gears: every gear turns the opposite way to its neighbour ---- */
function gearSvg(cx,cy,r,col,label,n){
  let teeth="";const k=n||10;for(let i=0;i<k;i++){const a=i*360/k;teeth+=`<rect x="${cx-4}" y="${cy-r-6}" width="8" height="12" rx="2" fill="${col}" transform="rotate(${a} ${cx} ${cy})"/>`;}
  return teeth+`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${col}" fill-opacity=".25" stroke="${col}" stroke-width="4"/><circle cx="${cx}" cy="${cy}" r="${r*.22}" fill="${col}"/><text x="${cx}" y="${cy-r*.42}" text-anchor="middle" font-size="18" font-weight="700" font-family="Readex Pro,sans-serif" fill="${INK}">${label}</text>`;
}
function gears(q,L){
  const id="g"+(++UID),n=q.n,r=26,step=58,cols=["#2F7FD8","#F2A900","#2BA57F","#7B5CD6","#E2457A"];
  let css="",inner="";
  for(let i=0;i<n;i++){const cw=i%2===0?q.cw:!q.cw,cls=id+"_"+i,cx=38+i*step,cy=52;
    css+=`.${cls}{transform-box:view-box;transform-origin:${cx}px ${cy}px;animation:${cls} 6s linear infinite}@keyframes ${cls}{to{transform:rotate(${cw?360:-360}deg)}}`;
    inner+=`<g class="${cls}">${gearSvg(cx,cy,r,cols[i%5],"",10)}</g><text x="${cx}" y="${cy+6}" text-anchor="middle" font-size="17" font-weight="700" font-family="Readex Pro,sans-serif" fill="${INK}">${q.lab[i]}</text><text x="${cx}" y="${cy-r-14}" text-anchor="middle" font-size="18" fill="${PINK}">${cw?"↻":"↺"}</text>`;}
  const W=38+(n-1)*step+40,cap=L==="ar"?"كل ترس يعكس اتجاه الذي قبله":"Each gear turns against the one before it";
  return [wrap(W,96,css,inner,"turning gears"),cap];
}
function belt(q,L){
  const id="b"+(++UID),R=30,ax=52,bx=168,y=50,cw=q.cw,ansCw=q.crossed?!cw:cw;
  const spin=(cls,cx,cy,c)=>`.${cls}{transform-box:view-box;transform-origin:${cx}px ${cy}px;animation:${cls} 5s linear infinite}@keyframes ${cls}{to{transform:rotate(${c?360:-360}deg)}}`;
  const wheel=(cx,c,col)=>`<circle cx="${cx}" cy="${y}" r="${R}" fill="${col}" fill-opacity=".25" stroke="${col}" stroke-width="4"/><line x1="${cx}" y1="${y-R+4}" x2="${cx}" y2="${y+R-4}" stroke="${col}" stroke-width="4" stroke-linecap="round"/><line x1="${cx-R+4}" y1="${y}" x2="${cx+R-4}" y2="${y}" stroke="${col}" stroke-width="4" stroke-linecap="round"/>`;
  const beltPath=q.crossed?`<line x1="${ax}" y1="${y-R}" x2="${bx}" y2="${y+R}" stroke="${INK}" stroke-width="4"/><line x1="${ax}" y1="${y+R}" x2="${bx}" y2="${y-R}" stroke="${INK}" stroke-width="4"/>`:`<line x1="${ax}" y1="${y-R}" x2="${bx}" y2="${y-R}" stroke="${INK}" stroke-width="4"/><line x1="${ax}" y1="${y+R}" x2="${bx}" y2="${y+R}" stroke="${INK}" stroke-width="4"/>`;
  const css=spin(id+"a",ax,y,cw)+spin(id+"b",bx,y,ansCw);
  const lab=(cx,c,t)=>`<text x="${cx}" y="${y+R+22}" text-anchor="middle" font-size="16" font-weight="700" font-family="Readex Pro,sans-serif" fill="${INK}">${t} <tspan fill="${PINK}">${c?"↻":"↺"}</tspan></text>`;
  const cap=L==="ar"?(q.crossed?"الحزام المتقاطع يعكس الاتجاه":"الحزام المستقيم ينقل الاتجاه نفسه"):(q.crossed?"A crossed belt reverses the direction":"A straight belt keeps the same direction");
  return [wrap(220,108,css,beltPath+`<g class="${id}a">${wheel(ax,cw,BLUE)}</g><g class="${id}b">${wheel(bx,ansCw,PINK)}</g>`+lab(ax,cw,q.lab[0])+lab(bx,ansCw,q.lab[1]),"belt drive"),cap];
}

/* ---- turning arrows ---- */
function rotate(q,L){
  const id="r"+(++UID),arrow=`<rect x="34" y="34" width="12" height="30" rx="3" fill="${INK}"/><polygon points="40,10 60,38 20,38" fill="${PINK}"/>`;
  let css,inner,cap;
  if(q.t===3){ /* mirror */
    const to="scale(-1,1)";css=`.${id}{transform-box:view-box;transform-origin:100px 0px;animation:${id} 4s ease-in-out infinite}@keyframes ${id}{0%,20%{transform:scale(1,1);opacity:0}25%{opacity:.9}55%,85%{transform:${to};opacity:.9}100%{transform:${to};opacity:0}}`;
    inner=`<g transform="translate(10,6)"><rect x="96" y="0" width="8" height="90" rx="3" fill="#9FB6CC"/><g transform="translate(5,5) rotate(${q.start} 40 40)">${arrow}</g><g class="${id}" opacity="0"><g transform="translate(5,5) rotate(${q.start} 40 40)">${arrow}</g></g></g>`;
    cap=L==="ar"?"المرآة تبدّل اليمين واليسار":"The mirror swaps left and right";
    return [wrap(220,100,css,inner,"mirror"),cap];
  }
  const delta=q.t===0?90:q.t===1?-90:q.t===2?180:270;
  const steps=q.t===4?3:1,per=delta/steps;let kf="0%,15%{transform:rotate(0deg)}";
  for(let i=1;i<=steps;i++){const a=15+i*(55/steps),b=a+(steps>1?6:0);kf+=`${a}%${steps>1&&i<steps?","+b+"%":""}{transform:rotate(${per*i}deg)}`;}
  kf+=`,100%{transform:rotate(${delta}deg)}`;kf=kf.replace("},100%","}85%,100%");
  css=`.${id}{transform-box:view-box;transform-origin:60px 60px;animation:${id} 4.5s ease-in-out infinite}@keyframes ${id}{${kf}}`;
  const ring=`<circle cx="60" cy="60" r="46" fill="none" stroke="${INK}" stroke-opacity=".15" stroke-width="2" stroke-dasharray="4 6"/>`;
  const cap2=(L==="ar"?(delta===180?"نصف دورة":q.t===4?"ثلاثة أرباع مع عقارب الساعة":delta>0?"ربع دورة مع عقارب الساعة":"ربع دورة عكس عقارب الساعة"):(delta===180?"a half turn":q.t===4?"three quarter turns clockwise":delta>0?"a quarter turn clockwise":"a quarter turn counter-clockwise"));
  inner=ring+`<g class="${id}"><g transform="translate(20,20) rotate(${q.start} 40 40)">${arrow}</g></g>`;
  return [wrap(120,120,css,inner,"turning arrow"),cap2];
}

const BY={fold,mirror,gears,belt,rotate};
function html(q,L){try{const f=q&&q.anim&&BY[q.anim];if(!f)return "";const [sv,cap]=f(q,L||"ar");return `<div class="animbox">${sv}<p class="animcap">${cap}</p></div>`;}catch(e){return "";}}
window.NBAnim={html,has:q=>!!(q&&q.anim&&BY[q.anim])};
})();
