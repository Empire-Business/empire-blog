export default function DocsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Documentação da API</h1>
        <p className="text-slate-400 mt-1">
          Como usar a API REST do Empire Blog
        </p>
      </div>

      {/* Authentication */}
      <section className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Autenticação</h2>
        <p className="text-slate-300 mb-4">
          Todas as requisições à API devem incluir um header <code className="bg-slate-700 px-2 py-0.5 rounded">x-api-key</code> com sua chave de API.
        </p>
        <pre className="bg-slate-900 p-4 rounded-lg overflow-x-auto text-sm">
          <code className="text-slate-300">{`curl -X GET "https://seudominio.com/api/v1/posts" \\
  -H "x-api-key: eb_sua_chave_aqui"`}</code>
        </pre>
        <p className="text-slate-400 text-sm mt-4">
          Crie uma chave de API em{' '}
          <a href="/admin/api-keys" className="text-primary-400 hover:text-primary-300">
            Admin → API Keys
          </a>
        </p>
      </section>

      {/* Endpoints */}
      <section className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Endpoints</h2>

        {/* Posts */}
        <div className="space-y-4">
          <h3 className="text-accent-400 font-medium">Posts</h3>

          <div className="bg-slate-900 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded">GET</span>
              <code className="text-white">/api/v1/posts</code>
            </div>
            <p className="text-slate-400 text-sm">Lista todos os posts. Suporta filtros por status, categoria, tag e busca.</p>
            <div className="mt-3 text-xs text-slate-500">
              Parâmetros: ?status=published&category=slug&tag=slug&search=texto&limit=10&offset=0
            </div>
          </div>

          <div className="bg-slate-900 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded">POST</span>
              <code className="text-white">/api/v1/posts</code>
            </div>
            <p className="text-slate-400 text-sm">Cria um novo post.</p>
            <pre className="mt-3 text-xs text-slate-500 overflow-x-auto">
{`{
  "title": "Título do Post",
  "content": "<p>Conteúdo HTML...</p>",
  "category_slug": "marketing",
  "tag_slugs": ["seo", "dicas"],
  "status": "draft"
}`}
            </pre>
          </div>

          <div className="bg-slate-900 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded">GET</span>
              <code className="text-white">/api/v1/posts/[slug]</code>
            </div>
            <p className="text-slate-400 text-sm">Obtém um post específico pelo slug.</p>
          </div>

          <div className="bg-slate-900 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded">PUT</span>
              <code className="text-white">/api/v1/posts/[slug]</code>
            </div>
            <p className="text-slate-400 text-sm">Atualiza um post existente.</p>
          </div>

          <div className="bg-slate-900 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded">DELETE</span>
              <code className="text-white">/api/v1/posts/[slug]</code>
            </div>
            <p className="text-slate-400 text-sm">Exclui um post.</p>
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-4 mt-6">
          <h3 className="text-accent-400 font-medium">Categorias</h3>

          <div className="bg-slate-900 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded">GET</span>
              <code className="text-white">/api/v1/categories</code>
            </div>
            <p className="text-slate-400 text-sm">Lista todas as categorias.</p>
          </div>

          <div className="bg-slate-900 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded">POST</span>
              <code className="text-white">/api/v1/categories</code>
            </div>
            <p className="text-slate-400 text-sm">Cria uma nova categoria.</p>
            <pre className="mt-3 text-xs text-slate-500 overflow-x-auto">
{`{
  "name": "Marketing Digital",
  "description": "Artigos sobre marketing"
}`}
            </pre>
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-4 mt-6">
          <h3 className="text-accent-400 font-medium">Tags</h3>

          <div className="bg-slate-900 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded">GET</span>
              <code className="text-white">/api/v1/tags</code>
            </div>
            <p className="text-slate-400 text-sm">Lista todas as tags.</p>
          </div>

          <div className="bg-slate-900 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded">POST</span>
              <code className="text-white">/api/v1/tags</code>
            </div>
            <p className="text-slate-400 text-sm">Cria uma nova tag.</p>
            <pre className="mt-3 text-xs text-slate-500 overflow-x-auto">
{`{
  "name": "SEO"
}`}
            </pre>
          </div>
        </div>

        {/* Webhooks */}
        <div className="space-y-4 mt-6">
          <h3 className="text-accent-400 font-medium">Webhooks</h3>

          <div className="bg-slate-900 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded">GET</span>
              <code className="text-white">/api/v1/webhooks</code>
            </div>
            <p className="text-slate-400 text-sm">Lista todos os webhooks configurados.</p>
          </div>

          <div className="bg-slate-900 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded">POST</span>
              <code className="text-white">/api/v1/webhooks</code>
            </div>
            <p className="text-slate-400 text-sm">Cria um novo webhook.</p>
            <pre className="mt-3 text-xs text-slate-500 overflow-x-auto">
{`{
  "name": "Notificação Slack",
  "url": "https://hooks.slack.com/services/...",
  "secret": "opcional_secret_key",
  "events": ["post.created", "post.published"]
}`}
            </pre>
          </div>
        </div>
      </section>

      {/* Webhook Events */}
      <section className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Eventos de Webhook</h2>
        <div className="grid grid-cols-2 gap-2">
          {[
            { event: 'post.created', desc: 'Post criado' },
            { event: 'post.updated', desc: 'Post atualizado' },
            { event: 'post.deleted', desc: 'Post excluído' },
            { event: 'post.published', desc: 'Post publicado' },
          ].map((item) => (
            <div key={item.event} className="bg-slate-900 rounded-lg p-3">
              <code className="text-primary-400 text-sm">{item.event}</code>
              <p className="text-slate-400 text-xs mt-1">{item.desc}</p>
            </div>
          ))}
        </div>

        <h3 className="text-white font-medium mt-6 mb-3">Payload do Webhook</h3>
        <pre className="bg-slate-900 p-4 rounded-lg overflow-x-auto text-xs">
{`{
  "event": "post.created",
  "data": {
    "id": "uuid",
    "title": "Título do Post",
    "slug": "titulo-do-post",
    "status": "draft",
    ...
  },
  "timestamp": "2024-01-15T10:30:00Z"
}`}
        </pre>
      </section>

      {/* Rate Limits */}
      <section className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Limites</h2>
        <p className="text-slate-300">
          Atualmente não há limite de requisições. Em produção, considere implementar rate limiting.
        </p>
      </section>
    </div>
  )
}
