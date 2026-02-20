---
## PARA CLAUDE (AI INSTRUCTIONS)

Este protocolo é invocado pelo comando `*supabase` no CLAUDE.md.
Execute conforme as regras definidas no CLAUDE.md e em COMUNICACAO.md.
---

# Protocolo Supabase (*supabase)

## Quando Usar

- Configurando Supabase pela primeira vez
- Problemas de conexão
- Configurar MCP do Supabase
- Trabalhar com RLS
- Fazer migrations
- Debug de queries

---

## Setup Inicial

### 1. Criar Conta e Projeto

```
1. Acesse: https://supabase.com
2. Clique em "Start your project"
3. Crie uma organização (se não tiver)
4. Crie um novo projeto:
   - Nome: nome-do-projeto
   - Senha do banco: [gerar senha forte e salvar!]
   - Região: escolha a mais próxima dos usuários
```

### 2. Pegar Credenciais

```
No Dashboard → Settings → API:

Project URL: https://xxxxx.supabase.co
anon key: eyJhbGciOiJ... (pública, vai no frontend)
service_role key: eyJhbGciOiJ... (SECRETA, só backend!)
```

### 3. Configurar .env

```bash
# .env.local (NUNCA commitar!)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJ...

# Para server-side (API routes, etc)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJ... # SECRETO!
```

---

## Supabase CLI

### Instalação

```bash
# macOS
brew install supabase/tap/supabase

# Windows
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

# Linux
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
npm install -g supabase
```

### Comandos Principais

```bash
# Login na conta
supabase login

# Inicializar no projeto
supabase init

# Link com projeto remoto
supabase link --project-ref xxxxx

# Ver status
supabase status

# Rodar localmente
supabase start

# Parar local
supabase stop
```

### Migrations

```bash
# Criar nova migration
supabase migration new nome_da_migration

# Aplicar migrations locais
supabase db push

# Aplicar no remoto
supabase db push --linked

# Reset banco local (CUIDADO: apaga tudo!)
supabase db reset

# Ver diff entre local e remoto
supabase db diff
```

---

## MCP do Supabase

### O que é MCP?

```
Model Context Protocol (MCP) permite que o Claude:
- Leia a estrutura do seu banco
- Execute queries SQL
- Veja logs e métricas
- Gerencie RLS

Tudo sem você digitar SQL manualmente!
```

### Configurar MCP

```bash
# Adicionar MCP do Supabase ao Claude Code
claude mcp add supabase https://mcp.supabase.com/mcp

# Configurar com suas credenciais
# O Claude vai pedir:
# - Project Reference (xxxxx do URL)
# - Service Role Key (do Dashboard → Settings → API)
```

### Verificar MCP

```bash
# Listar MCPs configurados
claude mcp list

# Testar conexão
claude mcp inspect supabase
```

### Uso no Claude Code

```
Depois de configurado, você pode pedir ao Claude:

> "Mostre a estrutura da tabela usuarios"
> "Crie uma tabela de pedidos"
> "Qual o tamanho do banco?"
> "Mostre as queries mais lentas"
> "Configure RLS na tabela posts"
```

---

## Client no Código

### JavaScript/TypeScript

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### Instalação

```bash
# npm
npm install @supabase/supabase-js

# yarn
yarn add @supabase/supabase-js

# pnpm
pnpm add @supabase/supabase-js
```

### Operações Básicas

```typescript
// SELECT
const { data, error } = await supabase
  .from('usuarios')
  .select('id, nome, email')
  .eq('ativo', true)
  .order('created_at', { ascending: false })
  .limit(10)

// INSERT
const { data, error } = await supabase
  .from('usuarios')
  .insert({ nome: 'João', email: 'joao@email.com' })
  .select()
  .single()

// UPDATE
const { error } = await supabase
  .from('usuarios')
  .update({ nome: 'João Silva' })
  .eq('id', usuarioId)

// DELETE
const { error } = await supabase
  .from('usuarios')
  .delete()
  .eq('id', usuarioId)

// UPSERT (insert ou update se existir)
const { error } = await supabase
  .from('configuracoes')
  .upsert({ chave: 'tema', valor: 'dark' })
  .eq('chave', 'tema')
```

### Relacionamentos

```typescript
// Buscar posts com autor
const { data } = await supabase
  .from('posts')
  .select(`
    id,
    titulo,
    autor:usuarios(nome, email)
  `)

// Buscar autor com seus posts
const { data } = await supabase
  .from('usuarios')
  .select(`
    nome,
    posts(id, titulo, created_at)
  `)
```

---

## Autenticação

### Tipos de Auth

```
- Email/Senha
- Magic Link (link por email)
- OAuth (Google, GitHub, etc)
- Phone (SMS)
- Anônimo
```

### Implementar Auth

```typescript
// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@email.com',
  password: 'senha123',
})

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@email.com',
  password: 'senha123',
})

// Sign in com OAuth
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
})

// Sign out
await supabase.auth.signOut()

// Get current user
const { data: { user } } = await supabase.auth.getUser()

// Listen to auth changes
supabase.auth.onAuthStateChange((event, session) => {
  console.log(event, session)
})
```

### Middleware Auth (Next.js)

```typescript
// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const { data: { session } } = await supabase.auth.getSession()

  // Rotas protegidas
  if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return res
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*']
}
```

---

## Row Level Security (RLS)

### Ativar RLS

```sql
-- Sempre ativar RLS em tabelas com dados de usuário!
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
```

### Políticas Comuns

```sql
-- Usuário só vê seus próprios dados
CREATE POLICY "usuarios_self" ON usuarios
  FOR ALL USING (auth.uid() = id);

-- Todos podem ler dados públicos
CREATE POLICY "posts_publicos" ON posts
  FOR SELECT USING (publico = true);

-- Usuário autenticado pode criar
CREATE POLICY "posts_insert" ON posts
  FOR INSERT WITH (auth.role() = 'authenticated');

-- Owner pode atualizar/deletar
CREATE POLICY "posts_owner" ON posts
  FOR UPDATE USING (autor_id = auth.uid());

CREATE POLICY "posts_delete" ON posts
  FOR DELETE USING (autor_id = auth.uid());

-- Admin pode tudo
CREATE POLICY "admin_all" ON usuarios
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
```

### Testar RLS

```sql
-- Testar como usuário específico
SET LOCAL jwt.claims.sub = 'usuario-id-aqui';
SELECT * FROM posts;

-- Ver políticas de uma tabela
SELECT * FROM pg_policies WHERE tablename = 'posts';
```

---

## Storage

### Upload de Arquivos

```typescript
// Upload
const { data, error } = await supabase.storage
  .from('avatars')
  .upload('user-1/avatar.jpg', file)

// URL pública
const { data } = supabase.storage
  .from('avatars')
  .getPublicUrl('user-1/avatar.jpg')

// Download
const { data, error } = await supabase.storage
  .from('avatars')
  .download('user-1/avatar.jpg')

// Delete
const { error } = await supabase.storage
  .from('avatars')
  .remove(['user-1/avatar.jpg'])
```

### Políticas de Storage

```sql
-- Bucket público (avatares)
CREATE POLICY "avatares_publicos" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

-- Usuário só pode upload na sua pasta
CREATE POLICY "user_upload" ON storage.objects
  FOR INSERT WITH (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
```

---

## Realtime

### Habilitar Realtime

```typescript
// Ouvir mudanças em tempo real
const channel = supabase
  .channel('public:posts')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'posts'
  }, (payload) => {
    console.log('Mudança:', payload)
  })
  .subscribe()

// Parar de ouvir
supabase.removeChannel(channel)
```

---

## Checklist de Setup

### Primeira vez:

```
□ Conta criada no Supabase
□ Projeto criado
□ Credenciais salvas no .env
□ supabase init executado
□ supabase link executado
□ MCP configurado no Claude Code
□ Tabelas criadas
□ RLS ativado
```

### Cada nova tabela:

```
□ Tabela criada com tipos corretos
□ RLS ativado
□ Políticas criadas
□ Índices necessários
□ Testado com usuário anônimo e autenticado
```

---

## Troubleshooting

### Erro: "JWT expired"

```
Causa: Token expirou
Solução: Fazer login novamente ou refresh token
```

### Erro: "permission denied"

```
Causa: RLS bloqueando ou política incorreta
Solução: Verificar políticas com SELECT * FROM pg_policies
```

### Erro: "relation does not exist"

```
Causa: Tabela não existe ou schema errado
Solução: Verificar nome da tabela e schema (public)
```

### Erro: "connection refused"

```
Causa: Projeto pausado ou URL errada
Solução: Verificar URL e se projeto está ativo
```

---

## Resumo para Iniciantes

| Conceito | Explicação |
|----------|------------|
| Project URL | Endereço do seu banco na nuvem |
| Anon Key | Chave pública (vai no frontend) |
| Service Role | Chave secreta (só backend!) |
| RLS | Cada usuário só vê seus dados |
| Migration | Arquivo que cria/altera tabelas |
| MCP | Claude consegue mexer no banco |

**Lembre-se:** Supabase é PostgreSQL + Auth + Storage + Realtime. Use RLS sempre que tiver dados de usuário!
