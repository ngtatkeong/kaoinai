# KaoinAI Website — Comprehensive Engineering & Design Memory

> **Last Updated**: August 2026  
> **Entity**: KaoinAI Pte Ltd (Singapore & Malaysia)  
> **Product**: DataSense Platform (AI-Native Data Intelligence, Automated Lineage & 4D Quality Monitoring)  
> **Repository**: `d:\kaoinai-website`  
> **Domain**: `https://kaoinai.com`  
> **LinkedIn**: `https://www.linkedin.com/company/kaoinai-pte-ltd`

---

## 1. Core Brand Directives & Tone

* **Agentic AI & Data Governance Core Thesis**:
  * In the age of AI agents, LLMs, and conversational analytics, data governance is not optional—it is the foundational prerequisite of effective AI.
  * AI only knows how to answer with your data. If your data is messy, dirty, or unindexed, no matter how frontier the AI model is, it will hallucinate and produce junk.
  * KaoinAI doesn't just manage data—we **clean, cure, repair schema drift, mask PII, and make data understandable and fit for purpose for AI**.
* **Phonetic Pronunciation**: Hero section badge features `KaoinAI [Kay-on A.I.]` to ensure clear regional and international pronunciation.
* **Header Architecture**:
  * **Logo Mark Only**: The top-left header contains **only the pure 72px × 72px logo icon** (`logo.webp` with `border-radius: 16px; box-shadow: 0 4px 22px rgba(0, 0, 0, 0.45)`). **No accompanying "KaoinAI" text in the header**.
  * **Navbar Height**: `88px` sticky/fixed top bar with `background: rgba(7, 7, 11, 0.88)` and `backdrop-filter: blur(24px)`.
* **Authenticity & Honest Messaging (Zero False Artifacts)**:
  * **No Fake Browser Windows**: Never use macOS colored window dots (`red`, `yellow`, `green`) or fake browser address bars (`localhost:5173/...`).
  * **Enterprise SaaS Status Headers**: Showcase UI cards use real product module toolbars (`🟢 DataSense Engine`, `Production Workspace · v19.2`, `4D Anomaly Detector`, etc.).
  * **Honest Demo Terminology**: Replaced all misleading "Live Sandbox" / "in-browser database" wording with **"DataSense Interactive Feature Tour"** accompanied by a transparent disclaimer: *"💡 Interactive feature walkthrough using sample datasets. To connect your company's live database, start a free trial."*
* **Target Personas & Use Cases**:
  * **Personas**: New SMEs (0 data knowledge), Fast-scaling Startups, Multi-generation Family Businesses, Large Enterprise SMEs with legacy bottlenecks.
  * **Day in the Life**: Includes comprehensive "Before KaoinAI vs. After KaoinAI" workflow breakdowns on the homepage.

---

## 2. Global Navigation & Footer Standards (Across All 10 Pages)

All 10 HTML files adhere to identical, synchronized structure:

### Desktop Navbar (10 Navigation Items + Lang Switcher):
1. `[Logo Icon Only (72px)]` &rarr; `index.html`
2. `Our Story` &rarr; `index.html#story`
3. `DataSense Platform` &rarr; `index.html#features`
4. `Who It's For` &rarr; `index.html#personas`
5. `Industries` &rarr; `index.html#use-cases`
6. `Consulting` &rarr; `index.html#services`
7. `Live Demo` &rarr; `demo.html`
8. `ROI Calculator` &rarr; `roi-calculator.html`
9. `Blog` &rarr; `blog.html`
10. `FAQ` &rarr; `index.html#faq`
11. `Start Free` &rarr; `index.html#cta`
12. **Language Switcher**: `.lang-switcher` (`EN` | `ID` | `MS` | `简`)

### Mobile Navigation Drawer (`#mobileMenu`):
* Fullscreen blurred overlay drawer with matching link list, close button (`✕`), and language switcher.

### Subpage Universal Footer:
```html
<footer>
  <p>&copy; 2026 KaoinAI Pte Ltd. All rights reserved. &nbsp;|&nbsp; <a href="index.html">Home</a> &nbsp;|&nbsp; <a href="demo.html">Live Demo</a> &nbsp;|&nbsp; <a href="roi-calculator.html">ROI Calculator</a> &nbsp;|&nbsp; <a href="audit.html">Free Audit</a> &nbsp;|&nbsp; <a href="blog.html">Blog</a> &nbsp;|&nbsp; <a href="index.html#faq">FAQ</a> &nbsp;|&nbsp; <a href="https://www.linkedin.com/company/kaoinai-pte-ltd" target="_blank" rel="noopener noreferrer">LinkedIn</a></p>
</footer>
```

---

## 3. Complete Page Directory

| File | Purpose | Key Features |
| :--- | :--- | :--- |
| [index.html](file:///d:/kaoinai-website/index.html) | Homepage & Main Hub | Hero, Story, DataSense Platform, SME Personas, Day-in-the-Life, 10 UI Showcase Cards, Pricing, Interactive FAQ, CTA. |
| [demo.html](file:///d:/kaoinai-website/demo.html) | Interactive Feature Tour | Query generator simulator (Natural Language &rarr; SQL), Automated Column Lineage Graph, 4D Data Quality Monitor. |
| [roi-calculator.html](file:///d:/kaoinai-website/roi-calculator.html) | SME ROI Savings Engine | Real-time interactive sliders (Team size, SQL tickets, legacy tool spend, pipeline outages) with instant annual ROI output. |
| [audit.html](file:///d:/kaoinai-website/audit.html) | Free SME Data Health Audit | 5-step interactive governance & PII assessment wizard with instant diagnostic score and recommendations. |
| [blog.html](file:///d:/kaoinai-website/blog.html) | Knowledge Base & Articles | Searchable, category-filtered engineering and SME governance blog with newsletter capture. |
| [vs-collibra.html](file:///d:/kaoinai-website/vs-collibra.html) | Comparison: KaoinAI vs Collibra | Detailed B2B feature, pricing, and deployment breakdown targeting mid-market & SMEs. |
| [vs-monte-carlo.html](file:///d:/kaoinai-website/vs-monte-carlo.html) | Comparison: KaoinAI vs Monte Carlo | Observability and automated lineage comparison highlighting lightweight, unified architecture. |
| [blog-data-governance-checklist.html](file:///d:/kaoinai-website/blog-data-governance-checklist.html) | 15-Minute Audit Checklist | Interactive checklist with progress counter for PDPA/GDPR compliance, PII masking, and schema monitors. |
| [blog-natural-language-sql.html](file:///d:/kaoinai-website/blog-natural-language-sql.html) | Plain English SQL Guide | Tutorial on conversational data querying with zero hallucinations, RBAC enforcement, and dialect compilation. |
| [blog-waste-enterprise-tools.html](file:///d:/kaoinai-website/blog-waste-enterprise-tools.html) | SME Cost Guide | Detailed breakdown of why SMEs overspend $50k+ on legacy enterprise stacks and how AI-native tooling solves it. |

---

## 4. Technical Architecture & Verification Suite

* **Zero Dependencies**: Pure HTML5, Modern CSS (Custom properties, grid, flex, clamp, backdrop filters), and Vanilla ES6 JavaScript.
* **Performance, SEO & Generative Engine Optimization (GEO) Assets**:
  * **Core SEO Focus**: Dominate searches for `AI and data`, `Agentic AI data governance`, `AI data readiness`, `Fix messy data for AI`, `Make data fit for purpose for AI`, and `Frontier AI data quality`.
  * [index.html](file:///d:/kaoinai-website/index.html): Comprehensive Schema.org JSON-LD graph with Organization, WebSite, SoftwareApplication, and 8+ question FAQPage schema targeting AI and data governance.
  * [sitemap.xml](file:///d:/kaoinai-website/sitemap.xml): Full multi-language `xhtml:link hreflang` entries, Google image indexation, daily/weekly refresh flags with fresh `lastmod` timestamps.
  * [robots.txt](file:///d:/kaoinai-website/robots.txt): Explicit crawler permissions for Search Engines (Googlebot, Bingbot, Baiduspider) and Generative AI engines (GPTBot, ChatGPT-User, PerplexityBot, ClaudeBot, Google-Extended, Cohere-ai, anthropic-ai).
  * [llms.txt](file:///d:/kaoinai-website/llms.txt): Machine-readable markdown manifest for AI search summarization, encoding the foundational laws of AI data governance.
  * [manifest.json](file:///d:/kaoinai-website/manifest.json) & [telemetry.js](file:///d:/kaoinai-website/telemetry.js): PWA metadata and privacy-friendly engagement analytics.
* **Peer-Reviewed & Statutory PDF Publications**:
  * [downloads/2026-Data-Governance-AI-Readiness-Handbook.pdf](file:///d:/kaoinai-website/downloads/2026-Data-Governance-AI-Readiness-Handbook.pdf): Publication-grade PDF handbook grounded in Singapore PDPC, Malaysia JPDP Act 709 / Act A1727, Indonesia UU PDP 27/2022, ISO/IEC 42001:2023, DAMA-DMBOK2, and peer-reviewed academic literature.
  * Direct downloads wired to modal lead captures on `index.html` and checklist page `blog-data-governance-checklist.html`.
* **Verification Script**:
  * Persistent automated audit script available at `scratch/audit_check.py` to re-verify navigation links, desktop/mobile language switchers, footers, and scripts across all 10 pages in seconds.

---

## 5. Instructions for Future Follow-Up & Edits

1. **Header Consistency**: If adjusting header styles or logo assets, always modify all 10 HTML files and preserve the standalone 72px icon format.
2. **Nav Links Order**: Maintain the standard 11-item sequence across both desktop `.nav-links` and mobile `#mobileMenu`.
3. **Subpage Footers**: Keep subpage footers aligned with the standardized 7-link format.
4. **Verification**: Always run `python scratch/audit_check.py` and the node script syntax checker after making multi-page changes.
