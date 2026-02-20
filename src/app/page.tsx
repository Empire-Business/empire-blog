export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-950 to-slate-900 text-white">
        <div className="container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-3xl">
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Empire Blog
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-8">
              Blog profissional com CMS completo, IA integrada e APIs para automação.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="/admin"
                className="inline-flex items-center justify-center px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors"
              >
                Acessar Admin
              </a>
              <a
                href="/blog"
                className="inline-flex items-center justify-center px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-colors backdrop-blur"
              >
                Ver Blog
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-center mb-12">
            Funcionalidades
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                title: 'Agendamento',
                description: 'Agende posts para publicação automática.',
                icon: '📅',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            Pronto para começar?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Configure seu ambiente e comece a criar conteúdo incrível com o poder da IA.
          </p>
          <a
            href="/admin"
            className="inline-flex items-center justify-center px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors text-lg"
          >
            Começar Agora
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2026 Empire Blog. Todos os direitos reservados.</p>
        </div>
      </footer>
    </main>
  )
}
