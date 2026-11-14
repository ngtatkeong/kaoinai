# Design Document: Interactive Feature Drill-Down Modal & Technical Workflows

* **Status:** In Implementation
* **Author:** KaoinAI Engineering Team
* **Date:** 2026-11-14

## 1. Context & Motivation

The Features section (`src/sections/Features.tsx`) serves as the core functional catalog on the KaoinAI homepage. It presents 14 enterprise capabilities (`Data Governance`, `Data Quality`, `Table-Bound DPIA & Data Inventory`, `AI-Aided DB Knowledgebase`, `Data Lineage`, `Master Data Management`, `AI-Enhanced Data Catalog`, `Auto-Insights`, `Data Transformations (dbt)`, `Risk Scoring`, `ESG Analytics`, `Schema Shifts Detection`, `Data Architect & Optimization`, `DPO Toolkit & ASEAN Compliance`).

Previously, each feature was rendered as a static display tile. When prospective technical leads, architects, and DPOs attempted to click for details, the tiles were unresponsive, creating an exploratory dead end.

## 2. Proposed Architecture

### 2.1 Technical Data Layer (`src/data/featureDetails.ts`)
A dedicated, strongly-typed repository containing technical specifications for all 14 features. Each entry includes:
- **Operational Workflow**: A step-by-step numbered breakdown of how an engineer or DPO uses the module.
- **Physical Engine Coverage**: Explicit compatibility (Postgres, Snowflake, MySQL, ClickHouse, BigQuery).
- **Concrete Technical Artifact**: Real SQL queries, dbt models, RBAC YAML policies, DDL migration scripts with schema comments, or JSON audit reports.
- **Statutory & Regulatory Alignment**: Exact statutory citations (Singapore PDPA Section 4(2) & 12, MAS TRM Cyber Hygiene, GDPR Article 30).
- **Outcome Metrics**: Quantifiable engineering and governance baselines.

### 2.2 Accessible Dialog Component (`src/components/FeatureDetailModal.tsx`)
- Standardized modal overlay with backdrop blur.
- Keyboard accessibility: `Escape` key dismiss, Tab navigation, and body scroll lock on mount (`overflow: hidden`).
- Desktop layout: Two-column / tabbed view (`Workflow`, `Technical Artifact`, `Compliance & Engines`).
- Mobile layout: Fluid bottom-sheet drawer with sticky dual-action footer.
- Dual Action Paths:
  - Primary: "Book 1-on-1 Consultation" (deep links to `/contact?topic=${topic}`).
  - Secondary: "Download Free PDPA Checklist (PDF)" (invokes `LeadMagnetModal`).

### 2.3 Interactive Features Grid (`src/sections/Features.tsx`)
- Card triggers wrapped in semantic keyboard-accessible buttons (`role="button"`, `tabIndex={0}`).
- Interactive hover affordance with border highlighting and an explicit `"Explore technical specs & code →"` footer badge.
- Lazy-loaded modal via `React.lazy` to preserve initial bundle load performance.

### 2.4 Deep Link Query in Contact (`src/pages/Contact.tsx`)
- Ingest `useSearchParams()` to read `?topic=...` on mount and pre-select the relevant consultation agenda.
