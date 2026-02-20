---
## PARA CLAUDE (AI INSTRUCTIONS)

Este protocolo é invocado pelo comando `*api` no CLAUDE.md.
Execute conforme as regras definidas no CLAUDE.md e em COMUNICACAO.md.
---

# Protocolo de APIs (*api)

## Quando Usar

- O PRD identificou necessidade de integração externa
- Vai usar uma API de terceiros (OpenAI, Stripe, etc)
- Precisa documentar como usar um serviço externo
- Antes de desenvolver features que dependem de APIs

---

## IMPORTANTE: Sempre Documente ANTES de Codar

**REGRA:** Nunca comece a integrar uma API sem antes documentá-la.

Por que?
1. Evita erros por não conhecer a API
2. Cria referência para consulta durante o desenvolvimento
3. Identifica variáveis de ambiente necessárias
4. Previne surpresas com rate limits ou preços

---

## Comando

```
*api [nome-da-api]     → Pesquisa e documenta a API
*api --listar          → Lista APIs já documentadas
*api --atualizar [nome]→ Atualiza documentação existente
```

### Exemplos

```
*api openai
*api stripe
*api twilio
*api --listar
*api --atualizar openai
```

---

## Processo de Documentação

### Passo 1: Confirmar a API

```
Você digita:
*api openai

Claude responde:
Vou pesquisar e documentar a API da OpenAI.

Encontrei estas opções:
1. OpenAI API (GPT, DALL-E, etc) - openai.com
2. OpenAI Platform - platform.openai.com

Qual é a correta? [1 ou 2]
```

### Passo 2: Pesquisar Documentação

```
Claude:
Pesquisando documentação oficial da OpenAI...

Fontes encontradas:
- Documentação oficial: https://platform.openai.com/docs
- API Reference: https://platform.openai.com/docs/api-reference
- Pricing: https://openai.com/pricing

Baixando e processando...
```

### Passo 3: Criar Documentação

```
Claude:
Criando docs/APIS-DOCS/openai.md...

Documentação criada com:
- Visão geral
- Autenticação
- Endpoints principais
- Rate limits
- Preços
- Exemplos de uso
- Variáveis de ambiente necessárias

Variáveis para adicionar ao .env:
- OPENAI_API_KEY=sk-...

Posso adicionar ao .env.template?
```

### Passo 4: Atualizar Índice

```
Claude:
Atualizando docs/APIS-DOCS/README.md...

APIs documentadas:
- openai (IA)
- stripe (Pagamentos)
- supabase (Banco)

Tarefa de documentação concluída!
```

---

## Template de Documentação

### Estrutura do Arquivo

```markdown
# [Nome da API] - Documentação

| Campo | Valor |
|-------|-------|
| **Nome** | [Nome] |
| **Categoria** | [IA / Pagamento / Auth / Storage / Email / SMS / etc] |
| **Status** | Documentado |
| **Data** | [Data da documentação] |
| **Fonte** | [URL da documentação oficial] |
| **Versão** | [Versão da API, se aplicável] |

---

## 1. Visão Geral

### O que é
[Descrição simples do que a API faz]

### Para que serve neste projeto
[Como vai ser usada no contexto do projeto]

### Alternativas
| Alternativa | Prós | Contras |
|-------------|------|---------|
| [Opção 1] | [+] | [-] |

---

## 2. Autenticação

### Tipo
[API Key / OAuth / JWT / etc]

### Como obter credenciais
1. [Passo 1]
2. [Passo 2]

### Headers necessários
```
Authorization: Bearer [TOKEN]
Content-Type: application/json
```

### Variáveis de ambiente
```
[NOME]_API_KEY=sua-chave-aqui
[NOME]_SECRET=su-secret-aqui
```

---

## 3. Endpoints Principais

### [Endpoint 1]
```
POST /v1/[recurso]
```

**Parâmetros:**
| Nome | Tipo | Obrigatório | Descrição |
|------|------|-------------|-----------|
| param1 | string | Sim | Descrição |

**Exemplo de request:**
```json
{
  "param1": "valor"
}
```

**Exemplo de response:**
```json
{
  "id": "abc123",
  "status": "success"
}
```

### [Endpoint 2]
[Repetir estrutura]

---

## 4. Rate Limits

| Plano | Requisções/min | Tokens/min |
|-------|----------------|------------|
| Free | X | Y |
| Paid | X | Y |

### Estratégia de retry
- Usar exponential backoff
- Implementar circuit breaker
- Cache quando possível

---

## 5. Preços

| Uso | Preço |
|-----|-------|
| [Unidade] | $X por Y |

### Estimativa para este projeto
- [Cenário 1]: ~$X/mês
- [Cenário 2]: ~$Y/mês

---

## 6. SDK e Instalação

### Node.js
```bash
npm install [pacote]
```

### Inicialização
```typescript
import [SDK] from '[pacote]'

const client = new [SDK]({
  apiKey: process.env.[NOME]_API_KEY,
})
```

---

## 7. Exemplos de Uso

### Exemplo 1: [Caso comum]
```typescript
// Código de exemplo
const result = await client.[metodo]({
  param: 'valor'
})

console.log(result)
```

### Exemplo 2: [Com tratamento de erro]
```typescript
try {
  const result = await client.[metodo]({
    param: 'valor'
  })
  return result
} catch (error) {
  if (error.code === 'rate_limit') {
    // Retry logic
  }
  throw error
}
```

---

## 8. Webhooks (se aplicável)

### Eventos disponíveis
| Evento | Quando dispara |
|--------|----------------|
| event.created | [Quando] |

### Verificação de assinatura
```typescript
// Como verificar webhook
```

---

## 9. Erros Comuns

| Código | Significado | Solução |
|--------|-------------|---------|
| 401 | Não autorizado | Verificar API key |
| 429 | Rate limit | Aguardar ou fazer retry |
| 500 | Erro do servidor | Tentar novamente |

---

## 10. Checklist de Integração

Antes de usar em produção:
- [ ] API key configurada em .env
- [ ] Rate limits respeitados
- [ ] Erros tratados
- [ ] Logs implementados
- [ ] Retry com backoff
- [ ] Custos estimados
- [ ] Fallback definido (se crítico)

---

## 11. Links Úteis

- [Documentação oficial]
- [API Reference]
- [SDK]
- [Status page]
- [Changelog]
- [Community/Support]

---

## 12. Notas do Projeto

### Como estamos usando
[Notas específicas do projeto]

### Decisões tomadas
[Decisões sobre uso da API]

### Pendências
- [ ] [Item pendente]
```

---

## APIs Comuns (Referência Rápida)

### Por Categoria

| Categoria | APIs Populares |
|-----------|---------------|
| **IA** | OpenAI, Anthropic, Google AI, Cohere |
| **Pagamentos** | Stripe, PayPal, Mercado Pago |
| **Auth** | Auth0, Clerk, Supabase Auth |
| **Email** | SendGrid, Resend, Postmark |
| **SMS** | Twilio, Vonage |
| **Storage** | AWS S3, Cloudflare R2 |
| **Banco** | Supabase, PlanetScale, Neon |
| **Analytics** | Mixpanel, Amplitude, PostHog |
| **Search** | Algolia, Meilisearch |
| **Maps** | Google Maps, Mapbox |

---

## Integração com PRD

### Detecção Automática

Quando gerar PRD (`*começar` ou `*prd`), verificar menções a:

```
Palavras-chave que indicam necessidade de API:
- "pagamento", "cobrança" → Stripe, Mercado Pago
- "login social", "OAuth" → Auth0, Clerk
- "email", "notificação" → SendGrid, Resend
- "chat", "conversa", "IA" → OpenAI, Anthropic
- "mapa", "localização" → Google Maps
- "SMS", "WhatsApp" → Twilio
- "busca", "pesquisa" → Algolia
```

### Criar Tarefas Automaticamente

```
APIS_DETECTADAS = []

Para cada API detectada:
  if API não está em docs/APIS-DOCS/:
    CRIAR_TAREFA: "*api [nome] - Documentar API"
    BLOQUEAR: Tarefas de desenvolvimento relacionadas

Mostrar ao usuário:
"Identifiquei que o projeto precisa de [X] APIs externas.
 Criei tarefas para documentá-las antes de começar o desenvolvimento.

 Execute *api [nome] para cada uma antes de *desenvolver."
```

---

## Integração com *orquestrar

### Cenário: "Preciso integrar pagamentos"

```
Você:
*orquestrar Preciso integrar pagamentos com Stripe

Claude:
Vou planejar a integração:

1. *api stripe - Documentar a API primeiro (OBRIGATÓRIO)
   → Conhecer endpoints
   → Saber rate limits
   → Entender preços
   → Configurar .env

2. *especificar - Criar spec da feature de pagamentos
   ← Bloqueado até #1 concluído

3. *desenvolver - Implementar integração
   ← Bloqueado até #2 concluído

4. *seguranca - Verificar segurança (PCI, dados de cartão)
   ← Bloqueado até #3 concluído

5. *garantir - Aprovar integração
   ← Bloqueado até #4 concluído

6. *mudança - Documentar no changelog

Posso começar pelo passo 1?
```

---

## Integração com *tarefas

### Template de Tarefa para API

```
*tarefas criar documentar api [nome]
  ├── #1: *api [nome] - Pesquisar e documentar
  ├── #2: Adicionar variáveis ao .env.template
  │   └── Bloqueada por: #1
  ├── #3: Criar cliente/serviço base
  │   └── Bloqueada por: #2
  └── #4: Testar conexão
      └── Bloqueada por: #3
```

---

## Checklist de Qualidade

### Antes de Considerar Documentação Completa

```
□ Nome e categoria identificados
□ Autenticação documentada
□ Endpoints principais listados
□ Rate limits conhecidos
□ Preços estimados
□ SDK/pacote identificado
□ Exemplos de código incluídos
□ Variáveis de ambiente listadas
□ Erros comuns documentados
□ Links oficiais incluídos
□ .env.template atualizado
□ README.md do APIS-DOCS atualizado
```

---

## Resumo para Iniciantes

| Situação | Comando |
|----------|---------|
| Vou usar uma API externa | `*api [nome]` ANTES de codar |
| Quero ver APIs documentadas | `*api --listar` |
| Documentação desatualizada | `*api --atualizar [nome]` |

**Lembre-se:** Documente a API ANTES de começar a integrar. Isso evita erros, surpresas com custos e retrabalho.
