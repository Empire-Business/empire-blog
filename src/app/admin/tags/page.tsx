'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Edit, Trash2, Tags } from 'lucide-react'

interface Tag {
  slug: string
  name: string
  created_at: string
}

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingTag, setEditingTag] = useState<Tag | null>(null)
  const [formName, setFormName] = useState('')
  const [saving, setSaving] = useState(false)

  const supabase = createClient()

  const fetchTags = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('tags').select('*').order('name')

    if (!error && data) {
      setTags(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchTags()
  }, [])

  const openModal = (tag?: Tag) => {
    if (tag) {
      setEditingTag(tag)
      setFormName(tag.name)
    } else {
      setEditingTag(null)
      setFormName('')
    }
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!formName.trim()) {
      alert('O nome é obrigatório')
      return
    }

    setSaving(true)

    const slug = formName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    if (editingTag) {
      const { error } = await supabase
        .from('tags')
        .update({ name: formName, slug })
        .eq('slug', editingTag.slug)

      if (error) {
        alert('Erro ao atualizar: ' + error.message)
        setSaving(false)
        return
      }
    } else {
      const { error } = await supabase.from('tags').insert({
        name: formName,
        slug,
      })

      if (error) {
        alert('Erro ao criar: ' + error.message)
        setSaving(false)
        return
      }
    }

    setSaving(false)
    setShowModal(false)
    fetchTags()
  }

  const handleDelete = async (slug: string) => {
    if (!confirm('Tem certeza que deseja excluir esta tag?')) return

    const { error } = await supabase.from('tags').delete().eq('slug', slug)

    if (error) {
      alert('Erro ao excluir: ' + error.message)
      return
    }

    setTags(tags.filter((t) => t.slug !== slug))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Tags</h1>
          <p className="text-slate-400 mt-1">Gerencie as tags dos posts</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4" />
          Nova Tag
        </button>
      </div>

      {/* Tags list */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      ) : tags.length === 0 ? (
        <div className="text-center py-12 bg-slate-800/50 border border-slate-700 rounded-lg">
          <Tags className="h-12 w-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400">Nenhuma tag criada</p>
          <button
            onClick={() => openModal()}
            className="inline-block mt-3 text-primary-400 hover:text-primary-300"
          >
            Criar primeira tag →
          </button>
        </div>
      ) : (
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <div className="flex flex-wrap gap-3">
            {tags.map((tag) => (
              <div
                key={tag.slug}
                className="flex items-center gap-2 px-3 py-2 bg-slate-700/50 rounded-lg group"
              >
                <span className="text-white">{tag.name}</span>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openModal(tag)}
                    className="p-1 text-slate-400 hover:text-white transition-colors"
                    title="Editar"
                  >
                    <Edit className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => handleDelete(tag.slug)}
                    className="p-1 text-slate-400 hover:text-red-400 transition-colors"
                    title="Excluir"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold text-white mb-4">
              {editingTag ? 'Editar Tag' : 'Nova Tag'}
            </h2>

            <div>
              <label className="text-slate-300 text-sm block mb-1">Nome</label>
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Nome da tag..."
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:border-primary-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-slate-300 hover:text-white transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {saving ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
