import { useState, useRef } from 'react'
import { 
  AlertTriangle, 
  CheckCircle2, 
  ShieldCheck, 
  ChevronDown, 
  Flame, 
  Lock, 
  FileSpreadsheet
} from 'lucide-react'

interface StoryData {
  id: string
  badge: string
  badgeColor: string
  icon: any
  title: string
  subtitle: string
  plainEnglishPain: string
  before: {
    label: string
    codeSnippet: string
    issueTitle: string
    issueDescription: string
    impactBadge: string
    details: { label: string; value: string; isBad: boolean }[]
  }
  after: {
    label: string
    codeSnippet: string
    solutionTitle: string
    solutionDescription: string
    impactBadge: string
    details: { label: string; value: string; isBad: boolean }[]
  }
  enterpriseRigor: {
    statutoryFramework: string
    auditStandard: string
    cryptographicControl: string
    enforcementMechanism: string
  }
}

const STORIES: StoryData[] = [
  {
    id: 'ghost-revenue',
    badge: 'Horror Story #1 • Metric Chaos',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
    icon: Flame,
    title: 'The "Ghost Revenue" Board Meeting Meltdown',
    subtitle: 'When Marketing calculates churn at 4%, but Finance reveals it is actually 19%.',
    plainEnglishPain: 'Two smart teams querying the same PostgreSQL database, getting completely contradictory business numbers because nobody documented what the raw columns mean.',
    before: {
      label: 'Without KaoinAI (Messy Tribal Reality)',
      codeSnippet: `SELECT COUNT(*) FROM usr_v2 \nWHERE stat_flg_3 = 1 \n  AND is_churn != 'Y'; -- What is 'Y'?`,
      issueTitle: 'Fragmented Formulas & Undocumented Flags',
      issueDescription: 'Developers left months ago. Marketing filters by `is_churn`, Finance filters by `invoices.paid_at < 30d`. Neither knows the other is wrong.',
      impactBadge: '⚠️ Board Presentation Discrepancy: $140,000 Variance',
      details: [
        { label: 'Table Documentation', value: 'Zero (Last updated in Confluence 2024)', isBad: true },
        { label: 'Churn Rate Reported', value: '4.2% (Marketing) vs 18.9% (Finance)', isBad: true },
        { label: 'Single Source of Truth', value: 'None • Endless Slack arguments', isBad: true },
        { label: 'Engineering Time Lost', value: '14 hours/week verifying SQL joins', isBad: true }
      ]
    },
    after: {
      label: 'With KaoinAI (Living DB Knowledgebase)',
      codeSnippet: `SELECT * FROM prod_marts.verified_mrr_cohorts\n-- Certified: Net MRR = Gross - Refunds - Taxes\n-- Verified Join Key: customer_id ↔ stripe_id`,
      solutionTitle: 'Living Semantic Glossary & Verified Joins',
      solutionDescription: 'KaoinAI auto-indexed the schemas, flagged the ambiguous status flag, and synthesized a certified, finance-approved business glossary.',
      impactBadge: '✅ 100% Single Source of Truth • Zero SQL Disputes',
      details: [
        { label: 'Table Documentation', value: 'Self-Updating AI DB Knowledgebase', isBad: false },
        { label: 'Churn Rate Reported', value: '8.4% Certified Net MRR Churn', isBad: false },
        { label: 'Single Source of Truth', value: 'Living Semantic Contract Bound to Tables', isBad: false },
        { label: 'Engineering Time Saved', value: '14 hrs/week reclaimed for product code', isBad: false }
      ]
    },
    enterpriseRigor: {
      statutoryFramework: 'MAS Technology Risk Management (TRM) §4.2 (Data Integrity & Consistency Controls)',
      auditStandard: 'Deterministic Semantic Layer Mapping (Spider & BIRD Relational Accuracy Standard: 99.8%)',
      cryptographicControl: 'SHA-256 Digest Verification on Table Schema Versions & Foreign-Key Relational Hashes',
      enforcementMechanism: 'Zero-Trust Query Compiler throttling destructive unindexed scans and ungrounded aggregations'
    }
  },
  {
    id: 'ai-pii-leak',
    badge: 'Horror Story #2 • AI Hallucination & Leak',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    icon: Lock,
    title: 'The Accidental Customer PII Leak in AI Prompting',
    subtitle: 'When an internal LLM or support agent outputs unmasked customer NRIC & passport numbers.',
    plainEnglishPain: 'Connecting generative AI or autonomous agents directly to internal SQL databases without an active governance firewall invites severe privacy breaches.',
    before: {
      label: 'Without KaoinAI (Ungoverned AI Pipeline)',
      codeSnippet: `Prompt: "Summarize top VIP customers"\nLLM Output: "Tan Wei Ming, NRIC: S9128491A, \nCredit Card: 4532-****-****-8812..."`,
      issueTitle: 'Cleartext PII Ingested by Third-Party AI APIs',
      issueDescription: 'Customer IC/NRIC numbers, phone numbers, and home addresses are fed raw into OpenAI/Anthropic context windows with zero redaction.',
      impactBadge: '🚨 Statutory Breach Risk: Singapore PDPA Fines up to $1M',
      details: [
        { label: 'PII Detection', value: 'Manual code reviews (Frequently missed in dev)', isBad: true },
        { label: 'Data Egress', value: 'Raw customer identities sent to external LLMs', isBad: true },
        { label: 'Context Hallucination', value: 'AI joins deprecated tables & invents fake columns', isBad: true },
        { label: 'Audit Log Trace', value: 'No immutable audit record of AI database queries', isBad: true }
      ]
    },
    after: {
      label: 'With KaoinAI (Pre-Prompt Dynamic Masking)',
      codeSnippet: `KaoinAI Shield: [INTERCEPTED in 14ms]\nAuto-Masked: NRIC ➔ [SHA256_TOKEN_8921a]\nSafe Context Delivered to LLM`,
      solutionTitle: 'Zero-Egress Deterministic Tokenization Firewall',
      solutionDescription: 'Every AI inquiry passes through KaoinAI’s semantic firewall: sensitive attributes are auto-detected and cryptographically masked in sub-second memory.',
      impactBadge: '🛡️ 100% PII Redacted • Zero Raw Data Sent to External APIs',
      details: [
        { label: 'PII Detection', value: 'Automated Real-Time AI Column Classification', isBad: false },
        { label: 'Data Egress', value: 'Zero Raw Data Egress • Dynamic Local Masking', isBad: false },
        { label: 'Context Hallucination', value: 'Eliminated via Strict Certified Semantic Boundaries', isBad: false },
        { label: 'Audit Log Trace', value: '100% Cryptographic Immutable Provenance DAG', isBad: false }
      ]
    },
    enterpriseRigor: {
      statutoryFramework: 'Singapore Personal Data Protection Act (PDPA) §24 (Protection Obligation & Dynamic Tokenization)',
      auditStandard: 'Australian DISR Mandatory AI Guardrail 4 (Data Governance) & Guardrail 6 (Human Interlock)',
      cryptographicControl: 'HMAC-SHA-256 One-Way Deterministic Pseudonymization with Private Salt Key',
      enforcementMechanism: 'Hardware-Level Read-Only Egress Quarantine: In-memory masking before external HTTP dispatch'
    }
  },
  {
    id: 'deal-blocker',
    badge: 'Horror Story #3 • Lost Enterprise Deal',
    badgeColor: 'bg-teal-100 text-teal-800 border-teal-200',
    icon: FileSpreadsheet,
    title: 'The $200k Enterprise Contract Stalled by Security Audit',
    subtitle: 'When an enterprise buyer demands a "Living RoPA & Table-Bound DPIA" before signing.',
    plainEnglishPain: 'A massive prospective customer is ready to buy, but their enterprise compliance team sends an 80-question vendor risk audit that your team cannot answer.',
    before: {
      label: 'Without KaoinAI (Spreadsheet Chaos)',
      codeSnippet: `Security Questionnaire Question #42:\n"Provide statutory Data Inventory (RoPA)\nmapping all columns containing customer PII."\nStatus: 4 weeks of panic and consultant quotes.`,
      issueTitle: 'Stale Spreadsheets & Deal-Killing Security Delays',
      issueDescription: 'Compliance is kept in an ancient Excel file that doesn’t reflect what is actually in production databases, stalling revenue for months.',
      impactBadge: '⏳ $200,000 Enterprise Deal Delayed for 90 Days',
      details: [
        { label: 'Data Inventory (RoPA)', value: 'Static 2023 Excel file (Completely drifted)', isBad: true },
        { label: 'DPIA Compliance', value: 'Disconnected survey portal with zero schema links', isBad: true },
        { label: 'Audit Preparation', value: '2–3 months of expensive compliance consultants', isBad: true },
        { label: 'Consultant Retainer', value: '$30,000 – $75,000+ for manual audit documentation', isBad: true }
      ]
    },
    after: {
      label: 'With KaoinAI (1-Click Table-Bound RoPA)',
      codeSnippet: `Export Generated: RoPA_SG_PDPA_2026.pdf\nDirectly Bound: 14 Postgres Tables, 48 Columns\nStatus: Approved by Enterprise Auditor in 24 hours.`,
      solutionTitle: 'Table-Bound Living RoPA & Automated DPIA',
      solutionDescription: 'KaoinAI anchors compliance directly to physical database columns. When developers add a column, RoPA updates automatically in real time.',
      impactBadge: '⚡ Instant Vendor Clearance • Deal Closed in 48 Hours',
      details: [
        { label: 'Data Inventory (RoPA)', value: '100% Real-Time Schemas (SG PDPA, MY, ID, GDPR)', isBad: false },
        { label: 'DPIA Compliance', value: 'Physical Table & Schema Binding with Drift Alerts', isBad: false },
        { label: 'Audit Preparation', value: '1-Click Statutory PDF/JSON Export in 60 seconds', isBad: false },
        { label: 'Consultant Cost', value: '$0 External Consulting • Automated by Platform', isBad: false }
      ]
    },
    enterpriseRigor: {
      statutoryFramework: 'Singapore PDPA Article 13 & GDPR Article 30 (Records of Processing Activities / RoPA)',
      auditStandard: 'SOC 2 Type II (CC6.1 Logical Access Controls) & ISO 27001 Annex A.8 (Asset Management)',
      cryptographicControl: 'Cryptographic Schema Version Fingerprinting & Immutable Change Logs',
      enforcementMechanism: 'Automated CI/CD schema migration hook flagging statutory DPIA drift prior to pull-request merge'
    }
  }
]

export default function HorrorStoryBeforeAfter() {
  const [activeStoryIdx, setActiveStoryIdx] = useState(0)
  const [sliderPos, setSliderPos] = useState(50) // 0 to 100%
  const [isDragging, setIsDragging] = useState(false)
  const [showRigor, setShowRigor] = useState(false)
  const sliderContainerRef = useRef<HTMLDivElement | null>(null)

  const currentStory = STORIES[activeStoryIdx]

  const handlePointerMove = (clientX: number) => {
    if (!sliderContainerRef.current) return
    const rect = sliderContainerRef.current.getBoundingClientRect()
    const offsetX = clientX - rect.left
    const percent = Math.min(Math.max((offsetX / rect.width) * 100, 5), 95)
    setSliderPos(percent)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return
    handlePointerMove(e.clientX)
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0) {
      handlePointerMove(e.touches[0].clientX)
    }
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="text-center mb-10 sm:mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold uppercase tracking-wider mb-4 shadow-xs">
          <Flame size={14} className="text-rose-600 animate-pulse" />
          <span>The Pain vs The Fix • Interactive Diagnostic</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-950 tracking-tight mb-4">
          What Happens Without Data Governance?
        </h2>
        <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
          Three real-world operational breakdowns every growing company encounters—and how KaoinAI solves them in plain English.
        </p>
      </div>

      {/* Story Selector Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 mb-8">
        {STORIES.map((story, idx) => {
          const StoryIcon = story.icon
          const isActive = activeStoryIdx === idx
          return (
            <button
              key={story.id}
              type="button"
              onClick={() => {
                setActiveStoryIdx(idx)
                setShowRigor(false)
              }}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-teal-700 text-white shadow-md shadow-teal-200 scale-102'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-2xs'
              }`}
            >
              <StoryIcon size={16} className={isActive ? 'text-white' : 'text-teal-600'} />
              <span>{story.title.split(' ')[1]} {story.title.split(' ')[2]}</span>
            </button>
          )
        })}
      </div>

      {/* Active Story Intro Card */}
      <div className="bg-gradient-to-r from-teal-50 via-white to-teal-50 border border-teal-200/80 rounded-3xl p-5 sm:p-7 mb-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 bg-rose-100 text-rose-800 border border-rose-200">
              <AlertTriangle size={13} className="text-rose-600" />
              <span>{currentStory.badge}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight">
              {currentStory.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              {currentStory.subtitle}
            </p>
          </div>
          <div className="bg-white p-3.5 rounded-2xl border border-teal-200/70 text-xs text-teal-950 max-w-md shrink-0 shadow-xs">
            <strong className="block font-bold text-[#0f766e] mb-1">💡 The Plain-English Problem:</strong>
            <span>{currentStory.plainEnglishPain}</span>
          </div>
        </div>
      </div>

      {/* Preset View Buttons */}
      <div className="flex items-center justify-between gap-2 mb-3 px-1 text-xs text-slate-500 font-mono">
        <div className="flex items-center gap-2">
          <span>Drag slider or click view:</span>
          <button
            type="button"
            onClick={() => setSliderPos(15)}
            className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-800 border border-rose-200 font-semibold cursor-pointer hover:bg-rose-100"
          >
            Show Messy Reality
          </button>
          <button
            type="button"
            onClick={() => setSliderPos(50)}
            className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 font-semibold cursor-pointer hover:bg-slate-200"
          >
            Split 50/50
          </button>
          <button
            type="button"
            onClick={() => setSliderPos(85)}
            className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold cursor-pointer hover:bg-emerald-100"
          >
            Show With KaoinAI
          </button>
        </div>
        <span className="hidden sm:inline text-teal-700 font-semibold">
          ← Drag handle to compare →
        </span>
      </div>

      {/* Interactive Before & After Split-Screen Slider */}
      <div
        ref={sliderContainerRef}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        className="relative w-full rounded-3xl overflow-hidden shadow-2xl border border-slate-200 select-none min-h-[460px] sm:min-h-[420px] bg-slate-900 cursor-ew-resize"
      >
        {/* RIGHT LAYER: "With KaoinAI" (Green / Purple Tech) */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0c081e] via-[#120d2d] to-[#0c081e] p-6 sm:p-8 text-white flex flex-col justify-between">
          <div className="max-w-md ml-auto text-right sm:text-left sm:max-w-lg">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold font-mono uppercase mb-3">
              <CheckCircle2 size={13} />
              <span>{currentStory.after.label}</span>
            </div>
            <h4 className="text-lg sm:text-xl font-bold text-white mb-1">
              {currentStory.after.solutionTitle}
            </h4>
            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              {currentStory.after.solutionDescription}
            </p>

            {/* Code / Mock Snapshot */}
            <div className="bg-black/60 rounded-xl p-3.5 border border-white/10 font-mono text-[11px] text-emerald-300 whitespace-pre-wrap text-left mb-4 shadow-inner">
              {currentStory.after.codeSnippet}
            </div>

            {/* Feature Bullets */}
            <div className="grid grid-cols-2 gap-2 text-left">
              {currentStory.after.details.map((d, i) => (
                <div key={i} className="bg-white/5 p-2 rounded-lg border border-white/10 text-[11px]">
                  <span className="text-slate-400 block text-[10px]">{d.label}</span>
                  <strong className="text-emerald-300">{d.value}</strong>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-emerald-300 font-mono">
            <span>{currentStory.after.impactBadge}</span>
            <span className="text-slate-400 hidden sm:inline">15-min autonomous setup</span>
          </div>
        </div>

        {/* LEFT LAYER: "Without KaoinAI" (Red / Chaos) - Clipped by Slider Position */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-rose-950 via-[#1c0812] to-[#250a17] p-6 sm:p-8 text-white flex flex-col justify-between overflow-hidden transition-all duration-75"
          style={{ width: `${sliderPos}%` }}
        >
          <div className="w-[320px] sm:w-[480px]">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-400/30 text-xs font-bold font-mono uppercase mb-3">
              <AlertTriangle size={13} />
              <span>{currentStory.before.label}</span>
            </div>
            <h4 className="text-lg sm:text-xl font-bold text-white mb-1">
              {currentStory.before.issueTitle}
            </h4>
            <p className="text-xs text-rose-200/90 mb-4 leading-relaxed">
              {currentStory.before.issueDescription}
            </p>

            {/* Code / Messy Snapshot */}
            <div className="bg-black/70 rounded-xl p-3.5 border border-rose-500/30 font-mono text-[11px] text-rose-300 whitespace-pre-wrap text-left mb-4 shadow-inner">
              {currentStory.before.codeSnippet}
            </div>

            {/* Feature Bullets */}
            <div className="grid grid-cols-2 gap-2 text-left">
              {currentStory.before.details.map((d, i) => (
                <div key={i} className="bg-black/40 p-2 rounded-lg border border-rose-500/20 text-[11px]">
                  <span className="text-slate-400 block text-[10px]">{d.label}</span>
                  <strong className="text-rose-300">{d.value}</strong>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-rose-500/20 flex items-center justify-between text-xs text-rose-300 font-mono">
            <span>{currentStory.before.impactBadge}</span>
            <span className="text-slate-400 hidden sm:inline">Manual maintenance debt</span>
          </div>
        </div>

        {/* Draggable Divider Handle */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl z-30 cursor-ew-resize flex items-center justify-center transition-all duration-75"
          style={{ left: `calc(${sliderPos}% - 2px)` }}
        >
          <div className="w-8 h-8 rounded-full bg-white text-teal-950 font-bold shadow-xl border-2 border-teal-600 flex items-center justify-center text-xs">
            ↔
          </div>
        </div>
      </div>

      {/* Option 3: "Plain English First, Enterprise Rigor on Expand" */}
      <div className="mt-6">
        <button
          type="button"
          onClick={() => setShowRigor(!showRigor)}
          className="w-full bg-slate-50 hover:bg-teal-50/60 border border-slate-200 rounded-2xl p-4 flex items-center justify-between text-left transition-colors cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
              <ShieldCheck size={18} />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-teal-900">
                Are you an Enterprise CISO, Compliance Officer, or Auditor?
              </div>
              <div className="text-[11px] sm:text-xs text-slate-500">
                Click to inspect statutory compliance mappings (Singapore PDPA, MAS TRM &amp; ISO 27001) for this scenario.
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-teal-700 shrink-0">
            <span>{showRigor ? 'Hide Rigor' : 'View Enterprise Specs'}</span>
            <ChevronDown size={16} className={`transition-transform duration-200 ${showRigor ? 'rotate-180' : ''}`} />
          </div>
        </button>

        {showRigor && (
          <div className="mt-3 bg-slate-900 text-white rounded-2xl p-5 sm:p-6 border border-teal-500/30 animate-in fade-in duration-300 font-mono text-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-teal-300 font-bold text-xs uppercase">
                Enterprise Regulatory &amp; Technical Architecture Specification
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                Audited Standard
              </span>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-slate-400 text-[11px] block">Statutory Framework:</span>
                <span className="text-slate-100 font-medium">{currentStory.enterpriseRigor.statutoryFramework}</span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400 text-[11px] block">Audit Benchmark Standard:</span>
                <span className="text-emerald-300 font-medium">{currentStory.enterpriseRigor.auditStandard}</span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400 text-[11px] block">Cryptographic Control:</span>
                <span className="text-slate-100 font-medium">{currentStory.enterpriseRigor.cryptographicControl}</span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400 text-[11px] block">Enforcement Mechanism:</span>
                <span className="text-teal-300 font-medium">{currentStory.enterpriseRigor.enforcementMechanism}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
