import { Link } from 'react-router'
import { ArrowRight, Building2, MapPin, ShieldCheck, UserCheck } from 'lucide-react'

// The story text is the owner's own wording, carried over from the previous site
// (commit b5cacfd, English version). The facts cards use only what the repo
// states: company name, roles and locations.
export default function About() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 sm:pt-36 pb-20 text-slate-200">
      <p className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-400/10 px-3 py-1 text-xs font-semibold text-blue-200">
        About KaoinAI
      </p>

      {/* Koine etymology */}
      <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-8 sm:p-10">
        <p className="text-sm text-blue-300">κοινή · koinai</p>
        <h1 className="mt-3 text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
          The lingua franca of data. For everyone.
        </h1>
        <p className="mt-6 text-base sm:text-lg text-slate-300 leading-relaxed">
          Our name comes from the Greek <em>koinē</em>, the historic lingua franca of the ancient world that democratized
          knowledge across cultures. Its plural form, <em>koinai</em> ("shared commons"), directly inspired{' '}
          <strong className="text-white">KaoinAI</strong>. We believe enterprise-grade AI and data governance must be shared
          for all, not just a chosen few.
        </p>
      </div>

      {/* Story */}
      <section className="mt-16">
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-300">Why we built this</p>
        <p className="mt-4 text-2xl sm:text-3xl font-semibold text-white leading-snug">
          Big companies have armies of data engineers.
          <br />
          <span className="text-blue-300">You have KaoinAI.</span>
        </p>
        <div className="mt-8 space-y-5 text-base text-slate-300 leading-relaxed">
          <p>
            We spent years watching growing businesses struggle: generating massive volumes of valuable data every day, yet
            locked out by exorbitant tools, complex architectures, and specialized data teams that only tech giants can
            afford.
          </p>
          <p>
            So, we built KaoinAI, an all-in-one data intelligence platform that unifies natural language search, automated
            cataloging, data quality scoring, and enterprise-grade governance into a single system that deploys in minutes.
          </p>
          <p>
            Our name is rooted in history. In the ancient world, <em>Koine</em> (κοινή) was the historic <em>lingua franca</em>,
            the universal common language that bridged cultures, dissolved barriers, and democratized the exchange of
            knowledge. Its plural form, <em>koinai</em> (κοιναί), meaning "shared commons," directly inspired{' '}
            <strong className="text-white">KaoinAI</strong>.
          </p>
          <p>
            This is our core philosophy:{' '}
            <strong className="text-white">AI should be shared for all, not just a chosen few.</strong> Advanced data governance
            and AI intelligence should never be the exclusive privilege of Fortune 500 monopolies. They should be a common
            standard, empowering every business to speak the language of their data and make confident, data-driven decisions.
          </p>
        </div>
      </section>

      {/* Facts */}
      <div className="mt-16 grid gap-5 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <Building2 size={20} className="text-blue-300" aria-hidden="true" />
          <h2 className="mt-3 text-lg font-semibold text-white">Who we are</h2>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">KaoinAI Pte. Ltd. operates in Singapore and Malaysia.</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <UserCheck size={20} className="text-blue-300" aria-hidden="true" />
          <h2 className="mt-3 text-lg font-semibold text-white">Leadership</h2>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            TK Ng, Principal AI and Data Governance Architect. TK Ng is also the designated Data Protection Officer.
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <ShieldCheck size={20} className="text-blue-300" aria-hidden="true" />
          <h2 className="mt-3 text-lg font-semibold text-white">How we work with data</h2>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            The product is designed to read database structure rather than copy customer rows. See the security overview for
            details.
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <MapPin size={20} className="text-blue-300" aria-hidden="true" />
          <h2 className="mt-3 text-lg font-semibold text-white">Where we are</h2>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">Singapore and Kuala Lumpur, Malaysia.</p>
        </div>
      </div>

      <div className="mt-12 flex flex-col sm:flex-row gap-3">
        <Link
          to="/contact"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 transition-colors"
        >
          Talk to us
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
        <Link
          to="/security"
          className="inline-flex items-center justify-center rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold px-6 py-3 transition-colors"
        >
          Security overview
        </Link>
      </div>
    </main>
  )
}
