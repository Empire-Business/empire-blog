'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Plus, Edit, Trash2, Eye, Search, Copy, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'

interface Post {
  id: string
  title: string
  slug: string
  status: string
  views: number
  created_at: string
  scheduled_at: string | null
  categories: { name: string }[] | null
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const supabase = createClient()

  const fetchPosts = async () => {
    setLoading(true)
    let query = supabase
      .from('posts')
      .select(`
        id,
        title,
        slug,
        status,
        views,
        created_at,
        scheduled_at,
        categories (name)
      `)
      .order('created_at', { ascending: false })

    if (search) {
      query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`)
    }

    if (statusFilter !== 'all') {
      query = query.eq('status', statusFilter)
    }

    const { data, error } = await query

    if (!error && data) {
      setPosts(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchPosts()
  }, [statusFilter])

  useEffect(() => {
    const delay = setTimeout(() => {
      if (search !== undefined) fetchPosts()
    }, 300)
    return () => clearTimeout(delay)
  }, [search])

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este post?')) return

    const { error } = await supabase.from('posts').delete().eq('id', id)

    if (error) {
      toast.error('Erro ao excluir: ' + error.message)
      return
    }

    setPosts(posts.filter((p) => p.id !== id))
    toast.success('Post excluído com sucesso!')
  }

  const handleDuplicate = async (post: Post) => {
    // Get full post data
    const { data: fullPost, error: fetchError } = await supabase
      .from('posts')
      .select('*')
      .eq('id', post.id)
      .single()

    if (fetchError || !fullPost) {
      toast.error('Erro ao buscar post para duplicar')
      return
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      toast.error('Você precisa estar logado')
      return
    }

    // Create duplicated post
    const newSlug = `${fullPost.slug}-copia-${Date.now()}`
    const newTitle = `${fullPost.title} (Cópia)`

    const { error } = await supabase.from('posts').insert({
      title: newTitle,
      slug: newSlug,
      content: fullPost.content,
      excerpt: fullPost.excerpt,
      featured_image: fullPost.featured_image,
      category_slug: fullPost.category_slug,
      tag_slugs: fullPost.tag_slugs,
      author_id: user.id,
      status: 'draft',
      meta_title: fullPost.meta_title ? `${fullPost.meta_title} (Cópia)` : newTitle,
      meta_description: fullPost.meta_description,
      read_time: fullPost.read_time,
    })

    if (error) {
      toast.error('Erro ao duplicar: ' + error.message)
      return
    }

    toast.success('Post duplicado com sucesso!')
    fetchPosts()
  }

  const getStatusBadge = (status: string, scheduledAt: string | null) => {
    if (status === 'published') {
      return (
        <span className="px-2 py-1 text-xs rounded bg-accent-500/10 text-accent-400">
          Publicado
        </span>
      )
    }
    if (scheduledAt) {
      return (
        <span className="px-2 py-1 text-xs rounded bg-blue-500/10 text-blue-400">
          Agendado
        </span>
      )
    }
    return (
      <span className="px-2 py-1 text-xs rounded bg-yellow-500/10 text-yellow-400">
        Rascunho
      </span>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Posts</h1>
          <p className="text-slate-400 mt-1">Gerencie seus artigos</p>
        </div>
        <Link
          href="/admin/posts/new"
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4" />
          Novo Post
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:border-primary-500 focus:outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-primary-500 focus:outline-none"
        >
          <option value="all">Todos os status</option>
          <option value="published">Publicados</option>
          <option value="draft">Rascunhos</option>
        </select>
      </div>

      {/* Posts list */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12 bg-slate-800/50 border border-slate-700 rounded-lg">
          <p className="text-slate-400">Nenhum post encontrado</p>
          <Link
            href="/admin/posts/new"
            className="inline-block mt-3 text-primary-400 hover:text-primary-300"
          >
            Criar primeiro post →
          </Link>
        </div>
      ) : (
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-700/50">
              <tr>
                <th className="text-left px-4 py-3 text-slate-300 font-medium">
                  Título
                </th>
                <th className="text-left px-4 py-3 text-slate-300 font-medium">
                  Categoria
                </th>
                <th className="text-left px-4 py-3 text-slate-300 font-medium">
                  Status
                </th>
                <th className="text-left px-4 py-3 text-slate-300 font-medium">
                  Views
                </th>
                <th className="text-left px-4 py-3 text-slate-300 font-medium">
                  Data
                </th>
                <th className="text-right px-4 py-3 text-slate-300 font-medium">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-slate-700/30">
                  <td className="px-4 py-3">
                    <span className="text-white font-medium">{post.title}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-400">
                    {post.categories?.[0]?.name || '-'}
                  </td>
                  <td className="px-4 py-3">
                    {getStatusBadge(post.status, post.scheduled_at)}
                  </td>
                  <td className="px-4 py-3 text-slate-400 flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {post.views || 0}
                  </td>
                  <td className="px-4 py-3 text-slate-400">
                    {new Date(post.created_at).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {post.status === 'published' && (
                        <a
                          href={`/post/${post.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-slate-400 hover:text-white hover:bg-slate-600 rounded transition-colors"
                          title="Ver no site"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                      <button
                        onClick={() => handleDuplicate(post)}
                        className="p-2 text-slate-400 hover:text-accent-400 hover:bg-slate-600 rounded transition-colors"
                        title="Duplicar"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      <Link
                        href={`/admin/posts/${post.id}`}
                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-600 rounded transition-colors"
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id)}
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
    </div>
  )
}
