import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET /api/v1/webhooks - List webhooks
export async function GET() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('webhooks')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Hide secret in list response
  const safeData = data.map((webhook) => ({
    ...webhook,
    secret: webhook.secret ? '••••••••' : null,
  }))

  return NextResponse.json({ data: safeData })
}

// POST /api/v1/webhooks - Create webhook
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
    .from('webhooks')
    .insert({
      name: body.name,
      url: body.url,
      secret: body.secret,
      events: body.events || [],
      is_active: body.is_active ?? true,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data }, { status: 201 })
}
