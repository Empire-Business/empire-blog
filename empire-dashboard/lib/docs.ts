/**
 * Funções para ler e parsear documentos markdown
 */

import tutorialData from '@/data/tutorial.generated.json'

export interface DocSection {
  id: string
  title: string
  content: string
}

export interface Term {
  id: string
  name: string
  definition: string
  analogy?: string
  example?: string
}

export interface RedFlag {
  id: string
  command: string
  category: string
  description: string
  risk: string
  safeAlternative: string
}

export interface ErrorGuide {
  id: string
  title: string
  description: string
  causes: string[]
  solutions: string[]
}

/**
 * Simula a leitura de arquivos markdown do docs/
 * Em produção, isso pode ser substituído por import estático ou fetch do GitHub
 */
export async function getDocContent(path: string): Promise<string> {
  // Em produção real, fazer fetch do GitHub ou importar arquivos
  return `Conteúdo de ${path}`
}

/**
 * Parse seções de um documento markdown
 */
export function parseDocSections(content: string): DocSection[] {
  const sections: DocSection[] = []
  const lines = content.split('\n')
  let currentSection: DocSection | null = null
  let currentContent: string[] = []

  for (const line of lines) {
    // Detectar headers (## ou ###)
    const headerMatch = line.match(/^(#{2,3})\s+(.+)$/)

    if (headerMatch) {
      // Salvar seção anterior
      if (currentSection) {
        currentSection.content = currentContent.join('\n').trim()
        sections.push(currentSection)
      }

      // Criar nova seção
      const level = headerMatch[1].length
      const title = headerMatch[2].trim()
      const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-')

      currentSection = {
        id,
        title,
        content: '',
      }
      currentContent = []
    } else if (currentSection) {
      currentContent.push(line)
    }
  }

  // Salvar última seção
  if (currentSection) {
    currentSection.content = currentContent.join('\n').trim()
    sections.push(currentSection)
  }

  return sections
}

/**
 * Extrair termos do glossário
 */
export function extractTerms(content: string): Term[] {
  const terms: Term[] = []
  const lines = content.split('\n')

  let currentTerm: Partial<Term> | null = null

  for (const line of lines) {
    // Detectar termo (### Termo - Definição)
    const termMatch = line.match(/^###\s+(.+?)\s*-\s*(.+)$/)

    if (termMatch) {
      if (currentTerm && currentTerm.name && currentTerm.definition) {
        terms.push({
          id: currentTerm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          name: currentTerm.name,
          definition: currentTerm.definition,
          analogy: currentTerm.analogy,
          example: currentTerm.example,
        })
      }

      currentTerm = {
        name: termMatch[1].trim(),
        definition: termMatch[2].trim(),
      }
    } else if (currentTerm) {
      if (line.startsWith('**Analogia:**')) {
        currentTerm.analogy = line.replace('**Analogia:**', '').trim()
      } else if (line.startsWith('**Exemplo:**')) {
        currentTerm.example = line.replace('**Exemplo:**', '').trim()
      }
    }
  }

  // Adicionar último termo
  if (currentTerm && currentTerm.name && currentTerm.definition) {
    terms.push({
      id: currentTerm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name: currentTerm.name,
      definition: currentTerm.definition,
      analogy: currentTerm.analogy,
      example: currentTerm.example,
    })
  }

  return terms
}

/**
 * Extrair bandeiras vermelhas
 */
export function extractRedFlags(content: string): RedFlag[] {
  const flags: RedFlag[] = []
  const lines = content.split('\n')

  let currentFlag: Partial<RedFlag> | null = null

  for (const line of lines) {
    // Detectar comando (### `comando` - Categoria)
    const commandMatch = line.match(/^###\s*`(.+?)`\s*-\s*(.+)$/)

    if (commandMatch) {
      if (currentFlag && currentFlag.command && currentFlag.category) {
        flags.push({
          id: currentFlag.command.replace(/[^a-z0-9]+/g, '-'),
          command: currentFlag.command,
          category: currentFlag.category,
          description: currentFlag.description || '',
          risk: currentFlag.risk || '',
          safeAlternative: currentFlag.safeAlternative || '',
        })
      }

      currentFlag = {
        command: commandMatch[1].trim(),
        category: commandMatch[2].trim(),
      }
    } else if (currentFlag) {
      if (line.startsWith('**O que faz:**')) {
        currentFlag.description = line.replace('**O que faz:**', '').trim()
      } else if (line.startsWith('**Perigo:**')) {
        currentFlag.risk = line.replace('**Perigo:**', '').trim()
      } else if (line.startsWith('**Alternativa segura:**')) {
        currentFlag.safeAlternative = line.replace('**Alternativa segura:**', '').trim()
      }
    }
  }

  // Adicionar última flag
  if (currentFlag && currentFlag.command && currentFlag.category) {
    flags.push({
      id: currentFlag.command.replace(/[^a-z0-9]+/g, '-'),
      command: currentFlag.command,
      category: currentFlag.category,
      description: currentFlag.description || '',
      risk: currentFlag.risk || '',
      safeAlternative: currentFlag.safeAlternative || '',
    })
  }

  return flags
}

/**
 * Extrair guias de erro
 */
export function extractErrorGuides(content: string): ErrorGuide[] {
  const guides: ErrorGuide[] = []
  const lines = content.split('\n')

  let currentGuide: Partial<ErrorGuide> | null = null
  let currentSection: 'causes' | 'solutions' | null = null

  for (const line of lines) {
    // Detectar erro (### Erro: Nome do erro)
    const errorMatch = line.match(/^###\s*Erro:\s*(.+)$/)

    if (errorMatch) {
      if (currentGuide && currentGuide.title) {
        guides.push({
          id: currentGuide.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          title: currentGuide.title,
          description: currentGuide.description || '',
          causes: currentGuide.causes || [],
          solutions: currentGuide.solutions || [],
        })
      }

      currentGuide = {
        title: errorMatch[1].trim(),
        causes: [],
        solutions: [],
      }
      currentSection = null
    } else if (currentGuide) {
      if (line.startsWith('**Descrição:**')) {
        currentGuide.description = line.replace('**Descrição:**', '').trim()
      } else if (line.startsWith('**Causas:**')) {
        currentSection = 'causes'
      } else if (line.startsWith('**Soluções:**')) {
        currentSection = 'solutions'
      } else if (line.startsWith('- ') && currentSection) {
        const item = line.substring(2)
        if (currentSection === 'causes') {
          currentGuide.causes?.push(item)
        } else if (currentSection === 'solutions') {
          currentGuide.solutions?.push(item)
        }
      }
    }
  }

  // Adicionar último guia
  if (currentGuide && currentGuide.title) {
    guides.push({
      id: currentGuide.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title: currentGuide.title,
      description: currentGuide.description || '',
      causes: currentGuide.causes || [],
      solutions: currentGuide.solutions || [],
    })
  }

  return guides
}

/**
 * Catálogo sincronizado de protocolos disponíveis
 * Fonte: scripts/generate-web-tutorial-data.mjs
 */
export const PROTOCOL_SECTIONS = tutorialData.protocols.map((protocol) => ({
  id: protocol.id.toLowerCase(),
  title: protocol.id,
  path: protocol.file,
}))
