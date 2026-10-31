/* Nabeeh — attach a TestFlight build to an App Store version and send it to App Review.

   Runs in GitHub Actions so the API key stays in the repository secrets.
   Environment:
     ASC_KEY_ID, ASC_ISSUER_ID, ASC_KEY_P8_BASE64   the API key
     APP_ID     App Store app id         (default: Nabeeh)
     VERSION    version string, e.g. 1.2 (required)
     BUILD      build number, e.g. 16    (default: the newest valid build of that version)
     IAP        product ids to submit with it, comma separated (default: nabeeh.full)
     DRY_RUN    "1" to report and change nothing
*/
import { createSign } from "node:crypto";

const API = "https://api.appstoreconnect.apple.com/v1";
const APP_ID = process.env.APP_ID || "6826632743";
const VERSION = need("VERSION");
const BUILD = process.env.BUILD || "";
const IAPS = (process.env.IAP ?? "nabeeh.full").split(",").map(s => s.trim()).filter(Boolean);
const DRY = process.env.DRY_RUN === "1";

function need(k) { const v = process.env[k]; if (!v) throw new Error(`missing ${k}`); return v; }
function token() {
  const kid = need("ASC_KEY_ID"), iss = need("ASC_ISSUER_ID");
  const pem = Buffer.from(need("ASC_KEY_P8_BASE64"), "base64").toString("utf8").trim();
  const now = Math.floor(Date.now() / 1000);
  const b64 = o => Buffer.from(JSON.stringify(o)).toString("base64url");
  const body = `${b64({ alg: "ES256", kid, typ: "JWT" })}.${b64({ iss, iat: now, exp: now + 1200, aud: "appstoreconnect-v1" })}`;
  return `${body}.${createSign("SHA256").update(body).sign({ key: pem, dsaEncoding: "ieee-p1363" }).toString("base64url")}`;
}
let JWT = "";
async function api(method, url, body) {
  const r = await fetch(url.startsWith("http") ? url : API + url, {
    method, headers: { Authorization: `Bearer ${JWT}`, ...(body ? { "Content-Type": "application/json" } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (r.status === 204) return null;
  const text = await r.text(); let json = null; try { json = text ? JSON.parse(text) : null; } catch {}
  if (!r.ok) throw new Error(`${method} ${url.replace(API, "")} → ${r.status}\n${json?.errors?.map(e => `${e.title}: ${e.detail}`).join("\n") || text.slice(0, 500)}`);
  return json;
}
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function main() {
  JWT = token();

  const vs = await api("GET", `/apps/${APP_ID}/appStoreVersions?filter[platform]=IOS&filter[versionString]=${VERSION}&include=build`);
  const v = vs.data[0];
  if (!v) throw new Error(`no App Store version ${VERSION}`);
  console.log(`version ${VERSION}: ${v.attributes.appStoreState} (release: ${v.attributes.releaseType})`);

  /* the build: wait for Apple to finish processing it */
  let build = null;
  for (let round = 0; round < 40 && !build; round++) {
    const q = `/builds?filter[app]=${APP_ID}&filter[preReleaseVersion.version]=${VERSION}` + (BUILD ? `&filter[version]=${BUILD}` : "") + `&sort=-uploadedDate&limit=10`;
    const bs = await api("GET", q);
    const list = bs.data.map(b => `${b.attributes.version}:${b.attributes.processingState}`).join(", ");
    build = bs.data.find(b => b.attributes.processingState === "VALID" && !b.attributes.expired);
    if (!build) { console.log(`  waiting for a processed build (${list || "none yet"})`); await sleep(30000); }
  }
  if (!build) throw new Error("no processed build found");
  console.log(`build ${build.attributes.version} is ready`);

  if (DRY) { console.log("dry run: would attach the build and submit for review"); return; }

  /* a version still waiting in review is locked; with WITHDRAW=1 pull it back first, only now that the new build is ready */
  if (["WAITING_FOR_REVIEW", "IN_REVIEW"].includes(v.attributes.appStoreState)) {
    if (process.env.WITHDRAW !== "1") throw new Error(`version ${VERSION} is ${v.attributes.appStoreState}; run again with withdraw to pull it back`);
    const subs = await api("GET", `/reviewSubmissions?filter[app]=${APP_ID}&filter[platform]=IOS&filter[state]=WAITING_FOR_REVIEW,IN_REVIEW&limit=5`);
    for (const s of subs.data) {
      await api("PATCH", `/reviewSubmissions/${s.id}`, { data: { type: "reviewSubmissions", id: s.id, attributes: { canceled: true } } });
      console.log(`withdrew review submission from ${s.attributes.submittedDate}`);
    }
    for (let round = 0; round < 30; round++) {
      const st = (await api("GET", `/appStoreVersions/${v.id}`)).data.attributes.appStoreState;
      if (!["WAITING_FOR_REVIEW", "IN_REVIEW"].includes(st)) { console.log(`version ${VERSION} is now ${st}`); break; }
      await sleep(10000);
    }
    /* the old submission needs a moment to close before a new one can open */
    for (let round = 0; round < 30; round++) {
      const left = await api("GET", `/reviewSubmissions?filter[app]=${APP_ID}&filter[platform]=IOS&filter[state]=CANCELING&limit=5`);
      if (!left.data.length) break;
      await sleep(10000);
    }
  }

  /* export compliance, in case the Info.plist answer was not picked up */
  if (build.attributes.usesNonExemptEncryption == null)
    await api("PATCH", `/builds/${build.id}`, { data: { type: "builds", id: build.id, attributes: { usesNonExemptEncryption: false } } });

  await api("PATCH", `/appStoreVersions/${v.id}/relationships/build`, { data: { type: "builds", id: build.id } });
  console.log("build attached to the version");

  /* in-app purchases with pending changes go to review alongside the version */
  for (const pid of IAPS) {
    try {
      const got = await api("GET", `/apps/${APP_ID}/inAppPurchasesV2?filter[productId]=${pid}`);
      const iap = got.data[0];
      if (!iap) { console.log(`  in-app purchase ${pid} not found`); continue; }
      console.log(`  in-app purchase ${pid}: ${iap.attributes.state}`);
      if (["READY_TO_SUBMIT", "DEVELOPER_ACTION_NEEDED", "REJECTED"].includes(iap.attributes.state)) {
        await api("POST", "/inAppPurchaseSubmissions", { data: { type: "inAppPurchaseSubmissions", relationships: { inAppPurchaseV2: { data: { type: "inAppPurchases", id: iap.id } } } } });
        console.log(`  ${pid} submitted with the version`);
      }
    } catch (e) { console.log(`  in-app purchase ${pid}: ${String(e.message).split("\n").join(" | ")}`); }
  }

  /* review submission: reuse an open one, otherwise start one */
  const open = await api("GET", `/reviewSubmissions?filter[app]=${APP_ID}&filter[platform]=IOS&filter[state]=READY_FOR_REVIEW&limit=5`);
  let sub = open.data[0];
  if (!sub) sub = (await api("POST", "/reviewSubmissions", { data: { type: "reviewSubmissions", attributes: { platform: "IOS" }, relationships: { app: { data: { type: "apps", id: APP_ID } } } } })).data;
  try {
    await api("POST", "/reviewSubmissionItems", { data: { type: "reviewSubmissionItems", relationships: {
      reviewSubmission: { data: { type: "reviewSubmissions", id: sub.id } },
      appStoreVersion: { data: { type: "appStoreVersions", id: v.id } } } } });
  } catch (e) { if (!/already|ITEM_PART_OF_ANOTHER|duplicate/i.test(e.message)) throw e; console.log("  version already in the submission"); }
  await api("PATCH", `/reviewSubmissions/${sub.id}`, { data: { type: "reviewSubmissions", id: sub.id, attributes: { submitted: true } } });

  const after = await api("GET", `/appStoreVersions/${v.id}`);
  console.log(`submitted — version ${VERSION} is now ${after.data.attributes.appStoreState}`);
}
main().catch(e => { console.error(String(e.message || e)); process.exit(1); });
