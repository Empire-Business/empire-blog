import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

interface AIRequest {
  type: 'post' | 'title' | 'excerpt' | 'seo' | 'transcription'
  prompt?: string
  content?: string
  context?: string
}

// POST /api/v1/ai/generate - Generate content with AI
export async function POST(request: Request) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body: AIRequest = await request.json()
  const apiKey = process.env.OPENROUTER_API_KEY

  if (!apiKey) {
    return NextResponse.json({ error: 'OpenRouter API key not configured' }, { status: 500 })
  }

  let systemPrompt = ''
  let userPrompt = ''

  switch (body.type) {
    case 'post':
      systemPrompt = `Você é um escritor de blog profissional especializado em criar conteúdo envolvente e bem estruturado.
Escreva em português brasileiro, com um tom profissional mas acessível.
Use markdown para formatação quando apropriado.`
      userPrompt = `Escreva um artigo de blog sobre: ${body.prompt}

${body.context ? `Contexto adicional: ${body.context}` : ''}

O artigo deve ter:
- Um título atraente
- Uma introdução envolvente
- 3-5 seções com subtítulos
- Uma conclusão com call-to-action`
      break

    case 'title':
      systemPrompt = `Você é um especialista em SEO e copywriting.
Gere títulos de blog otimizados para engajamento e SEO.
Responda apenas com os títulos, um por linha.`
      userPrompt = `Gere 5 títulos de blog para: ${body.prompt}`
      break

    case 'excerpt':
      systemPrompt = `Você é um especialista em resumos de conteúdo.
Crie resumos curtos e envolventes que façam o leitor querer ler mais.
Máximo de 160 caracteres.`
      userPrompt = `Crie um resumo para este conteúdo:\n\n${body.content}`
      break

    case 'seo':
      systemPrompt = `Você é um especialista em SEO.
Analise o conteúdo e sugira otimizações para mecanismos de busca.
Responda em JSON com: { meta_title, meta_description, keywords }`
      userPrompt = `Analise este conteúdo e sugira meta título, meta descrição e palavras-chave:\n\n${body.content}`
      break

    case 'transcription':
      systemPrompt = `Você é um especialista em transformar transcrições de vídeo em artigos de blog.
Mantenha as informações principais mas reescreva em formato de artigo.
Adicione subtítulos e organize o conteúdo de forma lógica.`
      userPrompt = `Transforme esta transcrição em um artigo de blog:\n\n${body.content}`
      break

    default:
      return NextResponse.json({ error: 'Invalid generation type' }, { status: 400 })
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        'X-Title': 'Empire Blog',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-exp:free',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error?.message || 'AI generation failed')
    }

    const result = await response.json()
    const generatedContent = result.choices[0]?.message?.content

    // Log the generation
    await supabase.from('ai_generations').insert({
      user_id: user.id,
      type: body.type,
      prompt: userPrompt,
      result: generatedContent,
      model: 'gemini-2.0-flash-exp',
      tokens_used: result.usage?.total_tokens,
    })

    return NextResponse.json({
      data: {
        content: generatedContent,
        model: 'gemini-2.0-flash-exp',
        tokens: result.usage?.total_tokens,
      },
    })
  } catch (error) {
    console.error('AI generation error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'AI generation failed' },
      { status: 500 }
    )
  }
}
