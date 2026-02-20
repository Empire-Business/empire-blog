'use client'

import { useMemo } from 'react'

interface SEOScoreProps {
  title: string
  metaTitle: string
  metaDescription: string
  content: string
  slug: string
  featuredImage: string
}

interface ScoreResult {
  score: number
  issues: { type: 'error' | 'warning' | 'success'; message: string }[]
}

export function calculateSEOScore(data: SEOScoreProps): ScoreResult {
  const issues: ScoreResult['issues'] = []
  let score = 100

  // Title checks
  const title = data.metaTitle || data.title
  if (!title) {
    issues.push({ type: 'error', message: 'Adicione um título' })
    score -= 15
  } else if (title.length < 30) {
    issues.push({ type: 'warning', message: 'Título muito curto (mín. 30 caracteres)' })
    score -= 5
  } else if (title.length > 60) {
    issues.push({ type: 'warning', message: 'Título muito longo (máx. 60 caracteres)' })
    score -= 5
  } else {
    issues.push({ type: 'success', message: 'Título com tamanho ideal' })
  }

  // Meta description checks
  if (!data.metaDescription) {
    issues.push({ type: 'error', message: 'Adicione uma meta descrição' })
    score -= 15
  } else if (data.metaDescription.length < 120) {
    issues.push({ type: 'warning', message: 'Meta descrição curta (mín. 120 caracteres)' })
    score -= 5
  } else if (data.metaDescription.length > 160) {
    issues.push({ type: 'warning', message: 'Meta descrição longa (máx. 160 caracteres)' })
    score -= 5
  } else {
    issues.push({ type: 'success', message: 'Meta descrição com tamanho ideal' })
  }

  // Content checks
  const wordCount = data.content?.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length || 0
  if (wordCount < 300) {
    issues.push({ type: 'error', message: `Conteúdo muito curto (${wordCount} palavras, mín. 300)` })
    score -= 15
  } else if (wordCount < 600) {
    issues.push({ type: 'warning', message: `Conteúdo poderia ser maior (${wordCount} palavras)` })
    score -= 5
  } else {
    issues.push({ type: 'success', message: `Conteúdo com bom tamanho (${wordCount} palavras)` })
  }

  // Slug checks
  if (!data.slug) {
    issues.push({ type: 'error', message: 'URL/slug não definida' })
    score -= 10
  } else if (data.slug.length > 75) {
    issues.push({ type: 'warning', message: 'URL muito longa' })
    score -= 5
  } else {
    issues.push({ type: 'success', message: 'URL bem estruturada' })
  }

  // Featured image check
  if (!data.featuredImage) {
    issues.push({ type: 'warning', message: 'Adicione uma imagem de destaque' })
    score -= 10
  } else {
    issues.push({ type: 'success', message: 'Imagem de destaque configurada' })
  }

  // Headings check
  const h2Count = (data.content?.match(/<h2/gi) || []).length
  const h3Count = (data.content?.match(/<h3/gi) || []).length
  if (h2Count === 0 && wordCount > 300) {
    issues.push({ type: 'warning', message: 'Adicione subtítulos (H2) ao conteúdo' })
    score -= 5
  } else if (h2Count > 0) {
    issues.push({ type: 'success', message: `${h2Count} subtítulo(s) encontrado(s)` })
  }

  // Internal links check
  const linkCount = (data.content?.match(/<a /gi) || []).length
  if (linkCount === 0 && wordCount > 300) {
    issues.push({ type: 'warning', message: 'Considere adicionar links internos' })
    score -= 5
  } else if (linkCount > 0) {
    issues.push({ type: 'success', message: `${linkCount} link(s) no conteúdo` })
  }

  return {
    score: Math.max(0, Math.min(100, score)),
    issues,
  }
}

export function SEOScore({ title, metaTitle, metaDescription, content, slug, featuredImage }: SEOScoreProps) {
  const result = useMemo(() => {
    return calculateSEOScore({ title, metaTitle, metaDescription, content, slug, featuredImage })
  }, [title, metaTitle, metaDescription, content, slug, featuredImage])

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-accent-400'
    if (score >= 60) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-accent-500/10 border-accent-500/20'
    if (score >= 60) return 'bg-yellow-500/10 border-yellow-500/20'
    return 'bg-red-500/10 border-red-500/20'
  }

  return (
    <div className="space-y-4">
      {/* Score Circle */}
      <div className={`p-4 rounded-lg border ${getScoreBg(result.score)}`}>
        <div className="flex items-center justify-between">
          <span className="text-slate-300 text-sm">SEO Score</span>
          <span className={`text-2xl font-bold ${getScoreColor(result.score)}`}>
            {result.score}
          </span>
        </div>
        <div className="mt-2 h-2 bg-slate-700 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              result.score >= 80 ? 'bg-accent-500' : result.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${result.score}%` }}
          />
        </div>
      </div>

      {/* Issues List */}
      <div className="space-y-2">
        {result.issues.map((issue, index) => (
          <div
            key={index}
            className={`flex items-start gap-2 text-xs p-2 rounded ${
              issue.type === 'error'
                ? 'bg-red-500/10 text-red-400'
                : issue.type === 'warning'
                ? 'bg-yellow-500/10 text-yellow-400'
                : 'bg-accent-500/10 text-accent-400'
            }`}
          >
            <span>
              {issue.type === 'error' ? '✗' : issue.type === 'warning' ? '⚠' : '✓'}
            </span>
            <span>{issue.message}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function GooglePreview({ title, metaDescription, slug }: { title: string; metaDescription: string; slug: string }) {
  const previewTitle = metaDescription || title || 'Título do post'
  const previewUrl = `empire.blog/${slug || 'post-slug'}`

  return (
    <div className="bg-white rounded-lg p-4 text-sm">
      <p className="text-xs text-gray-500 mb-1">Preview no Google</p>

      {/* Google result preview */}
      <div className="space-y-1">
        <div className="text-[#1a0dab] text-lg truncate">
          {title || 'Título do post'}
        </div>
        <div className="text-[#006621] text-xs truncate">
          {previewUrl}
        </div>
        <div className="text-[#545454] text-sm line-clamp-2">
          {metaDescription || 'Clique para editar a meta descrição...'}
        </div>
      </div>
    </div>
  )
}
