import { Link } from 'react-router'
import { useState } from 'react'
import { ArrowRight, ChevronDown, Database, FileText, Link2, ShieldCheck, Users } from 'lucide-react'

const sectionTitle = 'text-3xl sm:text-4xl font-bold tracking-tight text-slate-900'
const sectionIntro = 'mt-4 text-base sm:text-lg text-slate-600 leading-relaxed'
const primaryButton =
  'inline-flex items-center justify-center gap-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-semibold px-6 py-3 transition-colors'

export function ProblemFrame() {
  const points = [
    { title: 'Spreadsheets fall out of date', text: 'A record of processing kept by hand is wrong within weeks of the next system change.' },
    { title: 'Nobody knows every place personal data lives', text: 'Customer details end up in the CRM, the billing tool, the order database and the staff files.' },
    { title: 'A regulator asks, and you have days', text: 'When someone complains or asks what you hold, you need the answer quickly and in writing.' },
  ]
  return (
    <section id="problem" className="py-16 sm:py-24 bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className={sectionTitle}>Keeping personal data records shouldn&apos;t depend on memory</h2>
        <p className={sectionIntro}>Most small businesses track personal data in a spreadsheet, and the spreadsheet is always behind.</p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {points.map((p) => (
            <div key={p.title} className="rounded-xl border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-lg font-semibold text-slate-900">{p.title}</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function HowItWorksSme() {
  const steps = [
    { icon: Link2, title: 'Connect your database', text: 'Give KaoinAI read access to your database structure. You choose which databases to connect.' },
    { icon: Database, title: 'Review the columns it finds', text: 'KaoinAI suggests which columns hold personal data. You confirm or change each one.' },
    { icon: FileText, title: 'Keep the record up to date', text: 'Each table gets a plain-language entry: what the data is, why you hold it, and who sees it.' },
  ]
  return (
    <section id="how-it-works" className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className={sectionTitle}>Three steps to a record you can show</h2>
        <ol className="mt-10 grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.title} className="rounded-xl bg-white border border-slate-200 p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-700 text-white text-sm font-bold">{i + 1}</span>
                <s.icon size={18} className="text-teal-700" aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">{s.title}</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export function DataHandlingSme() {
  const items = [
    'Reads table and column names, data types and how each column is used.',
    'Does not copy your customer rows into KaoinAI to build the record.',
    'You decide which databases are connected and can disconnect them at any time.',
  ]
  return (
    <section id="security" className="py-16 sm:py-24 bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-10 lg:grid-cols-2 lg:items-start">
        <div>
          <h2 className={sectionTitle}>What KaoinAI reads, and what it doesn&apos;t</h2>
          <p className={sectionIntro}>Your customer records stay in your own systems. Here is what the product touches.</p>
        </div>
        <ul className="space-y-4">
          {items.map((text) => (
            <li key={text} className="flex gap-3 rounded-xl border border-slate-200 bg-slate-50 p-5">
              <ShieldCheck size={20} className="shrink-0 text-teal-700 mt-0.5" aria-hidden="true" />
              <span className="text-sm sm:text-base text-slate-700 leading-relaxed">{text}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export function PricingSme() {
  return (
    <section id="pricing" className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className={sectionTitle}>One plan, priced for your business</h2>
        <p className={sectionIntro}>
          Tell us how many databases you have and what you need. We will send a quote.
        </p>
        <div className="mt-8">
          <Link to="/contact" className={primaryButton}>
            Get a quote
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}

const faqs = [
  {
    q: 'What is a record of processing (RoPA)?',
    a: 'It is a list of the personal data you hold, what it is used for, and who it is shared with. Singapore PDPA, Malaysia PDPA and Indonesia UU PDP each expect businesses to keep something like it.',
  },
  {
    q: 'What do I need to connect?',
    a: 'Read access to the database structure. You do not need to change your systems or write queries.',
  },
  {
    q: 'Does KaoinAI store my customer records?',
    a: 'KaoinAI is designed to work from table and column structure, not from customer rows. The details of where data is processed are on our security page.',
  },
]

export function FaqSme() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <section id="faq" className="py-16 sm:py-24 bg-white border-b border-slate-200">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className={sectionTitle}>Questions</h2>
        <div className="mt-8 divide-y divide-slate-200 rounded-xl border border-slate-200">
          {faqs.map((item, i) => {
            const isOpen = open === i
            return (
              <div key={item.q}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-slate-900"
                >
                  {item.q}
                  <ChevronDown size={18} className={`shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
                </button>
                {isOpen && <p className="px-5 pb-5 text-sm sm:text-base text-slate-600 leading-relaxed">{item.a}</p>}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export function FinalCtaSme() {
  return (
    <section id="contact-cta" className="py-16 sm:py-24 bg-teal-800 text-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Users size={28} className="mx-auto text-teal-200" aria-hidden="true" />
        <h2 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight">See your own tables in your own record</h2>
        <p className="mt-4 text-teal-100 leading-relaxed">Send us a note and we will walk through your setup with you.</p>
        <div className="mt-8">
          <Link
            to="/contact"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-white text-teal-900 hover:bg-teal-50 font-semibold px-6 py-3 transition-colors"
          >
            Talk to us
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
