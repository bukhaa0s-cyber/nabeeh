/* Nabeeh — Firebase: accounts, sync and activation codes. Loaded only when NB_CONFIG.firebase is set. */
(function(){
"use strict";
const C=window.NB_CONFIG,V="10.12.2";
let app=null,auth=null,db=null,current=null,ready=null;
const waiters=new Set();

function load(src){return new Promise((res,rej)=>{const s=document.createElement("script");s.src=src;s.onload=res;s.onerror=()=>rej(new Error("load "+src));document.head.appendChild(s);});}
function init(){
  if(!C.firebase||NATIVE)return Promise.resolve(false);
  if(ready)return ready;
  ready=(async()=>{
    await load(`https://www.gstatic.com/firebasejs/${V}/firebase-app-compat.js`);
    await Promise.all([load(`https://www.gstatic.com/firebasejs/${V}/firebase-auth-compat.js`),load(`https://www.gstatic.com/firebasejs/${V}/firebase-firestore-compat.js`)]);
    app=firebase.initializeApp(C.firebase);auth=firebase.auth();db=firebase.firestore();
    try{db.enablePersistence({synchronizeTabs:true}).catch(()=>{});}catch(e){}
    await new Promise(res=>{let first=true;auth.onAuthStateChanged(async u=>{current=u;if(u)await pull().catch(e=>console.warn(e));waiters.forEach(f=>f(u));if(first){first=false;res();}});});
    return true;
  })();
  return ready;
}
const userDoc=()=>db.collection("users").doc(current.uid);

async function pull(){
  const root=await userDoc().get();const kids={};
  const snap=await userDoc().collection("kids").get();snap.forEach(d=>{kids[d.id]=d.data();});
  NBStore.mergeRemote(root.exists?root.data():null,kids);
  /* first sign-in on a device that already has local progress: upload it */
  if(!root.exists){await push(NBStore.rootForCloud(),Object.fromEntries(NBStore.S.kids.map(k=>[k.id,NBStore.kidForCloud(k.id)])));}
}
async function push(root,kids){
  if(!current)return;
  const b=db.batch();
  if(root)b.set(userDoc(),Object.assign({},root,{email:current.email||null,seen:firebase.firestore.FieldValue.serverTimestamp()}),{merge:true});
  for(const [id,data] of Object.entries(kids||{}))b.set(userDoc().collection("kids").doc(id),data);
  await b.commit();
}
async function deleteKid(id){if(!current)return;try{await userDoc().collection("kids").doc(id).delete();await userDoc().set({deleted:firebase.firestore.FieldValue.arrayUnion(id)},{merge:true});}catch(e){console.warn(e);}}

/* ---------- accounts ---------- */
const errMap={"auth/invalid-email":"badEmail","auth/missing-password":"badPass","auth/weak-password":"weakPass","auth/email-already-in-use":"emailUsed",
  "auth/invalid-credential":"wrongLogin","auth/wrong-password":"wrongLogin","auth/user-not-found":"wrongLogin","auth/too-many-requests":"tooMany","auth/network-request-failed":"offline","auth/popup-closed-by-user":"cancelled"};
const wrap=p=>p.catch(e=>{const k=errMap[e.code]||"unknown";const er=new Error(k);er.code=k;er.raw=e;throw er;});
const signUp=(email,pass)=>wrap(auth.createUserWithEmailAndPassword(email.trim(),pass));
const signIn=(email,pass)=>wrap(auth.signInWithEmailAndPassword(email.trim(),pass));
const google=()=>wrap(auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()));
const reset=email=>wrap(auth.sendPasswordResetEmail(email.trim()));
const signOut=async()=>{await NBStore.flush();await auth.signOut();};

/* ---------- activation codes ----------
   codes/{CODE} = {usedBy:null|uid, usedAt, email, batch, created}. Rules allow a signed-in user to claim an unused code once,
   and allow users/{uid}.pro to be set only to a code that this same write marks as used by them. */
const norm=c=>String(c||"").toUpperCase().replace(/[^A-Z0-9]/g,"").replace(/^(NB)?/,"NB").replace(/^NB(.{4})(.{4})(.{4})$/,"NB-$1-$2-$3");
async function activate(raw){
  if(!current){const e=new Error("needLogin");e.code="needLogin";throw e;}
  const code=norm(raw);
  if(!/^NB-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(code)){const e=new Error("badCode");e.code="badCode";throw e;}
  const ref=db.collection("codes").doc(code);let snap;
  try{snap=await ref.get();}catch(e){const er=new Error("badCode");er.code="badCode";throw er;}
  if(!snap.exists){const e=new Error("badCode");e.code="badCode";throw e;}
  const d=snap.data();
  if(d.usedBy&&d.usedBy!==current.uid){const e=new Error("usedCode");e.code="usedCode";throw e;}
  const b=db.batch(),pro={code,since:Date.now()};
  if(!d.usedBy)b.update(ref,{usedBy:current.uid,usedAt:firebase.firestore.FieldValue.serverTimestamp(),email:current.email||null});
  b.set(userDoc(),{pro},{merge:true});
  await b.commit();NBStore.setPro(pro);return pro;
}
/* admin only (enforced by rules) */
const ALPH="ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
function newCode(){const r=crypto.getRandomValues(new Uint8Array(12));let s="";for(const x of r)s+=ALPH[x%ALPH.length];return `NB-${s.slice(0,4)}-${s.slice(4,8)}-${s.slice(8)}`;}
async function makeCodes(n,batchName){const out=[];let b=db.batch(),k=0;
  for(let i=0;i<n;i++){const c=newCode();out.push(c);b.set(db.collection("codes").doc(c),{usedBy:null,batch:batchName||"",created:firebase.firestore.FieldValue.serverTimestamp()});if(++k===450){await b.commit();b=db.batch();k=0;}}
  if(k)await b.commit();return out;}
async function listCodes(){const s=await db.collection("codes").get();const out=[];s.forEach(d=>out.push(Object.assign({code:d.id},d.data())));return out;}

/* the iPhone app keeps everything on the device (no accounts), so the cloud is web-only */
const NATIVE=!!(window.Capacitor&&Capacitor.isNativePlatform&&Capacitor.isNativePlatform());
window.NBCloud={init,enabled:()=>!!C.firebase&&!NATIVE,user:()=>current,onUser:f=>{waiters.add(f);return ()=>waiters.delete(f);},
  signUp,signIn,google,reset,signOut,push,pull,deleteKid,activate,makeCodes,listCodes,isAdmin:()=>!!(current&&current.emailVerified&&(C.adminEmails||[]).includes((current.email||"").toLowerCase())),norm};
})();
