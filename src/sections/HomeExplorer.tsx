import { useCallback, useEffect, useId, useRef, useState } from 'react'
import ModelView from '../components/ModelView'
import ProductShowcase from './ProductShowcase'
import InteractiveDemo from './InteractiveDemo'
import Features from './Features'
import Integrations from './Integrations'
import ProblemSolution from './ProblemSolution'
import HowItWorks from './HowItWorks'
import SecurityTrust from './SecurityTrust'
import Comparison from './Comparison'
import MaturityRiskAudit from './MaturityRiskAudit'
import RoiCalculator from './RoiCalculator'
import KnowledgeCenter from './KnowledgeCenter'
import FAQ from './FAQ'
import PricingTiers from './PricingTiers'

// Each tab groups related sections. `anchors` lists every element id that
// lives inside the tab, so a nav link can switch to the right tab first.
const tabs = [
  { key: 'product', label: 'Product', note: 'Product screens use illustrative sample data. Figures shown are examples, not measured results.', anchors: ['product-tour', 'demo', 'features', 'integrations'], Views: [ProductShowcase, InteractiveDemo, Features, Integrations] },
  { key: 'problem', label: 'The problem', note: '', anchors: ['problem-solution', 'how-it-works'], Views: [ProblemSolution, HowItWorks] },
  { key: 'security', label: 'Security', note: '', anchors: ['security'], Views: [SecurityTrust] },
  { key: 'proof', label: 'Compare', note: 'Comparison figures describe typical approaches, not measured results from named vendors.', anchors: ['case-studies', 'compare'], Views: [Comparison] },
  { key: 'tools', label: 'Tools', note: 'Estimates depend on the inputs you enter. Figures shown are examples.', anchors: ['audit', 'roi-calculator'], Views: [MaturityRiskAudit, RoiCalculator] },
  { key: 'pricing', label: 'Pricing', note: '', anchors: ['pricing'], Views: [PricingTiers] },
  { key: 'resources', label: 'Resources', note: 'Research summaries. Figures shown are examples, not measured results.', anchors: ['knowledge-center'], Views: [KnowledgeCenter] },
  { key: 'faq', label: 'FAQ', note: '', anchors: ['faq'], Views: [FAQ] },
] as const

type TabKey = (typeof tabs)[number]['key']

function tabForAnchor(id: string): TabKey | undefined {
  return tabs.find((t) => (t.anchors as readonly string[]).includes(id))?.key
}

export default function HomeExplorer() {
  const [active, setActive] = useState<TabKey>('product')
  const baseId = useId()
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    const header = document.querySelector('header')
    const headerHeight = header ? header.getBoundingClientRect().height : 76
    const y = el.getBoundingClientRect().top + window.pageYOffset - headerHeight - 12
    window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' })
  }, [])

  // Nav links call this event (see scrollToAnchor in Navigation.tsx) so the
  // right tab opens before the browser scrolls to the section.
  useEffect(() => {
    const onReveal = (e: Event) => {
      const id = (e as CustomEvent<string>).detail
      const key = tabForAnchor(id)
      if (!key) return
      setActive(key)
      window.setTimeout(() => scrollTo(id), 60)
    }
    window.addEventListener('reveal-section', onReveal)
    // Direct links such as /#faq should open the matching tab on first load.
    const hashId = window.location.hash.replace('#', '')
    if (hashId) {
      const key = tabForAnchor(hashId)
      if (key) {
        setActive(key)
        window.setTimeout(() => scrollTo(hashId), 60)
      }
    }
    return () => window.removeEventListener('reveal-section', onReveal)
  }, [scrollTo])

  const current = tabs.find((t) => t.key === active) ?? tabs[0]

  const onKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
    e.preventDefault()
    const next = (index + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length
    setActive(tabs[next].key)
    tabRefs.current[tabs[next].key]?.focus()
  }

  return (
    <section id="explore" className="bg-white border-b border-slate-200 py-12 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex justify-center">
          <div className="mx-auto w-full max-w-md">
            <ModelView src="/models/orbit.glb" alt="A glowing KaoinAI core with three orbit rings for PII scanning, lineage and RoPA records" height={320} hotspots={[{ position: "-1.7m -0.4m 0m", text: "PII scan" }, { position: "1.1m 1.5m 0.2m", text: "Lineage" }, { position: "0.2m -1.2m 1.2m", text: "RoPA" }]} />
          </div>
        </div>
        <div role="tablist" aria-label="Explore KaoinAI" className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
          {tabs.map((t, i) => {
            const selected = t.key === active
            return (
              <button
                key={t.key}
                ref={(el) => { tabRefs.current[t.key] = el }}
                id={`${baseId}-tab-${t.key}`}
                role="tab"
                aria-selected={selected}
                aria-controls={`${baseId}-panel`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(t.key)}
                onKeyDown={(e) => onKeyDown(e, i)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  selected
                    ? 'bg-blue-700 text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {t.label}
              </button>
            )
          })}
        </div>
        <div id={`${baseId}-panel`} role="tabpanel" aria-labelledby={`${baseId}-tab-${current.key}`} className="mt-8">
          {current.note && <p className="mb-6 text-sm text-slate-500 italic">{current.note}</p>}
          {current.Views.map((View, i) => (
            <View key={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
