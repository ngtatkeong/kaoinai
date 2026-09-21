#!/usr/bin/env python3
"""SEO meta fixes: tighten titles/descriptions, add og:site_name,
point index og:image at the new branded 1200x630 cover."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

def sub1(html, old, new, where):
    n = html.count(old)
    assert n == 1, f"{where}: expected 1 occurrence, found {n}: {old[:80]!r}"
    return html.replace(old, new)

def save(name, html):
    (ROOT / name).write_text(html, encoding="utf-8")
    print(f"updated: {name}")

# ---------- titles ----------
TITLES = {
    "index.html": (
        "<title>KaoinAI — DG and AI | Data Governance &amp; AI for All (DG within AI)</title>",
        "<title>KaoinAI — Data Governance &amp; AI for All (DG within AI)</title>"),
    "audit.html": (
        "<title>Free AI Data Readiness &amp; Governance Health Audit Tool — KaoinAI</title>",
        "<title>Free AI Data Readiness &amp; Governance Audit — KaoinAI</title>"),
    "demo.html": (
        "<title>Interactive AI &amp; Data Governance Feature Tour — KaoinAI DataSense</title>",
        "<title>DataSense Interactive Feature Tour — KaoinAI</title>"),
    "dg-and-ai.html": (
        "<title>DG and AI — The Complete Guide to Data Governance &amp; AI for All | KaoinAI</title>",
        "<title>DG and AI: Complete Guide to Data Governance &amp; AI | KaoinAI</title>"),
    "vs-collibra.html": (
        "<title>KaoinAI vs. Collibra — Modern AI Data Governance Platform Comparison</title>",
        "<title>KaoinAI vs. Collibra: AI Data Governance Comparison</title>"),
    "vs-monte-carlo.html": (
        "<title>KaoinAI vs. Monte Carlo — AI Data Observability &amp; Governance Platform Comparison</title>",
        "<title>KaoinAI vs. Monte Carlo: Data Observability Comparison</title>"),
    "blog.html": (
        "<title>AI &amp; Data Governance Blog — Engineering, Insights &amp; Regulatory Playbooks | KaoinAI</title>",
        "<title>AI &amp; Data Governance Blog — Guides &amp; Playbooks | KaoinAI</title>"),
    "blog-avengers-data-governance.html": (
        "<title>Why the Avengers Lost in Infinity War (And Why Bad Data Governance Will Defeat Your AI) — KaoinAI</title>",
        "<title>Why the Avengers Lost in Infinity War — Bad Data Governance</title>"),
    "blog-data-governance-checklist.html": (
        "<title>The 2026 AI Data Governance &amp; Multi-Country PDPA Checklist (SG, MY, ID) — KaoinAI</title>",
        "<title>2026 AI Data Governance &amp; PDPA Checklist (SG, MY, ID) — KaoinAI</title>"),
    "blog-natural-language-sql.html": (
        "<title>How to Query AI and Data in Plain English [Conversational SQL Guide] — KaoinAI</title>",
        "<title>Query Data in Plain English: Conversational SQL Guide — KaoinAI</title>"),
    "blog-sme-data-governance-ai-cost-research.html": (
        "<title>The SME Data Inequality Gap: What Ungoverned Data Costs Growing Businesses | KaoinAI Research</title>",
        "<title>The SME Data Inequality Gap: Cost of Ungoverned Data | KaoinAI</title>"),
    "blog-waste-enterprise-tools.html": (
        "<title>Why Most SMEs Waste $50k on Enterprise Data Tools (And What to Use in the Age of AI) — KaoinAI</title>",
        "<title>Why SMEs Waste $50k on Enterprise Data Tools — KaoinAI</title>"),
}

# ---------- descriptions (only over-length ones) ----------
DESCRIPTIONS = {
    "index.html": (
        '<meta content="DG and AI (Data Governance and Artificial Intelligence) is the essential foundation of reliable enterprise intelligence. Frontier AI on messy data produces junk. KaoinAI delivers enterprise-grade DG and AI for all: automated column lineage, 4D quality curing, conversational SQL, and making data fit for purpose for AI." name="description"/>',
        '<meta content="KaoinAI delivers enterprise-grade DG within AI for all: automated column lineage, 4D quality curing, and conversational SQL that make your data fit for purpose for AI." name="description"/>'),
    "demo.html": (
        '<meta name="description" content="Tour the AI data platform built for the agentic era. Experience conversational SQL, automated column-level lineage, and 4D quality monitoring making data fit for purpose for AI.">',
        '<meta name="description" content="Tour the AI data platform for the agentic era: conversational SQL, automated column-level lineage, and 4D quality monitoring that make data fit for purpose for AI.">'),
    "dg-and-ai.html": (
        '<meta name="description" content="DG and AI (Data Governance and Artificial Intelligence): Why data governance is the indispensable foundation of AI in the agentic era. Explore automated lineage, 4D data quality, conversational SQL, and why KaoinAI delivers DG and AI for all.">',
        '<meta name="description" content="Why data governance is the indispensable foundation of AI in the agentic era: automated lineage, 4D data quality, and conversational SQL — DG and AI for all.">'),
    "vs-monte-carlo.html": (
        '<meta name="description" content="Compare KaoinAI and Monte Carlo side-by-side. See how KaoinAI delivers unified 4D data quality, automated lineage, and conversational AI querying to make data fit for purpose for AI.">',
        '<meta name="description" content="Compare KaoinAI and Monte Carlo: unified 4D data quality, automated lineage, and conversational AI querying that make data fit for purpose for AI.">'),
    "blog-avengers-data-governance.html": (
        '<meta content="A strategic breakdown of how siloed intelligence, unmonitored PII, and missing lineage defeated the Avengers in Infinity War—and why uncurated data will defeat your enterprise AI." name="description"/>',
        '<meta content="How siloed intelligence, unmonitored PII, and missing lineage defeated the Avengers in Infinity War — and why uncurated data will defeat your AI." name="description"/>'),
    "blog-data-governance-checklist.html": (
        '<meta content="Official regulatory compliance and technical data governance checklist for Singapore (PDPC), Malaysia (JPDP Act 709 &amp; 2024 Amendments), and Indonesia (UU PDP 27/2022). Make your enterprise data fit for purpose for AI." name="description"/>',
        '<meta content="Data governance checklist for Singapore (PDPC), Malaysia (JPDP Act 709 &amp; 2024), and Indonesia (UU PDP 27/2022) to make enterprise data fit for purpose for AI." name="description"/>'),
    "blog-sme-data-governance-ai-cost-research.html": (
        '<meta name="description" content="Empirical research on SME access to Data Governance (DG) and AI. Discover the 4 hidden phantom taxes costing growing businesses $75k+ annually, and why democratizing DG within AI is the economic imperative of the agentic era. Download full PDF report.">',
        '<meta name="description" content="Research: 4 hidden phantom taxes cost growing businesses $75k+ a year — why democratizing DG within AI is the economic imperative of the agentic era.">'),
}

# sanity-check lengths
for name, (old, new) in {**TITLES, **DESCRIPTIONS}.items():
    if old.startswith("<title>"):
        t = new[len("<title>"):-len("</title>")].replace("&amp;", "&")
        assert len(t) <= 65, f"{name}: title still {len(t)} chars: {t}"
    else:
        m = re.search(r'content="([^"]*)"', new)
        assert m and len(m.group(1)) <= 170, f"{name}: desc too long"

for name, (old, new) in TITLES.items():
    p = ROOT / name
    html = p.read_text(encoding="utf-8")
    html = sub1(html, old, new, name)
    save(name, html)

for name, (old, new) in DESCRIPTIONS.items():
    p = ROOT / name
    html = p.read_text(encoding="utf-8")
    html = sub1(html, old, new, name)
    save(name, html)

# ---------- og:site_name on 5 pages ----------
for name in ["audit.html", "demo.html", "roi-calculator.html", "vs-collibra.html", "vs-monte-carlo.html"]:
    p = ROOT / name
    html = p.read_text(encoding="utf-8")
    assert "og:site_name" not in html, f"{name}: og:site_name already present"
    m = re.search(r'^(\s*)<meta[^>]*property="og:url"[^>]*>$', html, re.M)
    assert m, f"{name}: no og:url line found"
    line = m.group(0)
    if 'content="https://kaoinai.com' in line:
        new_line = line + "\n" + m.group(1) + '<meta content="KaoinAI" property="og:site_name"/>'
    else:
        new_line = line + "\n" + m.group(1) + '<meta property="og:site_name" content="KaoinAI"/>'
    html = sub1(html, line, new_line, name)
    save(name, html)

# ---------- index og:image -> branded cover ----------
p = ROOT / "index.html"
html = p.read_text(encoding="utf-8")
n = html.count("https://kaoinai.com/logo-namecard.png")
assert n == 3, f"index.html: expected 3 logo-namecard og refs, found {n}"
html = html.replace("https://kaoinai.com/logo-namecard.png", "https://kaoinai.com/images/og-cover.png")
save("index.html", html)

print("ALL SEO META FIXES APPLIED")
