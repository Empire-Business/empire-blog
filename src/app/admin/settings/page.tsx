'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Settings, Save, Loader2 } from 'lucide-react'

interface UserProfile {
  id: string
  email: string
  name: string | null
  role: string | null
  avatar_url: string | null
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formName, setFormName] = useState('')
  const [formAvatar, setFormAvatar] = useState('')
  const supabase = createClient()

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { data } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()

        if (data) {
          setProfile(data)
          setFormName(data.name || '')
          setFormAvatar(data.avatar_url || '')
        }
      }
      setLoading(false)
    }

    fetchProfile()
  }, [supabase])

  const handleSave = async () => {
    if (!profile) return

    setSaving(true)

    const { error } = await supabase
      .from('users')
      .update({
        name: formName || null,
        avatar_url: formAvatar || null,
      })
      .eq('id', profile.id)

    if (error) {
      alert('Erro ao salvar: ' + error.message)
    } else {
      setProfile({
        ...profile,
        name: formName,
        avatar_url: formAvatar,
      })
    }

    setSaving(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Settings className="h-6 w-6 text-primary-400" />
          Configurações
        </h1>
        <p className="text-slate-400 mt-1">
          Gerencie suas preferências e perfil
        </p>
      </div>

      {/* Profile Section */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Perfil</h2>

        <div className="space-y-4 max-w-lg">
          <div>
            <label className="text-slate-300 text-sm block mb-1">Email</label>
            <input
              type="email"
              value={profile?.email || ''}
              disabled
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-400 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="text-slate-300 text-sm block mb-1">Nome</label>
            <input
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="Seu nome"
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:border-primary-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-slate-300 text-sm block mb-1">
              Avatar URL
            </label>
            <input
              type="url"
              value={formAvatar}
              onChange={(e) => setFormAvatar(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:border-primary-500 focus:outline-none"
            />
            {formAvatar && (
              <img
                src={formAvatar}
                alt="Avatar preview"
                className="mt-2 w-16 h-16 rounded-full object-cover"
              />
            )}
          </div>

          <div>
            <label className="text-slate-300 text-sm block mb-1">Função</label>
            <input
              type="text"
              value={profile?.role || 'editor'}
              disabled
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-400 cursor-not-allowed"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Salvar Alterações
          </button>
        </div>
      </div>

      {/* Site Info */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white mb-4">
          Informações do Site
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-slate-400">Nome do Site</p>
            <p className="text-white font-medium">Empire Blog</p>
          </div>
          <div>
            <p className="text-slate-400">Framework</p>
            <p className="text-white font-medium">Next.js 14</p>
          </div>
          <div>
            <p className="text-slate-400">Banco de Dados</p>
            <p className="text-white font-medium">Supabase (PostgreSQL)</p>
          </div>
          <div>
            <p className="text-slate-400">Editor</p>
            <p className="text-white font-medium">TipTap</p>
          </div>
          <div>
            <p className="text-slate-400">IA</p>
            <p className="text-white font-medium">Open Router (Gemini)</p>
          </div>
          <div>
            <p className="text-slate-400">Transcrição</p>
            <p className="text-white font-medium">ScrapeCreators</p>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-900/10 border border-red-500/20 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-red-400 mb-4">Zona de Perigo</h2>
        <p className="text-slate-400 text-sm mb-4">
          Ações nesta seção são irreversíveis. Tenha cuidado.
        </p>
        <button
          onClick={() => alert('Funcionalidade em desenvolvimento')}
          className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors"
        >
          Excluir Conta
        </button>
      </div>
    </div>
  )
}
