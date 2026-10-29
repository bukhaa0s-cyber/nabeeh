// Builds the folder the phone apps ship with (www/). The app opens straight into app.html;
// the sales page and the admin page are web-only and are left out.
// The app also ships its own copy of the font: the website may load it from Google, but the app
// promises that it sends nothing anywhere, and a web font request would send the phone's address.
import {cpSync, mkdirSync, rmSync, readFileSync, writeFileSync, existsSync, readdirSync} from "node:fs";
const out = "www";
rmSync(out, {recursive: true, force: true});
mkdirSync(out, {recursive: true});
for (const d of ["css", "js", "img"]) cpSync(d, `${out}/${d}`, {recursive: true});
for (const f of ["privacy.html", "terms.html", "manifest.webmanifest"]) if (existsSync(f)) cpSync(f, `${out}/${f}`);
let html = readFileSync("app.html", "utf8");

// ---- the font, copied out of @fontsource/readex-pro when it is installed ----
const pkg = "node_modules/@fontsource/readex-pro";
const WEIGHTS = ["300", "400", "500", "600", "700"];
let css = "";
if (existsSync(pkg)) {
  for (const subset of ["arabic", "latin"]) {
    const sheet = `${pkg}/${subset}.css`;
    if (existsSync(sheet)) css += readFileSync(sheet, "utf8");
  }
  // keep only the weights the app asks for, and point every url at the copied file
  const faces = [...css.matchAll(/@font-face\s*{[^}]*}/g)].map(m => m[0])
    .filter(f => WEIGHTS.some(w => new RegExp(`font-weight:\\s*${w}\\b`).test(f)))
    .filter(f => /woff2/.test(f));
  const wanted = new Set();
  css = faces.map(f => f.replace(/url\(([^)]*?)([^/)'"]+\.woff2)([^)]*)\)/g, (m, a, file) => {
    wanted.add(file); return `url(fonts/${file}) format('woff2')`;
  }).replace(/,\s*url\([^)]*\.woff\)[^;]*/g, "")).join("\n");
  const dir = `${pkg}/files`;
  const have = existsSync(dir) ? new Set(readdirSync(dir)) : new Set();
  const files = [...wanted].filter(f => have.has(f));
  if (files.length) {
    mkdirSync(`${out}/css/fonts`, {recursive: true});
    for (const f of files) cpSync(`${dir}/${f}`, `${out}/css/fonts/${f}`);
    writeFileSync(`${out}/css/fonts.css`, css + "\n");
    html = html
      .replace(/\s*<link rel="preconnect"[^>]*>/g, "")
      .replace(/\s*<link href="https:\/\/fonts\.googleapis\.com[^>]*>/g, '\n<link rel="stylesheet" href="css/fonts.css">');
    console.log(`bundled ${files.length} font files`);
  } else {
    console.warn("no font files copied — the app will fall back to the system font");
  }
} else if (process.env.CI) {
  throw new Error(`${pkg} is not installed; run npm install before building the app`);
} else {
  console.warn(`${pkg} is not installed — the app will fall back to the system font`);
}
if (/fonts\.googleapis\.com/.test(html)) {
  // never leave a web request in the app build: drop the link rather than ship it
  html = html.replace(/\s*<link rel="preconnect"[^>]*>/g, "").replace(/\s*<link href="https:\/\/fonts\.googleapis\.com[^>]*>/g, "");
}
writeFileSync(`${out}/index.html`, html);
for (const f of ["privacy.html", "terms.html"]) {
  const p = `${out}/${f}`; writeFileSync(p, readFileSync(p, "utf8").replace(/href="\.\/"/g, 'href="index.html"'));
}
console.log("www/ ready");
