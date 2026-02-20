---
## PARA CLAUDE (AI INSTRUCTIONS)

Ao guiar o usuário através deste documento:
1. Leia as instruções completamente
2. Explique cada passo em português simples
3. Antes de executar comandos, explique O QUE o comando faz
4. Antes de deletar/modificar dados, CONFIRME com o usuário
5. Use analogias do dia a dia quando possível
6. Se o usuário perguntar sobre um termo técnico, verifique o glossário em GLOSSARIO.md
7. Nunca execute comandos da lista de BANDEIRAS-VERMELHAS.md sem explicar primeiro
8. Pergunte ao usuário se ele entendeu antes de prosseguir
9. Se algo der errado, consulte TROUBLESHOOTING.md
10. Seja paciente - o usuário está aprendendo enquanto constrói
---

# 00-COMEÇAR.md

## Protocolo: Iniciando um Novo Projeto com Claude Code + Supabase

Este documento estabelece o protocolo padrão para iniciar qualquer novo projeto, garantindo consistência e qualidade desde o primeiro commit.

---

## Antes de Começar: Setup Inicial

### O que você precisa

Antes de criar seu projeto, você precisa ter três coisas principais:

1. **Uma conta no GitHub** - Onde seu código ficará guardado (como um Google Drive especial para programadores)
2. **Uma conta no Supabase** - Seu banco de dados na nuvem (onde as informações do projeto ficam salvas)
3. **O VS Code instalado** - O programa onde você vai ver e editar os arquivos de código (como um editor de texto especializado)

### Como criar cada um

#### 1. Criar conta no GitHub

**O que é:** O GitHub é como um cofre digital para seu código. Você guarda cópias do seu projeto lá, e pode acessar de qualquer lugar.

**Passo a passo:**

1. Acesse https://github.com
2. Clique em "Sign up" no canto superior direito
3. Preencha seu email, crie uma senha e escolha um nome de usuário
4. Responda as perguntas de segurança (opcional)
5. Verifique seu email clicando no link que GitHub enviou
6. Pronto! Você tem uma conta no GitHub

**Por que precisa:**
- Para guardar cópias do seu projeto
- Para poder acessar de qualquer computador
- Para colaborar com outras pessoas no futuro

**Dica:** Escolha um nome de usuário que você goste, pois vai usar muito!

---

#### 2. Criar conta no Supabase

**O que é:** Supabase é seu banco de dados na nuvem. É onde vai guardar informações como usuários, produtos, pedidos, etc.

**Passo a passo:**

1. Acesse https://supabase.com
2. Clique em "Start your project" no botão principal
3. Faça login usando:
   - Sua conta do Google, OU
   - Sua conta do GitHub
4. Crie uma organização (pode ser "Meus Projetos" ou seu nome)
5. Crie seu primeiro projeto:
   - Dê um nome (ex: "meu-primeiro-projeto")
   - Escolha uma senha do banco
   - Escolha a região mais perto de você
6. Aguarde o projeto ser criado (pode levar alguns minutos)
7. Pronto! Você tem um banco de dados no Supabase

**Por que precisa:**
- Para guardar dados do seu projeto
- Para ter autenticação de usuários
- Para criar tabelas e organizar informações

**Dica:** Guarde a senha do banco em lugar seguro! Você vai precisar dela.

---

#### 3. Instalar o VS Code

**O que é:** VS Code (Visual Studio Code) é o programa onde você vai ver e editar os arquivos de código. É como um editor de texto, mas especializado para código.

**Passo a passo:**

1. Acesse https://code.visualstudio.com
2. Clique em "Download" no botão azul
3. Escolha sua versão:
   - Se usa Mac: clique em "Mac"
   - Se usa Windows: clique em "Windows"
   - Se usa Linux: clique em "Linux"
4. Espere o arquivo baixar
5. Abra o arquivo e siga as instruções de instalação
6. Depois de instalado, abra o VS Code
7. Opcional: Instale extensões úteis
   - "ESLint" (ajuda a encontrar erros)
   - "Prettier" (formata o código bonitinho)
   - "TypeScript Vue" (se for usar Vue)

**Por que precisa:**
- Para ver e editar arquivos de código
- Para ter recursos como colorir o código
- Para ter ferramentas que ajudam a programar

**Dica:** O VS Code é gratuito! Não precisa pagar nada.

---

### Você está pronto?

Se você completou os três passos acima, você está pronto para criar seu primeiro projeto!

Se ainda tem dúvidas sobre qualquer um desses passos, pergunte à IA.

---

## 1. Preparação Prévia

### 1.1 Checklist de Preparação

- [ ] Repositório criado no GitHub
- [ ] Projeto clonado localmente
- [ ] Issue/MEP criada para tracking
- [ ] Ambiente de desenvolvimento configurado (Node.js versão específica)
- [ ] Conta Supabase criada/projeto iniciado

### 1.2 Decisões Arquiteturais Antes de Codar

Considere e documente estas decisões:

- Framework: React / Next.js / Remix?
- Styling: Tailwind CSS / CSS Modules / Styled Components?
- State Management: Context / Zustand / TanStack Query?
- Forms: React Hook Form / Formik?
- Validation: Zod / Yup?
- Authentication: Supabase Auth / Clerk / Auth.js?

---

## 2. Estrutura de Pastas Recomendada

### 2.1 Estrutura Feature-First

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Route group: Auth
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/              # Route group: Dashboard
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── api/                      # API routes
│   └── globals.css
├── components/
│   ├── ui/                       # shadcn/ui components
│   ├── forms/                    # Form components
│   └── layout/                   # Layout components
├── features/                     # Feature-based architecture
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types.ts
│   ├── products/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types.ts
│   └── orders/
├── hooks/                        # Shared hooks
├── lib/                          # Utilities and configs
│   ├── supabase/
│   ├── utils.ts
│   └── validators/
├── stores/                       # State management
├── types/                       # Global types
└── public/                       # Static assets
```

### 2.2 Justificativa da Estrutura

- **features/**: Cada domínio tem seus próprios componentes, hooks e serviços
- **components/ui/**: Componentes genéricos do design system
- **lib/**: Configurações e utilities compartilhados
- **hooks/**: Hooks reutilizáveis entre features

---

## 3. Configuração Inicial do Supabase

### 3.1 Setup do Cliente

```typescript
// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// lib/supabase/server.ts (para Server Components)
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Component pode throw em headers já enviados
          }
        },
      },
    }
  )
}
```

### 3.2 Tipos do Supabase

```typescript
// types/database.types.ts
// Generated by Supabase CLI - use supabase gen types

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
      // Adicionar outras tabelas aqui
    }
  }
}
```

---

## 4. Variáveis de Ambiente Obrigatórias

### 4.1 Arquivo `.env.example`

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=My App

# Analytics (opcional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Email (opcional)
SMTP_HOST=smtp.example.com
SMTP_USER=your-email
SMTP_PASSWORD=your-password
```

### 4.2 Validação de Variáveis

```typescript
// lib/validators/env.ts
import { z } from 'zod'

export const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  NEXT_PUBLIC_APP_NAME: z.string().optional(),
})

export function validateEnv() {
  const result = envSchema.safeParse(process.env)

  if (!result.success) {
    console.error('Invalid environment variables:', result.error.format())
    throw new Error('Invalid environment variables')
  }

  return result.data
}
```

---

## 5. Configuração TypeScript Strict

### 5.1 `tsconfig.json`

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/features/*": ["./src/features/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/lib/*": ["./src/lib/*"]
    }
  },
  "include": ["src/**/*", ".next/types/**/*"],
  "exclude": ["node_modules"]
}
```

---

## 6. Setup do Projeto React/Next.js

### 6.1 Dependências Essenciais

```bash
# Core
npm install react react-dom next

# TypeScript
npm install -D typescript @types/react @types/node

# Supabase
npm install @supabase/supabase-js @supabase/ssr

# Styling
npm install tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Forms & Validation
npm install react-hook-form zod @hookform/resolvers

# State Management
npm install zustand @tanstack/react-query

# Utilities
npm install clsx tailwind-merge date-fns
```

### 6.2 Dependências de Qualidade

```bash
# Linting
npm install -D eslint eslint-config-next eslint-plugin-simple-import-sort

# Formatting
npm install -D prettier prettier-plugin-tailwindcss

# Testing
npm install -D vitest @vitest/ui jsdom @testing-library/react @testing-library/user-event

# Code Quality
npm install -D knip

# Git Hooks
npm install -D husky lint-staged
```

---

## 7. Ferramentas Obrigatórias

### 7.1 ESLint Configuration

```javascript
// .eslintrc.js
module.exports = {
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:react-hooks/recommended',
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-explicit-any': 'warn',
    'react/no-unescaped-entities': 'off',
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
  },
}
```

### 7.2 Prettier Configuration

```javascript
// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

### 7.3 Vitest Configuration

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'src/**/*.test.tsx'],
    },
  },
})
```

---

## 8. Próximos Passos

Após completar esta configuração inicial:

1. **Crie as tabelas base** no Supabase (use migrations)
2. **Implemente autenticação** básica
3. **Configure RLS policies** para cada tabela
4. **Crie componentes UI** base (Button, Input, Card, etc.)
5. **Configure CI/CD** pipeline

---

## 9. Referências Rápidas

| Recurso | URL |
|---------|-----|
| Next.js Docs | https://nextjs.org/docs |
| Supabase Docs | https://supabase.com/docs |
| Tailwind CSS | https://tailwindcss.com/docs |
| TypeScript | https://www.typescriptlang.org/docs |
| Vitest | https://vitest.dev/guide |

---

**Versão:** 1.0.0
**Última atualização:** 2024-01-15
**Responsável:** Claude Code
