import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import HorrorStoryBeforeAfter from '@/components/HorrorStoryBeforeAfter'
import Architecture3D from '@/components/Architecture3D'

const problems = [
  'Disconnected Compliance Spreadsheets: Static DPIAs and surveys that become obsolete the moment an engineer runs a schema migration.',
  'Exorbitant Implementation & Lock-In: $30,000–$100,000+/year* software minimums plus six-figure system integrator retainers*.',
  'Regulatory exposure: personal data changes that nobody records can make it hard to meet PDPA duties.',
  'Tribal Knowledge & Undocumented Schemas: Cryptic table names, stale Confluence wikis, and hours wasted hunting down what database columns actually mean.',
  'Fragmented Customer Master Data: Conflicting records and duplicate entities isolated across disparate ERPs, CRMs, and SQL tables.'
]

const solutions = [
  'Physical Table-Bound DPIA & Living RoPA: Compliance inventories generated directly from physical database schemas with automated drift alerts.',
  'Rapid Production Go-Live in Up to 48h*: Instant deployment via self-hosted Docker, private VPC Kubernetes, or managed cloud.',
  'AI-Enhanced Data Catalog & DB Knowledgebase: Self-maintaining semantic documentation, business glossaries, and AI-aided schema discovery across your database estate.',
  'Continuous Schema Shift & Dynamic Masking: Real-time detection of newly migrated PII with automatic tokenization and role-based masking.',
  'Golden Record MDM Engine: Automated entity resolution across Salesforce, PostgreSQL, Shopify, and ERPs without brittle custom ETL.'
]

export default function ProblemSolution() {
  return (
    <section id="problem-solution" className="py-20 sm:py-28 bg-gradient-to-b from-white via-slate-50/40 to-white scroll-mt-20">
      <div className="mb-10 flex justify-center">
        <Architecture3D />
      </div>

      {/* 1. Interactive 3 Horror Stories & Before/After Slider */}
      <HorrorStoryBeforeAfter />

      {/* 2. Architectural Comparison: Legacy Silos vs KaoinAI Autonomous Governance */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 sm:mt-28 pt-16 border-t border-slate-200/80">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold uppercase tracking-wider mb-3">
            <span>Architectural Paradigm</span>
          </div>
          <h3 className="text-2xl sm:text-4xl font-extrabold text-slate-950 tracking-tight mb-3">
            Legacy Manual Silos vs. Autonomous Intelligence
          </h3>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Why traditional enterprise platforms cost $150k+ and take 6 months—while KaoinAI connects in minutes.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-stretch">
          {/* Legacy Card */}
          <div className="rounded-3xl p-7 sm:p-10 bg-gradient-to-b from-rose-50/40 via-white to-slate-50/60 border border-rose-200/50 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-rose-200/20 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center gap-3.5 mb-8 pb-5 border-b border-rose-100">
                <div className="w-12 h-12 rounded-2xl bg-rose-100/80 text-rose-600 flex items-center justify-center shrink-0 shadow-xs">
                  <AlertTriangle size={22} />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900 tracking-tight">Legacy Governance &amp; Manual Silos</h4>
                  <p className="text-xs text-rose-700/80 font-medium">Consultant-heavy, fragile, and decoupled from production databases</p>
                </div>
              </div>
              <ul className="space-y-4 sm:space-y-5">
                {problems.map((item, i) => {
                  const [title, ...desc] = item.split(': ')
                  return (
                    <li key={i} className="flex items-start gap-3.5">
                      <div className="w-5 h-5 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center shrink-0 mt-0.5">
                        <XCircle size={14} />
                      </div>
                      <div className="text-sm leading-relaxed">
                        <strong className="text-slate-900 block font-semibold">{title}</strong>
                        <span className="text-slate-600">{desc.join(': ')}</span>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>

          {/* KaoinAI Modern Solution Card */}
          <div className="rounded-3xl p-7 sm:p-10 bg-gradient-to-br from-blue-100 via-blue-50 to-white text-blue-950 border border-blue-300/60 shadow-xl shadow-blue-200/50 flex flex-col justify-between relative overflow-hidden group">
            {/* Luminous ambient gradient glows */}
            <div className="absolute -top-10 -right-10 w-72 h-72 bg-blue-400/30 rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-blue-300/30 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-3.5 mb-8 pb-5 border-b border-blue-200">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-blue-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-blue-300/60">
                  <CheckCircle size={22} />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-blue-950 tracking-tight flex items-center gap-2">
                    <span>KaoinAI Autonomous Governance</span>
                  </h4>
                  <p className="text-xs text-blue-700 font-medium">Continuous, schema-bound, and operational in up to 1 day*</p>
                </div>
              </div>
              <ul className="space-y-4 sm:space-y-5">
                {solutions.map((item, i) => {
                  const [title, ...desc] = item.split(': ')
                  return (
                    <li key={i} className="flex items-start gap-3.5">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                        <CheckCircle size={13} />
                      </div>
                      <div className="text-sm leading-relaxed">
                        <strong className="text-blue-950 block font-semibold">{title}</strong>
                        <span className="text-blue-900/70">{desc.join(': ')}</span>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        </div>

        {/* Footnote Disclaimer */}
        <p className="text-[11px] text-slate-500 text-center mt-8 max-w-4xl mx-auto leading-relaxed">
          * Legacy software costs ($30,000–$100,000+/year) and six-figure retainer estimates are derived from published entry licensing models and typical external systems integration contracts for legacy data governance platforms (e.g. Collibra, Alation). Rapid setup (up to 48 hours / 1 day) is evaluated against traditional 3–9 month manual SI onboarding baselines. Actual duration depends on environment complexity and VPC provisioning.
        </p>
      </div>
    </section>
  )
}
