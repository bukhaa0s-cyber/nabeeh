// Runs on the build machine after `npx cap add android` (see `npm run android:prepare`).
// It never touches the web code; it only adjusts the generated android/ project:
//   1. version code / name from the environment, and Android 16 (API 36) as the target, which Google Play
//      requires for new apps and updates submitted after 31 Aug 2026;
//   2. release signing, only when an upload keystore is really there (otherwise Gradle builds an unsigned bundle);
//   3. the AdMob application id in AndroidManifest.xml (the Google Mobile Ads SDK crashes at start without it);
//   4. permissions: notifications on Android 13+, no exact alarms, and no advertising id (child-directed app);
//   5. a status-bar icon for the daily reminder, and portrait orientation (same as the iPhone app).
//
// Environment:
//   VERSION_CODE, VERSION_NAME     Play version (defaults 1 / 1.0.0)
//   ANDROID_KEYSTORE_PATH          keystore path relative to android/app (or absolute); signing is skipped if missing
//   ADMOB_ANDROID_APP_ID           AdMob Android app id "ca-app-pub-XXXXXXXXXXXXXXXX~NNNNNNNNNN"
//                                  (falls back to ads.android.appId in js/config.js, then to Google's TEST app id)
import {readFileSync, writeFileSync, existsSync, mkdirSync} from "node:fs";
import {isAbsolute, join} from "node:path";

const read = (f) => readFileSync(f, "utf8");
const must = (ok, msg) => { if (!ok) throw new Error(msg); };

// ---------- 1. version and SDK levels ----------
const gradle = "android/app/build.gradle";
let g = read(gradle);
const versionCode = process.env.VERSION_CODE || "1";
const versionName = process.env.VERSION_NAME || "1.0.0";
must(/versionCode\s+\d+/.test(g), "versionCode not found in android/app/build.gradle");
must(/^\d+$/.test(versionCode), `VERSION_CODE must be a whole number, got "${versionCode}"`);
g = g.replace(/versionCode\s+\d+/, `versionCode ${versionCode}`)
     .replace(/versionName\s+"[^"]*"/, `versionName "${versionName.replace(/"/g, "")}"`);

const vars = "android/variables.gradle";
if (existsSync(vars)) {
  let v = read(vars);
  const atLeast = (name, n) => { v = v.replace(new RegExp(`(${name}\\s*=\\s*)(\\d+)`), (m, a, cur) => a + Math.max(+cur, n)); };
  atLeast("compileSdkVersion", 36);
  atLeast("targetSdkVersion", 36);
  writeFileSync(vars, v);
  // the Android Gradle plugin that ships with Capacitor 7 only warns about compileSdk 36; keep the log quiet
  const props = "android/gradle.properties";
  if (existsSync(props) && !/suppressUnsupportedCompileSdk/.test(read(props)))
    writeFileSync(props, read(props).replace(/\s*$/, "\n") + "android.suppressUnsupportedCompileSdk=36\n");
  console.log("compileSdk / targetSdk: 36");
}

// ---------- 2. release signing (only if the keystore exists) ----------
const ks = process.env.ANDROID_KEYSTORE_PATH || "";
const ksFile = ks ? (isAbsolute(ks) ? ks : join("android/app", ks)) : "";
if (ks && existsSync(ksFile)) {
  const signing = `    signingConfigs {
        release {
            storeFile file("${ks}")
            storePassword System.getenv("ANDROID_KEYSTORE_PASSWORD")
            keyAlias System.getenv("ANDROID_KEY_ALIAS")
            keyPassword System.getenv("ANDROID_KEY_PASSWORD")
        }
    }
`;
  must(/\n(\s*)buildTypes\s*\{\s*release\s*\{/.test(g), "buildTypes { release { … } } not found in build.gradle");
  if (!/signingConfigs\s*\{/.test(g))
    g = g.replace(/\n(\s*)buildTypes\s*\{\s*release\s*\{/, (m, ind) =>
      `\n${signing}${ind}buildTypes {\n${ind}    release {\n${ind}        signingConfig signingConfigs.release`);
  console.log("release signing configured");
} else {
  console.warn(ks ? `keystore ${ksFile} not found — building an UNSIGNED release bundle`
                  : "no ANDROID_KEYSTORE_PATH — building an UNSIGNED release bundle");
}
writeFileSync(gradle, g);

// ---------- 3. AdMob application id ----------
const GOOGLE_TEST_APP_ID = "ca-app-pub-3940256099942544~3347511713";   // Google's official sample/test app id
const cfg = read("js/config.js");
const cfgId = (cfg.match(/android:\s*\{[^}]*?appId:\s*"([^"]*)"/) || [])[1] || "";
const envId = (process.env.ADMOB_ANDROID_APP_ID || "").trim();
let adsId = envId || cfgId || GOOGLE_TEST_APP_ID;
must(/^ca-app-pub-\d{16}~\d{10}$/.test(adsId), `AdMob Android app id looks wrong: "${adsId}" (expected ca-app-pub-…~…)`);
console.log(`AdMob Android app id: ${adsId} (${envId ? "ADMOB_ANDROID_APP_ID" : cfgId ? "js/config.js" : "Google TEST id — replace before release"})`);

const strings = "android/app/src/main/res/values/strings.xml";
let x = read(strings);
x = /name="admob_app_id"/.test(x)
  ? x.replace(/(<string name="admob_app_id">)[^<]*(<\/string>)/, `$1${adsId}$2`)
  : x.replace("</resources>", `    <string name="admob_app_id">${adsId}</string>\n</resources>`);
writeFileSync(strings, x);

// ---------- 4. manifest: AdMob meta-data, permissions, orientation ----------
const man = "android/app/src/main/AndroidManifest.xml";
let m = read(man);
if (!/xmlns:tools=/.test(m)) m = m.replace(/<manifest\b/, '<manifest xmlns:tools="http://schemas.android.com/tools"');

if (!/com\.google\.android\.gms\.ads\.APPLICATION_ID/.test(m))
  m = m.replace("</application>",
    `        <meta-data android:name="com.google.android.gms.ads.APPLICATION_ID" android:value="@string/admob_app_id"/>\n    </application>`);

const perms = [
  // Android 13+ asks before showing notifications; js/notify.js calls requestPermissions() when the parent turns the reminder on
  `<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />`,
  // A daily practice reminder does not need to fire to the minute. Exact alarms are a restricted permission on
  // Google Play (alarm-clock / calendar apps only), so make sure no library brings them in; the plugin then
  // schedules an ordinary (inexact) alarm, which may arrive a few minutes late.
  `<uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM" tools:node="remove" />`,
  `<uses-permission android:name="android.permission.USE_EXACT_ALARM" tools:node="remove" />`,
  // Child-directed app (Google Play Families policy): the Google Mobile Ads SDK adds AD_ID by default; removing it
  // means Android hands the SDK an all-zero advertising id. The Privacy Sandbox ad-id / attribution / topics
  // permissions are removed for the same reason. Ads are still served, contextual and non-personalised.
  `<uses-permission android:name="com.google.android.gms.permission.AD_ID" tools:node="remove" />`,
  `<uses-permission android:name="android.permission.ACCESS_ADSERVICES_AD_ID" tools:node="remove" />`,
  `<uses-permission android:name="android.permission.ACCESS_ADSERVICES_ATTRIBUTION" tools:node="remove" />`,
  `<uses-permission android:name="android.permission.ACCESS_ADSERVICES_TOPICS" tools:node="remove" />`,
];
for (const p of perms) {
  const name = p.match(/android:name="([^"]+)"/)[1];
  if (new RegExp(`android:name="${name.replace(/\./g, "\\.")}"`).test(m)) {
    // already declared (e.g. by the Capacitor template): make the removal ones win
    if (/tools:node="remove"/.test(p))
      m = m.replace(new RegExp(`<uses-permission[^>]*android:name="${name.replace(/\./g, "\\.")}"[^>]*/>`), p);
    continue;
  }
  m = m.replace("</manifest>", `    ${p}\n</manifest>`);
}

// portrait only, like the iPhone app (the layouts are designed for a phone held upright)
m = m.replace(/(<activity\b(?:(?!>)[\s\S])*?android:name="[^"]*MainActivity"(?:(?!>)[\s\S])*?)(\s*>)/, (all, head, end) =>
  /screenOrientation/.test(head) ? all : `${head}\n            android:screenOrientation="portrait"${end}`);
writeFileSync(man, m);
console.log("AndroidManifest: AdMob id, POST_NOTIFICATIONS, no exact alarms, no AD_ID, portrait");

// ---------- 5. status-bar icon for the reminder (white silhouette, as Android requires) ----------
// Referenced by plugins.LocalNotifications.smallIcon in capacitor.config.json. A simple open-book shape.
const drawable = "android/app/src/main/res/drawable";
mkdirSync(drawable, {recursive: true});
writeFileSync(`${drawable}/ic_stat_nabeeh.xml`, `<?xml version="1.0" encoding="utf-8"?>
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="24dp" android:height="24dp" android:viewportWidth="24" android:viewportHeight="24">
    <path android:fillColor="#FFFFFFFF"
        android:pathData="M12,6.5C10.2,5.2 7.6,4.5 5,4.5c-1,0 -2,0.1 -3,0.4v14c1,-0.3 2,-0.4 3,-0.4c2.6,0 5.2,0.7 7,2c1.8,-1.3 4.4,-2 7,-2c1,0 2,0.1 3,0.4v-14c-1,-0.3 -2,-0.4 -3,-0.4C16.4,4.5 13.8,5.2 12,6.5zM11,18.4c-1.8,-0.9 -3.9,-1.4 -6,-1.4c-0.4,0 -0.7,0 -1,0.1V6.6C4.3,6.5 4.7,6.5 5,6.5c2.1,0 4.2,0.6 6,1.7V18.4z"/>
</vector>
`);

console.log(`Android configured: versionCode ${versionCode}, versionName ${versionName}`);
