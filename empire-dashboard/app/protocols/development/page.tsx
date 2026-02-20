'use client'

import { ArrowLeft, CheckCircle, GitCommit, Play, Rocket } from 'lucide-react'
import Link from 'next/link'
import { CodeBlock } from '@/components/CodeBlock'

export default function DevelopmentPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back button */}
      <Link
        href="/protocols"
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Voltar para Protocolos
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 bg-primary-100 rounded-lg">
            <Rocket className="h-8 w-8 text-primary-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Protocolo de Desenvolvimento</h1>
            <p className="text-gray-600 mt-1">Fluxo de trabalho diário para construir features</p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* Section 1 */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <span className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center mr-3 text-sm font-bold">
              1
            </span>
            Check-in Diário
          </h2>
          <div className="space-y-3 text-gray-700">
            <p>Antes de começar a codificar, prepare seu ambiente:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Pull das mudanças do GitHub</li>
              <li>Atualizar dependências se necessário</li>
              <li>Rodar `npm run dev` para garantir que tudo funciona</li>
              <li>Verificar se há issues ou bugs priorizados</li>
            </ul>
            <CodeBlock
              code={`git pull origin main
npm install  # se houver mudanças no package.json
npm run dev`}
              language="bash"
            />
          </div>
        </div>

        {/* Section 2 */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <span className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center mr-3 text-sm font-bold">
              2
            </span>
            Criar uma Branch
          </h2>
          <div className="space-y-3 text-gray-700">
            <p>Nunca trabalhe direto na branch main. Crie uma branch para cada feature/bug:</p>
            <CodeBlock
              code={`git checkout -b feature/nova-feature
# ou
git checkout -b fix/bug-nome-descritivo`}
              language="bash"
            />
            <p className="text-sm text-gray-500">
              <strong>Nome da branch:</strong> `feature/` para novas funcionalidades, `fix/` para bugs
            </p>
          </div>
        </div>

        {/* Section 3 */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <span className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center mr-3 text-sm font-bold">
              3
            </span>
            Desenvolver a Feature
          </h2>
          <div className="space-y-3 text-gray-700">
            <p>Use o seguinte fluxo:</p>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li><strong>Planeje:</strong> O que precisa ser feito? Quais componentes?</li>
              <li><strong>Crie componentes:</strong> Comece com componentes reutilizáveis</li>
              <li><strong>Integre:</strong> Conecte com API/banco de dados</li>
              <li><strong>Teste:</strong> Verifique se funciona como esperado</li>
              <li><strong>Refine:</strong> Melhore UI/UX se necessário</li>
            </ol>
          </div>
        </div>

        {/* Section 4 */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Play className="h-6 w-6 mr-2 text-primary-600" />
            Testando Localmente
          </h2>
          <div className="space-y-3 text-gray-700">
            <p>Antes de commitar, certifique-se:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>O código compila sem erros</li>
              <li>Não há avisos do ESLint (ou são aceitáveis)</li>
              <li>A feature funciona no browser</li>
              <li>Não há bandeiras vermelhas</li>
              <li>Você entendeu o que cada parte do código faz</li>
            </ul>
          </div>
        </div>

        {/* Section 5 */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <GitCommit className="h-6 w-6 mr-2 text-primary-600" />
            Commit das Mudanças
          </h2>
          <div className="space-y-3 text-gray-700">
            <p>Faça commits pequenos e descritivos:</p>
            <CodeBlock
              code={`git add .
git commit -m "feat: adiciona página de login

- Cria componente LoginForm
- Conecta com API de autenticação
- Adiciona validação de campos

Co-Authored-By: Claude Sonnet <noreply@anthropic.com>"`}
              language="bash"
            />
            <p className="text-sm text-gray-500">
              <strong>Conventional Commits:</strong> `feat:` para features, `fix:` para bugs, `refactor:` para refatoração
            </p>
          </div>
        </div>

        {/* Section 6 */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <span className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center mr-3 text-sm font-bold">
              6
            </span>
            Push e Pull Request
          </h2>
          <div className="space-y-3 text-gray-700">
            <p>Após commitar, envie para o GitHub:</p>
            <CodeBlock
              code={`git push origin feature/nova-feature`}
              language="bash"
            />
            <p className="mt-4">
              Depois, abra uma <strong>Pull Request</strong> no GitHub para revisão.
            </p>
          </div>
        </div>

        {/* Checklist */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-green-900 mb-4 flex items-center">
            <CheckCircle className="h-6 w-6 mr-2" />
            Checklist Antes de Push
          </h2>
          <ul className="space-y-2">
            {[
              'Código compila sem erros',
              'Feature funciona no browser',
              'Não há console errors',
              'Linting está OK',
              'Commits têm mensagens descritivas',
              'Branch está atualizada com main',
              'Não há arquivos esquecidos (node_modules, etc.)',
              'Variáveis de ambiente não foram commitadas (.env no .gitignore)',
            ].map((item, index) => (
              <li key={index} className="flex items-center text-green-800">
                <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Tips */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-yellow-900 mb-3">💡 Dicas Importantes</h2>
          <ul className="space-y-2 text-yellow-800">
            <li>• Peça revisão da IA quando tiver dúvida de arquitetura</li>
            <li>• Não hesite em perguntar sobre comandos antes de executar</li>
            <li>• Verifique o <Link href="/flags" className="underline font-semibold">Glossário de Bandeiras Vermelhas</Link> antes de comandos arriscados</li>
            <li>• Commits pequenos são melhores que um commit gigante</li>
            <li>• Documente o que você não entende para aprender depois</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
