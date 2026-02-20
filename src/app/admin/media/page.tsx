'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Image, Plus, Trash2, Copy, Check, Upload, Loader2 } from 'lucide-react'

interface Media {
  id: string
  filename: string
  original_name: string
  url: string
  type: string
  size: number
  alt_text: string | null
  created_at: string
}

export default function MediaPage() {
  const [media, setMedia] = useState<Media[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const supabase = createClient()

  const fetchMedia = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('media')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) {
      setMedia(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchMedia()
  }, [])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('Não autenticado')

      // Generate unique filename
      const ext = file.name.split('.').pop()
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const path = `uploads/${filename}`

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(path, file)

      if (uploadError) throw uploadError

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from('media').getPublicUrl(path)

      // Save to media table
      const { error: dbError } = await supabase.from('media').insert({
        filename,
        original_name: file.name,
        url: publicUrl,
        type: file.type.startsWith('image') ? 'image' : 'file',
        size: file.size,
        uploaded_by: user.id,
      })

      if (dbError) throw dbError

      fetchMedia()
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Erro no upload')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const handleDelete = async (item: Media) => {
    if (!confirm('Tem certeza que deseja excluir este arquivo?')) return

    try {
      // Delete from storage
      const path = item.url.split('/storage/v1/object/public/media/')[1]
      if (path) {
        await supabase.storage.from('media').remove([path])
      }

      // Delete from database
      const { error } = await supabase.from('media').delete().eq('id', item.id)

      if (error) throw error

      setMedia(media.filter((m) => m.id !== item.id))
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Erro ao excluir')
    }
  }

  const handleCopy = async (url: string, id: string) => {
    await navigator.clipboard.writeText(url)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Image className="h-6 w-6 text-primary-400" />
            Mídia
          </h1>
          <p className="text-slate-400 mt-1">Gerencie suas imagens e arquivos</p>
        </div>
        <label className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors cursor-pointer">
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          {uploading ? 'Enviando...' : 'Enviar Arquivo'}
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      ) : media.length === 0 ? (
        <div className="text-center py-12 bg-slate-800/50 border border-slate-700 rounded-lg">
          <Image className="h-12 w-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400">Nenhum arquivo enviado</p>
          <label className="inline-flex items-center gap-2 mt-3 text-primary-400 hover:text-primary-300 cursor-pointer">
            <Plus className="h-4 w-4" />
            Enviar primeiro arquivo
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="hidden"
            />
          </label>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {media.map((item) => (
            <div
              key={item.id}
              className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden group"
            >
              <div className="aspect-square bg-slate-700 relative">
                {item.type === 'image' ? (
                  <img
                    src={item.url}
                    alt={item.alt_text || item.original_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Image className="h-12 w-12 text-slate-500" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => handleCopy(item.url, item.id)}
                    className="p-2 bg-slate-800 rounded-lg text-white hover:bg-slate-700 transition-colors"
                    title="Copiar URL"
                  >
                    {copied === item.id ? (
                      <Check className="h-4 w-4 text-accent-400" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    className="p-2 bg-slate-800 rounded-lg text-red-400 hover:bg-slate-700 transition-colors"
                    title="Excluir"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="p-3">
                <p className="text-white text-sm truncate" title={item.original_name}>
                  {item.original_name}
                </p>
                <p className="text-slate-400 text-xs mt-1">
                  {formatSize(item.size)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
        <p className="text-slate-400 text-sm">
          Os arquivos são armazenados no Supabase Storage. Clique em uma imagem para
          copiar a URL ou excluí-la. Formatos aceitos: JPG, PNG, GIF, WebP.
        </p>
      </div>
    </div>
  )
}
