import { 
  ShieldCheck, 
  Lock, 
  EyeOff, 
  Server, 
  Database, 
  Mail, 
  ArrowLeft, 
  CheckCircle2, 
  FileText, 
  UserCheck, 
  AlertTriangle,
  ArrowRight
} from 'lucide-react'
import { Link } from 'react-router'

export default function PrivacyPolicy() {
  return (
    <div className="pt-24 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-slate-800">
      {/* Breadcrumb / Back button */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-sm font-medium text-purple-700 hover:text-purple-900 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>

        <Link
          to="/dpa"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5b2d6e] bg-purple-50 hover:bg-purple-100 border border-purple-200 px-3.5 py-1.5 rounded-xl transition-colors"
        >
          <FileText size={14} />
          <span>View B2B PDPA Data Protection Agreement (DPA)</span>
          <ArrowRight size={13} />
        </Link>
      </div>

      {/* Header */}
      <div className="border-b border-slate-200 pb-8 mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold mb-4">
          <ShieldCheck size={14} className="text-emerald-600" />
          <span>Statutory Compliance • Singapore PDPA 2012 Standard Privacy Framework</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight mb-3">
          Singapore PDPA Privacy Policy &amp; Standard Privacy Agreement
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
          Comprehensive statutory privacy policy and personal data protection agreement governing KaoinAI Pte. Ltd. (&quot;KaoinAI&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) pursuant to the Singapore Personal Data Protection Act 2012 (No. 26 of 2012) and relevant regional data privacy statutes.
        </p>
        <p className="text-xs text-slate-400 mt-2 font-mono">
          Last Updated &amp; Effective: 1 January 2026 • Version 3.0 • Governing Jurisdiction: Republic of Singapore
        </p>
      </div>

      {/* Official DPO Appointment Callout */}
      <div className="bg-gradient-to-r from-purple-50 via-white to-purple-50 rounded-2xl border-2 border-purple-200 p-6 sm:p-7 mb-10 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5 sm:mt-0">
              <UserCheck size={22} />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-100/70 px-2.5 py-0.5 rounded-full mb-1">
                <span>Statutory DPO Designation • Section 11(3) Singapore PDPA</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-950">
                Company Data Protection Officer (DPO): Ng Tat Keong
              </h2>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                KaoinAI has formally designated <strong>Ng Tat Keong</strong> as the company&apos;s statutory Data Protection Officer (DPO) to oversee compliance with the Personal Data Protection Act 2012, execute Data Subject Access Requests (DSAR), and act as primary liaison to the Personal Data Protection Commission (PDPC).
              </p>
            </div>
          </div>
          <div className="shrink-0 flex flex-col sm:items-end gap-1.5 text-xs">
            <a 
              href="mailto:tk.ng@kaoinai.com"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold transition-colors shadow-xs"
            >
              <Mail size={14} />
              <span>Email DPO: tk.ng@kaoinai.com</span>
            </a>
            <span className="text-[11px] text-slate-500 font-mono">Statutory Mailbox: dpo@kaoinai.com</span>
          </div>
        </div>
      </div>

      {/* Core Architecture Callout */}
      <div className="bg-gradient-to-br from-purple-50 via-indigo-50/50 to-white rounded-2xl border border-purple-200 p-6 sm:p-8 mb-12 shadow-xs">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-md">
            <Lock size={22} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-950 mb-2">
              Our Zero-Replication Architectural Safeguard
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed mb-4">
              KaoinAI operates on an intentional <strong>Read-Only Metadata Architecture</strong>. We do <strong>NOT</strong> copy, replicate, ingest, or store raw database rows, customer PII records, or production transaction tables on our cloud servers. All PII pattern recognition (such as Singapore NRIC, credit card, or phone number detection) is conducted ephemerally in-memory.
            </p>
            <div className="grid sm:grid-cols-2 gap-3 text-xs text-slate-600">
              <div className="flex items-center gap-2 bg-white/80 p-2.5 rounded-lg border border-purple-100">
                <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                <span>Zero raw customer PII stored on KaoinAI servers</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 p-2.5 rounded-lg border border-purple-100">
                <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                <span>Metadata-only schema drift &amp; lineage analysis</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Body Content */}
      <div className="space-y-10 text-sm leading-relaxed text-slate-700">
        <section>
          <h2 className="text-xl font-bold text-slate-950 mb-3 flex items-center gap-2">
            1. Scope &amp; Applicable Statutory Frameworks
          </h2>
          <p className="mb-3">
            This Privacy Policy and Standard Privacy Agreement governs how KaoinAI Pte. Ltd. (incorporated in Singapore, with regional operations in Malaysia, referred to as &quot;KaoinAI&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) collects, processes, uses, discloses, and safeguards personal data when you visit our website (<strong>kaoinai.com</strong>), use our cloud platform, deploy our self-hosted Docker/Kubernetes connectors, or interact with our solutions architects.
          </p>
          <p>
            We strictly uphold statutory personal data protection mandates across ASEAN and global operating jurisdictions:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1 text-xs text-slate-600">
            <li><strong>Singapore Personal Data Protection Act 2012 (PDPA)</strong> and its subsidiary legislation (Personal Data Protection Regulations 2021).</li>
            <li><strong>Monetary Authority of Singapore Technology Risk Management Guidelines (MAS TRM)</strong>.</li>
            <li><strong>Malaysia Personal Data Protection Act 2010 (PDPA)</strong> (including the 2024 Amendments).</li>
            <li><strong>Indonesia Law No. 27 of 2022 on Personal Data Protection (UU PDP)</strong>.</li>
            <li><strong>European Union General Data Protection Regulation (GDPR)</strong>.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-950 mb-3 flex items-center gap-2">
            2. Adherence to the 10 Statutory Obligations of the Singapore PDPA
          </h2>
          <p className="mb-4 text-xs text-slate-600">
            KaoinAI structures all operational policies around the 10 fundamental Data Protection Obligations established by the PDPC under the Singapore PDPA:
          </p>

          <div className="grid gap-3.5 text-xs">
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
              <strong className="text-slate-900 block mb-1">1. Consent Obligation (Sections 13–17, PDPA)</strong>
              <p className="text-slate-600">We collect, use, or disclose personal data only with the individual&apos;s express, informed consent, or where deemed consent applies (such as contractual necessity for enterprise services). Individuals may withdraw consent at any time by contacting our DPO.</p>
            </div>

            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
              <strong className="text-slate-900 block mb-1">2. Purpose Limitation Obligation (Section 18, PDPA)</strong>
              <p className="text-slate-600">Personal data is processed strictly for purposes that a reasonable person would consider appropriate in the circumstances (e.g. providing data governance intelligence, user authentication, customer support, and statutory compliance reporting).</p>
            </div>

            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
              <strong className="text-slate-900 block mb-1">3. Notification Obligation (Section 20, PDPA)</strong>
              <p className="text-slate-600">We notify individuals of the purposes for which their personal data will be collected, used, or disclosed on or before the point of collection.</p>
            </div>

            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
              <strong className="text-slate-900 block mb-1">4. Access &amp; Correction Obligations (Sections 21–22, PDPA)</strong>
              <p className="text-slate-600">Individuals have the statutory right to request access to their personal data and information about how it has been used or disclosed within the past 12 months, as well as the right to request correction of inaccurate data. Requests are processed within 30 calendar days.</p>
            </div>

            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
              <strong className="text-slate-900 block mb-1">5. Accuracy Obligation (Section 23, PDPA)</strong>
              <p className="text-slate-600">We take reasonable measures to ensure that personal data collected by or on behalf of KaoinAI is accurate and complete, particularly where it is used to make decisions affecting the individual or disclosed to another organization.</p>
            </div>

            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
              <strong className="text-slate-900 block mb-1">6. Protection Obligation (Section 24, PDPA)</strong>
              <p className="text-slate-600">We protect personal data in our possession or under our control by making reasonable security arrangements to prevent unauthorized access, collection, use, disclosure, copying, modification, or disposal. All data in transit uses TLS 1.3; data at rest uses AES-256 encryption.</p>
            </div>

            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
              <strong className="text-slate-900 block mb-1">7. Retention Limitation Obligation (Section 25, PDPA)</strong>
              <p className="text-slate-600">We cease retention of documents containing personal data, or remove the means by which personal data can be associated with individuals, as soon as retention is no longer necessary for legal or business purposes.</p>
            </div>

            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
              <strong className="text-slate-900 block mb-1">8. Transfer Limitation Obligation (Section 26, PDPA)</strong>
              <p className="text-slate-600">We do not transfer personal data outside Singapore unless the recipient jurisdiction provides a standard of protection that is comparable to the protection under the Singapore PDPA. Our primary cloud clusters are hosted in Singapore (AWS ap-southeast-1).</p>
            </div>

            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
              <strong className="text-slate-900 block mb-1">9. Accountability Obligation (Sections 11–12, PDPA)</strong>
              <p className="text-slate-600">KaoinAI maintains demonstrable compliance policies, has appointed <strong>Ng Tat Keong</strong> as Data Protection Officer (DPO), publishes DPO contact channels openly, and implements Data Protection Impact Assessments (DPIAs) and living Data Inventories (RoPA).</p>
            </div>

            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
              <strong className="text-slate-900 block mb-1">10. Data Breach Notification Obligation (Part VIA / Section 26D, PDPA)</strong>
              <p className="text-slate-600">In the event of a notifiable data breach affecting 500+ individuals or likely to cause significant harm, KaoinAI notifies the Personal Data Protection Commission (PDPC) within 72 hours and affected individuals as required by law.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-950 mb-3 flex items-center gap-2">
            3. Categories of Information Processed
          </h2>
          <div className="space-y-4">
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
              <h3 className="font-semibold text-slate-900 mb-1 flex items-center gap-2">
                <Database size={16} className="text-purple-600" />
                A. Read-Only Schema &amp; Metadata (Operational Telemetry)
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                When you connect databases (PostgreSQL, Snowflake, MySQL, BigQuery, RDS), our connectors read only structural catalog metadata: table names, column names, data types, index definitions, foreign key constraints, and statistical histograms. <em>Raw table rows never leave your perimeter.</em>
              </p>
            </div>

            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
              <h3 className="font-semibold text-slate-900 mb-1 flex items-center gap-2">
                <Server size={16} className="text-indigo-600" />
                B. Corporate Account &amp; Identity Records
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Business contact information including representative name, work email address, company name, job role, and technical inquiry details when you request an evaluation, schedule a 1-on-1 architecture review, or subscribe to software tiers.
              </p>
            </div>

            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
              <h3 className="font-semibold text-slate-900 mb-1 flex items-center gap-2">
                <EyeOff size={16} className="text-teal-600" />
                C. Ephemeral In-Memory PII Token Classification
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                When our classification engines inspect column samples for sensitive PII (such as Singapore NRIC Modulo-11 patterns or credit cards), classification is conducted in-memory. Samples are immediately discarded once classification metadata is registered.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-950 mb-3">
            4. Role as a Data Intermediary under PDPA Section 4(2)
          </h2>
          <p className="mb-3">
            When enterprise customers utilize KaoinAI to index and govern their databases, Customer acts as the <strong>Organization (Data Controller)</strong> and KaoinAI acts strictly as a <strong>Data Intermediary (Data Processor)</strong> within the meaning of Section 2(1) and Section 4(2) of the PDPA.
          </p>
          <p className="mb-3">
            As a Data Intermediary, KaoinAI is directly subject to the <strong>Protection Obligation</strong> and <strong>Retention Limitation Obligation</strong>, and contractually covenants to:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
            <li>Process Customer data solely upon Customer&apos;s written documented instructions.</li>
            <li>Maintain zero raw data replication and implement role-based access control.</li>
            <li>Notify Customer within 24 hours of confirming any security incident affecting customer data.</li>
            <li>Assist Customer in fulfilling statutory Data Subject Access Requests (DSAR) within required timelines.</li>
          </ul>
          <div className="mt-4 p-4 rounded-xl bg-purple-50 border border-purple-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div>
              <strong className="text-purple-950 font-bold block">Need our formal B2B Data Intermediary Agreement?</strong>
              <span className="text-purple-900/70">Access our standard form contractual clauses for enterprise vendor clearance.</span>
            </div>
            <Link
              to="/dpa"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-colors shrink-0"
            >
              <span>View PDPA Standard DPA</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-950 mb-3">
            5. Data Subject Rights &amp; Formal DSAR Protocol
          </h2>
          <p className="mb-3">
            Under Sections 21 and 22 of the Singapore PDPA, individuals have statutory rights to request access to and correction of their personal data held by KaoinAI:
          </p>
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-2 text-xs">
            <p><strong>How to Submit a Request:</strong> Send a written request directly to our Data Protection Officer, <strong>Ng Tat Keong</strong>, at <a href="mailto:tk.ng@kaoinai.com" className="text-purple-600 font-bold hover:underline">tk.ng@kaoinai.com</a> with the subject line <em>&quot;PDPA Data Subject Access Request (DSAR)&quot;</em>.</p>
            <p><strong>Response Timeline:</strong> As prescribed by Regulation 4 of the Personal Data Protection Regulations 2021, our DPO will respond within <strong>thirty (30) calendar days</strong> of receiving your verified request. If more time is required due to complexity, we will notify you in writing within 30 days specifying the extension period and reasons.</p>
            <p><strong>Identity Verification:</strong> To protect personal privacy, our DPO will require reasonable proof of identity before disclosing records.</p>
            <p><strong>Zero-Fee Policy:</strong> Standard access and correction requests are processed free of charge. Where a request is manifestly excessive, reasonable search fees may be notified beforehand.</p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-950 mb-3 flex items-center gap-2">
            <AlertTriangle size={18} className="text-amber-600" />
            6. Mandatory Data Breach Notification Protocol (Part VIA)
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed mb-3">
            Pursuant to Section 26D of the Singapore PDPA and Part 3 of the Personal Data Protection (Notification of Data Breaches) Regulations 2021:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600">
            <li>Where a data breach is assessed to result in significant harm or affects 500+ individuals, our DPO will notify the Personal Data Protection Commission (PDPC) as soon as practicable, and in any event within <strong>72 hours</strong>.</li>
            <li>Affected individuals will be notified without undue delay with recommendations on protective actions.</li>
            <li>Where KaoinAI acts as a Data Intermediary, KaoinAI notifies the Customer organization within <strong>24 hours</strong> of confirmation pursuant to Section 26C.</li>
          </ul>
        </section>

        {/* Section 7: DPO Contact Section */}
        <section className="bg-gradient-to-br from-purple-50 via-white to-purple-50 rounded-2xl p-6 sm:p-8 border-2 border-purple-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-950 mb-2 flex items-center gap-2">
            <UserCheck size={20} className="text-purple-600" />
            7. Data Protection Officer (DPO) Contact Details
          </h2>
          <p className="text-xs text-slate-600 mb-4 leading-relaxed">
            In compliance with Section 11(3) of the Personal Data Protection Act 2012, our designated Data Protection Officer is publicly registered and available for all personal data protection inquiries, feedback, or statutory complaints:
          </p>
          
          <div className="grid sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5 p-4 rounded-xl bg-white border border-purple-100 shadow-2xs">
              <p><strong>Designated DPO:</strong> Ng Tat Keong</p>
              <p><strong>Title:</strong> Data Protection Officer &amp; Principal Solutions Architect</p>
              <p><strong>Primary DPO Email:</strong> <a href="mailto:tk.ng@kaoinai.com" className="text-purple-700 font-bold hover:underline">tk.ng@kaoinai.com</a></p>
              <p><strong>Secondary DPO Mailbox:</strong> <a href="mailto:dpo@kaoinai.com" className="text-purple-700 font-bold hover:underline">dpo@kaoinai.com</a></p>
            </div>
            <div className="space-y-1.5 p-4 rounded-xl bg-white border border-purple-100 shadow-2xs">
              <p><strong>Entity Name:</strong> KaoinAI Pte. Ltd.</p>
              <p><strong>Operating Regions:</strong> Singapore &amp; Malaysia</p>
              <p><strong>Statutory Authority:</strong> Personal Data Protection Commission (PDPC) Singapore</p>
              <p><strong>PDPC Complaints Portal:</strong> <a href="https://www.pdpc.gov.sg" target="_blank" rel="noopener noreferrer" className="text-purple-700 hover:underline">pdpc.gov.sg</a></p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
