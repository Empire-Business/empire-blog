import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

interface RouteParams {
  params: Promise<{ slug: string }>
}

// GET /api/v1/posts/[slug] - Get a single post
export async function GET(request: Request, { params }: RouteParams) {
  const { slug } = await params
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      categories (*),
      tags (*),
      author:users (*)
    `)
    .eq('slug', slug)
    .single()

  if (error) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 })
  }

  // Increment view count
  await supabase
    .from('posts')
    .update({ views: (data.views || 0) + 1 })
    .eq('id', data.id)

  return NextResponse.json({ data })
}

// PUT /api/v1/posts/[slug] - Update a post
export async function PUT(request: Request, { params }: RouteParams) {
  const { slug } = await params
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

  // Get existing post
  const { data: existingPost, error: postError } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .single()

  if (postError || !existingPost) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 })
  }

  // Parse body
  const body = await request.json()

  // Calculate new values if content changed
  let updates: Record<string, unknown> = { ...body }

  if (body.title) {
    updates.slug = body.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  if (body.content) {
    const wordCount = body.content.split(/\s+/).length
    updates.read_time = Math.max(1, Math.ceil(wordCount / 200))
    if (!body.excerpt) {
      updates.excerpt = body.content.replace(/<[^>]*>/g, '').slice(0, 160) + '...'
    }
  }

  if (body.status === 'published' && existingPost.status !== 'published') {
    updates.published_at = new Date().toISOString()
  }

  const { data, error } = await supabase
    .from('posts')
    .update(updates)
    .eq('id', existingPost.id)
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

  return NextResponse.json({ data })
}

// DELETE /api/v1/posts/[slug] - Delete a post
export async function DELETE(request: Request, { params }: RouteParams) {
  const { slug } = await params
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

  const { error } = await supabase.from('posts').delete().eq('slug', slug)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Update API key last used
  await supabase
    .from('api_keys')
    .update({ last_used_at: new Date().toISOString() })
    .eq('id', keyData.id)

  return NextResponse.json({ success: true })
}
