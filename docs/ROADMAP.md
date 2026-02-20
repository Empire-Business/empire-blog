# ROADMAP: Empire Blog Platform

| Campo | Valor |
|-------|-------|
| **Versão** | 1.0 |
| **Última atualização** | 2026-02-19 |
| **Status** | Em planejamento |

> Este roadmap define a ordem de implementação do projeto.
> Consulte o PRD em `docs/PRD.md` para detalhes das funcionalidades.
> Consulte a Arquitetura em `docs/ARQUITETURA/` para detalhes técnicos.

---

## 📋 Resumo Executivo

**Objetivo:** Blog profissional com CMS completo, IA integrada (geração + transcrição + SEO) e API para automação.

**Fases:** 5 fases planejadas

**Status atual:** Fase 0 - Preparação

**Abordagem:** Todas as funcionalidades solicitadas, organizadas em ordem lógica de execução.

---

## 🎯 Visão Geral das Fases

| Fase | Nome | Status | Complexidade | Entregável |
|------|------|--------|--------------|------------|
| 0 | Preparação | [>] Em andamento | S | Ambiente pronto |
| 1 | Fundação | [ ] Pendente | L | Auth + Banco + API Base |
| 2 | CMS Core | [ ] Pendente | XL | Posts + Editor + Mídia |
| 3 | IA & Integrações | [ ] Pendente | L | Open Router + ScrapeCreators |
| 4 | Polish & Launch | [ ] Pendente | M | SEO + Analytics + Deploy |

---

## 📅 FASE 0: Preparação

**Objetivo:** Ter toda documentação e ambiente prontos.

**Status:** Em andamento

### Documentação

| ID | Tarefa | Prioridade | Complexidade | Status |
|----|--------|------------|--------------|--------|
| P0.1 | PRD criado | P0 | M | [x] ✅ |
| P0.2 | Arquitetura definida | P0 | M | [x] ✅ |
| P0.3 | Roadmap criado | P0 | S | [x] ✅ |
| P0.4 | Design System definido | P1 | M | [ ] |

### Ambiente

| ID | Tarefa | Prioridade | Complexidade | Status |
|----|--------|------------|--------------|--------|
| P0.5 | Setup Next.js 14 + TypeScript | P0 | S | [ ] |
| P0.6 | Configurar Tailwind + shadcn/ui | P0 | S | [ ] |
| P0.7 | Criar conta Supabase | P0 | XS | [ ] |
| P0.8 | Criar conta Vercel | P0 | XS | [ ] |
| P0.9 | Criar conta Open Router | P0 | XS | [ ] |
| P0.10 | Criar conta ScrapeCreators | P0 | XS | [ ] |
| P0.11 | Configurar variáveis de ambiente | P0 | S | [ ] |

> 💡 Execute `*setup` para configurar o ambiente técnico.

---

## 📅 FASE 1: Fundação

**Objetivo:** Ter autenticação, banco de dados e API base funcionando.

**Complexidade:** L (Complexo)

**Dependências:** Fase 0 completa

### Banco de Dados

| ID | Tarefa | Prioridade | Complexidade | Status |
|----|--------|------------|--------------|--------|
| F1.1 | Criar schema SQL (migrations) | P0 | M | [ ] |
| F1.2 | Configurar RLS policies | P0 | M | [ ] |
| F1.3 | Criar triggers (updated_at, slug, reading_time) | P0 | S | [ ] |
| F1.4 | Criar views úteis | P1 | S | [ ] |
| F1.5 | Seed data inicial | P1 | XS | [ ] |

### Autenticação

| ID | Tarefa | Prioridade | Complexidade | Status |
|----|--------|------------|--------------|--------|
| F1.6 | Configurar Supabase Auth | P0 | M | [ ] |
| F1.7 | Página de login | P0 | S | [ ] |
| F1.8 | Middleware de proteção (admin) | P0 | S | [ ] |
| F1.9 | Gerenciamento de sessão | P0 | M | [ ] |
| F1.10 | Sistema de roles (admin/editor) | P0 | S | [ ] |

### API Base

| ID | Tarefa | Prioridade | Complexidade | Status |
|----|--------|------------|--------------|--------|
| F1.11 | Sistema de API Keys | P0 | M | [ ] |
| F1.12 | Middleware de autenticação API | P0 | M | [ ] |
| F1.13 | Rate limiting | P1 | S | [ ] |
| F1.14 | Logging de requisições | P1 | S | [ ] |
| F1.15 | Tratamento de erros padronizado | P0 | S | [ ] |

### Critérios de Conclusão da Fase 1

- [ ] Usuário consegue criar conta e logar
- [ ] Middleware protege rotas admin
- [ ] API responde com autenticação via API Key
- [ ] Banco de dados com todas as tabelas criadas
- [ ] RLS funcionando corretamente

---

## 📅 FASE 2: CMS Core

**Objetivo:** Ter o painel admin completo com editor, posts e mídia.

**Complexidade:** XL (Muito complexo - dividido em sub-fases)

**Dependências:** Fase 1 completa

### 2A: Painel Admin Base

| ID | Tarefa | Prioridade | Complexidade | Status |
|----|--------|------------|--------------|--------|
| C2A.1 | Layout admin (sidebar + header) | P0 | M | [ ] |
| C2A.2 | Dashboard com métricas | P1 | M | [ ] |
| C2A.3 | Página de listagem de posts | P0 | M | [ ] |
| C2A.4 | Componentes UI admin (tabelas, filtros) | P0 | M | [ ] |

### 2B: Editor TipTap

| ID | Tarefa | Prioridade | Complexidade | Status |
|----|--------|------------|--------------|--------|
| C2B.1 | Instalar e configurar TipTap | P0 | S | [ ] |
| C2B.2 | Toolbar completa | P0 | M | [ ] |
| C2B.3 | Extensões (headings, lists, links, code) | P0 | M | [ ] |
| C2B.4 | Upload de imagens no editor | P0 | M | [ ] |
| C2B.5 | Preview em tempo real | P1 | S | [ ] |
| C2B.6 | Auto-save de rascunhos | P1 | M | [ ] |
| C2B.7 | Importar/Exportar markdown | P2 | S | [ ] |

### 2C: CRUD de Posts

| ID | Tarefa | Prioridade | Complexidade | Status |
|----|--------|------------|--------------|--------|
| C2C.1 | Criar novo post | P0 | M | [ ] |
| C2C.2 | Editar post existente | P0 | M | [ ] |
| C2C.3 | Listar posts com filtros | P0 | M | [ ] |
| C2C.4 | Deletar/arquivar post | P0 | S | [ ] |
| C2C.5 | Duplicar post | P1 | S | [ ] |
| C2C.6 | Sistema de agendamento | P0 | M | [ ] |
| C2C.7 | Publicar/despublicar | P0 | S | [ ] |

### 2D: Categorias e Tags

| ID | Tarefa | Prioridade | Complexidade | Status |
|----|--------|------------|--------------|--------|
| C2D.1 | CRUD de categorias | P0 | S | [ ] |
| C2D.2 | CRUD de tags | P0 | S | [ ] |
| C2D.3 | Categorias hierárquicas | P2 | M | [ ] |
| C2D.4 | Seleção no editor | P0 | S | [ ] |

### 2E: Biblioteca de Mídia

| ID | Tarefa | Prioridade | Complexidade | Status |
|----|--------|------------|--------------|--------|
| C2E.1 | Upload de arquivos | P0 | M | [ ] |
| C2E.2 | Listagem em grid | P0 | M | [ ] |
| C2E.3 | Drag & drop upload | P1 | S | [ ] |
| C2E.4 | Pastas para organização | P1 | M | [ ] |
| C2E.5 | Busca por nome | P1 | S | [ ] |
| C2E.6 | Edição de alt text | P0 | S | [ ] |
| C2E.7 | Otimização automática (WebP) | P1 | M | [ ] |
| C2E.8 | Delete de arquivos | P0 | S | [ ] |

### 2F: API REST Completa

| ID | Tarefa | Prioridade | Complexidade | Status |
|----|--------|------------|--------------|--------|
| C2F.1 | GET /api/v1/posts (listar) | P0 | S | [ ] |
| C2F.2 | GET /api/v1/posts/:slug (obter) | P0 | S | [ ] |
| C2F.3 | POST /api/v1/posts (criar) | P0 | M | [ ] |
| C2F.4 | PATCH /api/v1/posts/:id (atualizar) | P0 | M | [ ] |
| C2F.5 | DELETE /api/v1/posts/:id (arquivar) | P0 | S | [ ] |
| C2F.6 | POST /api/v1/media/upload | P0 | M | [ ] |
| C2F.7 | GET /api/v1/categories | P0 | S | [ ] |
| C2F.8 | GET /api/v1/tags | P0 | S | [ ] |
| C2F.9 | Documentação da API | P1 | M | [ ] |

### 2G: Blog Público

| ID | Tarefa | Prioridade | Complexidade | Status |
|----|--------|------------|--------------|--------|
| C2G.1 | Homepage do blog | P0 | M | [ ] |
| C2G.2 | Página de listagem de posts | P0 | M | [ ] |
| C2G.3 | Página de post individual | P0 | M | [ ] |
| C2G.4 | Página de categoria | P0 | S | [ ] |
| C2G.5 | Página de tag | P0 | S | [ ] |
| C2G.6 | Navegação e header | P0 | S | [ ] |
| C2G.7 | Footer | P1 | S | [ ] |
| C2G.8 | Design responsivo | P0 | M | [ ] |

### 2H: Webhooks

| ID | Tarefa | Prioridade | Complexidade | Status |
|----|--------|------------|--------------|--------|
| C2H.1 | CRUD de webhooks | P0 | M | [ ] |
| C2H.2 | Dispatcher de eventos | P0 | M | [ ] |
| C2H.3 | Retry com backoff | P1 | M | [ ] |
| C2H.4 | Logs de entrega | P1 | S | [ ] |
| C2H.5 | Assinatura HMAC | P0 | S | [ ] |

### Critérios de Conclusão da Fase 2

- [ ] Admin consegue criar, editar e publicar posts
- [ ] Editor TipTap funciona com todas as formatações
- [ ] Upload de imagens funciona
- [ ] API REST responde corretamente
- [ ] Blog público mostra posts publicados
- [ ] Webhooks disparam em eventos

---

## 📅 FASE 3: IA & Integrações

**Objetivo:** Ter todas as funcionalidades de IA funcionando.

**Complexidade:** L (Complexo)

**Dependências:** Fase 2 completa

### 3A: Open Router - Geração de Conteúdo

| ID | Tarefa | Prioridade | Complexidade | Status |
|----|--------|------------|--------------|--------|
| I3A.1 | Cliente Open Router | P0 | M | [ ] |
| I3A.2 | Interface "Gerar com IA" no editor | P0 | M | [ ] |
| I3A.3 | Seleção de modelo LLM | P0 | S | [ ] |
| I3A.4 | Configuração de palavras | P0 | S | [ ] |
| I3A.5 | Campo de tema/prompt | P0 | S | [ ] |
| I3A.6 | Seleção de tom de voz | P0 | S | [ ] |
| I3A.7 | Opções (exemplos, dados) | P1 | S | [ ] |
| I3A.8 | Conversão markdown → TipTap JSON | P0 | M | [ ] |
| I3A.9 | Inserção no editor | P0 | S | [ ] |
| I3A.10 | Logs de geração | P1 | S | [ ] |

### 3B: ScrapeCreators - Transcrição

| ID | Tarefa | Prioridade | Complexidade | Status |
|----|--------|------------|--------------|--------|
| I3B.1 | Cliente ScrapeCreators | P0 | M | [ ] |
| I3B.2 | Interface "Transformar Vídeos/Posts" | P0 | M | [ ] |
| I3B.3 | Input múltiplo de URLs | P0 | S | [ ] |
| I3B.4 | Validação de URLs (YT/IG) | P0 | S | [ ] |
| I3B.5 | Extração de YouTube | P0 | M | [ ] |
| I3B.6 | Extração de Instagram | P0 | M | [ ] |
| I3B.7 | Reescrita via Open Router | P0 | M | [ ] |
| I3B.8 | Citação automática da fonte | P0 | S | [ ] |
| I3B.9 | Loading states | P0 | S | [ ] |

### 3C: SEO Automático com IA

| ID | Tarefa | Prioridade | Complexidade | Status |
|----|--------|------------|--------------|--------|
| I3C.1 | Botão "Preencher SEO automaticamente" | P0 | S | [ ] |
| I3C.2 | Análise do conteúdo | P0 | M | [ ] |
| I3C.3 | Geração de meta title | P0 | S | [ ] |
| I3C.4 | Geração de meta description | P0 | S | [ ] |
| I3C.5 | Geração de slug otimizado | P0 | S | [ ] |
| I3C.6 | Sugestão de tags | P0 | S | [ ] |
| I3C.7 | Sugestão de categoria | P1 | S | [ ] |
| I3C.8 | Score de SEO (0-100) | P1 | M | [ ] |
| I3C.9 | Preview "Como aparece no Google" | P1 | M | [ ] |
| I3C.10 | Dicas de melhoria | P2 | S | [ ] |

### 3D: Agendamento (Edge Function)

| ID | Tarefa | Prioridade | Complexidade | Status |
|----|--------|------------|--------------|--------|
| I3D.1 | Edge Function scheduled-publish | P0 | M | [ ] |
| I3D.2 | CRON a cada hora | P0 | S | [ ] |
| I3D.3 | Publicação automática | P0 | M | [ ] |
| I3D.4 | Disparo de webhook | P0 | S | [ ] |

### Critérios de Conclusão da Fase 3

- [ ] Admin consegue gerar conteúdo com IA
- [ ] Admin consegue transformar vídeos em artigos
- [ ] SEO automático funciona com um clique
- [ ] Posts agendados publicam automaticamente

---

## 📅 FASE 4: Polish & Launch

**Objetivo:** Otimizações, SEO técnico e deploy.

**Complexidade:** M (Moderado)

**Dependências:** Fase 3 completa

### 4A: SEO Técnico

| ID | Tarefa | Prioridade | Complexidade | Status |
|----|--------|------------|--------------|--------|
| L4A.1 | Meta tags dinâmicas | P0 | S | [ ] |
| L4A.2 | Open Graph tags | P0 | S | [ ] |
| L4A.3 | Twitter Cards | P1 | S | [ ] |
| L4A.4 | Sitemap.xml automático | P0 | S | [ ] |
| L4A.5 | Robots.txt | P0 | XS | [ ] |
| L4A.6 | Canonical URLs | P0 | S | [ ] |
| L4A.7 | JSON-LD (Structured Data) | P1 | M | [ ] |
| L4A.8 | Alt text obrigatório | P0 | S | [ ] |

### 4B: Performance

| ID | Tarefa | Prioridade | Complexidade | Status |
|----|--------|------------|--------------|--------|
| L4B.1 | Otimização de imagens | P0 | M | [ ] |
| L4B.2 | Lazy loading | P0 | S | [ ] |
| L4B.3 | Code splitting | P1 | M | [ ] |
| L4B.4 | Cache strategy (ISR) | P0 | M | [ ] |
| L4B.5 | Font optimization | P1 | S | [ ] |
| L4B.6 | Lighthouse 95+ | P0 | M | [ ] |

### 4C: UX/UI Final

| ID | Tarefa | Prioridade | Complexidade | Status |
|----|--------|------------|--------------|--------|
| L4C.1 | Modo escuro/claro | P1 | M | [ ] |
| L4C.2 | Estados de loading | P0 | S | [ ] |
| L4C.3 | Mensagens de erro | P0 | S | [ ] |
| L4C.4 | Toast notifications | P0 | S | [ ] |
| L4C.5 | Empty states | P1 | S | [ ] |
| L4C.6 | Confirmações (delete, etc) | P0 | S | [ ] |

### 4D: Analytics & Monitoramento

| ID | Tarefa | Prioridade | Complexidade | Status |
|----|--------|------------|--------------|--------|
| L4D.1 | Google Analytics 4 | P1 | S | [ ] |
| L4D.2 | Dashboard com métricas | P1 | M | [ ] |
| L4D.3 | Vercel Analytics | P0 | S | [ ] |
| L4D.4 | Error tracking | P1 | S | [ ] |

### 4E: Deploy & Launch

| ID | Tarefa | Prioridade | Complexidade | Status |
|----|--------|------------|--------------|--------|
| L4E.1 | Configurar domínio | P0 | S | [ ] |
| L4E.2 | Environment variables (prod) | P0 | S | [ ] |
| L4E.3 | Deploy na Vercel | P0 | S | [ ] |
| L4E.4 | Testes finais | P0 | M | [ ] |
| L4E.5 | Backup do banco | P0 | S | [ ] |

### Critérios de Lançamento

- [ ] Lighthouse 95+ em todos os critérios
- [ ] Todas as funcionalidades MUST funcionando
- [ ] Testado em desktop e mobile
- [ ] SEO técnico completo
- [ ] Analytics funcionando
- [ ] Deploy em produção

---

## 📅 FASE 5: Pós-Launch (Backlog)

**Objetivo:** Melhorias futuras e nice-to-haves.

**Status:** Backlog

### SHOULD (Importantes)

| ID | Tarefa | Prioridade | Complexidade | Status |
|----|--------|------------|--------------|--------|
| B5.1 | Preview de posts antes de publicar | P1 | M | Backlog |
| B5.2 | Importação de Markdown | P1 | S | Backlog |
| B5.3 | Importação de WordPress XML | P1 | M | Backlog |
| B5.4 | Busca avançada (se Postgres search não for suficiente) | P1 | L | Backlog |

### COULD (Nice to Have)

| ID | Tarefa | Prioridade | Complexidade | Status |
|----|--------|------------|--------------|--------|
| B5.5 | Comentários com Giscus | P2 | S | Backlog |
| B5.6 | PWA (instalável) | P2 | M | Backlog |
| B5.7 | Newsletter nativa | P2 | L | Backlog |
| B5.8 | Analytics próprio | P2 | XL | Backlog |
| B5.9 | Múltiplos autores | P2 | L | Backlog |
| B5.10 | Multi-idioma | P3 | XL | Backlog |

---

## 📖 Legenda

### Prioridades

| Símbolo | Significado |
|---------|-------------|
| P0 | Obrigatório - não pode faltar |
| P1 | Importante - deve ter logo |
| P2 | Nice to have - quando tiver tempo |
| P3 | Futuro - talvez nunca |

### Complexidade (T-Shirt Sizing)

| Size | Descrição |
|------|-----------|
| XS | Muito simples (< 2h) |
| S | Simples (2-4h) |
| M | Moderado (4-8h) |
| L | Complexo (1-2 dias) |
| XL | Muito complexo (3-5 dias) |

### Status

| Status | Significado |
|--------|-------------|
| [ ] | Pendente |
| [>] | Em andamento |
| [x] | Completo |
| [-] | Bloqueado |

---

## 📊 Status de Pré-requisitos

| Documento | Status | Arquivo |
|-----------|--------|---------|
| PRD | ✅ | docs/PRD.md |
| Arquitetura | ✅ | docs/ARQUITETURA/ |
| Roadmap | ✅ | docs/ROADMAP.md |
| Design | ❌ | docs/DESIGN/ |

> 🔒 Complete todos os pré-requisitos antes de `*desenvolver`.

---

## 📝 Histórico de Mudanças

| Data | Versão | Mudança |
|------|--------|---------|
| 2026-02-19 | 1.0.0 | Criação inicial do roadmap |

---

## Para atualizar este roadmap

- Use `*roadmap` para revisar
- Marque tarefas como completas quando terminar
- Mova tarefas entre fases conforme necessário
- Execute `*status` para ver progresso

---

**Próximo passo sugerido:** `*design` para definir o design system, ou `*setup` para configurar o ambiente técnico.
