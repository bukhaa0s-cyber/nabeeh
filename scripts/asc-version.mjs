/* Nabeeh — create (or reuse) an App Store version and write its release notes.

   Environment:
     ASC_KEY_ID, ASC_ISSUER_ID, ASC_KEY_P8_BASE64   the API key
     APP_ID      App Store app id      (default: Nabeeh)
     VERSION     version string, e.g. 1.3 (required)
     PROMO       "1" to also refresh the promotional text from store/promo.json
     DRY_RUN     "1" to report and change nothing
   Release notes come from store/release-notes.json, keyed by version then locale.
*/
import { createSign } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const API = "https://api.appstoreconnect.apple.com/v1";
const APP_ID = process.env.APP_ID || "6826632743";
const need = k => { const v = process.env[k]; if (!v) throw new Error("missing " + k); return v; };
const VERSION = need("VERSION");
const DRY = process.env.DRY_RUN === "1";
const PROMO = process.env.PROMO === "1";

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

const notes = JSON.parse(await readFile(path.join(ROOT, "store/release-notes.json"), "utf8"))[VERSION];
if (!notes) throw new Error(`no release notes for ${VERSION} in store/release-notes.json`);
let promo = {};
if (PROMO) { try { promo = JSON.parse(await readFile(path.join(ROOT, "store/promo.json"), "utf8"))[VERSION] || {}; } catch {} }

const EDITABLE = ["PREPARE_FOR_SUBMISSION", "DEVELOPER_REJECTED", "REJECTED", "METADATA_REJECTED", "INVALID_BINARY"];

const vs = await api("GET", `/apps/${APP_ID}/appStoreVersions?filter[platform]=IOS&limit=20`);
let v = vs.data.find(x => x.attributes.versionString === VERSION);
if (v) console.log(`version ${VERSION} already exists: ${v.attributes.appStoreState}`);
else {
  const open = vs.data.find(x => EDITABLE.includes(x.attributes.appStoreState));
  if (open) throw new Error(`version ${open.attributes.versionString} is still editable (${open.attributes.appStoreState}) — finish or delete it first`);
  if (DRY) { console.log(`dry run: would create version ${VERSION}`); process.exit(0); }
  v = (await api("POST", "/appStoreVersions", { data: { type: "appStoreVersions",
    attributes: { platform: "IOS", versionString: VERSION, releaseType: "AFTER_APPROVAL" },
    relationships: { app: { data: { type: "apps", id: APP_ID } } } } })).data;
  console.log(`created version ${VERSION}`);
}
if (!EDITABLE.includes(v.attributes.appStoreState)) { console.log(`version ${VERSION} is ${v.attributes.appStoreState} — not editable, nothing written`); process.exit(0); }

const locs = await api("GET", `/appStoreVersions/${v.id}/appStoreVersionLocalizations?limit=50`);
for (const loc of locs.data) {
  const l = loc.attributes.locale, text = notes[l];
  if (!text) { console.log(`  ${l}: no release notes, left alone`); continue; }
  const attrs = { whatsNew: text };
  if (PROMO && promo[l]) attrs.promotionalText = promo[l];
  if (DRY) { console.log(`  ${l}: would write ${Object.keys(attrs).join(", ")}`); continue; }
  await api("PATCH", `/appStoreVersionLocalizations/${loc.id}`, { data: { type: "appStoreVersionLocalizations", id: loc.id, attributes: attrs } });
  console.log(`  ${l}: ${Object.keys(attrs).join(" + ")} written`);
}
console.log("done");
