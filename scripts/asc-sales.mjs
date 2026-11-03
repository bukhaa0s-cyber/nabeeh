/* Nabeeh — downloads and in-app purchases. Read-only.
   Path A (fast, exact): ASC_VENDOR set -> daily Sales & Trends reports since FROM.
   Path B (no vendor number): App Store Connect Analytics reports; creates a one-time
   snapshot request the first time, then reads it once Apple has generated it. */
import { createSign } from "node:crypto";
import { gunzipSync } from "node:zlib";

const API = "https://api.appstoreconnect.apple.com/v1";
const APP = process.env.APP_ID || "6826632743";
const FROM = process.env.FROM || "2026-10-24";
const VENDOR = (process.env.ASC_VENDOR || "").trim();

const need = k => { const v = process.env[k]; if (!v) throw new Error("missing " + k); return v; };
const kid = need("ASC_KEY_ID"), iss = need("ASC_ISSUER_ID");
const pem = Buffer.from(need("ASC_KEY_P8_BASE64"), "base64").toString("utf8").trim();
const now = Math.floor(Date.now() / 1000), b64 = o => Buffer.from(JSON.stringify(o)).toString("base64url");
const head = `${b64({ alg: "ES256", kid, typ: "JWT" })}.${b64({ iss, iat: now, exp: now + 1200, aud: "appstoreconnect-v1" })}`;
const JWT = `${head}.${createSign("SHA256").update(head).sign({ key: pem, dsaEncoding: "ieee-p1363" }).toString("base64url")}`;
const auth = { Authorization: "Bearer " + JWT };

const get = async u => {
  const r = await fetch(u.startsWith("http") ? u : API + u, { headers: auth });
  const j = await r.json();
  if (!r.ok) throw new Error(r.status + " " + JSON.stringify(j.errors).slice(0, 300));
  return j;
};
const post = async (u, body) => {
  const r = await fetch(API + u, { method: "POST", headers: { ...auth, "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const j = await r.json();
  if (!r.ok) throw new Error(r.status + " " + JSON.stringify(j.errors).slice(0, 300));
  return j;
};
const days = (from, to) => { const out = []; for (let d = new Date(from + "T00:00:00Z"); d <= to; d.setUTCDate(d.getUTCDate() + 1)) out.push(d.toISOString().slice(0, 10)); return out; };
const tsv = txt => { const [h, ...rows] = txt.trim().split(/\r?\n/); const k = h.split("\t"); return rows.filter(Boolean).map(r => Object.fromEntries(r.split("\t").map((v, i) => [k[i], v]))); };

/* ---------- Path A: Sales & Trends ---------- */
async function sales() {
  const yest = new Date(Date.now() - 864e5);
  const units = {}, byDay = {}, byCountry = {}, missing = [];
  for (const day of days(FROM, yest)) {
    const q = `?filter[frequency]=DAILY&filter[reportType]=SALES&filter[reportSubType]=SUMMARY&filter[vendorNumber]=${VENDOR}&filter[reportDate]=${day}`;
    const r = await fetch(API + "/salesReports" + q, { headers: { ...auth, Accept: "application/a-gzip" } });
    if (!r.ok) { missing.push(day + ":" + r.status); continue; }
    const rows = tsv(gunzipSync(Buffer.from(await r.arrayBuffer())).toString("utf8"))
      .filter(x => !APP || !x["Apple Identifier"] || x["Apple Identifier"] === APP);
    for (const x of rows) {
      const t = x["Product Type Identifier"] || "?", n = Number(x.Units || 0);
      units[t] = (units[t] || 0) + n;
      byDay[day] = byDay[day] || {}; byDay[day][t] = (byDay[day][t] || 0) + n;
      if (x["Country Code"]) byCountry[x["Country Code"]] = (byCountry[x["Country Code"]] || 0) + n;
    }
  }
  console.log("source: Sales and Trends (daily reports, vendor " + VENDOR + ")");
  console.log("window: " + FROM + " .. " + yest.toISOString().slice(0, 10));
  if (missing.length) console.log("no report for: " + missing.join(" "));
  const isIap = t => /^IA/.test(t), isUpd = t => /^(3|7|F7|F1-|1E|1EP|1EU|1EF)$/.test(t) || /^(3|7)/.test(t);
  let fresh = 0, upd = 0, iap = 0;
  for (const [t, n] of Object.entries(units)) { if (isIap(t)) iap += n; else if (isUpd(t)) upd += n; else fresh += n; }
  console.log("product type units: " + (Object.entries(units).map(([t, n]) => t + "=" + n).join("  ") || "none"));
  console.log("TOTAL first-time downloads: " + fresh);
  console.log("TOTAL updates/redownloads: " + upd);
  console.log("TOTAL in-app purchases: " + iap);
  console.log("by country: " + (Object.entries(byCountry).sort((a, b) => b[1] - a[1]).map(([c, n]) => c + "=" + n).join(" ") || "none"));
  for (const d of Object.keys(byDay).sort()) console.log("  " + d + ": " + Object.entries(byDay[d]).map(([t, n]) => t + "=" + n).join(" "));
}

/* ---------- Path B: Analytics reports ---------- */
async function analytics() {
  console.log("source: App Store Connect analytics reports (no vendor number set)");
  let reqs = [];
  for (const u of [`/analyticsReportRequests?filter[app]=${APP}&limit=50`, `/apps/${APP}/analyticsReportRequests?limit=50`]) {
    try { reqs = (await get(u)).data || []; break; } catch (e) { console.log("list " + u.split("?")[0] + ": " + e.message); }
  }
  let snap = reqs.find(r => r.attributes.accessType === "ONE_TIME_SNAPSHOT" && !r.attributes.stoppedDueToInactivity);
  const ongoing = reqs.find(r => r.attributes.accessType === "ONGOING" && !r.attributes.stoppedDueToInactivity);
  for (const r of reqs) console.log(`request ${r.id}: ${r.attributes.accessType}${r.attributes.stoppedDueToInactivity ? " (stopped)" : ""}`);
  if (!snap) {
    snap = (await post("/analyticsReportRequests", { data: { type: "analyticsReportRequests", attributes: { accessType: "ONE_TIME_SNAPSHOT", name: "nabeeh-snapshot" }, relationships: { app: { data: { type: "apps", id: APP } } } } })).data;
    console.log("created ONE_TIME_SNAPSHOT request " + snap.id + " — Apple needs up to ~48h to generate it");
  }
  if (!ongoing) {
    try { const o = (await post("/analyticsReportRequests", { data: { type: "analyticsReportRequests", attributes: { accessType: "ONGOING", name: "nabeeh-ongoing" }, relationships: { app: { data: { type: "apps", id: APP } } } } })).data; console.log("created ONGOING request " + o.id + " — daily from now on"); }
    catch (e) { console.log("ongoing request: " + e.message); }
  }
  for (const req of [snap, ...reqs.filter(r => r.id !== snap.id)]) {
    let reports = [];
    try { reports = (await get(`/analyticsReportRequests/${req.id}/reports?limit=200`)).data || []; }
    catch (e) { console.log(`reports for ${req.id}: ${e.message}`); continue; }
    console.log(`request ${req.id} (${req.attributes.accessType}): ${reports.length} reports`);
    const want = reports.filter(r => /download|install|purchas/i.test(r.attributes.name));
    for (const r of want) {
      console.log(`  report "${r.attributes.name}" [${r.attributes.category}]`);
      let inst = [];
      try { inst = (await get(`/analyticsReports/${r.id}/instances?limit=200`)).data || []; } catch (e) { console.log("   instances: " + e.message); continue; }
      const daily = inst.filter(i => i.attributes.granularity === "DAILY").sort((a, b) => (a.attributes.processingDate < b.attributes.processingDate ? 1 : -1));
      console.log(`   instances: ${inst.length} (daily ${daily.length})`);
      let total = 0, seen = 0;
      for (const i of daily) {
        let segs = [];
        try { segs = (await get(`/analyticsReportInstances/${i.id}/segments`)).data || []; } catch (e) { continue; }
        for (const s of segs) {
          const u = s.attributes.url; if (!u) continue;
          const resp = await fetch(u); if (!resp.ok) continue;
          const buf = Buffer.from(await resp.arrayBuffer());
          let txt; try { txt = gunzipSync(buf).toString("utf8"); } catch { txt = buf.toString("utf8"); }
          const rows = tsv(txt);
          const col = Object.keys(rows[0] || {}).find(k => /^(Counts|Units|Quantity|Downloads)$/i.test(k)) || Object.keys(rows[0] || {}).find(k => /count|unit|quantit/i.test(k));
          const sum = col ? rows.reduce((a, x) => a + Number(String(x[col]).replace(/,/g, "") || 0), 0) : 0;
          total += sum; seen++;
          console.log(`   ${i.attributes.processingDate}: rows=${rows.length} ${col || "?"}=${sum}`);
        }
      }
      if (seen) console.log(`   SUM "${r.attributes.name}" over ${seen} segments: ${total}`);
    }
  }
}

if (VENDOR) await sales(); else await analytics();
