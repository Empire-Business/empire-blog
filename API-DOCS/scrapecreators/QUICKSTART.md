# ScrapeCreators - Quick Start

Guia rápido para começar a usar a API ScrapeCreators.

## 1. Configurar Chave API

```bash
# No dashboard do Supabase
Project Settings → Secrets → Add Secret

Nome: SCRAPECREATORS_API_KEY
Valor: sua_chave_aqui
```

## 2. Criar Edge Function

```typescript
// supabase/functions/scrapecreators-test/index.ts
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

Deno.serve(async (req) => {
  const API_KEY = Deno.env.get('SCRAPECREATORS_API_KEY');
  
  const response = await fetch(
    'https://api.scrapecreators.com/v1/instagram/profile?handle=instagram',
    { headers: { 'x-api-key': API_KEY } }
  );
  
  const data = await response.json();
  return new Response(JSON.stringify(data));
});
```

## 3. Deploy

```bash
supabase functions deploy scrapecreators-test
```

## 4. Testar

```bash
curl -X POST \
  https://seu-projeto.supabase.co/functions/v1/scrapecreators-test \
  -H "Authorization: Bearer SEU_ANON_KEY"
```

## Endpoints Rápidos

### YouTube - Transcrição
```typescript
const res = await fetch(
  'https://api.scrapecreators.com/v1/youtube/video/transcript?' + 
  'url=' + encodeURIComponent('https://youtube.com/watch?v=VIDEO_ID'),
  { headers: { 'x-api-key': API_KEY } }
);
```

### Instagram - Perfil
```typescript
const res = await fetch(
  'https://api.scrapecreators.com/v1/instagram/profile?handle=USERNAME',
  { headers: { 'x-api-key': API_KEY } }
);
```

### Instagram - Posts
```typescript
const res = await fetch(
  'https://api.scrapecreators.com/v2/instagram/user/posts?handle=USERNAME',
  { headers: { 'x-api-key': API_KEY } }
);
```

## Dicas

- 🔑 Guarde a API key no Supabase Secrets
- ⏱️ Transcrições do Instagram podem levar 10-30s
- 📝 Use `trim=true` para respostas menores
- 🔄 Implemente retry com exponential backoff
- 📄 Veja [exemplos completos](./examples/)
