import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Clock, Eye } from 'lucide-react'

export default async function HomePage() {
  const supabase = await createClient()

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
    .order('published_at', { ascending: false })
    .limit(6)

  const { data: categories } = await supabase
    .from('categories')
    .select('slug, name')
    .order('name')

  return (
    <main className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 sticky top-0 bg-slate-950/80 backdrop-blur z-50">
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
                  className="text-slate-300 hover:text-white transition-colors hidden md:block"
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

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-950 to-slate-900">
        <div className="max-w-6xl mx-auto px-4 py-20 md:py-28">
          <div className="max-w-2xl">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">
              Empire Blog
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-8">
              Blog profissional com CMS completo, IA integrada e APIs para automação.
              Descubra artigos sobre marketing digital, negócios e estratégias para
              fazer sua empresa crescer.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors"
              >
                Acessar Admin
              </Link>
              <a
                href="#posts"
                className="inline-flex items-center justify-center px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-colors backdrop-blur"
              >
                Ver Artigos
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section id="posts" className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="font-heading text-2xl font-bold text-white mb-8">
          Últimos Artigos
        </h2>

        {!posts || posts.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/50 border border-slate-800 rounded-xl">
            <p className="text-slate-400 text-lg">Nenhum artigo publicado ainda.</p>
            <p className="text-slate-500 mt-2">Volte em breve para novos conteúdos!</p>
          </div>
        ) : (
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
        )}
      </section>

      {/* Features Section */}
      <section className="py-16 bg-slate-900/30">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="font-heading text-2xl font-bold text-white text-center mb-12">
            Funcionalidades
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Editor Rico',
                description: 'Editor de texto completo com TipTap, suporte a markdown e formatação avançada.',
                icon: '✍️',
              },
              {
                title: 'IA Integrada',
                description: 'Gere conteúdo automaticamente com Open Router. Transforme vídeos em artigos.',
                icon: '🤖',
              },
              {
                title: 'SEO Otimizado',
                description: 'Meta tags automáticas, sitemap, structured data e otimização com IA.',
                icon: '🔍',
              },
              {
                title: 'API REST',
                description: 'Publique posts via API com autenticação segura. Webhooks para eventos.',
                icon: '🔌',
              },
              {
                title: 'Biblioteca de Mídia',
                description: 'Upload, organize e otimize imagens automaticamente.',
                icon: '📁',
              },
              {
                title: 'Categorias e Tags',
                description: 'Organize seu conteúdo com categorias e tags personalizáveis.',
                icon: '🏷️',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-slate-600 transition-colors"
              >
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-sm">
              © {new Date().getFullYear()} Empire Blog. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-6 text-sm text-slate-500">
              <Link href="/" className="hover:text-slate-300 transition-colors">
                Início
              </Link>
              <Link href="/login" className="hover:text-slate-300 transition-colors">
                Admin
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
