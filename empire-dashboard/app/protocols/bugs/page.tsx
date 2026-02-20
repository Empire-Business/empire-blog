'use client'

import { ArrowLeft, Wrench, CheckCircle, AlertTriangle, Clock, Search, Bug, FileText, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const priorityLevels = [
  { level: 'Crítico', time: 'Imediato (< 2h)', color: 'bg-red-100 text-red-700', examples: 'Vazamento de dados, sistema down' },
  { level: 'Alto', time: '24h', color: 'bg-orange-100 text-orange-700', examples: 'Login quebrado, checkout falhando' },
  { level: 'Médio', time: '72h', color: 'bg-yellow-100 text-yellow-700', examples: 'Bugs visuais, UX frustrante' },
  { level: 'Baixo', time: 'Próxima sprint', color: 'bg-green-100 text-green-700', examples: 'Bugs cosméticos' },
]

const commonBugs = [
  { category: 'State', symptom: 'UI não atualiza', cause: 'Mutação direta, dependências faltantes' },
  { category: 'Async', symptom: 'Dados vazios', cause: 'Não aguardou promise, race condition' },
  { category: 'Auth', symptom: 'Redirect loop', cause: 'Condicional mal formatada' },
  { category: 'API', symptom: '403/401', cause: 'Token expirado, RLS policy' },
  { category: 'Null', symptom: 'Cannot read property', cause: 'Verificação faltante' },
]

export default function BugsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/protocols" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Voltar para Protocolos
      </Link>

      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 bg-orange-100 rounded-lg">
            <Wrench className="h-8 w-8 text-orange-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Correção de Bugs</h1>
            <p className="text-gray-600 mt-1">Processo sistemático para identificar, reproduzir e corrigir bugs</p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* Priorização */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Clock className="h-5 w-5 mr-2 text-orange-600" />
            1. Priorização de Bugs
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3">Prioridade</th>
                  <th className="text-left py-2 px-3">Tempo de Resposta</th>
                  <th className="text-left py-2 px-3">Exemplos</th>
                </tr>
              </thead>
              <tbody>
                {priorityLevels.map((p, i) => (
                  <tr key={i} className="border-b">
                    <td className="py-2 px-3"><span className={`px-2 py-1 rounded text-xs font-medium ${p.color}`}>{p.level}</span></td>
                    <td className="py-2 px-3">{p.time}</td>
                    <td className="py-2 px-3 text-gray-600">{p.examples}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Reproduzir */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Bug className="h-5 w-5 mr-2 text-orange-600" />
            2. Reproduzir o Bug
          </h2>
          <p className="text-gray-700 mb-4">Antes de corrigir, você precisa conseguir reproduzir o bug consistentemente.</p>
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Template de Bug Report</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li><strong>Título:</strong> Descrição curta e clara</li>
              <li><strong>Passos para Reproduzir:</strong> 1. Vá para X → 2. Clique em Y → 3. Observe o erro</li>
              <li><strong>Comportamento Atual:</strong> O que está acontecendo</li>
              <li><strong>Comportamento Esperado:</strong> O que deveria acontecer</li>
              <li><strong>Ambiente:</strong> SO, Browser, Versão do App</li>
              <li><strong>Logs de Erro:</strong> Cole o erro do console</li>
            </ul>
          </div>
        </div>

        {/* Isolar */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Search className="h-5 w-5 mr-2 text-orange-600" />
            3. Isolar a Causa
          </h2>
          <p className="text-gray-700 mb-4">Encontrar onde está o problema.</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Debugging Checklist</h3>
              <ul className="space-y-1 text-sm">
                <li>✓ Console por erros</li>
                <li>✓ Network tab por falhas</li>
                <li>✓ React DevTools</li>
                <li>✓ Breakpoints no debugger</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Verificar</h3>
              <ul className="space-y-1 text-sm">
                <li>✓ Dados chegando corretamente?</li>
                <li>✓ Tipos corretos?</li>
                <li>✓ Tratamento de null?</li>
                <li>✓ Dependencies do useEffect?</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Padrões Comuns */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Padrões de Bugs Comuns</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3">Categoria</th>
                  <th className="text-left py-2 px-3">Sintoma</th>
                  <th className="text-left py-2 px-3">Causa Comum</th>
                </tr>
              </thead>
              <tbody>
                {commonBugs.map((bug, i) => (
                  <tr key={i} className="border-b">
                    <td className="py-2 px-3 font-medium">{bug.category}</td>
                    <td className="py-2 px-3">{bug.symptom}</td>
                    <td className="py-2 px-3 text-gray-600">{bug.cause}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Corrigir */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Wrench className="h-5 w-5 mr-2 text-orange-600" />
            4. Corrigir
          </h2>
          <div className="space-y-3 text-gray-700">
            <p><strong>Estratégia IDEAL:</strong></p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>I - Isolated:</strong> Correção deve afetar apenas o código problemático</li>
              <li><strong>D - Defensive:</strong> Adicionar validações e checks</li>
              <li><strong>E - Explicit:</strong> Tipos claros, nomes descritivos</li>
              <li><strong>A - Atomic:</strong> Uma correção por PR</li>
              <li><strong>L - Logical:</strong> Deve fazer sentido no contexto</li>
            </ul>
          </div>
        </div>

        {/* Testar */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-orange-600" />
            5. Testar
          </h2>
          <ul className="space-y-2 text-gray-700">
            <li>✓ Teste do caso específico do bug</li>
            <li>✓ Teste de edge cases relacionados</li>
            <li>✓ Verificar que outras funcionalidades ainda funcionam</li>
            <li>✓ Testar fluxos relacionados (regression test)</li>
          </ul>
        </div>

        {/* Documentar */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <FileText className="h-5 w-5 mr-2 text-orange-600" />
            6. Documentar
          </h2>
          <ul className="space-y-2 text-gray-700">
            <li>✓ Changelog atualizado</li>
            <li>✓ Post-mortem escrito (se crítico)</li>
            <li>✓ Teste adicionado para prevenir regressão</li>
          </ul>
        </div>

        {/* Checklist Final */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-green-900 mb-4 flex items-center">
            <CheckCircle className="h-6 w-6 mr-2" />
            Checklist de Correção
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <ul className="space-y-2 text-sm">
              <li className="flex items-center text-green-800"><CheckCircle className="h-4 w-4 mr-2" />Bug reproduzido localmente</li>
              <li className="flex items-center text-green-800"><CheckCircle className="h-4 w-4 mr-2" />Causa raiz identificada</li>
              <li className="flex items-center text-green-800"><CheckCircle className="h-4 w-4 mr-2" />Correção implementada</li>
            </ul>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center text-green-800"><CheckCircle className="h-4 w-4 mr-2" />Teste unitário adicionado</li>
              <li className="flex items-center text-green-800"><CheckCircle className="h-4 w-4 mr-2" />Testes existentes passando</li>
              <li className="flex items-center text-green-800"><CheckCircle className="h-4 w-4 mr-2" />Changelog atualizado</li>
            </ul>
          </div>
        </div>

        {/* Próximos passos */}
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-primary-900 mb-3">Precisa de ajuda com um erro?</h2>
          <p className="text-primary-800 mb-4">Consulte a página de Troubleshooting para soluções de erros comuns.</p>
          <Link href="/troubleshooting" className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
            Ir para Troubleshooting
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
