#!/usr/bin/env python3
"""Inject the visual refresh CSS + dynamics JS into all site pages (idempotent)."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CSS_TAG = '<link rel="stylesheet" href="assets/kaoinai-refresh.css">'
NEBULA_TAG = '<script defer src="assets/kaoinai-nebula.js"></script>'
JS_TAG = '<script defer src="assets/kaoinai-dynamics.js"></script>'

SKIP = {"googledaba1ad49b5dbd0e.html"}

pages = [
    "index.html", "audit.html", "demo.html", "roi-calculator.html",
    "dg-and-ai.html", "vs-collibra.html", "vs-monte-carlo.html",
    "blog.html", "blog-avengers-data-governance.html",
    "blog-data-governance-checklist.html", "blog-natural-language-sql.html",
    "blog-sme-data-governance-ai-cost-research.html", "blog-waste-enterprise-tools.html",
]

for name in pages:
    if name in SKIP:
        continue
    p = ROOT / name
    if not p.exists():
        print(f"SKIP (missing): {name}")
        continue
    html = p.read_text(encoding="utf-8")
    changed = False
    if "kaoinai-refresh.css" not in html:
        html = re.sub(r"</head>", f"  {CSS_TAG}\n</head>", html, count=1, flags=re.I)
        changed = True
    if "kaoinai-nebula.js" not in html:
        html = re.sub(r"(<script defer src=\"assets/kaoinai-dynamics\.js\"></script>)", NEBULA_TAG + "\n  " + r"\1", html, count=1)
        changed = True
    if "kaoinai-dynamics.js" not in html:
        html = re.sub(r"</body>", f"  {JS_TAG}\n</body>", html, count=1, flags=re.I)
        changed = True
    if changed:
        p.write_text(html, encoding="utf-8")
        print(f"INJECTED: {name}")
    else:
        print(f"already ok: {name}")
print("done")
