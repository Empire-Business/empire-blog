# Stack Tecnológica - Empire Blog Platform

## Visão Geral

Este documento detalha cada tecnologia escolhida, por que foi escolhida, e como será utilizada no projeto.

---

## Frontend

### Framework: Next.js 14 (App Router)

**Escolha:** Next.js 14 com App Router

**Por que:**
- **Server Components:** Renderização no servidor por padrão, melhor SEO e performance
- **ISR (Incremental Static Regeneration):** Páginas estáticas que atualizam automaticamente
- **API Routes:** Backend integrado, sem precisar de servidor separado
- **Edge Runtime:** Funções executam mais perto do usuário
- **Image Optimization:** Otimização automática de imagens
- **Ecossistema:** Grande comunidade, muita documentação

**Como usar:**
```
/app              → App Router (páginas)
/app/api          → API Routes
/app/actions      → Server Actions
```

---

### Linguagem: TypeScript

**Escolha:** TypeScript 5.x

**Por que:**
- **Type safety:** Erros detectados em tempo de desenvolvimento
- **Autocomplete:** IDE mais inteligente
- **Refatoração:** Mais segura e confiável
- **Documentação:** Types servem como documentação viva
- **Integração:** Tipos gerados automaticamente do Supabase

**Como usar:**
```typescript
// types/database.ts - Gerado pelo Supabase CLI
import { Database } from '@/types/database'

type Post = Database['public']['Tables']['posts']['Row']
type PostInsert = Database['public']['Tables']['posts']['Insert']
```

---

### Estilização: Tailwind CSS

**Escolha:** Tailwind CSS 3.x

**Por que:**
- **Utility-first:** CSS sem sair do HTML
- **Performance:** Purge automático de classes não usadas
- **Consistência:** Design tokens padronizados
- **Dark mode:** Suporte nativo com `dark:`
- **Produtividade:** Desenvolvimento muito mais rápido

**Como usar:**
```tsx
// Cores do Design System Empire
<Button className="bg-primary text-white hover:bg-primary-light">
  Publicar
</Button>
```

**Configuração personalizada:**
```javascript
// tailwind.config.ts
colors: {
  primary: {
    dark: '#1e293b',
    DEFAULT: '#3b82f6',
    light: '#60a5fa',
  },
  accent: '#10b981',
}
```

---

### UI Components: shadcn/ui

**Escolha:** shadcn/ui (Radix + Tailwind)

**Por que:**
- **Acessível:** Radix primitives com ARIA completo
- **Customizável:** Código no projeto, não dependência
- **Consistente:** Design system pré-pronto
- **Copy-paste:** Fácil de modificar

**Componentes utilizados:**
- Button, Input, Select, Dialog
- Table, Pagination, Toast
- DropdownMenu, Sheet, Tabs
- Form (com React Hook Form + Zod)

---

### Editor de Texto: TipTap

**Escolha:** TipTap 2.x (baseado em ProseMirror)

**Por que:**
- **Extensível:** Arquitetura de extensões poderosa
- **JSON nativo:** Conteúdo salvo como JSON estruturado
- **Colaboração:** Suporte a edição colaborativa (futuro)
- **Markdown:** Importar/exportar markdown
- **IA Integration:** Fácil integrar geração de IA

**Extensões utilizadas:**
```typescript
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import CodeBlock from '@tiptap/extension-code-block'
import Placeholder from '@tiptap/extension-placeholder'
```

**Formato de dados:**
```json
{
  "type": "doc",
  "content": [
    {
      "type": "heading",
      "attrs": { "level": 2 },
      "content": [{ "type": "text", "text": "Título da Seção" }]
    },
    {
      "type": "paragraph",
      "content": [{ "type": "text", "text": "Conteúdo do parágrafo..." }]
    }
  ]
}
```

---

## Backend

### API: Next.js API Routes + Server Actions

**Escolha:** Híbrido (API Routes para externos, Server Actions para admin)

**Por que:**
- **Unified stack:** Frontend e backend no mesmo projeto
- **Type safety:** Server Actions com tipos compartilhados
- **Auth integrado:** Supabase Auth funciona nativamente
- **Edge Runtime:** APIs rápidas globalmente

**Estrutura:**
```
/app/api/v1/*     → REST API para integrações externas
/app/actions/*    → Server Actions para painel admin
```

---

### Autenticação: Supabase Auth

**Escolha:** Supabase Auth (GoTrue)

**Por que:**
- **Integrado:** Funciona nativamente com RLS
- **Múltiplos providers:** Email, Google, GitHub
- **JWT:** Tokens seguros com refresh automático
- **RLS:** Row Level Security nativo com auth.uid()
- **Gratuito:** 50k usuários no free tier

**Fluxo de login:**
```
1. Usuário submete email/senha
2. Supabase valida e retorna session
3. Session salva em cookie httpOnly
4. Server Components leem session automaticamente
5. RLS usa auth.uid() para filtrar dados
```

---

## Banco de Dados

### PostgreSQL (Supabase)

**Escolha:** PostgreSQL via Supabase

**Por que:**
- **Relacional:** Adequado para CMS (posts, categorias, relacionamentos)
- **RLS:** Row Level Security para segurança no banco
- **Full-text search:** Busca integrada sem serviços externos
- **Extensões:** JSONB, trigram, etc.
- **Backup:** Backup automático diário
- **Gratuito:** 500MB no free tier

**Recursos utilizados:**
- **JSONB:** Armazenar conteúdo do editor TipTap
- **Full-text search:** Busca em posts
- **RLS:** Segurança por linha
- **Triggers:** Auditoria automática
- **Functions:** Lógica no banco quando necessário

---

### Storage: Supabase Storage

**Escolha:** Supabase Storage

**Por que:**
- **Integrado:** Mesma plataforma do banco
- **CDN:** Transformações de imagem automáticas
- **RLS:** Políticas de acesso por arquivo
- **Transformations:** Resize, format conversion na URL

**Transformações de imagem:**
```
# Original
https://xxx.supabase.co/storage/v1/object/public/media/image.jpg

# Redimensionado (Supabase Transformations)
https://xxx.supabase.co/storage/v1/render/image/public/media/image.jpg?width=800&quality=80
```

**Buckets:**
- `media`: Imagens do blog (público para leitura)
- `uploads`: Uploads temporários (privado)

---

## Jobs & Agendamento

### Edge Functions (Supabase)

**Escolha:** Supabase Edge Functions (Deno)

**Por que:**
- **Integrado:** Acesso direto ao banco
- **CRON nativo:** Agendamento sem configuração
- **Serverless:** Escala automaticamente
- **Webhooks:** Disparo de eventos

**Funções planejadas:**

| Função | CRON | Descrição |
|--------|------|-----------|
| `scheduled-publish` | `0 * * * *` | Publica posts agendados |
| `webhook-dispatcher` | On-demand | Dispara webhooks configurados |
| `cleanup-logs` | `0 3 * * *` | Remove logs antigos |

---

## Deploy & Infra

### Hosting: Vercel

**Escolha:** Vercel (Pro se necessário)

**Por que:**
- **Edge Network:** CDN global automática
- **Preview branches:** Cada PR vira URL de preview
- **ISR:** Revalidação de cache inteligente
- **Analytics:** Web Vitals integrados
- **Zero config:** Deploy automático do GitHub

**Configuração:**
```javascript
// next.config.js
module.exports = {
  images: {
    domains: ['xxx.supabase.co'],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    runtime: 'edge',
  },
}
```

---

## Integrações de IA

### Open Router

**Escolha:** Open Router API

**Por que:**
- **Multi-modelo:** Acesso a GPT-4, Claude, Llama, etc.
- **Fallback:** Trocar modelo automaticamente se um falhar
- **Custo:** Pay-per-use, escolher modelo por custo
- **Streaming:** Suporte a streaming para UX melhor

**Casos de uso:**
1. Gerar conteúdo completo (GPT-4 / Claude)
2. Otimizar SEO (modelo mais rápido/mais barato)
3. Resumir conteúdo

**Configuração:**
```env
OPENROUTER_API_KEY=sk-or-v1-...
OPENROUTER_DEFAULT_MODEL=anthropic/claude-3.5-sonnet
OPENROUTER_TIMEOUT_MS=60000
```

---

### ScrapeCreators

**Escolha:** ScrapeCreators API

**Por que:**
- **YouTube:** Transcrição automática de vídeos
- **Instagram:** Extração de posts e reels
- **Confiável:** Não quebra com mudanças das plataformas
- **Rate limiting:** Respeita limites das plataformas

**Casos de uso:**
1. Extrair transcrição de vídeo do YouTube
2. Extrair legenda de post do Instagram
3. Consolidar múltiplos vídeos em um artigo

**Configuração:**
```env
SCRAPECREATORS_API_KEY=sc_...
SCRAPECREATORS_TIMEOUT_MS=120000
```

---

## Busca

### Postgres Full-Text Search

**Escolha:** Busca nativa do PostgreSQL

**Por que:**
- **Gratuito:** Sem custo adicional
- **Integrado:** Funciona com dados existentes
- **Suficiente:** Adequado para volume esperado
- **Português:** Suporte a stemming em português

**Implementação:**
```sql
-- Criar índice de busca
CREATE INDEX posts_search_idx ON posts
USING gin(to_tsvector('portuguese', title || ' ' || content));

-- Query de busca
SELECT * FROM posts
WHERE to_tsvector('portuguese', title || ' ' || content)
      @@ plainto_tsquery('portuguese', 'automação negócios');
```

**Quando escalar:** Se busca for lenta (> 500ms) ou volume aumentar significativamente, migrar para Algolia.

---

## Resumo para Iniciantes

| Termo | O que é | No nosso projeto |
|-------|---------|------------------|
| **Next.js** | Framework React | Constrói as páginas do site |
| **TypeScript** | JavaScript com tipos | Evita erros de tipagem |
| **Tailwind** | Framework CSS | Estiliza as páginas |
| **TipTap** | Editor de texto | Onde você escreve posts |
| **Supabase** | Backend as a Service | Banco + Auth + Storage |
| **PostgreSQL** | Banco relacional | Guarda posts, usuários, etc. |
| **RLS** | Row Level Security | Controla quem vê o quê |
| **Edge Functions** | Funções serverless | Tarefas agendadas |
| **Vercel** | Hosting | Onde o site fica hospedado |
| **Open Router** | API de IA | Gera conteúdo automaticamente |
| **ScrapeCreators** | API de scraping | Extrai conteúdo de vídeos |

---

## Variáveis de Ambiente

```env
# .env.template

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# Open Router
OPENROUTER_API_KEY=sk-or-v1-...
OPENROUTER_DEFAULT_MODEL=anthropic/claude-3.5-sonnet

# ScrapeCreators
SCRAPECREATORS_API_KEY=sc_...

# App
NEXT_PUBLIC_SITE_URL=https://seudominio.com
NEXT_PUBLIC_SITE_NAME=Empire Blog
```

---

**Documento criado em:** 2026-02-19
**Última atualização:** 2026-02-19
