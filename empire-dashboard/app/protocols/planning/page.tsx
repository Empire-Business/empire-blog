'use client'

import { ArrowLeft, Rocket, CheckCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { CodeBlock } from '@/components/CodeBlock'

export default function PlanningPage() {
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
            <h1 className="text-3xl font-bold text-gray-900">Planejamento Inicial</h1>
            <p className="text-gray-600 mt-1">Como começar um projeto do zero</p>
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
            Definição do Projeto
          </h2>
          <div className="space-y-3 text-gray-700">
            <p>Antes de escrever qualquer código, você precisa saber o que está construindo.</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Objetivo:</strong> Qual problema você está resolvendo?</li>
              <li><strong>Público:</strong> Quem vai usar isso?</li>
              <li><strong>Features principais:</strong> O que é essencial (MVP)?</li>
              <li><strong>Features secundárias:</strong> O que pode vir depois?</li>
            </ul>
          </div>
        </div>

        {/* Section 2 */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <span className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center mr-3 text-sm font-bold">
              2
            </span>
            Escolha da Stack Tecnológica
          </h2>
          <div className="space-y-3 text-gray-700">
            <p>Escolha tecnologias que se adequam ao seu projeto e nível de conhecimento.</p>
            <div className="grid sm:grid-cols-2 gap-4 mt-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Frontend</h3>
                <ul className="space-y-1 text-sm">
                  <li>Next.js (React) - Padrão recomendado</li>
                  <li>Vite + React - Mais simples</li>
                  <li>Vanilla JS - Apenas se for bem simples</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Backend</h3>
                <ul className="space-y-1 text-sm">
                  <li>Supabase - Mais fácil para iniciantes</li>
                  <li>Firebase - Boa para projetos rápidos</li>
                  <li>Node.js + PostgreSQL - Mais flexível</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3 */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <span className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center mr-3 text-sm font-bold">
              3
            </span>
            Arquitetura Básica
          </h2>
          <div className="space-y-3 text-gray-700">
            <p>Defina a estrutura inicial do projeto:</p>
            <CodeBlock
              code={`meu-projeto/
├── src/
│   ├── app/          # Páginas Next.js
│   ├── components/   # Componentes reutilizáveis
│   ├── lib/          # Utilitários e helpers
│   └── types/        # Tipos TypeScript
├── public/           # Arquivos estáticos
└── .env.local       # Variáveis de ambiente`}
              language="bash"
            />
          </div>
        </div>

        {/* Section 4 */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <span className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center mr-3 text-sm font-bold">
              4
            </span>
            Setup Inicial
          </h2>
          <div className="space-y-3 text-gray-700">
            <p>Comandos para começar o projeto:</p>
            <CodeBlock
              code={`# Criar projeto Next.js
npx create-next-app@latest meu-projeto

# Entrar na pasta
cd meu-projeto

# Rodar em desenvolvimento
npm run dev`}
              language="bash"
            />
          </div>
        </div>

        {/* Checklist */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-green-900 mb-4 flex items-center">
            <CheckCircle className="h-6 w-6 mr-2" />
            Checklist Antes de Começar a Codar
          </h2>
          <ul className="space-y-2">
            {[
              'Objetivo do projeto está claro',
              'Features principais (MVP) definidas',
              'Stack tecnológica escolhida',
              'Pastas do projeto criadas',
              'Git inicializado',
              'Editor de código configurado (VS Code recomendado)',
              'Node.js instalado (versão 18+)',
              'Variáveis de ambiente preparadas (.env.local)',
            ].map((item, index) => (
              <li key={index} className="flex items-center text-green-800">
                <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Next Steps */}
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-primary-900 mb-3">Próximos Passos</h2>
          <p className="text-primary-800 mb-4">
            Após completar o planejamento inicial, você está pronto para começar o desenvolvimento.
          </p>
          <Link
            href="/protocols/development"
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Ir para Protocolo de Desenvolvimento
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
