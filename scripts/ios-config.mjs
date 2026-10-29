// Runs on the macOS build machine after `npx cap add ios`: names the app, sets its language and category,
// declares no non-exempt encryption (so uploads skip the export-compliance question), and keeps it iPhone-only.
import {execSync} from "node:child_process";
import {readFileSync, writeFileSync} from "node:fs";
const plist = "ios/App/App/Info.plist";
const pb = (cmd) => { try { execSync(`/usr/libexec/PlistBuddy -c "${cmd}" ${plist}`, {stdio: "pipe"}); } catch (e) { /* key may already exist */ } };
const set = (key, type, value) => { pb(`Delete :${key}`); pb(`Add :${key} ${type} ${value}`); };
set("CFBundleDisplayName", "string", "نبيه");
set("CFBundleDevelopmentRegion", "string", "ar");
set("ITSAppUsesNonExemptEncryption", "bool", "false");
set("LSApplicationCategoryType", "string", "public.app-category.education");
set("UIRequiresFullScreen", "bool", "true");
// AdMob needs its application id in Info.plist. NSUserTrackingUsageDescription is deliberately absent:
// the app never asks to track, because ads are requested in child-directed, non-personalised mode.
const cfg = readFileSync("js/config.js", "utf8");
const adsId = (cfg.match(/ios:\s*\{[^}]*?appId:\s*"([^"]*)"/) || [])[1] || "";
if (adsId) set("GADApplicationIdentifier", "string", adsId);
else console.warn("no AdMob application id for iOS in js/config.js — the build will have no ads");
pb("Delete :CFBundleLocalizations"); pb("Add :CFBundleLocalizations array"); pb("Add :CFBundleLocalizations:0 string ar"); pb("Add :CFBundleLocalizations:1 string en");
// iPhone only, portrait
const proj = "ios/App/App.xcodeproj/project.pbxproj";
let p = readFileSync(proj, "utf8");
p = p.replace(/TARGETED_DEVICE_FAMILY = "1,2";/g, "TARGETED_DEVICE_FAMILY = 1;");
writeFileSync(proj, p);
set("UISupportedInterfaceOrientations", "array", "");
pb("Add :UISupportedInterfaceOrientations:0 string UIInterfaceOrientationPortrait");
console.log("iOS project configured");
