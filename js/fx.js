/* Nabeeh — motion, sound and the mascot. Everything here is decoration on top of the app:
   it respects "reduce motion", sounds can be switched off in Settings, and nothing breaks if it fails. */
(function(){
"use strict";
const RM=()=>window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- the mascot: Nabeeh the owl (original drawing) ---------- */
function owl(mood,size,id){
  mood=mood||"idle";
  return `<svg class="owl owl-${mood}" ${id?`id="${id}"`:""} viewBox="0 0 120 124" width="${size||96}" height="${(size||96)*124/120}" aria-hidden="true">
  <g class="owl-bob">
    <ellipse cx="60" cy="118" rx="30" ry="4" fill="currentColor" opacity=".10" class="owl-shadow"/>
    <g class="owl-body">
      <path d="M26 44 L22 18 L44 34 Z" fill="#0A6E54"/><path d="M94 44 L98 18 L76 34 Z" fill="#0A6E54"/>
      <ellipse cx="60" cy="70" rx="40" ry="42" fill="#0E8A6A"/>
      <ellipse class="owl-wing owl-wing-l" cx="22" cy="78" rx="10" ry="20" fill="#0A6E54"/>
      <ellipse class="owl-wing owl-wing-r" cx="98" cy="78" rx="10" ry="20" fill="#0A6E54"/>
      <ellipse cx="60" cy="88" rx="24" ry="20" fill="#DDF1EA"/>
      <path d="M50 84 q4 4 8 0 M62 84 q4 4 8 0 M56 94 q4 4 8 0" stroke="#0E8A6A" stroke-width="2.2" fill="none" stroke-linecap="round"/>
      <g class="owl-eyes">
        <circle cx="44" cy="56" r="15" fill="#fff" stroke="#0A5E49" stroke-width="3"/><circle cx="76" cy="56" r="15" fill="#fff" stroke="#0A5E49" stroke-width="3"/>
        <g class="owl-pupils"><circle cx="46" cy="58" r="6.5" fill="#15324A"/><circle cx="78" cy="58" r="6.5" fill="#15324A"/><circle cx="48" cy="55.5" r="2" fill="#fff"/><circle cx="80" cy="55.5" r="2" fill="#fff"/></g>
        <g class="owl-happy-eyes"><path d="M35 58 q9 -10 18 0" stroke="#15324A" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M67 58 q9 -10 18 0" stroke="#15324A" stroke-width="4" fill="none" stroke-linecap="round"/></g>
        <g class="owl-lids"><rect x="28" y="40" width="32" height="32" rx="16" fill="#0E8A6A"/><rect x="60" y="40" width="32" height="32" rx="16" fill="#0E8A6A"/></g>
      </g>
      <path d="M54 68 L66 68 L60 78 Z" fill="#FFD84D" stroke="#C9A21C" stroke-width="1.5" stroke-linejoin="round"/>
      <circle cx="60" cy="24" r="6" fill="#FFD84D" class="owl-dot"/>
      <ellipse cx="48" cy="112" rx="7" ry="4" fill="#FFD84D"/><ellipse cx="72" cy="112" rx="7" ry="4" fill="#FFD84D"/>
    </g>
  </g></svg>`;
}
function setMood(el,mood){if(!el)return;el.classList.remove("owl-idle","owl-happy","owl-sad","owl-cheer","owl-think");el.classList.add("owl-"+mood);}

/* ---------- confetti made of answer bubbles ---------- */
let cv=null,ctx=null,parts=[],raf=0;
const COLS=["#0E8A6A","#FFD84D","#2A6FDB","#C2416F","#6E52C9","#13896A","#FF9F43"];
function ensure(){if(cv)return;cv=document.createElement("canvas");cv.className="fx-canvas";cv.setAttribute("aria-hidden","true");document.body.appendChild(cv);ctx=cv.getContext("2d");size();addEventListener("resize",size);window.visualViewport&&visualViewport.addEventListener("resize",size);}
/* the canvas is sized from the screen the child actually sees; on iPhone innerWidth can briefly report a
   different width (after a full-screen ad, a rotation, the keyboard), and a canvas sized then left
   smeared trails at the edge because the wipe never reached that strip */
let VW=0,VH=0;
function view(){const v=window.visualViewport,de=document.documentElement;return[Math.round(de.clientWidth||(v&&v.width)||innerWidth),Math.round(de.clientHeight||(v&&v.height)||innerHeight)];}
function size(){if(!cv)return;const d=devicePixelRatio||1;[VW,VH]=view();cv.width=VW*d;cv.height=VH*d;ctx.setTransform(d,0,0,d,0,0);}
function wipe(){ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,cv.width,cv.height);ctx.restore();}
function fit(){const[w,h]=view();if(w!==VW||h!==VH)size();}
function burst(x,y,n,spread){
  if(RM())return;ensure();fit();n=n||28;spread=spread||1;
  for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,v=(3+Math.random()*6)*spread;
    parts.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-4*spread,g:.22,r:3+Math.random()*5,c:COLS[i%COLS.length],life:0,max:60+Math.random()*40,ring:Math.random()<.35,sq:Math.random()<.3,rot:Math.random()*6,vr:(Math.random()-.5)*.3});}
  if(!raf)raf=requestAnimationFrame(tick);
}
function rain(){if(RM())return;ensure();fit();for(let i=0;i<110;i++)parts.push({x:Math.random()*VW,y:-20-Math.random()*VH*.6,vx:(Math.random()-.5)*2,vy:2+Math.random()*3,g:.05,r:3+Math.random()*5,c:COLS[i%COLS.length],life:0,max:200+Math.random()*80,ring:Math.random()<.35,sq:Math.random()<.4,rot:Math.random()*6,vr:(Math.random()-.5)*.2});if(!raf)raf=requestAnimationFrame(tick);}
function tick(){
  wipe();
  parts=parts.filter(p=>p.life<p.max&&p.y<VH+40);
  for(const p of parts){p.life++;p.vy+=p.g;p.vx*=.99;p.x+=p.vx;p.y+=p.vy;p.rot+=p.vr;const a=1-Math.max(0,(p.life-p.max*.7)/(p.max*.3));
    ctx.globalAlpha=Math.max(0,a);ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rot);
    if(p.sq){ctx.fillStyle=p.c;ctx.fillRect(-p.r,-p.r*.6,p.r*2,p.r*1.2);}
    else if(p.ring){ctx.strokeStyle=p.c;ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,p.r,0,7);ctx.stroke();}
    else{ctx.fillStyle=p.c;ctx.beginPath();ctx.arc(0,0,p.r,0,7);ctx.fill();}
    ctx.restore();}
  ctx.globalAlpha=1;
  if(parts.length)raf=requestAnimationFrame(tick);else{raf=0;wipe();}
}
function burstAt(el,n,spread){if(!el)return;const r=el.getBoundingClientRect();burst(r.left+r.width/2,r.top+r.height/2,n,spread);}

/* ---------- floating "+10" ---------- */
function floatText(el,text,cls){
  if(!el||RM())return;const r=el.getBoundingClientRect(),d=document.createElement("div");d.className="fx-float "+(cls||"");d.textContent=text;
  d.style.left=(r.left+r.width/2)+"px";d.style.top=(r.top+r.height/2)+"px";document.body.appendChild(d);setTimeout(()=>d.remove(),1100);
}

/* ---------- count-up numbers ---------- */
function countUp(el,to,ms,fmt){
  if(!el)return;fmt=fmt||(x=>String(x));if(RM()){el.textContent=fmt(to);return;}
  const t0=performance.now();ms=ms||900;
  (function step(t){const k=Math.min(1,(t-t0)/ms),e=1-Math.pow(1-k,3);el.textContent=fmt(Math.round(to*e));if(k<1)requestAnimationFrame(step);})(t0);
}

/* ---------- sounds (synthesised, no files) ---------- */
let AC=null;
const on=()=>{try{return localStorage.getItem("nabeeh.sound")!=="0";}catch(e){return true;}};
function tone(freq,dur,type,vol,when){
  if(!on())return;try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();const t=AC.currentTime+(when||0),o=AC.createOscillator(),g=AC.createGain();
    o.type=type||"sine";o.frequency.setValueAtTime(freq,t);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol||.12,t+.015);g.gain.exponentialRampToValueAtTime(.0001,t+dur);
    o.connect(g).connect(AC.destination);o.start(t);o.stop(t+dur+.02);}catch(e){}
}
const sound={
  tap(){tone(660,.07,"triangle",.06);},
  right(){tone(784,.12,"sine",.11);tone(1175,.22,"sine",.1,.09);},
  wrong(){tone(220,.18,"triangle",.09);tone(180,.22,"triangle",.07,.08);},
  done(){[523,659,784,1047].forEach((f,i)=>tone(f,.25,"sine",.1,i*.11));},
  level(){[392,523,659,784,1047].forEach((f,i)=>tone(f,.2,"square",.04,i*.07));},
  isOn:on,set(v){try{localStorage.setItem("nabeeh.sound",v?"1":"0");}catch(e){}}
};
function buzz(ms){try{navigator.vibrate&&navigator.vibrate(ms);}catch(e){}}

/* ---------- progress ring ---------- */
function ring(p,size,label,sub){
  const r=44,c=2*Math.PI*r,off=c*(1-Math.max(0,Math.min(1,p)));
  return `<div class="ring" style="width:${size||110}px;height:${size||110}px"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="${r}" class="ring-bg"/><circle cx="50" cy="50" r="${r}" class="ring-fg" style="stroke-dasharray:${c.toFixed(1)};--off:${off.toFixed(1)};--full:${c.toFixed(1)}"/></svg><div class="ring-l"><b>${label}</b>${sub?`<small>${sub}</small>`:""}</div></div>`;
}

window.FX={owl,setMood,burst,burstAt,rain,floatText,countUp,sound,buzz,ring,reduced:RM};
})();
