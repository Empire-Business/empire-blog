import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { randomBytes } from 'crypto'

// GET /api/v1/api-keys - List API keys
export async function GET() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('api_keys')
    .select('id, name, key, permissions, is_active, last_used_at, created_at, expires_at')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Mask keys in list response
  const safeData = data.map((key) => ({
    ...key,
    key: key.key ? `${key.key.slice(0, 8)}...${key.key.slice(-4)}` : null,
  }))

  return NextResponse.json({ data: safeData })
}

// POST /api/v1/api-keys - Create API key
export async function POST(request: Request) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()

  // Generate API key
  const key = `eb_${randomBytes(32).toString('hex')}`

  const { data, error } = await supabase
    .from('api_keys')
    .insert({
      name: body.name,
      key,
      user_id: user.id,
      permissions: body.permissions || ['read'],
      is_active: true,
      expires_at: body.expires_at,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data }, { status: 201 })
}
