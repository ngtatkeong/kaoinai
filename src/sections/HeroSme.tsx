import { Link } from 'react-router'
import { ArrowRight, Database, ShieldCheck } from 'lucide-react'

const sampleRows = [
  { table: 'customers', column: 'email', category: 'Contact details', record: 'Marketing consent', status: 'Mapped' },
  { table: 'orders', column: 'delivery_address', category: 'Address', record: 'Order fulfilment', status: 'Mapped' },
  { table: 'staff', column: 'id_number', category: 'National ID', record: 'Payroll', status: 'Review' },
]

export default function HeroSme() {
  return (
    <section className="relative bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-48 sm:pt-40 lg:pt-36 pb-16 sm:pb-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="min-w-0 text-center lg:text-left">
            <p className="text-sm font-semibold text-teal-800 tracking-wide">
              Built for small and mid-sized businesses
            </p>
            <h1 className="mt-4 text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
              Know where your customers&apos; personal data sits. Keep your PDPA records up to date.
            </h1>
            <p className="mt-6 text-lg text-slate-600 leading-relaxed">
              KaoinAI finds the database columns that hold personal data and keeps a plain-language record of them.
              It covers Singapore PDPA, Malaysia PDPA and Indonesia UU PDP.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-semibold px-6 py-3 transition-colors"
              >
                Talk to us
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <a
                href="#sample-inventory"
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-semibold px-6 py-3 transition-colors"
              >
                See a sample inventory
              </a>
            </div>
          </div>

          <figure id="sample-inventory" className="min-w-0 rounded-xl border border-slate-200 bg-slate-50 shadow-sm overflow-hidden">
            <figcaption className="flex items-center justify-between gap-3 px-4 py-3 border-b border-slate-200 bg-white">
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-800">
                <Database size={16} className="text-teal-700" aria-hidden="true" />
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
                        <span className={`inline-flex items-center gap-1 text-xs font-semibold ${row.status === 'Mapped' ? 'text-emerald-700' : 'text-amber-800'}`}>
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
    </section>
  )
}
