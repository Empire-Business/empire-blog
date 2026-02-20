import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET /api/v1/media - List all media
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type')
  const limit = parseInt(searchParams.get('limit') || '50')
  const offset = parseInt(searchParams.get('offset') || '0')

  const supabase = await createClient()

  let query = supabase
    .from('media')
    .select('*')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (type) {
    query = query.eq('type', type)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}

// POST /api/v1/media - Upload media info (actual upload via Supabase Storage)
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

  const { data, error } = await supabase
    .from('media')
    .insert({
      filename: body.filename,
      original_name: body.original_name,
      url: body.url,
      type: body.type,
      size: body.size,
      alt_text: body.alt_text,
      uploaded_by: keyData.user_id,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data }, { status: 201 })
}
