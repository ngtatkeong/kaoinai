import { useState, lazy, Suspense } from 'react'
import { useSearchParams } from 'react-router'
import { 
  Shield, 
  CheckCircle, 
  Database, 
  Brain, 
  GitBranch, 
  FileSearch, 
  TrendingUp, 
  AlertTriangle, 
  Zap, 
  BarChart3, 
  Leaf, 
  ShieldCheck, 
  Layers, 
  Globe, 
  ArrowRight,
  Sparkles
} from 'lucide-react'
import { trackEvent } from '@/lib/analytics'
import LeadMagnetModal from '@/components/LeadMagnetModal'

const loadFeatureDetailModal = () => import('@/components/FeatureDetailModal')
const FeatureDetailModal = lazy(loadFeatureDetailModal)

const features = [
  {
    id: 'data-governance',
    icon: Shield,
    title: 'Data Governance (DG)',
    description: 'Enterprise-grade governance framework with role-based access control, audit trails, and compliance reporting for SOX, GDPR, HIPAA, and PDPA.',
    color: 'from-purple-500 to-indigo-600',
    bgColor: 'bg-purple-50',
  },
  {
    id: 'data-quality',
    icon: CheckCircle,
    title: 'Data Quality (DQ)',
    description: 'AI-powered quality monitoring with intelligent rule suggestions, natural language rule creation, completeness metrics, and violation tracking.',
    color: 'from-green-500 to-emerald-600',
    bgColor: 'bg-green-50',
  },
  {
    id: 'master-data-management',
    icon: Database,
    title: 'Master Data Management (MDM)',
    description: 'Automatic golden record creation, hierarchy management, deduplication, and cross-system master data synchronization.',
    color: 'from-blue-500 to-cyan-600',
    bgColor: 'bg-blue-50',
  },
  {
    id: 'table-bound-dpia',
    icon: ShieldCheck,
    title: 'Table-Bound DPIA & Data Inventory',
    description: 'Binds statutory DPIAs and living Data Inventories (RoPA) directly to physical database tables & columns containing PII, with automated drift alerts and dynamic masking.',
    color: 'from-red-500 to-rose-600',
    bgColor: 'bg-red-50',
  },
  {
    id: 'ai-db-knowledgebase',
    icon: Brain,
    title: 'AI-Aided DB Knowledgebase',
    description: 'Living, AI-curated database knowledgebase that maps tribal schema logic, foreign key semantics, and table definitions so teams instantly understand every dataset.',
    color: 'from-amber-500 to-orange-600',
    bgColor: 'bg-amber-50',
  },
  {
    id: 'data-lineage',
    icon: GitBranch,
    title: 'Data Lineage',
    description: 'End-to-end column-level lineage tracing. Understand where your data comes from, how it transforms, and what it impacts.',
    color: 'from-teal-500 to-emerald-600',
    bgColor: 'bg-teal-50',
  },
  {
    id: 'data-catalog',
    icon: FileSearch,
    title: 'AI-Enhanced Data Catalog',
    description: 'Self-updating data catalog with AI-synthesized table documentation, business glossaries, and automated semantic indexing that eliminates undocumented schema debt.',
    color: 'from-violet-500 to-purple-600',
    bgColor: 'bg-violet-50',
  },
  {
    id: 'auto-insights',
    icon: TrendingUp,
    title: 'Auto-Insights',
    description: 'Proactive anomaly detection, trend analysis, correlation discovery, and AI-generated actionable recommendations.',
    color: 'from-pink-500 to-rose-600',
    bgColor: 'bg-pink-50',
  },
  {
    id: 'dbt-transformations',
    icon: Zap,
    title: 'Data Transformations (dbt)',
    description: 'Create dbt models using natural language. Auto-generate SQL, YAML, tests, and documentation. Deploy to dbt Cloud in one click.',
    color: 'from-yellow-500 to-amber-600',
    bgColor: 'bg-yellow-50',
  },
  {
    id: 'risk-scoring',
    icon: AlertTriangle,
    title: 'Risk Scoring',
    description: 'Identify data risks before they become problems. Automated risk assessment with severity classification and remediation guidance.',
    color: 'from-orange-500 to-red-600',
    bgColor: 'bg-orange-50',
  },
  {
    id: 'esg-analytics',
    icon: Leaf,
    title: 'ESG Analytics',
    description: 'Track and report Environmental, Social, and Governance metrics. AI-powered ESG insights aligned with global standards.',
    color: 'from-emerald-500 to-green-600',
    bgColor: 'bg-emerald-50',
  },
  {
    id: 'schema-shifts',
    icon: BarChart3,
    title: 'Schema Shifts Detection',
    description: 'Automatically detect schema changes, track drift, and get alerted when your database structure evolves unexpectedly.',
    color: 'from-indigo-500 to-blue-600',
    bgColor: 'bg-indigo-50',
  },
  {
    id: 'data-architect',
    icon: Layers,
    title: 'Data Architect & Optimization',
    description: 'Autonomous schema analysis, normal form validation, index optimization recommendations, and SQL query efficiency tuning.',
    color: 'from-cyan-500 to-blue-600',
    bgColor: 'bg-cyan-50',
  },
  {
    id: 'dpo-toolkit',
    icon: Globe,
    title: 'DPO Toolkit & ASEAN Compliance',
    description: 'Dedicated Data Protection Officer toolkit covering Singapore PDPA, Malaysia PDPA (2024), and Indonesia UU PDP with DSR workflows and review queues.',
    color: 'from-teal-500 to-emerald-600',
    bgColor: 'bg-teal-50',
  },
]

export default function Features() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [localFeatureId, setLocalFeatureId] = useState<string | null>(null)
  const [leadMagnetOpen, setLeadMagnetOpen] = useState(false)

  // Query parameter support (?feature=data-governance)
  const paramFeatureId = searchParams.get('feature')
  const selectedFeatureId = localFeatureId || (paramFeatureId && features.some(f => f.id === paramFeatureId) ? paramFeatureId : null)

  const handleOpenDetails = (id: string) => {
    setLocalFeatureId(id)
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      next.set('feature', id)
      return next
    }, { replace: true })
    const feature = features.find(f => f.id === id)
    trackEvent('explore_feature', { feature_name: feature ? feature.title : id })
  }

  const handleCloseDetails = () => {
    setLocalFeatureId(null)
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      next.delete('feature')
      return next
    }, { replace: true })
  }

  return (
    <section id="features" className="py-24 sm:py-32 bg-purple-50/60 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 border border-purple-100 text-[#5b2d6e] text-sm font-semibold mb-4 shadow-2xs">
            <Zap size={16} />
            <span>All-in-One Platform</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            Everything You Need for Data Excellence
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            From governance to analytics, KaoinAI covers every aspect of modern data management. 
            Click any feature below for more details—including end-to-end production workflows, supported database engines, real code artifacts, and compliance guarantees.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature) => (
            <button
              key={feature.id}
              type="button"
              onClick={() => handleOpenDetails(feature.id)}
              onMouseEnter={loadFeatureDetailModal}
              onFocus={loadFeatureDetailModal}
              className="group bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 hover:border-purple-300 hover:shadow-xl active:scale-[0.99] transition-all duration-300 flex flex-col justify-between text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
              aria-haspopup="dialog"
              aria-label={`View more details for ${feature.title}`}
            >
              <div>
                <div className={`w-14 h-14 rounded-2xl ${feature.bgColor} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-xs`}>
                  <feature.icon size={26} className={`text-transparent bg-clip-text bg-gradient-to-br ${feature.color}`} style={{ color: 'inherit' }} />
                </div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#5b2d6e] transition-colors">{feature.title}</h3>
                  <span className="text-xs font-bold text-purple-700 bg-purple-50 group-hover:bg-[#5b2d6e] group-hover:text-white px-3 py-1 rounded-full border border-purple-200 transition-all shrink-0 shadow-2xs">
                    More Details &rarr;
                  </span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">{feature.description}</p>
              </div>

              <div className="pt-4 border-t border-gray-100 mt-2 w-full">
                <div className="flex items-center justify-between py-2.5 px-3.5 rounded-xl bg-purple-50/70 group-hover:bg-gradient-brand group-hover:text-white text-[#5b2d6e] border border-purple-100 group-hover:border-transparent transition-all shadow-2xs w-full">
                  <span className="text-xs font-bold flex items-center gap-1.5">
                    <Sparkles size={13} className="text-purple-600 group-hover:text-purple-200" />
                    <span>More Details</span>
                  </span>
                  <span className="text-xs font-bold flex items-center gap-1">
                    <span className="text-[11px] opacity-85 font-medium hidden sm:inline">Workflow &amp; Code</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform shrink-0" />
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Table-Bound DPIA & Data Inventory Spotlight Banner */}
        <div className="mt-16 sm:mt-20 bg-white rounded-3xl p-8 sm:p-12 border border-purple-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-purple-50 rounded-full blur-3xl -z-0 pointer-events-none" />
          <div className="relative z-10">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                <ShieldCheck size={14} className="text-emerald-600" />
                <span>Zero-Stale-Spreadsheets Guarantee</span>
              </span>
              <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md">
                Direct Schema-to-Compliance Architecture
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
              Why Table-Linked DPIA & Data Inventory Storage Changes Everything
            </h3>
            <p className="text-sm sm:text-base text-gray-600 max-w-3xl mb-8 leading-relaxed">
              Traditional compliance platforms (OneTrust, manual surveys, static Excel sheets) store compliance records in isolated silos. When software engineers add tables or migrate schemas, compliance documents immediately become obsolete. <strong className="text-gray-900 font-semibold">KaoinAI binds DPIAs and Data Inventories (RoPA) directly to your production database tables containing PII</strong>, creating a living, audit-ready link between code and compliance.
            </p>

            <div className="grid sm:grid-cols-3 gap-5">
              <button
                type="button"
                onClick={() => handleOpenDetails('table-bound-dpia')}
                onMouseEnter={loadFeatureDetailModal}
                className="p-5 rounded-2xl bg-slate-50 hover:bg-white border border-slate-200/80 hover:border-purple-300 hover:shadow-md transition-all text-left flex flex-col justify-between group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-[#5b2d6e] flex items-center justify-center font-bold mb-3 group-hover:scale-105 transition-transform">
                    1
                  </div>
                  <h4 className="font-bold text-gray-900 group-hover:text-[#5b2d6e] text-base mb-1 transition-colors">Physical Table Binding</h4>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-3">
                    Every table with PII (Postgres, Snowflake, MySQL) is directly associated with its statutory DPIA assessment, legal processing basis, and retention schedule.
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold text-[#5b2d6e] w-full">
                  <span>More Details: Table-Bound DPIA</span>
                  <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleOpenDetails('schema-shifts')}
                onMouseEnter={loadFeatureDetailModal}
                className="p-5 rounded-2xl bg-slate-50 hover:bg-white border border-slate-200/80 hover:border-purple-300 hover:shadow-md transition-all text-left flex flex-col justify-between group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-[#5b2d6e] flex items-center justify-center font-bold mb-3 group-hover:scale-105 transition-transform">
                    2
                  </div>
                  <h4 className="font-bold text-gray-900 group-hover:text-[#5b2d6e] text-base mb-1 transition-colors">Autonomous Drift Alerts</h4>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-3">
                    When migrations add new columns or modify data structures, KaoinAI immediately flags unclassified PII, preventing compliance documentation lag.
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold text-[#5b2d6e] w-full">
                  <span>More Details: Schema Shifts</span>
                  <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleOpenDetails('dpo-toolkit')}
                onMouseEnter={loadFeatureDetailModal}
                className="p-5 rounded-2xl bg-slate-50 hover:bg-white border border-slate-200/80 hover:border-purple-300 hover:shadow-md transition-all text-left flex flex-col justify-between group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-[#5b2d6e] flex items-center justify-center font-bold mb-3 group-hover:scale-105 transition-transform">
                    3
                  </div>
                  <h4 className="font-bold text-gray-900 group-hover:text-[#5b2d6e] text-base mb-1 transition-colors">One-Click RoPA Export</h4>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-3">
                    Export complete statutory Records of Processing Activities (RoPA) with column-level PII mappings, ready for Singapore PDPC or GDPR supervisory audits in seconds.
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold text-[#5b2d6e] w-full">
                  <span>More Details: DPO Toolkit</span>
                  <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lazy-Loaded Feature Detail Modal */}
      <Suspense fallback={
        selectedFeatureId ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
            <div className="bg-white p-5 rounded-2xl shadow-xl flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-semibold text-gray-700">Loading feature specifications...</span>
            </div>
          </div>
        ) : null
      }>
        {selectedFeatureId && (
          <FeatureDetailModal
            key={selectedFeatureId}
            featureId={selectedFeatureId}
            onClose={handleCloseDetails}
            onOpenLeadMagnet={() => setLeadMagnetOpen(true)}
          />
        )}
      </Suspense>

      {/* Shared Lead Magnet Modal for Whitepaper / Checklist */}
      <LeadMagnetModal
        isOpen={leadMagnetOpen}
        onClose={() => setLeadMagnetOpen(false)}
      />
    </section>
  )
}
