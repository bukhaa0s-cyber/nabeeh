/* Nabeeh — replace a version's App Store screenshots through the App Store Connect API.

   Runs in GitHub Actions so the API key never leaves the repository secrets.
   It reads the PNGs in store-shots3/ (ar-1…ar-6, en-1…en-6), wipes the existing
   screenshot set for each localization and uploads the new ones in order.

   Environment:
     ASC_KEY_ID, ASC_ISSUER_ID, ASC_KEY_P8_BASE64   the API key, as the iOS workflow uses it
     APP_ID         App Store app id            (default: Nabeeh)
     VERSION        version string to update    (default: the one editable version)
     DISPLAY_TYPE   screenshot display type     (default: the set already on the version)
     DRY_RUN        "1" to inspect and change nothing
*/
import { createSign, createHash } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SHOTS = path.join(ROOT, "store-shots3");
const API = "https://api.appstoreconnect.apple.com/v1";

const APP_ID = process.env.APP_ID || "6826632743";
const VERSION = process.env.VERSION || "";
const DISPLAY_TYPE = process.env.DISPLAY_TYPE || "";
const DRY = process.env.DRY_RUN === "1";

/* which files belong to which App Store localization */
const LOCALES = { "ar-SA": "ar", "en-US": "en" };

/* ---------- auth ---------- */

function token() {
  const kid = need("ASC_KEY_ID"), iss = need("ASC_ISSUER_ID");
  const pem = Buffer.from(need("ASC_KEY_P8_BASE64"), "base64").toString("utf8").trim();
  const now = Math.floor(Date.now() / 1000);
  const b64 = o => Buffer.from(JSON.stringify(o)).toString("base64url");
  const body = `${b64({ alg: "ES256", kid, typ: "JWT" })}.${b64({ iss, iat: now, exp: now + 1200, aud: "appstoreconnect-v1" })}`;
  const sig = createSign("SHA256").update(body).sign({ key: pem, dsaEncoding: "ieee-p1363" });
  return `${body}.${sig.toString("base64url")}`;
}
function need(k) {
  const v = process.env[k];
  if (!v) throw new Error(`missing ${k}`);
  return v;
}

/* ---------- api ---------- */

let JWT = "";
async function api(method, url, body) {
  const r = await fetch(url.startsWith("http") ? url : API + url, {
    method,
    headers: {
      Authorization: `Bearer ${JWT}`,
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (r.status === 204) return null;
  const text = await r.text();
  let json = null;
  try { json = text ? JSON.parse(text) : null; } catch { /* non-JSON error page */ }
  if (!r.ok) {
    const detail = json?.errors?.map(e => `${e.title}: ${e.detail}`).join(" | ") || text.slice(0, 400);
    throw new Error(`${method} ${url} → ${r.status}\n${detail}`);
  }
  return json;
}

/* ---------- upload ---------- */

async function upload(setId, file, name) {
  const bytes = await readFile(file);
  const made = await api("POST", "/appScreenshots", {
    data: {
      type: "appScreenshots",
      attributes: { fileName: name, fileSize: bytes.length },
      relationships: { appScreenshotSet: { data: { type: "appScreenshotSets", id: setId } } },
    },
  });
  const id = made.data.id;
  for (const op of made.data.attributes.uploadOperations || []) {
    const part = bytes.subarray(op.offset, op.offset + op.length);
    const headers = Object.fromEntries((op.requestHeaders || []).map(h => [h.name, h.value]));
    const r = await fetch(op.url, { method: op.method, headers, body: part });
    if (!r.ok) throw new Error(`part upload for ${name} → ${r.status} ${await r.text()}`);
  }
  await api("PATCH", `/appScreenshots/${id}`, {
    data: {
      type: "appScreenshots",
      id,
      attributes: { uploaded: true, sourceFileChecksum: createHash("md5").update(bytes).digest("hex") },
    },
  });
  return id;
}

/* Apple processes each image after the upload; a set with a failed image blocks submission. */
async function settle(ids) {
  for (let round = 0; round < 20; round++) {
    const states = [];
    for (const id of ids) {
      const got = await api("GET", `/appScreenshots/${id}`);
      states.push(got.data.attributes.assetDeliveryState?.state || "UNKNOWN");
    }
    if (states.every(s => s === "COMPLETE")) return states;
    const bad = states.filter(s => s === "FAILED");
    if (bad.length) throw new Error(`Apple rejected ${bad.length} screenshot(s) during processing`);
    await new Promise(r => setTimeout(r, 6000));
  }
  console.log("  still processing after two minutes — check App Store Connect");
  return null;
}

/* ---------- main ---------- */

async function main() {
  JWT = token();

  const versions = await api("GET", `/apps/${APP_ID}/appStoreVersions?filter[platform]=IOS&limit=20`);
  const editable = versions.data.filter(v =>
    ["PREPARE_FOR_SUBMISSION", "DEVELOPER_REJECTED", "REJECTED", "METADATA_REJECTED", "WAITING_FOR_REVIEW"]
      .includes(v.attributes.appStoreState));
  const version = VERSION
    ? versions.data.find(v => v.attributes.versionString === VERSION)
    : editable[0];
  if (!version) throw new Error(`no editable version found${VERSION ? ` for ${VERSION}` : ""}`);
  console.log(`version ${version.attributes.versionString} (${version.attributes.appStoreState})`);

  const locs = await api("GET", `/appStoreVersions/${version.id}/appStoreVersionLocalizations?limit=50`);
  const files = await readdir(SHOTS);

  for (const loc of locs.data) {
    const locale = loc.attributes.locale;
    const prefix = LOCALES[locale];
    if (!prefix) { console.log(`skipping ${locale} — no screenshots for it`); continue; }

    const mine = files.filter(f => f.startsWith(prefix + "-") && f.endsWith(".png")).sort(
      (a, b) => parseInt(a.split("-")[1]) - parseInt(b.split("-")[1]));
    if (!mine.length) { console.log(`skipping ${locale} — no ${prefix}-*.png in store-shots3`); continue; }

    const sets = await api("GET", `/appStoreVersionLocalizations/${loc.id}/appScreenshotSets?limit=50`);
    const types = sets.data.map(s => s.attributes.screenshotDisplayType);
    console.log(`\n${locale}: ${mine.length} file(s); existing sets: ${types.join(", ") || "none"}`);

    let type = DISPLAY_TYPE;
    if (!type) {
      const iphone = types.filter(t => t.startsWith("APP_IPHONE"));
      if (iphone.length === 1) type = iphone[0];
      else throw new Error(`set DISPLAY_TYPE — found iPhone sets: ${iphone.join(", ") || "none"}`);
    }

    if (DRY) { console.log(`  would replace ${type} with ${mine.join(", ")}`); continue; }

    /* A fresh set is cleaner than deleting images one by one, and it fixes the order. */
    const old = sets.data.find(s => s.attributes.screenshotDisplayType === type);
    if (old) await api("DELETE", `/appScreenshotSets/${old.id}`);
    const set = await api("POST", "/appScreenshotSets", {
      data: {
        type: "appScreenshotSets",
        attributes: { screenshotDisplayType: type },
        relationships: { appStoreVersionLocalization: { data: { type: "appStoreVersionLocalizations", id: loc.id } } },
      },
    });

    const ids = [];
    for (const f of mine) {
      ids.push(await upload(set.data.id, path.join(SHOTS, f), f));
      console.log(`  uploaded ${f}`);
    }
    await api("PATCH", `/appScreenshotSets/${set.data.id}/relationships/appScreenshots`, {
      data: ids.map(id => ({ type: "appScreenshots", id })),
    });
    const states = await settle(ids);
    if (states) console.log(`  ${locale} done — ${ids.length} screenshots live on the product page`);
  }
}

main().catch(e => { console.error(String(e.message || e)); process.exit(1); });
