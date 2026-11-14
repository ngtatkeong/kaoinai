export interface WorkflowStep {
  step: number
  role: string
  title: string
  action: string
}

export interface CodeArtifact {
  type: 'sql' | 'yaml' | 'json' | 'bash'
  title: string
  filename: string
  description: string
  snippet: string
}

export interface ComplianceMapping {
  framework: string
  section: string
  guarantee: string
}

export interface FeatureDetail {
  id: string
  title: string
  category: string
  badge: string
  summary: string
  workflow: WorkflowStep[]
  supportedEngines: string[]
  artifact: CodeArtifact
  compliance: ComplianceMapping[]
  outcomes: string[]
  consultationTopic: string
}

export const featureDetails: Record<string, FeatureDetail> = {
  'data-governance': {
    id: 'data-governance',
    title: 'Data Governance (DG)',
    category: 'Access & Compliance',
    badge: 'Enterprise Security',
    summary: 'Centralized zero-egress governance engine enforcing fine-grained role-based access control, cryptographic field masking, and immutable query audit logs across heterogeneous production databases.',
    workflow: [
      {
        step: 1,
        role: 'Data Architect / Admin',
        title: 'Attach Read-Only Metadata Connector',
        action: 'Configure zero-ingestion metadata agent on internal VPC with read access only to database catalogs (pg_catalog, information_schema). Zero customer payload data is ever copied.'
      },
      {
        step: 2,
        role: 'Data Protection Officer (DPO)',
        title: 'Define Classification & Masking Policies',
        action: 'Map customer identifiers (NRIC, emails, card tokens) to RBAC policies: Full Unmasked for authorized finance officers, SHA-256 pseudonymized for analysts.'
      },
      {
        step: 3,
        role: 'Autonomous System',
        title: 'Dynamic Masking & Audit Enforcement',
        action: 'Transparently enforce dynamic SQL query rewriting and emit tamper-evident audit logs directly to client SIEM or CloudWatch.'
      }
    ],
    supportedEngines: ['PostgreSQL 12+', 'Snowflake Enterprise', 'MySQL 8.0+', 'ClickHouse', 'Google BigQuery'],
    artifact: {
      type: 'yaml',
      title: 'RBAC Dynamic Field Masking Policy',
      filename: 'policies/customer_pii_masking.yml',
      description: 'Declarative YAML policy specifying role-based column visibility and hashing algorithms.',
      snippet: `version: 2
policy_name: customer_pii_protection
target_database: production_core
rules:
  - table: core_banking.customers
    column: national_id_nric
    sensitivity: HIGH_PII
    enforcement:
      role: analytics_reader
      transform: SHA256_SALTED_HASH
      salt_secret_ref: env:KAOIN_SALT_KEY
    exceptions:
      role: dpo_compliance_lead
      transform: FULL_UNMASKED
      audit_log: REQUIRED`
    },
    compliance: [
      {
        framework: 'Singapore PDPA',
        section: 'Section 24 (Protection Obligation)',
        guarantee: 'Ensures technical and security safeguards prevent unauthorized disclosure or extraction of national IDs.'
      },
      {
        framework: 'MAS TRM 2021',
        section: 'Section 11.2 (Access Control & Auditing)',
        guarantee: 'Maintains immutable, non-repudiable audit logs of every database user accessing sensitive banking entities.'
      }
    ],
    outcomes: [
      'Eliminates manual SQL grant sprawl across database servers',
      'Achieves 100% automated audit readiness for SOC 2 Type II and PDPA inspections',
      'Zero application code changes required for dynamic query masking'
    ],
    consultationTopic: 'Data Governance & RBAC Architecture'
  },

  'data-quality': {
    id: 'data-quality',
    title: 'Data Quality (DQ)',
    category: 'Integrity & Monitoring',
    badge: 'Continuous Integrity',
    summary: 'Automated statistical quality monitoring that validates row-level constraints, detects distribution drift, and blocks corrupted data before it pollutes downstream financial reporting marts.',
    workflow: [
      {
        step: 1,
        role: 'Data Engineer',
        title: 'Deploy Declarative Integrity Assertions',
        action: 'Apply out-of-the-box regex assertions for Singapore NRIC/UEN formats, check non-null foreign keys, and establish acceptable threshold bands.'
      },
      {
        step: 2,
        role: 'KaoinAI Engine',
        title: 'In-Stream Micro-Batch Evaluation',
        action: 'Execute zero-copy SQL assertion scans during ingestion or scheduled cron intervals without saturating database IOPS.'
      },
      {
        step: 3,
        role: 'On-Call Engineer / DPO',
        title: 'Automated Root-Cause Quarantining',
        action: 'Receive real-time Slack/Teams webhook alerts with failing row sample IDs and automated remediation recommendations.'
      }
    ],
    supportedEngines: ['PostgreSQL', 'Snowflake', 'MySQL', 'ClickHouse', 'Amazon Redshift'],
    artifact: {
      type: 'yaml',
      title: 'Automated Data Quality Rule Definition',
      filename: 'rules/singapore_customer_dq.yml',
      description: 'Declarative data quality rules checking Singapore UEN/NRIC validity and transactional balance bounds.',
      snippet: `version: 1
dataset: transactions_ledger
assertions:
  - id: check_account_balance_non_negative
    type: expression
    sql_rule: "balance_amount >= 0.00"
    severity: CRITICAL
    action_on_failure: [ALERT_SLACK, QUARANTINE_BATCH]

  - id: check_nric_format_singapore
    type: regex
    column: customer_nric
    pattern: "^[STFGM][0-9]{7}[A-Z]$"
    threshold: 0.999
    severity: HIGH`
    },
    compliance: [
      {
        framework: 'Singapore PDPA',
        section: 'Section 23 (Accuracy Obligation)',
        guarantee: 'Guarantees reasonable efforts to ensure personal data used for business decisions is accurate and complete.'
      },
      {
        framework: 'MAS TRM',
        section: 'Section 10.1 (Data Integrity Standards)',
        guarantee: 'Continuous verification prevents silent ledger corruption and unindexed null reference propagation.'
      }
    ],
    outcomes: [
      'Reduces data pipeline debugging time from 3 days to under 15 minutes',
      'Catches 99.4% of malformed entity payloads prior to analytical warehouse loading',
      'Provides automated compliance export verifying ledger accuracy'
    ],
    consultationTopic: 'Data Quality & Autonomous Assertions'
  },

  'master-data-management': {
    id: 'master-data-management',
    title: 'Master Data Management (MDM)',
    category: 'Entity Resolution',
    badge: 'Golden Record Engine',
    summary: 'Probabilistic record deduplication and cross-system entity reconciliation that merges fragmented customer and product entries into a single, verifiable Golden Record.',
    workflow: [
      {
        step: 1,
        role: 'Data Architect',
        title: 'Register Source System Schemas',
        action: 'Map entity identifier columns across Salesforce CRM, PostgreSQL transaction db, and Stripe payment gateway.'
      },
      {
        step: 2,
        role: 'KaoinAI Deduplication Engine',
        title: 'Execute Probabilistic Matching',
        action: 'Run Jaro-Winkler, Levenshtein, and exact tax ID clustering algorithms to calculate match confidence scores across datasets.'
      },
      {
        step: 3,
        role: 'Business Operator',
        title: 'Publish Golden Record Views',
        action: 'Auto-merge high-confidence clusters (>95%) into unified customer master views with source lineage and survivorship rules.'
      }
    ],
    supportedEngines: ['PostgreSQL', 'Snowflake', 'SQL Server', 'ClickHouse', 'BigQuery'],
    artifact: {
      type: 'sql',
      title: 'Golden Record Survivorship SQL Model',
      filename: 'models/mdm/customer_golden_record.sql',
      description: 'SQL transformation resolving customer identities across legacy CRM and modern payment databases.',
      snippet: `WITH entity_clusters AS (
  SELECT 
    cluster_id,
    COALESCE(crm.email, stripe.customer_email) AS canonical_email,
    COALESCE(crm.legal_name, billing.company_name) AS canonical_name,
    ROW_NUMBER() OVER (
      PARTITION BY cluster_id 
      ORDER BY crm.updated_at DESC
    ) AS survivorship_rank
  FROM staging_raw_entities
)
SELECT 
  cluster_id AS golden_record_id,
  canonical_email,
  canonical_name,
  CURRENT_TIMESTAMP AS consolidated_at
FROM entity_clusters
WHERE survivorship_rank = 1;`
    },
    compliance: [
      {
        framework: 'Singapore PDPA',
        section: 'Section 23 (Accuracy) & Section 25 (Retention)',
        guarantee: 'Eliminates orphaned customer duplicate records that cause accidental marketing outreach post-consent withdrawal.'
      }
    ],
    outcomes: [
      'Consolidates multi-source customer duplicates by up to 42%',
      'Eliminates duplicate billing errors and fragmented customer communication',
      'Provides full cryptographic trace for every surviving master record attribute'
    ],
    consultationTopic: 'Master Data Management (MDM) Setup'
  },

  'table-bound-dpia': {
    id: 'table-bound-dpia',
    title: 'Table-Bound DPIA & Data Inventory',
    category: 'Compliance & Governance',
    badge: 'Zero-Stale-Spreadsheets',
    summary: 'Binds statutory Data Protection Impact Assessments (DPIAs) and living Records of Processing Activities (RoPA) directly to database tables, triggering automated drift alerts when schemas evolve.',
    workflow: [
      {
        step: 1,
        role: 'Database Administrator',
        title: 'Bind Legal DPIA Metadata to DDL',
        action: 'Embed statutory lawful basis, retention schedules, and classification tags directly into PostgreSQL/Snowflake schema comments.'
      },
      {
        step: 2,
        role: 'KaoinAI CDC Agent',
        title: 'Monitor Continuous Schema Evolution',
        action: 'Detect newly committed migration DDLs (ALTER TABLE, ADD COLUMN). Inspect column names and sample entropy for unclassified PII.'
      },
      {
        step: 3,
        role: 'Data Protection Officer (DPO)',
        title: 'Review Living RoPA Dashboard',
        action: 'Generate one-click statutory RoPA exports with exact table, column, and storage location timestamps for PDPC audit compliance.'
      }
    ],
    supportedEngines: ['PostgreSQL 11+', 'Snowflake', 'MySQL 8+', 'ClickHouse'],
    artifact: {
      type: 'sql',
      title: 'Schema-Bound DPIA DDL Migration Script',
      filename: 'migrations/V042__bind_dpia_metadata.sql',
      description: 'DDL script applying machine-readable compliance metadata directly to production database tables.',
      snippet: `-- Bind statutory legal basis and retention directly to table catalog
COMMENT ON TABLE core.customer_kyc IS 
  'DPIA_REF:SG-DPIA-2026-08|LEGAL_BASIS:PDPA_CONSENT|RETENTION_DAYS:1825';

-- Bind classification tag to sensitive column
COMMENT ON COLUMN core.customer_kyc.id_document_scan IS 
  'PII_TYPE:NATIONAL_ID|SENSITIVITY:CONFIDENTIAL_RESTRICTED|MASKING:ENCRYPTED_BLOB';

-- Verify binding in information schema
SELECT table_name, column_name, column_comment 
FROM information_schema.columns 
WHERE column_comment LIKE '%PII_TYPE%';`
    },
    compliance: [
      {
        framework: 'Singapore PDPA',
        section: 'Section 12 (Data Protection Policies) & RoPA',
        guarantee: 'Maintains an auditable, real-time inventory of all personal data holdings without manual spreadsheet audits.'
      },
      {
        framework: 'GDPR',
        section: 'Article 30 (Records of Processing Activities)',
        guarantee: 'Automatically maps categories of data subjects and legal processing grounds directly to underlying storage.'
      }
    ],
    outcomes: [
      'Eliminates 100% of outdated compliance spreadsheets across engineering teams',
      'Triggers instant alert if a developer adds an unmasked customer email or phone column',
      'Export audit-ready RoPA in under 60 seconds during regulatory inquiry'
    ],
    consultationTopic: 'Table-Bound DPIA & Living RoPA Architecture'
  },

  'ai-db-knowledgebase': {
    id: 'ai-db-knowledgebase',
    title: 'AI-Aided DB Knowledgebase',
    category: 'Metadata & Semantics',
    badge: 'Living Schema Intelligence',
    summary: 'Autonomous database knowledge graph that synthesizes tribal schema logic, undocumented foreign key relations, and business glossaries so engineers understand datasets instantly.',
    workflow: [
      {
        step: 1,
        role: 'Data Team',
        title: 'Scan Query History & ERDs',
        action: 'Analyze query logs, stored procedures, and join frequencies to reconstruct hidden entity relationships and business naming patterns.'
      },
      {
        step: 2,
        role: 'AI Schema Synthesizer',
        title: 'Generate Living Data Dictionary',
        action: 'Produce structured, plain-English documentation explaining column abbreviations, status code enums (e.g., status=4 means "Paid"), and join dependencies.'
      },
      {
        step: 3,
        role: 'Product / BI Engineers',
        title: 'Query with Natural Semantic Context',
        action: 'Search database definitions using natural English queries to identify exact authoritative tables without asking senior developers.'
      }
    ],
    supportedEngines: ['PostgreSQL', 'Snowflake', 'MySQL', 'ClickHouse', 'Databricks'],
    artifact: {
      type: 'yaml',
      title: 'Synthesized Schema Knowledge Schema',
      filename: 'knowledgebase/orders_mart.yml',
      description: 'AI-generated living documentation mapping cryptic schema codes to business definitions.',
      snippet: `table: analytics_marts.fct_orders
business_name: "Unified Completed Orders Ledger"
description: "Authoritative mart for net recognized revenue, filtered for settled checkout flows."
business_rules:
  - column: order_status_code
    meaning:
      "0": "Draft Created"
      "1": "Payment Pending"
      "2": "Settled & Shipped (Count as Revenue)"
      "9": "Refunded / Disputed"
join_recommendations:
  - target_table: dim_merchants
    recommended_join: "ON fct_orders.m_id = dim_merchants.merchant_uuid"
    cardinality: "many-to-one"`
    },
    compliance: [
      {
        framework: 'BCBS 239 / MAS TRM',
        section: 'Section 4 (Data Architecture & IT Infrastructure)',
        guarantee: 'Ensures clear data definitions and data dictionaries exist for all critical risk reporting assets.'
      }
    ],
    outcomes: [
      'Reduces new data engineer onboarding from 4 weeks to 2 days',
      'Eliminates incorrect SQL joins and corrupted executive BI dashboards',
      'Preserves institutional schema knowledge across developer turnover'
    ],
    consultationTopic: 'AI-Aided DB Knowledgebase Implementation'
  },

  'data-lineage': {
    id: 'data-lineage',
    title: 'Data Lineage',
    category: 'Traceability & Pipelines',
    badge: 'Column-Level Trace',
    summary: 'End-to-end column-level lineage visualization and impact analysis. Trace upstream raw ingestion tables, intermediate dbt transforms, and final BI/ML consumer endpoints.',
    workflow: [
      {
        step: 1,
        role: 'Continuous Parser',
        title: 'Parse SQL Dialects & dbt DAGs',
        action: 'Automatically extract column-level transformations, CAST statements, and aggregations across SQL files and view definitions.'
      },
      {
        step: 2,
        role: 'Lineage Graph Engine',
        title: 'Construct Directed Acyclic Graph (DAG)',
        action: 'Render interactive node-and-edge graphs showing how a specific column (e.g., adjusted_ebitda) is computed from 4 upstream source tables.'
      },
      {
        step: 3,
        role: 'Data Engineer / Release Lead',
        title: 'Pre-Migration Blast Radius Analysis',
        action: 'Check upstream schema changes against downstream Tableau dashboards and APIs before merging PRs to prevent breaking reports.'
      }
    ],
    supportedEngines: ['Snowflake', 'BigQuery', 'dbt Core / Cloud', 'PostgreSQL', 'Databricks'],
    artifact: {
      type: 'json',
      title: 'Column-Level Lineage Graph Node Payload',
      filename: 'lineage/column_dependency_graph.json',
      description: 'JSON node-and-edge definition tracing financial column calculation across data pipelines.',
      snippet: `{
  "target_column": "fct_revenue.net_amount_sgd",
  "upstream_dependencies": [
    {
      "source_table": "raw_stripe.charges",
      "source_column": "amount_cents",
      "transformation": "amount_cents / 100.0"
    },
    {
      "source_table": "raw_fx.rates",
      "source_column": "usd_sgd_rate",
      "transformation": "* usd_sgd_rate"
    }
  ],
  "downstream_consumers": [
    "tableau_cfo_monthly_dashboard",
    "mas_regulatory_liquidity_pipeline"
  ]
}`
    },
    compliance: [
      {
        framework: 'MAS TRM 2021',
        section: 'Section 11 (Change Management & System Development)',
        guarantee: 'Mandates full visibility into data interdependencies to verify changes do not cause systemic calculation failures.'
      }
    ],
    outcomes: [
      'Zero broken Monday morning executive dashboards caused by silent upstream schema migrations',
      'Instant regulatory audit trace proving origin and transformation of reported financial numbers',
      'Precise column deprecation alerts pinpointing affected downstream consumers'
    ],
    consultationTopic: 'Column-Level Lineage & Impact Analysis'
  },

  'data-catalog': {
    id: 'data-catalog',
    title: 'AI-Enhanced Data Catalog',
    category: 'Discovery & Search',
    badge: 'Semantic Search Engine',
    summary: 'Self-indexing enterprise data catalog equipped with natural language vector search, auto-generated business glossaries, and automated data asset ownership tracking.',
    workflow: [
      {
        step: 1,
        role: 'KaoinAI Crawler',
        title: 'Autonomous Metadata Crawling',
        action: 'Periodically crawl database schemas, column statistics, query frequencies, and user access patterns without reading raw rows.'
      },
      {
        step: 2,
        role: 'Embedding & Semantic Indexing',
        title: 'Vectorize Schema Semantics',
        action: 'Index table descriptions and business synonyms into dense vector embeddings for instantaneous semantic search.'
      },
      {
        step: 3,
        role: 'Analyst / Product Owner',
        title: 'Natural Language Search & Discovery',
        action: 'Type queries like "Where is customer churn stored?" to retrieve authoritative tables, ownership contacts, and query samples.'
      }
    ],
    supportedEngines: ['PostgreSQL', 'Snowflake', 'ClickHouse', 'MySQL', 'BigQuery'],
    artifact: {
      type: 'json',
      title: 'Catalog Asset Registration Schema',
      filename: 'catalog/registered_asset.json',
      description: 'Metadata descriptor indexing table ownership, semantic tags, and freshness SLA.',
      snippet: `{
  "asset_urn": "urn:kaoin:postgres:core_db:analytics:fct_customer_retention",
  "owner": "growth_data_team@kaoinai.com",
  "semantic_tags": ["customer_success", "churn_risk", "sg_market"],
  "freshness_sla_hours": 6,
  "pii_classification": "PSEUDONYMIZED",
  "sample_query": "SELECT cohort_month, churn_rate FROM fct_customer_retention WHERE churn_rate > 0.05;"
}`
    },
    compliance: [
      {
        framework: 'ISO/IEC 38505',
        section: 'Governance of Data Standards',
        guarantee: 'Ensures systematic cataloging, ownership assignment, and accountability across enterprise data assets.'
      }
    ],
    outcomes: [
      'Reduces time spent searching for internal data tables by 75%',
      'Single source of truth for business terms across technical and commercial teams',
      'Automated data asset owner notifications when tables become stale'
    ],
    consultationTopic: 'Enterprise Data Catalog Implementation'
  },

  'auto-insights': {
    id: 'auto-insights',
    title: 'Auto-Insights',
    category: 'Analytics & Intelligence',
    badge: 'Proactive Anomaly Alerts',
    summary: 'Proactive anomaly detection and statistical trend evaluation that spots database volume deviations, revenue dips, and distribution skews before business impact occurs.',
    workflow: [
      {
        step: 1,
        role: 'Data Architect',
        title: 'Select Metric Tables for Profiling',
        action: 'Designate business-critical transaction or operational tables for automated statistical baseline modeling.'
      },
      {
        step: 2,
        role: 'KaoinAI Statistics Engine',
        title: 'Compute Multi-Seasonality Baselines',
        action: 'Train moving-window statistical models that account for day-of-week seasonality, month-end spikes, and normal variance.'
      },
      {
        step: 3,
        role: 'Operations & Engineering',
        title: 'Automated Root-Cause Alerts',
        action: 'Receive prioritized alert cards highlighting anomalous metric drops alongside correlated database dimension changes.'
      }
    ],
    supportedEngines: ['Snowflake', 'ClickHouse', 'PostgreSQL', 'BigQuery'],
    artifact: {
      type: 'json',
      title: 'Statistical Anomaly Detection Alert Payload',
      filename: 'alerts/anomaly_event_38sigma.json',
      description: 'Webhook event dispatched to Slack when daily payments dip below the expected statistical floor.',
      snippet: `{
  "alert_id": "ALT-202611-0941",
  "metric_monitored": "daily_completed_orders_count",
  "observed_value": 4120,
  "expected_baseline": 9850,
  "confidence_interval": [9200, 10500],
  "z_score": -3.84,
  "probable_root_cause": "Database connection drop observed on payment_gateway_service starting 03:14 UTC"
}`
    },
    compliance: [
      {
        framework: 'MAS TRM 2021',
        section: 'Section 12.1 (System Performance & Capacity Management)',
        guarantee: 'Proactive anomaly tracking enables rapid detection of operational degradation before system outages occur.'
      }
    ],
    outcomes: [
      'Detects revenue-impacting pipeline drops within 15 minutes of occurrence',
      'Eliminates false-positive alarm fatigue via intelligent seasonality modeling',
      'Accelerates mean time to root cause (MTTR) by 60%'
    ],
    consultationTopic: 'Proactive Auto-Insights & Anomaly Monitoring'
  },

  'dbt-transformations': {
    id: 'dbt-transformations',
    title: 'Data Transformations (dbt)',
    category: 'Engineering & Delivery',
    badge: 'Natural Language dbt Engine',
    summary: 'Transform raw database schemas into production dbt models using natural language instructions. Auto-generates modular SQL, YAML documentation, and automated tests in one step.',
    workflow: [
      {
        step: 1,
        role: 'Analytics Engineer',
        title: 'Provide Natural Language Prompt',
        action: 'Describe the transformation objective (e.g., "Build a monthly recurring revenue mart combining stripe subscriptions and churn events").'
      },
      {
        step: 2,
        role: 'KaoinAI Code Generator',
        title: 'Synthesize Verified SQL & YAML',
        action: 'Generate modular SQL with proper CTEs, surrogate keys, and accompanying schema.yml containing documentation and unit tests.'
      },
      {
        step: 3,
        role: 'CI/CD Pipeline',
        title: 'Deploy to dbt Core / Cloud',
        action: 'Execute dbt run and dbt test via Git repository pull request with automated schema validation checks.'
      }
    ],
    supportedEngines: ['dbt Core 1.7+', 'dbt Cloud', 'Snowflake', 'PostgreSQL', 'BigQuery'],
    artifact: {
      type: 'sql',
      title: 'Synthesized dbt Model with PII Tags',
      filename: 'models/marts/fct_monthly_subscription_mrr.sql',
      description: 'Modular dbt SQL model with CTEs, surrogate keys, and built-in schema assertions.',
      snippet: `WITH active_subscriptions AS (
  SELECT 
    subscription_id,
    customer_id,
    plan_tier,
    amount_monthly,
    created_at
  FROM {{ ref('stg_stripe_subscriptions') }}
  WHERE status = 'active'
),
aggregated_mrr AS (
  SELECT 
    DATE_TRUNC('month', created_at) AS mrr_month,
    plan_tier,
    COUNT(DISTINCT customer_id) AS active_subscribers,
    SUM(amount_monthly) AS total_mrr_sgd
  FROM active_subscriptions
  GROUP BY 1, 2
)
SELECT * FROM aggregated_mrr;`
    },
    compliance: [
      {
        framework: 'SOC 2 Type II',
        section: 'CC 8.1 (Change Control & Code Reviews)',
        guarantee: 'Ensures all database transformations are version-controlled, test-backed, and peer-reviewed via Git pull requests.'
      }
    ],
    outcomes: [
      'Accelerates dbt model authoring speed by 5x',
      'Guarantees 100% test coverage on newly deployed analytical tables',
      'Auto-attaches PII classification tags into dbt model documentation'
    ],
    consultationTopic: 'Automated dbt Transformations & DataOps'
  },

  'risk-scoring': {
    id: 'risk-scoring',
    title: 'Risk Scoring',
    category: 'Security & Assessment',
    badge: 'Database Blast Radius',
    summary: 'Automated risk scoring that evaluates database configurations, public exposure risks, unmasked PII density, and unencrypted columns to compute an actionable security score.',
    workflow: [
      {
        step: 1,
        role: 'Security Engineer',
        title: 'Run Automated Security & Config Audit',
        action: 'Scan database parameters: SSL/TLS encryption in transit, storage encryption at rest, public CIDR ingress, and default credential usage.'
      },
      {
        step: 2,
        role: 'KaoinAI Risk Scorer',
        title: 'Calculate Table Blast Radius',
        action: 'Weight table importance based on row counts, PII volume, and active user query connections to generate a 0-100 risk grade.'
      },
      {
        step: 3,
        role: 'Engineering Lead / DPO',
        title: 'Execute Prioritized Remediation',
        action: 'Receive step-by-step remediation commands to resolve critical exposures before external penetration tests or audits.'
      }
    ],
    supportedEngines: ['PostgreSQL', 'Snowflake', 'MySQL', 'AWS RDS / Aurora', 'ClickHouse'],
    artifact: {
      type: 'json',
      title: 'Database Risk Evaluation Audit Report',
      filename: 'security/database_risk_evaluation.json',
      description: 'Audit output evaluating database vulnerability exposure and prioritized mitigation steps.',
      snippet: `{
  "audit_target": "db-production-sg-primary.kaoinai.internal",
  "overall_security_score": 88,
  "posture_grade": "A-",
  "critical_vulnerabilities": 0,
  "high_findings": 1,
  "findings": [
    {
      "severity": "HIGH",
      "code": "UNMASKED_PII_IN_STAGING",
      "table": "staging.customer_previews",
      "remediation": "Apply table masking policy or purge staging records older than 48 hours"
    }
  ]
}`
    },
    compliance: [
      {
        framework: 'MAS TRM 2021',
        section: 'Section 13 (Threat & Vulnerability Assessment)',
        guarantee: 'Conducts regular risk assessments to identify technical weaknesses in sensitive database storage.'
      }
    ],
    outcomes: [
      'Eliminates unmasked PII leakage into non-production staging environments',
      'Provides instant executive report for board-level cybersecurity audits',
      'Quantifies database risk reduction over time with continuous grading'
    ],
    consultationTopic: 'Database Risk Scoring & Security Audit'
  },

  'esg-analytics': {
    id: 'esg-analytics',
    title: 'ESG Analytics',
    category: 'Sustainability & Reporting',
    badge: 'Scope 1-3 Tracking',
    summary: 'Track, compute, and report Environmental, Social, and Governance (ESG) database compute carbon footprints and organizational metrics aligned with SGX and global standards.',
    workflow: [
      {
        step: 1,
        role: 'Sustainability Lead',
        title: 'Connect Cloud & Compute Telemetry',
        action: 'Ingest AWS CloudWatch, Snowflake query credit logs, and data warehouse usage hours.'
      },
      {
        step: 2,
        role: 'Carbon Accounting Engine',
        title: 'Apply GHG Protocol Grid Emission Factors',
        action: 'Calculate Scope 2 electricity emissions using Singapore Energy Market Authority (EMA) regional carbon intensity coefficients.'
      },
      {
        step: 3,
        role: 'Corporate Governance Team',
        title: 'Export Audit-Ready Disclosures',
        action: 'Generate SGX-compliant ESG disclosure reports with verified calculation methodologies and historical baselines.'
      }
    ],
    supportedEngines: ['Snowflake', 'BigQuery', 'PostgreSQL', 'ClickHouse'],
    artifact: {
      type: 'sql',
      title: 'Compute Carbon Footprint Aggregation SQL',
      filename: 'esg/compute_carbon_footprint.sql',
      description: 'SQL query aggregating data warehouse compute credit emissions into metric tons of CO2e.',
      snippet: `SELECT 
  DATE_TRUNC('month', start_time) AS report_month,
  warehouse_name,
  SUM(credits_used) AS total_credits_consumed,
  ROUND(SUM(credits_used) * 0.408, 3) AS estimated_kwh, -- kWh per Snowflake credit
  ROUND(SUM(credits_used) * 0.408 * 0.4168 / 1000, 4) AS emissions_tco2e -- SG Grid Emission Factor
FROM snowflake.account_usage.warehouse_metering_history
WHERE start_time >= DATEADD(month, -12, CURRENT_DATE())
GROUP BY 1, 2
ORDER BY 1 DESC;`
    },
    compliance: [
      {
        framework: 'SGX Sustainability Reporting',
        section: 'Core ESG Metrics (Climate-Related Disclosures)',
        guarantee: 'Aligns Scope 2 greenhouse gas calculation directly with Task Force on Climate-related Financial Disclosures (TCFD).'
      }
    ],
    outcomes: [
      'Automates 100% of cloud data compute carbon accounting for annual reports',
      'Identifies inefficient recurring SQL queries responsible for 30%+ excess carbon burn',
      'Generates verified audit documentation for institutional ESG investors'
    ],
    consultationTopic: 'ESG Analytics & Cloud Carbon Accounting'
  },

  'schema-shifts': {
    id: 'schema-shifts',
    title: 'Schema Shifts Detection',
    category: 'Evolution & Drift',
    badge: 'Zero-Downtime Governance',
    summary: 'Continuous Change Data Capture (CDC) monitoring that detects breaking database changes, dropped columns, and unannounced datatype migrations before downstream consumers crash.',
    workflow: [
      {
        step: 1,
        role: 'Autonomous CDC Monitor',
        title: 'Track Catalog Schema Snapshots',
        action: 'Periodically take lightweight cryptographic fingerprints of table schemas and column definitions.'
      },
      {
        step: 2,
        role: 'Diff Engine',
        title: 'Compare Against Production Baseline',
        action: 'Detect structural modifications: column drops, datatype shrinks (e.g., VARCHAR(255) to VARCHAR(50)), and index removals.'
      },
      {
        step: 3,
        role: 'Release / DevOps Team',
        title: 'Pre-Emptive Pipeline Protection',
        action: 'Dispatch alerts directly into GitHub pull requests or CI pipelines before migrations are executed against live databases.'
      }
    ],
    supportedEngines: ['PostgreSQL', 'MySQL', 'Snowflake', 'MongoDB', 'ClickHouse'],
    artifact: {
      type: 'json',
      title: 'Automated Schema Migration Diff Alert',
      filename: 'schema_drift/shift_alert_event.json',
      description: 'Automated alert payload detailing breaking schema alterations detected in staging.',
      snippet: `{
  "event_type": "SCHEMA_DRIFT_DETECTED",
  "database": "production_crm",
  "table": "public.orders",
  "breaking_changes": [
    {
      "change": "COLUMN_TYPE_ALTERED",
      "column": "order_uuid",
      "previous_type": "UUID",
      "new_type": "VARCHAR(36)",
      "impact": "HIGH - May break downstream strict foreign key validation"
    }
  ],
  "author_git_commit": "e93fa01",
  "suggested_action": "Verify downstream ORM model compatibility before executing DDL"
}`
    },
    compliance: [
      {
        framework: 'MAS TRM 2021',
        section: 'Section 11.1 (Change Control Procedure)',
        guarantee: 'Ensures changes to database structures are systematically tracked, approved, and auditable.'
      }
    ],
    outcomes: [
      'Prevents unexpected application downtime caused by uncoordinated schema migrations',
      'Eliminates silent data truncation caused by incompatible column datatype alterations',
      'Creates permanent historical audit trail of all database structural changes'
    ],
    consultationTopic: 'Schema Shift Detection & Drift Prevention'
  },

  'data-architect': {
    id: 'data-architect',
    title: 'Data Architect & Optimization',
    category: 'Performance & Tuning',
    badge: 'Autonomous Tuning',
    summary: 'Autonomous database architecture optimization that identifies missing composite indexes, sub-optimal query joins, and high-contention locks to slash compute spend by up to 84%.',
    workflow: [
      {
        step: 1,
        role: 'Telemetry Collector',
        title: 'Aggregate pg_stat_statements & Query Logs',
        action: 'Inspect top slow queries, full table scan rates, index cache hit ratios, and CPU saturation metrics.'
      },
      {
        step: 2,
        role: 'Autonomous Architect Engine',
        title: 'Synthesize Indexing Recommendations',
        action: 'Formulate non-blocking composite index recommendations (`CREATE INDEX CONCURRENTLY`) based on actual WHERE and ORDER BY clauses.'
      },
      {
        step: 3,
        role: 'Database Administrator',
        title: 'Review Simulated Query Plan Comparison',
        action: 'Inspect side-by-side `EXPLAIN ANALYZE` execution plans showing estimated I/O reduction before approving rollout.'
      }
    ],
    supportedEngines: ['PostgreSQL 12+', 'MySQL 8.0+', 'ClickHouse', 'Snowflake'],
    artifact: {
      type: 'sql',
      title: 'EXPLAIN ANALYZE Optimization Comparison',
      filename: 'optimization/index_recommendation.sql',
      description: 'Recommended concurrent composite index script with before-and-after cost proof.',
      snippet: `-- BEFORE: Execution Time: 4,820 ms (Full Table Scan on 18M rows)
-- RECOMMENDATION: Non-blocking composite index targeting customer queries
CREATE INDEX CONCURRENTLY idx_orders_customer_status_created 
ON public.orders (customer_id, order_status, created_at DESC);

-- AFTER: Execution Time: 34 ms (Bitmap Index Scan)
-- RESULT: 99.3% reduction in execution latency, 84% reduction in buffer reads.`
    },
    compliance: [
      {
        framework: 'MAS TRM 2021',
        section: 'Section 12.2 (System Capacity & Performance Planning)',
        guarantee: 'Proactive database tuning prevents resource exhaustion during sudden market or transactional volume surges.'
      }
    ],
    outcomes: [
      'Cuts cloud database compute bill by 40% to 84%',
      'Eliminates database connection pool exhaustion and 504 gateway timeouts',
      'Provides non-blocking DDL tuning scripts ready for zero-downtime execution'
    ],
    consultationTopic: 'Database Architecture & Query Optimization'
  },

  'dpo-toolkit': {
    id: 'dpo-toolkit',
    title: 'DPO Toolkit & ASEAN Compliance',
    category: 'Regulatory & Legal',
    badge: 'Statutory DPO Workflow',
    summary: 'Dedicated Data Protection Officer toolkit covering Singapore PDPA, Malaysia PDPA (2024 Amendments), and Indonesia UU PDP. Automates Data Subject Access Requests (DSAR) and breach notifications.',
    workflow: [
      {
        step: 1,
        role: 'Data Protection Officer (DPO)',
        title: 'Log Inbound Data Subject Request (DSAR)',
        action: 'Record access, correction, or consent withdrawal request with statutory response deadline tracking (30 days for Singapore PDPA).'
      },
      {
        step: 2,
        role: 'KaoinAI Scanner',
        title: 'Cross-Database PII Discovery & Assembly',
        action: 'Query all connected databases for the subject identifiers (NRIC, passport, phone) and assemble complete data lineage extract.'
      },
      {
        step: 3,
        role: 'DPO / Compliance Lead',
        title: 'Execute Proof of Erasure / Export',
        action: 'Download verified regulatory proof packet documenting compliant deletion, masking, or data return across all production systems.'
      }
    ],
    supportedEngines: ['All Supported Connectors (Postgres, Snowflake, MySQL, ClickHouse)'],
    artifact: {
      type: 'json',
      title: 'Automated DSAR Erasure Audit Proof Packet',
      filename: 'compliance/dsar_erasure_audit_trail.json',
      description: 'Audit record verifying complete statutory erasure of personal identifiers across production databases.',
      snippet: `{
  "dsar_case_id": "SG-DSAR-2026-0182",
  "request_type": "RIGHT_TO_ERASURE_CONSENT_WITHDRAWAL",
  "statutory_framework": "SINGAPORE_PDPA_2012_AMENDED",
  "subject_identifier_sha256": "4b92e7d81a9...",
  "verified_actions": [
    {
      "database": "core_postgres",
      "table": "customer_contacts",
      "action": "DELETED",
      "rows_affected": 1
    },
    {
      "database": "snowflake_dw",
      "table": "analytics_customer_marts",
      "action": "MASKED_WITH_DUMMY_TOKEN",
      "rows_affected": 38
    }
  ],
  "dpo_signoff": "Ng Tat Keong (DPO)"
}`
    },
    compliance: [
      {
        framework: 'Singapore PDPA 2012',
        section: 'Section 21 (Access), Section 22 (Correction) & Section 25 (Retention)',
        guarantee: 'Ensures statutory compliance with Data Subject Access & Erasure requests within mandatory legal timeframes.'
      },
      {
        framework: 'Malaysia PDPA (2024)',
        section: 'Right to Data Portability & Mandatory Breach Notification',
        guarantee: 'Supports regional ASEAN cross-border privacy requirements across Singapore, Malaysia, and Indonesia.'
      }
    ],
    outcomes: [
      'Reduces DSAR fulfillment effort from 2 weeks of engineering triage to under 10 minutes',
      'Eliminates legal exposure and financial penalties under PDPA Section 48J',
      'Provides verifiable cryptographic proof of erasure for regulatory inspectors'
    ],
    consultationTopic: 'DPO Toolkit & ASEAN Compliance Setup'
  }
}
