import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Clock, Eye } from 'lucide-react'

interface TagPageProps {
  params: Promise<{ slug: string }>
}

export default async function TagPage({ params }: TagPageProps) {
  const { slug } = await params
  const supabase = await createClient()

  // Get tag
  const { data: tag, error: tagError } = await supabase
    .from('tags')
    .select('*')
    .eq('slug', slug)
    .single()

  if (tagError || !tag) {
    notFound()
  }

  // Get posts with this tag
  const { data: posts } = await supabase
    .from('posts')
    .select(`
      slug,
      title,
      excerpt,
      featured_image,
      read_time,
      views,
      published_at,
      category_slug,
      categories (name)
    `)
    .eq('status', 'published')
    .contains('tag_slugs', [slug])
    .order('published_at', { ascending: false })

  // Get all tags for nav
  const { data: tags } = await supabase
    .from('tags')
    .select('slug, name')
    .order('name')

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="font-heading text-2xl font-bold text-white">
              Empire Blog
            </Link>
            <nav className="flex items-center gap-6">
              <Link href="/" className="text-slate-300 hover:text-white transition-colors">
                Início
              </Link>
              <Link
                href="/login"
                className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors text-sm"
              >
                Admin
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Tag Header */}
      <section className="bg-gradient-to-br from-primary-950 to-slate-900 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
            <Link href="/" className="hover:text-white">Início</Link>
            <span>/</span>
            <span className="text-white">Tag</span>
          </div>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-white">
            #{tag.name}
          </h1>
        </div>
      </section>

      {/* Posts Grid */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        {!posts || posts.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/50 border border-slate-800 rounded-xl">
            <p className="text-slate-400 text-lg">Nenhum artigo com esta tag.</p>
            <Link
              href="/"
              className="inline-block mt-4 text-primary-400 hover:text-primary-300"
            >
              Ver todos os artigos →
            </Link>
          </div>
        ) : (
          <>
            <p className="text-slate-400 mb-6">
              {posts.length} {posts.length === 1 ? 'artigo' : 'artigos'}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <article
                  key={post.slug}
                  className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-colors group"
                >
                  {post.featured_image ? (
                    <Link href={`/post/${post.slug}`}>
                      <img
                        src={post.featured_image}
                        alt={post.title}
                        className="w-full h-48 object-cover group-hover:opacity-90 transition-opacity"
                      />
                    </Link>
                  ) : (
                    <Link
                      href={`/post/${post.slug}`}
                      className="block w-full h-48 bg-gradient-to-br from-primary-500/20 to-accent-500/20"
                    />
                  )}
                  <div className="p-5">
                    {post.categories && post.categories.length > 0 && (
                      <Link
                        href={`/categoria/${post.category_slug}`}
                        className="text-primary-400 text-sm font-medium hover:text-primary-300"
                      >
                        {post.categories[0]?.name}
                      </Link>
                    )}
                    <h3 className="font-heading text-lg font-bold text-white mt-2 group-hover:text-primary-400 transition-colors">
                      <Link href={`/post/${post.slug}`}>{post.title}</Link>
                    </h3>
                    <p className="text-slate-400 text-sm mt-2 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-4 mt-4 text-xs text-slate-500">
                      {post.read_time && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {post.read_time} min
                        </span>
                      )}
                      {post.views ? (
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {post.views}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </main>

      {/* All Tags */}
      {tags && tags.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-8 border-t border-slate-800">
          <h2 className="text-lg font-semibold text-white mb-4">Todas as Tags</h2>
          <div className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <Link
                key={t.slug}
                href={`/tag/${t.slug}`}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  t.slug === slug
                    ? 'bg-primary-500 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                #{t.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800 mt-12">
        <div className="max-w-6xl mx-auto px-4 py-8">
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
