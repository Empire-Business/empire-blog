'use client'

import { useState } from 'react'
import { AlertTriangle, Shield, Terminal, Database, Package, Lock, Search, X } from 'lucide-react'
import { SearchBar } from '@/components/SearchBar'
import { Alert } from '@/components/Alert'
import { CodeBlock } from '@/components/CodeBlock'

// Dados de bandeiras vermelhas (do arquivo vibe-coding/BANDEIRAS-VERMELHAS.md)
const RED_FLAGS = [
  {
    id: 'rm-rf',
    command: 'rm -rf',
    category: 'Sistema',
    description: 'Remove arquivos e pastas recursivamente, sem pedir confirmação.',
    risk: 'DESTRÓI tudo no caminho especificado. Um caractere errado e você perde o projeto inteiro.',
    safeAlternative: 'Use `ls` primeiro para ver o que está na pasta, depois `rm nome-do-arquivo` para arquivos específicos.',
    analogy: 'Como jogar todo o lixo de sua casa na rua sem verificar se sua carteira está lá dentro.',
  },
  {
    id: 'git-reset-hard',
    command: 'git reset --hard',
    category: 'Git',
    description: 'Reseta o repositório para o commit especificado, descartando TODAS as mudanças não salvas.',
    risk: 'Você perde TODO o trabalho não commitado. Não há volta.',
    safeAlternative: 'Use `git stash` para salvar mudanças temporariamente, ou faça um branch backup.',
    analogy: 'Como voltar no tempo para ontem, mas esquecendo tudo que aconteceu hoje inclusive as coisas boas.',
  },
  {
    id: 'git-force-push',
    command: 'git push --force',
    category: 'Git',
    description: 'Sobrescreve o histórico remoto com o local, ignorando conflitos.',
    risk: 'Pode apagar commits de outros membros da equipe. É uma bomba em código aberto.',
    safeAlternative: 'Nunca use force push na branch principal. Use `git pull --rebase` para resolver conflitos.',
    analogy: 'Como rasgar o jornal de todo mundo e colar sua versão no lugar.',
  },
  {
    id: 'docker-rmi-all',
    command: 'docker rmi $(docker images -q)',
    category: 'Sistema',
    description: 'Remove TODAS as imagens Docker do seu sistema.',
    risk: 'Você terá que baixar tudo de novo. Pode quebrar builds dependentes de imagens específicas.',
    safeAlternative: 'Use `docker images` para listar e `docker rmi <id>` para remover imagens específicas.',
    analogy: 'Como jogar fora todos os ingredientes da cozinha inclusive os que você vai usar hoje.',
  },
  {
    id: 'npm-install-force',
    command: 'npm install --force',
    category: 'NPM',
    description: 'Força instalação de pacotes ignorando conflitos e verificação de integridade.',
    risk: 'Pode quebrar seu projeto com versões incompatíveis de pacotes.',
    safeAlternative: 'Use `npm update` ou resolva conflitos manualmente no package.json.',
    analogy: 'Como forçar uma peça quadrada no buraco redondo até quebrar.',
  },
  {
    id: 'chmod-777',
    command: 'chmod 777',
    category: 'Sistema',
    description: 'Dá permissões totais de leitura, escrita e execução para TODOS.',
    risk: 'Qualquer processo pode modificar seus arquivos. Brecha de segurança crítica.',
    safeAlternative: 'Use permissões mínimas necessárias. Ex: `chmod 644` para arquivos, `chmod 755` para diretórios.',
    analogy: 'Como deixar as portas da sua casa aberta para quem quiser entrar.',
  },
  {
    id: 'db-drop',
    command: 'DROP DATABASE',
    category: 'Banco de Dados',
    description: 'Apaga completamente um banco de dados e todos os dados.',
    risk: 'DESTRÓI todos os dados permanentemente. Sem backup, é irreversível.',
    safeAlternative: 'Use `SELECT COUNT(*)` para verificar o que tem antes. Sempre faça backup primeiro.',
    analogy: 'Como pegar todos os papéis da empresa e jogar no incinerador.',
  },
  {
    id: 'db-truncate',
    command: 'TRUNCATE TABLE',
    category: 'Banco de Dados',
    description: 'Remove todos os registros de uma tabela, mas mantém a estrutura.',
    risk: 'Perde todos os dados daquela tabela instantaneamente.',
    safeAlternative: 'Use `DELETE FROM tabela WHERE condicao` para deletar registros específicos.',
    analogy: 'Como apagar todo o conteúdo de um arquivo mas deixar a folha em branco.',
  },
  {
    id: 'rm-node-modules',
    command: 'rm -rf node_modules',
    category: 'NPM',
    description: 'Remove a pasta node_modules e todas as dependências.',
    risk: 'Você terá que rodar `npm install` de novo, o que pode demorar muito.',
    safeAlternative: 'Use `npm cache clean --force` para limpar cache sem apagar pacotes.',
    analogy: 'Como jogar fora toda sua biblioteca de livros e ter que comprar tudo de novo.',
  },
  {
    id: 'git-clean-force',
    command: 'git clean -fd',
    category: 'Git',
    description: 'Remove arquivos não rastreados pelo Git (incluindo pastas) sem perguntar.',
    risk: 'Pode apagar arquivos importantes que você não adicionou ao Git ainda.',
    safeAlternative: 'Use `git clean -fdn` para ver o que seria apagado antes de confirmar.',
    analogy: 'Como jogar fora tudo que não está na caixa sem verificar o que é.',
  },
  {
    id: 'kill-9-node',
    command: 'kill -9 node',
    category: 'Sistema',
    description: 'Força o encerramento imediato de um processo Node.js sem chance de limpeza.',
    risk: 'Conexões podem ficar abertas, arquivos podem ficar corrompidos, dados perdidos.',
    safeAlternative: 'Tente `Ctrl+C` primeiro, ou use `kill` sem `-9` para encerramento gracioso.',
    analogy: 'Como puxar o cabo da força do computador enquanto está salvando um arquivo.',
  },
  {
    id: 'npm-uninstall-force',
    command: 'npm uninstall --force',
    category: 'NPM',
    description: 'Remove pacote forçadamente, ignorando dependências.',
    risk: 'Pode quebrar outras dependências que precisam desse pacote.',
    safeAlternative: 'Verifique dependências antes: `npm ls <pacote>` e remova manualmente se necessário.',
    analogy: 'Como remover um tijoco do meio da parede sem ver se ela vai cair.',
  },
]

const CATEGORIES = ['all', 'Sistema', 'Git', 'Banco de Dados', 'NPM']

const CATEGORY_ICONS: Record<string, any> = {
  Sistema: Terminal,
  Git: Lock,
  'Banco de Dados': Database,
  NPM: Package,
}

export default function FlagsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // Filtrar bandeiras por busca e categoria
  const filteredFlags = RED_FLAGS.filter(flag => {
    const matchesSearch =
      flag.command.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flag.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flag.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flag.risk.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory =
      selectedCategory === 'all' || flag.category.toLowerCase() === selectedCategory.toLowerCase()

    return matchesSearch && matchesCategory
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 bg-danger-100 rounded-lg">
            <AlertTriangle className="h-8 w-8 text-danger-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Bandeiras Vermelhas</h1>
            <p className="text-gray-600 mt-1">Comandos perigosos que você deve evitar</p>
          </div>
        </div>
      </div>

      <Alert
        type="danger"
        title="⚠️ ATENÇÃO IMPORTANTE"
        message="NUNCA execute comandos que você não entende. Antes de rodar qualquer comando, pergunte o que ele faz. Se um comando estiver nesta lista, confirme com um desenvolvedor experiente antes de executar."
        className="mb-8"
      />

      {/* Search */}
      <div className="mb-6">
        <SearchBar
          placeholder="Buscar comando perigoso..."
          onSearch={setSearchQuery}
        />
      </div>

      {/* Category Tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {CATEGORIES.map(category => {
          const Icon = CATEGORY_ICONS[category] || Shield

          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                selectedCategory === category
                  ? 'bg-danger-600 text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-danger-50 hover:border-danger-300'
              }`}
            >
              {category !== 'all' && <Icon className="h-4 w-4" />}
              <span className="capitalize">{category === 'all' ? 'Todos' : category}</span>
            </button>
          )
        })}
      </div>

      {/* Results count */}
      <div className="mb-6">
        <p className="text-gray-600">
          {filteredFlags.length === RED_FLAGS.length
            ? `Mostrando todos os ${RED_FLAGS.length} comandos perigosos`
            : `${filteredFlags.length} de ${RED_FLAGS.length} comandos encontrados`}
        </p>
      </div>

      {/* Flags list */}
      {filteredFlags.length > 0 ? (
        <div className="space-y-6">
          {filteredFlags.map(flag => (
            <div
              key={flag.id}
              className="bg-white border-l-4 border-danger-500 rounded-lg overflow-hidden shadow-md"
            >
              <div className="p-6">
                {/* Command header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="inline-block px-3 py-1 bg-danger-100 text-danger-800 text-sm font-semibold rounded-full">
                        {flag.category}
                      </span>
                    </div>
                    <CodeBlock code={flag.command} language="bash" />
                  </div>
                  <Shield className="h-6 w-6 text-danger-500 flex-shrink-0 ml-4" />
                </div>

                {/* Description */}
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-1">O que faz</h3>
                  <p className="text-gray-800">{flag.description}</p>
                </div>

                {/* Risk */}
                <div className="mb-4 p-4 bg-danger-50 rounded-lg border border-danger-200">
                  <h3 className="text-sm font-semibold text-danger-800 mb-1 flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    PERIGO
                  </h3>
                  <p className="text-danger-900">{flag.risk}</p>
                </div>

                {/* Safe alternative */}
                <div className="mb-4 p-4 bg-success-50 rounded-lg border border-success-200">
                  <h3 className="text-sm font-semibold text-success-800 mb-1">✅ Alternativa segura</h3>
                  <p className="text-success-900">{flag.safeAlternative}</p>
                </div>

                {/* Analogy */}
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-700 mb-1">📌 Analogia</h3>
                  <p className="text-gray-800 italic">{flag.analogy}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
          <X className="h-16 w-16 text-danger-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Nenhum comando encontrado
          </h3>
          <p className="text-gray-500">
            Tente buscar com outros termos ou filtre por outra categoria.
          </p>
          <button
            onClick={() => {
              setSearchQuery('')
              setSelectedCategory('all')
            }}
            className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Limpar filtros
          </button>
        </div>
      )}

      {/* Final warning */}
      <Alert
        type="danger"
        message="Esta lista não é exaustiva. Se você tem dúvida sobre um comando, sempre pergunte antes de executar. Uma regra de ouro: se você não entende o que o comando faz, NÃO RODE."
        className="mt-8"
      />
    </div>
  )
}
