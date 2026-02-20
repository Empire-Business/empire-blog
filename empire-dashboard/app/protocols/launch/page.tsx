'use client'

import { ArrowLeft, AlertTriangle, CheckCircle, Shield, Zap, Eye, Search, BarChart2, FileText } from 'lucide-react'
import Link from 'next/link'

const securityChecks = [
  { category: 'Autenticação', items: ['Senhas hasheadas', 'Rate limiting em login', 'Session timeout configurado', 'MFA para contas sensíveis'] },
  { category: 'Autorização', items: ['RLS policies configuradas', 'API routes protegidas', 'Admin routes restritas', 'Webhooks com signature verification'] },
  { category: 'Input', items: ['Validação Zod em todas as entradas', 'Sanitização de HTML', 'File upload limits', 'Rate limiting global'] },
]

const protections = [
  { attack: 'XSS', protection: 'React auto-escape, CSP headers' },
  { attack: 'CSRF', protection: 'CSRF tokens, SameSite cookies' },
  { attack: 'SQL Injection', protection: 'Supabase client (parameterized)' },
  { attack: 'IDOR', protection: 'Authorization checks, UUIDs' },
]

const webVitalsTargets = [
  { metric: 'LCP', target: '< 2.5s', description: 'Tempo até o maior conteúdo aparecer' },
  { metric: 'FID', target: '< 100ms', description: 'Tempo até a página responder ao clique' },
  { metric: 'CLS', target: '< 0.1', description: 'Estabilidade visual (sem pulos)' },
]

const a11yChecks = [
  'Todas as imagens têm alt text',
  'Contraste 4.5:1 (texto normal)',
  'Todo interactive é focável por teclado',
  'Focus order lógico',
  'Page titles descritivos',
  'Headings hierarchy (h1→h2→h3)',
  'Labels associados aos inputs',
  'Error identification clara',
]

const finalChecklist = [
  { category: 'Código', items: ['Branch main em sync', 'Build passa localmente', 'TypeScript sem errors'] },
  { category: 'Testes', items: ['Unit tests passando', 'E2E tests passando', 'Smoke tests em staging'] },
  { category: 'Segurança', items: ['npm audit passou', 'Environment variables setadas', 'Security headers configurados'] },
  { category: 'Performance', items: ['Lighthouse > 90', 'Bundle size acceptable', 'Images otimizadas'] },
  { category: 'SEO', items: ['Meta tags configuradas', 'Sitemap gerado', 'Robots.txt ok'] },
  { category: 'Analytics', items: ['GA4 configurado', 'Events tracking funcionando'] },
  { category: 'Monitoring', items: ['Error tracking ativo', 'Alerts configurados', 'Health checks ok'] },
  { category: 'Docs', items: ['README atualizado', 'Changelog atualizado'] },
]

export default function LaunchPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/protocols" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Voltar para Protocolos
      </Link>

      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 bg-red-100 rounded-lg">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Checklist de Lançamento</h1>
            <p className="text-gray-600 mt-1">Valide tudo antes de colocar em produção</p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* Segurança */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Shield className="h-5 w-5 mr-2 text-red-600" />
            1. Segurança (OWASP)
          </h2>
          <div className="grid sm:grid-cols-3 gap-4 mb-4">
            {securityChecks.map((check, i) => (
              <div key={i} className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">{check.category}</h3>
                <ul className="space-y-1 text-sm">
                  {check.items.map((item, j) => (
                    <li key={j} className="flex items-center text-gray-700">
                      <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3">Ataque</th>
                  <th className="text-left py-2 px-3">Proteção</th>
                </tr>
              </thead>
              <tbody>
                {protections.map((p, i) => (
                  <tr key={i} className="border-b">
                    <td className="py-2 px-3 font-medium">{p.attack}</td>
                    <td className="py-2 px-3 text-gray-600">{p.protection}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Performance */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Zap className="h-5 w-5 mr-2 text-red-600" />
            2. Performance (Core Web Vitals)
          </h2>
          <div className="space-y-3">
            {webVitalsTargets.map((vital, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="font-semibold">{vital.metric}</span>
                  <span className="text-gray-500 ml-2">{vital.description}</span>
                </div>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm font-medium">{vital.target}</span>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-4">
            <strong>Lighthouse Score:</strong> Todas as categorias devem ser &gt; 90
          </p>
        </div>

        {/* Acessibilidade */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Eye className="h-5 w-5 mr-2 text-red-600" />
            3. Acessibilidade (WCAG 2.1 AA)
          </h2>
          <div className="grid sm:grid-cols-2 gap-2">
            {a11yChecks.map((check, i) => (
              <div key={i} className="flex items-center p-2 bg-gray-50 rounded text-sm">
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                {check}
              </div>
            ))}
          </div>
        </div>

        {/* SEO */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Search className="h-5 w-5 mr-2 text-red-600" />
            4. SEO
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Meta Tags</h3>
              <ul className="space-y-1 text-sm">
                <li>✓ Title e description únicos</li>
                <li>✓ Open Graph tags</li>
                <li>✓ Twitter Cards</li>
                <li>✓ Canonical URLs</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Técnico</h3>
              <ul className="space-y-1 text-sm">
                <li>✓ Sitemap.xml gerado</li>
                <li>✓ Robots.txt configurado</li>
                <li>✓ HTTPS everywhere</li>
                <li>✓ 404 page customizada</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Analytics */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <BarChart2 className="h-5 w-5 mr-2 text-red-600" />
            5. Analytics & Monitoring
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Analytics</h3>
              <ul className="space-y-1 text-sm">
                <li>✓ GA4 configurado</li>
                <li>✓ Events tracking funcionando</li>
                <li>✓ Conversions definidas</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Monitoring</h3>
              <ul className="space-y-1 text-sm">
                <li>✓ Error tracking (Sentry)</li>
                <li>✓ Alerts configurados</li>
                <li>✓ Health checks funcionando</li>
                <li>✓ Uptime monitoring</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Checklist Final */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-green-900 mb-4 flex items-center">
            <CheckCircle className="h-6 w-6 mr-2" />
            Checklist Final de Lançamento
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {finalChecklist.map((cat, i) => (
              <div key={i} className="bg-white p-3 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2 text-sm">{cat.category}</h3>
                <ul className="space-y-1">
                  {cat.items.map((item, j) => (
                    <li key={j} className="flex items-center text-xs text-gray-700">
                      <div className="w-4 h-4 border border-green-400 rounded mr-2 flex-shrink-0"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Rollback */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-red-900 mb-4 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Plano de Rollback
          </h2>
          <div className="space-y-3 text-sm text-red-800">
            <p><strong>Gatilhos para rollback:</strong></p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Error rate &gt; 5%</li>
              <li>Revenue drop &gt; 10%</li>
              <li>Core functionality quebrada</li>
            </ul>
            <p className="mt-3"><strong>Comando de rollback:</strong></p>
            <code className="block bg-red-100 p-2 rounded mt-1">git revert HEAD && git push origin main</code>
          </div>
        </div>

        {/* Próximos passos */}
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-primary-900 mb-3">Lançou? Agora é hora de manter!</h2>
          <p className="text-primary-800 mb-4">Depois do lançamento, siga o protocolo de Manutenção para garantir estabilidade.</p>
          <Link href="/protocols/maintenance" className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
            Ver Protocolo de Manutenção
          </Link>
        </div>
      </div>
    </div>
  )
}
