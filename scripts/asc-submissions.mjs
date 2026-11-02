/* Nabeeh — inspect (and optionally clear) open App Review submissions.
   Env: ASC_KEY_ID, ASC_ISSUER_ID, ASC_KEY_P8_BASE64, APP_ID, CANCEL="1" to cancel open submissions. */
import { createSign } from "node:crypto";
const API="https://api.appstoreconnect.apple.com/v1";
const APP=process.env.APP_ID||"6826632743";
const need=k=>{const v=process.env[k];if(!v)throw new Error("missing "+k);return v;};
const kid=need("ASC_KEY_ID"),iss=need("ASC_ISSUER_ID");
const pem=Buffer.from(need("ASC_KEY_P8_BASE64"),"base64").toString("utf8").trim();
const now=Math.floor(Date.now()/1000),b64=o=>Buffer.from(JSON.stringify(o)).toString("base64url");
const head=`${b64({alg:"ES256",kid,typ:"JWT"})}.${b64({iss,iat:now,exp:now+1200,aud:"appstoreconnect-v1"})}`;
const JWT=`${head}.${createSign("SHA256").update(head).sign({key:pem,dsaEncoding:"ieee-p1363"}).toString("base64url")}`;
async function api(m,u,b){const r=await fetch(u.startsWith("http")?u:API+u,{method:m,headers:{Authorization:"Bearer "+JWT,...(b?{"Content-Type":"application/json"}:{})},body:b?JSON.stringify(b):undefined});
 if(r.status===204)return null;const t=await r.text();let j=null;try{j=t?JSON.parse(t):null;}catch{}
 if(!r.ok)throw new Error(`${m} ${u.replace(API,"")} → ${r.status}\n${j?.errors?.map(e=>`${e.title}: ${e.detail}`).join("\n")||t.slice(0,400)}`);return j;}

const subs=await api("GET",`/reviewSubmissions?filter[app]=${APP}&filter[platform]=IOS&limit=10`);
for(const s of subs.data){
  console.log(`submission ${s.id}: ${s.attributes.state} submitted=${s.attributes.submitted} (${(s.attributes.submittedDate||"").slice(0,16)})`);
  try{const items=await api("GET",`/reviewSubmissions/${s.id}/items?limit=20`);
    for(const it of items.data)console.log(`   item ${it.id}: ${it.attributes.state} ${Object.keys(it.relationships||{}).filter(k=>it.relationships[k].data).join(",")}`);
  }catch(e){console.log("   items ?",e.message.split("\n")[0]);}
  if(process.env.CANCEL==="1" && !["COMPLETE","CANCELING"].includes(s.attributes.state)){
    try{await api("PATCH",`/reviewSubmissions/${s.id}`,{data:{type:"reviewSubmissions",id:s.id,attributes:{canceled:true}}});console.log("   canceled");}
    catch(e){console.log("   cancel failed:",e.message.split("\n").join(" | "));}
  }
}
const vs=await api("GET",`/apps/${APP}/appStoreVersions?filter[platform]=IOS&limit=5`);
for(const v of vs.data)console.log(`version ${v.attributes.versionString}: ${v.attributes.appStoreState}`);
