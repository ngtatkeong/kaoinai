# Interactive Feature Drill-Down & Usage Details (EGM Brainstorm Brief)

* **Author:** KaoinAI Engineering Team
* **Date:** 2026-11-14
* **Status:** Brainstorm Synthesized & Validated

## 1. Executive Summary

The current Features grid (`src/sections/Features.tsx`) showcases 14 enterprise capabilities as static, non-interactive cards. To turn this section into an engaging technical demonstration, clicking any card opens a responsive, fully accessible modal dialog (`FeatureDetailModal.tsx`). The modal displays:
1. **Concrete Operational Workflows**: Exact step-by-step procedures showing how data engineers, DPOs, or architects operate the module.
2. **Production Technical Artifacts**: Real SQL, YAML configs, CLI invocations, or JSON outputs (zero mock code).
3. **Database Engine Coverage**: Physical engine compatibility (PostgreSQL, Snowflake, MySQL, ClickHouse, BigQuery).
4. **Statutory & Regulatory Alignment**: Exact section mappings for Singapore PDPA, MAS TRM, and ASEAN PDP laws.
5. **Dual Action Converters**:
   - Primary: **"Book 1-on-1 Consultation"** (deep links to `/contact?topic=[Topic]` with pre-selected agenda).
   - Secondary: **"Download Enterprise Whitepaper / PDPA Checklist"** (seamless trigger for technical whitepaper downloads).

---

## 2. Key Objections & Stress-Test Findings (Goldfish Swarm)

1. **Initial Bundle Bloat (Zoom Out / Performance)**:
   - Storing full workflows and code artifacts for 14 features directly in `src/sections/Features.tsx` adds unnecessary weight to initial page load.
   - *Resolution:* Code-split the modal and detail payload using `React.lazy(() => import('@/components/FeatureDetailModal'))` so that the detailed data and syntax views are only fetched when a user clicks a feature card.

2. **Mobile Code Viewport Clutter (UX & Design)**:
   - Showing horizontal code blocks and multi-step workflows on mobile screens (< 640px) risks breaking layouts or causing horizontal overflow jitter.
   - *Resolution:* The modal will render full-height bottom-sheet style on mobile with sticky header/close buttons, scrollable tab navigation, and `overflow-x-auto` code blocks with one-click copy buttons.

3. **Modal Stacking Collisions (Architecture & Codebase)**:
   - Clicking "Download Whitepaper" from inside `FeatureDetailModal` could conflict with `LeadMagnetModal`.
   - *Resolution:* Pass an explicit handler to gracefully layer or swap modals without state collisions or stuck backdrop locks (`z-[60]` over `z-50`).

4. **Deep-Link State Synchronization (Implementation Readiness)**:
   - Clicking "Book 1-on-1 Consultation" from a specific feature (e.g., Table-Bound DPIA) should automatically pre-select that topic in the `/contact` form rather than requiring the user to re-enter it.
   - *Resolution:* Pass `?topic=` via URL search parameters, which `Contact.tsx` reads on mount to automatically select the matching session topic.

---

## 3. The 14-Feature Technical Registry Schema

Each feature in `src/data/featureDetails.ts` adheres to this standard schema:

1. **Data Governance (DG)**
   - *Workflow:* Connect database via read-only metadata mesh -> Define role-based access rules -> Generate automated audit trail.
   - *Artifact:* RBAC Data Masking Policy YAML with SHA-256 pseudonymization.
   - *Engines:* PostgreSQL, Snowflake, MySQL, BigQuery.
   - *Compliance:* Singapore PDPA Section 4(2), MAS TRM Cyber Hygiene, SOC 2 Type II.

2. **Data Quality (DQ)**
   - *Workflow:* Configure assertion thresholds -> Continuous anomaly scanning on ingest -> Automated Slack/Teams breach alerting.
   - *Artifact:* KaoinAI Data Assertion Rule YAML validating NRIC format, non-null constraints, and distribution drift.
   - *Engines:* PostgreSQL, Snowflake, ClickHouse, MySQL.
   - *Compliance:* MAS TRM Data Integrity & System Availability standards.

3. **Master Data Management (MDM)**
   - *Workflow:* Ingest cross-system customer records -> Probabilistic entity matching -> Deduplicate into authoritative Golden Record.
   - *Artifact:* SQL Golden Record Survivorship query merging Salesforce CRM and core banking Postgres.
   - *Engines:* PostgreSQL, Snowflake, SQL Server, BigQuery.
   - *Compliance:* Singapore PDPA Accuracy Obligation (Section 23).

4. **Table-Bound DPIA & Data Inventory**
   - *Workflow:* Scan tables for PII -> Bind statutory DPIA directly to schema comments -> Trigger CDC alert on newly added PII columns.
   - *Artifact:* DDL migration script with table-bound `COMMENT ON COLUMN ... IS 'PDPA:PII:HIGH_RISK'` and drift notification JSON.
   - *Engines:* PostgreSQL, Snowflake, MySQL, ClickHouse.
   - *Compliance:* Singapore PDPA Section 12, GDPR Article 30 (RoPA).

5. **AI-Aided DB Knowledgebase**
   - *Workflow:* Scan table structures and query logs -> Synthesize business context, table semantics, and foreign keys -> Expose living markdown data dictionary.
   - *Artifact:* Living Markdown documentation schema detailing tribal business logic and relationship semantics.
   - *Engines:* PostgreSQL, MySQL, Snowflake, ClickHouse.
   - *Compliance:* Enterprise Data Architecture Governance.

6. **Data Lineage**
   - *Workflow:* Parse SQL transformation scripts and dbt DAGs -> Build column-level dependency graph -> Perform impact analysis before migrations.
   - *Artifact:* Column-level dependency graph JSON mapping `raw_transactions` to `mart_financial_reporting`.
   - *Engines:* Snowflake, BigQuery, dbt Core/Cloud, PostgreSQL.
   - *Compliance:* BCBS 239, MAS TRM Section 11 (Change Management).

7. **AI-Enhanced Data Catalog**
   - *Workflow:* Automated semantic tagging -> Business glossary vector indexing -> Instant semantic natural-language search.
   - *Artifact:* Data Catalog metadata JSON registering automated column descriptions and glossary tags.
   - *Engines:* PostgreSQL, Snowflake, ClickHouse, Databricks.
   - *Compliance:* ISO 8000 Data Quality & Governance standards.

8. **Auto-Insights**
   - *Workflow:* Train time-series baseline on metrics -> Detect volume and distribution outliers -> Deliver proactive root-cause summaries.
   - *Artifact:* Anomaly detection event JSON identifying 3.8-sigma drop in daily transactions.
   - *Engines:* Snowflake, ClickHouse, PostgreSQL, BigQuery.
   - *Compliance:* Operational Resilience & Continuous Auditing.

9. **Data Transformations (dbt)**
   - *Workflow:* Natural language transformation prompt -> Auto-generate dbt SQL & `schema.yml` -> Deploy with automated test suite.
   - *Artifact:* Production dbt model SQL and YAML config with automated uniqueness and PII checks.
   - *Engines:* dbt Cloud, dbt Core, Snowflake, PostgreSQL.
   - *Compliance:* Continuous Delivery and Automated Data Ops.

10. **Risk Scoring**
    - *Workflow:* Scan schema configuration and access controls -> Calculate blast-radius risk index -> Deliver prioritized remediation steps.
    - *Artifact:* Database Security & Risk Audit JSON score report (88/100) with prioritized CVSS remediation guidance.
    - *Engines:* PostgreSQL, Snowflake, MySQL, AWS RDS.
    - *Compliance:* MAS TRM Threat Risk Assessment, ISO 27001.

11. **ESG Analytics**
    - *Workflow:* Aggregate cloud compute metrics and supply chain records -> Map to GHG Protocol emission factors -> Export audit-ready ESG report.
    - *Artifact:* SQL query aggregating Scope 2 & 3 compute emissions across multi-cloud infrastructure.
    - *Engines:* Snowflake, BigQuery, PostgreSQL.
    - *Compliance:* SGX Sustainability Reporting Rules, ISSB Standards.

12. **Schema Shifts Detection**
    - *Workflow:* Monitor production schema changes via CDC -> Diff against baseline -> Send breaking-change alerts to downstream consumers.
    - *Artifact:* Schema Migration Diff report highlighting altered column datatypes and dropped indexes.
    - *Engines:* PostgreSQL, MySQL, Snowflake, MongoDB.
    - *Compliance:* Zero-Downtime Migration Governance & Change Auditability.

13. **Data Architect & Optimization**
    - *Workflow:* Analyze slow query logs -> Identify missing indexes and sub-optimal joins -> Auto-generate tuning DDL.
    - *Artifact:* `EXPLAIN ANALYZE` comparison query and composite index creation script yielding 84% latency reduction.
    - *Engines:* PostgreSQL, MySQL, ClickHouse, Snowflake.
    - *Compliance:* Operational Cost & Compute Efficiency.

14. **DPO Toolkit & ASEAN Compliance**
    - *Workflow:* Receive Data Subject Request (DSR) -> Scan table-bound identifiers across connected databases -> Export redacted proof report.
    - *Artifact:* Automated DSR Fulfillment Audit Trail JSON logging complete erasure verification across 7 production tables.
    - *Engines:* All Supported Database Connectors.
    - *Compliance:* Singapore PDPA, Malaysia PDPA (2024 Amendments), Indonesia UU PDP.

---

## 4. Implementation Roadmap

- [x] Phase 1: Multi-Lens Brainstorm & Concept Brief Synthesis
- [ ] Phase 2: Create `src/data/featureDetails.ts` with all 14 complete records
- [ ] Phase 3: Create `src/components/FeatureDetailModal.tsx` with dialog primitives, tabs & copy buttons
- [ ] Phase 4: Wire interactive cards in `src/sections/Features.tsx`
- [ ] Phase 5: Wire `useSearchParams` in `src/pages/Contact.tsx` for seamless topic pre-selection
- [ ] Phase 6: Build verification and cross-device testing
