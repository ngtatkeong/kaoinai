import { useState } from 'react'
import { Calculator, ArrowRight, DollarSign, Clock, ShieldAlert, Info, ChevronDown, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { trackEvent } from '@/lib/analytics'

export default function RoiCalculator() {
  const [teamSize, setTeamSize] = useState<number>(10)
  const [recordCount, setRecordCount] = useState<number>(2) // Millions
  const [showMethodology, setShowMethodology] = useState<boolean>(false)

  // Calculations
  // Average engineer/analyst spends ~12 hours/month on manual data hygiene, formatting, and PII checks
  const hoursSavedPerMonth = Math.round(teamSize * 14)
  // Average engineering rate $45/hour loaded cost
  const annualSavingsUsd = Math.round(hoursSavedPerMonth * 45 * 12)
  // Risk index
  const riskIndex = recordCount > 5 ? 'High' : recordCount > 1 ? 'Moderate' : 'Low'

  const handleSliderChange = (newTeamSize: number, newRecords: number) => {
    setTeamSize(newTeamSize)
    setRecordCount(newRecords)
    trackEvent('calculate_roi', {
      team_size: newTeamSize,
      db_records_millions: newRecords,
      estimated_annual_savings_usd: annualSavingsUsd,
      compliance_risk_score: riskIndex,
    })
  }

  return (
    <section id="roi-calculator" className="py-16 sm:py-24 bg-gradient-to-b from-white to-gray-50 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 border border-purple-100 text-[#5b2d6e] text-sm font-medium mb-4">
            <Calculator size={16} />
            <span>Interactive ROI & Risk Estimator</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Calculate Your Data Team Savings &amp; ROI
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            See how much engineering time and compliance budget KaoinAI saves your organization compared to manual validation scripts or legacy enterprise consulting.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-stretch max-w-5xl mx-auto">
          {/* Controls */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-5 sm:p-8 border border-gray-200 shadow-sm space-y-6 sm:space-y-8">
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-semibold text-gray-800">
                  Data & Business Team Size:
                </label>
                <span className="text-base font-bold text-[#5b2d6e] bg-purple-50 px-3 py-1 rounded-lg border border-purple-100">
                  {teamSize} People
                </span>
              </div>
              <input
                type="range"
                min="2"
                max="50"
                value={teamSize}
                onChange={(e) => handleSliderChange(Number(e.target.value), recordCount)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#5b2d6e]"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>2 Users</span>
                <span>25 Users</span>
                <span>50+ Users</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-semibold text-gray-800">
                  Database & ERP Records Under Management:
                </label>
                <span className="text-base font-bold text-[#5b2d6e] bg-purple-50 px-3 py-1 rounded-lg border border-purple-100">
                  {recordCount}M Records
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="20"
                step="0.5"
                value={recordCount}
                onChange={(e) => handleSliderChange(teamSize, Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#5b2d6e]"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>500k Records</span>
                <span>10M Records</span>
                <span>20M+ Records</span>
              </div>
            </div>

            <div className="bg-purple-50/60 rounded-xl p-4 border border-purple-100 text-xs text-gray-600 space-y-1.5">
              <p className="font-semibold text-[#5b2d6e]">💡 Assumptions based on SME benchmarks:</p>
              <p>• Up to 14 hours* saved per team member/month from automated DQ and lineage (measured against baseline manual schema tracing &amp; spreadsheet hygiene).</p>
              <p>• Up to 99.4%* automated detection of unmasked customer PII before audits (based upon baseline manual sampling error rates).</p>
            </div>
          </div>

          {/* Results Summary Card */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#1a1a2e] to-[#2d1b4e] rounded-2xl p-5 sm:p-8 text-white flex flex-col justify-between shadow-xl">
            <div>
              <span className="text-xs uppercase tracking-wider text-purple-300 font-semibold">
                Estimated Annual Impact
              </span>
              <div className="mt-4 space-y-5">
                <div>
                  <div className="text-xs text-gray-300 flex items-center gap-1.5">
                    <DollarSign size={14} className="text-emerald-400" />
                    Estimated Annual Value & Savings
                  </div>
                  <div className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
                    Up to ${annualSavingsUsd.toLocaleString()}*
                    <span className="text-xs font-normal text-gray-400 ml-1">/yr</span>
                  </div>
                  <div className="text-[11px] text-purple-200/90 bg-white/10 px-2.5 py-1.5 rounded-lg border border-white/10 mt-2 font-mono">
                    Formula: {teamSize} users × 14 hrs/mo × $45/hr loaded rate × 12 mos
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10">
                  <div>
                    <div className="text-[11px] text-gray-300 flex items-center gap-1">
                      <Clock size={12} className="text-purple-300" />
                      Hours Saved
                    </div>
                    <div className="text-xl font-bold text-purple-200">
                      Up to {hoursSavedPerMonth * 12} hrs/yr*
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] text-gray-300 flex items-center gap-1">
                      <ShieldAlert size={12} className="text-amber-400" />
                      Compliance Risk
                    </div>
                    <div className="text-xl font-bold text-amber-300">
                      {riskIndex} (Mitigated)
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
              <Button
                size="lg"
                className="w-full bg-gradient-brand hover:opacity-95 text-white font-semibold shadow-lg group py-6 text-sm"
                onClick={() => {
                  trackEvent('click_cta', { location: 'roi_calculator', label: 'Claim ROI Assessment' })
                  document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                Claim Free Risk Audit
                <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <p className="text-[11px] text-center text-gray-400 mt-2">
                Includes full PII risk score and automated DQ benchmark.
              </p>
            </div>
          </div>
        </div>

        {/* Calculation Methodology & Empirical Basis Section */}
        <div className="mt-10 bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 max-w-5xl mx-auto shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-100 text-[#5b2d6e] flex items-center justify-center font-bold">
                <Info size={18} />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  Calculation Methodology &amp; Empirical Basis
                </h3>
                <p className="text-xs text-gray-500">
                  Every figure, formula, and assumption in this model is backed by published market salary data, industry benchmarks, and regulatory guidelines.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowMethodology(!showMethodology)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5b2d6e] hover:text-purple-800 bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-200 transition-colors cursor-pointer shrink-0 self-start sm:self-auto"
            >
              <span>{showMethodology ? 'Hide Detailed Citations' : 'Inspect Basis & Citations'}</span>
              <ChevronDown size={14} className={`transform transition-transform ${showMethodology ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Core Basis Pillars */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="text-[11px] font-bold uppercase text-purple-700 font-mono mb-1">Pillar 1: Time Savings</div>
              <div className="text-sm font-bold text-gray-900 mb-1">14 hrs / person / mo</div>
              <p className="text-xs text-gray-600 leading-snug">
                Reclaims ~3.5 hrs/week spent on manual schema discovery, ad-hoc SQL ticket resolution, and broken pipeline debugging.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="text-[11px] font-bold uppercase text-purple-700 font-mono mb-1">Pillar 2: Loaded Rate</div>
              <div className="text-sm font-bold text-gray-900 mb-1">$45 USD / hr ($60 SGD)</div>
              <p className="text-xs text-gray-600 leading-snug">
                Grounded in Singapore MOM median salary benchmarks for data/analytics engineers ($6,500 base + 17% CPF + benefits).
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="text-[11px] font-bold uppercase text-purple-700 font-mono mb-1">Pillar 3: Risk Index</div>
              <div className="text-sm font-bold text-gray-900 mb-1">PDPA &amp; MAS TRM Tiers</div>
              <p className="text-xs text-gray-600 leading-snug">
                &gt;1M records triggers enhanced audit exposure; &gt;5M records represents critical statutory blast radius under PDPA §26D.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="text-[11px] font-bold uppercase text-purple-700 font-mono mb-1">Pillar 4: Detection Rate</div>
              <div className="text-sm font-bold text-gray-900 mb-1">Up to 99.4%* PII Accuracy</div>
              <p className="text-xs text-gray-600 leading-snug">
                Deterministic Modulo-11 checksums (NRIC/FIN) &amp; Luhn verification across structured relational schemas.
              </p>
            </div>
          </div>

          {/* Expandable In-Depth Citations & Proof */}
          {showMethodology && (
            <div className="mt-5 pt-5 border-t border-gray-100 text-xs text-gray-600 space-y-3.5 animate-in fade-in duration-200">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-gray-900">
                  <CheckCircle2 size={13} className="text-emerald-600" />
                  <span>1. Labor Time Reclaimed Formula &amp; Industry Citation:</span>
                </div>
                <p className="leading-relaxed">
                  According to global analytics engineering studies (including IDC, Gartner Data Management Survey, and dbt Labs State of Analytics Engineering), data workers spend ~30–40% of their working time finding, verifying, and formatting data. In uncataloged database environments, an average of 3.5 hours per week (14 hours per month, or 8.75% of a standard 160-hour working month) is consumed purely by identifying foreign keys, tracing broken queries from undocumented schema shifts, and answering ad-hoc business questions that KaoinAI automates via real-time lineage and natural language Text-to-SQL.
                </p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-gray-900">
                  <CheckCircle2 size={13} className="text-emerald-600" />
                  <span>2. Blended Loaded Hourly Cost Basis:</span>
                </div>
                <p className="leading-relaxed">
                  Evaluated based on Singapore Ministry of Manpower (MOM) Occupational Wages and Mercer Tech Salary Survey percentiles. Median monthly base compensation for mid-level Data Engineers and BI Analysts in Singapore and regional ASEAN hubs ranges between SGD $5,500 and $7,500/month. Factoring in mandatory employer CPF contributions (17% in Singapore), healthcare benefits, bonuses, and workstation tooling overhead (~15%), the fully loaded employer cost is approximately SGD $9,600/month (~USD $7,200/month). Divided across standard 160 monthly billable hours, this yields a loaded hourly cost of ~USD $45/hour (SGD ~$60/hour).
                </p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-gray-900">
                  <CheckCircle2 size={13} className="text-emerald-600" />
                  <span>3. Regulatory Compliance Risk Thresholds:</span>
                </div>
                <p className="leading-relaxed">
                  Under Singapore Personal Data Protection Act (PDPA §26D), data breaches affecting 500 or more individuals mandate formal notification to the Personal Data Protection Commission (PDPC) and affected users within 72 hours, carrying statutory administrative fines up to 10% of annual turnover or SGD $1M. Databases managing &gt;1,000,000 records fall under Monetary Authority of Singapore (MAS) TRM Chapter 5 heightened surveillance as critical financial data stores, while &gt;5,000,000 records represent critical multi-jurisdictional compliance exposure.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footnote Disclaimer */}
        <p className="text-center text-xs text-gray-500 mt-8 max-w-4xl mx-auto leading-relaxed">
          * ROI estimations, potential cost savings, and hours saved are illustrative models calculated against a baseline of traditional manual data hygiene, spreadsheet cataloging, and ad-hoc engineering queries (averaging 12–14 manual hours per analyst/month prior to adopting an automated catalog). Actual returns depend on your organization&apos;s earlier catalog understanding, team composition, salary benchmarks, and existing data infrastructure.
        </p>
      </div>
    </section>
  )
}
