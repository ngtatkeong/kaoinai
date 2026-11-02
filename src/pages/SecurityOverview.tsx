import { ShieldCheck, Lock, Server, Database, KeyRound, CheckCircle2, ArrowLeft, FileCheck } from 'lucide-react'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'

export default function SecurityOverview() {
  return (
    <div className="pt-24 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-slate-800">
      {/* Breadcrumb / Back button */}
      <div className="mb-8">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-sm font-medium text-teal-700 hover:text-teal-900 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>
      </div>

      {/* Header */}
      <div className="border-b border-slate-200 pb-8 mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold mb-4">
          <ShieldCheck size={14} className="text-emerald-600" />
          <span>Enterprise Security &amp; Trust Architecture</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight mb-3">
          Security &amp; Compliance Whitepaper
        </h1>
        <p className="text-base text-slate-600">
          How KaoinAI handles your database structure and personal-data records, built around the PDPA record-keeping duties in Singapore, Malaysia and Indonesia.
        </p>
      </div>

      {/* Core Architectural Pillars Grid */}
      <div className="grid sm:grid-cols-2 gap-4 mb-12">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-teal-300 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-4">
            <Lock size={20} />
          </div>
          <h2 className="text-base font-bold text-slate-950 mb-2">Read-Only Metadata Mesh</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            KaoinAI connects using read-only database credentials restricted to system catalogs. KaoinAI is designed to read column definitions and statistics, not customer rows.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-teal-300 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-4">
            <KeyRound size={20} />
          </div>
          <h2 className="text-base font-bold text-slate-950 mb-2">Encryption</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Data in transit is encrypted with TLS. Ask us about encryption at rest during your evaluation.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-teal-300 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-4">
            <Server size={20} />
          </div>
          <h2 className="text-base font-bold text-slate-950 mb-2">Air-Gapped &amp; On-Premises</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            KaoinAI can be deployed inside your own cloud account or on-premise. Ask us for the deployment details.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-teal-300 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center mb-4">
            <Database size={20} />
          </div>
          <h2 className="text-base font-bold text-slate-950 mb-2">Table-Bound DPIA &amp; RoPA</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Each record is kept against the PDPA duties in Singapore, Malaysia and Indonesia, so you can show it when asked.
          </p>
        </div>
      </div>

      {/* Deep-Dive Sections */}
      <div className="space-y-10 text-sm leading-relaxed text-slate-700">
        <section>
          <h2 className="text-xl font-bold text-slate-950 mb-4">
            1. Database Connection Design
          </h2>
          <p className="mb-4">
            Traditional data catalogs require massive ETL pipelines that dump entire data lakes into third-party cloud infrastructure. KaoinAI was designed specifically to eliminate this systemic risk:
          </p>
          <div className="bg-slate-950 text-slate-200 rounded-2xl p-5 font-mono text-xs overflow-x-auto border border-teal-500/20 mb-4">
            <div className="text-slate-500 mb-2"># Principle of Least Privilege Database Role Example</div>
            <div className="text-teal-400">CREATE ROLE kaoinai_governance WITH LOGIN PASSWORD &apos;...&apos;;</div>
            <div className="text-slate-300">GRANT CONNECT ON DATABASE prod_db TO kaoinai_governance;</div>
            <div className="text-slate-300">GRANT USAGE ON SCHEMA public TO kaoinai_governance;</div>
            <div className="text-slate-500 mt-2">-- Restrict strictly to metadata catalogs (no table SELECT permissions)</div>
            <div className="text-emerald-400">GRANT SELECT ON ALL TABLES IN SCHEMA information_schema TO kaoinai_governance;</div>
          </div>
          <p className="text-xs text-slate-600">
            Our query planners are designed to run against system catalogs (e.g., <code>information_schema.columns</code>, <code>pg_catalog</code>). Your customer data remains 100% untouched.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-950 mb-4">
            2. Regulatory Compliance Mappings
          </h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-4 rounded-xl border border-teal-200 bg-teal-50/40">
              <CheckCircle2 size={18} className="text-teal-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block text-xs">Singapore Personal Data Protection Act (PDPA 2012) &amp; Standard DPA</strong>
                <p className="text-xs text-slate-600 mb-1.5">
                  Fulfills the Protection Obligation (§24) and Accountability Obligation (§11-12) through automated table-level PII inventories, retention schedules, and DPIA drift tracking. KaoinAI acts as a Section 4(2) Data Intermediary governed by our standard DPA.
                </p>
                <div className="flex flex-wrap items-center gap-3 text-[11px] text-teal-900">
                  <span><strong>Designated DPO:</strong> Ng Tat Keong (<a href="mailto:tk.ng@kaoinai.com" className="underline hover:text-teal-950">tk.ng@kaoinai.com</a>)</span>
                  <span>&bull;</span>
                  <Link to="/dpa" className="underline font-semibold text-teal-700 hover:text-teal-950">
                    Review Singapore PDPA Agreement (DPA) &rarr;
                  </Link>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 bg-white">
              <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block text-xs">MAS Technology Risk Management (TRM) Guidelines</strong>
                <p className="text-xs text-slate-600">Complies with Section 9 (Data Security) and Section 10 (Access Control) by maintaining real-time schema lineage, preventing unauthorized PII pipeline exposure, and enforcing least privilege.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 bg-white">
              <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block text-xs">EU GDPR &amp; UK GDPR Article 30</strong>
                <p className="text-xs text-slate-600">Automates living Records of Processing Activities (RoPA) directly from database schemas, documenting legal processing basis, retention rules, and data subject categories.</p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-950 mb-3">
            3. Vulnerability Management &amp; Penetration Testing
          </h2>
          <p>
            KaoinAI undergoes continuous automated static code analysis (SAST), software composition analysis (SCA) for third-party dependencies, and routine external third-party penetration testing. All code commits are signed and validated through CI/CD security gates before staging or production deployment.
          </p>
        </section>

        {/* Action Callout */}
        <div className="bg-gradient-to-r from-teal-900 via-teal-950 to-slate-950 text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
              <FileCheck size={20} className="text-teal-300" />
              Request Comprehensive Security Package
            </h3>
            <p className="text-xs text-slate-300 max-w-md">
              Need to complete vendor risk assessments (SIG Lite, CAIQ, or custom CISO surveys)? We can answer your vendor questionnaire on request.
            </p>
          </div>
          <Button asChild size="lg" className="bg-teal-600 hover:bg-teal-500 text-white shrink-0">
            <Link to="/contact">
              Contact Security Team
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
