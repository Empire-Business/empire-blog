'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Sparkles,
  FileText,
  Type,
  FileSearch,
  Youtube,
  Instagram,
  ArrowLeft,
  Loader2,
  Copy,
  Check,
  Settings,
} from 'lucide-react'
import { toast } from 'sonner'

const AI_MODELS = [
  { id: 'google/gemini-2.0-flash-exp:free', name: 'Gemini 2.0 Flash (Grátis)', tier: 'free' },
  { id: 'google/gemini-2.5-pro-preview', name: 'Gemini 2.5 Pro', tier: 'pro' },
  { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', tier: 'pro' },
  { id: 'openai/gpt-4o-mini', name: 'GPT-4o Mini', tier: 'pro' },
  { id: 'openai/gpt-4o', name: 'GPT-4o', tier: 'pro' },
]

const TONES = [
  { id: 'professional', name: 'Profissional' },
  { id: 'casual', name: 'Casual' },
  { id: 'friendly', name: 'Amigável' },
  { id: 'formal', name: 'Formal' },
  { id: 'technical', name: 'Técnico' },
  { id: 'persuasive', name: 'Persuasivo' },
]

const WORD_COUNTS = [
  { id: 500, name: 'Curto (~500 palavras)' },
  { id: 1000, name: 'Médio (~1000 palavras)' },
  { id: 1500, name: 'Longo (~1500 palavras)' },
  { id: 2000, name: 'Muito longo (~2000 palavras)' },
]

export default function AIPage() {
  const [activeTab, setActiveTab] = useState<'generate' | 'transcribe'>('generate')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  // Generate form
  const [generateType, setGenerateType] = useState<'post' | 'title' | 'excerpt' | 'seo'>('post')
  const [prompt, setPrompt] = useState('')
  const [context, setContext] = useState('')
  const [generatedContent, setGeneratedContent] = useState('')

  // AI Settings
  const [selectedModel, setSelectedModel] = useState(AI_MODELS[0].id)
  const [selectedTone, setSelectedTone] = useState('professional')
  const [wordCount, setWordCount] = useState(1000)
  const [showSettings, setShowSettings] = useState(false)

  // Transcribe form
  const [videoUrl, setVideoUrl] = useState('')
  const [transcription, setTranscription] = useState('')

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Digite o prompt para geração')
      return
    }

    setLoading(true)
    setGeneratedContent('')

    try {
      const response = await fetch('/api/v1/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: generateType,
          prompt,
          context,
          model: selectedModel,
          tone: selectedTone,
          wordCount,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Erro na geração')
      }

      setGeneratedContent(result.data.content)
      toast.success('Conteúdo gerado com sucesso!')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro na geração')
    } finally {
      setLoading(false)
    }
  }

  const handleTranscribe = async () => {
    if (!videoUrl.trim()) {
      toast.error('Digite a URL do vídeo')
      return
    }

    setLoading(true)
    setTranscription('')

    try {
      const response = await fetch('/api/v1/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: videoUrl }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Erro na transcrição')
      }

      setTranscription(result.data.transcription)
      toast.success('Transcrição concluída!')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro na transcrição')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(id)
    toast.success('Copiado!')
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin"
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-accent-400" />
              Inteligência Artificial
            </h1>
            <p className="text-slate-400 mt-1">
              Gere conteúdo e transcreva vídeos com IA
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-700 pb-2">
        <button
          onClick={() => setActiveTab('generate')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'generate'
              ? 'bg-primary-500 text-white'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <FileText className="h-4 w-4 inline mr-2" />
          Gerar Conteúdo
        </button>
        <button
          onClick={() => setActiveTab('transcribe')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'transcribe'
              ? 'bg-primary-500 text-white'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Youtube className="h-4 w-4 inline mr-2" />
          Transcrever Vídeo
        </button>
      </div>

      {activeTab === 'generate' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input */}
          <div className="space-y-4">
            {/* AI Settings Toggle */}
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-medium">Configurações de IA</span>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="flex items-center gap-1 text-sm text-slate-400 hover:text-white"
              >
                <Settings className="h-4 w-4" />
                {showSettings ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>

            {/* Settings Panel */}
            {showSettings && (
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 space-y-4">
                <div>
                  <label className="text-slate-300 text-sm block mb-2">Modelo</label>
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm"
                  >
                    {AI_MODELS.map((model) => (
                      <option key={model.id} value={model.id}>
                        {model.name}
                      </option>
                    ))}
                  </select>
                </div>

                {generateType === 'post' && (
                  <>
                    <div>
                      <label className="text-slate-300 text-sm block mb-2">Tom de Voz</label>
                      <select
                        value={selectedTone}
                        onChange={(e) => setSelectedTone(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm"
                      >
                        {TONES.map((tone) => (
                          <option key={tone.id} value={tone.id}>
                            {tone.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-slate-300 text-sm block mb-2">Tamanho</label>
                      <select
                        value={wordCount}
                        onChange={(e) => setWordCount(parseInt(e.target.value))}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm"
                      >
                        {WORD_COUNTS.map((wc) => (
                          <option key={wc.id} value={wc.id}>
                            {wc.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                )}
              </div>
            )}

            <div>
              <label className="text-slate-300 font-medium block mb-2">
                Tipo de Geração
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'post', label: 'Artigo Completo', icon: FileText },
                  { value: 'title', label: 'Títulos', icon: Type },
                  { value: 'excerpt', label: 'Resumos', icon: FileSearch },
                  { value: 'seo', label: 'SEO', icon: FileSearch },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setGenerateType(option.value as typeof generateType)}
                    className={`flex items-center gap-2 p-3 rounded-lg transition-colors ${
                      generateType === option.value
                        ? 'bg-primary-500 text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <option.icon className="h-4 w-4" />
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-slate-300 font-medium block mb-2">
                {generateType === 'post'
                  ? 'Tema do Artigo'
                  : generateType === 'title'
                  ? 'Assunto para Títulos'
                  : generateType === 'excerpt'
                  ? 'Texto para Resumir'
                  : 'Conteúdo para Otimizar'}
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={
                  generateType === 'post'
                    ? 'Ex: Como criar uma estratégia de marketing digital eficiente'
                    : generateType === 'title'
                    ? 'Ex: Marketing digital para pequenas empresas'
                    : 'Digite o texto...'
                }
                rows={4}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:border-primary-500 focus:outline-none resize-none"
              />
            </div>

            {generateType === 'post' && (
              <div>
                <label className="text-slate-300 font-medium block mb-2">
                  Contexto Adicional (opcional)
                </label>
                <textarea
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="Informações extras, público-alvo, pontos-chave..."
                  rows={2}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:border-primary-500 focus:outline-none resize-none"
                />
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-accent-500 hover:bg-accent-600 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Sparkles className="h-5 w-5" />
              )}
              {loading ? 'Gerando...' : 'Gerar com IA'}
            </button>
          </div>

          {/* Output */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-slate-300 font-medium">Resultado</label>
              {generatedContent && (
                <button
                  onClick={() => handleCopy(generatedContent, 'generated')}
                  className="flex items-center gap-1 text-sm text-slate-400 hover:text-white"
                >
                  {copied === 'generated' ? (
                    <Check className="h-4 w-4 text-accent-400" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  {copied === 'generated' ? 'Copiado!' : 'Copiar'}
                </button>
              )}
            </div>
            <div className="min-h-[400px] bg-slate-800 border border-slate-700 rounded-lg p-4">
              {generatedContent ? (
                <pre className="whitespace-pre-wrap text-slate-200 text-sm">
                  {generatedContent}
                </pre>
              ) : (
                <p className="text-slate-500 text-center py-16">
                  O conteúdo gerado aparecerá aqui
                </p>
              )}
            </div>

            {generatedContent && generateType === 'post' && (
              <Link
                href="/admin/posts/new"
                className="mt-4 block text-center py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
              >
                Usar como Novo Post →
              </Link>
            )}
          </div>
        </div>
      )}

      {activeTab === 'transcribe' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input */}
          <div className="space-y-4">
            <div>
              <label className="text-slate-300 font-medium block mb-2">
                URL do Vídeo
              </label>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=... ou https://instagram.com/..."
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:border-primary-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-4 text-sm text-slate-400">
              <span className="flex items-center gap-1">
                <Youtube className="h-4 w-4 text-red-500" />
                YouTube
              </span>
              <span className="flex items-center gap-1">
                <Instagram className="h-4 w-4 text-pink-500" />
                Instagram
              </span>
            </div>

            <button
              onClick={handleTranscribe}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-accent-500 hover:bg-accent-600 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Youtube className="h-5 w-5" />
              )}
              {loading ? 'Transcrevendo...' : 'Transcrever Vídeo'}
            </button>
          </div>

          {/* Output */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-slate-300 font-medium">Transcrição</label>
              {transcription && (
                <button
                  onClick={() => handleCopy(transcription, 'transcription')}
                  className="flex items-center gap-1 text-sm text-slate-400 hover:text-white"
                >
                  {copied === 'transcription' ? (
                    <Check className="h-4 w-4 text-accent-400" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  {copied === 'transcription' ? 'Copiado!' : 'Copiar'}
                </button>
              )}
            </div>
            <div className="min-h-[300px] bg-slate-800 border border-slate-700 rounded-lg p-4">
              {transcription ? (
                <pre className="whitespace-pre-wrap text-slate-200 text-sm">
                  {transcription}
                </pre>
              ) : (
                <p className="text-slate-500 text-center py-12">
                  A transcrição aparecerá aqui
                </p>
              )}
            </div>

            {transcription && (
              <Link
                href="/admin/posts/new"
                className="mt-4 block text-center py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
              >
                Transformar em Post →
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
