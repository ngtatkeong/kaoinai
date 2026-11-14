import { useMemo } from 'react'
import { useParams, Link } from 'react-router'
import { ArrowLeft, ArrowRight, Clock, Tag, Calendar, Sparkles } from 'lucide-react'
import { blogPosts } from '@/data/blogPosts'
import { Button } from '@/components/ui/button'

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>()

  const post = useMemo(() => {
    return blogPosts.find((p) => p.slug === slug)
  }, [slug])

  const relatedPosts = useMemo(() => {
    const found = blogPosts.find((p) => p.slug === slug)
    return found ? blogPosts.filter((p) => p.slug !== found.slug).slice(0, 2) : []
  }, [slug])

  const schemaData = useMemo(() => {
    if (!post) return null
    return {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      '@id': `https://kaoinai.com/blog/${post.slug}#article`,
      'headline': post.title,
      'alternativeHeadline': post.subtitle,
      'description': post.description,
      'image': 'https://kaoinai.com/og-cover.png',
      'author': {
        '@type': 'Person',
        'name': post.author.name,
        'jobTitle': post.author.role,
        'url': 'https://kaoinai.com/contact'
      },
      'publisher': {
        '@type': 'Organization',
        'name': 'KaoinAI',
        'url': 'https://kaoinai.com',
        'logo': {
          '@type': 'ImageObject',
          'url': 'https://kaoinai.com/logo.png'
        }
      },
      'datePublished': '2026-09-26T08:00:00+08:00',
      'dateModified': '2026-10-02T12:00:00+08:00',
      'mainEntityOfPage': {
        '@type': 'WebPage',
        '@id': `https://kaoinai.com/blog/${post.slug}`
      },
      'articleSection': post.category,
      'keywords': post.tags.join(', ')
    }
  }, [post])

  if (!post) {
    return (
      <div className="pt-28 pb-20 max-w-xl mx-auto px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
        <p className="text-sm text-slate-600 mb-6">The blog article you are looking for does not exist or may have been relocated.</p>
        <Button asChild>
          <Link to="/blog">Browse All Articles</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="pt-24 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-slate-800">
      {schemaData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      )}
      {/* Back to Blog */}
      <div className="mb-8 flex items-center justify-between">
        <Link 
          to="/blog" 
          className="inline-flex items-center text-xs font-semibold text-purple-700 hover:text-purple-900 transition-colors gap-1.5"
        >
          <ArrowLeft size={14} /> Back to all articles
        </Link>
        <span className="text-xs text-slate-600 flex items-center gap-1">
          <Sparkles size={12} className="text-purple-500" /> Technical Research Publication
        </span>
      </div>

      {/* Header */}
      <header className="mb-10">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700">
            {post.category}
          </span>
          <span className="text-xs text-slate-600 flex items-center gap-1">
            <Calendar size={12} /> {post.publishDate}
          </span>
          <span className="text-xs text-slate-600 flex items-center gap-1">
            <Clock size={12} /> {post.readTime}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight mb-4 leading-tight">
          {post.title}
        </h1>

        <p className="text-lg text-slate-600 leading-relaxed border-l-2 border-purple-400 pl-4 py-1 italic">
          {post.subtitle}
        </p>

        {/* Author badge */}
        <div className="mt-6 flex items-center gap-3 pt-6 border-t border-slate-100">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-bold flex items-center justify-center text-sm">
            {post.author.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-900">{post.author.name}</div>
            <div className="text-xs text-slate-600">{post.author.role}</div>
          </div>
        </div>
      </header>

      {/* Main Markdown / HTML Content Render */}
      <article className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-purple-600 hover:prose-a:text-purple-800 prose-img:rounded-xl">
        <div 
          className="space-y-6 leading-relaxed text-slate-700 blog-content-body"
          dangerouslySetInnerHTML={{ __html: post.content }} 
        />
      </article>

      {/* Tags */}
      <div className="mt-12 pt-6 border-t border-slate-200">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-600 font-medium flex items-center gap-1">
            <Tag size={12} /> Tags:
          </span>
          {post.tags.map((t) => (
            <span key={t} className="text-xs px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 font-medium">
              #{t}
            </span>
          ))}
        </div>
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="mt-16 pt-10 border-t border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Related Technical Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {relatedPosts.map((r) => (
              <Link
                key={r.slug}
                to={`/blog/${r.slug}`}
                className="block p-5 rounded-xl border border-slate-200 hover:border-purple-300 hover:shadow-md transition-all group bg-white"
              >
                <div className="text-xs font-semibold text-purple-600 mb-1.5">{r.category}</div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-purple-700 transition-colors mb-2 leading-snug">
                  {r.title}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2 mb-3">
                  {r.description}
                </p>
                <span className="inline-flex items-center text-xs font-semibold text-purple-600 group-hover:translate-x-1 transition-transform">
                  Read article <ArrowRight size={12} className="ml-1" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
