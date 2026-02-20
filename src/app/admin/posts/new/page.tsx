'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import TiptapEditor from '@/components/editor/TiptapEditor'
import { SEOScore, GooglePreview } from '@/components/seo/SEOScore'
import { ArrowLeft, Save, Sparkles, Loader2, Calendar, Eye } from 'lucide-react'
import { toast } from 'sonner'

interface Category {
  slug: string
  name: string
}

interface Tag {
  slug: string
  name: string
}

export default function NewPostPage() {
  const router = useRouter()
  const supabase = createClient()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [categorySlug, setCategorySlug] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [featuredImage, setFeaturedImage] = useState('')
  const [metaTitle, setMetaTitle] = useState('')
  const [metaDescription, setMetaDescription] = useState('')
  const [status, setStatus] = useState<'draft' | 'published' | 'scheduled'>('draft')
  const [showSEOPreview, setShowSEOPreview] = useState(false)
  const [scheduledAt, setScheduledAt] = useState('')

  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const [catRes, tagRes] = await Promise.all([
        supabase.from('categories').select('slug, name').order('name'),
        supabase.from('tags').select('slug, name').order('name'),
      ])
      if (catRes.data) setCategories(catRes.data)
      if (tagRes.data) setTags(tagRes.data)
    }
    fetchData()
  }, [supabase])

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('O título é obrigatório')
      return
    }

    if (status === 'scheduled' && !scheduledAt) {
      toast.error('Defina a data de agendamento')
      return
    }

    setLoading(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      toast.error('Você precisa estar logado')
      setLoading(false)
      return
    }

    const slug = generateSlug(title)
    const wordCount = content.split(/\s+/).filter(Boolean).length
    const readTime = Math.max(1, Math.ceil(wordCount / 200))
    const autoExcerpt = excerpt || content.replace(/<[^>]*>/g, '').slice(0, 160) + '...'

    const isPublished = status === 'published'
    const isScheduled = status === 'scheduled'

    const { error } = await supabase.from('posts').insert({
      title,
      slug,
      content,
      excerpt: autoExcerpt,
      featured_image: featuredImage || null,
      category_slug: categorySlug || null,
      tag_slugs: selectedTags,
      author_id: user.id,
      status: isScheduled ? 'draft' : status,
      meta_title: metaTitle || title,
      meta_description: metaDescription || autoExcerpt,
      read_time: readTime,
      published_at: isPublished ? new Date().toISOString() : null,
      scheduled_at: isScheduled ? new Date(scheduledAt).toISOString() : null,
    })

    setLoading(false)

    if (error) {
      toast.error('Erro ao salvar: ' + error.message)
      return
    }

    if (isScheduled) {
      toast.success('Post agendado com sucesso!')
    } else if (isPublished) {
      toast.success('Post publicado com sucesso!')
    } else {
      toast.success('Rascunho salvo com sucesso!')
    }

    router.push('/admin/posts')
  }

  const generateWithAI = async (type: 'content' | 'title' | 'excerpt' | 'seo') => {
    if (type === 'content' && !title) {
      toast.error('Digite um título primeiro para gerar o conteúdo')
      return
    }
    if ((type === 'excerpt' || type === 'seo') && !content) {
      toast.error('Escreva o conteúdo primeiro')
      return
    }

    setAiLoading(true)
    const loadingToast = toast.loading('Gerando com IA...')

    try {
      const response = await fetch('/api/v1/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: type === 'content' ? 'post' : type,
          prompt: title,
          content,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Erro na geração')
      }

      if (type === 'content') {
        setContent(result.data.content)
        toast.success('Conteúdo gerado com sucesso!')
      } else if (type === 'title') {
        const titles = result.data.content.split('\n').filter(Boolean)
        if (titles.length > 0) setTitle(titles[0].replace(/^\d+\.\s*/, ''))
        toast.success('Títulos gerados!')
      } else if (type === 'excerpt') {
        setExcerpt(result.data.content)
        toast.success('Resumo gerado com sucesso!')
      } else if (type === 'seo') {
        try {
          const seo = JSON.parse(result.data.content)
          if (seo.meta_title) setMetaTitle(seo.meta_title)
          if (seo.meta_description) setMetaDescription(seo.meta_description)
          toast.success('SEO preenchido automaticamente!')
        } catch {
          setMetaDescription(result.data.content)
          toast.success('Meta descrição gerada!')
        }
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro na geração')
    } finally {
      toast.dismiss(loadingToast)
      setAiLoading(false)
    }
  }

  const toggleTag = (slug: string) => {
    setSelectedTags((prev) =>
      prev.includes(slug) ? prev.filter((t) => t !== slug) : [...prev, slug]
    )
  }

  // Minimum datetime for scheduling (1 hour from now)
  const minScheduleDate = new Date(Date.now() + 60 * 60 * 1000)
    .toISOString()
    .slice(0, 16)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/posts"
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">Novo Post</h1>
            <p className="text-slate-400 mt-1">Crie um novo artigo</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as 'draft' | 'published' | 'scheduled')}
            className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
          >
            <option value="draft">Rascunho</option>
            <option value="published">Publicar agora</option>
            <option value="scheduled">Agendar</option>
          </select>
          {status === 'scheduled' && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-slate-400" />
              <input
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                min={minScheduleDate}
                className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm"
              />
            </div>
          )}
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {status === 'scheduled' ? 'Agendar' : status === 'published' ? 'Publicar' : 'Salvar'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-slate-300 font-medium">Título</label>
              <button
                type="button"
                onClick={() => generateWithAI('title')}
                disabled={aiLoading}
                className="flex items-center gap-1 text-sm text-accent-400 hover:text-accent-300 disabled:opacity-50"
              >
                <Sparkles className="h-3 w-3" />
                Gerar com IA
              </button>
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite o título do post..."
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white text-lg placeholder:text-slate-500 focus:border-primary-500 focus:outline-none"
            />
          </div>

          {/* Content */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-slate-300 font-medium">Conteúdo</label>
              <button
                type="button"
                onClick={() => generateWithAI('content')}
                disabled={aiLoading}
                className="flex items-center gap-1 text-sm text-accent-400 hover:text-accent-300 disabled:opacity-50"
              >
                <Sparkles className="h-3 w-3" />
                Gerar com IA
              </button>
            </div>
            <TiptapEditor
              content={content}
              onChange={setContent}
              placeholder="Escreva seu conteúdo aqui..."
            />
          </div>

          {/* Excerpt */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-slate-300 font-medium">Resumo</label>
              <button
                type="button"
                onClick={() => generateWithAI('excerpt')}
                disabled={aiLoading}
                className="flex items-center gap-1 text-sm text-accent-400 hover:text-accent-300 disabled:opacity-50"
              >
                <Sparkles className="h-3 w-3" />
                Gerar com IA
              </button>
            </div>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Resumo do post (usado em previews e SEO)..."
              rows={3}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:border-primary-500 focus:outline-none resize-none"
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Featured Image */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
            <label className="text-slate-300 font-medium block mb-2">
              Imagem de Destaque
            </label>
            <input
              type="text"
              value={featuredImage}
              onChange={(e) => setFeaturedImage(e.target.value)}
              placeholder="URL da imagem..."
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm placeholder:text-slate-500 focus:border-primary-500 focus:outline-none"
            />
            {featuredImage && (
              <img
                src={featuredImage}
                alt="Preview"
                className="mt-3 w-full h-32 object-cover rounded-lg"
              />
            )}
          </div>

          {/* Category */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
            <label className="text-slate-300 font-medium block mb-2">
              Categoria
            </label>
            <select
              value={categorySlug}
              onChange={(e) => setCategorySlug(e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
            >
              <option value="">Selecione...</option>
              {categories.map((cat) => (
                <option key={cat.slug} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
            <label className="text-slate-300 font-medium block mb-2">Tags</label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag.slug}
                  type="button"
                  onClick={() => toggleTag(tag.slug)}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    selectedTags.includes(tag.slug)
                      ? 'bg-primary-500 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>

          {/* SEO */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <label className="text-slate-300 font-medium">SEO</label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowSEOPreview(!showSEOPreview)}
                  className="flex items-center gap-1 text-sm text-slate-400 hover:text-white"
                >
                  <Eye className="h-3 w-3" />
                  {showSEOPreview ? 'Ocultar' : 'Preview'}
                </button>
                <button
                  type="button"
                  onClick={() => generateWithAI('seo')}
                  disabled={aiLoading}
                  className="flex items-center gap-1 text-sm text-accent-400 hover:text-accent-300 disabled:opacity-50"
                >
                  <Sparkles className="h-3 w-3" />
                  Gerar
                </button>
              </div>
            </div>

            {/* SEO Score */}
            <div className="mb-4">
              <SEOScore
                title={title}
                metaTitle={metaTitle}
                metaDescription={metaDescription}
                content={content}
                slug={title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}
                featuredImage={featuredImage}
              />
            </div>

            {/* Google Preview */}
            {showSEOPreview && (
              <div className="mb-4">
                <GooglePreview
                  title={metaTitle || title}
                  metaDescription={metaDescription}
                  slug={title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}
                />
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="text-slate-400 text-sm block mb-1">
                  Meta Título
                </label>
                <input
                  type="text"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder="Título para SEO..."
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm placeholder:text-slate-500 focus:border-primary-500 focus:outline-none"
                />
                <p className="text-xs text-slate-500 mt-1">{metaTitle.length}/60 caracteres</p>
              </div>
              <div>
                <label className="text-slate-400 text-sm block mb-1">
                  Meta Descrição
                </label>
                <textarea
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="Descrição para SEO..."
                  rows={2}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm placeholder:text-slate-500 focus:border-primary-500 focus:outline-none resize-none"
                />
                <p className="text-xs text-slate-500 mt-1">{metaDescription.length}/160 caracteres</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
