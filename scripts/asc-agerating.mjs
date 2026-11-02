/* Nabeeh — read, and optionally fix, the app's age rating declaration.
   Environment: ASC_KEY_ID, ASC_ISSUER_ID, ASC_KEY_P8_BASE64, APP_ID (default Nabeeh),
                SET  "key=value,key=value" booleans to write, e.g. advertising=true
                DRY_RUN "1" to only print. */
import { createSign } from "node:crypto";
const API="https://api.appstoreconnect.apple.com/v1";
const APP=process.env.APP_ID||"6826632743";
const need=k=>{const v=process.env[k];if(!v)throw new Error("missing "+k);return v;};
const DRY=process.env.DRY_RUN==="1";
const kid=need("ASC_KEY_ID"),iss=need("ASC_ISSUER_ID");
const pem=Buffer.from(need("ASC_KEY_P8_BASE64"),"base64").toString("utf8").trim();
const now=Math.floor(Date.now()/1000),b64=o=>Buffer.from(JSON.stringify(o)).toString("base64url");
const head=`${b64({alg:"ES256",kid,typ:"JWT"})}.${b64({iss,iat:now,exp:now+1200,aud:"appstoreconnect-v1"})}`;
const JWT=`${head}.${createSign("SHA256").update(head).sign({key:pem,dsaEncoding:"ieee-p1363"}).toString("base64url")}`;
async function api(m,u,b){const r=await fetch(u.startsWith("http")?u:API+u,{method:m,headers:{Authorization:"Bearer "+JWT,...(b?{"Content-Type":"application/json"}:{})},body:b?JSON.stringify(b):undefined});
 if(r.status===204)return null;const t=await r.text();let j=null;try{j=t?JSON.parse(t):null;}catch{}
 if(!r.ok)throw new Error(`${m} ${u.replace(API,"")} → ${r.status}\n${j?.errors?.map(e=>`${e.title}: ${e.detail}`).join("\n")||t.slice(0,500)}`);return j;}

const infos=await api("GET",`/apps/${APP}/appInfos?limit=10`);
for(const inf of infos.data){
  const state=inf.attributes.appStoreState||inf.attributes.state;
  let d;try{d=await api("GET",`/appInfos/${inf.id}/ageRatingDeclaration`);}catch(e){console.log(`appInfo ${state}: no declaration (${e.message.split("\n")[0]})`);continue;}
  const a=d.data.attributes;
  console.log(`\n=== appInfo ${state} — declaration ${d.data.id} ===`);
  for(const [k,v] of Object.entries(a)) if(v!==null&&v!==undefined&&v!==false&&v!=="NONE") console.log(`  ${k}: ${JSON.stringify(v)}`);
  const adKeys=Object.keys(a).filter(k=>/ad(vert)?/i.test(k));
  console.log(`  [advertising-like keys: ${adKeys.map(k=>k+"="+JSON.stringify(a[k])).join(", ")||"none"}]`);
  if(!process.env.SET) continue;
  const attrs={};
  for(const pair of process.env.SET.split(",")){const [k,v]=pair.split("=");if(!k)continue;attrs[k.trim()]=v==="true"?true:v==="false"?false:v;}
  if(!/PREPARE|REJECT|INVALID/.test(state)){console.log("  not an editable appInfo, skipped");continue;}
  if(DRY){console.log("  dry run: would set",JSON.stringify(attrs));continue;}
  await api("PATCH",`/ageRatingDeclarations/${d.data.id}`,{data:{type:"ageRatingDeclarations",id:d.data.id,attributes:attrs}});
  console.log("  written:",JSON.stringify(attrs));
}
