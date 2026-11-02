import { useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { getWhatsAppUrl } from '@/lib/whatsapp'

// Prices and feature lists are carried over from the previous pricing section.
// Claims that still need a source (SLA percentages, lookup limits) are kept as
// written and listed in concepts_brief.md for owner review.
type Mode = 'cloud' | 'onprem'
type Cycle = 'monthly' | 'annual'

interface Tier {
  name: string
  tagline: string
  highlight: boolean
  monthly: Record<Mode, number>
  annual: Record<Mode, number>
  setup: number
  points: Record<Mode, string[]>
  all: Record<Mode, string[]>
  cta: string
}

const tiers: Tier[] = [
  {
    name: 'Starter',
    tagline: 'Essential governance for a few data sources',
    highlight: false,
    monthly: { cloud: 590, onprem: 390 },
    annual: { cloud: 490, onprem: 320 },
    setup: 990,
    points: {
      cloud: ['Up to 3 connected data sources', 'PII scanning and masking', 'Schema drift alerts', 'Daily health report by email'],
      onprem: ['Single-node Docker deployment in your VPC', 'Data stays inside your network', 'Up to 3 local databases', 'PII scanning and local masking'],
    },
    all: {
      cloud: ['Automated PII scanning and dynamic SHA-256 masking', 'Continuous schema drift and anomaly alerts', 'AI-enhanced data catalog (1,500 lookups per month)', 'Daily automated health reports by email', 'Assisted 30-minute connection check', 'Standard technical support'],
      onprem: ['Single-node Docker deployment in your VPC', 'No external data transmission', 'Up to 3 local databases or warehouses', 'Local metadata storage in your network', 'Assisted VPC peering and Docker Compose start', 'Standard technical support'],
    },
    cta: 'Start 14-day VPC trial',
  },
  {
    name: 'Growth',
    tagline: 'Most selected for growing teams',
    highlight: true,
    monthly: { cloud: 1290, onprem: 890 },
    annual: { cloud: 990, onprem: 690 },
    setup: 1990,
    points: {
      cloud: ['Up to 10 connected data sources', 'Table-bound DPIA and living RoPA', 'Column-level lineage graph', 'Golden record matching'],
      onprem: ['Kubernetes (Helm) deployment in your VPC', 'Air-gapped storage of DPIA and inventory', 'Up to 10 internal data sources', 'Golden record matching on-premise'],
    },
    all: {
      cloud: ['Up to 10 connected data sources (DBs, CRMs, ERPs, APIs)', 'Table-bound DPIA and living data inventory (RoPA)', 'Real-time column-level lineage graph', 'Golden record MDM engine', 'Autonomous dbt model synthesis', 'Singapore PDPA, MAS TRM and GDPR statutory reports', 'Unlimited AI-aided database knowledgebase', 'Architecture onboarding included', 'Dedicated Slack Connect and WhatsApp channel'],
      onprem: ['Multi-container Kubernetes Helm deployment in your VPC', 'Air-gapped DPIA and data inventory storage', 'Local column lineage engine', 'On-premise golden record deduplication', 'Custom Singapore PDPA and MAS TRM reports', 'On-premise installation and hardening call', 'Dedicated Slack Connect and senior architect channel'],
    },
    cta: 'Start 14-day VPC trial',
  },
  {
    name: 'Enterprise',
    tagline: 'Custom scale and air-gapped deployments',
    highlight: false,
    monthly: { cloud: 3490, onprem: 2490 },
    annual: { cloud: 2790, onprem: 1990 },
    setup: 3990,
    points: {
      cloud: ['Unlimited data sources', 'Dedicated isolated cloud cluster', 'Custom role-based access and SSO', 'Named AI systems architect'],
      onprem: ['Unlimited data sources, multi-cloud or bare metal', 'Air-gapped multi-node cluster', 'Hardware security module (HSM) or custom KMS', 'Named principal architect on call'],
    },
    all: {
      cloud: ['Unlimited connected data sources and warehouses', 'Dedicated isolated cloud cluster (Singapore region)', 'Multi-database DPIA drift auditing and custom RoPA exports', 'Custom role-based access controls and Okta SSO', 'Custom DPA, security audit and penetration test review', 'Uptime commitment set out in the agreement', 'Dedicated named AI systems architect'],
      onprem: ['Unlimited data sources across multi-cloud or bare metal', 'Air-gapped multi-node high-availability Kubernetes cluster', 'Full sovereign DPIA registry and table lineage', 'HSM or custom KMS key support', 'Zero-trust network access and Okta or SAML integration', 'Custom regulatory architecture review and penetration test clearance', 'Severity-1 response commitment set out in the agreement', 'Dedicated named principal architect on call'],
    },
    cta: 'Schedule an architecture review',
  },
]

const money = (n: number) => `$${n.toLocaleString('en-US')}`

export default function PricingTiers() {
  const [mode, setMode] = useState<Mode>('cloud')
  const [cycle, setCycle] = useState<Cycle>('monthly')
  const [open, setOpen] = useState<string | null>(null)

  return (
    <section id="pricing" className="pricing-tiers scroll-mt-24">
      {/* Founding offer */}
      <div className="mx-auto max-w-3xl rounded-2xl border border-blue-400/30 bg-blue-500/10 px-6 py-5 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-200">Founding offer</p>
        <p className="mt-2 text-lg sm:text-xl font-semibold text-white">
          Free for your first 3 customers: $0 per month, with onboarding included.
        </p>
        <p className="mt-2 text-sm text-slate-300">After the first 3, standard pricing below applies.</p>
      </div>

      {/* Controls */}
      <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <div role="group" aria-label="Deployment" className="inline-flex rounded-full bg-white/5 p-1">
          {(['cloud', 'onprem'] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              aria-pressed={mode === m}
              onClick={() => setMode(m)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${mode === m ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'}`}
            >
              {m === 'cloud' ? 'Managed cloud' : 'Self-hosted'}
            </button>
          ))}
        </div>
        <div role="group" aria-label="Billing" className="inline-flex rounded-full bg-white/5 p-1">
          {(['monthly', 'annual'] as Cycle[]).map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={cycle === c}
              onClick={() => setCycle(c)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${cycle === c ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'}`}
            >
              {c === 'monthly' ? 'Monthly' : 'Annual'}
            </button>
          ))}
        </div>
      </div>
      <p className="mt-3 text-center text-xs text-slate-400">
        {mode === 'cloud' ? 'We host it in AWS Singapore.' : 'You run it inside your own VPC or on your own servers.'}
      </p>

      {/* Tiers */}
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {tiers.map((t) => {
          const price = cycle === 'monthly' ? t.monthly[mode] : t.annual[mode]
          const isOpen = open === t.name
          return (
            <article
              key={t.name}
              className={`relative flex flex-col rounded-3xl p-5 xl:p-7 transition-transform duration-300 hover:-translate-y-1 ${
                t.highlight
                  ? 'bg-gradient-to-b from-blue-600/30 to-slate-900/60 ring-1 ring-blue-400/50 shadow-2xl shadow-blue-900/40'
                  : 'bg-white/[0.04] ring-1 ring-white/10'
              }`}
            >
              {t.highlight && (
                <span className="absolute -top-3 left-7 rounded-full bg-blue-500 px-3 py-1 text-xs font-semibold text-white">
                  Most selected
                </span>
              )}
              <h3 className="text-xl font-semibold text-white">{t.name}</h3>
              <p className="mt-1 text-sm text-slate-300">{t.tagline}</p>

              <div className="mt-6 flex items-end gap-1">
                <span className="text-4xl font-bold tracking-tight text-white">{money(price)}</span>
                <span className="pb-1 text-sm text-slate-400">/ month</span>
              </div>
              <p className="mt-1 text-xs text-slate-400">One-time setup fee: {money(t.setup)}</p>

              <ul className="mt-6 space-y-3">
                {t.points[mode].map((p) => (
                  <li key={p} className="flex gap-3 text-sm text-slate-200">
                    <Check size={16} className="mt-0.5 shrink-0 text-blue-300" aria-hidden="true" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : t.name)}
                aria-expanded={isOpen}
                className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-blue-300 hover:text-blue-200"
              >
                {isOpen ? 'Hide full list' : 'See everything included'}
                <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
              </button>
              {isOpen && (
                <ul className="mt-4 space-y-2 border-t border-white/10 pt-4">
                  {t.all[mode].map((p) => (
                    <li key={p} className="text-sm text-slate-300">
                      {p}
                    </li>
                  ))}
                </ul>
              )}

              <a
                href={getWhatsAppUrl(`Hi KaoinAI team, I would like to discuss the ${t.name} plan.`)}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-auto pt-8 inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition-colors ${
                  t.highlight ? 'bg-blue-600 text-white hover:bg-blue-500' : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {t.cta}
              </a>
            </article>
          )
        })}
      </div>
    </section>
  )
}
