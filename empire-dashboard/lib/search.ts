/**
 * Funções de busca para a documentação
 */

import type { Term, RedFlag, ErrorGuide } from './docs'

/**
 * Busca termos no glossário
 */
export function searchTerms(terms: Term[], query: string): Term[] {
  const lowerQuery = query.toLowerCase()

  return terms.filter(term =>
    term.name.toLowerCase().includes(lowerQuery) ||
    term.definition.toLowerCase().includes(lowerQuery) ||
    term.analogy?.toLowerCase().includes(lowerQuery) ||
    term.example?.toLowerCase().includes(lowerQuery)
  )
}

/**
 * Busca bandeiras vermelhas por comando
 */
export function searchFlags(flags: RedFlag[], query: string): RedFlag[] {
  const lowerQuery = query.toLowerCase()

  return flags.filter(flag =>
    flag.command.toLowerCase().includes(lowerQuery) ||
    flag.category.toLowerCase().includes(lowerQuery) ||
    flag.description.toLowerCase().includes(lowerQuery)
  )
}

/**
 * Busca guias de erro por nome
 */
export function searchErrors(errors: ErrorGuide[], query: string): ErrorGuide[] {
  const lowerQuery = query.toLowerCase()

  return errors.filter(error =>
    error.title.toLowerCase().includes(lowerQuery) ||
    error.description.toLowerCase().includes(lowerQuery) ||
    error.causes.some(cause => cause.toLowerCase().includes(lowerQuery)) ||
    error.solutions.some(solution => solution.toLowerCase().includes(lowerQuery))
  )
}

/**
 * Highlight de texto com query
 */
export function highlightText(text: string, query: string): string {
  if (!query) return text

  const lowerText = text.toLowerCase()
  const lowerQuery = query.toLowerCase()
  const index = lowerText.indexOf(lowerQuery)

  if (index === -1) return text

  const before = text.substring(0, index)
  const match = text.substring(index, index + query.length)
  const after = text.substring(index + query.length)

  return `${before}<mark class="bg-yellow-200 px-0.5 rounded">${match}</mark>${after}`
}

/**
 * Sugere termos enquanto digita
 */
export function suggestTerms(terms: Term[], query: string): string[] {
  const lowerQuery = query.toLowerCase()

  return terms
    .filter(term => term.name.toLowerCase().startsWith(lowerQuery))
    .slice(0, 5)
    .map(term => term.name)
}

/**
 * Filtra bandeiras vermelhas por categoria
 */
export function filterFlagsByCategory(flags: RedFlag[], category: string | null): RedFlag[] {
  if (!category) return flags

  return flags.filter(flag => flag.category.toLowerCase() === category.toLowerCase())
}

/**
 * Lista de categorias de bandeiras vermelhas
 */
export function getFlagCategories(flags: RedFlag[]): string[] {
  const categories = new Set(flags.map(flag => flag.category))
  return Array.from(categories).sort()
}

/**
 * Calcula relevância de um termo para a query
 */
export function calculateRelevance(term: Term, query: string): number {
  const lowerQuery = query.toLowerCase()
  const lowerName = term.name.toLowerCase()
  const lowerDefinition = term.definition.toLowerCase()

  let score = 0

  // Nome começa com query
  if (lowerName.startsWith(lowerQuery)) {
    score += 10
  }

  // Nome contém query
  if (lowerName.includes(lowerQuery)) {
    score += 5
  }

  // Definição contém query
  if (lowerDefinition.includes(lowerQuery)) {
    score += 2
  }

  // Analogia contém query
  if (term.analogy?.toLowerCase().includes(lowerQuery)) {
    score += 1
  }

  return score
}

/**
 * Ordena termos por relevância
 */
export function sortByRelevance(terms: Term[], query: string): Term[] {
  return [...terms].sort((a, b) => {
    const scoreA = calculateRelevance(a, query)
    const scoreB = calculateRelevance(b, query)

    return scoreB - scoreA
  })
}

/**
 * Busca geral em todo o conteúdo
 */
export function searchAll(
  terms: Term[],
  flags: RedFlag[],
  errors: ErrorGuide[],
  query: string
): {
  terms: Term[]
  flags: RedFlag[]
  errors: ErrorGuide[]
} {
  return {
    terms: searchTerms(terms, query),
    flags: searchFlags(flags, query),
    errors: searchErrors(errors, query),
  }
}
