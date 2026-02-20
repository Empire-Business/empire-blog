'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import {
  BookOpen,
  Bot,
  CheckCircle,
  Copy,
  FolderTree,
  Layers,
  Rocket,
  Shield,
  Terminal,
} from 'lucide-react'
import tutorialData from '@/data/tutorial.generated.json'

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const onCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <button
      onClick={onCopy}
      className="rounded bg-white/10 px-3 py-1 text-xs text-white hover:bg-white/20"
      type="button"
    >
      {copied ? 'Copiado' : 'Copiar'} <Copy className="ml-1 inline h-3.5 w-3.5" />
    </button>
  )
}

export default function ComoFuncionaPage() {
  const metrics = tutorialData.metrics

  const categories = useMemo(
    () => tutorialData.categories.filter((category) => category.count > 0),
    []
  )

  const protocolPreview = useMemo(
    () => tutorialData.protocols.slice(0, 10).map((protocol) => protocol.file),
    []
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <a href="/" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Empire"
              width={150}
              height={50}
              className="h-8 w-auto sm:h-9"
            />
            <div>
              <p className="text-sm font-bold text-gray-900">Como Funciona</p>
              <p className="text-xs text-gray-500">Empire Vibe Coding</p>
            </div>
          </a>
          <a
            href="/"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Ver comandos
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">
        <section className="rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 p-6 text-white sm:p-8">
          <h1 className="mb-3 text-2xl font-bold sm:text-3xl">Visão geral real do sistema</h1>
          <p className="mb-6 text-blue-100">
            Esta página é sincronizada com <code>vibe-coding/COMANDOS.md</code> e{' '}
            <code>vibe-coding/PROTOCOLOS</code>. Nada aqui depende de contagem manual fixa.
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl bg-white/10 p-4">
              <p className="text-3xl font-bold">{metrics.totalCommands}</p>
              <p className="text-xs text-blue-100">Comandos ativos</p>
            </div>
            <div className="rounded-xl bg-white/10 p-4">
              <p className="text-3xl font-bold">{metrics.totalProtocols}</p>
              <p className="text-xs text-blue-100">Protocolos ativos</p>
            </div>
            <div className="rounded-xl bg-white/10 p-4">
              <p className="text-3xl font-bold">{metrics.totalCategories}</p>
              <p className="text-xs text-blue-100">Categorias</p>
            </div>
            <div className="rounded-xl bg-white/10 p-4">
              <p className="text-3xl font-bold">1</p>
              <p className="text-xs text-blue-100">Modo dashboard: read-only</p>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-3 flex items-center gap-2 text-xl font-bold text-gray-900">
            <Rocket className="h-5 w-5 text-blue-600" />
            O que o comando <code>*começar</code> faz de verdade
          </h2>
          <p className="mb-4 text-sm text-gray-600">
            <code>*começar</code> abre um menu interativo e direciona para o próximo comando.
            Ele não cria PRD, roadmap ou código automaticamente.
          </p>
          <div className="rounded-lg bg-gray-900 p-4 font-mono text-xs text-gray-200 sm:text-sm">
            *começar
            <br />
            - mostra menu
            <br />
            - espera resposta
            <br />
            - direciona para *prd, *status, *agentes, etc.
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-3 flex items-center gap-2 text-xl font-bold text-gray-900">
            <Terminal className="h-5 w-5 text-blue-600" />
            Instalação em modo único obrigatório
          </h2>
          <p className="mb-4 text-sm text-gray-600">
            O instalador traz documentação + runtime local em <code>empire-dashboard/</code>.
            Sempre cria <code>CLAUDE.md</code>, <code>AGENTS.md</code> e <code>.claude/settings.local.json</code>.
          </p>
          <div className="rounded-xl bg-gray-900 p-4 text-xs text-gray-100 sm:text-sm">
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="text-gray-300">Instalar no projeto atual:</span>
              <CopyButton text="curl -fsSL https://raw.githubusercontent.com/Empire-Business/empire-vibe-coding/main/install.sh | bash" />
            </div>
            <code>curl -fsSL https://raw.githubusercontent.com/Empire-Business/empire-vibe-coding/main/install.sh | bash</code>
          </div>
          <div className="mt-4 grid gap-3 text-sm text-gray-700 sm:grid-cols-2">
            <div className="rounded-lg bg-blue-50 p-3">
              <p className="font-semibold text-blue-900">Dashboard local</p>
              <p>
                <code>npm run dashboard</code>
              </p>
              <p className="text-xs text-blue-800">fallback: <code>npm --prefix empire-dashboard run dashboard</code></p>
            </div>
            <div className="rounded-lg bg-amber-50 p-3">
              <p className="font-semibold text-amber-900">Sincronização obrigatória</p>
              <p className="text-xs text-amber-800">
                Se <code>CLAUDE.md</code> e <code>AGENTS.md</code> divergirem, comandos críticos devem bloquear até executar <code>*sincronizar</code>.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-3 flex items-center gap-2 text-xl font-bold text-gray-900">
            <FolderTree className="h-5 w-5 text-blue-600" />
            Estrutura instalada no projeto
          </h2>
          <div className="rounded-lg bg-gray-900 p-4 font-mono text-xs text-gray-200 sm:text-sm">
            projeto/
            <br />
            ├── CLAUDE.md
            <br />
            ├── AGENTS.md
            <br />
            ├── docs/
            <br />
            ├── vibe-coding/
            <br />
            ├── empire-dashboard/
            <br />
            └── .claude/settings.local.json
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900">
            <Layers className="h-5 w-5 text-blue-600" />
            Categorias oficiais de comandos
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <div key={category.key} className="rounded-lg border border-gray-200 p-3">
                <p className="font-semibold text-gray-900">{category.name}</p>
                <p className="text-sm text-gray-600">{category.count} comando(s)</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900">
            <BookOpen className="h-5 w-5 text-blue-600" />
            Protocolos disponíveis hoje
          </h2>
          <div className="mb-3 flex flex-wrap gap-2">
            {protocolPreview.map((protocol) => (
              <span key={protocol} className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700">
                {protocol}
              </span>
            ))}
          </div>
          <p className="text-sm text-gray-600">
            Lista completa em <code>vibe-coding/PROTOCOLOS</code> e navegação web em <a href="/protocols" className="text-blue-600 hover:underline">/protocols</a>.
          </p>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-3 flex items-center gap-2 text-xl font-bold text-gray-900">
            <Bot className="h-5 w-5 text-blue-600" />
            Agent Teams e segurança operacional
          </h2>
          <div className="space-y-3 text-sm text-gray-700">
            <p>
              Claude Code: o projeto garante <code>.claude/settings.local.json</code> com{' '}
              <code>CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1</code>.
            </p>
            <p>
              Dashboard local é exclusivamente de consulta: rotas de mutação retornam <code>403</code>.
            </p>
            <p className="rounded-lg bg-green-50 p-3 text-green-800">
              <code>*agentes</code>: Claude usa Agent Teams nativo; Codex usa emulação de squads (líder + especialistas + consolidação). Para observação use o dashboard localhost.
            </p>
          </div>
        </section>

        <section className="text-center">
          <a
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-lg font-semibold text-white hover:bg-blue-700"
          >
            <CheckCircle className="h-5 w-5" />
            Voltar para os comandos
          </a>
        </section>
      </main>

      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-xs text-gray-500">Empire Vibe Coding - tutorial sincronizado com a fonte oficial</p>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Shield className="h-3.5 w-3.5" />
            localhost + read-only no dashboard
          </div>
        </div>
      </footer>
    </div>
  )
}
