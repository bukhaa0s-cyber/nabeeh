/* Nabeeh — print the App Store state of every version, the latest builds and the in-app purchase. Read-only. */
import { createSign } from "node:crypto";
const API="https://api.appstoreconnect.apple.com/v1", APP=process.env.APP_ID||"6826632743";
const need=k=>{const v=process.env[k];if(!v)throw new Error("missing "+k);return v;};
const kid=need("ASC_KEY_ID"),iss=need("ASC_ISSUER_ID"),pem=Buffer.from(need("ASC_KEY_P8_BASE64"),"base64").toString("utf8").trim();
const now=Math.floor(Date.now()/1000),b64=o=>Buffer.from(JSON.stringify(o)).toString("base64url");
const body=`${b64({alg:"ES256",kid,typ:"JWT"})}.${b64({iss,iat:now,exp:now+1200,aud:"appstoreconnect-v1"})}`;
const JWT=`${body}.${createSign("SHA256").update(body).sign({key:pem,dsaEncoding:"ieee-p1363"}).toString("base64url")}`;
const get=async u=>{const r=await fetch(API+u,{headers:{Authorization:"Bearer "+JWT}});const j=await r.json();if(!r.ok)throw new Error(JSON.stringify(j.errors));return j;};
const v=await get(`/apps/${APP}/appStoreVersions?filter[platform]=IOS&limit=5&include=build`);
for(const x of v.data){const b=x.relationships?.build?.data;const bb=b&&v.included?.find(i=>i.id===b.id);console.log(`version ${x.attributes.versionString}: ${x.attributes.appStoreState}${bb?` (build ${bb.attributes.version})`:""}${x.attributes.createdDate?"  created "+x.attributes.createdDate.slice(0,10):""}`);}
const rs=await get(`/reviewSubmissions?filter[app]=${APP}&filter[platform]=IOS&limit=3`);
for(const s of rs.data)console.log(`review submission: ${s.attributes.state} (${(s.attributes.submittedDate||"").slice(0,16)})`);
const bs=await get(`/builds?filter[app]=${APP}&sort=-uploadedDate&limit=3`);
for(const b of bs.data)console.log(`build ${b.attributes.version}: ${b.attributes.processingState} uploaded ${b.attributes.uploadedDate.slice(0,16)}`);
const iap=await get(`/apps/${APP}/inAppPurchasesV2?limit=5`);
for(const i of iap.data)console.log(`iap ${i.attributes.productId}: ${i.attributes.state}`);
const infos=await get(`/apps/${APP}/appInfos`);
for(const inf of infos.data){const loc=await get(`/appInfos/${inf.id}/appInfoLocalizations`);
 for(const l of loc.data)console.log(`name [${inf.attributes.appStoreState||inf.attributes.state}] ${l.attributes.locale}: ${l.attributes.name} | subtitle: ${l.attributes.subtitle||"-"}`);}
for(const inf of infos.data){try{const c=await get(`/appInfos/${inf.id}/primaryCategory`);console.log(`category [${inf.attributes.appStoreState||inf.attributes.state}]: ${c.data&&c.data.id}`);}catch(e){console.log("category ?",e.message);}
 try{const a=await get(`/appInfos/${inf.id}/ageRatingDeclaration`);console.log(`kidsAgeBand: ${a.data.attributes.kidsAgeBand||"none"}`);}catch(e){console.log("age ?",e.message);}}
for(const vv of v.data.slice(0,2)){try{const loc=await get(`/appStoreVersions/${vv.id}/appStoreVersionLocalizations`);
 for(const l of loc.data)console.log(`v${vv.attributes.versionString} ${l.attributes.locale} keywords: ${l.attributes.keywords||"-"}\n   promo: ${l.attributes.promotionalText||"-"}`);}catch(e){console.log("loc ?",e.message);}}
for(const vv of v.data.slice(0,2)){
 if(!/PREPARE|REJECT|INVALID/.test(vv.attributes.appStoreState))continue;
 const loc=await get(`/appStoreVersions/${vv.id}/appStoreVersionLocalizations`);
 for(const l of loc.data){
   const sets=await get(`/appStoreVersionLocalizations/${l.id}/appScreenshotSets?limit=10`);
   for(const st of sets.data){const sh=await get(`/appScreenshotSets/${st.id}/appScreenshots?limit=20`);
     const bad=sh.data.filter(x=>x.attributes.assetDeliveryState&&x.attributes.assetDeliveryState.state!=="COMPLETE").length;
     console.log(`shots v${vv.attributes.versionString} ${l.attributes.locale} ${st.attributes.screenshotDisplayType}: ${sh.data.length}${bad?` (${bad} not ready)`:""}`);}
   console.log(`notes v${vv.attributes.versionString} ${l.attributes.locale}: ${(l.attributes.whatsNew||"-").slice(0,60).replace(/\n/g," ")}…`);
 }
}
