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
} from 'lucide-react'

export default function AIPage() {
  const [activeTab, setActiveTab] = useState<'generate' | 'transcribe'>('generate')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  // Generate form
  const [generateType, setGenerateType] = useState<'post' | 'title' | 'excerpt' | 'seo'>('post')
  const [prompt, setPrompt] = useState('')
  const [context, setContext] = useState('')
  const [generatedContent, setGeneratedContent] = useState('')

  // Transcribe form
  const [videoUrl, setVideoUrl] = useState('')
  const [transcription, setTranscription] = useState('')

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      alert('Digite o prompt para geração')
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
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Erro na geração')
      }

      setGeneratedContent(result.data.content)
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Erro na geração')
    } finally {
      setLoading(false)
    }
  }

  const handleTranscribe = async () => {
    if (!videoUrl.trim()) {
      alert('Digite a URL do vídeo')
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
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Erro na transcrição')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
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
                  placeholder="Informações extras, público-alvo, tom de voz..."
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
                  onClick={() => handleCopy(generatedContent)}
                  className="flex items-center gap-1 text-sm text-slate-400 hover:text-white"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-accent-400" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  {copied ? 'Copiado!' : 'Copiar'}
                </button>
              )}
            </div>
            <div className="min-h-[300px] bg-slate-800 border border-slate-700 rounded-lg p-4">
              {generatedContent ? (
                <pre className="whitespace-pre-wrap text-slate-200 text-sm">
                  {generatedContent}
                </pre>
              ) : (
                <p className="text-slate-500 text-center py-12">
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
                  onClick={() => handleCopy(transcription)}
                  className="flex items-center gap-1 text-sm text-slate-400 hover:text-white"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-accent-400" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  {copied ? 'Copiado!' : 'Copiar'}
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
