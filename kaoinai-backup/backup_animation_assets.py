#!/usr/bin/env python3
"""Back out the KaoinAI animated-background system from the live site.

Moves the animation assets into kaoinai-backup/ and removes the injected
<link>/<script> tags from all site pages. Idempotent: skips files/lines
that are already gone.
"""
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BACKUP = ROOT / "kaoinai-backup"

ASSETS = [
    "assets/kaoinai-refresh.css",
    "assets/kaoinai-nebula.js",
    "assets/kaoinai-dynamics.js",
]
IMAGES = [
    "images/kd-aurora-lineage.webp",
    "images/kd-governance-core.webp",
]
PAGES = [
    "index.html", "audit.html", "demo.html", "roi-calculator.html",
    "dg-and-ai.html", "vs-collibra.html", "vs-monte-carlo.html",
    "blog.html", "blog-avengers-data-governance.html",
    "blog-data-governance-checklist.html", "blog-natural-language-sql.html",
    "blog-sme-data-governance-ai-cost-research.html", "blog-waste-enterprise-tools.html",
]
MARKERS = ("assets/kaoinai-refresh.css", "assets/kaoinai-nebula.js", "assets/kaoinai-dynamics.js")

# 1. move asset files into the backup dir
for rel in ASSETS + IMAGES:
    src = ROOT / rel
    dst = BACKUP / rel
    if src.exists():
        dst.parent.mkdir(parents=True, exist_ok=True)
        shutil.move(str(src), str(dst))
        print(f"MOVED: {rel} -> kaoinai-backup/{rel}")
    elif dst.exists():
        print(f"already backed up: {rel}")
    else:
        print(f"MISSING: {rel}")

# 2. keep the injector script with the backup for future restore
inj = ROOT / "scratch" / "inject_refresh_assets.py"
if inj.exists():
    BACKUP.mkdir(exist_ok=True)
    shutil.copy2(str(inj), str(BACKUP / "inject_refresh_assets.py"))
    print("COPIED: scratch/inject_refresh_assets.py -> kaoinai-backup/")

# 3. strip injected tags from pages
for name in PAGES:
    p = ROOT / name
    if not p.exists():
        print(f"SKIP (missing page): {name}")
        continue
    html = p.read_text(encoding="utf-8")
    lines = html.split("\n")
    kept = [ln for ln in lines if not any(m in ln for m in MARKERS)]
    removed = len(lines) - len(kept)
    if removed:
        p.write_text("\n".join(kept), encoding="utf-8")
        print(f"STRIPPED {removed} tag(s): {name}")
    else:
        print(f"no tags: {name}")

print("done")
