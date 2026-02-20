'use client'

import { ArrowLeft, Shield, CheckCircle, AlertTriangle, Database, FileText, RefreshCw, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const errorTypes = [
  { type: 'Críticos', action: 'Alertar Imediatamente', examples: '5xx errors, Checkout quebrado', color: 'bg-red-100 text-red-700' },
  { type: 'Alerta', action: 'Revisar Diariamente', examples: '4xx errors, Performance degradada', color: 'bg-orange-100 text-orange-700' },
  { type: 'Informativos', action: 'Revisar Semanalmente', examples: 'Warnings de console, User feedback', color: 'bg-blue-100 text-blue-700' },
]

const updateFrequency = [
  { freq: 'Semanalmente', type: 'Patch', items: ['Security patches', 'Bug fixes críticos'] },
  { freq: 'Mensalmente', type: 'Minor', items: ['Novas features menores', 'Melhoras de performance'] },
  { freq: 'Trimestralmente', type: 'Major', items: ['Versões major', 'Refatorações necessárias'] },
]

const weeklyTasks = [
  { day: 'Segunda', tasks: ['Review de erros do fim de semana', 'Verificar alertas', 'Update de segurança'] },
  { day: 'Terça', tasks: ['Processar PRs de dependências', 'Smoke tests em staging'] },
  { day: 'Quarta', tasks: ['Database maintenance', 'Review de performance', 'Backup verification'] },
  { day: 'Quinta', tasks: ['Documentação atualizada', 'Runbooks revisados'] },
  { day: 'Sexta', tasks: ['Sweep de issues abertas', 'Planning para próxima semana'] },
]

export default function MaintenancePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/protocols" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Voltar para Protocolos
      </Link>

      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 bg-green-100 rounded-lg">
            <Shield className="h-8 w-8 text-green-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manutenção de Projetos</h1>
            <p className="text-gray-600 mt-1">Cuidar de projetos em produção: monitoramento, updates e backups</p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* Monitoramento */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-green-600" />
            1. Monitoramento de Erros
          </h2>
          <div className="space-y-3">
            {errorTypes.map((error, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded text-sm font-medium ${error.color}`}>{error.type}</span>
                  <span className="text-gray-700">{error.examples}</span>
                </div>
                <span className="text-sm text-gray-500">{error.action}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Ferramentas recomendadas:</strong> Sentry (erros), DataDog (performance), CloudWatch (infra)
            </p>
          </div>
        </div>

        {/* Atualizações */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <RefreshCw className="h-5 w-5 mr-2 text-green-600" />
            2. Atualização de Dependências
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3">Frequência</th>
                  <th className="text-left py-2 px-3">Tipo</th>
                  <th className="text-left py-2 px-3">O que atualizar</th>
                </tr>
              </thead>
              <tbody>
                {updateFrequency.map((u, i) => (
                  <tr key={i} className="border-b">
                    <td className="py-2 px-3 font-medium">{u.freq}</td>
                    <td className="py-2 px-3">{u.type}</td>
                    <td className="py-2 px-3 text-gray-600">{u.items.join(', ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Checklist de Update</h3>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>✓ Revisar changelog da dependência</li>
              <li>✓ Verificar breaking changes</li>
              <li>✓ Rodar tests após update</li>
              <li>✓ Ter plano de rollback</li>
            </ul>
          </div>
        </div>

        {/* Backup */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Database className="h-5 w-5 mr-2 text-green-600" />
            3. Backup e Recovery
          </h2>
          <div className="space-y-4 text-gray-700">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">O que fazer backup</h3>
              <ul className="space-y-1 text-sm">
                <li>• Banco de dados (diário)</li>
                <li>• Arquivos de storage (semanal)</li>
                <li>• Variáveis de ambiente (quando mudar)</li>
              </ul>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="font-semibold text-red-800 mb-2">Recovery Procedure</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm text-red-700">
                <li>Identificar o problema e último backup válido</li>
                <li>Preparar ambiente de staging para teste</li>
                <li>Executar restore e verificar integridade</li>
                <li>Validar funcionalidades críticas</li>
                <li>Documentar post-mortem</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Documentação */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <FileText className="h-5 w-5 mr-2 text-green-600" />
            4. Documentação Viva
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Documentos Essenciais</h3>
              <ul className="space-y-1 text-sm">
                <li>• ARCHITECTURE.md - Decisões</li>
                <li>• API.md - Endpoints</li>
                <li>• DEPLOYMENT.md - Processos</li>
                <li>• INCIDENTS.md - Histórico</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Quando Atualizar</h3>
              <ul className="space-y-1 text-sm">
                <li>• Novo feature shipped</li>
                <li>• Bug workaround implementado</li>
                <li>• Mudança de configuração</li>
                <li>• Incidente resolvido</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Rotina Semanal */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Rotina Semanal de Manutenção</h2>
          <div className="space-y-3">
            {weeklyTasks.map((day, i) => (
              <div key={i} className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg">
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm font-medium min-w-[80px] text-center">{day.day}</span>
                <ul className="text-sm text-gray-700 space-y-1">
                  {day.tasks.map((task, j) => (
                    <li key={j}>• {task}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Checklist */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-green-900 mb-4 flex items-center">
            <CheckCircle className="h-6 w-6 mr-2" />
            Checklist de Manutenção
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <ul className="space-y-2 text-sm text-green-800">
              <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2" />Monitoramento ativo</li>
              <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2" />Alertas configurados</li>
              <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2" />Backups funcionando</li>
            </ul>
            <ul className="space-y-2 text-sm text-green-800">
              <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2" />Dependências atualizadas</li>
              <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2" />Documentação atualizada</li>
              <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2" />Plano de recovery testado</li>
            </ul>
          </div>
        </div>

        {/* Próximos passos */}
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-primary-900 mb-3">Encontrou um bug?</h2>
          <p className="text-primary-800 mb-4">Use o protocolo de Correção de Bugs para resolver de forma sistemática.</p>
          <Link href="/protocols/bugs" className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
            Ver Protocolo de Bugs
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
