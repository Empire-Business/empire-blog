'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Trash2, Key, Copy, Check, Eye, EyeOff } from 'lucide-react'

interface APIKey {
  id: string
  name: string
  key: string
  permissions: string[]
  is_active: boolean
  last_used_at: string | null
  created_at: string
  expires_at: string | null
}

export default function APIKeysPage() {
  const [apiKeys, setApiKeys] = useState<APIKey[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [formName, setFormName] = useState('')
  const [formPermissions, setFormPermissions] = useState<string[]>(['read'])
  const [saving, setSaving] = useState(false)
  const [newKey, setNewKey] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [showKey, setShowKey] = useState<string | null>(null)

  const supabase = createClient()

  const fetchAPIKeys = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('api_keys')
      .select('id, name, key, permissions, is_active, last_used_at, created_at, expires_at')
      .order('created_at', { ascending: false })

    if (!error && data) {
      setApiKeys(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchAPIKeys()
  }, [])

  const handleCreate = async () => {
    if (!formName.trim()) {
      alert('O nome é obrigatório')
      return
    }

    setSaving(true)

    try {
      const response = await fetch('/api/v1/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formName,
          permissions: formPermissions,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao criar chave')
      }

      setNewKey(result.data.key)
      setFormName('')
      setFormPermissions(['read'])
      fetchAPIKeys()
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Erro ao criar chave')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta chave?')) return

    const { error } = await supabase.from('api_keys').delete().eq('id', id)

    if (error) {
      alert('Erro ao excluir: ' + error.message)
      return
    }

    setApiKeys(apiKeys.filter((k) => k.id !== id))
  }

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const togglePermission = (perm: string) => {
    setFormPermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Key className="h-6 w-6 text-primary-400" />
            API Keys
          </h1>
          <p className="text-slate-400 mt-1">
            Gerencie chaves de acesso à API REST
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4" />
          Nova Chave
        </button>
      </div>

      {/* API Keys list */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      ) : apiKeys.length === 0 ? (
        <div className="text-center py-12 bg-slate-800/50 border border-slate-700 rounded-lg">
          <Key className="h-12 w-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400">Nenhuma chave de API criada</p>
          <button
            onClick={() => setShowModal(true)}
            className="inline-block mt-3 text-primary-400 hover:text-primary-300"
          >
            Criar primeira chave →
          </button>
        </div>
      ) : (
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-700/50">
              <tr>
                <th className="text-left px-4 py-3 text-slate-300 font-medium">
                  Nome
                </th>
                <th className="text-left px-4 py-3 text-slate-300 font-medium">
                  Chave
                </th>
                <th className="text-left px-4 py-3 text-slate-300 font-medium">
                  Permissões
                </th>
                <th className="text-left px-4 py-3 text-slate-300 font-medium">
                  Status
                </th>
                <th className="text-left px-4 py-3 text-slate-300 font-medium">
                  Último Uso
                </th>
                <th className="text-right px-4 py-3 text-slate-300 font-medium">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {apiKeys.map((apiKey) => (
                <tr key={apiKey.id} className="hover:bg-slate-700/30">
                  <td className="px-4 py-3 text-white font-medium">
                    {apiKey.name}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <code className="text-slate-300 text-sm bg-slate-700 px-2 py-1 rounded">
                        {showKey === apiKey.id
                          ? apiKey.key
                          : `${apiKey.key.slice(0, 8)}...${apiKey.key.slice(-4)}`}
                      </code>
                      <button
                        onClick={() =>
                          setShowKey(showKey === apiKey.id ? null : apiKey.id)
                        }
                        className="p-1 text-slate-400 hover:text-white"
                      >
                        {showKey === apiKey.id ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        onClick={() => handleCopy(apiKey.key)}
                        className="p-1 text-slate-400 hover:text-white"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {apiKey.permissions.map((perm) => (
                        <span
                          key={perm}
                          className="px-2 py-0.5 text-xs bg-slate-700 text-slate-300 rounded"
                        >
                          {perm}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        apiKey.is_active
                          ? 'bg-accent-500/10 text-accent-400'
                          : 'bg-red-500/10 text-red-400'
                      }`}
                    >
                      {apiKey.is_active ? 'Ativa' : 'Inativa'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-400 text-sm">
                    {apiKey.last_used_at
                      ? new Date(apiKey.last_used_at).toLocaleDateString('pt-BR')
                      : 'Nunca'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleDelete(apiKey.id)}
                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-600 rounded transition-colors"
                        title="Excluir"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* API Usage Info */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-3">Como usar a API</h3>
        <div className="space-y-3 text-sm">
          <p className="text-slate-300">
            Adicione o header <code className="bg-slate-700 px-2 py-0.5 rounded">x-api-key</code> com sua chave em todas as requisições:
          </p>
          <pre className="bg-slate-900 p-3 rounded-lg overflow-x-auto">
            <code className="text-slate-300">{`curl -X GET "https://seudominio.com/api/v1/posts" \\
  -H "x-api-key: eb_sua_chave_aqui"`}</code>
          </pre>
          <div className="mt-4">
            <p className="text-slate-400 mb-2">Endpoints disponíveis:</p>
            <ul className="text-slate-300 space-y-1">
              <li>• GET/POST /api/v1/posts</li>
              <li>• GET/PUT/DELETE /api/v1/posts/[slug]</li>
              <li>• GET/POST /api/v1/categories</li>
              <li>• GET/POST /api/v1/tags</li>
              <li>• GET/POST /api/v1/media</li>
              <li>• GET/POST /api/v1/webhooks</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 w-full max-w-md mx-4">
            {newKey ? (
              <>
                <h2 className="text-xl font-bold text-white mb-2">
                  Chave Criada!
                </h2>
                <p className="text-slate-400 mb-4">
                  Copie a chave agora. Você não poderá vê-la novamente.
                </p>
                <div className="flex items-center gap-2 mb-4">
                  <code className="flex-1 text-accent-400 text-sm bg-slate-700 px-3 py-2 rounded break-all">
                    {newKey}
                  </code>
                  <button
                    onClick={() => handleCopy(newKey)}
                    className="p-2 text-slate-400 hover:text-white bg-slate-700 rounded"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-accent-400" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <button
                  onClick={() => {
                    setShowModal(false)
                    setNewKey(null)
                  }}
                  className="w-full px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
                >
                  Fechar
                </button>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold text-white mb-4">Nova Chave API</h2>

                <div className="space-y-4">
                  <div>
                    <label className="text-slate-300 text-sm block mb-1">
                      Nome
                    </label>
                    <input
                      type="text"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="Ex: Integração Zapier"
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:border-primary-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 text-sm block mb-2">
                      Permissões
                    </label>
                    <div className="flex gap-2">
                      {['read', 'write', 'delete'].map((perm) => (
                        <button
                          key={perm}
                          type="button"
                          onClick={() => togglePermission(perm)}
                          className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                            formPermissions.includes(perm)
                              ? 'bg-primary-500 text-white'
                              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                          }`}
                        >
                          {perm}
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
                    onClick={handleCreate}
                    disabled={saving}
                    className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors disabled:opacity-50"
                  >
                    {saving ? 'Criando...' : 'Criar Chave'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
