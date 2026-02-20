'use client'

import { useState } from 'react'
import { Wrench, Search, Monitor, Terminal, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { SearchBar } from '@/components/SearchBar'
import { Alert } from '@/components/Alert'

// Dados de troubleshooting (do arquivo vibe-coding/TROUBLESHOOTING.md)
const ERROR_GUIDES = [
  {
    id: 'npm-install-failed',
    title: 'npm install failed',
    icon: Terminal,
    category: 'Terminal',
    description: 'Quando você tenta instalar dependências mas o npm reclama de erros.',
    causes: [
      'Versão do Node.js incompatível',
      'Problemas de permissão',
      'Conexão com a internet instável',
      'Cache do npm corrompido',
    ],
    solutions: [
      'Verifique a versão do Node.js: `node --version` (deve ser 18+)',
      'Limpe o cache do npm: `npm cache clean --force`',
      'Evite `npm install --force` como primeira opção (pode mascarar conflito de dependência)',
      'Delete node_modules e package-lock.json, então rode `npm install` de novo',
      'Se precisar usar `npm install --force`, trate como último recurso e confirme impacto antes',
      'No Windows/Mac, tente rodar o terminal como administrador',
    ],
  },
  {
    id: 'nextjs-port-already-in-use',
    title: 'Port 3000 already in use',
    icon: Terminal,
    category: 'Terminal',
    description: 'Quando você tenta rodar `npm run dev` mas a porta 3000 já está ocupada.',
    causes: [
      'Outro processo está rodando na porta 3000',
      'Um processo anterior não foi encerrado corretamente',
    ],
    solutions: [
      'Encontre o processo: `lsof -ti:3000` (Mac/Linux) ou `netstat -ano | findstr :3000` (Windows)',
      'Tente encerrar de forma suave primeiro (Ctrl+C no terminal que está rodando)',
      'Se necessário, finalize o processo: `kill -15 $(lsof -ti:3000)` (Mac/Linux) ou `taskkill /PID <PID>` (Windows)',
      'Use `kill -9` apenas como último recurso, depois de validar o processo correto',
      'Ou rode em outra porta: `PORT=3001 npm run dev`',
    ],
  },
  {
    id: 'module-not-found',
    title: 'Module not found',
    icon: Terminal,
    category: 'Terminal',
    description: 'Quando o React reclama que não consegue importar um arquivo.',
    causes: [
      'Caminho do arquivo está errado',
      'Você esqueceu de instalar a dependência',
      'Nome do arquivo está errado (maiúsculas/minúsculas)',
      'Extensão do arquivo está faltando',
    ],
    solutions: [
      'Verifique o caminho do import: está correto?',
      'Instale o pacote se necessário: `npm install nome-do-pacote`',
      'Verifique a ortografia do nome do arquivo (Mac/Linux são case-sensitive)',
      'Se for arquivo local, verifique a estrutura de pastas',
    ],
  },
  {
    id: 'eslint-errors',
    title: 'ESLint errors',
    icon: Terminal,
    category: 'Terminal',
    description: 'Erros de linting que impedem o build.',
    causes: [
      'Variável declarada mas não usada',
      'Imports desnecessários',
      'Problemas de formatação',
      'Uso de `any` no TypeScript',
    ],
    solutions: [
      'Leia o erro do ESLint - geralmente é bem específico',
      'Fix o que está apontado (variáveis não usadas, etc.)',
      'Se tiver certeza, adicione `// eslint-disable-next-line` na linha (evite fazer isso demais)',
      'Ou rode `npm run lint --fix` para auto-correir o que der',
    ],
  },
  {
    id: 'blank-white-screen',
    title: 'Tela branca (Blank Screen)',
    icon: Monitor,
    category: 'Navegador',
    description: 'Você abre o site mas aparece uma tela branca vazia.',
    causes: [
      'Erro de JavaScript impedindo o render',
      'Problema de rota',
      'Componente com erro não tratado',
      'CSS está quebrando tudo',
    ],
    solutions: [
      'Abra o console (F12) e veja se há erros vermelhos',
      'Verifique se a rota está correta no Next.js',
      'Adicione Error Boundaries para capturar erros de componentes',
      'Verifique se o CSS não está ocultando tudo (display: none)',
    ],
  },
  {
    id: 'react-hook-error',
    title: 'React Hook error',
    icon: Terminal,
    category: 'Terminal',
    description: 'React reclama de hooks sendo chamados fora do lugar certo.',
    causes: [
      'Hook chamado dentro de if/for/while',
      'Hook chamado fora do componente',
      'Hooks em ordem diferente entre renders',
    ],
    solutions: [
      'Hooks DEVEM ser chamados no topo do componente, antes de qualquer return',
      'Nunca chame hooks dentro de if/for/while',
      'Nunca chame hooks dentro de funções aninhadas',
      'A ordem dos hooks deve ser sempre a mesma',
    ],
  },
  {
    id: 'type-error',
    title: 'Type error',
    icon: Terminal,
    category: 'Terminal',
    description: 'TypeScript reclama de tipos incompatíveis.',
    causes: [
      'Variável com tipo errado',
      'Faltando tipagem',
      'Conflito de tipos',
      'Usando `any` de forma errada',
    ],
    solutions: [
      'Leia o erro do TypeScript - ele diz exatamente onde está o problema',
      'Defina o tipo da variável: `const x: string = ...`',
      'Use `as` para converter tipo (com cuidado): `x as string`',
      'Se o tipo for complexo, crie uma interface',
    ],
  },
  {
    id: 'cannot-read-property',
    title: 'Cannot read property of undefined',
    icon: Monitor,
    category: 'Navegador',
    description: 'Erro clássico quando você tenta acessar algo que não existe.',
    causes: [
      'Objeto está undefined',
      'Propriedade não existe',
      'API ainda não respondeu (loading)',
    ],
    solutions: [
      'Use optional chaining: `obj?.prop`',
      'Verifique se a API respondeu antes de usar: `if (data) ...`',
      'Adicione loading state enquanto espera a API',
      'Debug com console.log para ver o que tem no objeto',
    ],
  },
  {
    id: 'cors-error',
    title: 'CORS error',
    icon: Monitor,
    category: 'Navegador',
    description: 'O navegador bloqueia requisição para outra origem.',
    causes: [
      'Browser bloqueando cross-origin request',
      'API não permite acesso de origens externas',
    ],
    solutions: [
      'Configure CORS no backend da API',
      'Use um proxy durante desenvolvimento',
      'Se for API pública, verifique se ela permite requisições do frontend',
    ],
  },
  {
    id: 'image-optimization-failed',
    title: 'Next.js Image optimization failed',
    icon: Terminal,
    category: 'Terminal',
    description: 'O Next.js não consegue otimizar a imagem.',
    causes: [
      'URL externa sem lista de domínios permitidos',
      'Formato de imagem não suportado',
    ],
    solutions: [
      "Adicione o domínio ao next.config.mjs: `images: { domains: ['seu-dominio.com'] }`",
      'Use imagens otimizadas (JPEG, PNG, WebP, AVIF)',
      'Se for SVG, use um componente SVG em vez do tag <Image />',
    ],
  },
  {
    id: 'firebase-permission-denied',
    title: 'Firebase permission denied',
    icon: Terminal,
    category: 'Terminal',
    description: 'Firebase bloqueia acesso ao banco de dados.',
    causes: [
      'Regras RLS estão muito restritas',
      'Usuário não autenticado',
      'Path do banco está errado',
    ],
    solutions: [
      'Verifique as regras RLS no console do Firebase',
      'Certifique-se que o usuário está logado antes de acessar dados',
      'Verifique se o path está correto: `users/{userId}` não é `users/`',
      'Durante desenvolvimento, teste com regras mais permissivas (NUNCA em produção)',
    ],
  },
  {
    id: 'react-key-warning',
    title: 'React key warning',
    icon: Terminal,
    category: 'Terminal',
    description: 'React avisa que falta prop `key` em listas.',
    causes: [
      'Renderizando lista sem `key`',
      'Usando index como `key` (quando não apropriado)',
    ],
    solutions: [
      'Adicione `key={item.id}` em cada item do map',
      'Use ID único (do banco) em vez de index do array',
      'Se não tiver ID, crie um: `key={item.name}-${index}`',
    ],
  },
]

const CATEGORIES = ['all', 'Terminal', 'Navegador']

const CATEGORY_ICONS: Record<string, any> = {
  all: Wrench,
  Terminal: Terminal,
  'Navegador': Monitor,
}

export default function TroubleshootingPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // Filtrar erros por busca e categoria
  const filteredErrors = ERROR_GUIDES.filter(error => {
    const matchesSearch =
      error.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      error.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      error.causes.some(cause => cause.toLowerCase().includes(searchQuery.toLowerCase())) ||
      error.solutions.some(solution => solution.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory =
      selectedCategory === 'all' || error.category.toLowerCase() === selectedCategory.toLowerCase()

    return matchesSearch && matchesCategory
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 bg-warning-100 rounded-lg">
            <Wrench className="h-8 w-8 text-warning-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Troubleshooting</h1>
            <p className="text-gray-600 mt-1">O que fazer quando der erro</p>
          </div>
        </div>
      </div>

      <Alert
        type="info"
        message="Quando der erro, não entre em pânico! A maioria dos erros tem solução simples. Leia a mensagem do erro com atenção - geralmente ela diz exatamente o que está errado."
        className="mb-8"
      />

      <Alert
        type="warning"
        message="Antes de executar comandos agressivos (`--force`, `kill -9`, `rm -rf`), valide em Bandeiras Vermelhas ou use *comando para checar risco."
        className="mb-8"
      />

      {/* How to identify errors */}
      <div className="mb-8 bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Como identificar onde está o erro?</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3">
            <Terminal className="h-6 w-6 text-danger-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-gray-900">Erro no terminal?</h3>
              <p className="text-gray-600 text-sm">Geralmente aparece em vermelho com mensagem clara.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Monitor className="h-6 w-6 text-danger-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-gray-900">Erro no navegador?</h3>
              <p className="text-gray-600 text-sm">Abra o console (F12) para ver erros JavaScript.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <XCircle className="h-6 w-6 text-gray-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-gray-900">Tela branca?</h3>
              <p className="text-gray-600 text-sm">Provavelmente erro de JavaScript bloqueando render.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-6 w-6 text-gray-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-gray-900">Nada acontece?</h3>
              <p className="text-gray-600 text-sm">Verifique se clicou no botão certo e se há loading.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <SearchBar
          placeholder="Digite o erro ou sintoma..."
          onSearch={setSearchQuery}
        />
      </div>

      {/* Category Tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {CATEGORIES.map(category => {
          const Icon = CATEGORY_ICONS[category] || Wrench

          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                selectedCategory === category
                  ? 'bg-primary-600 text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-primary-50 hover:border-primary-300'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="capitalize">{category === 'all' ? 'Todos' : category}</span>
            </button>
          )
        })}
      </div>

      {/* Results count */}
      <div className="mb-6">
        <p className="text-gray-600">
          {filteredErrors.length === ERROR_GUIDES.length
            ? `Mostrando todos os ${ERROR_GUIDES.length} guias de erro`
            : `${filteredErrors.length} de ${ERROR_GUIDES.length} guias encontrados`}
        </p>
      </div>

      {/* Errors list */}
      {filteredErrors.length > 0 ? (
        <div className="space-y-6">
          {filteredErrors.map(error => {
            const ErrorIcon = error.icon

            return (
              <div
                key={error.id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-danger-100 rounded-lg">
                        <ErrorIcon className="h-5 w-5 text-danger-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{error.title}</h3>
                        <span className="inline-block mt-1 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                          {error.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-800">{error.description}</p>
                  </div>

                  {/* Causes */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1 text-warning-600" />
                      Possíveis causas
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      {error.causes.map((cause, index) => (
                        <li key={index}>{cause}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Solutions */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-1 text-success-600" />
                      Soluções
                    </h4>
                    <ol className="list-decimal list-inside space-y-2 text-gray-700">
                      {error.solutions.map((solution, index) => (
                        <li key={index}>
                          <span
                            className="prose"
                            dangerouslySetInnerHTML={{
                              __html: solution.replace(/`([^`]+)`/g, '<code>$1</code>'),
                            }}
                          />
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
          <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Nenhum erro encontrado
          </h3>
          <p className="text-gray-500">
            Tente buscar com outros termos ou filtrar por outra categoria.
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

      {/* Help section */}
      <Alert
        type="info"
        message="Não encontrou o erro aqui? Tente: 1) Ler a mensagem de erro com atenção, 2) Copiar a mensagem e colar no Google, 3) Perguntar em fóruns como Stack Overflow, 4) Pedir ajuda à IA explicando o erro."
        className="mt-8"
      />
    </div>
  )
}
