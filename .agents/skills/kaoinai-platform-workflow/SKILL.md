---
name: kaoinai-platform-workflow
description: Complete architecture, branding standards, multi-country statutory compliance rules (SG, MY, ID), SEO/GEO guidelines, and production deployment workflow for the KaoinAI data intelligence platform.
---

# KaoinAI Web Platform & Deployment Workflow

## Overview
This skill documents the full production design system, statutory compliance rules, peer-reviewed PDF generation, and deployment automation for the KaoinAI marketing and intelligence web platform (https://kaoinai.com).

## Repository & Infrastructure
- **Git Repository**: `https://github.com/ngtatkeong/kaoinai.git` (branch: `main`)
- **Production VPS**: `app.kaoinai.com` (`187.77.154.93`)
- **Web Root**: `/opt/kaionai-site`
- **Reverse Proxy**: Nginx with HTTP/2, TLS 1.3, Let's Encrypt SSL, rate limiting, and gzip compression (`/etc/nginx/sites-available/kaoinai`)

## Universal Brand & UI Directives
1. **Standalone 72px Logo**: Pure `72px × 72px` logo icon (`logo.webp`) inside `88px` height navbar with `backdrop-filter: blur(24px)`. **Never place brand text next to the logo icon.**
2. **Synchronized 11 Navigation Links**: Both desktop navbar and full-screen blurred mobile drawer must contain identical 11 items:
   `Our Story` | `DataSense Platform` | `Who It's For` | `Industries` | `Consulting` | `Live Demo` | `ROI Calculator` | `Blog` | `FAQ` | `Start Free` | `4-Lang Switcher`
3. **Hero Section Standard**:
   - Badge: `Data Governance & AI for All · The Foundation of Agentic Intelligence`
   - Headline: `Data Governance & AI for All.`
   - Accent / Sub-headline: `Because Frontier AI on Junk Data is Still Junk.`
   - Ethos / Meaning: `κοινή · koinai — common, shared for all. Intelligence for All.`
   - Subhead: Combines instant self-service querying (No SQL, no consultants, no enterprise prices) with the fundamental law that messy un-governed data defeats frontier AI models.
   - 3 Pillars:
     1. `⚠️ Frontier AI + Junk Data = Junk Output`
     2. `🏛️ Governance is the Foundation of AI`
     3. `🌐 Enterprise DG & AI for All`
4. **Multi-Language Support**: Persistent 4-language i18n switcher (`EN`, `ID`, `MS`, `ZH`) with `localStorage('kaoinai-lang')` and DOM synchronization.
5. **Truthful UI Representation**: Zero fake macOS window control dots (`red`, `yellow`, `green`), zero fake browser URLs (`localhost:5173`). All interactive previews must be framed as **DataSense Interactive Feature Tour** with clear sample data notices.

## Multi-Country Statutory Compliance Standards
- **🇸🇬 Singapore (PDPC)**: Personal Data Protection Act 2012 (Act 26/2012) & 2024 Advisory Guidelines. 11 statutory obligations. Mandatory 3-day (72h) breach notification (§ 26D). Penalties up to 10% annual turnover (> S$10M) or S$1,000,000 (§ 48J).
- **🇲🇾 Malaysia (JPDP)**: Personal Data Protection Act 2010 (Act 709) and Personal Data Protection (Amendment) Act 2024 (Act A1727). Mandatory 72h breach reporting (§ 12B). Mandatory resident DPO (§ 12A). Direct statutory liability on Data Processors (§ 68A). Penalties up to RM 1,000,000 and 3 years imprisonment.
- **🇮🇩 Indonesia (UU PDP)**: Undang-Undang No. 27 Tahun 2022. Mandatory 72h written notification (Pasal 46). Pejabat PDP / DPO requirement (Pasal 53). Corporate fines up to 2% annual turnover (Pasal 57). Criminal penalties up to 6 years imprisonment and Rp 60 Billion (Pasal 67–68).

## Automated Audit Verification
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

## Production Deployment Cycle
### Step 1: Push from Local Computer
```powershell
git add .
git commit -m "feat: description"
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
