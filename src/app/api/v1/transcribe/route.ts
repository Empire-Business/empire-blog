import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// POST /api/v1/transcribe - Transcribe video content
export async function POST(request: Request) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { url } = body

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 })
  }

  const apiKey = process.env.SCRAPECREATORS_API_KEY

  if (!apiKey) {
    return NextResponse.json({ error: 'ScrapeCreators API key not configured' }, { status: 500 })
  }

  // Detect platform from URL
  let platform = ''
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    platform = 'youtube'
  } else if (url.includes('instagram.com')) {
    platform = 'instagram'
  } else {
    return NextResponse.json(
      { error: 'Unsupported platform. Only YouTube and Instagram are supported.' },
      { status: 400 }
    )
  }

  try {
    // Use ScrapeCreators API to get transcription
    const response = await fetch('https://api.scrapecreators.com/v1/transcribe', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url,
        platform,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error?.message || 'Transcription failed')
    }

    const result = await response.json()
    const transcription = result.transcription || result.text || result.content

    // Log the generation
    await supabase.from('ai_generations').insert({
      user_id: user.id,
      type: 'transcription',
      prompt: url,
      result: transcription,
      model: 'scrapecreators',
    })

    return NextResponse.json({
      data: {
        transcription,
        platform,
        url,
        metadata: result.metadata || {},
      },
    })
  } catch (error) {
    console.error('Transcription error:', error)

    // Return a more helpful error message
    const errorMessage = error instanceof Error ? error.message : 'Transcription failed'

    // If ScrapeCreators is not available, provide a fallback message
    if (errorMessage.includes('fetch') || errorMessage.includes('network')) {
      return NextResponse.json({
        error: 'Transcription service temporarily unavailable. Please try again later.',
        fallback: true,
      }, { status: 503 })
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
