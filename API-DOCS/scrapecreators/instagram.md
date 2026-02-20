# Instagram API Endpoints

## Base URLs
```
https://api.scrapecreators.com/v1/instagram
https://api.scrapecreators.com/v2/instagram
```

---

## 1. Get User Profile

Retorna dados completos do perfil público, posts recentes e contas relacionadas.

### Endpoint
```
GET /v1/instagram/profile
```

### Headers
| Header | Valor |
|--------|-------|
| x-api-key | Sua API key |

### Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| handle | string | Sim | Handle do Instagram (@username) |
| trim | boolean | Não | Retorna resposta enxuta se `true` |

### Exemplo de Requisição
```
GET https://api.scrapecreators.com/v1/instagram/profile?handle=adrianhorning
```

### Campos Principais da Resposta
| Campo | Tipo | Descrição |
|-------|------|-----------|
| data.user.biography | string | Bio do perfil |
| data.user.full_name | string | Nome completo |
| data.user.username | string | Username |
| data.user.is_verified | boolean | Se é verificado |
| data.user.is_private | boolean | Se é privado |
| data.user.edge_followed_by.count | number | Seguidores |
| data.user.edge_follow.count | number | Seguindo |
| data.user.profile_pic_url | string | URL da foto de perfil |
| data.user.external_url | string | Link na bio |
| data.user.edge_owner_to_timeline_media | object | Posts recentes |
| data.user.edge_related_profiles | object | Perfis relacionados |

---

## 2. Get User Posts

Retorna posts públicos de um usuário com paginação.

### Endpoint
```
GET /v2/instagram/user/posts
```

### Headers
| Header | Valor |
|--------|-------|
| x-api-key | Sua API key |

### Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| handle | string | Sim | Handle do Instagram |
| next_max_id | string | Não | Cursor para próxima página |
| trim | boolean | Não | Retorna resposta enxuta se `true` |

### Exemplo de Requisição
```
GET https://api.scrapecreators.com/v2/instagram/user/posts?handle=barstoolsports
```

### Campos Principais da Resposta
| Campo | Tipo | Descrição |
|-------|------|-----------|
| items | array | Lista de posts |
| num_results | number | Quantidade de resultados |
| more_available | boolean | Se há mais resultados |
| next_max_id | string | Cursor para próxima página |
| user | object | Informações básicas do usuário |

### Item de Post
| Campo | Tipo | Descrição |
|-------|------|-----------|
| pk | string | ID do post |
| code | string | Código curto do post |
| media_type | number | 1 = foto, 2 = vídeo/reel |
| caption.text | string | Legenda |
| like_count | number | Curtidas |
| comment_count | number | Comentários |
| play_count | number | Visualizações (reels) |
| taken_at | timestamp | Data de postagem |
| image_versions2.candidates | array | URLs das imagens |
| video_versions | array | URLs dos vídeos |
| url | string | URL direta do post |

**⚠️ Nota:** O campo `video_view_count` para reels pode ser impreciso neste endpoint. Use `/v1/instagram/user/reels` para views precisas.

---

## 3. Get User Reels

Retorna todos os reels públicos de um perfil.

### Endpoint
```
GET /v1/instagram/user/reels
```

### Headers
| Header | Valor |
|--------|-------|
| x-api-key | Sua API key |

### Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| user_id | string | Não | ID do usuário (mais rápido) |
| handle | string | Não | Handle do Instagram |
| max_id | string | Não | Cursor para mais reels |
| trim | boolean | Não | Retorna resposta enxuta se `true` |

### Exemplo de Requisição
```
GET https://api.scrapecreators.com/v1/instagram/user/reels?handle=adrianhorning
```

**Nota:** Prefira usar `user_id` em vez de `handle` para resposta mais rápida.

**⚠️ Limitação:** Este endpoint não inclui reels fixados (pinned) e pode não retornar a descrição do reel. Use o endpoint de detalhes do post para isso.

---

## 4. Get Post Details

Retorna detalhes completos de um post ou reel específico.

### Endpoint
```
GET /v1/instagram/post
```

### Headers
| Header | Valor |
|--------|-------|
| x-api-key | Sua API key |

### Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| url | string | Sim | URL do post ou reel |
| trim | boolean | Não | Retorna resposta enxuta se `true` |

### Exemplo de Requisição
```
GET https://api.scrapecreators.com/v1/instagram/post?url=https://www.instagram.com/p/DF5s0duxDts/
```

### Campos Principais (data.xdt_shortcode_media)
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | string | ID do post |
| shortcode | string | Código curto |
| __typename | string | XDTGraphVideo (reel) ou XDTGraphImage (foto) |
| display_url | string | URL da imagem principal |
| video_url | string | URL do vídeo (se for reel) |
| video_view_count | number | Visualizações |
| video_play_count | number | Plays |
| edge_media_to_caption.edges[].node.text | string | Legenda |
| edge_media_to_comment.count | number | Comentários |
| edge_liked_by.count | number | Curtidas |
| taken_at_timestamp | timestamp | Data de postagem |
| owner | object | Informações do autor |
| is_video | boolean | Se é vídeo |

**⚠️ Nota:** Os counts de views/play são apenas do Instagram, não incluem views do Facebook (quando cross-postado).

---

## 5. Get Media Transcript

Retorna a transcrição de um post ou reel (processado com IA).

### Endpoint
```
GET /v2/instagram/media/transcript
```

### Headers
| Header | Valor |
|--------|-------|
| x-api-key | Sua API key |

### Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| url | string | Sim | URL do post ou reel |

### Exemplo de Requisição
```
GET https://api.scrapecreators.com/v2/instagram/media/transcript?url=https://www.instagram.com/p/DHsD6HGqJhp/
```

### Exemplo de Resposta
```json
{
  "success": true,
  "transcripts": [
    {
      "id": "3597267389859272809",
      "shortcode": "DHsD6HGqJhp",
      "text": "Let's fry up the perfect bunzel. Beautiful. Everybody, shh. The perfect bunzel. Let me show you my bunzel. When it comes down to bunzel, we make it the crispiest, get the crunch. Heaven."
    }
  ]
}
```

**⚠️ Atenção:** Este endpoint é mais lento (10-30 segundos) pois usa processamento com IA. Se não houver fala no vídeo, retorna `null`. Para carrosséis, retorna transcrição para cada item.

---

## 6. Get User Embed

Retorna o HTML de embed de um perfil.

### Endpoint
```
GET /v1/instagram/user/embed
```

### Headers
| Header | Valor |
|--------|-------|
| x-api-key | Sua API key |

### Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| handle | string | Sim | Handle do Instagram |

### Exemplo de Requisição
```
GET https://api.scrapecreators.com/v1/instagram/user/embed?handle=adrianhorning
```

### Exemplo de Resposta
```json
{
  "success": true,
  "html": "<!DOCTYPE html>\n<html lang=\"en\"..."
}
```

---

## Exemplos de Código

Veja implementações completas em [examples/instagram.ts](./examples/instagram.ts)

### TypeScript/Edge Function - Paginação de Posts

```typescript
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const BASE_URL = 'https://api.scrapecreators.com';

async function getUserPosts(
  handle: string, 
  apiKey: string, 
  nextMaxId?: string
) {
  const params = new URLSearchParams({ handle });
  if (nextMaxId) params.append('next_max_id', nextMaxId);
  
  const response = await fetch(
    `${BASE_URL}/v2/instagram/user/posts?${params}`,
    { headers: { 'x-api-key': apiKey } }
  );
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown' }));
    throw new Error(`API Error: ${response.status} - ${error.error}`);
  }
  
  return response.json();
}

// Buscar todas as páginas
async function getAllUserPosts(handle: string, apiKey: string) {
  const allPosts: any[] = [];
  let nextMaxId: string | undefined;
  
  do {
    const data = await getUserPosts(handle, apiKey, nextMaxId);
    allPosts.push(...data.items);
    nextMaxId = data.next_max_id;
  } while (nextMaxId);
  
  return allPosts;
}
```

### Buscar Transcrição com Timeout

```typescript
async function getMediaTranscript(url: string, apiKey: string, timeoutMs = 35000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    const response = await fetch(
      `https://api.scrapecreators.com/v2/instagram/media/transcript?url=${encodeURIComponent(url)}`,
      { 
        headers: { 'x-api-key': apiKey },
        signal: controller.signal
      }
    );
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Transcript request timed out');
    }
    throw error;
  }
}
```
