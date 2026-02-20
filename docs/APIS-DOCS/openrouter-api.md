# OpenRouter API - Documentacao Completa

> Documentacao baseada em: https://openrouter.ai/docs
> Ultima atualizacao: 2024

## Indice

1. [Visao Geral](#visao-geral)
2. [Autenticacao](#autenticacao)
3. [Quickstart](#quickstart)
4. [API Reference](#api-reference)
5. [Parametros](#parametros)
6. [Provider Routing](#provider-routing)
7. [Model Routing](#model-routing)
8. [Integracoes com Frameworks](#integracoes-com-frameworks)
9. [Tratamento de Erros](#tratamento-de-erros)
10. [Limites e Rate Limits](#limites-e-rate-limits)
11. [Configuracao no Supabase](#configuracao-no-supabase)

---

## Visao Geral

OpenRouter e uma API unificada que permite acessar centenas de modelos de IA de diferentes provedores (OpenAI, Anthropic, Google, Meta, etc.) atraves de uma unica interface compativel com OpenAI SDK.

### Beneficios

- **API Unificada**: Uma integracao para multiplos provedores
- **OpenAI SDK Compativel**: Use o mesmo codigo, apenas mude o `baseURL`
- **Fallback Automatico**: Configure fallbacks entre provedores
- **Roteamento Inteligente**: Escolha provedores por preco, latencia ou throughput
- **Zero Data Retention (ZDR)**: Opcao para provedores que nao retêm dados

### Base URL

```
https://openrouter.ai/api/v1
```

---

## Autenticacao

### Obter API Key

1. Acesse https://openrouter.ai/keys
2. Crie uma nova API key
3. Armazene de forma segura (use Supabase Secrets para producao)

### Headers Obrigatorios

| Header | Valor | Obrigatorio |
|--------|-------|-------------|
| `Authorization` | `Bearer <OPENROUTER_API_KEY>` | Sim |
| `Content-Type` | `application/json` | Sim |

### Headers Opcionais

| Header | Valor | Descricao |
|--------|-------|-----------|
| `HTTP-Referer` | URL do seu site | Usado para rankings em openrouter.ai |
| `X-Title` | Nome do seu site/app | Usado para rankings em openrouter.ai |

---

## Quickstart

### Opcao 1: OpenRouter SDK (Recomendado)

```bash
npm install @openrouter/sdk
```

```typescript
import OpenRouter from '@openrouter/sdk';

const openrouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

async function main() {
  const completion = await openrouter.chat.completions.create({
    model: 'openai/gpt-4o',
    messages: [{ role: 'user', content: 'Ola, mundo!' }],
  });

  console.log(completion.choices[0].message.content);
}

main();
```

### Opcao 2: OpenAI SDK (Compatibilidade)

```bash
npm install openai
```

```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': process.env.SITE_URL, // Opcional
    'X-Title': process.env.SITE_NAME, // Opcional
  },
});

async function main() {
  const completion = await openai.chat.completions.create({
    model: 'openai/gpt-4o',
    messages: [{ role: 'user', content: 'Ola, mundo!' }],
  });

  console.log(completion.choices[0].message.content);
}

main();
```

### Opcao 3: Fetch Nativo

```typescript
const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
    'Content-Type': 'application/json',
    'HTTP-Referer': process.env.SITE_URL, // Opcional
    'X-Title': process.env.SITE_NAME, // Opcional
  },
  body: JSON.stringify({
    model: 'openai/gpt-4o',
    messages: [{ role: 'user', content: 'Ola, mundo!' }],
  }),
});

const data = await response.json();
console.log(data.choices[0].message.content);
```

---

## API Reference

### Request Schema

```typescript
interface ChatCompletionRequest {
  model: string;
  messages: Message[];
  stream?: boolean;
  temperature?: number;
  top_p?: number;
  top_k?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  repetition_penalty?: number;
  min_p?: number;
  top_a?: number;
  seed?: number;
  max_tokens?: number;
  logit_bias?: Record<string, number>;
  logprobs?: boolean;
  top_logprobs?: number;
  response_format?: ResponseFormat;
  stop?: string | string[];
  tools?: Tool[];
  tool_choice?: 'none' | 'auto' | 'required' | { type: 'function'; function: { name: string } };
  provider?: ProviderPreferences;
  route?: 'fallback';
  transforms?: string[];
  models?: string[];
}

interface Message {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string | ContentPart[];
  name?: string;
  tool_call_id?: string;
}

interface ContentPart {
  type: 'text' | 'image_url';
  text?: string;
  image_url?: { url: string };
}

interface ResponseFormat {
  type: 'text' | 'json_object';
}

interface Tool {
  type: 'function';
  function: {
    name: string;
    description?: string;
    parameters: Record<string, unknown>;
  };
}
```

### Response Schema

```typescript
interface ChatCompletionResponse {
  id: string;
  choices: Choice[];
  created: number;
  model: string;
  object: 'chat.completion';
  system_fingerprint?: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

interface Choice {
  finish_reason: 'stop' | 'length' | 'tool_calls' | 'content_filter';
  index: number;
  message: {
    content: string | null;
    role: 'assistant';
    tool_calls?: ToolCall[];
  };
  logprobs?: {
    content: LogprobsContent[];
  };
}

interface ToolCall {
  id: string;
  type: 'function';
  function: {
    name: string;
    arguments: string;
  };
}
```

### Exemplo de Request Completo

```typescript
const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'anthropic/claude-3.5-sonnet',
    messages: [
      { role: 'system', content: 'Voce e um assistente util.' },
      { role: 'user', content: 'Explique recursao em uma frase.' },
    ],
    temperature: 0.7,
    max_tokens: 1000,
  }),
});
```

---

## Parametros

### Parametros de Sampling

| Parametro | Tipo | Default | Descricao |
|-----------|------|---------|-----------|
| `temperature` | number | 1.0 | Controla aleatoriedade (0-2). Valores mais altos = mais criativo |
| `top_p` | number | 1.0 | Nucleus sampling (0-1). Limita tokens por probabilidade cumulativa |
| `top_k` | number | - | Limita aos K tokens mais provaveis |
| `min_p` | number | - | Probabilidade minima relativa ao token mais provavel |
| `top_a` | number | - | Threshold baseado em probabilidade quadratica |

### Parametros de Penalidade

| Parametro | Tipo | Default | Descricao |
|-----------|------|---------|-----------|
| `frequency_penalty` | number | 0 | Penaliza tokens por frequencia (-2 a 2) |
| `presence_penalty` | number | 0 | Penaliza tokens por presenca (-2 a 2) |
| `repetition_penalty` | number | - | Penalidade geral de repeticao |

### Outros Parametros

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `seed` | number | Seed para reprodutibilidade |
| `max_tokens` | number | Maximo de tokens na resposta |
| `stop` | string[] | Sequencias de parada |
| `logit_bias` | object | Bias para tokens especificos |
| `logprobs` | boolean | Retornar probabilidades dos tokens |
| `response_format` | object | Formato da resposta (`{ type: "json_object" }`) |

### Tool Calling

```typescript
const response = await openai.chat.completions.create({
  model: 'openai/gpt-4o',
  messages: [{ role: 'user', content: 'Qual o tempo em Tokyo?' }],
  tools: [
    {
      type: 'function',
      function: {
        name: 'get_weather',
        description: 'Obtem o tempo atual para uma localizacao',
        parameters: {
          type: 'object',
          properties: {
            location: { type: 'string', description: 'Cidade, ex: Tokyo' },
          },
          required: ['location'],
        },
      },
    },
  ],
  tool_choice: 'auto',
});
```

---

## Provider Routing

O OpenRouter permite controlar qual provedor processa sua requisicao.

### ProviderPreferences Schema

```typescript
interface ProviderPreferences {
  order?: string[]; // Ordem de preferencia de provedores
  allow_fallbacks?: boolean; // Permitir fallbacks (default: true)
  require_parameters?: boolean; // Apenas provedores que suportam todos parametros
  data_collection?: 'allow' | 'deny'; // Politica de coleta de dados
  zdr?: boolean; // Zero Data Retention obrigatorio
  quantizations?: ('fp8' | 'fp16' | 'int4' | 'int8')[]; // Filtro de quantizacao
  sort?: 'price' | 'throughput' | 'latency'; // Ordenar por metrica
  max_latency_ms?: number; // Latencia maxima aceitavel
  min_step?: number; // Minimo throughput (tokens/seg)
}
```

### Exemplos de Provider Routing

```typescript
// Forcar uso de um provedor especifico
{
  model: 'anthropic/claude-3.5-sonnet',
  provider: { order: ['Anthropic'] }
}

// Ordenar por menor preco
{
  model: 'openai/gpt-4o',
  provider: { sort: 'price' }
}

// Ordenar por menor latencia
{
  model: 'meta-llama/llama-3-70b',
  provider: { sort: 'latency' }
}

// Exigir Zero Data Retention
{
  model: 'anthropic/claude-3.5-sonnet',
  provider: { zdr: true }
}

// Nao permitir coleta de dados
{
  model: 'openai/gpt-4o',
  provider: { data_collection: 'deny' }
}

// Apenas provedores com baixa latencia
{
  model: 'meta-llama/llama-3-70b',
  provider: {
    sort: 'latency',
    max_latency_ms: 500
  }
}
```

### Provedores Populares

| Provedor | Modelos Populares |
|----------|-------------------|
| OpenAI | gpt-4o, gpt-4-turbo, gpt-3.5-turbo |
| Anthropic | claude-3.5-sonnet, claude-3-opus |
| Google | gemini-1.5-pro, gemini-1.5-flash |
| Meta | llama-3-70b, llama-3-8b |
| Mistral | mistral-large, codestral |
| DeepSeek | deepseek-coder, deepseek-chat |

---

## Model Routing

### Auto Router

Use `openrouter/auto` para deixar o OpenRouter escolher o melhor modelo:

```typescript
{
  model: 'openrouter/auto',
  messages: [{ role: 'user', content: 'Ola!' }]
}
```

### Fallback Models

Configure modelos de fallback caso o primario falhe:

```typescript
{
  model: 'anthropic/claude-3.5-sonnet',
  models: [
    'anthropic/claude-3-opus',
    'openai/gpt-4o',
    'google/gemini-1.5-pro'
  ],
  route: 'fallback',
  messages: [{ role: 'user', content: 'Ola!' }]
}
```

---

## Integracoes com Frameworks

### Vercel AI SDK

```typescript
import { createOpenRouter } from '@openrouter/vercel-ai-provider';
import { generateText } from 'ai';

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

const { text } = await generateText({
  model: openrouter('anthropic/claude-3.5-sonnet'),
  prompt: 'Ola, mundo!',
});
```

### LangChain

```python
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key="your-openrouter-api-key",
    model="anthropic/claude-3.5-sonnet"
)

response = llm.invoke("Ola, mundo!")
```

### PydanticAI

```python
from pydantic_ai import Agent
from pydantic_ai.models.openai import OpenAIModel

model = OpenAIModel(
    'anthropic/claude-3.5-sonnet',
    base_url='https://openrouter.ai/api/v1',
    api_key='your-openrouter-api-key',
)

agent = Agent(model)
result = agent.run_sync('Ola, mundo!')
print(result.data)
```

---

## Tratamento de Erros

### Formato de Erro

```typescript
interface ErrorResponse {
  error: {
    code: number;
    message: string;
    metadata?: {
      raw?: unknown;
      provider_name?: string;
    };
  };
}
```

### Codigos de Erro

| Codigo | Nome | Descricao |
|--------|------|-----------|
| 400 | Bad Request | Parametros invalidos |
| 401 | Authentication Failed | API key invalida ou ausente |
| 402 | Payment Required | Creditos insuficientes |
| 403 | Forbidden | Acesso negado |
| 408 | Request Timeout | Timeout na requisicao |
| 429 | Rate Limited | Limite de requisicoes excedido |
| 502 | Bad Gateway | Erro no provedor |
| 503 | Service Unavailable | Servico indisponivel |

### Exemplo de Tratamento

```typescript
async function callOpenRouter(messages: Message[]) {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-sonnet',
        messages,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenRouter Error ${error.error.code}: ${error.error.message}`);
    }

    return await response.json();
  } catch (error) {
    if (error.status === 429) {
      // Rate limited - aguarde e tente novamente
      console.log('Rate limited, aguardando...');
      await new Promise(r => setTimeout(r, 60000));
      return callOpenRouter(messages);
    }
    throw error;
  }
}
```

### Erros de Moderacao

Alguns provedores podem bloquear conteudo por moderacao:

```typescript
// Verificar finish_reason
if (response.choices[0].finish_reason === 'content_filter') {
  console.log('Conteudo bloqueado por moderacao');
}
```

---

## Limites e Rate Limits

### Verificar Rate Limits Atuais

```bash
curl -H "Authorization: Bearer $OPENROUTER_API_KEY" \
  https://openrouter.ai/api/v1/auth/key
```

### Limites do Tier Gratuito

| Metrica | Limite |
|---------|--------|
| Requisicoes/minuto | 20 |
| Requisicoes/dia | 200 |

### Limites Baseados em Creditos

- **1 requisicao/segundo por credito** de limite
- Exemplo: Com 10 creditos de limite, voce pode fazer 10 req/seg

### Headers de Rate Limit

```typescript
// Os headers retornados incluem:
{
  'x-ratelimit-limit': '20',     // Limite por minuto
  'x-ratelimit-remaining': '15', // Requisicoes restantes
  'x-ratelimit-reset': '45'      // Segundos ate reset
}
```

---

## Configuracao no Supabase

### Passo 1: Obter API Key do OpenRouter

1. Acesse https://openrouter.ai/keys
2. Clique em "Create Key"
3. Copie a API key gerada

### Passo 2: Adicionar ao Supabase Secrets

#### Via Dashboard (Recomendado para Primeira Vez)

1. Acesse seu projeto no [Supabase Dashboard](https://supabase.com/dashboard)
2. Va em **Project Settings** > **Edge Functions**
3. Na secao "Secrets", clique em "Add secret"
4. Configure:
   - **Name**: `OPENROUTER_API_KEY`
   - **Value**: `sk-or-v1-xxxxxxxxxxxxx`

#### Via CLI

```bash
# Definir o secret
supabase secrets set OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxx

# Verificar secrets configurados
supabase secrets list
```

### Passo 3: Usar no Codigo

#### Edge Functions

```typescript
// supabase/functions/chat/index.ts
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

Deno.serve(async (req) => {
  const apiKey = Deno.env.get('OPENROUTER_API_KEY');

  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'OPENROUTER_API_KEY nao configurado' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const { messages } = await req.json();

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': Deno.env.get('SITE_URL') || 'https://seusite.com',
      'X-Title': Deno.env.get('SITE_NAME') || 'Seu App',
    },
    body: JSON.stringify({
      model: 'anthropic/claude-3.5-sonnet',
      messages,
    }),
  });

  const data = await response.json();
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  });
});
```

### Passo 4: Configurar Variaveis Adicionais (Opcional)

```bash
# URL do seu site (usado para rankings no OpenRouter)
supabase secrets set SITE_URL=https://seusite.com

# Nome do seu app
supabase secrets set SITE_NAME="Meu App Incrivel"
```

### Checklist de Configuracao

- [ ] API Key do OpenRouter obtida em https://openrouter.ai/keys
- [ ] Secret `OPENROUTER_API_KEY` configurado no Supabase
- [ ] (Opcional) `SITE_URL` configurado
- [ ] (Opcional) `SITE_NAME` configurado
- [ ] Teste de conexao realizado com sucesso

### Teste de Conexao

```typescript
// Testar se a integracao esta funcionando
async function testConnection() {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('OPENROUTER_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'openai/gpt-3.5-turbo', // Modelo mais barato para teste
      messages: [{ role: 'user', content: 'Diga "conexao OK"' }],
      max_tokens: 10,
    }),
  });

  if (response.ok) {
    console.log('Conexao com OpenRouter: OK');
    return true;
  } else {
    const error = await response.json();
    console.error('Erro de conexao:', error);
    return false;
  }
}
```

---

## Modelos Populares e Precos (Referencia)

| Modelo | Provider | Contexto | Preco Input/Output (por 1M tokens) |
|--------|----------|----------|-------------------------------------|
| `anthropic/claude-3.5-sonnet` | Anthropic | 200K | $3.00 / $15.00 |
| `anthropic/claude-3-opus` | Anthropic | 200K | $15.00 / $75.00 |
| `openai/gpt-4o` | OpenAI | 128K | $2.50 / $10.00 |
| `openai/gpt-4-turbo` | OpenAI | 128K | $10.00 / $30.00 |
| `google/gemini-1.5-pro` | Google | 1M+ | $1.25 / $5.00 |
| `meta-llama/llama-3-70b` | Meta | 8K | ~$0.50 / $0.50 |
| `deepseek/deepseek-coder` | DeepSeek | 16K | ~$0.14 / $0.28 |

> Precos sujeitos a alteracao. Verifique em https://openrouter.ai/models

---

## Links Uteis

- [Documentacao Oficial](https://openrouter.ai/docs)
- [Lista de Modelos](https://openrouter.ai/models)
- [Criar API Key](https://openrouter.ai/keys)
- [Status da API](https://status.openrouter.ai)
- [Discord](https://discord.gg/openrouter)

---

**Documento gerado para o projeto Empire-Site2**
