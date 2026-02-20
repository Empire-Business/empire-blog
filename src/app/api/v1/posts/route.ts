import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET /api/v1/posts - List all posts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const category = searchParams.get('category')
  const tag = searchParams.get('tag')
  const search = searchParams.get('search')
  const limit = parseInt(searchParams.get('limit') || '10')
  const offset = parseInt(searchParams.get('offset') || '0')

  const supabase = await createClient()

  let query = supabase
    .from('posts')
    .select(`
      *,
      categories (*),
      tags (*),
      author:users (*)
    `)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (status) {
    query = query.eq('status', status)
  }

  if (category) {
    query = query.eq('category_slug', category)
  }

  if (tag) {
    query = query.contains('tag_slugs', [tag])
  }

  if (search) {
    query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`)
  }

  const { data, error, count } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    data,
    meta: {
      total: count,
      limit,
      offset,
    },
  })
}

// POST /api/v1/posts - Create a new post
export async function POST(request: Request) {
  const supabase = await createClient()

  // Verify API key
  const apiKey = request.headers.get('x-api-key')
  if (!apiKey) {
    return NextResponse.json({ error: 'API key required' }, { status: 401 })
  }

  const { data: keyData, error: keyError } = await supabase
    .from('api_keys')
    .select('*')
    .eq('key', apiKey)
    .eq('is_active', true)
    .single()

  if (keyError || !keyData) {
    return NextResponse.json({ error: 'Invalid API key' }, { status: 401 })
  }

  // Parse body
  const body = await request.json()

  // Generate slug from title
  const slug = body.title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

  // Calculate read time (approx. 200 words per minute)
  const wordCount = body.content?.split(/\s+/).length || 0
  const readTime = Math.max(1, Math.ceil(wordCount / 200))

  // Extract excerpt from content (first 160 chars)
  const excerpt = body.excerpt || body.content?.replace(/<[^>]*>/g, '').slice(0, 160) + '...'

  const { data, error } = await supabase
    .from('posts')
    .insert({
      title: body.title,
      slug,
      content: body.content,
      excerpt,
      featured_image: body.featured_image,
      category_slug: body.category_slug,
      tag_slugs: body.tag_slugs || [],
      author_id: keyData.user_id,
      status: body.status || 'draft',
      meta_title: body.meta_title || body.title,
      meta_description: body.meta_description || excerpt,
      read_time: readTime,
      published_at: body.status === 'published' ? new Date().toISOString() : null,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Update API key last used
  await supabase
    .from('api_keys')
    .update({ last_used_at: new Date().toISOString() })
    .eq('id', keyData.id)

  return NextResponse.json({ data }, { status: 201 })
}
