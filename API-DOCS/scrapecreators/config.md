# Configuração da API Key - Supabase

## Supabase Secrets

Para segurança, a chave API do ScrapeCreators deve ser armazenada nos Secrets do Supabase, não hardcoded no código.

### Nome da Variável

```
SCRAPECREATORS_API_KEY
```

### Como Configurar

#### Via Dashboard do Supabase

1. Acesse seu projeto no [Supabase Dashboard](https://app.supabase.com)
2. Vá em **Project Settings** → **Secrets**
3. Clique em **Add Secret**
4. Nome: `SCRAPECREATORS_API_KEY`
5. Valor: Sua chave API do ScrapeCreators
6. Salve

#### Via CLI (se disponível)

```bash
supabase secrets set SCRAPECREATORS_API_KEY=sua_chave_aqui
```

### Uso em Edge Functions

```typescript
// As secrets ficam disponíveis em Deno.env
const API_KEY = Deno.env.get('SCRAPECREATORS_API_KEY');

if (!API_KEY) {
  throw new Error('SCRAPECREATORS_API_KEY not configured');
}
```

### Uso em Client-Side (não recomendado)

⚠️ **Nunca expor a API key no cliente/browser!**

Sempre use Edge Functions ou um backend seguro para fazer as chamadas à API.

---

## Validação da Configuração

### Edge Function de Teste

```typescript
// functions/scrapecreators-test/index.ts
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

Deno.serve(async (req) => {
  const API_KEY = Deno.env.get('SCRAPECREATORS_API_KEY');
  
  if (!API_KEY) {
    return new Response(
      JSON.stringify({ error: 'API key not configured' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Testa conexão com a API
  const response = await fetch(
    'https://api.scrapecreators.com/v1/instagram/profile?handle=instagram',
    { headers: { 'x-api-key': API_KEY } }
  );

  if (!response.ok) {
    return new Response(
      JSON.stringify({ error: 'API test failed', status: response.status }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  return new Response(
    JSON.stringify({ success: true, message: 'API configured correctly' }),
    { headers: { 'Content-Type': 'application/json' } }
  );
});
```

---

## Ambientes

### Desenvolvimento

Para desenvolvimento local com Supabase CLI:

```bash
# .env.local
SCRAPECREATORS_API_KEY=sua_chave_de_teste
```

### Produção

Configure a secret no dashboard do Supabase para o projeto de produção.

---

## Rotação de Chaves

Se precisar rotacionar a chave API:

1. Gere nova chave no dashboard do ScrapeCreators
2. Atualize a secret no Supabase
3. Redeploy das Edge Functions
4. Teste as funcionalidades
5. Revogue a chave antiga apenas após confirmar que tudo funciona
