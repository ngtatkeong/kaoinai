import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router'
import { 
  X, 
  Check, 
  Copy, 
  ArrowRight, 
  Calendar, 
  FileText, 
  ShieldCheck, 
  Database, 
  Terminal, 
  Layers,
} from 'lucide-react'
import { featureDetails } from '@/data/featureDetails'
import { trackEvent } from '@/lib/analytics'

interface FeatureDetailModalProps {
  featureId: string | null
  onClose: () => void
  onOpenLeadMagnet: () => void
}

export default function FeatureDetailModal({
  featureId,
  onClose,
  onOpenLeadMagnet,
}: FeatureDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'workflow' | 'artifact' | 'compliance'>('workflow')
  const [copied, setCopied] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  const feature = featureId ? featureDetails[featureId] : null

  // Keyboard accessibility: Focus trap, focus restoration, and Escape to close
  useEffect(() => {
    if (!feature) return

    const previousActiveElement = document.activeElement as HTMLElement | null

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }

      // Focus trap for Tab and Shift+Tab (WCAG 2.1.2)
      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        if (focusableElements.length === 0) return

        const firstElement = focusableElements[0]
        const lastElement = focusableElements[focusableElements.length - 1]

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault()
            lastElement.focus()
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault()
            firstElement.focus()
          }
        }
      }
    }

    // Lock body scroll
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
      if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
        previousActiveElement.focus()
      }
    }
  }, [feature, onClose])

  // Reset tab when featureId changes
  const [prevFeatureId, setPrevFeatureId] = useState(featureId)
  if (prevFeatureId !== featureId) {
    setPrevFeatureId(featureId)
    setActiveTab('workflow')
    setCopied(false)
  }

  if (!feature) return null

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(feature.artifact.snippet)
      setCopied(true)
      trackEvent('explore_feature', { feature_name: `${feature.title}: copy code snippet` })
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard fallback
    }
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="feature-modal-title"
      aria-describedby="feature-modal-summary"
    >
      <div 
        ref={modalRef}
        className="bg-white w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl shadow-2xl border border-gray-200 overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 pb-4 border-b border-gray-100 flex items-start justify-between gap-4 bg-slate-50/80">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-100/80 text-[#5b2d6e] text-xs font-bold border border-purple-200/60">
                <Layers size={12} />
                {feature.category}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-100/80 text-emerald-800">
                {feature.badge}
              </span>
            </div>
            <h2 id="feature-modal-title" className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              {feature.title}
            </h2>
            <p id="feature-modal-summary" className="text-xs sm:text-sm text-gray-600 max-w-2xl leading-relaxed">
              {feature.summary}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors shrink-0 cursor-pointer"
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-5 sm:px-6 pt-3 border-b border-gray-100 bg-white flex gap-2 sm:gap-4 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('workflow')}
            className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'workflow'
                ? 'border-[#5b2d6e] text-[#5b2d6e]'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Terminal size={14} />
            <span>Operational Workflow</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('artifact')}
            className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'artifact'
                ? 'border-[#5b2d6e] text-[#5b2d6e]'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <FileText size={14} />
            <span>Code &amp; Config Artifact</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('compliance')}
            className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'compliance'
                ? 'border-[#5b2d6e] text-[#5b2d6e]'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <ShieldCheck size={14} />
            <span>Compliance &amp; Engines</span>
          </button>
        </div>

        {/* Tab Content Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* TAB 1: OPERATIONAL WORKFLOW */}
          {activeTab === 'workflow' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-1">
                  How This Works in Production
                </h3>
                <p className="text-xs text-gray-500">
                  Step-by-step procedure executed by your internal team or KaoinAI autonomous agents.
                </p>
              </div>

              <div className="space-y-3.5">
                {feature.workflow.map((item) => (
                  <div 
                    key={item.step}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-4"
                  >
                    <div className="w-8 h-8 rounded-xl bg-purple-100 text-[#5b2d6e] font-extrabold flex items-center justify-center shrink-0 text-sm shadow-xs">
                      {item.step}
                    </div>
                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-bold text-gray-900">{item.title}</span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white border border-gray-200 text-gray-600">
                          Role: {item.role}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {item.action}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Key Outcomes Box */}
              <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-100 space-y-2">
                <span className="text-xs font-bold text-[#5b2d6e] uppercase tracking-wider block">
                  Key Production Outcomes
                </span>
                <ul className="space-y-1.5 text-xs text-gray-700">
                  {feature.outcomes.map((outcome, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold shrink-0">✓</span>
                      <span>{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* TAB 2: TECHNICAL ARTIFACT */}
          {activeTab === 'artifact' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-gray-900">
                    {feature.artifact.title}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {feature.artifact.description}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold self-start sm:self-auto cursor-pointer transition-colors shadow-2xs"
                >
                  {copied ? (
                    <>
                      <Check size={14} className="text-green-600" />
                      <span className="text-green-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span>Copy Snippet</span>
                    </>
                  )}
                </button>
              </div>

              <div className="rounded-2xl bg-slate-900 text-slate-100 p-4 border border-slate-800 shadow-md">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-[11px] text-slate-400 font-mono">
                  <span>{feature.artifact.filename}</span>
                  <span className="uppercase font-semibold text-purple-400">{feature.artifact.type}</span>
                </div>
                <pre className="text-xs font-mono leading-relaxed overflow-x-auto text-slate-200 pb-2">
                  <code>{feature.artifact.snippet}</code>
                </pre>
              </div>
            </div>
          )}

          {/* TAB 3: COMPLIANCE & ENGINES */}
          {activeTab === 'compliance' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Compliance Mappings */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                  Statutory &amp; Regulatory Alignment
                </h3>
                <div className="grid sm:grid-cols-2 gap-3.5">
                  {feature.compliance.map((item, idx) => (
                    <div 
                      key={idx}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5"
                    >
                      <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5b2d6e]">
                        <ShieldCheck size={14} />
                        <span>{item.framework}</span>
                      </div>
                      <div className="text-xs font-semibold text-gray-900">
                        {item.section}
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {item.guarantee}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Supported Database Engines */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                  <Database size={14} className="text-[#5b2d6e]" />
                  <span>Certified Compatible Engines</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {feature.supportedEngines.map((engine) => (
                    <span 
                      key={engine}
                      className="text-xs font-semibold px-3 py-1 rounded-xl bg-purple-50 border border-purple-100 text-purple-950"
                    >
                      {engine}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Sticky Footer Action Bar */}
        <div className="p-4 sm:p-5 pb-[max(1rem,env(safe-area-inset-bottom))] border-t border-gray-100 bg-slate-50/90 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-gray-500 text-center sm:text-left">
            Ready to evaluate <strong className="text-gray-900 font-semibold">{feature.title}</strong> in your environment?
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => {
                onClose()
                onOpenLeadMagnet()
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-300 hover:border-purple-300 bg-white hover:bg-purple-50/50 text-gray-700 text-xs font-semibold transition-all cursor-pointer shadow-2xs"
            >
              <FileText size={14} />
              <span>Free PDPA Checklist (PDF)</span>
            </button>

            <Link
              to={`/contact?topic=${encodeURIComponent(feature.consultationTopic)}`}
              onClick={() => {
                onClose()
                trackEvent('click_cta', { location: 'feature_modal', label: `Book consultation for ${feature.title}` })
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#5b2d6e] hover:bg-[#482357] text-white text-xs font-semibold transition-all cursor-pointer shadow-md hover:shadow-lg"
            >
              <Calendar size={14} />
              <span>Book 1-on-1 Consultation</span>
              <ArrowRight size={13} className="ml-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
