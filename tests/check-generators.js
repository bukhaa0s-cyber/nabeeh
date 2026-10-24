/* Runs every registered generator many times at every difficulty in both languages and checks the output.
   Usage: node tests/check-generators.js [runsPerCase] */
const fs=require("fs"),path=require("path"),vm=require("vm");
const dir=path.join(__dirname,"..","js");
const files=["core.js","gen-math.js","gen-flex.js","gen-science.js","verbal-en.js","verbal-ar.js","gen-official-verbal.js","gen-official-flex.js","gen-official-scimath.js","bank-more.js","blueprint.js"].filter(f=>fs.existsSync(path.join(dir,f)));
const ctx={window:{},console,Math,Date,Set,Map,JSON,Number,String,Array,Object,Error,isFinite,parseInt};ctx.window=ctx;vm.createContext(ctx);
for(const f of files)vm.runInContext(fs.readFileSync(path.join(dir,f),"utf8"),ctx,{filename:f});
const NB=ctx.NB,RUNS=+process.argv[2]||60;
const strip=s=>String(s).replace(/<[^>]*>/g,"").trim();
let fails=0,total=0;const per={};
const LATIN=/[A-Za-z]{3,}/;
for(const name of Object.keys(NB.REG)){
  const g=NB.REG[name];
  for(const L of ["en","ar"]){
    if(g.lang&&g.lang!==L)continue;
    for(let d=g.min;d<=g.max;d++){
      for(let i=0;i<RUNS;i++){
        total++;let q;
        try{q=NB.run(name,d,L);}catch(e){fails++;if(fails<40)console.log(`THROW ${name} d${d} ${L}: ${e.stack.split("\n").slice(0,3).join(" | ")}`);continue;}
        const prob=[];
        if(!Array.isArray(q.options)||q.options.length<2)prob.push("fewer than 2 options");
        if(!(q.answer>=0&&q.answer<q.options.length))prob.push("bad answer index");
        const os=q.options.map(o=>q.kind==="svg"?o:strip(o));
        if(new Set(os).size!==os.length)prob.push("duplicate options: "+os.join(" | ").slice(0,200));
        const all=[q.prompt,q.explain,...q.options].join(" ");
        if(/undefined|NaN|null|\[object/.test(all))prob.push("undefined/NaN in text");
        if(!q.explain)prob.push("no explanation");
        if(q.options.length<4&&!g.allow3)per[name+"-3opt"]=(per[name+"-3opt"]||0)+1;
        if(L==="ar"){const t=strip(q.prompt)+" "+strip(q.explain)+" "+(q.kind==="text"?q.options.map(strip).join(" "):"");if(LATIN.test(t.replace(/cm²|cm|km/g,"")))prob.push("latin text in arabic: "+t.match(LATIN)[0]);if(/[0-9]/.test(t))prob.push("western digit in arabic: "+t.slice(0,120));}
        if(L==="en"&&/[؀-ۿ]/.test(strip(q.prompt)+strip(q.explain)))prob.push("arabic in english");
        if(prob.length){fails++;if(fails<60)console.log(`FAIL ${name} d${d} ${L}: ${prob.join("; ")}\n   Q: ${strip(q.prompt).slice(0,160)}`);}
      }
    }
  }
}
console.log(`\n${total} questions generated, ${fails} problems.`);
if(Object.keys(per).length)console.log("Questions with fewer than 4 options:",per);
process.exit(fails?1:0);
