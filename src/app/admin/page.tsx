'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import {
  FileText,
  Eye,
  FolderOpen,
  Tags,
  TrendingUp,
  Plus,
  Sparkles,
} from 'lucide-react'

interface Stats {
  totalPosts: number
  publishedPosts: number
  draftPosts: number
  totalCategories: number
  totalTags: number
  totalViews: number
}

interface RecentPost {
  id: string
  title: string
  status: string
  created_at: string
  views: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalCategories: 0,
    totalTags: 0,
    totalViews: 0,
  })
  const [recentPosts, setRecentPosts] = useState<RecentPost[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch posts count
        const { count: totalPosts } = await supabase
          .from('posts')
          .select('*', { count: 'exact', head: true })

        const { count: publishedPosts } = await supabase
          .from('posts')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'published')

        const { count: draftPosts } = await supabase
          .from('posts')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'draft')

        // Fetch categories and tags count
        const { count: totalCategories } = await supabase
          .from('categories')
          .select('*', { count: 'exact', head: true })

        const { count: totalTags } = await supabase
          .from('tags')
          .select('*', { count: 'exact', head: true })

        // Fetch recent posts
        const { data: posts } = await supabase
          .from('posts')
          .select('id, title, status, created_at, views')
          .order('created_at', { ascending: false })
          .limit(5)

        // Calculate total views
        const totalViews = posts?.reduce((sum, post) => sum + (post.views || 0), 0) || 0

        setStats({
          totalPosts: totalPosts || 0,
          publishedPosts: publishedPosts || 0,
          draftPosts: draftPosts || 0,
          totalCategories: totalCategories || 0,
          totalTags: totalTags || 0,
          totalViews,
        })
        setRecentPosts(posts || [])
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [supabase])

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400 mt-1">
            Bem-vindo ao painel administrativo
          </p>
        </div>
        <Link
          href="/admin/posts/new"
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4" />
          Novo Post
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-500/10 rounded-lg">
              <FileText className="h-5 w-5 text-primary-500" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Total de Posts</p>
              <p className="text-2xl font-bold text-white">{stats.totalPosts}</p>
            </div>
          </div>
          <div className="mt-3 flex gap-4 text-xs">
            <span className="text-accent-400">
              {stats.publishedPosts} publicados
            </span>
            <span className="text-yellow-400">{stats.draftPosts} rascunhos</span>
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent-500/10 rounded-lg">
              <Eye className="h-5 w-5 text-accent-500" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Visualizações</p>
              <p className="text-2xl font-bold text-white">{stats.totalViews}</p>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1 text-xs text-accent-400">
            <TrendingUp className="h-3 w-3" />
            Total acumulado
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <FolderOpen className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Categorias</p>
              <p className="text-2xl font-bold text-white">
                {stats.totalCategories}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/10 rounded-lg">
              <Tags className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Tags</p>
              <p className="text-2xl font-bold text-white">{stats.totalTags}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/posts/new"
            className="flex items-center gap-3 p-4 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <FileText className="h-5 w-5 text-primary-500" />
            <div>
              <p className="text-white font-medium">Criar Post</p>
              <p className="text-slate-400 text-sm">Escrever novo artigo</p>
            </div>
          </Link>

          <Link
            href="/admin/ai"
            className="flex items-center gap-3 p-4 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <Sparkles className="h-5 w-5 text-accent-500" />
            <div>
              <p className="text-white font-medium">Gerar com IA</p>
              <p className="text-slate-400 text-sm">Criar conteúdo com IA</p>
            </div>
          </Link>

          <Link
            href="/admin/categories"
            className="flex items-center gap-3 p-4 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <FolderOpen className="h-5 w-5 text-purple-500" />
            <div>
              <p className="text-white font-medium">Gerenciar Categorias</p>
              <p className="text-slate-400 text-sm">Organizar conteúdo</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Posts */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Posts Recentes</h2>
        {recentPosts.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">Nenhum post criado ainda</p>
            <Link
              href="/admin/posts/new"
              className="inline-block mt-3 text-primary-400 hover:text-primary-300"
            >
              Criar primeiro post →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentPosts.map((post) => (
              <div
                key={post.id}
                className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg"
              >
                <div>
                  <p className="text-white font-medium">{post.title}</p>
                  <p className="text-slate-400 text-sm">
                    {new Date(post.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-2 py-1 text-xs rounded ${
                      post.status === 'published'
                        ? 'bg-accent-500/10 text-accent-400'
                        : 'bg-yellow-500/10 text-yellow-400'
                    }`}
                  >
                    {post.status === 'published' ? 'Publicado' : 'Rascunho'}
                  </span>
                  <span className="text-slate-400 text-sm flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {post.views || 0}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
