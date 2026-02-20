/**
 * ScrapeCreators YouTube API - Exemplos de Implementação
 * 
 * Edge Functions para Supabase
 * Requer: SCRAPECREATORS_API_KEY configurado nas secrets
 */

import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const BASE_URL = 'https://api.scrapecreators.com/v1/youtube';

// ============================================================================
// TIPOS
// ============================================================================

interface VideoDetails {
  success: boolean;
  credits_remaining: number;
  id: string;
  thumbnail: string;
  url: string;
  publishDate: string;
  type: 'video' | 'short';
  title: string;
  description: string | null;
  commentCountText: string;
  commentCountInt: number;
  likeCountText: string;
  likeCountInt: number;
  viewCountText: string;
  viewCountInt: number;
  publishDateText: string;
  collaborators: any[];
  channel: {
    id: string;
    url: string;
    handle: string;
    title: string;
  };
  chapters: any[];
  watchNextVideos: any[];
  keywords: string[];
  genre: string;
  durationMs: number;
  durationFormatted: string;
  captionTracks: any[];
  transcript: TranscriptSegment[] | null;
  transcript_only_text: string | null;
}

interface TranscriptSegment {
  text: string;
  startMs: string;
  endMs: string;
  startTimeText: string;
}

interface VideoTranscript {
  videoId: string;
  type: 'video' | 'short';
  url: string;
  transcript: TranscriptSegment[];
  transcript_only_text: string;
  language: string;
}

interface ApiError {
  success?: boolean;
  error: string;
}

// ============================================================================
// CLIENTE API
// ============================================================================

class ScrapeCreatorsYouTubeClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.baseUrl = BASE_URL;
  }

  /**
   * Busca detalhes completos de um vídeo
   */
  async getVideoDetails(url: string): Promise<VideoDetails> {
    const params = new URLSearchParams({ url });
    
    const response = await fetch(`${this.baseUrl}/video?${params}`, {
      headers: { 'x-api-key': this.apiKey }
    });

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new ScrapeCreatorsError(
        `Failed to fetch video details: ${error.error}`,
        response.status
      );
    }

    return response.json();
  }

  /**
   * Busca transcrição de um vídeo
   */
  async getVideoTranscript(url: string, language?: string): Promise<VideoTranscript> {
    const params = new URLSearchParams({ url });
    if (language) params.append('language', language);
    
    const response = await fetch(`${this.baseUrl}/video/transcript?${params}`, {
      headers: { 'x-api-key': this.apiKey }
    });

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new ScrapeCreatorsError(
        `Failed to fetch transcript: ${error.error}`,
        response.status
      );
    }

    return response.json();
  }

  /**
   * Busca vídeo com fallback de transcrição
   */
  async getVideoWithTranscript(url: string, language?: string): Promise<{
    video: VideoDetails;
    transcript: VideoTranscript | null;
  }> {
    const video = await this.getVideoDetails(url);
    
    // Tenta buscar transcrição separadamente se não veio no vídeo
    if (!video.transcript || video.transcript.length === 0) {
      try {
        const transcript = await this.getVideoTranscript(url, language);
        return { video, transcript };
      } catch {
        return { video, transcript: null };
      }
    }

    return { 
      video, 
      transcript: {
        videoId: video.id,
        type: video.type,
        url: video.url,
        transcript: video.transcript,
        transcript_only_text: video.transcript_only_text || '',
        language: language || 'unknown'
      }
    };
  }
}

class ScrapeCreatorsError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message);
    this.name = 'ScrapeCreatorsError';
  }
}

// ============================================================================
// EDGE FUNCTIONS
// ============================================================================

/**
 * Edge Function: Buscar detalhes do vídeo
 * POST /functions/v1/youtube-video
 * Body: { "url": "https://youtube.com/watch?v=..." }
 */
Deno.serve(async (req) => {
  // CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    });
  }

  // Validar método
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Obter API Key
  const API_KEY = Deno.env.get('SCRAPECREATORS_API_KEY');
  if (!API_KEY) {
    return new Response(
      JSON.stringify({ error: 'API key not configured' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const { url, language } = await req.json();

    if (!url) {
      return new Response(
        JSON.stringify({ error: 'URL is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validar URL do YouTube
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    if (!youtubeRegex.test(url)) {
      return new Response(
        JSON.stringify({ error: 'Invalid YouTube URL' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const client = new ScrapeCreatorsYouTubeClient(API_KEY);
    const result = await client.getVideoWithTranscript(url, language);

    return new Response(JSON.stringify(result), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (error) {
    console.error('Error:', error);
    
    const status = error instanceof ScrapeCreatorsError ? error.statusCode : 500;
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        timestamp: new Date().toISOString()
      }),
      { 
        status, 
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        } 
      }
    );
  }
});

// ============================================================================
// EXEMPLOS DE USO
// ============================================================================

/**
 * Exemplo 1: Buscar vídeo simples
 */
async function exemploBuscarVideo() {
  const API_KEY = Deno.env.get('SCRAPECREATORS_API_KEY')!;
  const client = new ScrapeCreatorsYouTubeClient(API_KEY);

  const video = await client.getVideoDetails(
    'https://www.youtube.com/watch?v=Y2Ah_DFr8cw'
  );

  console.log('Título:', video.title);
  console.log('Views:', video.viewCountInt);
  console.log('Likes:', video.likeCountInt);
  console.log('Duração:', video.durationFormatted);
  console.log('Canal:', video.channel.title);
}

/**
 * Exemplo 2: Buscar transcrição com retry
 */
async function exemploBuscarTranscriptComRetry(
  url: string, 
  language = 'pt',
  maxRetries = 3
) {
  const API_KEY = Deno.env.get('SCRAPECREATORS_API_KEY')!;
  const client = new ScrapeCreatorsYouTubeClient(API_KEY);

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const transcript = await client.getVideoTranscript(url, language);
      
      if (transcript.transcript && transcript.transcript.length > 0) {
        return transcript;
      }
      
      console.log(`Attempt ${attempt}: Transcript empty, retrying...`);
      await delay(1000 * attempt);
      
    } catch (error) {
      if (attempt === maxRetries) throw error;
      console.log(`Attempt ${attempt} failed: ${error.message}`);
      await delay(1000 * attempt);
    }
  }

  return null;
}

/**
 * Exemplo 3: Extrair texto limpo da transcrição
 */
function extrairTextoTranscript(transcript: VideoTranscript): string {
  if (!transcript.transcript || transcript.transcript.length === 0) {
    return '';
  }

  // Usar o campo transcript_only_text se disponível
  if (transcript.transcript_only_text) {
    return transcript.transcript_only_text;
  }

  // Ou concatenar os segmentos
  return transcript.transcript
    .map(segment => segment.text)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Exemplo 4: Formatar transcrição com timestamps
 */
function formatarTranscriptComTimestamps(transcript: VideoTranscript): string {
  if (!transcript.transcript) return '';

  return transcript.transcript
    .map(segment => `[${segment.startTimeText}] ${segment.text}`)
    .join('\n');
}

// ============================================================================
// UTILITÁRIOS
// ============================================================================

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Extrair ID do vídeo de qualquer URL do YouTube
 */
export function extrairVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?]+)/,
    /youtube\.com\/shorts\/([^&\s?]+)/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  return null;
}

/**
 * Converter URL para formato embed
 */
export function paraEmbedUrl(videoIdOrUrl: string): string {
  const id = extrairVideoId(videoIdOrUrl) || videoIdOrUrl;
  return `https://www.youtube.com/embed/${id}`;
}

export { ScrapeCreatorsYouTubeClient, ScrapeCreatorsError };
export type { VideoDetails, VideoTranscript, TranscriptSegment };
