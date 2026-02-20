# YouTube API Endpoints

## Base URL
```
https://api.scrapecreators.com/v1/youtube
```

---

## 1. Get Video Details

Retorna informações completas de um vídeo ou short, incluindo metadados, estatísticas e transcrição.

### Endpoint
```
GET /v1/youtube/video
```

### Headers
| Header | Valor |
|--------|-------|
| x-api-key | Sua API key |

### Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| url | string | Sim | URL do vídeo ou short do YouTube |

### Exemplo de Requisição
```
GET https://api.scrapecreators.com/v1/youtube/video?url=https://www.youtube.com/watch?v=Y2Ah_DFr8cw
```

### Exemplo de Resposta (200 OK)
```json
{
  "success": true,
  "credits_remaining": 33851527,
  "id": "Y2Ah_DFr8cw",
  "thumbnail": "https://img.youtube.com/vi/Y2Ah_DFr8cw/maxresdefault.jpg",
  "url": "https://www.youtube.com/watch?v=Y2Ah_DFr8cw",
  "publishDate": "2019-02-22T03:19:54-08:00",
  "type": "video",
  "title": "Inside the NBA: Chuck Trolls Jussie Smollett...",
  "description": null,
  "commentCountText": "358",
  "commentCountInt": 358,
  "likeCountText": "4043",
  "likeCountInt": 4043,
  "viewCountText": "372,864",
  "viewCountInt": 372864,
  "publishDateText": "Feb 22, 2019",
  "collaborators": [],
  "channel": {
    "id": "UCWH3hing1Qb4LnkRfQdxsxQ",
    "url": "https://www.youtube.com/@afroballer8906",
    "handle": "afroballer8906",
    "title": "Afroballer"
  },
  "chapters": [],
  "watchNextVideos": [...],
  "keywords": [],
  "genre": "People & Blogs",
  "durationMs": 348000,
  "durationFormatted": "00:05:48",
  "captionTracks": [...],
  "transcript": null,
  "transcript_only_text": null
}
```

### Campos Importantes da Resposta
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | string | ID do vídeo |
| title | string | Título do vídeo |
| description | string | Descrição do vídeo |
| viewCountInt | number | Número de visualizações |
| likeCountInt | number | Número de likes |
| commentCountInt | number | Número de comentários |
| durationMs | number | Duração em milissegundos |
| channel | object | Informações do canal |
| transcript | array | Transcrição completa (se disponível) |
| transcript_only_text | string | Apenas texto da transcrição |
| credits_remaining | number | Créditos restantes na conta |

---

## 2. Get Video Transcript

Retorna apenas a transcrição de um vídeo ou short.

### Endpoint
```
GET /v1/youtube/video/transcript
```

### Headers
| Header | Valor |
|--------|-------|
| x-api-key | Sua API key |

### Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| url | string | Sim | URL do vídeo ou short do YouTube |
| language | string | Não | Código de 2 letras do idioma (ex: 'en', 'es', 'fr', 'pt') |

### Exemplo de Requisição
```
GET https://api.scrapecreators.com/v1/youtube/video/transcript?url=https://www.youtube.com/watch?v=bjVIDXPP7Uk&language=pt
```

### Exemplo de Resposta (200 OK)
```json
{
  "videoId": "bjVIDXPP7Uk",
  "type": "video",
  "url": "https://www.youtube.com/watch?v=bjVIDXPP7Uk",
  "transcript": [
    {
      "text": "welcome back to the hell farm and the",
      "startMs": "160",
      "endMs": "1920",
      "startTimeText": "0:00"
    },
    {
      "text": "backyard trails we built these jumps two",
      "startMs": "1920",
      "endMs": "3919",
      "startTimeText": "0:01"
    }
  ],
  "transcript_only_text": "welcome back to the hell farm and the backyard trails we built these jumps two years ago...",
  "language": "English"
}
```

### Campos da Transcrição
| Campo | Tipo | Descrição |
|-------|------|-----------|
| videoId | string | ID do vídeo |
| transcript | array | Array de segmentos com texto e timestamps |
| transcript_only_text | string | Texto completo concatenado |
| language | string | Idioma detectado da transcrição |

### Segmento da Transcrição
| Campo | Tipo | Descrição |
|-------|------|-----------|
| text | string | Texto falado |
| startMs | string | Tempo inicial em milissegundos |
| endMs | string | Tempo final em milissegundos |
| startTimeText | string | Tempo formatado (ex: "0:00", "1:30") |

### Notas sobre Language
- Se o idioma especificado não estiver disponível, `transcript` retornará `null`
- Códigos suportados: 'en', 'es', 'fr', 'de', 'it', 'pt', 'ja', 'ko', 'zh', etc.

---

## Exemplos de Código

Veja implementações completas em [examples/youtube.ts](./examples/youtube.ts)

### TypeScript/Edge Function

```typescript
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const BASE_URL = 'https://api.scrapecreators.com/v1/youtube';

async function getVideoDetails(url: string, apiKey: string) {
  const params = new URLSearchParams({ url });
  const response = await fetch(`${BASE_URL}/video?${params}`, {
    headers: { 'x-api-key': apiKey }
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(`API Error: ${response.status} - ${error.error || 'Unknown'}`);
  }
  
  return response.json();
}

async function getVideoTranscript(url: string, apiKey: string, language?: string) {
  const params = new URLSearchParams({ url });
  if (language) params.append('language', language);
  
  const response = await fetch(`${BASE_URL}/video/transcript?${params}`, {
    headers: { 'x-api-key': apiKey }
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(`API Error: ${response.status} - ${error.error || 'Unknown'}`);
  }
  
  return response.json();
}

Deno.serve(async (req) => {
  const API_KEY = Deno.env.get('SCRAPECREATORS_API_KEY');
  if (!API_KEY) throw new Error('API key not configured');

  try {
    // Exemplo: buscar vídeo com transcrição
    const videoData = await getVideoDetails(
      'https://www.youtube.com/watch?v=Y2Ah_DFr8cw',
      API_KEY
    );

    return new Response(JSON.stringify(videoData), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
```
