'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import {
  AlertCircle,
  BookOpen,
  Bot,
  Brain,
  Bug,
  Check,
  CheckCircle,
  Code,
  Copy,
  Database,
  Download,
  FileText,
  Github,
  GitBranch,
  Globe,
  HelpCircle,
  Layers,
  Rocket,
  Search,
  Shield,
  Sparkles,
  Star,
  Terminal,
  Upload,
  Users,
  Wrench,
} from 'lucide-react'
import tutorialData from '@/data/tutorial.generated.json'

type CommandEntry = {
  command: string
  title: string
  description: string
  category: string
}

const iconByCommand: Record<string, React.ElementType> = {
  '*começar': Rocket,
  '*desenvolver': Code,
  '*bug': Bug,
  '*erro': AlertCircle,
  '*termo': BookOpen,
  '*comando': Shield,
  '*lançar': Upload,
  '*roadmap': FileText,
  '*decisão': FileText,
  '*mudança': FileText,
  '*arquitetura': Layers,
  '*status': CheckCircle,
  '*design': Sparkles,
  '*ux': Search,
  '*seguranca': Shield,
  '*qualidade': Star,
  '*garantir': CheckCircle,
  '*revisar': Search,
  '*banco': Database,
  '*supabase': Database,
  '*workflow': GitBranch,
  '*orquestrar': Layers,
  '*tarefas': CheckCircle,
  '*dashboard': Terminal,
  '*sincronizar': CheckCircle,
  '*planejar': FileText,
  '*especificar': FileText,
  '*prd': FileText,
  '*api': Globe,
  '*nerd': Brain,
  '*agentes': Users,
  '*melhorar': Wrench,
  '*ajuda': HelpCircle,
}

const exampleByCommand: Record<string, string> = {
  '*começar': '*começar',
  '*bug': '*bug\n\nLogin não funciona no Safari',
  '*erro': '*erro\n\nnpm ERR! ERESOLVE unable to resolve dependency tree',
  '*termo': '*termo\n\nO que é API?',
  '*comando': '*comando\n\nrm -rf node_modules',
  '*dashboard': '*dashboard',
  '*sincronizar': '*sincronizar',
  '*agentes': '*agentes\n\nPreciso implementar checkout com segurança e testes',
}

const palette = [
  'bg-blue-100 text-blue-700',
  'bg-green-100 text-green-700',
  'bg-purple-100 text-purple-700',
  'bg-red-100 text-red-700',
  'bg-orange-100 text-orange-700',
  'bg-cyan-100 text-cyan-700',
]

function CopyButton({ text, dark = false }: { text: string; dark?: boolean }) {
  const [copied, setCopied] = useState(false)

  const onCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <button
      onClick={onCopy}
      type="button"
      className={`rounded p-1.5 transition-colors ${dark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
      title="Copiar"
    >
      {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className={`h-4 w-4 ${dark ? 'text-gray-300' : 'text-gray-500'}`} />}
    </button>
  )
}

function CommandCard({ command, color }: { command: CommandEntry; color: string }) {
  const Icon = iconByCommand[command.command] || Terminal
  const example = exampleByCommand[command.command]

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 hover:shadow-sm">
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 rounded-lg p-2 ${color}`}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <code className="text-sm font-bold text-blue-700">{command.command}</code>
            <span className="text-xs text-gray-500">{command.title}</span>
          </div>
          <p className="text-sm text-gray-600">{command.description}</p>
          {example && (
            <div className="mt-2 rounded bg-gray-50 p-2">
              <div className="flex items-start justify-between gap-2">
                <code className="whitespace-pre-line text-xs text-gray-700">{example}</code>
                <CopyButton text={example.split('\n')[0] || command.command} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function CommandSection({
  title,
  commands,
  color,
}: {
  title: string
  commands: CommandEntry[]
  color: string
}) {
  return (
    <section className="mb-8">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">{commands.length}</span>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {commands.map((command) => (
          <CommandCard key={command.command} command={command} color={color} />
        ))}
      </div>
    </section>
  )
}

export default function HomePage() {
  const metrics = tutorialData.metrics

  const categories = useMemo(
    () => tutorialData.categories.filter((category) => category.count > 0),
    []
  )

  const commandsByCategory = useMemo(() => {
    const map = new Map<string, CommandEntry[]>()

    for (const category of categories) {
      map.set(
        category.name,
        category.commands.map((command) => ({
          command: command.command,
          title: command.title,
          description: command.description,
          category: category.name,
        }))
      )
    }

    return map
  }, [categories])

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-b from-blue-50 to-white py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mb-6 flex justify-center">
            <Image
              src="/logo.png"
              alt="Empire"
              width={540}
              height={180}
              className="h-auto w-56 sm:w-72 lg:w-80"
              priority
            />
          </div>
          <h1 className="mb-3 text-4xl font-bold text-gray-900 sm:text-5xl">Empire Vibe Coding</h1>
          <p className="mx-auto mb-4 max-w-2xl text-lg text-gray-600 sm:text-xl">
            Desenvolvimento task-oriented com Claude Code, Codex e dashboard local.
          </p>
          <p className="mb-6 text-sm text-gray-500">
            {metrics.totalCommands} comandos ativos • {metrics.totalProtocols} protocolos ativos • tutorial sincronizado com a fonte oficial
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a href="#instalar" className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700">
              <Download className="mr-2 inline h-4 w-4" /> Instalar
            </a>
            <a href="/como-funciona" className="rounded-xl border border-gray-200 bg-white px-6 py-3 font-semibold text-gray-900 hover:bg-gray-100">
              Como funciona
            </a>
            <a
              href="https://github.com/Empire-Business/empire-vibe-coding"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-3 text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              <Github className="mr-2 inline h-4 w-4" /> GitHub
            </a>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <section id="instalar" className="mb-10 rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">Instalação (modo único obrigatório)</h2>
          <p className="mb-4 text-sm text-gray-600">
            Instala documentação + runtime em <code>empire-dashboard/</code>. Sempre cria
            <code> CLAUDE.md</code> + <code>AGENTS.md</code> + <code>.claude/settings.local.json</code>.
            O dashboard roda em localhost e é somente consulta.
          </p>
          <div className="rounded-lg bg-gray-900 p-4">
            <div className="mb-2 flex items-center justify-between text-xs text-gray-300">
              <span>Comando de instalação</span>
              <CopyButton text="curl -fsSL https://raw.githubusercontent.com/Empire-Business/empire-vibe-coding/main/install.sh | bash" dark />
            </div>
            <code className="break-all text-sm text-white">
              curl -fsSL https://raw.githubusercontent.com/Empire-Business/empire-vibe-coding/main/install.sh | bash
            </code>
          </div>

          <div className="mt-3 grid gap-2 text-xs text-gray-600 sm:grid-cols-3">
            <div className="rounded bg-gray-50 p-2">Sempre cria <code>CLAUDE.md</code> e <code>AGENTS.md</code></div>
            <div className="rounded bg-gray-50 p-2">Sempre cria <code>.claude/settings.local.json</code></div>
            <div className="rounded bg-gray-50 p-2">Arquivos de agente devem ficar idênticos byte a byte</div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-900">
              <p className="font-semibold">Abrir dashboard</p>
              <p><code>npm run dashboard</code></p>
              <p className="text-xs text-blue-800">fallback: <code>npm --prefix empire-dashboard run dashboard</code></p>
            </div>
            <div className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
              <p className="font-semibold">Flags úteis</p>
              <p><code>--docs-only</code> (sem runtime)</p>
              <p><code>--refresh-runtime</code> (atualiza runtime)</p>
              <p className="text-xs">Legadas removidas: <code>--platform</code>, <code>--merge</code>, <code>--separate</code>, <code>--no-claude</code></p>
            </div>
          </div>

          <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800">
            Claude: Agent Teams em <code>.claude/settings.local.json</code> com
            <code> CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1</code>. Se houver drift entre
            <code> CLAUDE.md</code> e <code>AGENTS.md</code>, rode <code>*sincronizar</code>.
          </div>
        </section>

        <section className="mb-10 rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-3 text-2xl font-bold text-gray-900">Fluxo recomendado</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg bg-gray-100 p-3">
              <code className="font-bold text-blue-700">*sincronizar</code>
              <p className="mt-1 text-sm text-gray-600">Valida e corrige paridade entre CLAUDE.md e AGENTS.md.</p>
            </div>
            <div className="rounded-lg bg-gray-100 p-3">
              <code className="font-bold text-blue-700">*começar</code>
              <p className="mt-1 text-sm text-gray-600">Abre tutorial interativo e direciona o próximo passo.</p>
            </div>
            <div className="rounded-lg bg-gray-100 p-3">
              <code className="font-bold text-blue-700">*agentes</code>
              <p className="mt-1 text-sm text-gray-600">Claude: Agent Teams nativo. Codex: emulação líder PM + especialistas.</p>
            </div>
            <div className="rounded-lg bg-gray-100 p-3">
              <code className="font-bold text-blue-700">*dashboard</code>
              <p className="mt-1 text-sm text-gray-600">Acompanha execução no dashboard local (read-only).</p>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Comandos (fonte oficial)</h2>
            <p className="text-sm text-gray-600">
              As seções abaixo são renderizadas a partir de <code>vibe-coding/COMANDOS.md</code> via arquivo gerado.
            </p>
          </div>

          {categories.map((category, index) => {
            const commands = commandsByCategory.get(category.name) || []
            return (
              <CommandSection
                key={category.key}
                title={`${category.name}`}
                commands={commands}
                color={palette[index % palette.length]}
              />
            )
          })}
        </section>
      </main>

      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-xs text-gray-500">Empire Vibe Coding - {metrics.totalCommands} comandos sincronizados</p>
          <a
            href="https://github.com/Empire-Business/empire-vibe-coding"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-600 hover:text-gray-900"
          >
            Ver no GitHub
          </a>
        </div>
      </footer>
    </div>
  )
}
