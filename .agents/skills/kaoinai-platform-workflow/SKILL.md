---
name: kaoinai-platform-workflow
description: Complete architecture, branding standards, multi-country statutory compliance rules (SG, MY, ID), SEO/GEO optimization for 'DG within AI', and production deployment workflow for the KaoinAI data intelligence platform.
---

# KaoinAI Platform Workflow & SEO Strategy

## 1. Overview
This skill documents the full production design system, statutory compliance rules, peer-reviewed PDF generation, automated SEO/GEO standards for searches where the context is **DG within AI** (Data Governance within AI), and deployment automation for the KaoinAI marketing and intelligence web platform (https://kaoinai.com).

## 2. SEO & Generative Engine Optimization (GEO) for "DG within AI"
When users, prospects, or AI search engines search for terms relating to **"DG within AI"**, **"Data Governance within AI"**, **"Data Governance for AI"**, or **"DG in AI"**, KaoinAI must be the definitive high-authority source.

### Search Keyword Architecture:
- **Primary Keywords**: `DG within AI`, `data governance within AI`, `data governance for AI`, `DG in AI`, `AI data governance`, `DG in the age of agentic AI`, `data governance and AI for all`, `DG foundation of AI`.
- **Secondary Intent Keywords**: `fix messy data for AI`, `make data fit for purpose for AI`, `frontier AI data quality`, `prevent AI hallucinations`, `automated data lineage`, `4D data quality monitoring`, `conversational SQL`, `text to SQL for SMEs`.

### Core SEO & GEO Assets:
1. **Schema.org Structured Data (JSON-LD)** on [index.html](file:///d:/kaoinai-website/index.html):
   - Organization, WebSite, SoftwareApplication, and 15+ FAQPage entities.
   - Specific FAQ items directly answering *"What is DG within AI?"*, *"Why is DG within AI critical for preventing hallucinations?"*, and *"How does KaoinAI provide Data Governance and AI for all?"*.
2. **AI Search Engine Manifest ([llms.txt](file:///d:/kaoinai-website/llms.txt))**:
   - Machine-readable markdown manifest specifically read by PerplexityBot, GPTBot, ClaudeBot, and Gemini.
   - Features a dedicated section: `## DG within AI (Data Governance within AI) & AI for All`.
3. **Search Crawler Access ([robots.txt](file:///d:/kaoinai-website/robots.txt))**:
   - Explicit allowances for Googlebot, Bingbot, Baiduspider, and Generative AI engines (GPTBot, ChatGPT-User, PerplexityBot, ClaudeBot, Google-Extended, Cohere-ai, anthropic-ai).

## 3. Brand & UI Directives
1. **Standalone 72px Logo**: Pure `72px × 72px` logo icon (`logo.webp`) inside `88px` height navbar with `backdrop-filter: blur(24px)`. **Never place brand text next to the logo icon.**
2. **Synchronized 11 Navigation Links**: Both desktop navbar and full-screen blurred mobile drawer must contain identical 11 items:
   `Our Story` | `DataSense Platform` | `Who It's For` | `Industries` | `Consulting` | `Live Demo` | `ROI Calculator` | `Blog` | `FAQ` | `Start Free` | `4-Lang Switcher`
3. **Hero Section Standards (Harmonized)**:
   - Badge: `Data Governance & AI for All · The Foundation of Agentic Intelligence`
   - Headline: `Data Governance & AI for All.`
   - Accent / Sub-headline: `Because When Data is Junk, Frontier AI Will Also Be Junk.`
   - Ethos / Meaning: `κοινή · koinai — common, shared for all. Intelligence for All.`
   - Subhead: Combines instant self-service querying (No SQL, no consultants, no enterprise prices) with the fundamental law that messy un-governed data defeats frontier AI models.
   - 3 Pillars:
     1. `⚠️ Frontier AI + Junk Data = Junk Output`
     2. `🏛️ Governance is the Foundation of AI`
     3. `🌐 Enterprise DG & AI for All (Fixed & Fit for Purpose)`
4. **Multi-Language Support**: Persistent 4-language i18n switcher (`EN`, `ID`, `MS`, `ZH`) with `localStorage('kaoinai-lang')` and DOM synchronization.
5. **Truthful UI Representation**: Zero fake macOS window control dots (`red`, `yellow`, `green`), zero fake browser URLs (`localhost:5173`). All interactive previews must be framed as **DataSense Interactive Feature Tour** with clear sample data notices.

## 4. Multi-Country Statutory Compliance Standards
- **🇸🇬 Singapore (PDPC)**: Personal Data Protection Act 2012 (Act 26/2012) & 2024 Advisory Guidelines. 11 statutory obligations. Mandatory 3-day (72h) breach notification (§ 26D). Penalties up to 10% annual turnover (> S$10M) or S$1,000,000 (§ 48J).
- **🇲🇾 Malaysia (JPDP)**: Personal Data Protection Act 2010 (Act 709) and Personal Data Protection (Amendment) Act 2024 (Act A1727). Mandatory 72h breach reporting (§ 12B). Mandatory resident DPO (§ 12A). Direct statutory liability on Data Processors (§ 68A). Penalties up to RM 1,000,000 and 3 years imprisonment.
- **🇮🇩 Indonesia (UU PDP)**: Undang-Undang No. 27 Tahun 2022. Mandatory 72h written notification (Pasal 46). Pejabat PDP / DPO requirement (Pasal 53). Corporate fines up to 2% annual turnover (Pasal 57). Criminal penalties up to 6 years imprisonment and Rp 60 Billion (Pasal 67–68).

## 5. Automated Audit Verification
Before any deployment, run the automated Python test suite:
```powershell
python scratch/full_site_audit.py
```
Checks verified across all 11 pages:
- 0 broken image `src` tags
- 0 broken local links or unresolved `#id` anchors
- 100% pure 72px standalone logo icon
- 100% nav link synchronization (11 items)
- 100% subpage footer synchronization (7 items)
- Valid Schema.org JSON-LD structured data on all pages

## 6. Production Deployment Cycle
### Step 1: Push from Local Computer
```powershell
git add .
git commit -m "feat: <description>"
git push origin main
```

### Step 2: Pull on VPS (root@187.77.154.93)
```bash
cd /opt/kaionai-site
git pull origin main
chown -R www-data:www-data /opt/kaionai-site
chmod -R 755 /opt/kaionai-site
systemctl reload nginx
```
