#!/usr/bin/env python3
"""Google Play listing graphics for Nabeeh -> store/play/

  icon-512.png             Play app icon (512x512, from resources/icon-only.png)
  feature-ar.png / -en.png Feature graphic (1024x500)
  phone/ar-N.png, en-N.png Phone screenshots at 1080x1920 (9:16).

The App Store shots in store-shots3/ are 1206x2622 (ratio 2.17). Google Play rejects anything whose long
side is more than twice the short side, so each shot is scaled to 1920 tall and widened to 9:16 by
stretching its own left/right edge columns (the shots have a plain vertical gradient at the edges).

Run:  python3 scripts/make-play-assets.py      (needs Pillow and Playwright with a Chrome/Chromium)
"""
import base64, glob, os, shutil
from pathlib import Path
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "store" / "play"
SHOTS = ROOT / "store-shots3"
FONT = ROOT / "scripts" / "assets" / "ReadexPro.ttf"
ICON = ROOT / "resources" / "icon-only.png"


def icon():
    Image.open(ICON).convert("RGB").resize((512, 512), Image.LANCZOS).save(OUT / "icon-512.png", optimize=True)


def phone_shots():
    d = OUT / "phone"
    d.mkdir(parents=True, exist_ok=True)
    W, H = 1080, 1920
    for f in sorted(glob.glob(str(SHOTS / "*.png"))):
        src = Image.open(f).convert("RGB")
        w = round(src.width * H / src.height)          # 883
        body = src.resize((w, H), Image.LANCZOS)
        pad = (W - w) // 2
        canvas = Image.new("RGB", (W, H))
        # widen with the shot's own edge colours, softly blurred so no seam shows
        left = body.crop((0, 0, 3, H)).resize((pad + 2, H)).filter(ImageFilter.GaussianBlur(6))
        right = body.crop((w - 3, 0, w, H)).resize((W - w - pad + 2, H)).filter(ImageFilter.GaussianBlur(6))
        canvas.paste(left, (0, 0))
        canvas.paste(right, (pad + w - 2, 0))
        canvas.paste(body, (pad, 0))
        canvas.save(d / Path(f).name, optimize=True)


TEXT = {
    "ar": dict(dir="rtl", name="نبيه", tag="عشر دقائق يوميًا تجهّز طفلك<br>لاختبارات الموهوبين",
               chips=["مجاني بالكامل", "عربي وإنجليزي", "بلا حساب"]),
    "en": dict(dir="ltr", name="Nabeeh Prep", tag="Ten minutes a day to get your child<br>ready for gifted tests",
               chips=["Completely free", "Arabic & English", "No account"]),
}


def feature_html(lang):
    t = TEXT[lang]
    font = base64.b64encode(FONT.read_bytes()).decode()
    ic = base64.b64encode((OUT / "icon-512.png").read_bytes()).decode()
    chips = "".join(f"<span>{c}</span>" for c in t["chips"])
    return f"""<!doctype html><html dir="{t['dir']}"><head><meta charset="utf-8"><style>
@font-face{{font-family:R;src:url(data:font/ttf;base64,{font}) format('truetype');font-weight:100 900}}
*{{margin:0;box-sizing:border-box}}
html,body{{width:1024px;height:500px;overflow:hidden}}
body{{font-family:R,sans-serif;color:#fff;
 background:radial-gradient(120% 140% at 85% 0%,#4a4396 0%,#2f2a6b 45%,#1d1b49 100%);
 display:flex;align-items:center;gap:56px;padding:0 84px;position:relative}}
.glow{{position:absolute;width:520px;height:520px;border-radius:50%;inset-inline-end:-120px;bottom:-260px;
 background:radial-gradient(circle,rgba(250,204,21,.28),rgba(250,204,21,0) 65%)}}
img{{width:250px;height:250px;border-radius:56px;box-shadow:0 24px 60px rgba(0,0,0,.35);flex:none;position:relative}}
.t{{position:relative}}
h1{{font-size:{86 if lang=='ar' else 72}px;font-weight:700;line-height:1.1;letter-spacing:-.5px}}
p{{font-size:{33 if lang=='ar' else 30}px;font-weight:400;line-height:1.45;margin:14px 0 26px;color:#E4E2FF}}
.c{{display:flex;gap:10px;flex-wrap:nowrap;white-space:nowrap}}
.c span{{font-size:{21 if lang=='ar' else 19}px;font-weight:600;padding:8px 18px;border-radius:999px;background:rgba(255,255,255,.12);
 border:1.5px solid rgba(255,255,255,.22)}}
.c span:first-child{{background:#FACC15;color:#1D1B46;border-color:#FACC15}}
</style></head><body><div class="glow"></div><img src="data:image/png;base64,{ic}">
<div class="t"><h1>{t['name']}</h1><p>{t['tag']}</p><div class="c">{chips}</div></div></body></html>"""


def features():
    from playwright.sync_api import sync_playwright
    exe = shutil.which("google-chrome") or shutil.which("chromium") or shutil.which("chromium-browser")
    with sync_playwright() as p:
        b = p.chromium.launch(executable_path=exe) if exe else p.chromium.launch()
        pg = b.new_page(viewport={"width": 1024, "height": 500}, device_scale_factor=1)
        for lang in TEXT:
            pg.set_content(feature_html(lang))
            pg.evaluate("document.fonts.ready")
            pg.wait_for_timeout(200)
            pg.screenshot(path=str(OUT / f"feature-{lang}.png"))
        b.close()
    for lang in TEXT:   # Play wants 24-bit PNG or JPEG, no alpha
        f = OUT / f"feature-{lang}.png"
        Image.open(f).convert("RGB").save(f, optimize=True)


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    icon()
    phone_shots()
    features()
    for f in sorted(OUT.rglob("*.png")):
        im = Image.open(f)
        print(f.relative_to(ROOT), im.size, im.mode, f"{f.stat().st_size // 1024} KB")
