'use client'

import Link from 'next/link'
import {
  FileText,
  Rocket,
  CheckCircle,
  AlertTriangle,
  Wrench,
  Package,
  Shield,
} from 'lucide-react'
import { Card } from '@/components/Card'
import tutorialData from '@/data/tutorial.generated.json'

const PROTOCOLS = [
  {
    id: 'planning',
    href: '/protocols/planning',
    icon: Rocket,
    title: 'Planejamento Inicial',
    description: 'Como iniciar projeto do zero e organizar direção técnica.',
  },
  {
    id: 'development',
    href: '/protocols/development',
    icon: CheckCircle,
    title: 'Desenvolvimento',
    description: 'Fluxo diário para implementar features com consistência.',
  },
  {
    id: 'bugs',
    href: '/protocols/bugs',
    icon: Wrench,
    title: 'Correção de Bugs',
    description: 'Processo para reproduzir, diagnosticar e corrigir bugs.',
  },
  {
    id: 'improvement',
    href: '/protocols/improvement',
    icon: Package,
    title: 'Aprimoramento',
    description: 'Melhorias e refatorações com foco em estabilidade.',
  },
  {
    id: 'maintenance',
    href: '/protocols/maintenance',
    icon: Shield,
    title: 'Manutenção',
    description: 'Rotina de manutenção contínua para projetos ativos.',
  },
  {
    id: 'launch',
    href: '/protocols/launch',
    icon: AlertTriangle,
    title: 'Checklist de Lançamento',
    description: 'Validação final antes de publicar o sistema.',
  },
]

export default function ProtocolsPage() {
  const totalProtocols = tutorialData.metrics.totalProtocols

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 bg-primary-100 rounded-lg">
            <FileText className="h-8 w-8 text-primary-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Protocolos de Desenvolvimento</h1>
            <p className="text-gray-600 mt-1">Guia didático baseado na fonte oficial</p>
          </div>
        </div>
      </div>

      <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-blue-900 mb-3">Como ler esta página</h2>
        <p className="text-blue-800 leading-relaxed">
          O catálogo oficial hoje possui <strong>{totalProtocols} protocolos</strong> em
          <code className="mx-1">vibe-coding/PROTOCOLOS</code>.
          Aqui no dashboard web mostramos os protocolos mais usados para estudo rápido.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PROTOCOLS.map((protocol) => (
          <div
            key={protocol.id}
            className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <protocol.icon className="h-5 w-5 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{protocol.title}</h3>
              </div>

              <p className="text-gray-600 mb-4 text-sm">{protocol.description}</p>

              <Link
                href={protocol.href}
                className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700"
              >
                Ver protocolo →
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Por onde começar?</h2>
        <div className="space-y-4 text-gray-700">
          <p>
            1. Use <code>*começar</code> para abrir o tutorial interativo.
          </p>
          <p>
            2. Para projeto novo, siga <Link href="/protocols/planning" className="text-primary-600 hover:underline">Planejamento Inicial</Link>.
          </p>
          <p>
            3. Para incidentes, use <Link href="/protocols/bugs" className="text-primary-600 hover:underline">Correção de Bugs</Link>.
          </p>
          <p>
            4. Para validar erros comuns no dia a dia, consulte <Link href="/troubleshooting" className="text-primary-600 hover:underline">Troubleshooting</Link>.
          </p>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Documentação Relacionada</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card
            href="/glossary"
            iconEmoji="📖"
            title="Glossário"
            description="Entenda os termos técnicos usados nos protocolos."
          />
          <Card
            href="/flags"
            iconEmoji="🚩"
            title="Bandeiras Vermelhas"
            description="Comandos perigosos e alternativas seguras."
          />
          <Card
            href="/troubleshooting"
            iconEmoji="🔧"
            title="Troubleshooting"
            description="Solução de erros comuns durante o desenvolvimento."
          />
        </div>
      </div>
    </div>
  )
}
