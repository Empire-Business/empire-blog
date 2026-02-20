import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET /api/v1/tags - List all tags
export async function GET() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .order('name')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}

// POST /api/v1/tags - Create a new tag
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

  const body = await request.json()

  // Generate slug from name
  const slug = body.name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

  const { data, error } = await supabase
    .from('tags')
    .insert({
      name: body.name,
      slug,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data }, { status: 201 })
}
