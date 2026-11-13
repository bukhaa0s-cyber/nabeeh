/* Nabeeh — Google Play Developer API from GitHub Actions, with no key file.
   The workflow signs in through Workload Identity Federation (google-github-actions/auth) and passes a short-lived
   access token in PLAY_TOKEN.

   ACTION=publish   upload AAB to TRACK as release VERSION (status STATUS: draft|completed), notes from
                    store/release-notes.json
   ACTION=status    print the tracks and the one-time products
   ACTION=price     set PRODUCT's price to PRICE (in CURRENCY, default SAR); other countries are converted by Google
   Environment: PLAY_TOKEN, PACKAGE (default com.bukhari.nabeeh), and the ones above. DRY_RUN=1 reports only. */
import { readFile } from "node:fs/promises";
import path from "node:path";

const API = "https://androidpublisher.googleapis.com/androidpublisher/v3/applications";
const UP = "https://androidpublisher.googleapis.com/upload/androidpublisher/v3/applications";
const TOKEN = need("PLAY_TOKEN"), PKG = process.env.PACKAGE || "com.bukhari.nabeeh";
const ACTION = process.env.ACTION || "status", DRY = process.env.DRY_RUN === "1";
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
function need(k) { const v = process.env[k]; if (!v) throw new Error(`missing ${k}`); return v; }
async function api(method, url, body, type) {
  const r = await fetch(url, { method, headers: { Authorization: "Bearer " + TOKEN, "Content-Type": type || "application/json" },
    body: body == null ? undefined : (type ? body : JSON.stringify(body)) });
  const t = await r.text(); let j = {}; try { j = t ? JSON.parse(t) : {}; } catch { j = { raw: t.slice(0, 400) }; }
  if (!r.ok) { const e = new Error(`${method} ${url.replace(/^https:\/\/[^/]+/, "")} → ${r.status} ${JSON.stringify(j.error || j).slice(0, 700)}`); e.status = r.status; throw e; }
  return j;
}
const edit = async () => (await api("POST", `${API}/${PKG}/edits`, {})).id;
const drop = id => api("DELETE", `${API}/${PKG}/edits/${id}`).catch(() => {});

async function status() {
  const id = await edit();
  try {
    const tr = await api("GET", `${API}/${PKG}/edits/${id}/tracks`);
    for (const t of tr.tracks || []) {
      console.log(`track ${t.track}:`);
      for (const r of t.releases || []) console.log(`  ${r.name || "-"} [${r.status}] versionCodes ${(r.versionCodes || []).join(",")}${r.userFraction ? " " + r.userFraction : ""}`);
    }
  } finally { await drop(id); }
  try {
    const p = await api("GET", `${API}/${PKG}/oneTimeProducts`);
    for (const x of p.oneTimeProducts || []) console.log(`one-time product ${x.productId}: ${JSON.stringify(x.purchaseOptions?.map(o => ({ id: o.purchaseOptionId, state: o.state, regions: (o.regionalPricingAndAvailabilityConfigs || []).filter(c => c.regionCode === "SA").map(c => c.price) })) || []).slice(0, 600)}`);
  } catch (e) { console.log("one-time products:", e.message); }
  try {
    const p = await api("GET", `${API}/${PKG}/inappproducts`);
    for (const x of p.inappproduct || []) console.log(`in-app product ${x.sku} [${x.status}] default ${x.defaultPrice?.priceMicros / 1e6} ${x.defaultPrice?.currency}; SA ${x.prices?.SA ? x.prices.SA.priceMicros / 1e6 + " " + x.prices.SA.currency : "-"}`);
  } catch (e) { console.log("in-app products:", e.message); }
}

async function publish() {
  const AAB = need("AAB"), TRACK = need("TRACK"), VERSION = need("VERSION"), STATUS = process.env.STATUS || "completed";
  const notes = JSON.parse(await readFile(path.join(ROOT, "store/release-notes.json"), "utf8"))[VERSION] || {};
  const releaseNotes = Object.entries(notes).map(([language, text]) => ({ language, text: text.length > 500 ? text.slice(0, 497) + "…" : text }));
  const id = await edit();
  try {
    const bytes = await readFile(AAB);
    console.log(`uploading ${path.basename(AAB)} (${(bytes.length / 1048576).toFixed(1)} MB)…`);
    const b = await api("POST", `${UP}/${PKG}/edits/${id}/bundles?uploadType=media`, bytes, "application/octet-stream");
    console.log(`bundle accepted: versionCode ${b.versionCode}`);
    const rel = { name: VERSION, versionCodes: [String(b.versionCode)], status: STATUS, releaseNotes };
    await api("PUT", `${API}/${PKG}/edits/${id}/tracks/${TRACK}`, { track: TRACK, releases: [rel] });
    console.log(`release ${VERSION} set on track ${TRACK} (${STATUS}), notes: ${releaseNotes.map(n => n.language).join(", ") || "none"}`);
    if (DRY) { console.log("DRY_RUN: not committed"); await drop(id); return; }
    try { await api("POST", `${API}/${PKG}/edits/${id}:commit`); }
    catch (e) {
      /* an app that Google has not published yet only accepts draft releases */
      if (STATUS !== "draft" && /draft/i.test(e.message)) {
        console.log("Google only accepts a draft release here; saving it as a draft instead");
        await api("PUT", `${API}/${PKG}/edits/${id}/tracks/${TRACK}`, { track: TRACK, releases: [{ ...rel, status: "draft" }] });
        await api("POST", `${API}/${PKG}/edits/${id}:commit`);
      } else throw e;
    }
    console.log("committed: the release is on Google Play");
  } catch (e) { await drop(id); throw e; }
}

async function price() {
  const PRODUCT = process.env.PRODUCT || "nabeeh.full", PRICE = Number(need("PRICE")), CUR = process.env.CURRENCY || "SAR";
  const micros = String(Math.round(PRICE * 1e6));
  /* the current API: one-time products with purchase options and regional prices */
  let p = null;
  try { p = await api("GET", `${API}/${PKG}/oneTimeProducts/${PRODUCT}`); } catch (e) { console.log("one-time product read:", e.message); }
  if (p && p.purchaseOptions) {
    const units = Math.floor(PRICE), nanos = Math.round((PRICE - units) * 1e9);
    for (const o of p.purchaseOptions) for (const c of o.regionalPricingAndAvailabilityConfigs || [])
      if (c.regionCode === "SA") { console.log(`SA before: ${JSON.stringify(c.price)}`); c.price = { currencyCode: CUR, units: String(units), nanos }; }
    if (DRY) { console.log("DRY_RUN: nothing changed"); return; }
    const out = await api("PATCH", `${API}/${PKG}/oneTimeProducts/${PRODUCT}?updateMask=purchaseOptions&regionsVersion.version=2022/02&allowMissing=false`, p);
    const sa = (out.purchaseOptions || []).flatMap(o => o.regionalPricingAndAvailabilityConfigs || []).find(c => c.regionCode === "SA");
    console.log(`SA after: ${JSON.stringify(sa && sa.price)}`);
    return;
  }
  /* older products: the in-app products API */
  const x = await api("GET", `${API}/${PKG}/inappproducts/${PRODUCT}`);
  console.log(`before: default ${x.defaultPrice?.priceMicros / 1e6} ${x.defaultPrice?.currency}; SA ${x.prices?.SA ? x.prices.SA.priceMicros / 1e6 : "-"}`);
  if (x.defaultPrice?.currency === CUR) x.defaultPrice.priceMicros = micros;
  x.prices = x.prices || {}; x.prices.SA = { priceMicros: micros, currency: CUR };
  if (DRY) { console.log("DRY_RUN: nothing changed"); return; }
  const y = await api("PATCH", `${API}/${PKG}/inappproducts/${PRODUCT}?autoConvertMissingPrices=true`, x);
  console.log(`after: default ${y.defaultPrice?.priceMicros / 1e6} ${y.defaultPrice?.currency}; SA ${y.prices?.SA ? y.prices.SA.priceMicros / 1e6 : "-"}`);
}

/* create the "remove ads" one-time product (one purchase option, Saudi Arabia, PRICE SAR) and activate it */
async function createProduct() {
  const PRODUCT = process.env.PRODUCT || "nabeeh.full", PRICE = Number(need("PRICE")), CUR = process.env.CURRENCY || "SAR";
  const units = Math.floor(PRICE), nanos = Math.round((PRICE - units) * 1e9);
  try { const x = await api("GET", `${API}/${PKG}/oneTimeProducts/${PRODUCT}`); console.log(`already exists: ${JSON.stringify(x).slice(0, 400)}`); return; }
  catch (e) { if (e.status !== 404) throw e; }
  const body = {
    packageName: PKG, productId: PRODUCT,
    listings: [
      { languageCode: "ar", title: "إزالة الإعلانات", description: "شراء واحد يزيل الإعلانات من نبيه للأبد. كل الأسئلة والاختبارات مجانية أصلًا." },
      { languageCode: "en-US", title: "Remove ads", description: "One purchase removes the ads from Nabeeh for good. Every question and test is already free." }
    ],
    purchaseOptions: [{
      purchaseOptionId: "remove-ads",
      buyOption: { legacyCompatible: true, multiQuantityEnabled: false },
      regionalPricingAndAvailabilityConfigs: [{ regionCode: "SA", price: { currencyCode: CUR, units: String(units), nanos }, availability: "AVAILABLE" }]
    }]
  };
  if (DRY) { console.log("DRY_RUN: would create", JSON.stringify(body)); return; }
  let made = null, lastErr = null;
  for (const rv of ["2025/03", "2022/02"]) {
    try { made = await api("PATCH", `${API}/${PKG}/onetimeproducts/${PRODUCT}?allowMissing=true&updateMask=listings,purchaseOptions&regionsVersion.version=${encodeURIComponent(rv)}`, body); break; }
    catch (e) { lastErr = e; console.log(`create with regions ${rv}: ${e.message}`); }
  }
  if (!made) throw lastErr;
  console.log(`created ${PRODUCT}: ${JSON.stringify(made.purchaseOptions?.map(o => ({ id: o.purchaseOptionId, state: o.state })))}`);
  const act = await api("POST", `${API}/${PKG}/oneTimeProducts/${PRODUCT}/purchaseOptions:batchUpdateStates`, {
    requests: [{ activatePurchaseOptionRequest: { packageName: PKG, productId: PRODUCT, purchaseOptionId: "remove-ads" } }] });
  const after = await api("GET", `${API}/${PKG}/oneTimeProducts/${PRODUCT}`);
  console.log(`after activation: ${JSON.stringify(after.purchaseOptions?.map(o => ({ id: o.purchaseOptionId, state: o.state, sa: (o.regionalPricingAndAvailabilityConfigs || []).find(c => c.regionCode === "SA") })))}`);
}

/* create every product listed in SPEC (a play-products/*.json file): prices in every region come from Google's own
   conversion of the base price (plus the exact base price in Saudi Arabia when the base currency is SAR) */
const money = (cur, amount) => { const u = Math.floor(amount); return { currencyCode: cur, units: String(u), nanos: Math.round((amount - u) * 1e9) }; };
async function createProducts() {
  const spec = JSON.parse(await readFile(path.join(ROOT, need("SPEC")), "utf8"));
  if (spec.package !== PKG) throw new Error(`SPEC is for ${spec.package}, PACKAGE is ${PKG}`);
  const have = new Set(((await api("GET", `${API}/${PKG}/oneTimeProducts`).catch(() => ({}))).oneTimeProducts || []).map(x => x.productId));
  for (const p of spec.products) {
    if (have.has(p.id)) { console.log(`${p.id}: already exists`); continue; }
    const base = money(p.currency || spec.currency, p.price);
    const conv = await api("POST", `${API}/${PKG}/pricing:convertRegionPrices`, { price: base });
    const regions = Object.values(conv.convertedRegionPrices || {}).map(r => ({ regionCode: r.regionCode, price: r.price, availability: "AVAILABLE" }));
    if (base.currencyCode === "SAR") { const sa = regions.find(r => r.regionCode === "SA"); if (sa) sa.price = base; else regions.push({ regionCode: "SA", price: base, availability: "AVAILABLE" }); }
    const body = { packageName: PKG, productId: p.id,
      listings: [{ languageCode: "ar", ...p.ar }, { languageCode: "en-US", ...p.en }],
      purchaseOptions: [{ purchaseOptionId: "buy", buyOption: { legacyCompatible: true, multiQuantityEnabled: false },
        regionalPricingAndAvailabilityConfigs: regions,
        ...(conv.convertedOtherRegionsPrice ? { newRegionsConfig: { usdPrice: conv.convertedOtherRegionsPrice.usdPrice, eurPrice: conv.convertedOtherRegionsPrice.eurPrice, availability: "AVAILABLE" } } : {}) }] };
    const rv = (conv.regionVersion && conv.regionVersion.version) || "2025/03";
    if (DRY) { console.log(`${p.id}: would create, ${regions.length} regions, regions version ${rv}`); continue; }
    await api("PATCH", `${API}/${PKG}/onetimeproducts/${encodeURIComponent(p.id)}?allowMissing=true&updateMask=listings,purchaseOptions&regionsVersion.version=${encodeURIComponent(rv)}`, body);
    await api("POST", `${API}/${PKG}/oneTimeProducts/${encodeURIComponent(p.id)}/purchaseOptions:batchUpdateStates`,
      { requests: [{ activatePurchaseOptionRequest: { packageName: PKG, productId: p.id, purchaseOptionId: "buy" } }] });
    const sa = regions.find(r => r.regionCode === "SA"), us = regions.find(r => r.regionCode === "US");
    console.log(`${p.id}: created and active in ${regions.length} regions (SA ${sa ? sa.price.units + "." + String(sa.price.nanos).padStart(9, "0").slice(0, 2) + " " + sa.price.currencyCode : "-"}, US ${us ? us.price.units + "." + String(us.price.nanos).padStart(9, "0").slice(0, 2) + " " + us.price.currencyCode : "-"})`);
  }
}

if (ACTION === "status") await status();
else if (ACTION === "create-products") await createProducts();
else if (ACTION === "create-product") await createProduct();
else if (ACTION === "publish") await publish();
else if (ACTION === "price") await price();
else throw new Error("unknown ACTION " + ACTION);
