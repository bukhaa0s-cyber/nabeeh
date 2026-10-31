/* Nabeeh — App Store marketing screenshots.

   Takes the raw app screenshots in store-shots2/ and frames each one: a headline,
   a line of support text, and the phone itself on the brand's night-blue.
   Output goes to store-shots3/ at 1206 x 2622, the size App Store Connect wants
   for the 6.9-inch iPhone.

   node scripts/make-store-shots.mjs            all languages
   node scripts/make-store-shots.mjs ar         one language
*/
import { chromium } from "playwright";
import { readFile, writeFile, mkdir, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "store-shots2");
const OUT = path.join(ROOT, "store-shots3");
const W = 1206, H = 2622;

/* The headline and the line under it, screen by screen. The order matches the
   files n-<lang>-1 … n-<lang>-6, so a caption always sits on the screen it describes. */
const COPY = {
  ar: [
    ["مجاني بالكامل،<br>بلا اشتراك ولا حساب", "خطة كل يوم تبدأ من أضعف قسم عند طفلك، حتى موعد الاختبار"],
    ["درس لكل نوع سؤال:<br>الفكرة والخطوات والفخ", "دقيقة واحدة تعلّم الطفل <em>كيف</em> يحل، لا الجواب فقط"],
    ["تحدي السرعة<br>بتوقيت الاختبار الحقيقي", "يتعلّم متى يتجاوز السؤال الصعب بدل أن يعلق فيه"],
    ["اختبار تجريبي<br>ونتيجة تقول أين الوقت ضاع", "جاهزية بالأرقام، وأبطأ الأسئلة، وما تُرك فارغًا"],
    ["تقرير لولي الأمر<br>بلغة مفهومة", "ملخص ذكي: الأقوى، والأولوية، والتقدم أسبوعًا بأسبوع"],
    ["إنجازات تُكسب<br>بالمثابرة", "سلاسل الأيام، والدقة، والجولات الكاملة"],
    ["شارك تقدّم طفلك<br>بصورة واحدة", "اسم الطفل مخفي حتى تختار إظهاره"],
  ],
  en: [
    ["Completely free.<br>No account needed", "A daily plan that starts at the weakest section, right up to test day"],
    ["A lesson for every<br>question type", "One minute that teaches <em>how</em> to solve, not just the answer"],
    ["A speed challenge<br>with the real test's timing", "Learn when to move past a hard question instead of getting stuck"],
    ["A mock test that shows<br>where the time went", "Readiness in numbers, the slowest questions, and what was left blank"],
    ["A parent report<br>in plain words", "A smart summary: strongest section, the priority, week by week"],
    ["Badges earned<br>by showing up", "Streaks, accuracy and perfect rounds"],
    ["Share your child's<br>progress in one picture", "The name stays hidden until you choose to show it"],
  ],
};

const RTL = { ar: true, en: false };

function page({ lang, headline, sub, shot, font }) {
  return `<!doctype html><html dir="${RTL[lang] ? "rtl" : "ltr"}" lang="${lang}"><head><meta charset="utf-8">
<style>
  @font-face{font-family:"Readex Pro";src:url("${font}") format("truetype");font-weight:100 900;font-display:block}
  *{margin:0;padding:0;box-sizing:border-box}
  html,body{width:${W}px;height:${H}px;overflow:hidden}
  body{
    font-family:"Readex Pro",sans-serif;
    background:
      radial-gradient(1100px 700px at 50% -140px, rgba(255,200,61,.22), transparent 62%),
      linear-gradient(170deg,#2E2A6E 0%,#26235E 46%,#1C1A46 100%);
    display:flex;flex-direction:column;align-items:center;
  }
  .cap{width:1010px;text-align:center;padding-top:132px}
  h1{
    font-size:${lang === "ar" ? 82 : 78}px;font-weight:700;line-height:1.3;color:#fff;
    letter-spacing:${lang === "ar" ? "0" : "-.02em"};
  }
  h1 em{font-style:normal;color:#FFC83D}
  p{margin-top:28px;font-size:38px;font-weight:300;line-height:1.55;color:#C7C4EE}
  .phone{
    margin-top:${lang === "ar" ? 74 : 78}px;
    width:948px;border-radius:72px;padding:13px;background:#0C0B24;
    box-shadow:0 2px 0 rgba(255,255,255,.10) inset, 0 60px 90px -40px rgba(0,0,0,.75);
  }
  .phone img{display:block;width:100%;border-radius:60px}
</style></head><body>
  <div class="cap"><h1>${headline}</h1><p>${sub}</p></div>
  <div class="phone"><img src="${shot}"></div>
</body></html>`;
}

async function main() {
  const only = process.argv[2];
  const langs = only ? [only] : Object.keys(COPY);
  const font = "file://" + path.join(ROOT, "scripts/assets/ReadexPro.ttf");

  if (!only) await rm(OUT, { recursive: true, force: true });
  await mkdir(OUT, { recursive: true });

  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  const p = await ctx.newPage();

  for (const lang of langs) {
    for (let i = 0; i < COPY[lang].length; i++) {
      const [headline, sub] = COPY[lang][i];
      const srcFile = path.join(SRC, `n-${lang}-${i + 1}.png`);
      const shot = "data:image/png;base64," + (await readFile(srcFile)).toString("base64");
      const html = page({ lang, headline, sub, shot, font });
      const tmp = path.join(OUT, `.tmp-${lang}-${i + 1}.html`);
      await writeFile(tmp, html);
      await p.goto("file://" + tmp);
      await p.evaluate(() => document.fonts.ready);
      await p.waitForTimeout(250);
      const out = path.join(OUT, `${lang}-${i + 1}.png`);
      await p.screenshot({ path: out });
      await rm(tmp);
      console.log("wrote", path.relative(ROOT, out));
    }
  }
  await browser.close();
}

main().catch(e => { console.error(e); process.exit(1); });
