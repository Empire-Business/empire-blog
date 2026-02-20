'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Edit, Trash2, FolderOpen } from 'lucide-react'

interface Category {
  slug: string
  name: string
  description: string | null
  created_at: string
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formName, setFormName] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [saving, setSaving] = useState(false)

  const supabase = createClient()

  const fetchCategories = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name')

    if (!error && data) {
      setCategories(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const openModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category)
      setFormName(category.name)
      setFormDescription(category.description || '')
    } else {
      setEditingCategory(null)
      setFormName('')
      setFormDescription('')
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

    if (editingCategory) {
      const { error } = await supabase
        .from('categories')
        .update({
          name: formName,
          slug,
          description: formDescription || null,
        })
        .eq('slug', editingCategory.slug)

      if (error) {
        alert('Erro ao atualizar: ' + error.message)
        setSaving(false)
        return
      }
    } else {
      const { error } = await supabase.from('categories').insert({
        name: formName,
        slug,
        description: formDescription || null,
      })

      if (error) {
        alert('Erro ao criar: ' + error.message)
        setSaving(false)
        return
      }
    }

    setSaving(false)
    setShowModal(false)
    fetchCategories()
  }

  const handleDelete = async (slug: string) => {
    if (!confirm('Tem certeza que deseja excluir esta categoria?')) return

    const { error } = await supabase.from('categories').delete().eq('slug', slug)

    if (error) {
      alert('Erro ao excluir: ' + error.message)
      return
    }

    setCategories(categories.filter((c) => c.slug !== slug))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Categorias</h1>
          <p className="text-slate-400 mt-1">Organize seus posts por categoria</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4" />
          Nova Categoria
        </button>
      </div>

      {/* Categories list */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-12 bg-slate-800/50 border border-slate-700 rounded-lg">
          <FolderOpen className="h-12 w-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400">Nenhuma categoria criada</p>
          <button
            onClick={() => openModal()}
            className="inline-block mt-3 text-primary-400 hover:text-primary-300"
          >
            Criar primeira categoria →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <div
              key={category.slug}
              className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:border-slate-600 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-white font-medium">{category.name}</h3>
                  <p className="text-slate-400 text-sm mt-1 line-clamp-2">
                    {category.description || 'Sem descrição'}
                  </p>
                  <p className="text-slate-500 text-xs mt-2">
                    Slug: {category.slug}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openModal(category)}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors"
                    title="Editar"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(category.slug)}
                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded transition-colors"
                    title="Excluir"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold text-white mb-4">
              {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-slate-300 text-sm block mb-1">Nome</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Nome da categoria..."
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:border-primary-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-300 text-sm block mb-1">
                  Descrição
                </label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Descrição da categoria..."
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:border-primary-500 focus:outline-none resize-none"
                />
              </div>
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
