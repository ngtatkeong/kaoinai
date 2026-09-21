#!/usr/bin/env python3
"""Deep per-page SEO meta audit for the KaoinAI static site."""
import json
import re
from pathlib import Path
from html.parser import HTMLParser

ROOT = Path(__file__).resolve().parent.parent
PAGES = [
    "index.html", "audit.html", "demo.html", "roi-calculator.html",
    "dg-and-ai.html", "vs-collibra.html", "vs-monte-carlo.html",
    "blog.html", "blog-avengers-data-governance.html",
    "blog-data-governance-checklist.html", "blog-natural-language-sql.html",
    "blog-sme-data-governance-ai-cost-research.html", "blog-waste-enterprise-tools.html",
]

HEAD_RE = re.compile(r"<head>(.*?)</head>", re.S | re.I)

def head_of(html):
    m = HEAD_RE.search(html)
    return m.group(1) if m else ""

def _content_of(t):
    m = re.search(r'content="([^"]*)"', t, re.I)
    if m:
        return m.group(1)
    m = re.search(r"content='([^']*)'", t, re.I)
    return m.group(1) if m else ""

def tag(head, name):
    for m in re.finditer(r"<meta[^>]*>", head, re.I):
        t = m.group(0)
        if re.search(r'name="%s"' % re.escape(name), t, re.I):
            return _content_of(t)
    return None

def prop(head, p):
    for m in re.finditer(r"<meta[^>]*>", head, re.I):
        t = m.group(0)
        if re.search(r'property="%s"' % re.escape(p), t, re.I):
            return _content_of(t)
    return None

def title_of(head):
    m = re.search(r"<title>(.*?)</title>", head, re.S | re.I)
    return re.sub(r"\s+", " ", m.group(1)).strip() if m else None

def linkrel(head, rel):
    out = []
    for m in re.finditer(r"<link[^>]*>", head, re.I):
        if re.search(r'rel=["\']%s["\']' % re.escape(rel), m.group(0), re.I):
            out.append(m.group(0))
    return out

issues = []
for name in PAGES:
    p = ROOT / name
    html = p.read_text(encoding="utf-8")
    head = head_of(html)
    loc = name

    t = title_of(head)
    if not t:
        issues.append(f"{loc}: MISSING <title>")
    else:
        t_disp = t.replace("&amp;", "&")
        if not (25 <= len(t_disp) <= 65):
            issues.append(f"{loc}: title length {len(t_disp)} ({t_disp[:60]}...)")

    d = tag(head, "description")
    if not d:
        issues.append(f"{loc}: MISSING meta description")
    else:
        d = d.replace("&amp;", "&")
        if not (70 <= len(d) <= 170):
            issues.append(f"{loc}: description length {len(d)}")

    if not prop(head, "og:title"):
        issues.append(f"{loc}: MISSING og:title")
    if not prop(head, "og:description"):
        issues.append(f"{loc}: MISSING og:description")
    if not prop(head, "og:type"):
        issues.append(f"{loc}: MISSING og:type")
    if not prop(head, "og:url"):
        issues.append(f"{loc}: MISSING og:url")
    ogi = prop(head, "og:image")
    if not ogi:
        issues.append(f"{loc}: MISSING og:image")
    elif ogi.startswith("https://kaoinai.com/"):
        if not (ROOT / ogi[len("https://kaoinai.com/"):]).exists():
            issues.append(f"{loc}: og:image file missing -> {ogi}")
    if not prop(head, "og:site_name"):
        issues.append(f"{loc}: MISSING og:site_name")
    if not tag(head, "twitter:card"):
        issues.append(f"{loc}: MISSING twitter:card")

    canon = linkrel(head, "canonical")
    if not canon:
        issues.append(f"{loc}: MISSING canonical")

    robots = tag(head, "robots")
    if robots and "noindex" in robots.lower():
        issues.append(f"{loc}: robots meta = {robots}")

    # hreflang intentionally only on index: the 4-language switcher is
    # client-side on a single URL, so subpages correctly omit hreflang.
    if name == "index.html":
        hreflang = re.findall(r'hreflang="([^"]+)"', head, re.I)
        if not hreflang:
            issues.append(f"{loc}: index missing hreflang annotations")

    # JSON-LD validity
    blocks = re.findall(r'<script[^>]+type=["\']application/ld\+json["\'][^>]*>(.*?)</script>', html, re.S | re.I)
    if not blocks:
        issues.append(f"{loc}: NO JSON-LD blocks")
    for i, b in enumerate(blocks):
        try:
            data = json.loads(b.strip())
            types = []
            def walk(o):
                if isinstance(o, dict):
                    t2 = o.get("@type")
                    if t2: types.append(t2)
                    for v in o.values(): walk(v)
                elif isinstance(o, list):
                    for v in o: walk(v)
            walk(data)
            if name == "index.html":
                joined = str(types)
                for need in ["Organization", "WebSite", "SoftwareApplication", "FAQPage"]:
                    if need not in joined:
                        issues.append(f"{loc}: JSON-LD missing @type {need}")
        except Exception as e:
            issues.append(f"{loc}: JSON-LD block {i} INVALID: {e}")

    # single h1
    body = html[len(head):]
    h1s = len(re.findall(r"<h1[\s>]", body, re.I))
    if h1s != 1:
        issues.append(f"{loc}: {h1s} <h1> tags")

print(f"Audited {len(PAGES)} pages, {len(issues)} issue(s)")
for i in issues:
    print(" -", i)
