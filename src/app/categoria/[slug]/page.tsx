import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Clock, Eye } from 'lucide-react'

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const supabase = await createClient()

  // Get category
  const { data: category, error: categoryError } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single()

  if (categoryError || !category) {
    notFound()
  }

  // Get posts in category
  const { data: posts } = await supabase
    .from('posts')
    .select(`
      slug,
      title,
      excerpt,
      featured_image,
      read_time,
      views,
      published_at
    `)
    .eq('status', 'published')
    .eq('category_slug', slug)
    .order('published_at', { ascending: false })

  // Get all categories for nav
  const { data: categories } = await supabase
    .from('categories')
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
              {categories?.slice(0, 3).map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/categoria/${cat.slug}`}
                  className={`transition-colors hidden md:block ${
                    cat.slug === slug
                      ? 'text-white font-medium'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {cat.name}
                </Link>
              ))}
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

      {/* Category Header */}
      <section className="bg-gradient-to-br from-primary-950 to-slate-900 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-white mb-2">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-slate-400 text-lg">{category.description}</p>
          )}
        </div>
      </section>

      {/* Posts Grid */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        {!posts || posts.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/50 border border-slate-800 rounded-xl">
            <p className="text-slate-400 text-lg">Nenhum artigo nesta categoria.</p>
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
