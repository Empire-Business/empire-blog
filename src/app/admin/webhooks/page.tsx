'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Trash2, Webhook, Edit, Power } from 'lucide-react'

interface Webhook {
  id: string
  name: string
  url: string
  events: string[]
  is_active: boolean
  created_at: string
}

export default function WebhooksPage() {
  const [webhooks, setWebhooks] = useState<Webhook[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingWebhook, setEditingWebhook] = useState<Webhook | null>(null)
  const [formName, setFormName] = useState('')
  const [formUrl, setFormUrl] = useState('')
  const [formSecret, setFormSecret] = useState('')
  const [formEvents, setFormEvents] = useState<string[]>(['post.created'])
  const [saving, setSaving] = useState(false)

  const supabase = createClient()

  const availableEvents = [
    { value: 'post.created', label: 'Post Criado' },
    { value: 'post.updated', label: 'Post Atualizado' },
    { value: 'post.deleted', label: 'Post Excluído' },
    { value: 'post.published', label: 'Post Publicado' },
  ]

  const fetchWebhooks = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('webhooks')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) {
      setWebhooks(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchWebhooks()
  }, [])

  const openModal = (webhook?: Webhook) => {
    if (webhook) {
      setEditingWebhook(webhook)
      setFormName(webhook.name)
      setFormUrl(webhook.url)
      setFormSecret('')
      setFormEvents(webhook.events)
    } else {
      setEditingWebhook(null)
      setFormName('')
      setFormUrl('')
      setFormSecret('')
      setFormEvents(['post.created'])
    }
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!formName.trim() || !formUrl.trim()) {
      alert('Nome e URL são obrigatórios')
      return
    }

    setSaving(true)

    try {
      if (editingWebhook) {
        const updateData: Record<string, unknown> = {
          name: formName,
          url: formUrl,
          events: formEvents,
        }
        if (formSecret) updateData.secret = formSecret

        const { error } = await supabase
          .from('webhooks')
          .update(updateData)
          .eq('id', editingWebhook.id)

        if (error) throw error
      } else {
        const response = await fetch('/api/v1/webhooks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formName,
            url: formUrl,
            secret: formSecret || undefined,
            events: formEvents,
          }),
        })

        if (!response.ok) {
          const result = await response.json()
          throw new Error(result.error || 'Erro ao criar webhook')
        }
      }

      setShowModal(false)
      fetchWebhooks()
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Erro ao salvar')
    } finally {
      setSaving(false)
    }
  }

  const handleToggle = async (webhook: Webhook) => {
    const { error } = await supabase
      .from('webhooks')
      .update({ is_active: !webhook.is_active })
      .eq('id', webhook.id)

    if (error) {
      alert('Erro ao atualizar: ' + error.message)
      return
    }

    setWebhooks(
      webhooks.map((w) =>
        w.id === webhook.id ? { ...w, is_active: !w.is_active } : w
      )
    )
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este webhook?')) return

    const { error } = await supabase.from('webhooks').delete().eq('id', id)

    if (error) {
      alert('Erro ao excluir: ' + error.message)
      return
    }

    setWebhooks(webhooks.filter((w) => w.id !== id))
  }

  const toggleEvent = (event: string) => {
    setFormEvents((prev) =>
      prev.includes(event) ? prev.filter((e) => e !== event) : [...prev, event]
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Webhook className="h-6 w-6 text-primary-400" />
            Webhooks
          </h1>
          <p className="text-slate-400 mt-1">
            Configure integrações externas via webhooks
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4" />
          Novo Webhook
        </button>
      </div>

      {/* Webhooks list */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      ) : webhooks.length === 0 ? (
        <div className="text-center py-12 bg-slate-800/50 border border-slate-700 rounded-lg">
          <Webhook className="h-12 w-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400">Nenhum webhook configurado</p>
          <button
            onClick={() => openModal()}
            className="inline-block mt-3 text-primary-400 hover:text-primary-300"
          >
            Criar primeiro webhook →
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {webhooks.map((webhook) => (
            <div
              key={webhook.id}
              className="bg-slate-800/50 border border-slate-700 rounded-lg p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-white font-medium">{webhook.name}</h3>
                    <span
                      className={`px-2 py-0.5 text-xs rounded ${
                        webhook.is_active
                          ? 'bg-accent-500/10 text-accent-400'
                          : 'bg-slate-700 text-slate-400'
                      }`}
                    >
                      {webhook.is_active ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm mt-1">{webhook.url}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {webhook.events.map((event) => (
                      <span
                        key={event}
                        className="px-2 py-0.5 text-xs bg-slate-700 text-slate-300 rounded"
                      >
                        {event}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggle(webhook)}
                    className={`p-2 rounded transition-colors ${
                      webhook.is_active
                        ? 'text-accent-400 hover:bg-slate-700'
                        : 'text-slate-400 hover:bg-slate-700'
                    }`}
                    title={webhook.is_active ? 'Desativar' : 'Ativar'}
                  >
                    <Power className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => openModal(webhook)}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors"
                    title="Editar"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(webhook.id)}
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
              {editingWebhook ? 'Editar Webhook' : 'Novo Webhook'}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-slate-300 text-sm block mb-1">Nome</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Ex: Notificação Slack"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:border-primary-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-300 text-sm block mb-1">URL</label>
                <input
                  type="url"
                  value={formUrl}
                  onChange={(e) => setFormUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:border-primary-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-300 text-sm block mb-1">
                  Secret (opcional)
                </label>
                <input
                  type="text"
                  value={formSecret}
                  onChange={(e) => setFormSecret(e.target.value)}
                  placeholder="Chave secreta para verificação"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:border-primary-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-300 text-sm block mb-2">Eventos</label>
                <div className="flex flex-wrap gap-2">
                  {availableEvents.map((event) => (
                    <button
                      key={event.value}
                      type="button"
                      onClick={() => toggleEvent(event.value)}
                      className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                        formEvents.includes(event.value)
                          ? 'bg-primary-500 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      {event.label}
                    </button>
                  ))}
                </div>
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
