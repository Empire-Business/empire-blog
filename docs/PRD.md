# PRD: Empire Blog Platform

| Campo | Valor |
|-------|-------|
| **One-liner** | Blog profissional com CMS completo, design premium Empire Business, APIs/webhooks para automação com IA |
| **Owner** | Empire Vibe Coding |
| **Status** | Draft |
| **Data** | 2026-02-19 |
| **Stack** | Next.js 14 + Supabase + Vercel |

---

## 1. Resumo para Leigos

### O que é
Um blog profissional completo, similar ao WordPress mas moderno e rápido. Você pode escrever posts usando um editor bonito, agendar publicações para o futuro, gerenciar imagens em uma biblioteca organizada, e o melhor: **publicar automaticamente usando APIs** conectadas a ferramentas de IA como Claude Code.

### Para quem é
- **Você (Admin):** Publica conteúdo via painel administrativo ou automaticamente via API
- **Leitores:** Pessoas que consomem seu conteúdo em um site rápido e bonito
- **Ferramentas de IA:** Claude Code, OpenClaw, ou qualquer sistema que possa fazer chamadas HTTP

### Qual problema resolve
Hoje, para publicar conteúdo de forma profissional, você precisa:
- Usar WordPress (lento, plugins quebrando, segurança complexa)
- Ou codificar tudo manualmente (demorado, técnico)
- Ou usar plataformas limitadas (sem controle, sem APIs)

**Com o Empire Blog:** Você tem um sistema moderno, rápido, seguro, com APIs abertas para automação total.

### Como funciona (passo a passo simples)

1. **Via Painel Admin:**
   - Acesse `/admin`
   - Clique "Novo Post"
   - Escreva no editor rico (como Word)
   - Adicione imagens da biblioteca
   - Escolha data de publicação (agora ou futuro)
   - Publique

2. **Via API (Automação com IA):**
   - Configure sua API key em `/admin/settings`
   - Use Claude Code: "Poste isso no blog via API"
   - O post aparece automaticamente (rascunho ou publicado)

3. **Para Leitores:**
   - Acesse o site
   - Leia posts com carregamento instantâneo
   - Navegue por categorias
   - Busque conteúdo

### O que o usuário consegue fazer
- [ ] Criar posts com editor de texto rico (formatação, listas, links, citações)
- [ ] **Gerar conteúdo automaticamente com IA** (Open Router - escolher modelo, palavras, tema)
- [ ] **Transformar vídeos do YouTube e posts do Instagram em artigos** (ScrapeCreators + Open Router)
- [ ] **Otimizar SEO automaticamente com IA** (meta title, description, tags, slug gerados pela Open Router)
- [ ] Agendar posts para datas futuras
- [ ] Gerenciar imagens em biblioteca organizada (upload, pasta, busca)
- [ ] Publicar automaticamente via API com autenticação segura
- [ ] Receber webhooks quando posts são publicados
- [ ] Ver analytics do Google integrados no painel
- [ ] Otimizar SEO manualmente para cada post (título, descrição, imagem, slug)
- [ ] Gerenciar categorias e tags
- [ ] Personalizar página inicial (hero, featured posts)
- [ ] Modo escuro/claro automático

### O que NÃO faz (importante!)
- [ ] Não tem sistema de comentários nativo (pode adicionar Disqus depois)
- [ ] Não tem múltiplos autores com permissões diferentes (fase 2)
- [ ] Não tem loja/e-commerce
- [ ] Não tem newsletter nativa (integra com Mailchimp/ConvertKit)
- [ ] Não tem multi-idioma (português apenas, por enquanto)

### Benefícios

**Para o autor:**
- Publicação 10x mais rápida com APIs
- Editor visual intuitivo
- SEO automático e manual
- Performance sem se preocupar com servidor

**Para o negócio:**
- SEO otimizado = mais tráfego orgânico
- Performance = melhor ranking Google
- APIs = automação de conteúdo com IA
- Custo baixo (Supabase free tier + Vercel hobby)

### Exemplo Prático (história)

> **Mariana é consultora de negócios...**
>
> **Antes:** Ela usava WordPress, demorava 30 min para formatar cada post, plugins travavam, e ela não conseguia integrar com suas ferramentas de IA para automatizar.
>
> **Depois com Empire Blog:**
> - Mariana quer escrever sobre "automação para pequenas empresas"
> - Ela abre o editor, clica em "✨ Gerar com IA"
> - Escolhe modelo GPT-4, 1000 palavras, tom profissional
> - A IA gera o artigo completo em 30 segundos
> - Ela clica em "🔍 Otimizar SEO" e o sistema preenche title, description e tags automaticamente
> - Mariana revisa, faz ajustes menores e publica
> - Total: 5 minutos vs 30 minutos antes
>
> **Segunda-feira:** Mariana encontra 3 vídeos ótimos no YouTube sobre o tema. Ela copia os links, cola no "🎬 Transformar Vídeos", e o sistema cria um artigo consolidando os insights dos 3 vídeos. Ela edita, adiciona sua opinião e agenda para quarta-feira.
>
> Resultado: Mariana publica 5x mais conteúdo com 10x menos esforço.

### Riscos e Cuidados (em linguagem simples)

| Risco | O que pode acontecer | Como evitar |
|-------|---------------------|-------------|
| Perder API key | Alguém publicar no seu blog | API key em variável de ambiente, rotação periódica |
| Imagens pesadas | Site lento | Otimização automática + AVIF/WebP |
| Banco lotado | Supabase parar de funcionar | Cleanup automático de logs, alertas de uso |
| SEO ruim | Google não indexar | Sitemap automático, meta tags, structured data |

### Glossário Leigo

| Termo | Significado simples |
|-------|---------------------|
| API | "Caixa postal" digital onde programas enviam informações automaticamente |
| Webhook | "Notificação automática" que avisa quando algo acontece |
| SEO | Técnicas para o Google mostrar seu site nas primeiras páginas |
| CMS | Sistema que gerencia conteúdo (posts, imagens) sem programar |
| CDN | Rede que deixa seu site rápido em qualquer lugar do mundo |

---

## 2. Contexto e Problema

### Dor do Usuário
Publicar conteúdo profissional hoje exige:
1. **Complexidade técnica:** WordPress requer manutenção constante, plugins quebram, updates causam problemas
2. **Falta de APIs:** Plataformas modernas (Ghost, Substack) não permitem automação via ferramentas externas
3. **Performance ruim:** Sites em PHP tradicionais são lentos sem cache complexo
4. **Custo oculto:** Plugins premium, hosting, CDN, segurança — tudo soma

### Impacto
- **Quantitativo:** 2-3 horas por semana só com manutenção técnica
- **Qualitativo:** Frustração com tecnologia, menos tempo para criar conteúdo

### Por que agora?
- IA (Claude, GPT) pode gerar e formatar conteúdo automaticamente
- Edge computing (Vercel) permite sites estáticos com APIs dinâmicas
- Supabase oferece Postgres + Auth + Storage gratuito
- Necessidade de separar conteúdo de plataformas proprietárias

### Alternativas atuais

| Alternativa | Prós | Contras |
|-------------|------|---------|
| WordPress | Familiar, plugins infinitos | Lento, inseguro, manutenção pesada |
| Ghost | Moderno, rápido | Pago para recursos decentes, APIs limitadas |
| Substack | Simples, newsletter integrada | Sem controle, sem APIs, branding deles |
| Webflow | Design flexível | Caro, CMS limitado, curva de aprendizado |
| Notion + Super | Fácil de escrever | SEO ruim, sem APIs, dependência Notion |

---

## 3. Objetivos, Não-Objetivos e Definição de Sucesso

### Objetivos
1. Permitir publicação via API em < 5 segundos
2. Performance: Lighthouse 95+ em todos os critérios
3. SEO: Sitemap automático, structured data, meta tags dinâmicas
4. Editor rico: Suporte a headings, listas, imagens, citações, código
5. Biblioteca de mídia: Upload, organização em pastas, busca

### Não-Objetivos (explicitamente fora de escopo)
1. Sistema de comentários nativo (usar Disqus/Talkyard externo)
2. Multi-idioma (i18n) na versão inicial
3. Sistema de newsletter (integrar com Mailchimp/ConvertKit)
4. Múltiplos autores com permissões granulares (fase 2)
5. E-commerce ou monetização nativa
6. **IA gerando e publicando sem revisão humana** (sempre requer aprovação do usuário)
7. **Scraping de conteúdo privado ou protegido** (apenas conteúdo público)

### Definição de Sucesso

| Métrica | Baseline | Meta | Como medir |
|---------|----------|------|------------|
| Lighthouse Performance | 0 | 95+ | Chrome DevTools |
| Lighthouse SEO | 0 | 100 | Chrome DevTools |
| Time to First Byte | - | < 200ms | Vercel Analytics |
| Publicação via API | - | < 5s | Log de requisições |
| Agendamento precisão | - | 100% | Testes automatizados |

---

## 4. Usuários, Personas e Cenários

### Persona Primária: O Autor Técnico

**Nome:** Rafael
**Idade/Perfil:** 32 anos, consultor/criador de conteúdo, confortável com tecnologia
**Dor principal:** Perde tempo com ferramentas que não conversam entre si
**Motivação:** Automatizar publicação para focar em estratégia
**Frustração atual:** WordPress lento, APIs de plataformas fechadas limitadas

### Persona Secundária: O Leitor

**Nome:** Juliana
**Idade/Perfil:** 28 anos, aprende online sobre negócios/tecnologia
**Dor principal:** Sites lentos, experiência ruim no mobile
**Motivação:** Consumir conteúdo de qualidade de forma rápida
**Frustração atual:** Sites que travam, paywalls agressivos

### Jobs To Be Done (JTBD)

| Job | Contexto | Motivação | Resultado esperado |
|-----|----------|-----------|-------------------|
| Publicar post via API | Quero automatizar com IA | Economizar tempo | Post publicado sem abrir navegador |
| Agendar conteúdo | Planejo semanas de posts | Consistência | Posts publicam automaticamente nas datas certas |
| Organizar imagens | Tenho muitas imagens | Encontrar rápido | Biblioteca com pastas e busca funcional |
| Otimizar SEO | Quero tráfego orgânico | Crescer audiência | Meta tags e structured data automáticos |
| Ver analytics | Quero entender o que funciona | Melhorar conteúdo | Dashboard com métricas claras |
| **Gerar conteúdo com IA** | **Tenho ideia mas não tempo de escrever** | **Produzir mais** | **Artigo completo em segundos** |
| **Transformar vídeos em posts** | **Encontro conteúdo ótimo em vídeo** | **Reaproveitar conteúdo** | **Artigo baseado em vídeo do YouTube** |
| **Otimizar SEO com IA** | **Não sei as melhores práticas** | **Ranquear no Google** | **SEO perfeito em um clique** |

### Cenários de Uso

**Cenário 1: Publicação via Claude Code**
1. Rafael escreve artigo no chat com Claude
2. Pede: "Formate e publique no blog via API"
3. Claude faz POST para /api/posts com API key
4. Post aparece como rascunho no painel
5. Rafael revisa e publica (ou agenda)

**Cenário 2: Agendamento semanal**
1. Rafael escreve 5 posts no domingo
2. Define datas: segunda, quarta, sexta das 9h
3. Sistema armazena como "scheduled"
4. Edge function do Supabase verifica a cada hora
5. Na hora certa, post muda para "published"

**Cenário 3: Gestão de mídia**
1. Rafael faz upload de 20 imagens
2. Cria pasta "Artigos/2026/Fevereiro"
3. Organiza imagens nas pastas
4. Busca "gráfico" e encontra imagem relevante
5. Insere no post com legenda e alt text

### Anti-Cenários (quando NÃO usar)
- Site de grande portal de notícias (precisa de CMS enterprise)
- Blog com 50+ autores (precisa de workflow editorial complexo)
- Site com fórum/comunidade ativa (precisa de funcionalidades sociais)

---

## 5. Escopo e Priorização

### MUST (obrigatório para MVP)
- [ ] Setup Next.js + Supabase + Auth
- [ ] Schema do banco (posts, categories, tags, media, users)
- [ ] Editor de texto rico (TipTap ou similar)
- [ ] CRUD de posts completo
- [ ] **Integração Open Router (gerar conteúdo com IA)**
- [ ] **Interface gerador IA (modelo, palavras, tema, tom)**
- [ ] **Integração ScrapeCreators (YouTube, Instagram)**
- [ ] **SEO Automático com Open Router (title, description, tags, slug)**
- [ ] Sistema de agendamento (edge function)
- [ ] Biblioteca de mídia com upload
- [ ] API REST com autenticação (API keys)
- [ ] Webhooks para eventos (post.created, post.published)
- [ ] SEO básico (meta tags, sitemap, robots.txt)
- [ ] Página inicial personalizável
- [ ] Design system implementado

### SHOULD (importante, mas não bloqueante)
- [ ] Otimização de imagens (Sharp/Cloudinary)
- [ ] Google Analytics integrado
- [ ] Busca no site (Algolia ou similar)
- [ ] Modo escuro/claro
- [ ] Preview de posts antes de publicar
- [ ] Importação de posts (Markdown/WordPress XML)

### COULD (nice to have)
- [ ] Analytics próprio (sem Google)
- [ ] Newsletter nativa básica
- [ ] Comentários com Giscus (GitHub Discussions)
- [ ] PWA (instalável)
- [ ] Leitura offline

### WON'T (explicitamente fora)
- [ ] Multi-idioma (complexidade alta, pouco uso inicial)
- [ ] E-commerce (fora do escopo de blog)
- [ ] Membership/paywall (pode adicionar depois com Stripe)

### Critérios de Corte
Cortar se:
- Aumentar complexidade de deployment
- Adicionar mais de 1 semana de trabalho
- Requerer serviço pago obrigatório

---

## 6. Fluxos de Usuário

### Happy Path: Publicação via Painel

1. Usuário acessa `/admin`
2. Faz login com email/senha
3. Clica "Novo Post"
4. Preenche título, conteúdo no editor rico
5. Seleciona categoria e tags
6. Faz upload de imagem destacada
7. Define slug e meta description
8. Escolhe: Publicar agora / Agendar / Salvar rascunho
9. Sistema valida e salva
10. Redireciona para preview ou listagem

### Happy Path: Publicação via API

1. Sistema externo (Claude Code) monta payload JSON
2. Envia POST para `/api/v1/posts` com header `X-API-Key`
3. API valida autenticação
4. Valida dados obrigatórios
5. Salva post como "draft" ou "published" (conforme payload)
6. Dispara webhook `post.created`
7. Retorna 201 com dados do post criado

### Fluxos Alternativos

| Condição | Caminho alternativo |
|----------|---------------------|
| API key inválida | Retorna 401, loga tentativa |
| Dados obrigatórios faltando | Retorna 400 com lista de erros |
| Slug duplicado | Auto-append número ou retorna erro |
| Imagem muito grande | Retorna 413, sugere otimização |
| Agendamento no passado | Trata como "publicar agora" |

### Fluxos de Erro

| Erro | Mensagem | Ação de recuperação |
|------|----------|---------------------|
| Auth falhou | "Credenciais inválidas" | Link para recuperar senha |
| Upload falhou | "Erro ao enviar imagem" | Retry com imagem menor |
| Post não encontrado | "Post não existe" | Botão "Voltar para lista" |
| API rate limit | "Muitas requisições" | Retry after header |

### Estados do Sistema

| Estado | Descrição | Próximo estado |
|--------|-----------|----------------|
| draft | Post em edição | published, scheduled |
| scheduled | Agendado para futuro | published (automático) |
| published | Ao vivo no site | archived, draft |
| archived | Removido do site visível | draft, published |

---

## 7. Requisitos Funcionais (FR)

### FR-001: Autenticação e Autorização

**Descrição:**
Sistema de login seguro para painel admin e autenticação via API keys.

**Regras de negócio:**
- RN1: Login via email/senha usando Supabase Auth
- RN2: Senha mínima 8 caracteres, 1 maiúscula, 1 número
- RN3: API keys geradas no painel, revogáveis
- RN4: Rate limit: 100 req/min por API key

**Exemplos:**
- Se usuário errar senha 5x, bloquear por 15 minutos
- Se API key for revogada, todas as requisições falham imediatamente

**Permissões (RBAC):**
| Role | Pode ver? | Pode editar? | Pode deletar? |
|------|-----------|--------------|---------------|
| Admin | Tudo | Tudo | Tudo |
| Editor | Posts, Mídia | Posts próprios | Posts próprios |

**Erros:**
| Código | Mensagem | Causa |
|--------|----------|-------|
| AUTH001 | "Email ou senha incorretos" | Credenciais inválidas |
| AUTH002 | "Conta bloqueada temporariamente" | Múltiplas tentativas falhas |
| AUTH003 | "API key inválida ou expirada" | Key não existe ou revogada |

---

### FR-002: Gerenciamento de Posts

**Descrição:**
CRUD completo de posts com editor rico, SEO e agendamento.

**Regras de negócio:**
- RN1: Título obrigatório, máx 200 caracteres
- RN2: Slug único, auto-gerado do título, editável
- RN3: Conteúdo em formato JSON (TipTap/ProseMirror)
- RN4: Agendamento usa timezone do usuário
- RN5: Soft delete (posts são arquivados, não apagados)

**Entradas:**
| Campo | Tipo | Obrigatório | Validação |
|-------|------|-------------|-----------|
| title | string | Sim | 1-200 chars |
| slug | string | Sim | único, a-z0-9- |
| content | JSON | Sim | estrutura válida |
| excerpt | string | Não | máx 300 chars |
| featured_image | UUID | Não | referência mídia |
| category_id | UUID | Não | referência válida |
| tags | array | Não | array de strings |
| status | enum | Sim | draft/scheduled/published/archived |
| published_at | datetime | Condicional | obrigatório se scheduled/published |
| meta_title | string | Não | máx 60 chars |
| meta_description | string | Não | máx 160 chars |

**Estados:**
```
draft → published
      → scheduled → published (automático)
      → archived

published → archived
          → draft

scheduled → published (automático)
          → draft

archived → draft
         → published
```

---

### FR-003: Biblioteca de Mídia

**Descrição:**
Sistema completo de gerenciamento de imagens e arquivos.

**Regras de negócio:**
- RN1: Storage no Supabase com CDN automático
- RN2: Otimização automática (WebP/AVIF)
- RN3: Tamanho máximo: 10MB por arquivo
- RN4: Formatos: JPG, PNG, GIF, WebP, SVG
- RN5: Organização em pastas hierárquicas
- RN6: Alt text obrigatório para acessibilidade

**Entradas:**
| Campo | Tipo | Obrigatório | Validação |
|-------|------|-------------|-----------|
| file | File | Sim | < 10MB, formato válido |
| folder_id | UUID | Não | referência pasta |
| alt_text | string | Sim | máx 200 chars |
| caption | string | Não | máx 500 chars |

**Funcionalidades:**
- Upload drag & drop
- Busca por nome
- Filtro por pasta
- Miniaturas automáticas
- Inserção no editor com legenda

---

### FR-004: API REST para Posts

**Descrição:**
Endpoints RESTful para operações CRUD via código.

**Endpoints:**

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | /api/v1/posts | Listar posts (paginado) |
| GET | /api/v1/posts/:id | Obter post específico |
| POST | /api/v1/posts | Criar novo post |
| PATCH | /api/v1/posts/:id | Atualizar post |
| DELETE | /api/v1/posts/:id | Arquivar post |

**Autenticação:**
Header: `X-API-Key: sua-api-key-aqui`

**POST /api/v1/posts - Exemplo Request:**
```json
{
  "title": "Meu Novo Artigo",
  "content": {
    "type": "doc",
    "content": [
      {
        "type": "paragraph",
        "content": [
          {"type": "text", "text": "Conteúdo do artigo..."}
        ]
      }
    ]
  },
  "status": "draft",
  "category": "tecnologia",
  "tags": ["nextjs", "supabase"]
}
```

**Resposta 201:**
```json
{
  "id": "uuid-do-post",
  "slug": "meu-novo-artigo",
  "status": "draft",
  "created_at": "2026-02-19T21:00:00Z",
  "url": "https://seudominio.com/blog/meu-novo-artigo"
}
```

---

### FR-005: Sistema de Webhooks

**Descrição:**
Notificações HTTP quando eventos importantes ocorrem.

**Eventos Disponíveis:**
- `post.created` - Post criado
- `post.published` - Post publicado
- `post.updated` - Post atualizado
- `post.archived` - Post arquivado
- `media.uploaded` - Mídia enviada

**Payload de Webhook:**
```json
{
  "event": "post.published",
  "timestamp": "2026-02-19T21:00:00Z",
  "data": {
    "id": "uuid",
    "title": "Título do Post",
    "slug": "titulo-do-post",
    "url": "https://seudominio.com/blog/titulo-do-post"
  }
}
```

**Configuração:**
- URLs de webhook cadastradas no painel
- Retry automático (3 tentativas com backoff)
- Assinatura HMAC para verificação
- Logs de entrega

---

### FR-006: SEO e Metadados

**Descrição:**
Otimização completa para motores de busca.

**Funcionalidades:**
- Meta tags dinâmicas (title, description, OG, Twitter)
- Structured data (JSON-LD) automático
- Sitemap.xml gerado automaticamente
- Robots.txt configurável
- Canonical URLs automáticas
- Alt text obrigatório para imagens

**Meta Tags por Página:**
| Página | Title | Description |
|--------|-------|-------------|
| Home | "Nome do Blog - Tagline" | Descrição do site |
| Post | "Título do Post | Nome do Blog" | Excerpt ou meta_description |
| Categoria | "Categoria | Nome do Blog" | Descrição da categoria |

---

### FR-007: Agendamento de Posts

**Descrição:**
Publicação automática em datas/horários futuros.

**Implementação:**
- Supabase Edge Function executada a cada hora
- Verifica posts com `status = 'scheduled'` e `published_at <= now()`
- Atualiza para `status = 'published'`
- Dispara webhook `post.published`

**Regras:**
- Se `published_at` no passado ao criar → publica imediatamente
- Se alterar `published_at` de futuro para passado → publica
- Se alterar `published_at` de passado para futuro → agenda

---

### FR-008: Geração de Conteúdo com IA (Open Router)

**Descrição:**
Integração com Open Router para gerar posts automaticamente usando qualquer modelo de LLM disponível mundialmente.

**Funcionalidades:**
- Interface no editor para gerar conteúdo com IA
- Seleção de modelo LLM (GPT-4, Claude, Llama, etc.)
- Definição de número de palavras desejado
- Campo para inserir ideia/tema do post
- Geração automática no editor de texto rico

**Interface de Geração:**
```
┌─────────────────────────────────────────────────────┐
│  ✨ Gerar Conteúdo com IA                            │
├─────────────────────────────────────────────────────┤
│  Modelo LLM: [ GPT-4 ▼ ]                            │
│  Palavras: [ 800 ▼ ] (200-3000)                     │
│                                                      │
│  Sobre o que você quer escrever?                     │
│  ┌──────────────────────────────────────────────┐   │
│  │ Como escalar um negócio usando automação...  │   │
│  └──────────────────────────────────────────────┘   │
│                                                      │
│  Tom de voz: [ Profissional ▼ ]                     │
│  [✓] Incluir exemplos práticos                      │
│  [ ] Incluir dados estatísticos                     │
│                                                      │
│           [ Gerar Conteúdo ]                        │
└─────────────────────────────────────────────────────┘
```

**Regras de negócio:**
- RN1: Máximo 3000 palavras por geração (evitar timeouts)
- RN2: Mínimo 200 palavras (conteúdo relevante)
- RN3: Prompt engineering otimizado para cada tom de voz
- RN4: Conteúdo gerado é inserido no editor como rascunho
- RN5: Usuário deve revisar antes de publicar
- RN6: Histórico de gerações salvo para referência

**Prompt Engineering:**
- Contexto do blog e nicho fornecido automaticamente
- Instruções de formatação (headings, listas, parágrafos)
- Tom de voz configurável (profissional, casual, técnico, persuasivo)
- Solicitação de exemplos e dados conforme opções marcadas

**Entradas:**
| Campo | Tipo | Obrigatório | Validação |
|-------|------|-------------|-----------|
| model | string | Sim | modelo disponível na Open Router |
| word_count | number | Sim | 200-3000 |
| prompt | string | Sim | mínimo 10 caracteres |
| tone | enum | Sim | professional, casual, technical, persuasive |
| include_examples | boolean | Não | default false |
| include_data | boolean | Não | default false |

**Fluxo:**
1. Usuário preenche formulário de geração
2. Sistema valida inputs
3. Envia request para Open Router API
4. Aguarda resposta (streaming opcional)
5. Converte resposta markdown para formato TipTap
6. Insere no editor
7. Salva referência da geração no banco

**Erros:**
| Código | Mensagem | Causa |
|--------|----------|-------|
| AI001 | "Erro na geração. Tente novamente." | Timeout ou erro da API |
| AI002 | "Modelo indisponível no momento" | Modelo fora do ar |
| AI003 | "Prompt muito curto" | Menos de 10 caracteres |
| AI004 | "Limite de tokens excedido" | Conteúdo muito longo |

---

### FR-009: Transcrição de Conteúdo (ScrapeCreators + Open Router)

**Descrição:**
Integração com ScrapeCreators para transcrever conteúdo de Instagram e YouTube e transformar em posts de blog usando Open Router.

**Funcionalidades:**
- Input múltiplo de links (Instagram posts/reels, YouTube videos)
- Extração automática de título, descrição e transcrição
- Transformação em artigo de blog estruturado
- Preservação de insights e pontos principais

**Interface de Transcrição:**
```
┌─────────────────────────────────────────────────────┐
│  🎬 Transformar Vídeos/Posts em Artigo               │
├─────────────────────────────────────────────────────┤
│  Cole os links (um por linha):                       │
│  ┌──────────────────────────────────────────────┐   │
│  │ https://youtube.com/watch?v=...              │   │
│  │ https://instagram.com/p/...                  │   │
│  │ https://youtube.com/shorts/...               │   │
│  └──────────────────────────────────────────────┘   │
│                                                      │
│  Formato de saída: [ Artigo de Blog ▼ ]             │
│  Comprimento: [ Médio (~800 palavras) ▼ ]           │
│  Estilo: [ Resumo com insights ▼ ]                  │
│                                                      │
│           [ Analisar e Extrair ]                    │
└─────────────────────────────────────────────────────┘
```

**Regras de negócio:**
- RN1: Máximo 5 links por vez (evitar sobrecarga)
- RN2: Apenas links públicos (sem login necessário)
- RN3: Suporte: YouTube (vídeos, shorts), Instagram (posts, reels)
- RN4: Conteúdo extraído processado via Open Router para reescrita
- RN5: Crédito automático à fonte original
- RN6: Extração leva 10-60s dependendo do tamanho

**Processo Técnico:**
1. Validação dos links (formato correto)
2. Envio para ScrapeCreators API
3. Aguarda extração de:
   - Título do vídeo/post
   - Descrição/transcrição completa
   - Duração (YouTube)
   - Autor/Canal
   - Data de publicação
4. Monta prompt para Open Router com contexto
5. Gera artigo estruturado mantendo insights
6. Insere no editor com citação da fonte

**Entradas:**
| Campo | Tipo | Obrigatório | Validação |
|-------|------|-------------|-----------|
| urls | array | Sim | 1-5 URLs válidas |
| output_format | enum | Sim | blog_post, summary, bullet_points |
| length | enum | Sim | short, medium, long |
| style | enum | Sim | summary, detailed, key_insights |
| include_timestamps | boolean | Não | apenas YouTube |

**Fontes Suportadas:**
| Plataforma | Tipo | Extração |
|------------|------|----------|
| YouTube | Vídeo | Título, descrição, transcrição (CC) |
| YouTube | Shorts | Título, descrição, legendas |
| Instagram | Post | Legenda, comentários principais |
| Instagram | Reel | Legenda, áudio transcrito |

**Erros:**
| Código | Mensagem | Causa |
|--------|----------|-------|
| SC001 | "Link inválido ou não suportado" | URL não reconhecida |
| SC002 | "Conteúdo privado ou indisponível" | Requer login ou foi removido |
| SC003 | "Limite de 5 links excedido" | Mais de 5 URLs |
| SC004 | "Erro na extração. Tente outro link." | Falha na ScrapeCreators |
| SC005 | "Vídeo muito longo" | Excede limite da plataforma |

---

### FR-010: SEO Automático com IA (Open Router)

**Descrição:**
Botão para preencher automaticamente todos os campos de SEO usando Open Router com boas práticas de otimização para motores de busca.

**Funcionalidades:**
- Análise inteligente do conteúdo do post
- Geração otimizada de:
  - Meta title (50-60 caracteres)
  - Meta description (150-160 caracteres)
  - Slug otimizado
  - Tags relevantes (5-8 tags)
  - Categoria sugerida
  - Keywords principais
  - Alt text para imagens

**Botão SEO Inteligente:**
```
┌─────────────────────────────────────────────────────┐
│  🔍 Campos de SEO                                     │
│                                                      │
│  [ ✨ Preencher Automaticamente com IA ] ← BOTÃO    │
│                                                      │
│  Meta Title:     [_____________________] 0/60       │
│  Meta Desc:      [_____________________] 0/160      │
│  Slug:           [_____________________]            │
│  Tags:           [ tag1 ] [ tag2 ] [ + ]            │
│  Categoria:      [ Selecione ▼ ]                   │
│  Keywords:       [_____________________]            │
└─────────────────────────────────────────────────────┘
```

**Boas Práticas de SEO Implementadas (pesquisa e documentação):**

**Meta Title:**
- 50-60 caracteres ( Google's display limit)
- Palavra-chave principal no início
- Marca no final separada por pipe
- Atrativo para CTR (click-through rate)
- Único por página
- Exemplo: "Como Escalar Negócios | Empire Blog"

**Meta Description:**
- 150-160 caracteres
- Inclui call-to-action implícito
- Palavra-chave principal incluída naturalmente
- Resumo persuasivo do conteúdo
- Única por página

**Slug:**
- Curto e descritivo (3-5 palavras)
- Palavra-chave incluída
- Hífens como separadores
- Sem stop words (de, a, o, para)
- Minúsculas

**Tags:**
- 5-8 tags relevantes
- Mix de broad e long-tail
- Relacionadas ao tópico principal
- Separadas por vírgula

**Estrutura de Dados (JSON-LD):**
- Article schema para posts
- BreadcrumbList para navegação
- Organization schema para site
- Person schema para autores

**Otimizações Técnicas:**
- Canonical URL automática
- Open Graph tags (Facebook/LinkedIn)
- Twitter Cards
- Imagens com dimensões corretas (1200x630 OG)

**Regras de negócio:**
- RN1: Análise completa do conteúdo antes de gerar
- RN2: Sugestões baseadas em keywords do conteúdo
- RN3: Evita keyword stuffing (máximo 2% densidade)
- RN4: Compatível com SEO local se necessário
- RN5: Preview em tempo real de como aparece no Google
- RN6: Score de SEO (0-100) baseado em checklist

**Prompt Engineering para SEO:**
```
Analise o seguinte artigo e gere metadados SEO otimizados:

[TEXTO DO ARTIGO]

Requisitos:
1. Meta title: 50-60 chars, keyword no início, atrativo
2. Meta description: 150-160 chars, CTA, resumo persuasivo  
3. Slug: curto, descritivo, keyword, hífens
4. Tags: 5-8 tags relevantes (broad + long-tail)
5. Keywords principais: 3-5 termos de busca

Boas práticas:
- Título deve gerar curiosidade ou promessa clara
- Description deve incluir benefício ao leitor
- Slug deve ser memorável e shareable
- Tags devem cobrir tópicos relacionados

Retorne em formato JSON estruturado.
```

**Score de SEO:**
| Critério | Pontos | Status |
|----------|--------|--------|
| Title length (50-60) | 15 | ✓/✗ |
| Description length (150-160) | 15 | ✓/✗ |
| Keyword in title | 10 | ✓/✗ |
| Keyword in first 100 words | 10 | ✓/✗ |
| Alt text em todas imagens | 10 | ✓/✗ |
| Internal links (2+) | 10 | ✓/✗ |
| External links (1+) | 10 | ✓/✗ |
| Heading structure (H1→H2→H3) | 10 | ✓/✗ |
| URL otimizada | 10 | ✓/✗ |

**Total:** 100 pontos
- 90-100: Excelente 🟢
- 70-89: Bom 🟡
- < 70: Precisa melhorar 🔴

**Entradas:**
| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| content | JSON | Sim | Conteúdo do post em formato TipTap |
| title | string | Sim | Título atual do post |
| target_keyword | string | Não | Keyword principal desejada |

**Saídas:**
| Campo | Tipo | Descrição |
|-------|------|-----------|
| meta_title | string | 50-60 caracteres |
| meta_description | string | 150-160 caracteres |
| slug | string | Otimizado para SEO |
| tags | array | Array de strings |
| category | string | Categoria sugerida |
| keywords | array | Keywords principais |
| score | number | Pontuação 0-100 |
| suggestions | array | Dicas de melhoria |

**Integração com Editor:**
- Botão visível na sidebar de SEO
- Preview "Como aparece no Google"
- Aplicação em um clique (com confirmação)
- Undo disponível

---

## 8. Requisitos Não-Funcionais (NFR)

### Performance

| Métrica | Meta | Como medir |
|---------|------|------------|
| Time to First Byte (TTFB) | < 200ms | Vercel Analytics |
| Largest Contentful Paint (LCP) | < 2.5s | Lighthouse |
| First Input Delay (FID) | < 100ms | Lighthouse |
| Cumulative Layout Shift (CLS) | < 0.1 | Lighthouse |
| API p95 response time | < 300ms | Logs |

### Disponibilidade
- **SLO:** 99.9% uptime
- **Backup:** Diário automático do Supabase

### Segurança
- [ ] Rate limiting em todas as APIs
- [ ] API keys nunca expostas no frontend
- [ ] Row Level Security (RLS) no Supabase
- [ ] HTTPS obrigatório
- [ ] CSP headers configurados
- [ ] Sanitização de inputs (XSS prevention)
- [ ] SQL injection prevention (via ORM/params)

### Privacidade (LGPD)
- [ ] Dados PII identificados (email, IP em logs)
- [ ] Política de retenção: logs 90 dias, analytics 2 anos
- [ ] Função de exclusão de conta (com confirmação)
- [ ] Exportação de dados pessoais
- [ ] Consentimento para cookies/analytics

### Observabilidade
- [ ] Logs estruturados (JSON)
- [ ] Métricas de negócio: posts/publicados, uploads, logins
- [ ] Alertas: erro > 1%, API > 500ms, storage > 80%
- [ ] Vercel Analytics ativo

### Acessibilidade
- [ ] WCAG 2.1 AA compliance
- [ ] Navegação 100% por teclado
- [ ] Contraste mínimo 4.5:1
- [ ] Textos alternativos para todas as imagens
- [ ] Skip links, landmarks ARIA

### Resiliência
- [ ] Retry com backoff exponencial em webhooks
- [ ] Idempotência em operações de API
- [ ] Graceful degradation se analytics falhar

---

## 9. UX Notes

### Princípios de UI (baseado nos mockups Empire Business)

1. **Espaçamento generoso:** Padding de 24-48px entre seções
2. **Cards elevados:** Sombras suaves (shadow-sm, shadow-md)
3. **Tipografia hierárquica:** Serif para headlines, sans-serif para body
4. **Cores consistentes:** Azul para primário, slate para neutros
5. **Micro-interações:** Hover states sutis, transitions 200ms

### Microcopy

| Elemento | Texto |
|----------|-------|
| Botão primário | "Publicar Post" |
| Botão secundário | "Salvar Rascunho" |
| Mensagem de sucesso | "Post publicado com sucesso!" |
| Mensagem de erro | "Algo deu errado. Tente novamente." |
| Loading | "Carregando..." |
| Empty state | "Nenhum post encontrado. Crie o primeiro!" |

### Estados

| Estado | Aparência | Texto |
|--------|-----------|-------|
| Loading | Spinner azul | "Carregando..." |
| Empty | Ícone + ilustração | "Nada por aqui ainda" |
| Error | Ícone vermelho | "Erro ao carregar. Tente novamente." |
| Success | Check verde | "Sucesso!" |
| Saving | Spinner pequeno | "Salvando..." |

---

## 10. Dados e Modelo

### Entidades Principais

| Entidade | Campos principais | Relacionamentos |
|----------|-------------------|-----------------|
| **users** | id, email, role, created_at | 1:N posts, 1:N media |
| **posts** | id, title, slug, content, status, published_at, author_id | N:1 users, N:1 categories, N:N tags |
| **categories** | id, name, slug, description | 1:N posts |
| **tags** | id, name, slug | N:N posts |
| **media** | id, filename, url, alt_text, folder_id | N:1 users, N:1 folders |
| **folders** | id, name, parent_id | 1:N media, 1:N folders (hierárquia) |
| **api_keys** | id, key_hash, name, user_id, last_used | N:1 users |
| **webhooks** | id, url, events, secret, active | - |

### Campos PII (dados pessoais)

| Campo | Entidade | Justificativa | Retenção |
|-------|----------|---------------|----------|
| email | users | Autenticação | Até exclusão |
| ip_address | logs | Segurança/auditoria | 90 dias |
| user_agent | logs | Debug/analytics | 90 dias |

### Políticas
- **Retenção de posts:** Indefinido (soft delete)
- **Retenção de mídia:** Até exclusão manual
- **Retenção de logs:** 90 dias
- **Retenção de analytics:** 2 anos
- **Consentimento:** Opt-in para analytics, explícito para newsletter

---

## 11. Integrações e APIs

### APIs Externas

| API | Categoria | Status | Documentação |
|-----|-----------|--------|--------------|
| Google Analytics | Analytics | Obrigatório | docs/API.md#ga |
| Supabase Storage | Storage | Obrigatório | docs/API.md#storage |
| Vercel | Hosting/CDN | Obrigatório | - |
| **Open Router** | **IA/LLM** | **Obrigatório** | docs/API.md#openrouter |
| **ScrapeCreators** | **Scraping** | **Obrigatório** | docs/API.md#scrapecreators |

#### Open Router
**Propósito:** Gerar conteúdo e otimizar SEO usando modelos de linguagem
**Modelos Suportados:** GPT-4, Claude 3, Llama 3, Mistral, e 100+ modelos
**Rate Limits:** Consultar documentação Open Router
**Custo:** Pay-per-use (tokens de entrada/saída)

**Variáveis de Ambiente:**
```
OPENROUTER_API_KEY=sk-or-v1-...
OPENROUTER_DEFAULT_MODEL=anthropic/claude-3.5-sonnet
OPENROUTER_TIMEOUT_MS=60000
```

**Checklist Open Router:**
- [ ] Executar `*api openrouter` para documentar detalhes
- [ ] Adicionar variáveis ao .env.template
- [ ] Estimar custos mensais (baseado em volume de posts)
- [ ] Configurar rate limiting por usuário
- [ ] Implementar fallback para modelos alternativos

#### ScrapeCreators
**Propósito:** Extrair conteúdo de YouTube e Instagram para reescrita
**Fontes:** YouTube (vídeos, shorts), Instagram (posts, reels)
**Rate Limits:** Verificar plano contratado
**Custo:** Conforme plano ScrapeCreators

**Variáveis de Ambiente:**
```
SCRAPECREATORS_API_KEY=sc_...
SCRAPECREATORS_TIMEOUT_MS=120000
```

**Checklist ScrapeCreators:**
- [ ] Executar `*api scrapecreators` para documentar
- [ ] Adicionar variáveis ao .env.template
- [ ] Testar com diferentes tipos de conteúdo
- [ ] Implementar filas para processamento async

### Endpoints da API Interna

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | /api/v1/posts | Listar posts | API Key |
| GET | /api/v1/posts/:slug | Obter post | Público |
| POST | /api/v1/posts | Criar post | API Key |
| PATCH | /api/v1/posts/:id | Atualizar post | API Key |
| DELETE | /api/v1/posts/:id | Arquivar post | API Key |
| POST | /api/v1/media/upload | Upload de mídia | API Key |
| GET | /api/v1/media | Listar mídia | API Key |
| GET | /api/v1/categories | Listar categorias | Público |
| GET | /api/v1/tags | Listar tags | Público |
| POST | /api/v1/webhooks/test | Testar webhook | API Key |

---

## 12. Analytics e Tracking

### Convenção de Nomes
- Eventos: `snake_case` (ex: `post_published`)
- Propriedades: `snake_case` (ex: `word_count`)

### Eventos Principais

| Evento | Propriedades | Quando |
|--------|--------------|--------|
| `post_created` | source, word_count | Ao criar post |
| `post_published` | scheduled, category | Ao publicar |
| `post_updated` | fields_changed | Ao editar |
| `media_uploaded` | file_size, type | Ao fazer upload |
| `api_request` | endpoint, method | Toda chamada API |
| `login` | method | Ao logar |
| **`ai_content_generated`** | **model, word_count, tone, duration_ms** | **Ao gerar com IA** |
| **`content_transcribed`** | **source_platform, url_count, duration_ms** | **Ao transcrever vídeo/post** |
| **`seo_auto_filled`** | **score_before, score_after** | **Ao otimizar SEO com IA** |
| **`openrouter_request`** | **model, tokens_in, tokens_out** | **Toda chamada Open Router** |

### Funis

**Funil de Publicação:**
1. `editor_opened` → 100%
2. `content_added` → 60%
3. `seo_filled` → 40%
4. `publish_clicked` → 30%
5. `post_published` → 25%

---

## 13. Segurança, Abuso e Compliance

### Vetores de Ataque

| Vetor | Mitigação |
|-------|-----------|
| Brute force login | Rate limit, bloqueio temporário |
| API key vazada | Revogação rápida, logs de uso |
| Upload de malware | Validação de tipo, scan (opcional) |
| XSS via conteúdo | Sanitização, CSP headers |
| SQL injection | Uso de ORM/parâmetros |
| DDoS | Rate limit, Vercel protection |

### Auditoria
- [ ] Log de ações sensíveis (login, API key created, post deleted)
- [ ] Rastreamento de quem fez o quê (user_id em todas as operações)
- [ ] Retenção de logs de auditoria: 1 ano

### LGPD/Compliance
- [ ] Checklist de conformidade implementado
- [ ] Termos de uso e política de privacidade
- [ ] Cookie banner para analytics
- [ ] Formulário de contato para DPO

---

## 14. Plano de Lançamento

### Feature Flags
- `api_v1`: Controla disponibilidade da API
- `webhooks`: Habilita sistema de webhooks
- `scheduled_posts`: Habilita agendamento

### Rollout

| Fase | Porcentagem | Critério de sucesso | Rollback se |
|------|-------------|---------------------|-------------|
| Alpha | 1 usuário (você) | Todos os fluxos funcionam | Bug crítico |
| Beta | Uso real | 1 semana sem bugs | Performance < 90 |
| Public | 100% | Lighthouse 95+ | Erro > 0.1% |

---

## 15. Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação | Dono |
|-------|---------------|---------|-----------|------|
| Supabase limits | Média | Alto | Monitorar uso, upgrade plano | Dev |
| Vercel limits | Baixa | Médio | Otimizar builds, caching | Dev |
| SEO não funciona | Baixa | Alto | Sitemap, testar com Google | Dev |
| API complexa demais | Média | Médio | Documentar bem, exemplos | Dev |
| Imagens pesadas | Média | Médio | Otimização automática | Dev |
| **Open Router indisponível** | **Média** | **Alto** | **Fallback models, retry logic** | **Dev** |
| **Custo Open Router alto** | **Média** | **Médio** | **Limites por usuário, cache** | **Dev** |
| **ScrapeCreators falha** | **Média** | **Médio** | **Fila de retry, notificação** | **Dev** |
| **Conteúdo IA de baixa qualidade** | **Alta** | **Médio** | **Prompt engineering, revisão obrigatória** | **Dev** |

---

## 16. Critérios de Aceitação (Gherkin)

### AC-001: Criar Post via API

**Cenário:** Happy Path
```gherkin
Dado que tenho uma API key válida
Quando envio POST para /api/v1/posts com dados válidos
Então recebo status 201
E o post é criado como "draft"
E recebo URL do post no response
```

**Cenário:** API Key Inválida
```gherkin
Dado que envio requisição sem API key
Quando tento criar um post
Então recebo status 401
E recebo mensagem "API key inválida ou ausente"
```

### AC-002: Agendamento de Post

**Cenário:** Publicação automática
```gherkin
Dado que criei um post agendado para amanhã às 9h
Quando chega amanhã às 9h
Então o post muda para "published" automaticamente
E o webhook post.published é disparado
```

### AC-003: Upload de Mídia

**Cenário:** Upload com sucesso
```gherkin
Dado que estou no painel admin
Quando faço upload de uma imagem válida
Então a imagem aparece na biblioteca
E uma miniatura é gerada automaticamente
```

**Cenário:** Arquivo muito grande
```gherkin
Dado que tento fazer upload de arquivo > 10MB
Quando confirmo o upload
Então recebo erro "Arquivo muito grande. Máximo 10MB."
```

---

## 17. Roadmap e Estimativa

### Fases

| Fase | Entregáveis | Dependências | Estimativa |
|------|-------------|--------------|------------|
| **Fase 1: Foundation** | Setup, auth, schema DB | - | L (1-2 dias) |
| **Fase 2: Core** | Posts CRUD, editor, SEO | Fase 1 | XL (3-5 dias) |
| **Fase 3: Media** | Biblioteca, upload | Fase 1 | M (4-8h) |
| **Fase 4: API** | REST API, webhooks | Fase 2 | L (1-2 dias) |
| **Fase 5: Polish** | Analytics, docs, FAQ | Todas | M (4-8h) |

### T-Shirt Sizing
- **XS:** < 2 horas
- **S:** 2-4 horas
- **M:** 4-8 horas
- **L:** 1-2 dias
- **XL:** 3-5 dias
- **XXL:** > 1 semana (quebrar!)

---

## 18. Próximos Passos

1. [ ] Executar `*api openrouter` para documentar integração
2. [ ] Executar `*api scrapecreators` para documentar integração
3. [ ] Criar DESIGN_SYSTEM.md com tokens de cor, tipografia, componentes
4. [ ] Criar pasta FAQ/ com guias completos de uso (incluindo como usar IA)
5. [ ] Criar API.md com documentação técnica detalhada
6. [ ] Atualizar ARQUITETURA.md com stack e fluxos
7. [ ] Pesquisar e documentar boas práticas de SEO (para implementação FR-010)
8. [ ] Revisar PRD com stakeholders (você)
9. [ ] Aprovar e iniciar desenvolvimento (*setup)

---

## Anexos

### Referências Visuais
- Mockup 1: Blog post detail (layout principal)
- Mockup 2: Homepage Empire Business (inspiração hero)
- Mockup 3-7: Variações de componentes

### Cores do Design System (Empire Business)
- Primary Dark: `#1e293b`
- Primary: `#3b82f6`
- Primary Light: `#60a5fa`
- Accent: `#10b981`
- Background: `#f8fafc`
- Surface: `#ffffff`
- Text Primary: `#0f172a`
- Text Secondary: `#64748b`

### Pesquisa de Boas Práticas de SEO (para implementação)

**Documentação obrigatória a ser consultada durante desenvolvimento:**

1. **Google Search Central**
   - https://developers.google.com/search/docs/fundamentals/seo-starter-guide
   - Título e description otimizados
   - Structured data guidelines

2. **Moz SEO Guide**
   - https://moz.com/beginners-guide-to-seo
   - On-page SEO factors
   - Keyword research

3. **Backlinko SEO Checklist**
   - https://backlinko.com/seo-checklist
   - Complete optimization guide
   - 2024 best practices

4. **Schema.org**
   - https://schema.org/Article
   - JSON-LD implementation
   - Rich snippets

5. **Open Graph Protocol**
   - https://ogp.me/
   - Facebook/LinkedIn sharing
   - Image dimensions (1200x630)

**Pontos críticos para implementação do FR-010:**
- Title tags: 50-60 caracteres, keyword no início
- Meta descriptions: 150-160 caracteres, call-to-action
- URL structure: curto, descritivo, hífens
- Heading hierarchy: H1 único, H2, H3 sequenciais
- Image alt text: descritivo, keywords naturais
- Internal linking: 2-5 links por post
- Page speed: Core Web Vitals
- Mobile-first indexing
- Schema markup: Article, BreadcrumbList

**Ferramentas de referência:**
- Yoast SEO (WordPress) - UX patterns
- SEMrush Writing Assistant
- Surfer SEO content guidelines
- Clearscope content optimization

---

**Documento criado em:** 2026-02-19
**Última atualização:** 2026-02-19
**Próxima revisão:** Após aprovação do usuário
