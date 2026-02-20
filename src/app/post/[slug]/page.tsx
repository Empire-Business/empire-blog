import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Clock, Eye, ArrowLeft, Calendar } from 'lucide-react'
import { Metadata } from 'next'
import { ArticleJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd'

interface PostPageProps {
  params: Promise<{ slug: string }>
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://empire.blog'

  const { data: post } = await supabase
    .from('posts')
    .select('title, meta_title, meta_description, excerpt, featured_image, categories')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!post) {
    return {
      title: 'Post não encontrado',
    }
  }

  const title = post.meta_title || post.title
  const description = post.meta_description || post.excerpt

  return {
    title,
    description,
    openGraph: {
      title,
      description: description || '',
      type: 'article',
      url: `${baseUrl}/post/${slug}`,
      images: post.featured_image ? [{ url: post.featured_image }] : [],
      siteName: 'Empire Blog',
      locale: 'pt_BR',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: description || '',
      images: post.featured_image ? [post.featured_image] : [],
    },
    alternates: {
      canonical: `${baseUrl}/post/${slug}`,
    },
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: post, error } = await supabase
    .from('posts')
    .select(`
      *,
      categories (name, slug),
      tags (name, slug)
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (error || !post) {
    notFound()
  }

  // Get related posts
  const { data: relatedPosts } = await supabase
    .from('posts')
    .select('slug, title, featured_image, category_slug')
    .eq('status', 'published')
    .eq('category_slug', post.category_slug)
    .neq('id', post.id)
    .limit(3)

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://empire.blog'
  const postUrl = `${baseUrl}/post/${post.slug}`

  return (
    <div className="min-h-screen bg-slate-950">
      {/* JSON-LD Structured Data */}
      <ArticleJsonLd
        title={post.meta_title || post.title}
        description={post.meta_description || post.excerpt || ''}
        url={postUrl}
        datePublished={post.published_at || post.created_at}
        dateModified={post.updated_at}
        image={post.featured_image || undefined}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Início', url: baseUrl },
          ...(post.categories && post.categories.length > 0
            ? [{ name: post.categories[0].name, url: `${baseUrl}/categoria/${post.category_slug}` }]
            : []),
          { name: post.title, url: postUrl },
        ]}
      />

      {/* Header */}
      <header className="border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="font-heading text-xl font-bold text-white">
              Empire Blog
            </Link>
            <Link
              href="/login"
              className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors text-sm"
            >
              Admin
            </Link>
          </div>
        </div>
      </header>

      {/* Article */}
      <article className="max-w-4xl mx-auto px-4 py-12">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para o início
        </Link>

        {/* Category */}
        {post.categories && post.categories.length > 0 && (
          <Link
            href={`/categoria/${post.category_slug}`}
            className="inline-block text-primary-400 text-sm font-medium hover:text-primary-300 mb-4"
          >
            {post.categories[0]?.name}
          </Link>
        )}

        {/* Title */}
        <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
          {post.title}
        </h1>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400 mb-8">
          {post.published_at && (
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date(post.published_at).toLocaleDateString('pt-BR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
          )}
          {post.read_time && (
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {post.read_time} min de leitura
            </span>
          )}
          {post.views > 0 && (
            <span className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {post.views} visualizações
            </span>
          )}
        </div>

        {/* Featured Image */}
        {post.featured_image && (
          <img
            src={post.featured_image}
            alt={post.title}
            className="w-full h-64 md:h-96 object-cover rounded-xl mb-8"
          />
        )}

        {/* Content */}
        <div
          className="prose prose-invert prose-lg max-w-none prose-headings:font-heading prose-headings:font-bold prose-a:text-primary-400 hover:prose-a:text-primary-300 prose-code:bg-slate-800 prose-code:px-2 prose-code:py-1 prose-code:rounded"
          dangerouslySetInnerHTML={{ __html: post.content || '' }}
        />

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-slate-800">
            <h3 className="text-slate-400 text-sm font-medium mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag: { name: string; slug: string }) => (
                <Link
                  key={tag.slug}
                  href={`/tag/${tag.slug}`}
                  className="px-3 py-1 bg-slate-800 text-slate-300 rounded-full text-sm hover:bg-slate-700 transition-colors"
                >
                  {tag.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Share */}
        <div className="mt-8 pt-8 border-t border-slate-800">
          <h3 className="text-slate-400 text-sm font-medium mb-3">Compartilhar</h3>
          <div className="flex gap-3">
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(process.env.NEXT_PUBLIC_SITE_URL || 'https://empire.blog')}/post/${post.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-sm hover:bg-slate-700 transition-colors"
            >
              Twitter
            </a>
            <a
              href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(process.env.NEXT_PUBLIC_SITE_URL || 'https://empire.blog')}/post/${post.slug}&title=${encodeURIComponent(post.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-sm hover:bg-slate-700 transition-colors"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts && relatedPosts.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 py-12 border-t border-slate-800">
          <h2 className="font-heading text-xl font-bold text-white mb-6">
            Artigos Relacionados
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {relatedPosts.map((relatedPost) => (
              <Link
                key={relatedPost.slug}
                href={`/post/${relatedPost.slug}`}
                className="group bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-colors"
              >
                {relatedPost.featured_image ? (
                  <img
                    src={relatedPost.featured_image}
                    alt={relatedPost.title}
                    className="w-full h-32 object-cover"
                  />
                ) : (
                  <div className="w-full h-32 bg-gradient-to-br from-primary-500/20 to-accent-500/20" />
                )}
                <div className="p-4">
                  <h3 className="text-white font-medium group-hover:text-primary-400 transition-colors line-clamp-2">
                    {relatedPost.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800 mt-12">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-sm">
              © {new Date().getFullYear()} Empire Blog. Todos os direitos reservados.
            </p>
            <Link href="/" className="text-primary-400 hover:text-primary-300 text-sm">
              Voltar para o início
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
