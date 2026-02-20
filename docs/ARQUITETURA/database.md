# Modelo de Dados - Empire Blog Platform

## Visão Geral

Este documento descreve como os dados são organizados no banco PostgreSQL (Supabase), incluindo tabelas, relacionamentos, índices e políticas de segurança (RLS).

---

## Diagrama Entidade-Relacionamento

```
┌────────────────┐       ┌────────────────┐       ┌────────────────┐
│     users      │       │     posts      │       │   categories   │
├────────────────┤       ├────────────────┤       ├────────────────┤
│ id (PK)        │───┐   │ id (PK)        │───┐   │ id (PK)        │
│ email          │   │   │ title          │   │   │ name           │
│ role           │   │   │ slug           │   │   │ slug           │
│ created_at     │   │   │ content (JSON) │   │   │ description    │
└────────────────┘   │   │ status         │   │   │ parent_id (FK) │
                     │   │ published_at   │   │   └────────────────┘
                     │   │ author_id (FK) │───┘           │
                     │   │ category_id(FK)│◄──────────────┘
                     │   └───────┬────────┘
                     │           │
                     │           │ N:N via post_tags
                     │           │
                     │   ┌───────▼────────┐       ┌────────────────┐
                     │   │      tags      │       │   post_tags    │
                     │   ├────────────────┤       ├────────────────┤
                     │   │ id (PK)        │       │ post_id (FK)   │
                     │   │ name           │       │ tag_id (FK)    │
                     │   │ slug           │       └────────────────┘
                     │   └────────────────┘
                     │
┌────────────────┐   │   ┌────────────────┐
│    api_keys    │   │   │     media      │
├────────────────┤   │   ├────────────────┤
│ id (PK)        │   │   │ id (PK)        │
│ name           │   │   │ filename       │
│ key_hash       │   │   │ url            │
│ user_id (FK)   │───┘   │ alt_text       │
│ last_used      │       │ folder_id (FK) │
│ active         │       │ uploader_id(FK)│───┐
└────────────────┘       └────────────────┘   │
                                              │
┌────────────────┐       ┌────────────────┐   │
│    folders     │       │    webhooks    │   │
├────────────────┤       ├────────────────┤   │
│ id (PK)        │       │ id (PK)        │   │
│ name           │       │ url            │   │
│ parent_id (FK) │       │ events         │   │
└────────────────┘       │ secret         │   │
                         │ active         │   │
                         └────────────────┘   │
                                              │
                         ┌────────────────┐   │
                         │  ai_generations│   │
                         ├────────────────┤   │
                         │ id (PK)        │   │
                         │ post_id (FK)   │   │
                         │ model          │   │
                         │ prompt         │   │
                         │ word_count     │   │
                         │ duration_ms    │   │
                         │ user_id (FK)   │───┘
                         └────────────────┘
```

---

## Entidades Principais

### users (Usuários)

Guarda informações de quem usa o sistema.

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| id | UUID | Sim | Identificador único (gerado pelo Supabase Auth) |
| email | string | Sim | Email do usuário (único) |
| nome | string | Sim | Nome de exibição |
| role | enum | Sim | `admin` ou `editor` |
| avatar_url | string | Não | URL do avatar |
| created_at | timestamp | Sim | Quando criou a conta |
| updated_at | timestamp | Sim | Última atualização |

**Índices:**
- `email` (único) - Login e busca rápida

**RLS:**
| Ação | Quem pode |
|------|-----------|
| Ver | Próprio usuário |
| Criar | Sistema (Supabase Auth) |
| Editar | Próprio usuário |
| Deletar | Admin apenas |

---

### posts (Posts/Artigos)

Armazena todos os posts do blog.

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| id | UUID | Sim | Identificador único |
| title | string | Sim | Título do post (máx 200 chars) |
| slug | string | Sim | URL amigável (único) |
| content | JSONB | Sim | Conteúdo em formato TipTap |
| excerpt | string | Não | Resumo (máx 300 chars) |
| status | enum | Sim | `draft`, `scheduled`, `published`, `archived` |
| published_at | timestamp | Condicional | Data de publicação (obrigatório se published/scheduled) |
| author_id | UUID | Sim | Referência ao usuário autor |
| category_id | UUID | Não | Referência à categoria |
| featured_image_id | UUID | Não | Referência à imagem destacada |
| meta_title | string | Não | SEO title (máx 60 chars) |
| meta_description | string | Não | SEO description (máx 160 chars) |
| keywords | string[] | Não | Array de keywords |
| reading_time | integer | Não | Tempo de leitura em minutos |
| created_at | timestamp | Sim | Quando criou |
| updated_at | timestamp | Sim | Última atualização |

**Índices:**
- `slug` (único) - Busca por URL
- `status` - Filtro por status
- `published_at` - Ordenação cronológica
- `author_id` - Posts por autor
- `category_id` - Posts por categoria
- `to_tsvector('portuguese', title || ' ' || content)` - Full-text search

**RLS:**
| Ação | Quem pode |
|------|-----------|
| Ver (published) | Todos (público) |
| Ver (draft/scheduled) | Admin e autor |
| Criar | Admin e editor |
| Editar | Admin ou autor |
| Deletar | Admin |

---

### categories (Categorias)

Organiza posts em categorias hierárquicas.

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| id | UUID | Sim | Identificador único |
| name | string | Sim | Nome da categoria |
| slug | string | Sim | URL amigável (único) |
| description | string | Não | Descrição da categoria |
| parent_id | UUID | Não | Categoria pai (para hierarquia) |
| created_at | timestamp | Sim | Quando criou |

**Índices:**
- `slug` (único)
- `parent_id`

**RLS:**
| Ação | Quem pode |
|------|-----------|
| Ver | Todos |
| Criar/Editar/Deletar | Admin |

---

### tags (Tags)

Tags para classificar posts.

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| id | UUID | Sim | Identificador único |
| name | string | Sim | Nome da tag |
| slug | string | Sim | URL amigável (único) |
| created_at | timestamp | Sim | Quando criou |

**Índices:**
- `slug` (único)
- `name`

**RLS:**
| Ação | Quem pode |
|------|-----------|
| Ver | Todos |
| Criar/Editar/Deletar | Admin |

---

### post_tags (Relacionamento Posts-Tags)

Tabela de junção para relacionamento N:N entre posts e tags.

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| post_id | UUID | Sim | Referência ao post |
| tag_id | UUID | Sim | Referência à tag |

**PK composta:** (post_id, tag_id)

---

### media (Biblioteca de Mídia)

Imagens e arquivos do sistema.

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| id | UUID | Sim | Identificador único |
| filename | string | Sim | Nome original do arquivo |
| stored_name | string | Sim | Nome no storage (único) |
| url | string | Sim | URL pública |
| mime_type | string | Sim | Tipo MIME (image/jpeg, etc) |
| size_bytes | integer | Sim | Tamanho em bytes |
| width | integer | Não | Largura em pixels |
| height | integer | Não | Altura em pixels |
| alt_text | string | Sim | Texto alternativo (obrigatório) |
| caption | string | Não | Legenda |
| folder_id | UUID | Não | Referência à pasta |
| uploader_id | UUID | Sim | Referência ao usuário |
| created_at | timestamp | Sim | Quando fez upload |

**Índices:**
- `stored_name` (único)
- `folder_id`
- `uploader_id`

**RLS:**
| Ação | Quem pode |
|------|-----------|
| Ver | Todos (imagens públicas) |
| Criar | Admin e editor |
| Editar | Admin ou uploader |
| Deletar | Admin |

---

### folders (Pastas de Mídia)

Organização hierárquica de arquivos.

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| id | UUID | Sim | Identificador único |
| name | string | Sim | Nome da pasta |
| parent_id | UUID | Não | Pasta pai (para hierarquia) |
| created_at | timestamp | Sim | Quando criou |

**Índices:**
- `parent_id`

---

### api_keys (Chaves de API)

Autenticação para integrações externas.

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| id | UUID | Sim | Identificador único |
| name | string | Sim | Nome descritivo da chave |
| key_hash | string | Sim | Hash da chave (nunca guardar plain text) |
| prefix | string | Sim | Prefixo visível (ex: `emp_1234...`) |
| user_id | UUID | Sim | Referência ao usuário dono |
| last_used | timestamp | Não | Último uso da chave |
| expires_at | timestamp | Não | Data de expiração (opcional) |
| active | boolean | Sim | Se está ativa |
| created_at | timestamp | Sim | Quando criou |

**Índices:**
- `key_hash` (único)
- `prefix`
- `user_id`

**Segurança:**
- A chave original (plain text) é mostrada APENAS no momento da criação
- Hash usando bcrypt ou argon2
- Rate limiting por chave

---

### webhooks (Webhooks)

Notificações HTTP para eventos.

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| id | UUID | Sim | Identificador único |
| name | string | Sim | Nome descritivo |
| url | string | Sim | URL para receber POST |
| events | string[] | Sim | Array de eventos assinados |
| secret | string | Sim | Secret para assinatura HMAC |
| active | boolean | Sim | Se está ativo |
| created_at | timestamp | Sim | Quando criou |

**Eventos disponíveis:**
- `post.created`
- `post.published`
- `post.updated`
- `post.archived`
- `media.uploaded`

---

### ai_generations (Histórico de IA)

Log de gerações de conteúdo com IA.

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| id | UUID | Sim | Identificador único |
| post_id | UUID | Não | Post relacionado (se aplicável) |
| user_id | UUID | Sim | Usuário que solicitou |
| type | enum | Sim | `content`, `seo`, `transcription` |
| model | string | Sim | Modelo usado (ex: `gpt-4`) |
| prompt | text | Sim | Prompt enviado |
| word_count | integer | Sim | Palavras geradas |
| tokens_in | integer | Não | Tokens de entrada |
| tokens_out | integer | Não | Tokens de saída |
| duration_ms | integer | Sim | Tempo de geração |
| source_urls | string[] | Não | URLs fonte (para transcrição) |
| created_at | timestamp | Sim | Quando gerou |

**Índices:**
- `user_id`
- `post_id`
- `type`
- `created_at`

---

## Enums

### user_role
```sql
CREATE TYPE user_role AS ENUM ('admin', 'editor');
```

### post_status
```sql
CREATE TYPE post_status AS ENUM ('draft', 'scheduled', 'published', 'archived');
```

### ai_generation_type
```sql
CREATE TYPE ai_generation_type AS ENUM ('content', 'seo', 'transcription');
```

---

## Triggers e Functions

### 1. Updated At Automático

```sql
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar em todas as tabelas relevantes
CREATE TRIGGER posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

### 2. Slug Automático

```sql
CREATE OR REPLACE FUNCTION generate_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug = lower(regexp_replace(
      regexp_replace(NEW.title, '[^a-zA-Z0-9\s]', '', 'g'),
      '\s+', '-', 'g'
    ));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER posts_slug
  BEFORE INSERT ON posts
  FOR EACH ROW EXECUTE FUNCTION generate_slug();
```

### 3. Reading Time Automático

```sql
CREATE OR REPLACE FUNCTION calculate_reading_time()
RETURNS TRIGGER AS $$
DECLARE
  word_count integer;
BEGIN
  -- Extrair texto do JSONB do conteúdo
  word_count := array_length(
    regexp_split_to_array(
      NEW.content::text, '\s+'
    ), 1
  );

  -- ~200 palavras por minuto
  NEW.reading_time := ceil(word_count::float / 200);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER posts_reading_time
  BEFORE INSERT OR UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION calculate_reading_time();
```

---

## Views Úteis

### posts_with_relations

```sql
CREATE VIEW posts_with_relations AS
SELECT
  p.*,
  c.name as category_name,
  c.slug as category_slug,
  u.nome as author_name,
  u.email as author_email,
  m.url as featured_image_url,
  m.alt_text as featured_image_alt
FROM posts p
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN users u ON p.author_id = u.id
LEFT JOIN media m ON p.featured_image_id = m.id;
```

### post_tags_view

```sql
CREATE VIEW post_tags_view AS
SELECT
  p.id as post_id,
  p.title,
  array_agg(t.name) as tags,
  array_agg(t.slug) as tag_slugs
FROM posts p
LEFT JOIN post_tags pt ON p.id = pt.post_id
LEFT JOIN tags t ON pt.tag_id = t.id
GROUP BY p.id, p.title;
```

---

## Políticas RLS (Row Level Security)

### posts

```sql
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Posts publicados são visíveis para todos
CREATE POLICY "Posts publicados são públicos"
  ON posts FOR SELECT
  USING (status = 'published');

-- Autores podem ver seus próprios posts
CREATE POLICY "Autores veem seus posts"
  ON posts FOR SELECT
  USING (auth.uid() = author_id);

-- Admins veem tudo
CREATE POLICY "Admins veem tudo"
  ON posts FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Autores podem criar posts
CREATE POLICY "Autores podem criar"
  ON posts FOR INSERT
  WITH CHECK (auth.uid() = author_id);

-- Autores podem editar seus posts
CREATE POLICY "Autores podem editar"
  ON posts FOR UPDATE
  USING (auth.uid() = author_id);
```

### media

```sql
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

-- Mídia é pública para leitura
CREATE POLICY "Mídia pública"
  ON media FOR SELECT
  USING (true);

-- Apenas admins/editores podem upload
CREATE POLICY "Upload autorizado"
  ON media FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role IN ('admin', 'editor')
    )
  );
```

---

## Índices de Performance

| Tabela | Índice | Por que |
|--------|--------|---------|
| posts | `slug` (unique) | Busca por URL |
| posts | `status, published_at DESC` | Listagem de posts |
| posts | `author_id` | Posts por autor |
| posts | `gin(to_tsvector(...))` | Full-text search |
| media | `folder_id` | Filtrar por pasta |
| api_keys | `key_hash` | Validação de API key |
| ai_generations | `user_id, created_at DESC` | Histórico por usuário |

---

## Dados Iniciais (Seed)

```sql
-- Categoria padrão
INSERT INTO categories (id, name, slug)
VALUES (gen_random_uuid(), 'Geral', 'geral');

-- Usuário admin inicial (após primeiro login via Supabase Auth)
-- O ID será criado automaticamente pelo trigger de auth

-- Tags comuns
INSERT INTO tags (name, slug) VALUES
  ('Tecnologia', 'tecnologia'),
  ('Negócios', 'negocios'),
  ('Produtividade', 'produtividade'),
  ('Marketing', 'marketing');
```

---

## Resumo para Iniciantes

| Termo | O que é |
|-------|---------|
| **Tabela** | Como uma planilha Excel - guarda dados em linhas e colunas |
| **Campo/Coluna** | Uma coluna da tabela (ex: título, data) |
| **Registro/Linha** | Uma linha completa de dados (ex: um post) |
| **PK (Primary Key)** | Identificador único de cada registro |
| **FK (Foreign Key)** | Referência a outra tabela (conecta dados) |
| **Relacionamento** | Como duas tabelas estão conectadas |
| **RLS** | Regra de quem pode ver/editar o que |
| **Índice** | Atalho para buscar mais rápido |
| **Trigger** | Ação automática quando algo acontece |
| **View** | "Tabela virtual" - uma consulta salva |

---

**Documento criado em:** 2026-02-19
**Última atualização:** 2026-02-19
