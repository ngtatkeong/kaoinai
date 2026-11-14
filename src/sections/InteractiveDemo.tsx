import { useState } from 'react'
import { 
  Terminal, 
  Database, 
  GitFork, 
  ShieldAlert, 
  TrendingUp, 
  Users, 
  Play, 
  Copy, 
  Check, 
  Sparkles, 
  ArrowRight,
  Clock,
  CheckCircle2,
  ShieldCheck,
  RefreshCw
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { trackEvent } from '@/lib/analytics'
import { getWhatsAppUrl } from '@/lib/whatsapp'

interface Scenario {
  id: string
  title: string
  category: string
  icon: typeof Users
  badgeColor: string
  prompt: string
  executionTime: string
  confidenceScore: string
  summary: string
  insights: string[]
  sql: string
  lineage: {
    sources: string[]
    transformation: string
    destination: string
    latency: string
  }
}

const scenarios: Scenario[] = [
  {
    id: 'pii-masking',
    title: 'Automated PII Masking & Hashing',
    category: 'Zero-Egress Security',
    icon: ShieldCheck,
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    prompt: 'Scan PostgreSQL kyc_records and Snowflake analytics_mart for Singapore NRIC/FIN, phone numbers, and PAN; enforce dynamic SHA-256 masking.',
    executionTime: 'Down to 142ms*',
    confidenceScore: 'Up to 99.9%*',
    summary: 'Scanned 1.4M rows across 12 staging & analytics tables. Detected 4 unmasked PII columns (NRIC, FIN, phone, PAN). Automatically provisioned dynamic SHA-256 view policies without disrupting upstream ingestion.',
    insights: [
      'PostgreSQL Schema: Enforced deterministic HMAC-SHA256 tokenization on public.customers.nric_fin with Modulo-11 checksum verification',
      'Snowflake Role Policy: Dynamic MASKING POLICY sg_pii_mask applied to staging_leads.phone_number and card_pan for analyst roles',
      'Zero-Egress Guarantee: Masking transformation executed entirely inside customer VPC kernel with 0 external LLM transmission'
    ],
    sql: `/* Scenario 1: Automated PII Masking & Dynamic Hashing (PostgreSQL / Snowflake) */
-- Step 1: Detect unmasked PII across structured catalogs
SELECT 
  table_schema, 
  table_name, 
  column_name, 
  data_type,
  kaoinai.detect_pii_pattern(column_name, sample_data) AS detected_pii_type,
  kaoinai.entropy_score(sample_data) AS entropy_confidence
FROM information_schema.columns
WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
  AND kaoinai.detect_pii_pattern(column_name, sample_data) IN ('SG_NRIC', 'SG_FIN', 'PHONE_SG', 'CREDIT_CARD_PAN');

-- Step 2: Inject zero-egress dynamic SHA-256 masking policy
CREATE OR REPLACE MASKING POLICY pii_sha256_mask AS (val STRING) 
RETURNS STRING ->
  CASE 
    WHEN CURRENT_ROLE() IN ('COMPLIANCE_OFFICER', 'DPO_ADMIN') THEN val
    WHEN val RLIKE '^[STFGM][0-9]{7}[A-Z]$' THEN 
      SUBSTR(val, 1, 1) || '*****' || SUBSTR(val, 7, 3) -- Masked NRIC: S*****123A
    ELSE SHA2(CONCAT(val, CURRENT_ACCOUNT_SALT()), 256)
  END;

-- Step 3: Apply masking policy concurrently to target columns
ALTER TABLE public.customers MODIFY COLUMN nric_fin SET MASKING POLICY pii_sha256_mask;
ALTER TABLE public.customers MODIFY COLUMN phone_number SET MASKING POLICY pii_sha256_mask;`,
    lineage: {
      sources: ['PostgreSQL (rds_prod.customer_kyc)', 'Snowflake (staging_leads)'],
      transformation: 'KaoinAI Zero-Egress Kernel & HMAC-SHA256 Tokenizer',
      destination: 'Compliant Analytics Mart (finance_bi.customers_masked)',
      latency: 'Continuous sync (down to 142ms*)'
    }
  },
  {
    id: 'dpia-drift',
    title: 'Table-Bound DPIA & Schema Drift',
    category: 'Privacy by Design',
    icon: ShieldAlert,
    badgeColor: 'bg-red-100 text-red-800 border-red-200',
    prompt: 'Audit all production database tables against statutory DPIA records; detect schema drift when new sensitive biometric or financial fields are migrated.',
    executionTime: 'Down to 118ms*',
    confidenceScore: 'Up to 99.8%*',
    summary: 'Bound 18 production database tables directly to Singapore PDPA §26D & GDPR Article 30 inventories. Debezium CDC captured ALTER TABLE drift: column "user_device_fingerprint" added without DPIA clearance.',
    insights: [
      'Physical Table Binding: Linked rds_prod.kyc_verification to DPIA-2026-SG-04 (Risk Tier: Low with AES-256 tokenization)',
      'CDC Schema Drift Alert: Debezium CDC detected ALTER TABLE users ADD COLUMN user_device_fingerprint; flagged DPIA drift & halted unmasked query egress',
      'Statutory Living RoPA: Record of Processing Activities automatically updated with legal processing basis (PDPA §13 Consent) & MAS TRM 7-year retention'
    ],
    sql: `/* Scenario 2: Table-Bound DPIA & CDC Schema Drift Alert */
-- Query 1: Real-time introspection joining physical columns to living DPIA registry
SELECT 
  t.table_schema,
  t.table_name,
  c.column_name,
  c.data_type,
  dpia.assessment_id,
  dpia.risk_tier,
  dpia.mitigation_status,
  ropa.legal_basis,
  ropa.retention_period_years,
  ropa.cross_border_safeguard,
  drift.drift_event_id,
  drift.detected_at,
  drift.drift_status
FROM information_schema.tables t
JOIN information_schema.columns c 
  ON t.table_name = c.table_name AND t.table_schema = c.table_schema
LEFT JOIN kaoinai.dpia_registry dpia 
  ON t.table_name = dpia.target_table_name
LEFT JOIN kaoinai.data_inventory_ropa ropa 
  ON c.table_name = ropa.bound_table_name AND c.column_name = ropa.bound_column_name
LEFT JOIN kaoinai.schema_drift_events drift 
  ON c.table_name = drift.table_name AND c.column_name = drift.column_name
WHERE drift.drift_status = 'PENDING_DPIA_SIGNOFF'
ORDER BY dpia.risk_tier DESC, drift.detected_at DESC;`,
    lineage: {
      sources: ['Debezium CDC Stream', 'PostgreSQL (production_db)', 'Snowflake Data Warehouse'],
      transformation: 'KaoinAI Table-Level DPIA Binder & Living RoPA Engine',
      destination: 'Audit-Ready Singapore PDPC & GDPR Article 30 Export',
      latency: 'Continuous schema synchronization (down to 118ms*)'
    }
  },
  {
    id: 'golden-record-mdm',
    title: 'SQL Golden Record MDM Deduplication',
    category: 'Master Data Management',
    icon: GitFork,
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    prompt: 'Deduplicate and merge customer profiles across Shopify, Salesforce CRM, and Zendesk into unified Golden Records with survivorship rules.',
    executionTime: 'Down to 165ms*',
    confidenceScore: 'Up to 99.4%*',
    summary: 'Consolidated 4,820 fragmented customer profiles across 3 disparate systems into 3,610 authoritative Golden Records with 100% auditable survivorship provenance.',
    insights: [
      'Fuzzy Entity Resolution: Jaro-Winkler similarity (>0.88) and E.164 phone normalization resolved 620 customer duplicate identity collisions',
      'Authoritative Survivorship: Prioritized verified corporate domain from Salesforce, verified billing address from Shopify, and active mobile from Zendesk',
      'Operational UUID Broadcast: Canonical Golden Record UUIDs synchronized back to downstream operational systems via CDC stream'
    ],
    sql: `/* Scenario 3: SQL Golden Record Deduplication (Master Data Management) */
WITH staged_entities AS (
  SELECT 
    s.customer_id AS source_shopify_id,
    sf.lead_id AS source_salesforce_id,
    z.user_id AS source_zendesk_id,
    -- Survivorship: Salesforce verified company > Shopify billing company
    COALESCE(sf.verified_company_name, s.billing_company, 'Individual Consumer') AS canonical_company_name,
    -- Survivorship: Work email > Shopify checkout email > Zendesk email
    COALESCE(sf.work_email, s.email, z.email) AS primary_email,
    -- Canonical E.164 phone normalization
    kaoinai.normalize_e164_phone(COALESCE(sf.mobile, s.phone, z.phone)) AS canonical_phone,
    -- Fuzzy Jaro-Winkler similarity scoring
    kaoinai.jaro_winkler_similarity(s.full_name, sf.contact_name) AS match_confidence
  FROM shopify_db.customers s
  FULL OUTER JOIN salesforce_db.accounts sf 
    ON LOWER(s.email) = LOWER(sf.work_email) 
    OR kaoinai.clean_phone(s.phone) = kaoinai.clean_phone(sf.mobile)
  FULL OUTER JOIN zendesk_db.users z 
    ON LOWER(s.email) = LOWER(z.email)
)
SELECT 
  kaoinai.generate_deterministic_uuid(primary_email, canonical_phone) AS golden_record_id,
  canonical_company_name,
  primary_email,
  canonical_phone,
  COUNT(*) OVER (PARTITION BY primary_email) AS source_entity_frequency,
  'ACTIVE_SURVIVORSHIP_RULE_V2' AS resolution_strategy,
  CURRENT_TIMESTAMP AS golden_record_created_at
FROM staged_entities
WHERE match_confidence >= 0.88 OR match_confidence IS NULL;`,
    lineage: {
      sources: ['Shopify Store DB', 'Salesforce CRM API', 'Zendesk Support DB'],
      transformation: 'KaoinAI MDM Rule Engine & Fuzzy Jaro-Winkler Resolution',
      destination: 'Customer 360 Golden Record Mart (PostgreSQL)',
      latency: 'Continuous sync via CDC (down to 165ms*)'
    }
  },
  {
    id: 'query-optimization',
    title: 'Autonomous Index & Query Tuning',
    category: 'Performance & IOPS',
    icon: Database,
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    prompt: 'Analyze slow customer transaction queries on PostgreSQL/Snowflake; generate optimal composite B-Tree indexes and reduce disk IOPS.',
    executionTime: 'Down to 88ms*',
    confidenceScore: 'Up to 99.7%*',
    summary: 'Analyzed pg_stat_statements slow query log on 12.4M-row transactions table. Replaced sequential table scan with targeted composite index, achieving 84% reduction in disk IOPS and 12x query acceleration.',
    insights: [
      'Bottleneck Identification: EXPLAIN ANALYZE pinpointed Seq Scan on transactions table (12.4M rows, execution time: 4,200ms, buffer reads: 412,000)',
      'Autonomous Synthesis: Formulated optimal composite index CREATE INDEX CONCURRENTLY idx_tx_customer_status_date ON transactions (customer_id, status, created_at DESC)',
      'Empirical Benchmark: Post-index EXPLAIN ANALYZE showed Index Scan with execution time dropped to 38ms (84% reduction in physical disk IOPS)'
    ],
    sql: `/* Scenario 4: Autonomous Query & Index Optimization (84% IOPS Reduction) */
-- Step 1: Query Execution Plan Before Optimization (Sequential Scan on 12.4M rows)
-- EXPLAIN (ANALYZE, BUFFERS) 
-- Result: Execution Time: 4,218.42 ms | Buffers: shared read=412,890 (High Disk IOPS)

-- Step 2: KaoinAI Synthesized Index Injection
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_transactions_composite_perf 
ON public.transactions (customer_id, transaction_status, created_at DESC)
INCLUDE (amount_sgd, currency);

-- Step 3: Verified Optimized Execution Query (Index Only Scan)
EXPLAIN (ANALYZE, BUFFERS)
SELECT 
  customer_id,
  transaction_status,
  DATE_TRUNC('month', created_at) AS tx_month,
  SUM(amount_sgd) AS monthly_spend_sgd,
  COUNT(*) AS total_transactions
FROM public.transactions
WHERE customer_id = 'cust_sg_8842'
  AND transaction_status = 'SETTLED'
  AND created_at >= CURRENT_DATE - INTERVAL '180 days'
GROUP BY 1, 2, 3
ORDER BY tx_month DESC;

-- Output Verification:
-- Index Only Scan using idx_transactions_composite_perf
-- Execution Time: 34.18 ms (123x speedup) | Buffers: shared hit=48, read=0 (84% IOPS reduction)`,
    lineage: {
      sources: ['PostgreSQL pg_stat_statements', 'AWS RDS Performance Insights', 'Snowflake Query History'],
      transformation: 'KaoinAI Autonomous Optimizer & EXPLAIN Plan Synthesizer',
      destination: 'Optimized Query Engine (Sub-50ms Execution Target)',
      latency: 'Continuous query tuning (down to 88ms*)'
    }
  },
  {
    id: 'churn',
    title: 'VIP Churn & Revenue Lineage',
    category: 'Revenue Protection',
    icon: TrendingUp,
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    prompt: 'Find enterprise accounts with LTV > $5,000 who have not logged in or placed an order in the last 45 days, tracing upstream payment webhooks.',
    executionTime: 'Down to 118ms*',
    confidenceScore: 'Up to 99.6%*',
    summary: 'Detected up to 42* at-risk customer accounts representing up to $284,500* in ARR across Stripe and PostgreSQL CRM with deterministic query lineage.',
    insights: [
      'Top At-Risk Account: OmniLogistics SG (LTV: up to $48,200*) — Inactive for up to 48 days*',
      'Query Activity Anomaly: Average decline in weekly database query frequency prior to churn: up to 74%*',
      'Automated Retention Webhook: Webhook payload synthesized for HubSpot and Slack #cs-vip alerts'
    ],
    sql: `SELECT 
  c.id, 
  c.company_name, 
  c.account_tier, 
  SUM(o.amount_usd) AS total_ltv, 
  MAX(o.created_at) AS last_order_date,
  DATEDIFF('day', MAX(o.created_at), CURRENT_DATE) AS days_inactive
FROM public.customers c
JOIN public.orders o ON c.id = o.customer_id
WHERE c.account_tier IN ('Enterprise', 'Growth')
GROUP BY c.id, c.company_name, c.account_tier
HAVING SUM(o.amount_usd) > 5000 
   AND MAX(o.created_at) < CURRENT_DATE - INTERVAL '45 days'
ORDER BY total_ltv DESC;`,
    lineage: {
      sources: ['Stripe Invoices API', 'PostgreSQL (production_crm)'],
      transformation: 'KaoinAI Semantic Aggregator & Recency Normalizer',
      destination: 'Snowflake (finance_mart.vip_churn_alerts)',
      latency: 'Real-time sync (down to 0.4s*)'
    }
  }
]

export default function InteractiveDemo() {
  const [activeScenario, setActiveScenario] = useState<Scenario>(scenarios[0])
  const [activeTab, setActiveTab] = useState<'insights' | 'sql' | 'lineage'>('insights')
  const [copied, setCopied] = useState(false)
  const [customPrompt, setCustomPrompt] = useState('')
  const [customSubmitted, setCustomSubmitted] = useState(false)
  const [isSimulating, setIsSimulating] = useState(false)
  const [simulationNotice, setSimulationNotice] = useState<string | null>(null)

  const handleRunSimulation = () => {
    setIsSimulating(true)
    setSimulationNotice('Executing query against connected catalogs & verifying zero-egress kernel...')
    trackEvent('click_cta', { location: 'demo_simulation', label: activeScenario.id })

    setTimeout(() => {
      setIsSimulating(false)
      setSimulationNotice(`Executed successfully in ${activeScenario.executionTime}. Plan verified with 0 data egress.`)
      setTimeout(() => {
        setSimulationNotice(null)
      }, 4000)
    }, 650)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(activeScenario.sql)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    trackEvent('copy_demo_sql', { scenario: activeScenario.id })
  }

  const handleScenarioChange = (scenario: Scenario) => {
    setActiveScenario(scenario)
    trackEvent('switch_demo_scenario', { scenario: scenario.id })
  }

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!customPrompt.trim()) return
    setCustomSubmitted(true)
    trackEvent('try_custom_query_demo', { query: customPrompt.trim() })
  }

  const handleScrollToCta = () => {
    const el = document.getElementById('cta')
    if (el) {
      const yOffset = -80
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  return (
    <section id="demo" className="py-24 sm:py-32 bg-gradient-to-b from-purple-50 via-white to-purple-100 text-purple-950 relative overflow-hidden scroll-mt-20">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 left-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-18">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100 border border-purple-200 text-purple-700 text-xs font-semibold mb-4 shadow-xs">
            <Sparkles size={14} />
            <span>Interactive Live Demo</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-purple-950 tracking-tight mb-4">
            See KaoinAI in Action — Before Touching Your Database
          </h2>
          <p className="text-base sm:text-lg text-purple-900/70 leading-relaxed">
            Select an enterprise scenario below. Watch how KaoinAI&apos;s AI-enhanced data catalog and database knowledgebase autonomously indexes schemas, synthesizes audit-ready definitions, and traces table-bound lineage in sub-second time.
          </p>
        </div>

        {/* Scenario Selectors - Generously Spaced */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5 mb-10">
          {scenarios.map((scenario) => {
            const IconComponent = scenario.icon
            const isSelected = activeScenario.id === scenario.id
            return (
              <button
                key={scenario.id}
                onClick={() => handleScenarioChange(scenario)}
                className={`flex flex-col justify-between text-left p-4 sm:p-5 rounded-2xl transition-all border cursor-pointer ${
                  isSelected
                    ? 'bg-purple-50 border-purple-400 ring-2 ring-purple-300 shadow-xl shadow-purple-200/60'
                    : 'bg-white border-purple-200/80 hover:bg-purple-50 hover:border-purple-300 shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between w-full mb-3">
                    <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-600'}`}>
                      <IconComponent size={18} />
                    </div>
                    <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${scenario.badgeColor}`}>
                      {scenario.category}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-purple-950 mb-1.5 leading-snug">{scenario.title}</h3>
                  <p className="text-xs text-purple-900/60 line-clamp-2 leading-relaxed">{scenario.prompt}</p>
                </div>
              </button>
            )
          })}
        </div>

        {/* Main Terminal Window */}
        <div className="bg-gradient-to-b from-slate-900/95 via-slate-950/95 to-[#0b0816]/95 rounded-3xl border border-purple-500/25 shadow-2xl shadow-purple-950/30 overflow-hidden mb-16 backdrop-blur-2xl">
          {/* Terminal Window Header */}
          <div className="bg-white/5 border-b border-white/10 px-4 py-3 flex flex-wrap items-center justify-between gap-3 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400/80" />
              <div className="w-3 h-3 rounded-full bg-amber-400/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-400/80" />
              <span className="ml-2 font-mono text-xs text-slate-300 flex items-center gap-1.5">
                <Terminal size={13} className="text-purple-400" /> kaoinai-agent // live_engine
              </span>
            </div>

            {/* Performance metrics pill */}
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="inline-flex items-center gap-1 text-emerald-300 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-400/30">
                <Clock size={12} /> {activeScenario.executionTime}
              </span>
              <span className="inline-flex items-center gap-1 text-purple-200 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-400/30">
                <CheckCircle2 size={12} /> {activeScenario.confidenceScore} match
              </span>
            </div>
          </div>

          {/* Prompt Bar */}
          <div className="p-4 sm:p-5 bg-white/[0.03] border-b border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 backdrop-blur-md">
            <div className="flex items-start gap-3 flex-grow">
              <div className="w-7 h-7 rounded-lg bg-purple-600/30 text-purple-300 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                <Play size={14} className="fill-purple-300" />
              </div>
              <div className="flex-grow">
                <div className="text-xs font-mono uppercase tracking-wider text-purple-300 font-semibold mb-1">
                  AI DB Knowledgebase &amp; Catalog Inquiry:
                </div>
                <div className="text-sm sm:text-base font-medium text-white">
                  &ldquo;{activeScenario.prompt}&rdquo;
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRunSimulation}
              disabled={isSimulating}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-semibold shrink-0 transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              {isSimulating ? (
                <>
                  <RefreshCw size={13} className="animate-spin text-purple-200" />
                  <span>Simulating...</span>
                </>
              ) : (
                <>
                  <Play size={12} className="fill-white" />
                  <span>Execute Simulation</span>
                </>
              )}
            </button>
          </div>

          {/* Simulation Notice Bar */}
          {simulationNotice && (
            <div className="px-5 py-2.5 bg-purple-950/80 border-b border-purple-500/30 text-xs font-mono text-purple-200 flex items-center gap-2 animate-in fade-in duration-150">
              <Sparkles size={13} className="text-emerald-400 shrink-0" />
              <span>{simulationNotice}</span>
            </div>
          )}

          {/* View Mode Tabs */}
          <div className="bg-white/[0.02] border-b border-white/10 px-4 sm:px-6 flex gap-2">
            <button
              onClick={() => setActiveTab('insights')}
              className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'insights'
                  ? 'border-purple-400 text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles size={15} /> Business Insights & Action Plan
            </button>
            <button
              onClick={() => setActiveTab('sql')}
              className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'sql'
                  ? 'border-purple-400 text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Terminal size={15} /> Catalog &amp; Schema Verification
            </button>
            <button
              onClick={() => setActiveTab('lineage')}
              className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'lineage'
                  ? 'border-purple-400 text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <GitFork size={15} /> Data Lineage Graph
            </button>
          </div>

          {/* Tab Content Display */}
          <div className="p-4 sm:p-6 min-h-[260px] flex flex-col justify-center">
            {activeTab === 'insights' && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-800/40 flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-white text-sm sm:text-base">Executive Summary</h4>
                    <p className="text-slate-300 text-sm mt-0.5">{activeScenario.summary}</p>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
                    Synthesized Findings & Automated Remediation:
                  </span>
                  <div className="grid gap-2.5">
                    {activeScenario.insights.map((insight, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200 bg-white/5 p-3.5 rounded-xl border border-white/10 backdrop-blur-md">
                        <span className="w-5 h-5 rounded-full bg-purple-500/20 border border-purple-400/40 text-purple-300 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{insight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'sql' && (
              <div className="relative animate-in fade-in duration-300">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-slate-300">PostgreSQL / Snowflake Compliant Dialect</span>
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1 text-xs text-slate-200 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg border border-white/10 transition-colors cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check size={13} className="text-emerald-400" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={13} /> Copy Query
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-4 rounded-xl bg-slate-950/70 text-purple-200 font-mono text-xs sm:text-sm overflow-x-auto leading-relaxed border border-purple-500/20 shadow-inner">
                  <code>{activeScenario.sql}</code>
                </pre>
              </div>
            )}

            {activeTab === 'lineage' && (
              <div className="space-y-6 py-2 animate-in fade-in duration-300">
                <div className="text-xs font-mono text-slate-300">
                  Automated End-to-End Lineage Path (Zero manual YAML configuration required):
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
                  {/* Step 1: Ingestion Sources */}
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between backdrop-blur-md">
                    <div>
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-2">
                        <span>1. Raw Systems</span>
                        <span className="text-emerald-300 font-mono">Connected</span>
                      </div>
                      <div className="space-y-1.5">
                        {activeScenario.lineage.sources.map((src, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs font-mono text-white bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/10">
                            <Database size={13} className="text-purple-400" /> {src}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Step 2: KaoinAI Engine */}
                  <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-500/40 flex flex-col justify-between shadow-lg shadow-purple-950/40 backdrop-blur-md">
                    <div>
                      <div className="flex items-center justify-between text-xs font-semibold text-purple-200 mb-2">
                        <span>2. KaoinAI Neural Layer</span>
                        <span className="text-purple-300 font-mono">{activeScenario.lineage.latency}</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-purple-900/40 text-xs font-medium text-purple-100 border border-purple-500/30">
                        {activeScenario.lineage.transformation}
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-1.5 text-[11px] text-purple-300">
                      <Sparkles size={13} /> Zero customer data retention
                    </div>
                  </div>

                  {/* Step 3: Destination */}
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between backdrop-blur-md">
                    <div>
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-2">
                        <span>3. Target Destination</span>
                        <span className="text-emerald-300 font-mono">Synchronized</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-emerald-950/40 text-xs font-mono text-emerald-300 border border-emerald-500/30">
                        {activeScenario.lineage.destination}
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-1 text-[11px] text-slate-400">
                      <CheckCircle2 size={13} className="text-emerald-400" /> Audited & Verified
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footnote Disclaimer */}
        <p className="text-[11px] text-slate-500 text-center -mt-6 mb-10 max-w-4xl mx-auto leading-relaxed">
          * <strong>Scenario Evaluation Methodology:</strong> Specific scenario outputs (e.g. $284,500 ARR risk across 42 accounts, 1,420 NRIC identifiers, $5,700 currency discrepancy across 43 checkouts, 1,680 golden records, and 14 tables) are demonstrated using standardized multi-source benchmark sandbox datasets (incorporating synthetic Stripe billing logs, Shopify order events, and PostgreSQL CRM schemas). Query execution latencies (&lt; 120ms to 210ms) and confidence scores are evaluated against baseline manual querying workflows (e.g. manual ad-hoc SQL formulation averaging 3–5 days, unindexed staging tables, and disconnected spreadsheets). Live query response times and match precision vary based on underlying database engine, hardware sizing, and network topography.
        </p>

        {/* Try Your Own Prompt Interactive Box */}
        <div className="bg-gradient-to-r from-purple-100 via-white to-purple-50 rounded-2xl p-6 sm:p-8 border border-purple-200 text-center max-w-4xl mx-auto shadow-lg shadow-purple-100/60">
          <h3 className="text-xl sm:text-2xl font-bold text-purple-950 mb-2">
            Want to test your own business question?
          </h3>
          <p className="text-sm text-purple-900/70 max-w-xl mx-auto mb-6">
            Type an operational inquiry below or test it on your actual database schema during our complimentary 14-day on-premises pilot (exclusive to On-Prem / VPC).
          </p>

          {customSubmitted ? (
            <div className="bg-white p-5 rounded-xl border border-emerald-300 text-left max-w-2xl mx-auto space-y-3 shadow-md shadow-purple-100/50">
              <div className="flex items-center gap-2 text-emerald-600 font-semibold text-sm">
                <CheckCircle2 size={16} />
                <span>Query Analyzed & Schema Prepared!</span>
              </div>
              <p className="text-xs text-purple-900/70">
                Query: <span className="text-purple-950 font-medium">&ldquo;{customPrompt}&rdquo;</span>
              </p>
              <div className="text-xs text-purple-700 bg-purple-50 p-3 rounded border border-purple-200">
                To execute this query across your live schema with zero data retention, activate your complimentary 14-day on-premises pilot (exclusive to On-Prem / VPC) or test directly with an engineer.
              </div>
              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                <Button
                  onClick={handleScrollToCta}
                  size="sm"
                  className="bg-gradient-brand text-white font-semibold text-xs"
                >
                  Start 14-Day Free On-Prem Pilot
                </Button>
                <a
                  href={getWhatsAppUrl(`Hi KaoinAI, I want to test this query on our database: "${customPrompt}"`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs"
                >
                  Test on WhatsApp with Data Engineer
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleCustomSubmit} className="flex flex-col sm:flex-row gap-2.5 max-w-2xl mx-auto">
              <input
                type="text"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="e.g. Find duplicate leads created between Zendesk and Salesforce..."
                className="flex-grow px-4 py-3 rounded-xl bg-white border border-purple-200 text-purple-950 placeholder:text-purple-400/70 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              <Button
                type="submit"
                className="bg-gradient-brand text-white font-semibold px-6 py-3 rounded-xl text-sm whitespace-nowrap hover:opacity-90 transition-opacity"
              >
                <span>Inspect Query</span>
                <ArrowRight size={15} className="ml-1.5" />
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
