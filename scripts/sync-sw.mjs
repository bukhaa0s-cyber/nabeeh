// Keeps the service worker's file list in step with app.html. The cache is keyed by the whole URL,
// so a "?v=" here that differs from the one the page asks for means the file is fetched and stored twice
// and the offline copy is never the one used. Run: node scripts/sync-sw.mjs [--check]
import {readFileSync, writeFileSync} from "node:fs";
const html = readFileSync("app.html", "utf8");
const assets = [...html.matchAll(/(?:src|href)="((?:js|css)\/[^"]+)"/g)].map(m => m[1]);
const files = ["app.html", ...assets, "img/logo.svg", "img/icon-192.png", "img/icon-512.png", "manifest.webmanifest"];
const list = JSON.stringify(files).replace(/","/g, '",\n "');
const sw = readFileSync("sw.js", "utf8");
const next = sw.replace(/const FILES=\[[\s\S]*?\];/, `const FILES=${list};`);
if (next === sw && !sw.includes(`const FILES=${list};`)) throw new Error("FILES array not found in sw.js");
if (process.argv.includes("--check")) {
  if (next !== sw) { console.error("sw.js is out of date — run: node scripts/sync-sw.mjs"); process.exit(1); }
  console.log("sw.js file list matches app.html");
} else {
  writeFileSync("sw.js", next);
  console.log(`sw.js lists ${files.length} files`);
}
