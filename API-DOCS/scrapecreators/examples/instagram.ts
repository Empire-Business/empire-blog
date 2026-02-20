/**
 * ScrapeCreators Instagram API - Exemplos de Implementação
 * 
 * Edge Functions para Supabase
 * Requer: SCRAPECREATORS_API_KEY configurado nas secrets
 */

import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const BASE_URL_V1 = 'https://api.scrapecreators.com/v1/instagram';
const BASE_URL_V2 = 'https://api.scrapecreators.com/v2/instagram';

// ============================================================================
// TIPOS
// ============================================================================

interface ProfileResponse {
  success: boolean;
  data: {
    user: {
      biography: string;
      bio_links: BioLink[];
      external_url: string | null;
      edge_followed_by: { count: number };
      edge_follow: { count: number };
      full_name: string;
      username: string;
      is_verified: boolean;
      is_private: boolean;
      profile_pic_url: string;
      profile_pic_url_hd: string;
      category_name: string | null;
      is_business_account: boolean;
      is_professional_account: boolean;
      edge_owner_to_timeline_media: {
        count: number;
        page_info: PageInfo;
        edges: TimelineMediaEdge[];
      };
      edge_related_profiles: {
        edges: RelatedProfileEdge[];
      };
    };
  };
  status: string;
}

interface BioLink {
  title: string;
  url: string;
  link_type: string;
}

interface PageInfo {
  has_next_page: boolean;
  end_cursor: string | null;
}

interface TimelineMediaEdge {
  node: {
    id: string;
    shortcode: string;
    display_url: string;
    is_video: boolean;
    video_view_count?: number;
    edge_media_to_caption: { edges: Array<{ node: { text: string } }> };
    edge_media_to_comment: { count: number };
    edge_liked_by: { count: number };
    taken_at_timestamp: number;
  };
}

interface RelatedProfileEdge {
  node: {
    id: string;
    username: string;
    full_name: string;
    is_verified: boolean;
    profile_pic_url: string;
  };
}

interface UserPostsResponse {
  profile_grid_items: any[] | null;
  num_results: number;
  more_available: boolean;
  items: PostItem[];
  next_max_id: string | null;
  user: {
    pk: string;
    username: string;
    full_name: string;
    is_verified: boolean;
    profile_pic_url: string;
  };
  status: string;
}

interface PostItem {
  pk: string;
  id: string;
  code: string;
  media_type: number; // 1 = foto, 2 = vídeo/reel
  caption?: {
    text: string;
  };
  like_count: number;
  comment_count: number;
  play_count?: number;
  taken_at: number;
  image_versions2?: {
    candidates: ImageCandidate[];
  };
  video_versions?: VideoVersion[];
  url: string;
}

interface ImageCandidate {
  width: number;
  height: number;
  url: string;
}

interface VideoVersion {
  type: number;
  width: number;
  height: number;
  url: string;
}

interface PostDetailResponse {
  data: {
    xdt_shortcode_media: {
      id: string;
      shortcode: string;
      __typename: string;
      display_url: string;
      video_url?: string;
      video_view_count?: number;
      video_play_count?: number;
      edge_media_to_caption: {
        edges: Array<{
          node: {
            text: string;
            created_at: string;
          };
        }>;
      };
      edge_media_to_parent_comment: { count: number };
      edge_media_preview_like: { count: number };
      taken_at_timestamp: number;
      owner: {
        id: string;
        username: string;
        full_name: string;
        is_verified: boolean;
        profile_pic_url: string;
      };
      is_video: boolean;
      product_type?: string;
    };
  };
  status: string;
}

interface ReelsResponse {
  items: ReelItem[];
  paging_info: {
    max_id: string | null;
    more_available: boolean;
  };
  status: string;
}

interface ReelItem {
  media: PostItem;
}

interface TranscriptResponse {
  success: boolean;
  transcripts: Array<{
    id: string;
    shortcode: string;
    text: string;
  }>;
}

interface EmbedResponse {
  success: boolean;
  html: string;
}

// ============================================================================
// CLIENTE API
// ============================================================================

class ScrapeCreatorsInstagramClient {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async fetchWithErrorHandling(url: string): Promise<any> {
    const response = await fetch(url, {
      headers: { 'x-api-key': this.apiKey }
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new ScrapeCreatorsError(
        `API Error: ${error.error || response.statusText}`,
        response.status
      );
    }

    return response.json();
  }

  /**
   * Busca perfil completo do usuário
   */
  async getProfile(handle: string, trim = false): Promise<ProfileResponse> {
    const params = new URLSearchParams({ handle });
    if (trim) params.append('trim', 'true');
    
    return this.fetchWithErrorHandling(`${BASE_URL_V1}/profile?${params}`);
  }

  /**
   * Busca posts do usuário com paginação
   */
  async getUserPosts(
    handle: string, 
    nextMaxId?: string,
    trim = false
  ): Promise<UserPostsResponse> {
    const params = new URLSearchParams({ handle });
    if (nextMaxId) params.append('next_max_id', nextMaxId);
    if (trim) params.append('trim', 'true');
    
    return this.fetchWithErrorHandling(`${BASE_URL_V2}/user/posts?${params}`);
  }

  /**
   * Busca reels do usuário
   */
  async getUserReels(
    handle: string,
    userId?: string,
    maxId?: string,
    trim = false
  ): Promise<ReelsResponse> {
    const params = new URLSearchParams();
    
    // Preferir user_id se disponível (mais rápido)
    if (userId) {
      params.append('user_id', userId);
    } else {
      params.append('handle', handle);
    }
    
    if (maxId) params.append('max_id', maxId);
    if (trim) params.append('trim', 'true');
    
    return this.fetchWithErrorHandling(`${BASE_URL_V1}/user/reels?${params}`);
  }

  /**
   * Busca detalhes de um post/reel
   */
  async getPost(url: string, trim = false): Promise<PostDetailResponse> {
    const params = new URLSearchParams({ url });
    if (trim) params.append('trim', 'true');
    
    return this.fetchWithErrorHandling(`${BASE_URL_V1}/post?${params}`);
  }

  /**
   * Busca transcrição de um post/reel (pode demorar 10-30s)
   */
  async getTranscript(
    url: string, 
    timeoutMs = 35000
  ): Promise<TranscriptResponse> {
    const params = new URLSearchParams({ url });
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(
        `${BASE_URL_V2}/media/transcript?${params}`,
        { 
          headers: { 'x-api-key': this.apiKey },
          signal: controller.signal
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Unknown' }));
        throw new ScrapeCreatorsError(error.error, response.status);
      }

      return response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new ScrapeCreatorsError('Transcript request timed out', 408);
      }
      throw error;
    }
  }

  /**
   * Busca embed HTML do perfil
   */
  async getEmbed(handle: string): Promise<EmbedResponse> {
    const params = new URLSearchParams({ handle });
    return this.fetchWithErrorHandling(`${BASE_URL_V1}/user/embed?${params}`);
  }

  /**
   * Busca todos os posts de um usuário (itera todas as páginas)
   */
  async getAllUserPosts(handle: string, maxPages = 10): Promise<PostItem[]> {
    const allPosts: PostItem[] = [];
    let nextMaxId: string | undefined;
    let pageCount = 0;

    do {
      const data = await this.getUserPosts(handle, nextMaxId);
      allPosts.push(...data.items);
      nextMaxId = data.next_max_id || undefined;
      pageCount++;
    } while (nextMaxId && pageCount < maxPages);

    return allPosts;
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
 * Edge Function: Buscar perfil do Instagram
 * POST /functions/v1/instagram-profile
 * Body: { "handle": "username" }
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

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const API_KEY = Deno.env.get('SCRAPECREATORS_API_KEY');
  if (!API_KEY) {
    return new Response(
      JSON.stringify({ error: 'API key not configured' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const { handle, includePosts = false } = await req.json();

    if (!handle) {
      return new Response(
        JSON.stringify({ error: 'Handle is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const client = new ScrapeCreatorsInstagramClient(API_KEY);
    
    // Buscar perfil
    const profile = await client.getProfile(handle);
    
    // Opcionalmente buscar posts
    let posts: PostItem[] | undefined;
    if (includePosts) {
      posts = await client.getAllUserPosts(handle, 3); // max 3 páginas
    }

    return new Response(
      JSON.stringify({ 
        profile: profile.data.user,
        posts,
        stats: {
          followers: profile.data.user.edge_followed_by.count,
          following: profile.data.user.edge_follow.count,
          posts_count: profile.data.user.edge_owner_to_timeline_media.count
        }
      }), 
      {
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );

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
 * Exemplo 1: Análise básica de perfil
 */
async function exemploAnalisePerfil(handle: string) {
  const API_KEY = Deno.env.get('SCRAPECREATORS_API_KEY')!;
  const client = new ScrapeCreatorsInstagramClient(API_KEY);

  const profile = await client.getProfile(handle);
  const user = profile.data.user;

  console.log(`
Perfil: @${user.username}
Nome: ${user.full_name}
Bio: ${user.biography}
Seguidores: ${user.edge_followed_by.count.toLocaleString()}
Seguindo: ${user.edge_follow.count.toLocaleString()}
Posts: ${user.edge_owner_to_timeline_media.count}
Verificado: ${user.is_verified ? 'Sim' : 'Não'}
Categoria: ${user.category_name || 'N/A'}
Link: ${user.external_url || 'Nenhum'}
  `);
}

/**
 * Exemplo 2: Buscar posts com filtro de engajamento
 */
async function exemploPostsMaisEngajados(handle: string, topN = 10) {
  const API_KEY = Deno.env.get('SCRAPECREATORS_API_KEY')!;
  const client = new ScrapeCreatorsInstagramClient(API_KEY);

  const posts = await client.getAllUserPosts(handle, 5);
  
  const postsComEngajamento = posts
    .map(post => ({
      ...post,
      engajamento: post.like_count + (post.comment_count * 2) // peso maior para comentários
    }))
    .sort((a, b) => b.engajamento - a.engajamento)
    .slice(0, topN);

  console.log(`Top ${topN} posts mais engajados:`);
  postsComEngajamento.forEach((post, i) => {
    console.log(`${i + 1}. ${post.caption?.text?.slice(0, 50) || 'Sem legenda'}...`);
    console.log(`   ❤️ ${post.like_count} | 💬 ${post.comment_count} | ▶️ ${post.play_count || 0}`);
    console.log(`   🔗 ${post.url}`);
  });

  return postsComEngajamento;
}

/**
 * Exemplo 3: Buscar reels mais recentes
 */
async function exemploReelsRecentes(handle: string, userId?: string) {
  const API_KEY = Deno.env.get('SCRAPECREATORS_API_KEY')!;
  const client = new ScrapeCreatorsInstagramClient(API_KEY);

  const reels = await client.getUserReels(handle, userId);

  console.log(`Encontrados ${reels.items.length} reels:`);
  
  reels.items.forEach((item, i) => {
    const media = item.media;
    console.log(`
${i + 1}. Reel ${media.code}
   Views: ${media.play_count || 'N/A'}
   Likes: ${media.like_count}
   URL: ${media.url}
    `);
  });

  // Verificar se há mais páginas
  if (reels.paging_info.more_available) {
    console.log('Mais reels disponíveis. Use max_id:', reels.paging_info.max_id);
  }

  return reels;
}

/**
 * Exemplo 4: Transcrição de reel com retry
 */
async function exemploTranscricaoReel(url: string, maxRetries = 3) {
  const API_KEY = Deno.env.get('SCRAPECREATORS_API_KEY')!;
  const client = new ScrapeCreatorsInstagramClient(API_KEY);

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    console.log(`Tentativa ${attempt}/${maxRetries}...`);
    
    try {
      const result = await client.getTranscript(url, 40000); // 40s timeout
      
      if (result.transcripts && result.transcripts.length > 0) {
        const texto = result.transcripts.map(t => t.text).join('\n');
        console.log('Transcrição obtida com sucesso!');
        console.log(texto);
        return result;
      }
      
      console.log('Transcrição vazia, tentando novamente...');
      await delay(2000 * attempt);
      
    } catch (error) {
      if (attempt === maxRetries) {
        console.error('Falha após todas as tentativas:', error.message);
        throw error;
      }
      console.log(`Erro: ${error.message}, tentando novamente...`);
      await delay(2000 * attempt);
    }
  }

  return null;
}

/**
 * Exemplo 5: Comparar métricas de dois perfis
 */
async function exemploCompararPerfis(handle1: string, handle2: string) {
  const API_KEY = Deno.env.get('SCRAPECREATORS_API_KEY')!;
  const client = new ScrapeCreatorsInstagramClient(API_KEY);

  const [p1, p2] = await Promise.all([
    client.getProfile(handle1),
    client.getProfile(handle2)
  ]);

  const u1 = p1.data.user;
  const u2 = p2.data.user;

  console.log(`
Comparação: @${u1.username} vs @${u2.username}

Seguidores:
  @${u1.username}: ${u1.edge_followed_by.count.toLocaleString()}
  @${u2.username}: ${u2.edge_followed_by.count.toLocaleString()}
  Diferença: ${Math.abs(u1.edge_followed_by.count - u2.edge_followed_by.count).toLocaleString()}

Taxa de seguimento:
  @${u1.username}: ${(u1.edge_follow.count / u1.edge_followed_by.count).toFixed(2)}
  @${u2.username}: ${(u2.edge_follow.count / u2.edge_followed_by.count).toFixed(2)}

Posts:
  @${u1.username}: ${u1.edge_owner_to_timeline_media.count}
  @${u2.username}: ${u2.edge_owner_to_timeline_media.count}
  `);
}

// ============================================================================
// UTILITÁRIOS
// ============================================================================

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Extrair shortcode de URL do Instagram
 */
export function extrairShortcode(url: string): string | null {
  const patterns = [
    /instagram\.com\/p\/([^\/]+)/,
    /instagram\.com\/reel\/([^\/]+)/,
    /instagram\.com\/reels\/([^\/]+)/,
    /instagr\.am\/p\/([^\/]+)/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  return null;
}

/**
 * Converter timestamp Unix para data legível
 */
export function formatarData(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleString('pt-BR');
}

/**
 * Calcular taxa de engajamento
 */
export function calcularTaxaEngajamento(
  likes: number, 
  comments: number, 
  followers: number
): number {
  if (followers === 0) return 0;
  return ((likes + comments) / followers) * 100;
}

export { ScrapeCreatorsInstagramClient, ScrapeCreatorsError };
export type { 
  ProfileResponse, 
  UserPostsResponse, 
  PostItem, 
  PostDetailResponse,
  ReelsResponse,
  TranscriptResponse 
};
