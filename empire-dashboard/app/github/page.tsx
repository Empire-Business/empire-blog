import { Github, Star, GitFork, ExternalLink, Heart, BookOpen, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

export default function GitHubPage() {
  const currentYear = new Date().getFullYear()

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <Github className="h-12 w-12 text-gray-900" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Empire Vibe Coding</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Documentação open source para desenvolvimento com IA
        </p>
      </div>

      {/* GitHub Link Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Repositório GitHub</h2>
            <p className="text-gray-600 mb-4">
              Todo o código e documentação deste projeto está disponível no GitHub como open source.
            </p>
            <a
              href="https://github.com/Empire-Business/empire-vibe-coding"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Github className="mr-2 h-5 w-5" />
              Acessar Repositório
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Project Info */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center space-x-2 text-gray-600 mb-4">
            <Star className="h-5 w-5" />
            <span className="font-medium">Dê uma estrela ⭐</span>
          </div>
          <p className="text-gray-600 text-sm">
            Se você achou a documentação útil, considere dar uma estrela no repositório. Isso ajuda a divulgar o projeto!
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center space-x-2 text-gray-600 mb-4">
            <GitFork className="h-5 w-5" />
            <span className="font-medium">Fork o projeto</span>
          </div>
          <p className="text-gray-600 text-sm">
            Fork o repositório para fazer suas próprias melhorias e contribuir de volta.
          </p>
        </div>
      </div>

      {/* How to Contribute */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-blue-900 mb-4 flex items-center">
          <BookOpen className="h-6 w-6 mr-2" />
          Como Contribuir
        </h2>
        <ol className="space-y-3 text-blue-800">
          <li className="flex items-start">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-200 text-blue-900 rounded-full flex items-center justify-center text-sm font-semibold mr-3">
              1
            </span>
            <span>Faça um fork do repositório</span>
          </li>
          <li className="flex items-start">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-200 text-blue-900 rounded-full flex items-center justify-center text-sm font-semibold mr-3">
              2
            </span>
            <span>Crie uma branch para sua mudança: <code className="bg-blue-100 px-1 rounded">git checkout -b feature/nova-feature</code></span>
          </li>
          <li className="flex items-start">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-200 text-blue-900 rounded-full flex items-center justify-center text-sm font-semibold mr-3">
              3
            </span>
            <span>Faça suas mudanças e commit: <code className="bg-blue-100 px-1 rounded">git commit -m &quot;Adiciona nova feature&quot;</code></span>
          </li>
          <li className="flex items-start">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-200 text-blue-900 rounded-full flex items-center justify-center text-sm font-semibold mr-3">
              4
            </span>
            <span>Push para a branch: <code className="bg-blue-100 px-1 rounded">git push origin feature/nova-feature</code></span>
          </li>
          <li className="flex items-start">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-200 text-blue-900 rounded-full flex items-center justify-center text-sm font-semibold mr-3">
              5
            </span>
            <span>Abra uma Pull Request no GitHub</span>
          </li>
        </ol>
      </div>

      {/* Ways to Contribute */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Formas de Contribuir</h2>
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Heart className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Reportar Bugs</h3>
              <p className="text-gray-600 text-sm">Encontrou um erro na documentação ou no app? Abra uma issue descrevendo o problema.</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BookOpen className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Melhorar Documentação</h3>
              <p className="text-gray-600 text-sm">Corrigir erros de português, adicionar exemplos, esclarecer explicações.</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Star className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Adicionar Novos Termos</h3>
              <p className="text-gray-600 text-sm">Adicione novos termos ao glossário ou bandeiras vermelhas à lista.</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Adicionar Troubleshooting</h3>
              <p className="text-gray-600 text-sm">Encontrou um erro novo e encontrou a solução? Adicione à lista de troubleshooting!</p>
            </div>
          </div>
        </div>
      </div>

      {/* License */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Licença</h2>
        <p className="text-gray-600 mb-4">
          Este projeto está licenciado sob a <strong>MIT License</strong>, o que significa que você pode usar, modificar e distribuir livremente para qualquer propósito.
        </p>
        <a
          href="https://github.com/Empire-Business/empire-vibe-coding/blob/main/LICENSE"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-600 hover:underline"
        >
          Ver licença completa →
        </a>
      </div>

      {/* Contact */}
      <div className="text-center">
        <p className="text-gray-600">
          Dúvidas? Entre em contato via{' '}
          <a
            href="https://github.com/Empire-Business/empire-vibe-coding/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 hover:underline"
          >
            GitHub Issues
          </a>
        </p>
      </div>
    </div>
  )
}
