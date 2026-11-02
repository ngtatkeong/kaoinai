import { useState } from 'react'
import { Sparkles, ArrowRight, X } from 'lucide-react'
import { getWhatsAppUrl, WHATSAPP_NUMBER } from '@/lib/whatsapp'
import { trackEvent } from '@/lib/analytics'

interface AnnouncementBarProps {
  onDismiss?: () => void
}

export default function AnnouncementBar({ onDismiss }: AnnouncementBarProps) {
  const [visible, setVisible] = useState(true)

  if (!visible) return null

  const handleCtaClick = () => {
    trackEvent('click_announcement', { label: 'New' })
    const el = document.getElementById('how-it-works')
    if (el) {
      const yOffset = -80
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  return (
    <aside aria-label="Announcement" className="bg-gradient-to-r from-blue-50 via-blue-50/70 to-blue-50 text-slate-800 text-xs sm:text-sm py-2 px-3 sm:px-4 relative z-50 border-b border-blue-200/80 shadow-xs backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2.5 flex-grow justify-center text-center">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/95 border border-blue-200 text-blue-800 text-[11px] font-semibold shadow-xs">
            <Sparkles size={11} className="text-blue-600" />
            <span>New</span>
          </span>
          <span className="text-slate-700 text-xs sm:text-sm line-clamp-2">
            We now cover Singapore, Malaysia and Indonesia personal data laws. Find the columns that hold personal data and keep your records current.
          </span>
          <button
            onClick={handleCtaClick}
            className="hidden sm:inline-flex items-center gap-1 font-semibold text-blue-700 hover:text-blue-950 cursor-pointer transition-colors text-xs sm:text-sm group ml-1 underline decoration-blue-300 hover:decoration-blue-700 underline-offset-2"
          >
            <span>See how it works</span>
            <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform text-blue-700" />
          </button>
          <span className="hidden md:inline text-blue-200">|</span>
          <a
            href={getWhatsAppUrl('Hi KaoinAI team, I would like to talk about personal data records for my business.')}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-semibold text-xs sm:text-sm transition-colors"
            onClick={() => trackEvent('click_whatsapp', { number: WHATSAPP_NUMBER, location: 'announcement_bar' })}
          >
            <span>Chat on WhatsApp</span>
          </a>
        </div>
        <button
          onClick={() => {
            setVisible(false)
            onDismiss?.()
          }}
          aria-label="Dismiss announcement"
          className="text-slate-400 hover:text-slate-700 hover:bg-blue-100/50 p-1 rounded-md transition-colors shrink-0"
        >
          <X size={15} />
        </button>
      </div>
    </aside>
  )
}
