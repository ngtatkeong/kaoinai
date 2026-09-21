# Generate a branded 1200x630 Open Graph cover for KaoinAI.
import math
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "images" / "og-cover.png"

W, H = 1200, 630

# Locate a usable TTF font
candidates = [
    "C:/Windows/Fonts/segoeuib.ttf",
    "C:/Windows/Fonts/arialbd.ttf",
]
font_bold = next((p for p in candidates if Path(p).exists()), None)
font_reg = "C:/Windows/Fonts/segoeui.ttf"
if not Path(font_reg).exists():
    font_reg = font_bold

def f(path, size):
    return ImageFont.truetype(path, size) if path else ImageFont.load_default()

# --- background: deep space with violet/cyan aurora glows ---
bg = Image.new("RGB", (W, H), (8, 5, 18))
glow = Image.new("RGB", (W, H), (0, 0, 0))
gd = ImageDraw.Draw(glow)
gd.ellipse([W * 0.45, -H * 0.55, W * 1.45, H * 0.75], fill=(64, 24, 128))   # violet, right-top
gd.ellipse([-W * 0.35, H * 0.45, W * 0.45, H * 1.6], fill=(10, 70, 92))      # cyan, left-bottom
gd.ellipse([W * 0.55, H * 0.55, W * 1.25, H * 1.5], fill=(46, 14, 84))       # deep violet, right-bottom
glow = glow.filter(ImageFilter.GaussianBlur(160))
bg = Image.blend(bg, Image.composite(glow, bg, glow.convert("L").point(lambda v: min(255, v * 2))), 0.85)

# subtle lineage dots
dots = ImageDraw.Draw(bg)
for i in range(46):
    x = (i * 173 + 97) % W
    y = (i * 271 + 53) % H
    r = 1 + (i % 3)
    c = (168, 85, 247) if i % 2 else (6, 182, 212)
    dots.ellipse([x - r, y - r, x + r, y + r], fill=tuple(min(255, ch // 3 + 20) for ch in c))

canvas = Image.new("RGBA", (W, H), (0, 0, 0, 0))
canvas.alpha_composite(bg.convert("RGBA"))

# --- logo: K icon only (logo.webp hides a faint baked "AREA" fragment at its
# bottom edge, so crop tightly to the icon bbox x55-155, y190-295) ---
logo_full = Image.open(ROOT / "logo.webp").convert("RGBA")
icon = logo_full.crop((55, 190, 155, 295)).resize((124, 130), Image.LANCZOS)
canvas.alpha_composite(icon, (92, 88))

d = ImageDraw.Draw(canvas)

# wordmark text next to logo
f_brand = f(font_bold, 58)
d.text((244, 106), "KaoinAI", font=f_brand, fill=(235, 228, 250))
f_tag = f(font_reg, 26)
d.text((246, 182), "κοινή · koinai — common, shared for all", font=f_tag, fill=(168, 150, 205))

# headline
f_h = f(font_bold, 66)
d.text((88, 300), "Data Governance & AI for All.", font=f_h, fill=(255, 255, 255))

# gradient-ish accent line: draw two-tone text
f_sub = f(font_bold, 40)
d.text((88, 392), "Because when data is junk,", font=f_sub, fill=(192, 132, 252))
d.text((88, 446), "frontier AI will also be junk.", font=f_sub, fill=(34, 211, 238))

# footer url + badge
f_url = f(font_reg, 28)
d.text((88, 556), "kaoinai.com", font=f_url, fill=(148, 130, 185))
badge = "DG within AI · The Foundation of Agentic Intelligence"
f_b = f(font_reg, 24)
tw = d.textlength(badge, font=f_b)
bx0, by0 = W - 90 - tw - 36, 552
d.rounded_rectangle([bx0, by0, W - 90, by0 + 44], radius=22,
                    outline=(124, 58, 237), width=2, fill=(18, 10, 38))
d.text((bx0 + 18, by0 + 9), badge, font=f_b, fill=(216, 180, 254))

canvas.convert("RGB").save(OUT, "PNG", optimize=True)
print("saved", OUT, canvas.size)
