/* Nabeeh — set the App Store price of the "remove ads" purchase (nabeeh.full).

   Runs in GitHub Actions so the API key stays in the repository secrets.
   Environment:
     ASC_KEY_ID, ASC_ISSUER_ID, ASC_KEY_P8_BASE64   the API key
     APP_ID      App Store app id          (default: Nabeeh)
     PRODUCT     product id                (default: nabeeh.full)
     TERRITORY   base territory            (default: SAU)
     PRICE       customer price in that territory's currency, e.g. 9.99 (required)
     DRY_RUN     "1" to report and change nothing

   It prints the current price, finds Apple's price point that equals PRICE in TERRITORY, and makes it the
   price from today (a new price schedule with TERRITORY as the base; other territories follow Apple's
   equalisation). Prints the price again afterwards. */
import { createSign } from "node:crypto";

const API = "https://api.appstoreconnect.apple.com";
const APP_ID = process.env.APP_ID || "6826632743";
const PRODUCT = process.env.PRODUCT || "nabeeh.full";
const TERR = process.env.TERRITORY || "SAU";
const PRICE = need("PRICE");
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
const JWT = token();
async function api(method, path, body) {
  const r = await fetch(path.startsWith("http") ? path : API + path, {
    method, headers: { Authorization: "Bearer " + JWT, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined });
  const t = await r.text(); const j = t ? JSON.parse(t) : {};
  if (!r.ok) throw new Error(`${method} ${path} → ${r.status} ${JSON.stringify(j.errors || j).slice(0, 600)}`);
  return j;
}
const same = (a, b) => Math.abs(parseFloat(a) - parseFloat(b)) < 0.001;

async function current(iapId) {
  try {
    const j = await api("GET", `/v1/inAppPurchasePriceSchedules/${iapId}/manualPrices?include=inAppPurchasePricePoint,territory&limit=50`);
    const pts = new Map((j.included || []).filter(x => x.type === "inAppPurchasePricePoints").map(x => [x.id, x.attributes]));
    for (const p of j.data) {
      const pp = pts.get(p.relationships?.inAppPurchasePricePoint?.data?.id) || {};
      const terr = p.relationships?.territory?.data?.id || "?";
      console.log(`  ${terr}: ${pp.customerPrice ?? "?"} (proceeds ${pp.proceeds ?? "?"}) from ${p.attributes?.startDate || "now"}${p.attributes?.endDate ? " to " + p.attributes.endDate : ""}`);
    }
    if (!j.data.length) console.log("  (no manual prices)");
  } catch (e) { console.log("  could not read the current price:", e.message); }
}

const list = await api("GET", `/v1/apps/${APP_ID}/inAppPurchasesV2?filter[productId]=${encodeURIComponent(PRODUCT)}`);
const iap = list.data[0];
if (!iap) throw new Error(`no in-app purchase ${PRODUCT}`);
console.log(`${PRODUCT} (${iap.attributes.inAppPurchaseType}, ${iap.attributes.state})`);
console.log("price now:"); await current(iap.id);

/* Apple's price points for this purchase in the territory; find the one equal to PRICE */
let next = `/v2/inAppPurchases/${iap.id}/pricePoints?filter[territory]=${TERR}&limit=200`, point = null, near = [];
while (next && !point) {
  const j = await api("GET", next);
  for (const p of j.data) {
    if (same(p.attributes.customerPrice, PRICE)) { point = p; break; }
    near.push(p.attributes.customerPrice);
  }
  next = j.links?.next || null;
}
if (!point) {
  const n = near.map(Number).sort((a, b) => Math.abs(a - PRICE) - Math.abs(b - PRICE)).slice(0, 6);
  throw new Error(`no price point of ${PRICE} in ${TERR}; nearest: ${n.join(", ")}`);
}
console.log(`price point for ${PRICE} in ${TERR}: ${point.id} (proceeds ${point.attributes.proceeds})`);
if (DRY) { console.log("DRY_RUN: nothing changed"); process.exit(0); }

await api("POST", "/v1/inAppPurchasePriceSchedules", {
  data: {
    type: "inAppPurchasePriceSchedules",
    relationships: {
      inAppPurchase: { data: { type: "inAppPurchases", id: iap.id } },
      baseTerritory: { data: { type: "territories", id: TERR } },
      manualPrices: { data: [{ type: "inAppPurchasePrices", id: "${newprice}" }] }
    }
  },
  included: [{
    type: "inAppPurchasePrices", id: "${newprice}",
    attributes: { startDate: null },
    relationships: { inAppPurchasePricePoint: { data: { type: "inAppPurchasePricePoints", id: point.id } } }
  }]
});
console.log("price schedule saved");
console.log("price after:"); await current(iap.id);
