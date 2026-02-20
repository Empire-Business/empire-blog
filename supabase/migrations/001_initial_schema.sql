-- ═══════════════════════════════════════════════════════════════
-- EMPIRE BLOG - Schema do Banco de Dados
-- ═══════════════════════════════════════════════════════════════

-- ───────────────────────────────────────────────────────────────
-- ENUMS
-- ───────────────────────────────────────────────────────────────

CREATE TYPE user_role AS ENUM ('admin', 'editor');
CREATE TYPE post_status AS ENUM ('draft', 'scheduled', 'published', 'archived');
CREATE TYPE ai_generation_type AS ENUM ('content', 'seo', 'transcription');

-- ───────────────────────────────────────────────────────────────
-- TABELA: users
-- ───────────────────────────────────────────────────────────────

CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  nome TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'editor',
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);

-- ───────────────────────────────────────────────────────────────
-- TABELA: categories
-- ───────────────────────────────────────────────────────────────

CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_parent ON categories(parent_id);

-- ───────────────────────────────────────────────────────────────
-- TABELA: tags
-- ───────────────────────────────────────────────────────────────

CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tags_slug ON tags(slug);
CREATE INDEX idx_tags_name ON tags(name);

-- ───────────────────────────────────────────────────────────────
-- TABELA: folders (para organizar mídia)
-- ───────────────────────────────────────────────────────────────

CREATE TABLE folders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  parent_id UUID REFERENCES folders(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_folders_parent ON folders(parent_id);

-- ───────────────────────────────────────────────────────────────
-- TABELA: media
-- ───────────────────────────────────────────────────────────────

CREATE TABLE media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  stored_name TEXT NOT NULL UNIQUE,
  url TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size_bytes INTEGER NOT NULL,
  width INTEGER,
  height INTEGER,
  alt_text TEXT NOT NULL,
  caption TEXT,
  folder_id UUID REFERENCES folders(id) ON DELETE SET NULL,
  uploader_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_media_stored_name ON media(stored_name);
CREATE INDEX idx_media_folder ON media(folder_id);
CREATE INDEX idx_media_uploader ON media(uploader_id);

-- ───────────────────────────────────────────────────────────────
-- TABELA: posts
-- ───────────────────────────────────────────────────────────────

CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content JSONB NOT NULL,
  excerpt TEXT,
  status post_status NOT NULL DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  featured_image_id UUID REFERENCES media(id) ON DELETE SET NULL,
  meta_title TEXT,
  meta_description TEXT,
  keywords TEXT[],
  reading_time INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT chk_published_at CHECK (
    (status IN ('published', 'scheduled') AND published_at IS NOT NULL) OR
    (status IN ('draft', 'archived'))
  )
);

CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_published_at ON posts(published_at DESC);
CREATE INDEX idx_posts_author ON posts(author_id);
CREATE INDEX idx_posts_category ON posts(category_id);

-- Full-text search index
CREATE INDEX idx_posts_search ON posts
USING gin(to_tsvector('portuguese', title || ' ' || COALESCE(excerpt, '') || ' ' || content::text));

-- ───────────────────────────────────────────────────────────────
-- TABELA: post_tags (relacionamento N:N)
-- ───────────────────────────────────────────────────────────────

CREATE TABLE post_tags (
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- ───────────────────────────────────────────────────────────────
-- TABELA: api_keys
-- ───────────────────────────────────────────────────────────────

CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  key_hash TEXT NOT NULL UNIQUE,
  prefix TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  last_used TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_api_keys_hash ON api_keys(key_hash);
CREATE INDEX idx_api_keys_prefix ON api_keys(prefix);
CREATE INDEX idx_api_keys_user ON api_keys(user_id);

-- ───────────────────────────────────────────────────────────────
-- TABELA: webhooks
-- ───────────────────────────────────────────────────────────────

CREATE TABLE webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  events TEXT[] NOT NULL,
  secret TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ───────────────────────────────────────────────────────────────
-- TABELA: ai_generations (logs de IA)
-- ───────────────────────────────────────────────────────────────

CREATE TABLE ai_generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE SET NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type ai_generation_type NOT NULL,
  model TEXT NOT NULL,
  prompt TEXT NOT NULL,
  word_count INTEGER NOT NULL,
  tokens_in INTEGER,
  tokens_out INTEGER,
  duration_ms INTEGER NOT NULL,
  source_urls TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ai_generations_user ON ai_generations(user_id);
CREATE INDEX idx_ai_generations_post ON ai_generations(post_id);
CREATE INDEX idx_ai_generations_created ON ai_generations(created_at DESC);

-- ═══════════════════════════════════════════════════════════════
-- TRIGGERS
-- ═══════════════════════════════════════════════════════════════

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar em todas as tabelas relevantes
CREATE TRIGGER trigger_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Função para gerar slug automaticamente
CREATE OR REPLACE FUNCTION generate_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug = lower(regexp_replace(
      regexp_replace(NEW.title, '[^a-zA-Z0-9áéíóúàèìòùãõç\s]', '', 'g'),
      '\s+', '-', 'g'
    ));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_posts_slug
  BEFORE INSERT ON posts
  FOR EACH ROW EXECUTE FUNCTION generate_slug();

CREATE TRIGGER trigger_categories_slug
  BEFORE INSERT ON categories
  FOR EACH ROW EXECUTE FUNCTION generate_slug();

CREATE TRIGGER trigger_tags_slug
  BEFORE INSERT ON tags
  FOR EACH ROW EXECUTE FUNCTION generate_slug();

-- Função para calcular tempo de leitura
CREATE OR REPLACE FUNCTION calculate_reading_time()
RETURNS TRIGGER AS $$
DECLARE
  word_count INTEGER;
BEGIN
  word_count := array_length(
    regexp_split_to_array(
      COALESCE(NEW.content::text, ''),
      '\s+'
    ),
    1
  );

  IF word_count IS NULL THEN
    word_count := 0;
  END IF;

  NEW.reading_time := CEIL(word_count::FLOAT / 200);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_posts_reading_time
  BEFORE INSERT OR UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION calculate_reading_time();

-- ═══════════════════════════════════════════════════════════════
-- VIEWS ÚTEIS
-- ═══════════════════════════════════════════════════════════════

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

CREATE VIEW post_tags_view AS
SELECT
  p.id as post_id,
  p.title,
  p.slug as post_slug,
  array_agg(t.name) FILTER (WHERE t.name IS NOT NULL) as tags,
  array_agg(t.slug) FILTER (WHERE t.slug IS NOT NULL) as tag_slugs
FROM posts p
LEFT JOIN post_tags pt ON p.id = pt.post_id
LEFT JOIN tags t ON pt.tag_id = t.id
GROUP BY p.id, p.title, p.slug;

-- ═══════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS)
-- ═══════════════════════════════════════════════════════════════

-- Habilitar RLS em todas as tabelas
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_generations ENABLE ROW LEVEL SECURITY;

-- ═══════════════════════════════════════════════════════════════
-- POLÍTICAS RLS - USERS
-- ═══════════════════════════════════════════════════════════════

-- Usuários podem ver próprio perfil
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Admins podem ver todos
CREATE POLICY "Admins can view all users"
  ON users FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Usuários podem atualizar próprio perfil
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- ═══════════════════════════════════════════════════════════════
-- POLÍTICAS RLS - POSTS
-- ═══════════════════════════════════════════════════════════════

-- Posts publicados são públicos
CREATE POLICY "Published posts are public"
  ON posts FOR SELECT
  USING (status = 'published');

-- Autores podem ver próprios posts
CREATE POLICY "Authors can view own posts"
  ON posts FOR SELECT
  USING (auth.uid() = author_id);

-- Admins podem ver todos os posts
CREATE POLICY "Admins can view all posts"
  ON posts FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Admins e editores podem criar posts
CREATE POLICY "Admins and editors can create posts"
  ON posts FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'editor'))
  );

-- Autores podem editar próprios posts
CREATE POLICY "Authors can update own posts"
  ON posts FOR UPDATE
  USING (auth.uid() = author_id);

-- Admins podem editar todos os posts
CREATE POLICY "Admins can update all posts"
  ON posts FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Admins podem deletar posts
CREATE POLICY "Admins can delete posts"
  ON posts FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- ═══════════════════════════════════════════════════════════════
-- POLÍTICAS RLS - CATEGORIES
-- ═══════════════════════════════════════════════════════════════

-- Categorias são públicas para leitura
CREATE POLICY "Categories are public"
  ON categories FOR SELECT
  USING (true);

-- Admins podem gerenciar categorias
CREATE POLICY "Admins can manage categories"
  ON categories FOR ALL
  USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- ═══════════════════════════════════════════════════════════════
-- POLÍTICAS RLS - TAGS
-- ═══════════════════════════════════════════════════════════════

-- Tags são públicas para leitura
CREATE POLICY "Tags are public"
  ON tags FOR SELECT
  USING (true);

-- Admins podem gerenciar tags
CREATE POLICY "Admins can manage tags"
  ON tags FOR ALL
  USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- ═══════════════════════════════════════════════════════════════
-- POLÍTICAS RLS - POST_TAGS
-- ═══════════════════════════════════════════════════════════════

-- Leitura pública
CREATE POLICY "Post tags are public"
  ON post_tags FOR SELECT
  USING (true);

-- Admins e editores podem gerenciar
CREATE POLICY "Admins and editors can manage post_tags"
  ON post_tags FOR ALL
  USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'editor'))
  );

-- ═══════════════════════════════════════════════════════════════
-- POLÍTICAS RLS - MEDIA
-- ═══════════════════════════════════════════════════════════════

-- Mídia é pública para leitura
CREATE POLICY "Media is public"
  ON media FOR SELECT
  USING (true);

-- Admins e editores podem fazer upload
CREATE POLICY "Admins and editors can upload media"
  ON media FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'editor'))
  );

-- Uploaders podem editar própria mídia
CREATE POLICY "Uploaders can update own media"
  ON media FOR UPDATE
  USING (auth.uid() = uploader_id);

-- Admins podem editar toda mídia
CREATE POLICY "Admins can update all media"
  ON media FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Admins podem deletar mídia
CREATE POLICY "Admins can delete media"
  ON media FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- ═══════════════════════════════════════════════════════════════
-- POLÍTICAS RLS - FOLDERS
-- ═══════════════════════════════════════════════════════════════

-- Pastas são públicas para leitura
CREATE POLICY "Folders are public"
  ON folders FOR SELECT
  USING (true);

-- Admins podem gerenciar pastas
CREATE POLICY "Admins can manage folders"
  ON folders FOR ALL
  USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- ═══════════════════════════════════════════════════════════════
-- POLÍTICAS RLS - API_KEYS
-- ═══════════════════════════════════════════════════════════════

-- Usuários podem ver próprias API keys
CREATE POLICY "Users can view own api keys"
  ON api_keys FOR SELECT
  USING (auth.uid() = user_id);

-- Usuários podem criar API keys
CREATE POLICY "Users can create api keys"
  ON api_keys FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Usuários podem atualizar próprias API keys
CREATE POLICY "Users can update own api keys"
  ON api_keys FOR UPDATE
  USING (auth.uid() = user_id);

-- Usuários podem deletar próprias API keys
CREATE POLICY "Users can delete own api keys"
  ON api_keys FOR DELETE
  USING (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════════════
-- POLÍTICAS RLS - WEBHOOKS
-- ═══════════════════════════════════════════════════════════════

-- Admins podem gerenciar webhooks
CREATE POLICY "Admins can manage webhooks"
  ON webhooks FOR ALL
  USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- ═══════════════════════════════════════════════════════════════
-- POLÍTICAS RLS - AI_GENERATIONS
-- ═══════════════════════════════════════════════════════════════

-- Usuários podem ver próprias gerações
CREATE POLICY "Users can view own ai generations"
  ON ai_generations FOR SELECT
  USING (auth.uid() = user_id);

-- Admins podem ver todas as gerações
CREATE POLICY "Admins can view all ai generations"
  ON ai_generations FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Usuários podem criar gerações
CREATE POLICY "Users can create ai generations"
  ON ai_generations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════════════
-- SEED DATA
-- ═══════════════════════════════════════════════════════════════

-- Categoria padrão
INSERT INTO categories (name, slug, description)
VALUES ('Geral', 'geral', 'Categoria padrão para posts');

-- Tags comuns
INSERT INTO tags (name, slug) VALUES
  ('Tecnologia', 'tecnologia'),
  ('Negócios', 'negocios'),
  ('Produtividade', 'produtividade'),
  ('Marketing', 'marketing'),
  ('IA', 'ia');

-- Pasta padrão para mídia
INSERT INTO folders (name)
VALUES ('Uploads');

-- ═══════════════════════════════════════════════════════════════
-- FUNÇÃO PARA CRIAR USUÁRIO AUTOMATICAMENTE
-- ═══════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, nome, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1)),
    'admin'  -- Primeiro usuário é admin
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar usuário automaticamente no signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ═══════════════════════════════════════════════════════════════
-- FUNÇÃO PARA BUSCA FULL-TEXT
-- ═══════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION search_posts(search_query TEXT)
RETURNS TABLE (
  id UUID,
  title TEXT,
  slug TEXT,
  excerpt TEXT,
  status post_status,
  published_at TIMESTAMPTZ,
  rank REAL
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.title,
    p.slug,
    p.excerpt,
    p.status,
    p.published_at,
    ts_rank(
      to_tsvector('portuguese', p.title || ' ' || COALESCE(p.excerpt, '') || ' ' || p.content::text),
      plainto_tsquery('portuguese', search_query)
    ) as rank
  FROM posts p
  WHERE
    p.status = 'published'
    AND to_tsvector('portuguese', p.title || ' ' || COALESCE(p.excerpt, '') || ' ' || p.content::text)
        @@ plainto_tsquery('portuguese', search_query)
  ORDER BY rank DESC
  LIMIT 20;
END;
$$;
