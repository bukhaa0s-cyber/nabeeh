// Builds the folder the iPhone app ships with (www/). The app opens straight into app.html;
// the sales page and the admin page are web-only and are left out.
import {cpSync, mkdirSync, rmSync, readFileSync, writeFileSync, existsSync} from "node:fs";
const out = "www";
rmSync(out, {recursive: true, force: true});
mkdirSync(out, {recursive: true});
for (const d of ["css", "js", "img"]) cpSync(d, `${out}/${d}`, {recursive: true});
for (const f of ["privacy.html", "terms.html", "manifest.webmanifest"]) if (existsSync(f)) cpSync(f, `${out}/${f}`);
let html = readFileSync("app.html", "utf8");
// links back to the sales page point at the app itself inside the native shell
writeFileSync(`${out}/index.html`, html);
for (const f of ["privacy.html", "terms.html"]) {
  const p = `${out}/${f}`; writeFileSync(p, readFileSync(p, "utf8").replace(/href="\.\/"/g, 'href="index.html"'));
}
console.log("www/ ready");
