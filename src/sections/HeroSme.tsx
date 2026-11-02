import { useRef, type MouseEvent } from 'react'
import { Link } from 'react-router'
import { ArrowRight, Database, ShieldCheck } from 'lucide-react'

const sampleRows = [
  { table: 'customers', column: 'email', category: 'Contact details', record: 'Marketing consent', status: 'Mapped' },
  { table: 'orders', column: 'delivery_address', category: 'Address', record: 'Order fulfilment', status: 'Mapped' },
  { table: 'staff', column: 'id_number', category: 'National ID', record: 'Payroll', status: 'Review' },
]

export default function HeroSme() {
  const sceneRef = useRef<HTMLDivElement>(null)

  // Tilt the 3D scene toward the pointer. Only for fine pointers; the CSS
  // turns the float animation off for users who prefer reduced motion.
  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = sceneRef.current
    if (!el || !window.matchMedia('(pointer: fine)').matches) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    el.style.setProperty('--ry', `${(x * 14).toFixed(2)}deg`)
    el.style.setProperty('--rx', `${(-y * 10).toFixed(2)}deg`)
  }
  const onLeave = () => {
    const el = sceneRef.current
    if (!el) return
    el.style.setProperty('--ry', '-6deg')
    el.style.setProperty('--rx', '3deg')
  }

  return (
    <section className="relative overflow-hidden bg-slate-950 text-white">
      <div aria-hidden="true" className="hero-backdrop pointer-events-none absolute inset-0" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 sm:pt-36 lg:pt-40 pb-20 sm:pb-24">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-16 items-center">
          <div className="min-w-0 text-center lg:text-left">
            <p className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-400/10 px-3 py-1 text-xs font-semibold tracking-wide text-blue-200">
              Built for small and mid-sized businesses
            </p>
            <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.08]">
              Know where your customers&apos; personal data sits.{' '}
              <span className="hero-text-grad">
                Keep your PDPA records up to date.
              </span>
            </h1>
            <p className="mt-6 text-lg text-slate-300 leading-relaxed">
              KaoinAI finds the database columns that hold personal data and keeps a plain-language record of them.
              It covers Singapore PDPA, Malaysia PDPA and Indonesia UU PDP.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 transition-colors shadow-lg shadow-blue-900/40"
              >
                Talk to us
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <a
                href="#sample-inventory"
                className="inline-flex items-center justify-center rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold px-6 py-3 transition-colors"
              >
                See a sample inventory
              </a>
            </div>
          </div>

          {/* 3D scene: layered planes behind a floating sample card */}
          <div
            ref={sceneRef}
            onMouseMove={onMove}
            onMouseLeave={onLeave}
            className="hero-scene relative min-w-0 py-6"
          >
            <div aria-hidden="true" className="hero-plane hero-plane-back" />
            <div aria-hidden="true" className="hero-plane hero-plane-mid" />
            <figure id="sample-inventory" className="hero-card relative rounded-2xl bg-white text-slate-900 shadow-2xl shadow-blue-950/60 ring-1 ring-white/10 overflow-hidden">
              <figcaption className="flex items-center justify-between gap-3 px-4 py-3 border-b border-slate-200 bg-white">
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <Database size={16} className="text-blue-600" aria-hidden="true" />
                  Data inventory
                </span>
                <span className="text-xs font-medium text-amber-800 bg-amber-100 px-2 py-0.5 rounded">Sample data</span>
              </figcaption>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th scope="col" className="px-4 py-2 font-semibold">Table.column</th>
                      <th scope="col" className="px-4 py-2 font-semibold">Personal data</th>
                      <th scope="col" className="px-4 py-2 font-semibold">Record</th>
                      <th scope="col" className="px-4 py-2 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-100">
                    {sampleRows.map((row) => (
                      <tr key={`${row.table}.${row.column}`}>
                        <td className="px-4 py-3 font-mono text-xs text-slate-800 whitespace-nowrap">{row.table}.{row.column}</td>
                        <td className="px-4 py-3 text-slate-700">{row.category}</td>
                        <td className="px-4 py-3 text-slate-700">{row.record}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 text-xs font-semibold ${row.status === 'Mapped' ? 'text-blue-700' : 'text-amber-800'}`}>
                            {row.status === 'Mapped' && <ShieldCheck size={14} aria-hidden="true" />}
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </figure>
          </div>
        </div>
      </div>
    </section>
  )
}
