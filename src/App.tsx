import { useEffect, lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router'
import Navigation from './sections/Navigation'
import HeroSme from './sections/HeroSme'
import { ProblemFrame, HowItWorksSme, DataHandlingSme, PricingSme, FaqSme, FinalCtaSme } from './sections/SmeHome'
import Footer from './sections/Footer'
const Contact = lazy(() => import('./pages/Contact'))
const AuditPage = lazy(() => import('./pages/Audit'))
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'
import SecurityOverview from './pages/SecurityOverview'
import DataProtectionAgreement from './pages/DataProtectionAgreement'
import BlogIndex from './pages/BlogIndex'
import BlogPost from './pages/BlogPost'
import NotFound from './pages/NotFound'
import { blogPosts } from './data/blogPosts'
import WhatsAppButton from './components/WhatsAppButton'
import AnimatedBackground from './components/AnimatedBackground'

function ScrollToHash() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '')
      const timer = setTimeout(() => {
        const el = document.getElementById(id)
        if (el) {
          const header = document.querySelector('header')
          const headerHeight = header ? header.getBoundingClientRect().height : 76
          const y = el.getBoundingClientRect().top + window.pageYOffset - headerHeight - 14
          window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' })
        }
      }, 100)
      return () => clearTimeout(timer)
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
  }, [pathname, hash])

  return null
}

function RouteSeo() {
  const { pathname } = useLocation()

  useEffect(() => {
    const cleanPath = pathname.replace(/\/+$/, '') || '/'
    const route = cleanPath === '/audit.html' ? '/audit' : cleanPath

    const staticMeta: Record<string, { title: string; desc: string; url: string }> = {
      '/': {
        title: 'KaoinAI — Personal Data Records for Small Businesses',
        desc: 'KaoinAI finds the database columns that hold personal data and keeps a plain-language record of them, for Singapore PDPA, Malaysia PDPA and Indonesia UU PDP.',
        url: 'https://kaoinai.com/',
      },
      '/audit': {
        title: 'Free Data Governance Maturity & Risk Audit — KaoinAI',
        desc: 'Audit your data governance maturity and PDPA compliance risk in minutes. Instant score, prioritized remediation roadmap, and table-bound DPIA guidance — free.',
        url: 'https://kaoinai.com/audit',
      },
      '/contact': {
        title: 'Schedule 1-on-1 with TK Ng | Contact Us — KaoinAI',
        desc: 'Book a 1-on-1 Google Calendar session with KaoinAI. Discuss autonomous data governance, table-bound DPIA, PDPA & MAS TRM compliance for your databases.',
        url: 'https://kaoinai.com/contact',
      },
      '/privacy': {
        title: 'Privacy Policy & DPO — KaoinAI Data Protection Standards',
        desc: 'Read the KaoinAI Privacy Policy. Designated Singapore DPO Ng Tat Keong (tk.ng@kaoinai.com). Singapore PDPA, Malaysia PDPA and GDPR considerations.',
        url: 'https://kaoinai.com/privacy',
      },
      '/dpa': {
        title: 'Singapore PDPA Standard Data Protection Agreement (DPA) — KaoinAI',
        desc: 'Singapore PDPA data protection agreement for customers. Section 4(2) data intermediary clauses, 10 statutory obligations, DPO Ng Tat Keong (tk.ng@kaoinai.com).',
        url: 'https://kaoinai.com/dpa',
      },
      '/pdpa-agreement': {
        title: 'Singapore PDPA Standard Data Protection Agreement (DPA) — KaoinAI',
        desc: 'Singapore PDPA data protection agreement for customers. Section 4(2) data intermediary clauses, 10 statutory obligations, DPO Ng Tat Keong (tk.ng@kaoinai.com).',
        url: 'https://kaoinai.com/pdpa-agreement',
      },
      '/terms': {
        title: 'Terms of Service — KaoinAI',
        desc: 'KaoinAI Terms of Service, including data ownership and the terms for using the service governance.',
        url: 'https://kaoinai.com/terms',
      },
      '/security': {
        title: 'Security & Trust Architecture Whitepaper — KaoinAI',
        desc: 'How KaoinAI handles your database structure and personal data records: read-only access to system catalogs and encryption in transit standards.',
        url: 'https://kaoinai.com/security',
      },
      '/blog': {
        title: 'Engineering & Compliance Blog — KaoinAI',
        desc: 'Technical insights on Singapore PDPA, table-bound DPIAs, MAS TRM cyber hygiene, column-level data lineage, and AI data governance in enterprise data.',
        url: 'https://kaoinai.com/blog',
      },
    }

    let r = staticMeta[route]
    let isBlogArticle = false
    let currentPost = undefined

    // Handle dynamic blog post routes: /blog/:slug
    if (!r && route.startsWith('/blog/')) {
      const slug = route.replace('/blog/', '')
      const post = blogPosts.find((p) => p.slug === slug)
      if (post) {
        isBlogArticle = true
        currentPost = post
        r = {
          title: `${post.title} — KaoinAI Blog`,
          desc: post.description,
          url: `https://kaoinai.com/blog/${post.slug}`,
        }
      }
    }

    const isNotFound = !r
    if (!r) {
      r = {
        title: 'Page Not Found — KaoinAI',
        desc: 'The page you are looking for does not exist or has been relocated.',
        url: `https://kaoinai.com${pathname}`,
      }
    }

    document.title = r.title

    const setMeta = (selector: string, attr: string, value: string) => {
      let el = document.querySelector(selector)
      if (el) {
        el.setAttribute(attr, value)
      } else {
        el = document.createElement('meta')
        const parts = selector.replace('meta[', '').replace(']', '').split('=')
        if (parts.length === 2) {
          el.setAttribute(parts[0], parts[1].replace(/["']/g, ''))
          el.setAttribute(attr, value)
        }
      }
    }

    setMeta('meta[name="robots"]', 'content', isNotFound ? 'noindex, follow' : 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1')
    setMeta('meta[name="description"]', 'content', r.desc)
    setMeta('meta[name="title"]', 'content', r.title)
    setMeta('meta[property="og:title"]', 'content', r.title)
    setMeta('meta[property="og:description"]', 'content', r.desc)
    setMeta('meta[property="og:url"]', 'content', r.url)
    setMeta('meta[property="og:type"]', 'content', isBlogArticle ? 'article' : 'website')
    setMeta('meta[name="twitter:title"]', 'content', r.title)
    setMeta('meta[name="twitter:description"]', 'content', r.desc)
    setMeta('meta[name="twitter:url"]', 'content', r.url)

    if (isBlogArticle && currentPost) {
      setMeta('meta[property="article:author"]', 'content', currentPost.author.name)
      setMeta('meta[property="article:section"]', 'content', currentPost.category)
    }

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = r.url
  }, [pathname])

  return null
}

function Home() {
  return (
    <main>
      <HeroSme />
      <ProblemFrame />
      <HowItWorksSme />
      <DataHandlingSme />
      <PricingSme />
      <FaqSme />
      <FinalCtaSme />
    </main>
  )
}

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8fafc] via-[#f0fdfa]/80 to-[#f8fafc] selection:bg-teal-100 selection:text-[#0f766e] flex flex-col justify-between overflow-x-hidden relative">
      <AnimatedBackground />
      <ScrollToHash />
      <RouteSeo />
      <Navigation />
      <div className="flex-grow relative z-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/audit" element={<Suspense fallback={null}><AuditPage /></Suspense>} />
          <Route path="/audit.html" element={<Suspense fallback={null}><AuditPage /></Suspense>} />
          <Route path="/contact" element={<Suspense fallback={null}><Contact /></Suspense>} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/dpa" element={<DataProtectionAgreement />} />
          <Route path="/pdpa-agreement" element={<DataProtectionAgreement />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/security" element={<SecurityOverview />} />
          <Route path="/blog" element={<BlogIndex />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <div className="relative z-10">
        <Footer />
      </div>
      <WhatsAppButton />
    </div>
  )
}
