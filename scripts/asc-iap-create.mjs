/* Nabeeh — list every in-app purchase and subscription of the app, and create a one-time (non-consumable)
   purchase if it is missing: name, Arabic + English text, availability, then its price via asc-iap-price.mjs.

   Environment:
     ASC_KEY_ID, ASC_ISSUER_ID, ASC_KEY_P8_BASE64   the API key
     APP_ID      App Store app id (default: Nabeeh)
     PRODUCT     product id to create (e.g. nabeeh.plus); empty = only list
     NAME        reference name in App Store Connect
     AR_NAME, AR_DESC, EN_NAME, EN_DESC   what buyers see (name ≤ 30, description ≤ 45 characters)
     TERRITORIES comma-separated App Store territory codes it is sold in (default: SAU)
     DRY_RUN     "1" to report and change nothing */
import { createSign } from "node:crypto";
const API = "https://api.appstoreconnect.apple.com";
const APP_ID = process.env.APP_ID || "6826632743";
const PRODUCT = process.env.PRODUCT || "";
const DRY = process.env.DRY_RUN === "1";
const need = k => { const v = process.env[k]; if (!v) throw new Error(`missing ${k}`); return v; };
function token() {
  const kid = need("ASC_KEY_ID"), iss = need("ASC_ISSUER_ID");
  const pem = Buffer.from(need("ASC_KEY_P8_BASE64"), "base64").toString("utf8").trim();
  const now = Math.floor(Date.now() / 1000), b64 = o => Buffer.from(JSON.stringify(o)).toString("base64url");
  const body = `${b64({ alg: "ES256", kid, typ: "JWT" })}.${b64({ iss, iat: now, exp: now + 1200, aud: "appstoreconnect-v1" })}`;
  return `${body}.${createSign("SHA256").update(body).sign({ key: pem, dsaEncoding: "ieee-p1363" }).toString("base64url")}`;
}
const JWT = token();
async function api(method, path, body) {
  const r = await fetch(path.startsWith("http") ? path : API + path, { method,
    headers: { Authorization: "Bearer " + JWT, "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
  const t = await r.text(); const j = t ? JSON.parse(t) : {};
  if (!r.ok) throw new Error(`${method} ${path} → ${r.status} ${JSON.stringify(j.errors || j).slice(0, 700)}`);
  return j;
}

console.log("== one-time purchases");
const iaps = await api("GET", `/v1/apps/${APP_ID}/inAppPurchasesV2?limit=50`);
for (const i of iaps.data) console.log(`  ${i.attributes.productId} · ${i.attributes.inAppPurchaseType} · ${i.attributes.state} · "${i.attributes.name}"`);
console.log("== subscriptions");
try {
  const groups = await api("GET", `/v1/apps/${APP_ID}/subscriptionGroups?limit=20`);
  for (const g of groups.data) {
    const subs = await api("GET", `/v1/subscriptionGroups/${g.id}/subscriptions?limit=50`);
    for (const s of subs.data) console.log(`  [${g.attributes.referenceName}] ${s.attributes.productId} · ${s.attributes.subscriptionPeriod} · ${s.attributes.state} · "${s.attributes.name}"`);
  }
  if (!groups.data.length) console.log("  (none)");
} catch (e) { console.log("  could not read subscriptions:", e.message); }

if (!PRODUCT) process.exit(0);
let iap = iaps.data.find(i => i.attributes.productId === PRODUCT);
if (iap) { console.log(`${PRODUCT} already exists (${iap.attributes.state})`); }
else {
  if (DRY) { console.log(`DRY_RUN: would create ${PRODUCT}`); process.exit(0); }
  const made = await api("POST", "/v2/inAppPurchases", { data: { type: "inAppPurchases",
    attributes: { name: need("NAME"), productId: PRODUCT, inAppPurchaseType: "NON_CONSUMABLE", familySharable: false },
    relationships: { app: { data: { type: "apps", id: APP_ID } } } } });
  iap = made.data; console.log(`created ${PRODUCT}: ${iap.id}`);
}
/* text buyers see */
const have = await api("GET", `/v2/inAppPurchases/${iap.id}/inAppPurchaseLocalizations?limit=20`);
for (const [locale, n, d] of [["ar-SA", "AR_NAME", "AR_DESC"], ["en-US", "EN_NAME", "EN_DESC"]]) {
  const attrs = { name: need(n), description: need(d) };
  const cur = have.data.find(l => l.attributes.locale === locale);
  if (cur) await api("PATCH", `/v1/inAppPurchaseLocalizations/${cur.id}`, { data: { type: "inAppPurchaseLocalizations", id: cur.id, attributes: attrs } });
  else await api("POST", "/v1/inAppPurchaseLocalizations", { data: { type: "inAppPurchaseLocalizations", attributes: { locale, ...attrs },
    relationships: { inAppPurchaseV2: { data: { type: "inAppPurchases", id: iap.id } } } } });
  console.log(`  ${locale}: ${attrs.name} — ${attrs.description}`);
}
/* where it is sold */
const terr = (process.env.TERRITORIES || "SAU").split(",").map(s => s.trim()).filter(Boolean);
try {
  await api("POST", "/v1/inAppPurchaseAvailabilities", { data: { type: "inAppPurchaseAvailabilities", attributes: { availableInNewTerritories: false },
    relationships: { inAppPurchase: { data: { type: "inAppPurchases", id: iap.id } }, availableTerritories: { data: terr.map(id => ({ type: "territories", id })) } } } });
  console.log(`  available in: ${terr.join(", ")}`);
} catch (e) { console.log("  availability:", e.message); }
const after = await api("GET", `/v2/inAppPurchases/${iap.id}`);
console.log(`${PRODUCT} state: ${after.data.attributes.state}`);
