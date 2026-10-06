import { useState } from 'react'
import { Link } from 'react-router'
import { 
  ShieldCheck, 
  Lock, 
  FileText, 
  ArrowLeft, 
  Copy, 
  Check, 
  Printer, 
  Mail, 
  Building2, 
  UserCheck, 
  AlertTriangle 
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { trackEvent } from '@/lib/analytics'

export default function DataProtectionAgreement() {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    const textContent = document.getElementById('pdpa-dpa-text')?.innerText || ''
    navigator.clipboard.writeText(textContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    trackEvent('copy_dpa_agreement', { type: 'pdpa_standard' })
  }

  const handlePrint = () => {
    window.print()
    trackEvent('print_dpa_agreement', { type: 'pdpa_standard' })
  }

  return (
    <div className="pt-24 pb-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-slate-800">
      {/* Navigation breadcrumbs */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <Link 
          to="/privacy" 
          className="inline-flex items-center gap-2 text-sm font-medium text-purple-700 hover:text-purple-900 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Privacy Policy
        </Link>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="text-xs border-purple-200 text-purple-800 hover:bg-purple-50"
          >
            {copied ? (
              <>
                <Check size={14} className="mr-1.5 text-emerald-600" />
                Copied Full Agreement
              </>
            ) : (
              <>
                <Copy size={14} className="mr-1.5" />
                Copy Agreement Text
              </>
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="text-xs border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            <Printer size={14} className="mr-1.5" />
            Print / Save as PDF
          </Button>
        </div>
      </div>

      {/* Header Banner */}
      <div className="border-b border-slate-200 pb-8 mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold mb-4">
          <ShieldCheck size={14} className="text-emerald-600" />
          <span>Singapore PDPA 2012 Standard Form Agreement • Section 4(2) Data Intermediary Terms</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight mb-3">
          PDPA Standard Data Protection &amp; Privacy Agreement
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
          Standard contractual clauses governing the processing of personal data and metadata between enterprise customers (&quot;Customer&quot; / &quot;Data Controller&quot;) and KaoinAI Pte. Ltd. (&quot;KaoinAI&quot; / &quot;Data Intermediary&quot;) in full accordance with the Singapore Personal Data Protection Act 2012 (No. 26 of 2012).
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-500 font-mono">
          <span>Effective Date: 1 January 2026</span>
          <span>•</span>
          <span>Version: PDPA-DPA-2026.1</span>
          <span>•</span>
          <span>Jurisdiction: Republic of Singapore</span>
        </div>
      </div>

      {/* Official DPO Appointment Card */}
      <div className="bg-gradient-to-r from-purple-50 via-white to-purple-50 rounded-2xl border-2 border-purple-200 p-6 sm:p-7 mb-10 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5 sm:mt-0">
              <UserCheck size={22} />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-100/70 px-2.5 py-0.5 rounded-full mb-1">
                <span>Statutory DPO Designation • Section 11(3) PDPA</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-950">
                Designated Data Protection Officer (DPO): Ng Tat Keong
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Appointed pursuant to Section 11(3) of the Personal Data Protection Act 2012 to ensure organizational adherence and handle data subject requests.
              </p>
            </div>
          </div>
          <div className="shrink-0 flex flex-col sm:items-end gap-1 text-xs">
            <a 
              href="mailto:tk.ng@kaoinai.com"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold transition-colors"
            >
              <Mail size={14} />
              <span>Contact DPO: tk.ng@kaoinai.com</span>
            </a>
            <span className="text-[11px] text-slate-500 font-mono">Also monitored: dpo@kaoinai.com</span>
          </div>
        </div>
      </div>

      {/* Main Legal Agreement Text */}
      <div id="pdpa-dpa-text" className="space-y-10 text-sm leading-relaxed text-slate-700 bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-sm">
        {/* Parties */}
        <section className="border-b border-slate-100 pb-6">
          <h2 className="text-lg font-bold text-slate-950 mb-3 flex items-center gap-2">
            <Building2 size={18} className="text-purple-600" />
            Parties to this Agreement
          </h2>
          <div className="grid sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-mono text-purple-700 uppercase font-bold block mb-1">
                Data Intermediary (Service Provider)
              </span>
              <p className="font-bold text-slate-900 text-sm">KaoinAI Pte. Ltd.</p>
              <p className="text-slate-600 mt-1">Incorporated in the Republic of Singapore</p>
              <p className="text-slate-600">Company DPO: <strong>Ng Tat Keong</strong> (<a href="mailto:tk.ng@kaoinai.com" className="text-purple-600 hover:underline">tk.ng@kaoinai.com</a>)</p>
              <p className="text-slate-600">Operational Hubs: Singapore &amp; Kuala Lumpur</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-mono text-purple-700 uppercase font-bold block mb-1">
                Organization (Data Controller)
              </span>
              <p className="font-bold text-slate-900 text-sm">The Customer</p>
              <p className="text-slate-600 mt-1">The legal entity subscribing to or deploying the KaoinAI Software Platform, whether via Cloud SaaS, VPC Kubernetes, or On-Premises Docker deployment.</p>
            </div>
          </div>
        </section>

        {/* Recitals */}
        <section>
          <h2 className="text-base font-bold text-slate-950 mb-2">RECITALS</h2>
          <ol className="list-decimal pl-5 space-y-1.5 text-xs text-slate-600">
            <li>Customer is an organization that collects, uses, or discloses personal data in the course of its commercial activities and is subject to the Singapore Personal Data Protection Act 2012 (&quot;PDPA&quot;).</li>
            <li>Customer engages KaoinAI to provide autonomous data governance, living metadata cataloging, table-bound DPIA tracking, and schema drift monitoring (the &quot;Services&quot;).</li>
            <li>In providing the Services, KaoinAI operates strictly as a <strong>Data Intermediary</strong> within the statutory meaning of Section 2(1) and Section 4(2) of the PDPA, processing metadata solely pursuant to the Customer&apos;s written instructions.</li>
            <li>The parties enter into this Agreement to formalize their statutory compliance obligations under Section 4(2), Section 24 (Protection Obligation), Section 25 (Retention Limitation Obligation), Section 26 (Transfer Limitation Obligation), and Part VIA (Data Breach Notification Obligation) of the PDPA.</li>
          </ol>
        </section>

        {/* Section 1: Definitions */}
        <section>
          <h2 className="text-lg font-bold text-slate-950 mb-3">1. Definitions &amp; Interpretation</h2>
          <ul className="space-y-2 text-xs text-slate-600">
            <li><strong>&quot;Applicable Law&quot;</strong> means the Personal Data Protection Act 2012 (No. 26 of 2012) of Singapore, including all subsidiary legislation, advisory guidelines, and regulations promulgated by the Personal Data Protection Commission (&quot;PDPC&quot;).</li>
            <li><strong>&quot;Data Intermediary&quot;</strong> has the statutory meaning set forth in Section 2(1) of the PDPA, being an organization that processes personal data on behalf of another organization under a contract in writing.</li>
            <li><strong>&quot;Personal Data&quot;</strong> has the meaning set forth in Section 2(1) of the PDPA, namely data, whether true or not, about an individual who can be identified from that data, or from that data and other information to which the organization has or is likely to have access.</li>
            <li><strong>&quot;Notifiable Data Breach&quot;</strong> has the meaning set forth in Section 26B of the PDPA, being any data breach that results in, or is likely to result in, significant harm to an affected individual, or is of a significant scale (involving 500 or more individuals).</li>
            <li><strong>&quot;Read-Only Metadata&quot;</strong> refers to structural and catalog schema information (table definitions, column names, data types, index mappings, constraints, and statistical histograms) as distinguished from underlying customer data rows.</li>
          </ul>
        </section>

        {/* Section 2: Scope & Processing Instructions */}
        <section>
          <h2 className="text-lg font-bold text-slate-950 mb-3">2. Processing Instructions &amp; Zero-Replication Architecture</h2>
          <div className="space-y-2 text-xs text-slate-600">
            <p><strong>2.1 Statutory Role:</strong> The parties acknowledge that with respect to customer personal data processed through the software, Customer acts as the Organization (Controller) and KaoinAI acts solely as a Data Intermediary.</p>
            <p><strong>2.2 Written Instructions:</strong> KaoinAI shall process personal data and metadata strictly in accordance with Customer&apos;s written instructions, including the parameters configured in the software and the terms of this Agreement.</p>
            <p><strong>2.3 Zero-Replication Architectural Safeguard:</strong> KaoinAI&apos;s platform operates on an intentional read-only metadata framework. KaoinAI covenants that it does <em>not</em> copy, replicate, or persistently store raw database rows, consumer transaction records, or decrypted PII payloads on its servers. Scanning for PII patterns (such as Singapore NRIC, phone numbers, and payment details) is conducted in-memory and ephemerally, with only statistical classification flags recorded in the catalog.</p>
            <p><strong>2.4 Prohibition on AI Training:</strong> KaoinAI shall not use Customer personal data or proprietary schema metadata to train, fine-tune, or calibrate public foundational artificial intelligence models.</p>
          </div>
        </section>

        {/* Section 3: The 10 PDPA Obligations Compliance Matrix */}
        <section>
          <h2 className="text-lg font-bold text-slate-950 mb-3">3. Compliance with the 10 PDPA Data Protection Obligations</h2>
          <p className="text-xs text-slate-600 mb-4">
            Under Section 4(2) of the PDPA, a Data Intermediary processing data on behalf of an organization remains directly subject to the <strong>Protection Obligation</strong> and <strong>Retention Limitation Obligation</strong>, while assisting the Organization in satisfying the remaining obligations:
          </p>
          
          <div className="grid gap-3 text-xs">
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
              <strong className="text-slate-950 block mb-1">A. Protection Obligation (Section 24, PDPA) — Mandatory Intermediary Compliance</strong>
              <p className="text-slate-600">KaoinAI implements and maintains reasonable technical and organizational measures to prevent unauthorized access, collection, use, disclosure, copying, modification, or disposal. All data in transit is encrypted using TLS 1.3 with forward secrecy; all metadata at rest is encrypted using AES-256 with client-managed KMS options. Dynamic column masking is enforced at the query proxy layer.</p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
              <strong className="text-slate-950 block mb-1">B. Retention Limitation Obligation (Section 25, PDPA) — Mandatory Intermediary Compliance</strong>
              <p className="text-slate-600">KaoinAI ceases retention of Customer metadata and temporary processing logs as soon as the purpose for which they were collected is no longer served by retention, or upon termination of the Customer subscription. Customer may invoke instant cryptographic erasure of all catalog entries via the management console.</p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
              <strong className="text-slate-950 block mb-1">C. Access &amp; Correction Obligations (Sections 21–22, PDPA) — Intermediary Assistance</strong>
              <p className="text-slate-600">To enable Customer to satisfy statutory Data Subject Access Requests (DSARs) within the mandatory 30-day timeline prescribed by Regulation 4 of the Personal Data Protection Regulations, KaoinAI provides automated search across all cataloged databases to pinpoint everywhere an individual&apos;s identifiers reside.</p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
              <strong className="text-slate-950 block mb-1">D. Transfer Limitation Obligation (Section 26, PDPA) — Cross-Border Safeguards</strong>
              <p className="text-slate-600">KaoinAI shall not transfer personal data outside the Republic of Singapore unless the recipient jurisdiction or cloud region provides a standard of protection comparable to the protection under the Singapore PDPA. All default managed cloud clusters reside in Singapore (AWS ap-southeast-1 region). Air-gapped on-premises deployments maintain 100% data sovereignty within Customer&apos;s local perimeter.</p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
              <strong className="text-slate-950 block mb-1">E. Accountability Obligation (Sections 11–12, PDPA)</strong>
              <p className="text-slate-600">KaoinAI maintains formal internal data protection policies, has appointed <strong>Ng Tat Keong</strong> as statutory Data Protection Officer, maintains living Data Inventories (RoPA) and Table-Bound DPIAs, and subjects its infrastructure to annual third-party penetration testing and SOC 2 Type II audit alignment.</p>
            </div>
          </div>
        </section>

        {/* Section 4: Data Breach Notification */}
        <section>
          <h2 className="text-lg font-bold text-slate-950 mb-3 flex items-center gap-2">
            <AlertTriangle size={18} className="text-amber-600" />
            4. Mandatory Data Breach Notification Protocol (Part VIA, PDPA)
          </h2>
          <div className="space-y-2.5 text-xs text-slate-600">
            <p><strong>4.1 Statutory Notification to Customer:</strong> Pursuant to Section 26C(1) of the PDPA, if KaoinAI becomes aware of a data breach affecting Customer personal data, KaoinAI shall notify the Customer <strong>without undue delay</strong>, and in any event within <strong>twenty-four (24) hours</strong> of confirmation.</p>
            <p><strong>4.2 Mandatory 72-Hour PDPC Reporting Support:</strong> KaoinAI acknowledges that under Section 26D of the PDPA, Customer has a statutory obligation to notify the PDPC within seventy-two (72) hours of assessing that a breach is notifiable. KaoinAI shall promptly provide Customer with:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Description of the nature of the breach, including affected system nodes and timestamps.</li>
              <li>Estimated number of records or data subjects potentially impacted.</li>
              <li>Root-cause technical diagnosis and immediate remedial containment actions taken.</li>
              <li>Direct point of contact for the incident: DPO Ng Tat Keong (<a href="mailto:tk.ng@kaoinai.com" className="text-purple-600 hover:underline">tk.ng@kaoinai.com</a>).</li>
            </ul>
          </div>
        </section>

        {/* Section 5: Sub-processors */}
        <section>
          <h2 className="text-lg font-bold text-slate-950 mb-3">5. Sub-processors &amp; Security Audits</h2>
          <div className="space-y-2 text-xs text-slate-600">
            <p><strong>5.1 Authorized Infrastructure Providers:</strong> Customer grants general authorization for KaoinAI to utilize approved infrastructure sub-processors (Amazon Web Services Singapore Pte. Ltd. for managed cloud hosting). All sub-processors are bound by written agreements imposing data protection standards no less stringent than this Agreement.</p>
            <p><strong>5.2 Audit Rights:</strong> Upon thirty (30) days prior written notice, KaoinAI shall provide Customer or its independent certified auditor with executive summaries of its SOC 2 Type II audit reports, ISO 27001 certifications, and recent penetration testing attestations.</p>
          </div>
        </section>

        {/* Section 6: Data Protection Officer & Governance Desk */}
        <section className="bg-purple-50/70 p-5 rounded-xl border border-purple-200">
          <h2 className="text-base font-bold text-slate-950 mb-2 flex items-center gap-2">
            <Lock size={16} className="text-purple-700" />
            6. Statutory DPO Appointment &amp; Inquiries
          </h2>
          <p className="text-xs text-slate-600 mb-3">
            In compliance with Section 11(3) of the Personal Data Protection Act 2012, all statutory privacy inquiries, data subject access requests, regulatory notices, and security correspondence shall be directed to:
          </p>
          <div className="text-xs text-slate-800 space-y-1.5 font-sans">
            <p><strong>Designated DPO:</strong> Ng Tat Keong</p>
            <p><strong>Corporate Title:</strong> Data Protection Officer &amp; Principal Solutions Architect</p>
            <p><strong>Direct Inquiries Email:</strong> <a href="mailto:tk.ng@kaoinai.com" className="text-purple-700 font-bold hover:underline">tk.ng@kaoinai.com</a></p>
            <p><strong>Statutory DPO Mailbox:</strong> <a href="mailto:dpo@kaoinai.com" className="text-purple-700 font-bold hover:underline">dpo@kaoinai.com</a></p>
            <p><strong>Organization:</strong> KaoinAI Pte. Ltd. (Singapore &amp; Malaysia)</p>
          </div>
        </section>

        {/* Section 7: Governing Law */}
        <section>
          <h2 className="text-lg font-bold text-slate-950 mb-2">7. Governing Law &amp; SIAC Arbitration</h2>
          <p className="text-xs text-slate-600">
            This Agreement shall be governed by, and construed in accordance with, the laws of the <strong>Republic of Singapore</strong>. Any dispute arising out of or in connection with this contract, including any question regarding its existence, validity, or termination, shall be referred to and finally resolved by arbitration administered by the Singapore International Arbitration Centre (&quot;SIAC&quot;) in accordance with the Arbitration Rules of the Singapore International Arbitration Centre for the time being in force.
          </p>
        </section>

        {/* Signatures Representation */}
        <section className="pt-6 border-t border-slate-200">
          <div className="grid sm:grid-cols-2 gap-6 text-xs text-slate-600">
            <div>
              <p className="font-bold text-slate-900 mb-1">For and on behalf of KaoinAI Pte. Ltd.:</p>
              <p className="font-semibold text-purple-900">Ng Tat Keong</p>
              <p>Data Protection Officer (DPO)</p>
              <p className="font-mono text-[11px] text-slate-500">Authorized Signatory • PDPA Compliance</p>
            </div>
            <div>
              <p className="font-bold text-slate-900 mb-1">For and on behalf of Customer:</p>
              <p className="italic text-slate-500">Authorized Representative / Data Protection Officer</p>
              <p className="text-slate-500">Executed electronically upon account creation or subscription</p>
            </div>
          </div>
        </section>
      </div>

      {/* Bottom Action Footer */}
      <div className="mt-12 text-center text-xs text-slate-500 space-y-3">
        <p>
          Need a countersigned enterprise DPA on your company&apos;s custom legal paper?
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href="mailto:tk.ng@kaoinai.com?subject=Enterprise%20PDPA%20DPA%20Countersignature%20Request"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-xs transition-colors"
          >
            <Mail size={14} />
            <span>Request Custom Countersigned DPA from TK Ng</span>
          </a>
          <Link
            to="/privacy"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors"
          >
            <FileText size={14} />
            <span>View Privacy Policy</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
