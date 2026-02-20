# Arquitetura do Empire Blog

> Documentação técnica de como o projeto será construído.
> 
> Para entender O QUE estamos construindo, consulte `docs/PRD.md`.

---

## Visão Geral

O Empire Blog é uma plataforma de CMS moderna construída com arquitetura serverless, otimizada para performance, SEO e integração com IA.

### Diagrama de Alto Nível

```
┌─────────────────────────────────────────────────────────────────┐
│                         USUÁRIO                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    VERCEL EDGE NETWORK                           │
│              (CDN Global + Serverless Functions)                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     NEXT.JS 14 APP                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │   Frontend   │  │  Server      │  │  Edge        │           │
│  │   (App       │  │  Components  │  │  Functions   │           │
│  │   Router)    │  │  (RSC)       │  │  (API)       │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        SUPABASE                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │  PostgreSQL  │  │    Auth      │  │   Storage    │           │
│  │   (Dados)    │  │  (JWT/RLS)   │  │  (Imagens)   │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
│  ┌──────────────┐  ┌──────────────┐                              │
│  │ Edge         │  │  Realtime    │                              │
│  │ Functions    │  │  (WebSockets)│                              │
│  │ (Jobs/CRON)  │  │              │                              │
│  └──────────────┘  └──────────────┘                              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SERVIÇOS EXTERNOS                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │ Open Router  │  │ ScrapeCreatrs│  │  Google      │           │
│  │   (LLMs)     │  │  (YouTube/   │  │  Analytics   │           │
│  │              │  │   Instagram) │  │              │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
└─────────────────────────────────────────────────────────────────┘
```

---

## Stack Tecnológica (Resumo)

| Camada | Tecnologia | Por que |
|--------|------------|---------|
| **Frontend** | Next.js 14 (App Router) | SSR, ISR, Server Components, performance |
| **Linguagem** | TypeScript | Type safety, DX, manutenibilidade |
| **Estilização** | Tailwind CSS + Design System | Produtividade, consistência visual |
| **UI Components** | shadcn/ui | Base sólida, acessível, customizável |
| **Editor** | TipTap | Flexível, extensível, JSON-based |
| **Backend** | Next.js API Routes + Server Actions | Unified stack, type safety |
| **Banco** | PostgreSQL (Supabase) | Relacional, RLS, realtime |
| **Auth** | Supabase Auth | JWT, OAuth providers, seguro |
| **Storage** | Supabase Storage + Sharp | Integrado, otimização local |
| **Jobs** | Supabase Edge Functions | Serverless, CRON nativo, integrado |
| **Deploy** | Vercel | Edge network, ISR, preview branches |
| **IA** | Open Router | Acesso a 100+ LLMs, unificado |
| **Scraping** | ScrapeCreators API | YouTube/Instagram confiável |

---

## Decisões Arquiteturais Principais

| Decisão | Escolha | Alternativas | Por que |
|---------|---------|--------------|---------|
| **Arquitetura** | Serverless/Edge | VPS tradicional | Escalabilidade automática, custo, performance global |
| **Rendering** | ISR + SSR | SPA/Static | Melhor para SEO, performance, experiência |
| **Banco** | PostgreSQL | MongoDB | Relacional adequado para CMS, RLS nativo |
| **Auth** | Supabase | NextAuth/Clerk | Integração total, RLS, menor custo |
| **Editor** | TipTap | Editor.js/TinyMCE | Mais flexível, JSON nativo, extensível |
| **Jobs** | Edge Functions | Inngest/Bull | Integrado, sem infra extra, suficiente |
| **Imagens** | Sharp + Storage | Cloudinary | Controle total, custo menor, integrado |
| **Cache** | Next.js ISR | Redis/CDN manual | Nativo, invalidação inteligente, simples |

---

## Estrutura de Pastas (Proposta)

```
empire-blog/
├── app/                          # Next.js App Router
│   ├── (public)/                 # Rotas públicas (site)
│   │   ├── page.tsx              # Homepage
│   │   ├── blog/
│   │   │   ├── page.tsx          # Listagem de posts
│   │   │   └── [slug]/           # Post individual
│   │   │       └── page.tsx
│   │   └── api/
│   │       └── webhooks/         # Webhooks externos
│   ├── (admin)/                  # Área administrativa
│   │   ├── layout.tsx            # Layout com sidebar
│   │   ├── page.tsx              # Dashboard
│   │   ├── posts/
│   │   │   ├── page.tsx          # Lista de posts
│   │   │   ├── new/
│   │   │   │   └── page.tsx      # Criar post
│   │   │   └── [id]/
│   │   │       └── page.tsx      # Editar post
│   │   ├── media/
│   │   │   └── page.tsx          # Biblioteca de mídia
│   │   ├── settings/
│   │   │   └── page.tsx          # Configurações
│   │   └── api/
│   │       └── keys/
│   │           └── page.tsx      # Gerenciar API keys
│   ├── api/                      # API Routes
│   │   ├── v1/
│   │   │   ├── posts/
│   │   │   │   └── route.ts      # CRUD posts
│   │   │   ├── media/
│   │   │   │   └── route.ts      # Upload/download
│   │   │   └── webhooks/
│   │   │       └── route.ts      # Configurar webhooks
│   │   └── auth/
│   │       └── callback/
│   │           └── route.ts      # OAuth callback
│   └── layout.tsx                # Root layout
├── components/                   # Componentes React
│   ├── ui/                       # shadcn/ui base
│   ├── editor/                   # TipTap editor
│   │   ├── index.tsx
│   │   ├── toolbar.tsx
│   │   ├── ai-generator.tsx      # Geração IA
│   │   └── seo-panel.tsx         # Painel SEO
│   ├── media/                    # Biblioteca de mídia
│   │   ├── library.tsx
│   │   ├── uploader.tsx
│   │   └── folder-tree.tsx
│   └── admin/                    # Componentes admin
│       ├── sidebar.tsx
│       ├── post-list.tsx
│       └── dashboard-stats.tsx
├── lib/                          # Utilitários
│   ├── supabase/                 # Cliente Supabase
│   │   ├── client.ts             # Cliente browser
│   │   ├── server.ts             # Cliente server
│   │   └── admin.ts              # Cliente admin (RLS bypass)
│   ├── openrouter/               # Integração Open Router
│   │   ├── client.ts
│   │   ├── prompts.ts            # Templates de prompt
│   │   └── types.ts
│   ├── scrapecreators/           # Integração ScrapeCreators
│   │   ├── client.ts
│   │   └── types.ts
│   ├── seo/                      # SEO utilities
│   │   ├── analyzer.ts           # Análise de conteúdo
│   │   ├── generator.ts          # Geração automática
│   │   └── score.ts              # Score de SEO
│   ├── utils.ts                  # Funções utilitárias
│   └── validations.ts            # Zod schemas
├── hooks/                        # React hooks customizados
│   ├── use-auth.ts
│   ├── use-posts.ts
│   ├── use-media.ts
│   └── use-api-key.ts
├── types/                        # TypeScript types
│   ├── database.ts               # Gerado do Supabase
│   ├── post.ts
│   ├── media.ts
│   └── api.ts
├── supabase/                     # Configuração Supabase
│   ├── migrations/               # Migrações SQL
│   ├── functions/                # Edge Functions
│   │   ├── scheduled-publish/    # Publicação agendada
│   │   └── webhook-dispatcher/   # Disparo de webhooks
│   └── seed.sql                  # Dados iniciais
├── public/                       # Assets estáticos
│   └── images/
├── docs/                         # Documentação
│   └── ARQUITETURA/              # Esta pasta
├── tests/                        # Testes
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── .env.local                    # Variáveis locais
├── .env.template                 # Template de env
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Fluxos de Dados Principais

### 1. Criação de Post com IA

```
Usuário → Admin UI → AI Generator (TipTap extension)
                              │
                              ▼
                    Open Router API
                              │
                              ▼
                    Resposta LLM (Markdown)
                              │
                              ▼
                    Conversor → TipTap JSON
                              │
                              ▼
                    Inserção no Editor
```

### 2. Publicação Agendada

```
Cron (1h) → Edge Function (scheduled-publish)
                    │
                    ▼
            Query: posts WHERE status='scheduled' 
                         AND published_at <= now()
                    │
                    ▼
            Update: status='published'
                    │
                    ▼
            Trigger: webhook-dispatcher
                    │
                    ▼
            POST para URLs cadastradas
```

### 3. Transcrição de Vídeo

```
Usuário → Cola URLs → ScrapeCreators API
                              │
                              ▼
                    Extração: título, descrição, transcrição
                              │
                              ▼
                    Open Router (reescrita)
                              │
                              ▼
                    Artigo estruturado → Editor
```

---

## Performance & Otimizações

### Estratégia de Cache

| Camada | Tecnologia | TTL | Invalidação |
|--------|------------|-----|-------------|
| **CDN** | Vercel Edge | Automático | Deploy/ISR |
| **ISR** | Next.js | 60s (blog), 1h (home) | On-demand |
| **Dados** | React Query | 5 min | Mutation/Focus |
| **Imagens** | Next/Image | 1 ano | Filename change |

### Otimizações de Imagem

1. **Upload:** Sharp redimensiona para múltiplos tamanhos
2. **Storage:** WebP/AVIF com fallback JPEG
3. **Entrega:** Next/Image com lazy loading + blur placeholder
4. **CDN:** Vercel Edge Cache

### Core Web Vitals Target

| Métrica | Meta | Estratégia |
|---------|------|------------|
| LCP | < 2.5s | ISR, otimização imagens, font display swap |
| FID | < 100ms | Code splitting, preload crítico |
| CLS | < 0.1 | Size attributes, avoid layout shifts |
| TTFB | < 200ms | Edge functions, global CDN |
| FCP | < 1.8s | Critical CSS inline, preload |

---

## Segurança

### Autenticação & Autorização

```
┌────────────────────────────────────────────────────────────┐
│                     CAMADAS DE SEGURANÇA                   │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  1. EDGE (Vercel)                                          │
│     ├── HTTPS obrigatório                                  │
│     ├── Rate limiting por IP                               │
│     ├── CORS configurado                                   │
│     └── WAF (Web Application Firewall)                     │
│                                                            │
│  2. APPLICATION (Next.js)                                  │
│     ├── Input validation (Zod)                             │
│     ├── XSS sanitization (DOMPurify)                       │
│     ├── CSRF tokens                                        │
│     └── Secure headers (CSP, HSTS, etc)                    │
│                                                            │
│  3. AUTH (Supabase)                                        │
│     ├── JWT tokens (short-lived)                           │
│     ├── Refresh token rotation                             │
│     ├── OAuth providers (Google, GitHub)                   │
│     └── MFA (opcional)                                     │
│                                                            │
│  4. DATABASE (PostgreSQL + RLS)                            │
│     ├── Row Level Security                                 │
│     ├── API keys com escopo limitado                       │
│     ├── Audit logs                                         │
│     └── Encrypted at rest                                  │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### Row Level Security (RLS)

Cada tabela terá políticas RLS:

```sql
-- Exemplo: posts
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Leitura pública para posts publicados
CREATE POLICY "Posts publicados são visíveis" 
ON posts FOR SELECT 
USING (status = 'published');

-- Autor pode ver/editar seus posts
CREATE POLICY "Autor gerencia seus posts" 
ON posts FOR ALL 
USING (auth.uid() = author_id);

-- Admin pode tudo
CREATE POLICY "Admin acesso total" 
ON posts FOR ALL 
USING (is_admin(auth.uid()));
```

---

## Escalabilidade

### Limites Atuais (Supabase Free Tier)

| Recurso | Limite | Estratégia de Upgrade |
|---------|--------|----------------------|
| Database | 500MB | Compressão, cleanup, depois Pro ($25/mês) |
| Auth Users | 50k | Pro ilimitado |
| Storage | 1GB | Otimização, depois Pro (100GB) |
| Edge Functions | 500k req/mês | Cache, depois Pro (2M) |
| Bandwidth | 2GB | CDN Vercel, depois Pro (5GB) |

### Quando Escalar

| Métrica | Ação |
|---------|------|
| DB > 400MB | Implementar compressão de imagens, cleanup logs |
| DB > 500MB | Upgrade para Pro |
| Edge > 400k/mês | Implementar cache agressivo |
| Edge > 500k/mês | Upgrade para Pro |
| Storage > 800MB | Otimização AVIF, depois Pro |

---

## Integrações Externas

### Open Router

**Uso:** Geração de conteúdo, SEO automático
**Rate Limit:** Conforme plano Open Router
**Timeout:** 60s para geração, 30s para SEO
**Retry:** 3 tentativas com backoff exponencial

### ScrapeCreators

**Uso:** Extração de YouTube/Instagram
**Rate Limit:** Conforme plano contratado
**Timeout:** 120s (vídeos longos)
**Queue:** Fila assíncrona, notificação quando pronto

### Google Analytics

**Uso:** Analytics no dashboard
**Implementação:** next/script + GA4
**Privacy:** Cookie consent, IP anonymization

---

## Ambientes

| Ambiente | URL | Propósito |
|----------|-----|-----------|
| **Local** | `http://localhost:3000` | Desenvolvimento |
| **Preview** | `*.vercel.app` | PR reviews, testes |
| **Staging** | `staging.seudominio.com` | Pré-produção (opcional) |
| **Production** | `seudominio.com` | Produção |

### Branch Strategy

```
main ──────────────────────────────► production
  │
  ├── feature/editor-ia ───────────► preview
  │
  ├── fix/seo-bug ─────────────────► preview
  │
  └── hotfix/security ─────────────► production (direto)
```

---

## Documentação Relacionada

| Documento | Descrição | Status |
|-----------|-----------|--------|
| [PRD](../PRD.md) | Requisitos e funcionalidades | ✅ |
| [Stack](./stack.md) | Detalhes das tecnologias | ✅ |
| [Database](./database.md) | Schema e RLS | ✅ |
| [Integrations](./integrations.md) | APIs externas | ✅ |
| [Flows](./flows.md) | Diagramas detalhados | ✅ |

---

## Checklist Pré-Implementação

- [ ] Revisar arquitetura com stakeholders
- [ ] Aprovar stack tecnológica
- [ ] Validar modelagem de dados
- [ ] Confirmar estratégia de segurança
- [ ] Definir domínio de produção
- [ ] Criar contas: Supabase, Vercel, Open Router, ScrapeCreators

---

**Próximo passo sugerido:** `*setup` para configuração do ambiente
