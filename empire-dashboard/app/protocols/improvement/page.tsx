'use client'

import { ArrowLeft, Package, CheckCircle, TrendingUp, Code, Zap, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const codeSmells = [
  { category: 'Duplicação', signs: ['Mesma lógica em 3+ lugares', 'Copiar-colar identificado'] },
  { category: 'Funções Longas', signs: ['Função > 50 linhas', 'Múltiplas responsabilidades'] },
  { category: 'Acoplamento Alto', signs: ['Mudança em A quebra B', 'Props drilling > 3 níveis'] },
  { category: 'Nomenclatura Ruim', signs: ['Variáveis: data, temp, info', 'Funções: handleSomething1'] },
]

const webVitals = [
  { metric: 'LCP', target: '< 2.5s', description: 'Largest Contentful Paint', tips: ['Imagens otimizadas', 'Lazy loading', 'Critical CSS'] },
  { metric: 'FID', target: '< 100ms', description: 'First Input Delay', tips: ['Bundle pequeno', 'Code splitting', 'Long tasks quebradas'] },
  { metric: 'CLS', target: '< 0.1', description: 'Cumulative Layout Shift', tips: ['Dimensões de imagens', 'Font-display: swap', 'Skeleton loaders'] },
]

export default function ImprovementPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/protocols" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Voltar para Protocolos
      </Link>

      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Package className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Aprimoramento e Refatoração</h1>
            <p className="text-gray-600 mt-1">Como melhorar código existente sem quebrar o que funciona</p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* Quando Refatorar */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Code className="h-5 w-5 mr-2 text-blue-600" />
            1. Quando Refatorar?
          </h2>
          <p className="text-gray-700 mb-4">Refatorar é melhorar o código sem mudar o comportamento. Reescrever é começar do zero.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3">Critério</th>
                  <th className="text-left py-2 px-3">Refatorar</th>
                  <th className="text-left py-2 px-3">Reescrever</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2 px-3">Código legado</td>
                  <td className="py-2 px-3">&lt; 30% problemático</td>
                  <td className="py-2 px-3">&gt; 70% problemático</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-3">Testes existentes</td>
                  <td className="py-2 px-3">&gt; 60% coverage</td>
                  <td className="py-2 px-3">&lt; 20% coverage</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-3">Tempo disponível</td>
                  <td className="py-2 px-3">Sprints regulares</td>
                  <td className="py-2 px-3">Projeto dedicado</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Code Smells */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Sinais de Que Precisa Refatorar (Code Smells)</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {codeSmells.map((smell, i) => (
              <div key={i} className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">{smell.category}</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  {smell.signs.map((s, j) => (
                    <li key={j}>• {s}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Performance */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Zap className="h-5 w-5 mr-2 text-blue-600" />
            2. Performance (Core Web Vitals)
          </h2>
          <div className="space-y-4">
            {webVitals.map((vital, i) => (
              <div key={i} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{vital.metric} - {vital.description}</h3>
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm">{vital.target}</span>
                </div>
                <ul className="flex flex-wrap gap-2">
                  {vital.tips.map((tip, j) => (
                    <li key={j} className="bg-white px-2 py-1 rounded text-sm text-gray-600">{tip}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Estratégias de Refatoração */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
            3. Estratégias de Refatoração
          </h2>
          <div className="space-y-4 text-gray-700">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Extrair Função</h3>
              <p className="text-sm">Funções longas devem ser quebradas em funções menores, cada uma com uma responsabilidade.</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Component Composition</h3>
              <p className="text-sm">Em vez de props drilling, use composition e context para compartilhar dados.</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Feature Flags</h3>
              <p className="text-sm">Use feature flags para liberar mudanças gradualmente para os usuários.</p>
            </div>
          </div>
        </div>

        {/* Migração Gradual */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Migração Gradual (Strangler Fig)</h2>
          <div className="space-y-3 text-gray-700">
            <p>Não reescreva tudo de uma vez. Migre gradualmente:</p>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>Criar facade/interface comum</li>
              <li>Direcionar tráfego gradualmente (10% → 50% → 100%)</li>
              <li>Monitorar métricas</li>
              <li>Migrar funcionalidade por funcionalidade</li>
              <li>Remover código antigo</li>
            </ol>
          </div>
        </div>

        {/* Checklist */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-green-900 mb-4 flex items-center">
            <CheckCircle className="h-6 w-6 mr-2" />
            Checklist de Refatoração
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-green-800 mb-2">Preparação</h3>
              <ul className="space-y-1 text-sm text-green-700">
                <li>✓ Testes existentes passando</li>
                <li>✓ Coverage atual documentado</li>
                <li>✓ Baseline de performance</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-green-800 mb-2">Execução</h3>
              <ul className="space-y-1 text-sm text-green-700">
                <li>✓ Mudanças pequenas e incrementais</li>
                <li>✓ Testes rodando após cada mudança</li>
                <li>✓ Commits atômicos</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-green-800 mb-2">Validação</h3>
              <ul className="space-y-1 text-sm text-green-700">
                <li>✓ Todos os testes passando</li>
                <li>✓ Performance igual ou melhor</li>
                <li>✓ Nenhum bug novo</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-green-800 mb-2">Documentação</h3>
              <ul className="space-y-1 text-sm text-green-700">
                <li>✓ Changelog atualizado</li>
                <li>✓ Decisões documentadas</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Próximos passos */}
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-primary-900 mb-3">Pronto para lançar?</h2>
          <p className="text-primary-800 mb-4">Depois de melhorar seu código, use o Checklist de Lançamento.</p>
          <Link href="/protocols/launch" className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
            Ver Checklist de Lançamento
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
