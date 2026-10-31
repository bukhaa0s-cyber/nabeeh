/* Nabeeh — renders the app icon (resources/icon-only.png, 1024×1024) from the mascot drawing in js/fx.js,
   so the icon and the owl inside the app are the same character.  node scripts/make-icon.mjs */
import {chromium} from "playwright";import fs from "node:fs";
const fx=fs.readFileSync(new URL("../js/fx.js",import.meta.url),"utf8");
const html=`<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="file://${new URL("../css/app.css",import.meta.url).pathname}"><style>html,body{margin:0;width:1024px;height:1024px;overflow:hidden}
.bg{position:absolute;inset:0;background:radial-gradient(640px 640px at 50% 36%,#FFE066 0%,#FFD23F 55%,#F7B500 100%)}
.glow{position:absolute;left:112px;top:92px;width:800px;height:800px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.35),rgba(255,255,255,0) 68%)}
.owl{position:absolute;left:142px;top:118px;width:740px}
.owl svg{width:740px;height:auto;overflow:visible;filter:drop-shadow(0 26px 30px rgba(120,70,0,.28))}
.owl .owl-bob,.owl .owl-dot,.owl .owl-lids rect{animation:none!important}
.owl .owl-lids{display:none!important}
.cap{position:absolute;left:398px;top:286px;width:260px;transform:rotate(-8deg);filter:drop-shadow(0 8px 10px rgba(0,0,0,.18))}
.spark{position:absolute;color:#fff}
</style></head><body><div class="bg"></div><div class="glow"></div>
<div class="owl" id="o"></div>
<svg class="cap" viewBox="0 0 120 70"><path d="M60 4L4 26l56 22 56-22z" fill="#1E2A4A"/><path d="M26 34v16c0 8 68 8 68 0V34L60 48z" fill="#2E3D66"/><path d="M110 28v22" stroke="#1E2A4A" stroke-width="5" stroke-linecap="round"/><circle cx="110" cy="54" r="7" fill="#FFD23F"/></svg>
<svg class="spark" style="left:780px;top:240px;width:84px" viewBox="0 0 40 40"><path d="M20 0q2 18 20 20-18 2-20 20-2-18-20-20 18-2 20-20z" fill="#fff" opacity=".9"/></svg>
<svg class="spark" style="left:150px;top:300px;width:56px" viewBox="0 0 40 40"><path d="M20 0q2 18 20 20-18 2-20 20-2-18-20-20 18-2 20-20z" fill="#fff" opacity=".75"/></svg>
<script>window.matchMedia=window.matchMedia||(()=>({matches:false}));${fx}
document.getElementById("o").innerHTML=FX.owl("idle",740);</script></body></html>`;
fs.writeFileSync("/tmp/icon.html",html);
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1024,height:1024},deviceScaleFactor:1});
await p.goto("file:///tmp/icon.html");await p.waitForTimeout(400);
await p.screenshot({path:process.argv[2]||"resources/icon-only.png"});await b.close();console.log("icon written");
