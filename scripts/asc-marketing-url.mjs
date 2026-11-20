/* YaSalam studio — check (and fix) the App Store "Marketing URL" of every app, in every language.
   AdMob finds app-ads.txt through this field: it takes the host of the Marketing URL and reads
   https://<host>/app-ads.txt (ours: https://bukhaa0s-cyber.github.io/app-ads.txt).

   Environment:
     ASC_KEY_ID, ASC_ISSUER_ID, ASC_KEY_P8_BASE64   the API key (works for every app on the account)
     DRY_RUN   "1" to report and change nothing
   Versions Apple has locked (waiting for review, in review, live) are reported and skipped, not forced;
   the right URL then goes out with the next version.
*/
import { createSign } from "node:crypto";

const API = "https://api.appstoreconnect.apple.com/v1";
const need = k => { const v = process.env[k]; if (!v) throw new Error("missing " + k); return v; };
const DRY = process.env.DRY_RUN === "1";

/* bundle id → the app's own page on the developer site (same host for all, which is what AdMob needs) */
const APPS = {
  "com.bukhari.nabeeh": "https://bukhaa0s-cyber.github.io/nabeeh/",
  "com.bukhari.rifq": "https://bukhaa0s-cyber.github.io/rifq-app/",
  "com.bukhari.pulsenexus": "https://bukhaa0s-cyber.github.io/pulse-nexus-site/",
};
const HOST = "bukhaa0s-cyber.github.io";

const kid = need("ASC_KEY_ID"), iss = need("ASC_ISSUER_ID");
const pem = Buffer.from(need("ASC_KEY_P8_BASE64"), "base64").toString("utf8").trim();
const now = Math.floor(Date.now() / 1000), b64 = o => Buffer.from(JSON.stringify(o)).toString("base64url");
const head = `${b64({ alg: "ES256", kid, typ: "JWT" })}.${b64({ iss, iat: now, exp: now + 1200, aud: "appstoreconnect-v1" })}`;
const JWT = `${head}.${createSign("SHA256").update(head).sign({ key: pem, dsaEncoding: "ieee-p1363" }).toString("base64url")}`;

async function api(method, url, body) {
  const r = await fetch(url.startsWith("http") ? url : API + url, {
    method, headers: { Authorization: "Bearer " + JWT, ...(body ? { "Content-Type": "application/json" } : {}) },
    body: body ? JSON.stringify(body) : undefined });
  if (r.status === 204) return null;
  const text = await r.text(); let j = null; try { j = text ? JSON.parse(text) : null; } catch {}
  if (!r.ok) throw new Error(`${method} ${url.replace(API, "")} → ${r.status}\n${j?.errors?.map(e => `${e.title}: ${e.detail}`).join("\n") || text.slice(0, 400)}`);
  return j;
}
const hostOf = u => { try { return new URL(u).host; } catch { return ""; } };

/* the file itself */
try {
  const r = await fetch(`https://${HOST}/app-ads.txt`);
  const t = (await r.text()).trim();
  console.log(`app-ads.txt (${r.status}): ${t}`);
} catch (e) { console.log("app-ads.txt not reachable:", e.message); }

let bad = 0;
for (const [bundle, want] of Object.entries(APPS)) {
  const apps = (await api("GET", `/apps?filter[bundleId]=${bundle}`)).data;
  if (!apps.length) { console.log(`\n## ${bundle}: not found on App Store Connect`); continue; }
  const app = apps[0];
  console.log(`\n## ${app.attributes.name} (${bundle}, id ${app.id})`);
  const vs = (await api("GET", `/apps/${app.id}/appStoreVersions?filter[platform]=IOS&limit=10`)).data;
  for (const v of vs) {
    const tag = `${v.attributes.versionString} [${v.attributes.appStoreState}]`;
    const locs = (await api("GET", `/appStoreVersions/${v.id}/appStoreVersionLocalizations?limit=50`)).data;
    for (const l of locs) {
      const cur = l.attributes.marketingUrl || "";
      const ok = hostOf(cur) === HOST;
      if (ok) { console.log(`${tag} ${l.attributes.locale}: OK ${cur}`); continue; }
      bad++;
      if (DRY) { console.log(`${tag} ${l.attributes.locale}: MISSING/WRONG "${cur || "(none)"}" — would set ${want}`); continue; }
      try {
        await api("PATCH", `/appStoreVersionLocalizations/${l.id}`, { data: { type: "appStoreVersionLocalizations", id: l.id, attributes: { marketingUrl: want } } });
        console.log(`${tag} ${l.attributes.locale}: FIXED "${cur || "(none)"}" → ${want}`);
      } catch (e) { console.log(`${tag} ${l.attributes.locale}: LOCKED "${cur || "(none)"}" — goes out with the next version (${e.message.split("\n").slice(-1)[0]})`); }
    }
  }
}
console.log(`\n${bad ? bad + " language entries were missing or wrong (see above)" : "every language already points at " + HOST}`);
