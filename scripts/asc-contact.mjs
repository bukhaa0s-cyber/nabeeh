/* Nabeeh — set the App Review contact email and check the Support URL on every iOS version Apple still lets us edit.

   Environment:
     ASC_KEY_ID, ASC_ISSUER_ID, ASC_KEY_P8_BASE64   the API key
     APP_ID         App Store app id (default: Nabeeh)
     CONTACT_EMAIL  the address App Review should write to (required)
     SUPPORT_URL    the Support URL every locale should carry (optional)
     DRY_RUN        "1" to report and change nothing
   Versions Apple has locked (in review, live) are reported and skipped, not forced.
*/
import { createSign } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const API = "https://api.appstoreconnect.apple.com/v1";
const APP_ID = process.env.APP_ID || "6826632743";
const need = k => { const v = process.env[k]; if (!v) throw new Error("missing " + k); return v; };
const DRY = process.env.DRY_RUN === "1";

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

const EMAIL = need("CONTACT_EMAIL"), SUPPORT = process.env.SUPPORT_URL || "";
const vs = (await api("GET", `/apps/${APP_ID}/appStoreVersions?filter[platform]=IOS&limit=20`)).data;
for (const v of vs) {
  const tag = `version ${v.attributes.versionString} [${v.attributes.appStoreState}]`;
  /* review contact */
  try {
    const d = (await api("GET", `/appStoreVersions/${v.id}/appStoreReviewDetail`)).data;
    if (!d) {
      console.log(`${tag}: no review detail yet`);
    } else if (d.attributes.contactEmail === EMAIL) {
      console.log(`${tag}: review contact already ${EMAIL}`);
    } else if (DRY) {
      console.log(`${tag}: would change review contact ${d.attributes.contactEmail} → ${EMAIL}`);
    } else {
      await api("PATCH", `/appStoreReviewDetails/${d.id}`, { data: { type: "appStoreReviewDetails", id: d.id, attributes: { contactEmail: EMAIL } } });
      console.log(`${tag}: review contact ${d.attributes.contactEmail} → ${EMAIL}`);
    }
  } catch (e) { console.log(`${tag}: review contact not changed — ${e.message.split("\n").slice(-1)[0]}`); }
  /* support URL */
  try {
    const locs = (await api("GET", `/appStoreVersions/${v.id}/appStoreVersionLocalizations?limit=50`)).data;
    for (const l of locs) {
      const cur = l.attributes.supportUrl || "(none)";
      if (!SUPPORT || cur === SUPPORT) { console.log(`${tag} ${l.attributes.locale}: support URL ${cur}`); continue; }
      if (DRY) { console.log(`${tag} ${l.attributes.locale}: would change support URL ${cur} → ${SUPPORT}`); continue; }
      try {
        await api("PATCH", `/appStoreVersionLocalizations/${l.id}`, { data: { type: "appStoreVersionLocalizations", id: l.id, attributes: { supportUrl: SUPPORT } } });
        console.log(`${tag} ${l.attributes.locale}: support URL ${cur} → ${SUPPORT}`);
      } catch (e) { console.log(`${tag} ${l.attributes.locale}: support URL stays ${cur} — ${e.message.split("\n").slice(-1)[0]}`); }
    }
  } catch (e) { console.log(`${tag}: localizations not read — ${e.message.split("\n").slice(-1)[0]}`); }
}
