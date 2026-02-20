# Arquitetura do Sistema - Empire Blog Platform

> Documentação técnica completa em: `docs/ARQUITETURA/`

## Stack Tecnológica

| Camada | Tecnologia |
|--------|------------|
| **Frontend** | Next.js 14 + TypeScript + Tailwind CSS |
| **Editor** | TipTap (ProseMirror) |
| **Backend** | Next.js API Routes + Server Actions |
| **Banco de dados** | PostgreSQL (Supabase) |
| **Auth** | Supabase Auth |
| **Storage** | Supabase Storage |
| **Deploy** | Vercel |
| **IA** | Open Router + ScrapeCreators |
| **Busca** | Postgres Full-Text Search |

## Estrutura de Pastas

```
empire-blog/
├── app/                    # Next.js App Router
│   ├── (public)/          # Site público (blog)
│   ├── admin/             # Painel administrativo
│   ├── api/v1/            # REST API
│   └── actions/           # Server Actions
├── components/
│   ├── ui/                # shadcn/ui
│   ├── editor/            # TipTap
│   └── admin/             # Admin components
├── lib/
│   ├── supabase/          # Cliente Supabase
│   ├── openrouter/        # IA integration
│   └── scrapecreators/    # Transcrição
├── supabase/
│   ├── migrations/        # SQL migrations
│   └── functions/         # Edge Functions
└── docs/
    ├── ARQUITETURA/       # Documentação detalhada
    └── PRD.md
```

## Documentação Detalhada

| Arquivo | Conteúdo |
|---------|----------|
| [README.md](ARQUITETURA/README.md) | Visão geral, diagramas, fluxos |
| [stack.md](ARQUITETURA/stack.md) | Detalhes de cada tecnologia |
| [database.md](ARQUITETURA/database.md) | Schema, RLS, relacionamentos |

## Integrações Externas

| Serviço | Função |
|---------|--------|
| **Open Router** | Geração de conteúdo e SEO com IA |
| **ScrapeCreators** | Transcrição de YouTube/Instagram |
| **Google Analytics** | Analytics no dashboard |
| **Supabase** | Banco, Auth, Storage, Edge Functions |

## Decisões Arquiteturais

Ver arquivo [DECISOES.md](DECISOES.md) para histórico de decisões técnicas.

## Data de criação

2026-02-19
