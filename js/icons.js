/* Nabeeh — the drawn icon set: badges, levels, lesson families and children's avatars.
   Flat, rounded, two-tone shapes in the app's own palette so they look the same on every phone,
   unlike emoji. Every icon is a 64×64 SVG string; NB.icon(kind,id,size) returns it. */
(function(){
"use strict";
const NB=window.NB;
const C={green:"#0E8A6A",greenL:"#CFEFE3",pink:"#E2457A",pinkL:"#FBDCE7",blue:"#2F7FD8",blueL:"#D8E8FB",gold:"#F2A900",goldL:"#FFEFC2",
  purple:"#7B5CD6",purpleL:"#E6DFF8",teal:"#12B886",orange:"#FF8A1F",orangeL:"#FFE3C7",ink:"#1E2A4A",white:"#FFFFFF",brown:"#8B5A2B",red:"#E03131",sky:"#6EC1FF"};
const coin=(bg,inner,shape)=>`${shape==="sq"?`<rect x="4" y="4" width="56" height="56" rx="18" fill="${bg}"/>`:`<circle cx="32" cy="32" r="28" fill="${bg}"/>`}${inner}`;
const P=(d,f,extra)=>`<path d="${d}" fill="${f}" ${extra||""}/>`;
const star=(cx,cy,r,f)=>{let p=[];for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,rr=i%2?r*.45:r;p.push((cx+rr*Math.cos(a)).toFixed(1)+","+(cy+rr*Math.sin(a)).toFixed(1));}return `<polygon points="${p.join(" ")}" fill="${f}"/>`;};
const flame=(f1,f2,s)=>`<g transform="translate(32 34) scale(${s||1}) translate(-32 -34)">${P("M32 10c2 8 10 11 10 21a10 10 0 0 1-20 0c0-5 3-7 4-11 2 3 3 4 3 7 3-4 2-10 3-17z",f1)}${P("M32 26c1 4 5 5 5 9a5 5 0 0 1-10 0c0-3 2-4 2-6 1 1 2 2 2 3 1-2 1-4 1-6z",f2)}</g>`;
const eyes=(x1,x2,y,r)=>`<circle cx="${x1}" cy="${y}" r="${r||2.6}" fill="${C.ink}"/><circle cx="${x2}" cy="${y}" r="${r||2.6}" fill="${C.ink}"/>`;

const BADGE={
 first:coin(C.greenL,P("M32 50V30",C.green,'stroke="'+C.green+'" stroke-width="4" stroke-linecap="round"')+P("M32 36c-10 0-14-8-14-14 8 0 14 4 14 14z",C.teal)+P("M32 30c8-2 14-8 14-16-8 0-14 6-14 16z",C.green)+`<ellipse cx="32" cy="51" rx="12" ry="3" fill="${C.green}" fill-opacity=".25"/>`),
 q50:coin(C.blueL,`<g transform="rotate(-40 32 32)">${P("M26 14h12v30H26z",C.gold)}${P("M26 44l6 10 6-10z",C.ink)}${P("M26 12h12v6H26z",C.pink)}${P("M30 47l2 4 2-4z",C.white)}</g>`),
 q200:coin(C.purpleL,P("M14 20h12v30H14z",C.purple)+P("M28 16h12v34H28z",C.blue)+P("M42 22l10-2 6 28-10 2z",C.pink)+P("M17 26h6M31 22h6",C.white,'stroke="#fff" stroke-width="2" stroke-linecap="round"')),
 q1000:coin(C.pinkL,P("M32 10c8 6 10 18 10 28H22c0-10 2-22 10-28z",C.ink)+`<circle cx="32" cy="26" r="4.5" fill="${C.sky}"/>`+P("M22 32l-8 10h8zM42 32l8 10h-8z",C.pink)+P("M27 38h10l-2 8h-6z",C.ink)+P("M28 46h8c0 5-2 9-4 11-2-2-4-6-4-11z",C.orange)+P("M30 46h4c0 4-1 7-2 8-1-1-2-4-2-8z",C.gold)),
 st3:coin(C.orangeL,flame(C.orange,C.gold)),
 st7:coin(C.orangeL,flame(C.pink,C.gold,1.12)),
 st14:coin(C.goldL,P("M36 8L18 36h12l-4 20 20-30H34z",C.gold)+P("M34 12L24 30h8",C.white,'fill-opacity=".45"')),
 st30:coin(C.pinkL,P("M12 52l12-28h16l12 28z",C.brown)+P("M24 24h16l-4 12H28z",C.ink)+P("M20 34l6-6 6 8 6-10 6 8",C.red,'stroke="'+C.red+'" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"')+flame(C.orange,C.gold,.6).replace("translate(32 34)","translate(32 16)")),
 acc:coin(C.pinkL,`<circle cx="32" cy="32" r="20" fill="${C.white}" stroke="${C.pink}" stroke-width="4"/><circle cx="32" cy="32" r="11" fill="${C.white}" stroke="${C.pink}" stroke-width="4"/><circle cx="32" cy="32" r="4" fill="${C.pink}"/>`+P("M32 32l16-16",C.ink,'stroke="'+C.ink+'" stroke-width="3" stroke-linecap="round"')+P("M48 16l-2 7 7-2z",C.green)),
 perfect:coin(C.goldL,`<circle cx="32" cy="28" r="16" fill="${C.gold}"/><circle cx="32" cy="28" r="11" fill="${C.white}"/>`+P("M24 40l-4 16 12-6 12 6-4-16",C.pink)+`<text x="32" y="33" text-anchor="middle" font-size="12" font-weight="800" font-family="Readex Pro,sans-serif" fill="${C.ink}">100</text>`),
 secs:coin(C.blueL,`<circle cx="32" cy="32" r="20" fill="${C.white}" stroke="${C.blue}" stroke-width="4"/>`+P("M32 14l6 18-6 18-6-18z",C.ink)+P("M32 14l6 18H26z",C.pink)+`<circle cx="32" cy="32" r="3" fill="${C.white}"/>`),
 mock1:coin(C.greenL,P("M18 16h28v38H18z",C.white)+P("M26 12h12v8H26z",C.green)+P("M18 16h28v38H18z","none",'stroke="'+C.green+'" stroke-width="3"')+P("M24 30l4 4 8-8M24 44h16",C.green,'stroke="'+C.green+'" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"')),
 full1:coin(C.blueL,P("M18 10h4v46h-4z",C.ink)+P("M22 12h26v20H22z",C.white)+[0,1,2,3].map(r=>[0,1,2,3].map(c=>(r+c)%2?"":`<rect x="${22+c*6.5}" y="${12+r*5}" width="6.5" height="5" fill="${C.ink}"/>`).join("")).join("")),
 mastered:coin(C.purpleL,P("M20 30a12 12 0 0 1 24 0v4a12 12 0 0 1-24 0z",C.pink)+P("M32 18v28M24 26h8M32 34h8M26 40h6",C.white,'stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"')+P("M28 46h8v6h-8z",C.purple)),
 w25:coin(C.goldL,`<rect x="12" y="20" width="22" height="22" rx="5" fill="${C.gold}"/><rect x="30" y="26" width="22" height="22" rx="5" fill="${C.pink}"/><text x="23" y="36" text-anchor="middle" font-size="14" font-weight="800" font-family="Readex Pro,sans-serif" fill="${C.white}">ب</text><text x="41" y="42" text-anchor="middle" font-size="14" font-weight="800" font-family="Readex Pro,sans-serif" fill="${C.white}">A</text>`),
 w100:coin(C.blueL,P("M12 20c8-4 14-4 20 0v30c-6-4-12-4-20 0zM52 20c-8-4-14-4-20 0v30c6-4 12-4 20 0z",C.white,'stroke="'+C.blue+'" stroke-width="3" stroke-linejoin="round"')+P("M18 28h8M18 34h8M38 28h8M38 34h8",C.blue,'stroke="'+C.blue+'" stroke-width="2.5" stroke-linecap="round"')),
 puz7:coin(C.greenL,P("M18 20h12a5 5 0 0 1 10 0h6v10a5 5 0 0 0 0 10v10H36a5 5 0 0 1-10 0H18V40a5 5 0 0 1 0-10z",C.teal)+P("M24 26h8M24 32h12",C.white,'stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-opacity=".7"')),
 wc1:coin(C.goldL,P("M20 14h24v12a12 12 0 0 1-24 0z",C.gold)+P("M14 18h6v6a6 6 0 0 1-6-6zM50 18h-6v6a6 6 0 0 0 6-6z","none",'stroke="'+C.gold+'" stroke-width="3"')+P("M28 38h8v8h-8z",C.gold)+P("M22 46h20v6H22z",C.ink)+star(32,24,5,C.white))
};
const LEVEL=[
 coin(C.goldL,`<ellipse cx="32" cy="34" rx="15" ry="19" fill="${C.white}" stroke="${C.gold}" stroke-width="3"/><circle cx="27" cy="30" r="3" fill="${C.goldL}"/><circle cx="36" cy="40" r="2" fill="${C.goldL}"/>`),
 coin(C.goldL,`<circle cx="32" cy="36" r="14" fill="${C.gold}"/><circle cx="32" cy="24" r="9" fill="${C.gold}"/>${eyes(29,35,23,1.8)}${P("M30 27l2 3 2-3z",C.orange)}${P("M22 50h6M36 50h6",C.orange,'stroke="'+C.orange+'" stroke-width="3" stroke-linecap="round"')}`),
 coin(C.greenL,`<ellipse cx="32" cy="36" rx="16" ry="18" fill="${C.green}"/><ellipse cx="32" cy="40" rx="9" ry="11" fill="${C.greenL}"/><circle cx="25" cy="26" r="6" fill="${C.white}"/><circle cx="39" cy="26" r="6" fill="${C.white}"/>${eyes(25,39,26,2.6)}${P("M30 31l2 4 2-4z",C.gold)}${P("M18 20l4-8 6 6M46 20l-4-8-6 6",C.green)}`),
 coin(C.goldL,star(32,33,20,C.gold)+star(32,33,9,C.white).replace('fill="#FFFFFF"','fill="#FFFFFF" fill-opacity=".45"')),
 coin(C.purpleL,P("M10 26l22-10 22 10-22 10z",C.ink)+P("M20 31v10c0 4 24 4 24 0V31l-12 5z",C.purple)+P("M54 26v14",C.ink,'stroke="'+C.ink+'" stroke-width="3" stroke-linecap="round"')+`<circle cx="54" cy="42" r="3" fill="${C.gold}"/>`),
 coin(C.goldL,P("M14 46V24l10 8 8-14 8 14 10-8v22z",C.gold)+P("M14 46h36v6H14z",C.orange)+`<circle cx="32" cy="38" r="3" fill="${C.pink}"/><circle cx="21" cy="40" r="2.2" fill="${C.blue}"/><circle cx="43" cy="40" r="2.2" fill="${C.blue}"/>`),
 BADGE.wc1
];
const LESSON={
 analogy:coin(C.pinkL,`<rect x="10" y="26" width="24" height="12" rx="6" fill="none" stroke="${C.pink}" stroke-width="4"/><rect x="30" y="26" width="24" height="12" rx="6" fill="none" stroke="${C.ink}" stroke-width="4"/>`+P("M24 32h16",C.white,'stroke="#fff" stroke-width="6" stroke-linecap="round"')+P("M26 32h12",C.pink,'stroke="'+C.pink+'" stroke-width="3" stroke-linecap="round"')),
 meaning:coin(C.purpleL,P("M14 22h18v26H14z",C.purple)+P("M32 22h18v26H32z",C.pink)+P("M19 29h8M19 35h8M37 29h8M37 35h8",C.white,'stroke="#fff" stroke-width="2.5" stroke-linecap="round"')),
 sentence:coin(C.blueL,P("M14 44h36",C.blue,'stroke="'+C.blue+'" stroke-width="3" stroke-linecap="round"')+`<g transform="rotate(-40 36 30)">${P("M31 14h10v26H31z",C.gold)}${P("M31 40l5 8 5-8z",C.ink)}${P("M31 12h10v5H31z",C.pink)}</g>`),
 oddOut:coin(C.goldL,`<circle cx="30" cy="30" r="12" fill="${C.white}" stroke="${C.gold}" stroke-width="4"/>`+P("M39 39l10 10",C.gold,'stroke="'+C.gold+'" stroke-width="5" stroke-linecap="round"')+`<circle cx="30" cy="30" r="4" fill="${C.pink}"/>`),
 reading:coin(C.blueL,P("M12 20c8-4 14-4 20 0v30c-6-4-12-4-20 0zM52 20c-8-4-14-4-20 0v30c6-4 12-4 20 0z",C.white,'stroke="'+C.blue+'" stroke-width="3" stroke-linejoin="round"')+P("M18 28h8M18 34h8M38 28h8M38 34h8",C.blue,'stroke="'+C.blue+'" stroke-width="2.5" stroke-linecap="round"')),
 logic:coin(C.purpleL,P("M20 30a12 12 0 0 1 24 0v4a12 12 0 0 1-24 0z",C.purple)+P("M32 18v28M24 26h8M32 34h8",C.white,'stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"')+P("M28 46h8v6h-8z",C.ink)),
 pattern:coin(C.blueL,`<text x="32" y="40" text-anchor="middle" font-size="22" font-weight="800" font-family="Readex Pro,sans-serif" fill="${C.blue}">1 2 4</text>`+P("M14 46h36",C.pink,'stroke="'+C.pink+'" stroke-width="3" stroke-linecap="round" stroke-dasharray="2 5"')),
 wordMath:coin(C.greenL,`<rect x="16" y="12" width="32" height="40" rx="6" fill="${C.green}"/><rect x="20" y="16" width="24" height="9" rx="2" fill="${C.greenL}"/>`+[0,1,2].map(r=>[0,1,2].map(c=>`<circle cx="${25+c*7}" cy="${33+r*7}" r="2.4" fill="${C.white}"/>`).join("")).join("")),
 rules:coin(C.goldL,P("M22 28v-6a10 10 0 0 1 20 0v6",C.ink,'stroke="'+C.ink+'" stroke-width="4" fill="none"')+`<rect x="16" y="28" width="32" height="24" rx="6" fill="${C.gold}"/><circle cx="32" cy="39" r="3.5" fill="${C.ink}"/>`+P("M32 39v6",C.ink,'stroke="'+C.ink+'" stroke-width="3" stroke-linecap="round"')),
 spatial:coin(C.blueL,P("M32 12l18 10v20L32 52 14 42V22z",C.blue)+P("M32 32l18-10v20L32 52z",C.ink,'fill-opacity=".35"')+P("M32 32L14 22v20l18 10z",C.white,'fill-opacity=".25"')+P("M14 22l18 10 18-10",C.white,'stroke="#fff" stroke-width="2" fill="none" stroke-opacity=".7"')),
 measure:coin(C.pinkL,`<g transform="rotate(-45 32 32)"><rect x="10" y="26" width="44" height="12" rx="3" fill="${C.pink}"/>${[0,1,2,3,4,5,6].map(i=>`<rect x="${14+i*6}" y="26" width="2" height="${i%2?4:7}" fill="${C.white}"/>`).join("")}</g>`),
 machines:coin(C.greenL,`<g>${[0,45,90,135,180,225,270,315].map(a=>`<rect x="29" y="10" width="6" height="9" rx="1.5" fill="${C.green}" transform="rotate(${a} 32 32)"/>`).join("")}<circle cx="32" cy="32" r="15" fill="${C.green}"/><circle cx="32" cy="32" r="6" fill="${C.greenL}"/></g>`),
 science:coin(C.purpleL,P("M26 12h12v4h-2v12l10 18a4 4 0 0 1-4 6H22a4 4 0 0 1-4-6l10-18V16h-2z",C.white,'stroke="'+C.purple+'" stroke-width="3" stroke-linejoin="round"')+P("M24 40h16l4 8H20z",C.purple)+`<circle cx="30" cy="36" r="2" fill="${C.pink}"/><circle cx="36" cy="32" r="1.6" fill="${C.pink}"/>`),
 change:coin(C.greenL,P("M14 48h36",C.ink,'stroke="'+C.ink+'" stroke-width="3" stroke-linecap="round"')+P("M16 42l10-10 8 6 14-16",C.green,'stroke="'+C.green+'" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"')+P("M48 22l1 9-9-1z",C.green)),
 creative:coin(C.goldL,P("M32 10a14 14 0 0 1 8 25v5H24v-5a14 14 0 0 1 8-25z",C.gold)+P("M26 44h12v4H26zM28 50h8v4h-8z",C.ink)+P("M29 24a4 4 0 0 1 6 0",C.white,'stroke="#fff" stroke-width="2.5" fill="none" stroke-linecap="round"'))
};
/* children's avatars, keyed by the emoji the profile stores */
const face=(bg,f,extra)=>coin(bg,`<circle cx="32" cy="34" r="18" fill="${f}"/>${extra||""}`);
const AVATAR={
 "🦉":face(C.greenL,C.green,`<circle cx="25" cy="30" r="6" fill="${C.white}"/><circle cx="39" cy="30" r="6" fill="${C.white}"/>${eyes(25,39,30,2.6)}${P("M30 35l2 4 2-4z",C.gold)}${P("M16 24l4-8 6 6M48 24l-4-8-6 6",C.green)}<ellipse cx="32" cy="43" rx="8" ry="6" fill="${C.greenL}"/>`),
 "🦊":face(C.orangeL,C.orange,`${P("M14 26l4-14 10 8zM50 26l-4-14-10 8z",C.orange)}${P("M22 40a10 8 0 0 0 20 0c0-3-4-4-10-4s-10 1-10 4z",C.white)}${eyes(26,38,31)}<circle cx="32" cy="38" r="2.4" fill="${C.ink}"/>`),
 "🐯":face(C.goldL,C.gold,`${P("M20 20l-2 6M44 20l2 6M18 36h-4M46 36h4",C.ink,'stroke="'+C.ink+'" stroke-width="3" stroke-linecap="round"')}<circle cx="18" cy="20" r="5" fill="${C.gold}"/><circle cx="46" cy="20" r="5" fill="${C.gold}"/>${P("M24 40a8 6 0 0 0 16 0z",C.white)}${eyes(26,38,30)}<circle cx="32" cy="37" r="2.2" fill="${C.ink}"/>`),
 "🐼":face(C.blueL,C.white,`<circle cx="18" cy="20" r="6" fill="${C.ink}"/><circle cx="46" cy="20" r="6" fill="${C.ink}"/><ellipse cx="25" cy="31" rx="5.5" ry="6.5" fill="${C.ink}"/><ellipse cx="39" cy="31" rx="5.5" ry="6.5" fill="${C.ink}"/><circle cx="26" cy="31" r="2" fill="${C.white}"/><circle cx="38" cy="31" r="2" fill="${C.white}"/><ellipse cx="32" cy="41" rx="3" ry="2" fill="${C.ink}"/>`),
 "🐬":coin(C.blueL,P("M12 38c6-14 20-20 34-16l6-8 0 12c4 4 4 10 0 14-10 8-26 10-40-2z",C.blue)+P("M30 24l4-10 6 8z",C.blue)+P("M14 38c10 4 20 4 28-2",C.white,'stroke="#fff" stroke-width="2.5" fill="none" stroke-opacity=".6" stroke-linecap="round"')+`<circle cx="42" cy="28" r="2.4" fill="${C.ink}"/>`),
 "🦅":coin(C.blueL,P("M8 34c6-10 16-14 24-10v6c-8-2-14 2-18 10zM56 34c-6-10-16-14-24-10v6c8-2 14 2 18 10z",C.brown)+`<ellipse cx="32" cy="42" rx="13" ry="12" fill="${C.brown}"/><circle cx="32" cy="24" r="11" fill="${C.white}"/><circle cx="36" cy="22" r="2.6" fill="${C.ink}"/>`+P("M40 25c5 0 8 2 9 5-3 0-6 1-8 4z",C.gold)+P("M26 54h12",C.gold,'stroke="'+C.gold+'" stroke-width="3" stroke-linecap="round"')),
 "🐪":coin(C.goldL,`<ellipse cx="30" cy="38" rx="16" ry="10" fill="${C.gold}"/><circle cx="26" cy="26" r="8" fill="${C.gold}"/><circle cx="36" cy="27" r="7" fill="${C.gold}"/>`+P("M42 38c0-10 3-16 9-18l3 3c-2 2-4 6-4 10v12h-6z",C.gold)+`<circle cx="50" cy="22" r="2" fill="${C.ink}"/>`+P("M20 46v8M28 47v7M34 47v7M40 46v8",C.orange,'stroke="'+C.orange+'" stroke-width="3.5" stroke-linecap="round"')+P("M16 56h34",C.greenL,'stroke="'+C.green+'" stroke-width="2" stroke-linecap="round" stroke-opacity=".5"')),
 "🚀":BADGE.q1000,
 "⭐":coin(C.goldL,star(32,33,20,C.gold)+`<circle cx="26" cy="31" r="2.2" fill="${C.ink}"/><circle cx="38" cy="31" r="2.2" fill="${C.ink}"/>`+P("M27 38a6 4 0 0 0 10 0",C.ink,'stroke="'+C.ink+'" stroke-width="2.5" fill="none" stroke-linecap="round"')),
 "🌙":coin(C.purpleL,P("M40 12a20 20 0 1 0 12 34 16 16 0 0 1-12-34z",C.gold)+star(46,18,3.5,C.white)+star(50,30,2.5,C.white)+`<circle cx="30" cy="30" r="2" fill="${C.ink}"/>`+P("M26 38a5 3 0 0 0 8 0",C.ink,'stroke="'+C.ink+'" stroke-width="2.2" fill="none" stroke-linecap="round"')),
 "⚽":coin(C.greenL,`<circle cx="32" cy="32" r="20" fill="${C.white}" stroke="${C.ink}" stroke-width="2.5"/>`+P("M32 20l9 7-3 10H26l-3-10z",C.ink)+P("M32 20V12M41 27l8-3M38 37l5 8M26 37l-5 8M23 27l-8-3",C.ink,'stroke="'+C.ink+'" stroke-width="2.5" stroke-linecap="round"')),
 "🎨":coin(C.pinkL,P("M32 12c-12 0-20 9-20 19 0 12 10 15 14 12 3-2 0-6 4-7 5-1 14 0 14-10 0-8-5-14-12-14z",C.white,'stroke="'+C.ink+'" stroke-width="2.5"')+`<circle cx="22" cy="28" r="3" fill="${C.pink}"/><circle cx="30" cy="21" r="3" fill="${C.blue}"/><circle cx="39" cy="24" r="3" fill="${C.gold}"/><circle cx="22" cy="37" r="3" fill="${C.green}"/>`)
};
const SET={badge:BADGE,level:LEVEL,lesson:LESSON,avatar:AVATAR};
function icon(kind,id,size,cls){const s=SET[kind]&&SET[kind][id];if(!s)return "";return `<svg viewBox="0 0 64 64" width="${size||40}" height="${size||40}" class="ico ${cls||""}" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">${s}</svg>`;}
NB.icon=icon;NB.ICONS=SET;
})();
