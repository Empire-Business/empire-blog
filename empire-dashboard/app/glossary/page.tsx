'use client'

import { useState } from 'react'
import { BookOpen, Search, Info } from 'lucide-react'
import { SearchBar } from '@/components/SearchBar'
import { Alert } from '@/components/Alert'

// Dados do glossário (em produção, isso viria do arquivo vibe-coding/GLOSSARIO.md)
const GLOSSARY_TERMS = [
  {
    id: 'api',
    name: 'API',
    definition: 'Uma ponte que conecta dois programas de computador, permitindo que eles "conversem" entre si.',
    analogy: 'Como um garçom que leva o seu pedido para a cozinha e traz a comida de volta. Você não precisa saber como a comida é feita, só precisa do pedido.',
    example: 'Quando um app de clima mostra a temperatura, ele usa a API de um serviço de meteorologia.',
  },
  {
    id: 'banco-de-dados',
    name: 'Banco de Dados',
    definition: 'Um lugar organizado onde os computadores guardam informações importantes de forma estruturada.',
    analogy: 'Como uma biblioteca: em vez de jogar todos os livros no chão, eles são organizados em prateleiras com categorias.',
    example: 'Um app de notas guarda as suas notas em um banco de dados.',
  },
  {
    id: 'commit',
    name: 'Commit',
    definition: 'Salvar uma versão do seu código, como tirar uma foto do seu trabalho num momento específico.',
    analogy: 'Como salvar um documento no Word com um nome diferente (v1, v2, v3) para poder voltar a versões anteriores.',
    example: 'Antes de fazer uma mudança arriscada, você faz um commit para ter um ponto de retorno.',
  },
  {
    id: 'deploy',
    name: 'Deploy',
    definition: 'Colocar seu site no ar para que outras pessoas possam acessá-lo pela internet.',
    analogy: 'Como lançar um produto: você desenvolve em casa (local), e depois coloca na loja (deploy) para vender.',
    example: 'Depois de terminar seu site, você faz deploy para que ele fique em www.seusite.com.',
  },
  {
    id: 'env',
    name: 'Variáveis de Ambiente (.env)',
    definition: 'Um arquivo secreto que guarda informações sensíveis como senhas, chaves de API e configurações.',
    analogy: 'Como uma caixa forte: informações importantes guardadas em um lugar seguro, não expostas publicamente.',
    example: 'Chave de API do Stripe ou senha do banco de dados ficam no arquivo .env.',
  },
  {
    id: 'frontend',
    name: 'Frontend',
    definition: 'A parte do site que os usuários veem e interagem (botões, formulários, cores, layout).',
    analogy: 'A fachada e o interior de uma loja: o que você vê e usa como cliente.',
    example: 'O layout do Facebook, os botões, as cores - tudo isso é frontend.',
  },
  {
    id: 'backend',
    name: 'Backend',
    definition: 'A parte que não aparece visualmente, mas faz todo o trabalho pesado: processa dados, guarda no banco de dados, etc.',
    analogy: 'A cozinha de um restaurante: você não vê, mas é onde tudo é preparado.',
    example: 'Quando você faz login no Instagram, o backend verifica sua senha no banco de dados.',
  },
  {
    id: 'git',
    name: 'Git',
    definition: 'Um sistema que rastreia todas as mudanças no seu código, permitindo voltar atrás ou trabalhar em equipe.',
    analogy: 'Como um controle de versões super avançado para arquivos, lembrando cada mudança.',
    example: 'Você pode ver quem fez cada mudança no código e voltar a versões anteriores se algo der errado.',
  },
  {
    id: 'github',
    name: 'GitHub',
    definition: 'Um site onde você guarda seus projetos Git na nuvem, parecido com Google Drive para código.',
    analogy: 'Como Google Drive, mas especializado em código de programação.',
    example: 'Você guarda seu projeto no GitHub para poder acessar de qualquer computador.',
  },
  {
    id: 'npm',
    name: 'NPM',
    definition: 'Um "app store" de código pronto que você pode usar no seu projeto sem precisar criar do zero.',
    analogy: 'Como ir ao supermercado: em vez de fazer cada ingrediente do zero, você compra itens prontos.',
    example: 'Em vez de criar uma função para datas, você instala uma lib de datas via NPM.',
  },
  {
    id: 'terminal',
    name: 'Terminal',
    definition: 'Uma tela preta onde você digita comandos de texto para controlar o computador.',
    analogy: 'Como dar ordens ao computador usando apenas texto, sem usar o mouse.',
    example: 'Para rodar seu projeto, você digita `npm run dev` no terminal.',
  },
  {
    id: 'framework',
    name: 'Framework',
    definition: 'Um conjunto de ferramentas e regras prontas que ajudam a construir sites mais rápido.',
    analogy: 'Como montar um móvel IKEA: já vem com peças e instruções, você só precisa montar.',
    example: 'Next.js é um framework para criar sites com React.',
  },
  {
    id: 'requisicao',
    name: 'Requisição HTTP (Request)',
    definition: 'Quando seu navegador pede algo para um servidor (uma página, um dado, uma imagem).',
    analogy: 'Como enviar uma carta pedindo algo e receber a resposta de volta.',
    example: 'Quando você abre o Google, seu navegador faz uma requisição pedindo a página inicial.',
  },
  {
    id: 'componente',
    name: 'Componente',
    definition: 'Um pedaço de código reutilizável que representa uma parte da interface (botão, card, formulário).',
    analogy: 'Como blocos de LEGO: cada bloco tem uma função específica, e você monta coisas maiores usando eles.',
    example: 'Um botão de "Comprar" pode ser um componente usado em várias páginas.',
  },
  {
    id: 'estado',
    name: 'Estado (State)',
    definition: 'As informações que seu programa precisa lembrar momentaneamente (um nome digitado, se um menu está aberto, etc.).',
    analogy: 'A memória de curto prazo: o que você precisa lembrar agora para tomar uma decisão.',
    example: 'Se o usuário clicou no botão "Curtir", o estado precisa guardar que está "curtido".',
  },
  {
    id: 'hook',
    name: 'Hook (React)',
    definition: 'Funções especiais que permitem usar recursos do React (como estado) em componentes funcionais.',
    analogy: 'Ferramentas especiais que você pode conectar ao seu código para fazer coisas específicas.',
    example: 'useState é um hook que cria um estado para guardar informações.',
  },
  {
    id: 'props',
    name: 'Props',
    definition: 'Dados que você passa de um componente para outro (como argumentos de função).',
    analogy: 'Como passar ingredientes para um chef: ele precisa dos dados para fazer o trabalho.',
    example: 'Um Card componente recebe props como título e descrição.',
  },
  {
    id: 'json',
    name: 'JSON',
    definition: 'Um formato para organizar dados de forma que computadores possam ler facilmente.',
    analogy: 'Como uma planilha Excel super organizada que o computador entende.',
    example: 'Uma lista de produtos em JSON: `[{"nome": "Camisa", "preco": 50}]`.',
  },
  {
    id: 'promise',
    name: 'Promise',
    definition: 'Um objeto que representa um valor que pode não ter chegado ainda (como esperar uma resposta de API).',
    analogy: 'Como pedir uma pizza: você faz o pedido (promise) e espera a entrega (resultado).',
    example: 'Quando você busca dados de uma API, você recebe uma promise que vai resolver com os dados.',
  },
  {
    id: 'async-await',
    name: 'Async / Await',
    definition: 'Uma forma de lidar com operações que demoram (como API) sem travar o programa.',
    analogy: 'Como colocar o café para esfriar enquanto você faz outra coisa, e depois pegar quando estiver pronto.',
    example: 'await espera a API responder antes de continuar o código.',
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    definition: 'JavaScript com "régua e compasso": define tipos para evitar erros.',
    analogy: 'Como usar uma calculadora que te avisa se você tentar somar texto com número.',
    example: 'Se você define uma variável como número, o TypeScript avisa se tentar colocar texto.',
  },
  {
    id: 'middleware',
    name: 'Middleware',
    definition: 'Um código que fica no meio da comunicação entre duas partes, verificando ou modificando dados.',
    analogy: 'Como um porteiro: verifica se você pode entrar antes de deixá-lo acessar o prédio.',
    example: 'Um middleware de autenticação verifica se o usuário está logado antes de acessar uma página.',
  },
  {
    id: 'rota',
    name: 'Rota (Route)',
    definition: 'O caminho da URL que determina qual página ou conteúdo mostrar.',
    analogy: 'Como endereços de ruas: cada endereço leva a um lugar diferente.',
    example: '/about leva à página "Sobre", /contact leva à página "Contato".',
  },
  {
    id: 'css',
    name: 'CSS',
    definition: 'A linguagem que define como o site fica bonito (cores, tamanhos, espaçamentos, animações).',
    analogy: 'A decoração de interiores: os móveis existem, mas o CSS define como ficam dispostos e pintados.',
    example: 'Cor, tamanho da fonte, espaçamento - tudo isso é CSS.',
  },
  {
    id: 'tailwind',
    name: 'Tailwind CSS',
    definition: 'Um framework de CSS que usa classes prontas para estilizar rapidamente.',
    analogy: 'Como usar classes de CSS pré-fabricadas em vez de escrever cada regra manualmente.',
    example: 'bg-red-500 aplica cor de fundo vermelha com uma classe.',
  },
  {
    id: 'nextjs',
    name: 'Next.js',
    definition: 'Um framework React que facilita criar sites completos (frontend + backend) com recursos avançados.',
    analogy: 'Como um canivete suíço para React: tem tudo que você precisa em um só lugar.',
    example: 'Rotas, otimização, API routes - tudo built-in no Next.js.',
  },
  {
    id: 'vercel',
    name: 'Vercel',
    definition: 'Uma plataforma que automaticamente coloca seu site no ar (deploy) e atualiza quando você muda o código.',
    analogy: 'Como uma editora que automaticamente publica seu livro e atualiza cada revisão nova.',
    example: 'Você conecta seu GitHub ao Vercel e ele faz deploy automático.',
  },
  {
    id: 'eslint',
    name: 'ESLint',
    definition: 'Um programa que analisa seu código para encontrar erros e problemas de estilo.',
    analogy: 'Como um revisor de texto que marca erros gramaticais e sugere melhorias.',
    example: 'ESLint avisa se você declarou uma variável mas nunca usou.',
  },
  {
    id: 'prettier',
    name: 'Prettier',
    definition: 'Um formatador de código que automaticamente organiza seu código de forma bonita e consistente.',
    analogy: 'Como um personal organizer que arruma sua bagunça de forma padronizada.',
    example: 'Prettier coloca espaços, quebras de linha e formatação automaticamente.',
  },
  {
    id: 'testes',
    name: 'Testes',
    definition: 'Código que verifica se outras partes do código funcionam corretamente.',
    analogy: 'Como fazer um teste drive antes de comprar um carro para garantir que funciona.',
    example: 'Um teste verifica se a função de login realmente retorna "sucesso".',
  },
  {
    id: 'bug',
    name: 'Bug',
    definition: 'Um erro ou comportamento inesperado no programa que não funciona como deveria.',
    analogy: 'Como uma falha em um aparelho: ligou, mas não funcionou.',
    example: 'O botão deveria salvar, mas está apagando ao invés - isso é um bug.',
  },
  {
    id: 'log',
    name: 'Log',
    definition: 'Registros que o programa cria para mostrar o que aconteceu (erros, avisos, informações).',
    analogy: 'Como um diário: escreve tudo que aconteceu para poder consultar depois.',
    example: "console.log('Houve um erro') registra um aviso nos logs.",
  },
  {
    id: 'proxy',
    name: 'Proxy',
    definition: 'Um intermediário que faz requisições em nome de outro, geralmente para contornar restrições.',
    analogy: 'Como alguém que faz compras para você: você pede, ele vai comprar e entrega.',
    example: 'Um proxy pode evitar erro de CORS ao fazer requisições para outra API.',
  },
  {
    id: 'cors',
    name: 'CORS',
    definition: 'Uma regra de segurança que limita qual site pode fazer requisições para outro.',
    analogy: 'Como um sistema de permissão: sites diferentes pedem permissão para "conversar" entre si.',
    example: 'Se seu site tenta acessar dados de outro domínio sem permissão, dá erro de CORS.',
  },
]

const SUGGESTIONS = GLOSSARY_TERMS.map(t => t.name)

export default function GlossaryPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // Filtrar termos pela busca
  const filteredTerms = GLOSSARY_TERMS.filter(term => {
    const matchesSearch =
      term.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      term.definition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      term.analogy?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      term.example?.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesSearch
  })

  // Ordenar por relevância (nome começa com a query vem primeiro)
  const sortedTerms = [...filteredTerms].sort((a, b) => {
    const aStarts = a.name.toLowerCase().startsWith(searchQuery.toLowerCase())
    const bStarts = b.name.toLowerCase().startsWith(searchQuery.toLowerCase())

    if (aStarts && !bStarts) return -1
    if (!aStarts && bStarts) return 1
    return a.name.localeCompare(b.name)
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 bg-primary-100 rounded-lg">
            <BookOpen className="h-8 w-8 text-primary-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Glossário</h1>
            <p className="text-gray-600 mt-1">Termos técnicos explicados de forma simples</p>
          </div>
        </div>
      </div>

      <Alert
        type="info"
        title="Como usar o glossário"
        message="Use a busca para encontrar termos específicos, ou navegue pela lista alfabética. Cada termo tem uma definição simples, uma analogia do dia a dia e um exemplo prático."
        className="mb-8"
      />

      {/* Search */}
      <div className="mb-8">
        <SearchBar
          placeholder="Buscar termo técnico..."
          suggestions={SUGGESTIONS}
          onSearch={setSearchQuery}
        />
      </div>

      {/* Results count */}
      <div className="mb-6">
        <p className="text-gray-600">
          {sortedTerms.length === GLOSSARY_TERMS.length
            ? `Mostrando todos os ${GLOSSARY_TERMS.length} termos`
            : `${sortedTerms.length} de ${GLOSSARY_TERMS.length} termos encontrados`}
        </p>
      </div>

      {/* Terms list */}
      {sortedTerms.length > 0 ? (
        <div className="grid gap-6">
          {sortedTerms.map(term => (
            <div
              key={term.id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                {term.name}
                <Info className="ml-3 h-5 w-5 text-primary-600" />
              </h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-1">Definição</h3>
                  <p className="text-gray-800">{term.definition}</p>
                </div>

                {term.analogy && (
                  <div className="bg-primary-50 border-l-4 border-primary-500 pl-4">
                    <h3 className="text-sm font-semibold text-primary-800 mb-1">
                      💡 Analogia do dia a dia
                    </h3>
                    <p className="text-primary-900">{term.analogy}</p>
                  </div>
                )}

                {term.example && (
                  <div className="bg-gray-50 border-l-4 border-gray-400 pl-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-1">
                      📌 Exemplo prático
                    </h3>
                    <p className="text-gray-800">{term.example}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
          <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Nenhum termo encontrado
          </h3>
          <p className="text-gray-500">
            Tente buscar com outros termos ou veja a lista completa.
          </p>
          <button
            onClick={() => setSearchQuery('')}
            className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Limpar busca
          </button>
        </div>
      )}
    </div>
  )
}
