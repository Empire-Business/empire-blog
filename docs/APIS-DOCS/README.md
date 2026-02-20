# APIs-DOCS

Esta pasta contém documentações de APIs externas usadas no projeto.

## Como documentar uma API

Execute o comando no Claude Code:

```
*api nome-da-api
```

Exemplos:
- `*api openai` - Documenta a API da OpenAI
- `*api stripe` - Documenta a API do Stripe
- `*api --listar` - Lista todas as APIs documentadas

## APIs Documentadas

| API | Categoria | Arquivo |
|-----|-----------|---------|
| OpenRouter | AI/LLM | [openrouter-api.md](./openrouter-api.md) |

---

## OpenRouter API

OpenRouter e uma API unificada para acessar centenas de modelos de IA (OpenAI, Anthropic, Google, Meta, etc.) atraves de uma unica interface compativel com OpenAI SDK.

### Configuracao Rapida no Supabase

```bash
# Adicionar API key ao Supabase Secrets
supabase secrets set OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxx
```

### Uso Basico

```typescript
const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${Deno.env.get('OPENROUTER_API_KEY')}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'anthropic/claude-3.5-sonnet',
    messages: [{ role: 'user', content: 'Ola!' }],
  }),
});
```

> **Documentacao completa**: [openrouter-api.md](./openrouter-api.md)

---

**IMPORTANTE:** Sempre documente a API ANTES de começar a integração.
