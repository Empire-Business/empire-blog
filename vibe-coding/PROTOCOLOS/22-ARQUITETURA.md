---
## PARA CLAUDE (AI INSTRUCTIONS)

IMPORTANTE - LEIA COM ATENÇÃO:

1. NUNCA implemente código durante *arquitetura
2. SEMPRE mostre checkpoint antes de começar
3. SEMPRE verifique se PRD existe primeiro
4. SEMPRE pare em STOP POINTS
5. Este comando CRIA DOCUMENTAÇÃO, não código
---

# 22-ARQUITETURA.md - Protocolo de Arquitetura

## Quando Usar

- `*arquitetura` → Criar/atualizar arquitetura técnica
- Depois de criar o PRD (`*prd`)
- Quando o usuário quer definir COMO o projeto será construído
- Antes de começar desenvolvimento (`*desenvolver`)

---

## ⚠️ VERIFICAÇÃO DE PRÉ-REQUISITO (OBRIGATÓRIO)

### ANTES de começar, VERIFIQUE se o PRD existe:

**USE `ls` ou `Read` para VERIFICAR EXPLICITAMENTE.**

```
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║  🔒 VERIFICAÇÃO DE PRÉ-REQUISITO                             ║
║                                                               ║
║  A Arquitetura precisa do PRD para saber O QUE construir.    ║
║                                                               ║
║  Verificando...                                               ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
```

### VERIFICAÇÃO EXPLÍCITA (EXECUTE REALMENTE):

```
Execute: ls docs/PRD.md 2>/dev/null && echo "✅ Existe" || echo "❌ Faltando"
```

### SE PRD NÃO EXISTIR:

```
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║  🛑 ARQUITETURA BLOQUEADA                                     ║
║                                                               ║
║  O pré-requisito está faltando:                               ║
║                                                               ║
║  [❌] PRD docs/PRD.md                                         ║
║                                                               ║
║  A Arquitetura define COMO construir tecnicamente.           ║
║  Mas sem saber O QUE construir (PRD), não dá planejar!       ║
║                                                               ║
║  Para resolver: Execute *prd primeiro                        ║
║                                                               ║
║  NÃO POSSO PROSSEGUIR até o PRD existir.                     ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝

🛑 STOP_POINT_BLOQUEIO
→ NÃO prossiga com arquitetura
→ ESPERE o usuário criar o PRD
→ Após criar, execute a verificação novamente
```

### SE PRD EXISTIR:

```
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║  ✅ PRÉ-REQUISITO VERIFICADO                                  ║
║                                                               ║
║  [✅] PRD docs/PRD.md                                         ║
║                                                               ║
║  O PRD está disponível. Vou usá-lo para definir a           ║
║  arquitetura técnica.                                         ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝

→ Continue para o CHECKPOINT INICIAL
```

---

## ⚠️ CHECKPOINT INICIAL (OBRIGATÓRIO)

### ANTES de começar, SEMPRE mostre:

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  🏗️ Arquitetura - Definição Técnica do Projeto                 │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ✅ VOU FAZER:                                                  │
│                                                                 │
│     1. Ler o PRD para entender o escopo                        │
│     2. Fazer até 5 perguntas sobre decisões técnicas           │
│     3. Criar documentação em docs/ARQUITETURA/                 │
│     4. Definir stack, banco de dados, autenticação             │
│                                                                 │
│  ❌ NÃO VOU FAZER:                                              │
│                                                                 │
│     ✗ Implementar código                                        │
│     ✗ Criar arquivos de programação                             │
│     ✗ Configurar ambiente                                       │
│     ✗ Instalar dependências                                     │
│                                                                 │
│  📁 ARQUIVOS QUE SERÃO CRIADOS:                                 │
│     → docs/ARQUITETURA/README.md (visão geral)                 │
│     → docs/ARQUITETURA/stack.md (tecnologias)                  │
│     → docs/ARQUITETURA/database.md (modelo de dados)           │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Posso continuar? (SIM/NÃO)                                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

🛑 STOP_POINT_CONFIRMACAO
→ ESPERE o usuário dizer "SIM" ou "NÃO"
→ Se "NÃO", pergunte o que ele quer ajustar
```

---

## PROCESSO OBRIGATÓRIO

### ETAPA 1: Ler o PRD

```
Leia docs/PRD.md e extraia:

1. Funcionalidades principais (para definir entidades)
2. Requisitos de performance (para escolher stack)
3. Requisitos de segurança (para definir auth/RLS)
4. Integrações externas (para planejar APIs)
5. Requisitos não-funcionais (para decisões técnicas)
```

### ETAPA 2: Perguntas Técnicas (máx. 5)

```
Depois da confirmação, faça ATÉ 5 perguntas:

1. Você já tem preferência de tecnologias?
   (React, Vue, Next.js? Node, Python? PostgreSQL, MongoDB?)

2. Como os usuários vão fazer login?
   (Email/senha? Google? Ambos?)

3. O projeto precisa funcionar offline?
   (Sim/Não/Talvez mais tarde)

4. Tem integração com serviços externos?
   (Pagamento, email, armazenamento de arquivos, IA?)

5. Quantos usuários você espera simultaneamente?
   (Dezenas, centenas, milhares?)

🛑 STOP_POINT_PERGUNTA
→ ESPERE o usuário responder TODAS as perguntas
→ Se não responder alguma, use DEFAULTS (veja abaixo)
```

### ETAPA 3: Criar a Documentação

```
Após receber as respostas:

1. Criar pasta docs/ARQUITETURA/ se não existir
2. Criar os arquivos da estrutura abaixo
3. Explicar cada decisão em linguagem simples

🛑 STOP_POINT_DOCUMENTACAO
→ MOSTRE o conteúdo criado
→ PERGUNTE se quer ajustar algo
→ SÓ continue após aprovação
```

### ETAPA 4: Próximos Passos

```
Depois de aprovar a Arquitetura:

1. SUGIRA próximos passos (não execute automaticamente):
   - "Quer que eu crie o roadmap?" (*roadmap)
   - "Quer que eu crie o design system?" (*design)
   - "Quer ver o status completo?" (*status)

2. Mostre progresso dos pré-requisitos:

   ╔═══════════════════════════════════════════════════════════════╗
   ║                                                               ║
   ║  📊 STATUS DE PRÉ-REQUISITOS                                 ║
   ║                                                               ║
   ║  [✅] PRD         docs/PRD.md                                 ║
   ║  [✅] Arquitetura docs/ARQUITETURA/                           ║
   ║  [❌] Roadmap     docs/ROADMAP.md                             ║
   ║  [❌] Design      docs/DESIGN/                                ║
   ║                                                               ║
   ║  Próximo passo sugerido: *roadmap                            ║
   ║                                                               ║
   ╚═══════════════════════════════════════════════════════════════╝

🛑 STOP_POINT_ETAPA
→ ESPERE o usuário escolher o próximo passo
```

---

## ESTRUTURA DA DOCUMENTAÇÃO

### Arquivo: docs/ARQUITETURA/README.md

```markdown
# Arquitetura do Projeto

## Visão Geral

Este documento descreve COMO o projeto será construído tecnicamente.

Para O QUE estamos construindo, consulte `docs/PRD.md`.

---

## Stack Tecnológica

Consulte `stack.md` para detalhes completos.

### Resumo Rápido

| Camada | Tecnologia | Por que |
|--------|------------|---------|
| Frontend | [Tecnologia] | [Motivo] |
| Backend | [Tecnologia] | [Motivo] |
| Banco | [Tecnologia] | [Motivo] |
| Auth | [Tecnologia] | [Motivo] |
| Deploy | [Tecnologia] | [Motivo] |

---

## Decisões Principais

| Decisão | Escolha | Alternativas consideradas |
|---------|---------|---------------------------|
| [Decisão 1] | [Escolha] | [Alternativas] |

---

## Diagrama Simplificado

```
[Cliente (Browser/App)]
        |
        v
[Frontend (Next.js)]
        |
        v
[Backend/API]
        |
        v
[Banco de Dados]
```

---

## Status de Pré-requisitos

| Documento | Status | Arquivo |
|-----------|--------|---------|
| PRD | ✅ | docs/PRD.md |
| Arquitetura | ✅ | docs/ARQUITETURA/ |
| Roadmap | ❌ | docs/ROADMAP.md |
| Design | ❌ | docs/DESIGN/ |

> 🔒 Complete todos os pré-requisitos antes de `*desenvolver`.
```

---

### Arquivo: docs/ARQUITETURA/stack.md

```markdown
# Stack Tecnológica

## Frontend

### Framework
**Escolha:** [Framework, ex: Next.js 14]

**Por que:**
- [Motivo 1]
- [Motivo 2]

### Linguagem
**Escolha:** TypeScript

**Por que:**
- Tipagem ajuda a evitar erros
- Melhor autocompletar no editor
- Mais fácil de dar manutenção

### Estilização
**Escolha:** [Tailwind CSS / CSS Modules / Styled Components]

**Por que:**
- [Motivo]

---

## Backend

### API
**Escolha:** [Next.js API Routes / Node.js / Python / etc]

**Por que:**
- [Motivo]

### Autenticação
**Escolha:** [Supabase Auth / NextAuth / JWT / etc]

**Por que:**
- [Motivo]

---

## Banco de Dados

### Tipo
**Escolha:** [PostgreSQL / MySQL / MongoDB / etc]

**Por que:**
- [Motivo]

### Onde fica hospedado
**Escolha:** [Supabase / Railway / PlanetScale / etc]

**Por que:**
- [Motivo]

---

## Serviços Externos

| Serviço | Função | Quando usar |
|---------|--------|-------------|
| [Serviço 1] | [Função] | [Quando] |

---

## Deploy

### Onde vai ficar hospedado
**Escolha:** [Vercel / Railway / AWS / etc]

**Por que:**
- [Motivo]

---

## Resumo para Iniciantes

| Termo | O que é |
|-------|---------|
| Frontend | A parte que você VÊ no navegador |
| Backend | A parte que PROCESSA os dados |
| Banco de dados | ONDE ficam guardadas as informações |
| API | Como o frontend conversa com o backend |
| Auth | Sistema de login/segurança |
| Deploy | Colocar o site no ar |
```

---

### Arquivo: docs/ARQUITETURA/database.md

```markdown
# Modelo de Dados

## Visão Geral

Este documento descreve como os dados são organizados.

---

## Entidades Principais

### Usuários (users)

Guarda informações de quem usa o sistema.

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| id | UUID | Sim | Identificador único |
| email | string | Sim | Email do usuário |
| nome | string | Sim | Nome do usuário |
| criado_em | data | Sim | Quando criou a conta |

---

### [Entidade 2]

[Descrição]

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| id | UUID | Sim | Identificador único |
| | | | |

---

## Relacionamentos

```
Usuario (1) ----< (N) [Entidade]
       |
       +--- Tem um perfil
```

---

## Regras de Segurança (RLS)

Para cada tabela, definir quem pode:

| Tabela | Ver | Criar | Editar | Apagar |
|--------|-----|-------|--------|--------|
| usuarios | Próprio | Sistema | Próprio | Nunca |
| | | | | |

---

## Índices (Performance)

| Tabela | Campo | Por que |
|--------|-------|---------|
| usuarios | email | Busca rápida por email |

---

## Resumo para Iniciantes

| Termo | O que é |
|-------|---------|
| Tabela | Como uma planilha Excel - guarda dados |
| Campo | Uma coluna da tabela |
| Relacionamento | Como duas tabelas estão conectadas |
| RLS | Regra de quem pode ver/editar o que |
| Índice | Atalho para buscar mais rápido |
```

---

## DEFAULTS (se faltar informação)

Use estes valores quando não tiver informação:

| Item | Default |
|------|---------|
| Frontend | Next.js 14 + TypeScript |
| Estilização | Tailwind CSS |
| Backend | Next.js API Routes (Server Actions) |
| Banco | PostgreSQL via Supabase |
| Auth | Supabase Auth |
| Deploy | Vercel |
| Offline | Não |

---

## RESUMO PARA INICIANTES

| Termo | Significado |
|-------|-------------|
| Stack | Conjunto de tecnologias usadas |
| Frontend | Parte visual (o que você vê) |
| Backend | Parte lógica (o que processa) |
| Banco de dados | Onde guarda as informações |
| API | Ponte entre frontend e backend |
| Deploy | Colocar o site no ar |
| RLS | Segurança no banco (quem vê o que) |

---

## ⚠️ LEMBRETE FINAL

```
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║  Este comando CRIA DOCUMENTAÇÃO.                              ║
║                                                               ║
║  NÃO implementa código.                                       ║
║  NÃO cria arquivos de programação.                            ║
║  NÃO configura ambiente.                                      ║
║                                                               ║
║  Arquitetura = Plano técnico, não implementação!              ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
```
