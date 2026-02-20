---
## PARA CLAUDE E CODEX (AI INSTRUCTIONS)

Este protocolo é invocado pelo comando `*tarefas` em `CLAUDE.md` (Claude) ou `AGENTS.md` (Codex).
Execute conforme as regras definidas no arquivo raiz de instruções e em `COMUNICACAO.md`.
---

# Protocolo de Tarefas (*tarefas)

## Quando Usar

- Organizar trabalho em etapas
- Acompanhar progresso
- Dividir trabalho grande em partes
- Coordenar múltiplas atividades
- Ver o que está pendente

---

## Ferramentas de Tarefas por Plataforma

| Plataforma | Ferramenta/abordagem | Função |
|------------|-----------------------|--------|
| Claude Code | `TaskCreate`, `TaskList`, `TaskGet`, `TaskUpdate` | Criar/listar/detalhar/atualizar tarefas |
| Codex | Plano + checklist estruturado + atualização de status no fluxo | Mesmo contrato funcional: criar/listar/detalhar/atualizar |

---

## Criar Tarefas

### Uso Básico

```
Você digita:
*tarefas criar

Claude pergunta:
- Qual é a tarefa? (título)
- Descrição detalhada?
- Precisa de tarefas dependentes?
```

### Exemplo: Criar Feature

```
Você:
*tarefas criar Sistema de login

Claude cria:
✓ Tarefa criada: "Implementar sistema de login"
  ID: 1
  Status: pending

Quer que eu crie subtarefas?
- Criar página de login
- Configurar autenticação
- Proteger rotas
```

### Exemplo: Projeto Completo

```
Você:
*tarefas criar Projeto e-commerce com essas etapas:
1. Setup do projeto
2. Catálogo de produtos
3. Carrinho
4. Checkout
5. Área do cliente

Claude cria múltiplas tarefas:
✓ Tarefa 1: "Setup inicial do projeto" (pending)
✓ Tarefa 2: "Implementar catálogo de produtos" (pending)
  └── Bloqueada por: Tarefa 1
✓ Tarefa 3: "Criar carrinho de compras" (pending)
  └── Bloqueada por: Tarefa 2
✓ Tarefa 4: "Sistema de checkout" (pending)
  └── Bloqueada por: Tarefa 3
✓ Tarefa 5: "Área do cliente" (pending)
  └── Bloqueada por: Tarefa 4
```

---

## Listar Tarefas

### Ver Todas

```
Você:
*tarefas listar

Claude mostra:
┌─────────────────────────────────────────────────────────┐
│ TAREFAS DO PROJETO                                      │
├─────────────────────────────────────────────────────────┤
│ #1  ⏳ Implementar sistema de login                     │
│     Status: in_progress                                 │
│ #2  ⏸️  Criar página de login                           │
│     Status: pending | Bloqueada por: #1                 │
│ #3  ⏸️  Configurar autenticação                         │
│     Status: pending | Bloqueada por: #1                 │
│ #4  ⏸️  Proteger rotas                                  │
│     Status: pending | Bloqueada por: #3                 │
└─────────────────────────────────────────────────────────┘

Progresso: 0/4 concluídas
```

### Filtrar por Status

```
Você:
*tarefas listar pendentes

Claude mostra apenas tarefas pending
```

---

## Ver Detalhes

```
Você:
*tarefas ver 1

Claude mostra:
┌─────────────────────────────────────────────────────────┐
│ TAREFA #1: Implementar sistema de login                 │
├─────────────────────────────────────────────────────────┤
│ Status: in_progress                                     │
│ Criada em: 2024-01-15 10:30                             │
│                                                          │
│ Descrição:                                              │
│ Implementar sistema completo de autenticação com        │
│ Supabase Auth, incluindo login com email/senha e        │
│ OAuth (Google).                                         │
│                                                          │
│ Bloqueia:                                               │
│ - #2 Criar página de login                              │
│ - #3 Configurar autenticação                            │
│                                                          │
│ Bloqueada por: (nenhuma)                                │
└─────────────────────────────────────────────────────────┘
```

---

## Atualizar Status

### Status Disponíveis

```
pending      → Aguardando
in_progress  → Em andamento
completed    → Concluída
deleted      → Removida
```

### Marcar em Progresso

```
Você:
*tarefas iniciar 1

Claude:
✓ Tarefa #1 atualizada para "in_progress"
  "Implementar sistema de login" está em andamento.
```

### Concluir Tarefa

```
Você:
*tarefas concluir 1

Claude:
✓ Tarefa #1 concluída!

Tarefas desbloqueadas:
- #2 Criar página de login
- #3 Configurar autenticação

Quer iniciar a próxima?
```

---

## Fluxo de Trabalho

### Fluxo Recomendado

```
1. *tarefas criar → Planejar o que fazer
2. *tarefas listar → Ver todas as tarefas
3. *tarefas iniciar [id] → Começar uma tarefa
4. (trabalhar na tarefa)
5. *tarefas concluir [id] → Marcar como feita
6. *tarefas listar → Ver próxima pendente
7. Repetir
```

### Integração com *garantir

```
Recomendado:
*tarefas concluir → *garantir → Marcar completed

Isso garante que só concluímos tarefas
que passaram pela verificação de qualidade.
```

---

## Dependências

### Criar Dependências

```
Você:
*tarefas criar Fazer deploy
*tarefas bloquear 5 por 4

(Cria tarefa 5 "Deploy" bloqueada pela tarefa 4 "Testes")

Ou de uma vez:
*tarefas criar Fazer deploy após testes
Claude: Qual tarefa deve ser concluída primeiro?
Você: #4 Testes
```

### Ver Dependências

```
Você:
*tarefas ver 5

Claude mostra:
│ Bloqueada por:                                          │
│ - #4 Rodar testes (status: pending)                     │
│                                                          │
│ Esta tarefa só pode ser iniciada após #4 ser concluída. │
```

---

## Templates de Tarefas

### Nova Feature

```
*tarefas criar feature [nome]
  ├── #1: Planejar feature
  ├── #2: Criar especificação
  │   └── Bloqueada por: #1
  ├── #3: Implementar backend
  │   └── Bloqueada por: #2
  ├── #4: Implementar frontend
  │   └── Bloqueada por: #2
  ├── #5: Testar
  │   └── Bloqueada por: #3, #4
  └── #6: Fazer deploy
      └── Bloqueada por: #5
```

### Bug Fix

```
*tarefas criar bug [descrição]
  ├── #1: Reproduzir bug
  ├── #2: Identificar causa
  │   └── Bloqueada por: #1
  ├── #3: Implementar correção
  │   └── Bloqueada por: #2
  ├── #4: Testar correção
  │   └── Bloqueada por: #3
  └── #5: Fazer deploy
      └── Bloqueada por: #4
```

### Refatoração

```
*tarefas criar refatoração [nome]
  ├── #1: Analisar código atual
  ├── #2: Planejar mudanças
  │   └── Bloqueada por: #1
  ├── #3: Implementar mudanças
  │   └── Bloqueada por: #2
  ├── #4: Atualizar testes
  │   └── Bloqueada por: #3
  └── #5: Code review
      └── Bloqueada por: #4
```

---

## Exemplos Práticos

### Começando o Dia

```
Você:
*tarefas listar pendentes

Claude:
Tarefas disponíveis para começar:
- #2 Criar página de login (pendente, sem bloqueios)
- #5 Escrever documentação (pendente, sem bloqueios)

Qual quer iniciar?
```

### Fim do Dia

```
Você:
*tarefas listar

Claude:
📊 Resumo do dia:
- Concluídas: 3
- Em progresso: 1 (#3 - Configurar auth)
- Pendentes: 4

Amanhã, continue com #3 ou inicie #2 ou #5.
```

### Planning de Sprint

```
Você:
*tarefas criar sprint desta semana:
1. Finalizar autenticação
2. Criar dashboard
3. Implementar busca
4. Testes E2E

Claude cria 4 tarefas e pergunta sobre dependências.
```

---

## Comandos Rápidos

| Você digita | O que acontece |
|-------------|----------------|
| `*tarefas` | Lista todas as tarefas |
| `*tarefas criar [nome]` | Cria nova tarefa |
| `*tarefas ver [id]` | Mostra detalhes |
| `*tarefas iniciar [id]` | Marca in_progress |
| `*tarefas concluir [id]` | Marca completed |
| `*tarefas bloquear [id] por [id]` | Cria dependência |
| `*tarefas excluir [id]` | Remove tarefa |

---

## Integração com ROADMAP

### Sincronização

```
Tarefas do *tarefas devem refletir em docs/ROADMAP.md:

Quando tarefa concluída:
1. *tarefas concluir [id]
2. Atualizar ROADMAP.md
3. *mudança para documentar

Quando planejando:
1. *planejar
2. Criar tarefas baseadas no plano
3. *tarefas criar para cada etapa
```

---

## Dicas

### Boas Práticas

```
✓ Tarefas pequenas e específicas
✓ Uma tarefa = uma entrega
✓ Dependências claras
✓ Atualizar status regularmente
✓ Revisar lista diariamente
```

### Evitar

```
✗ Tarefas genéricas ("Melhorar app")
✗ Tarefas gigantes ("Fazer todo o backend")
✗ Esquecer de atualizar status
✗ Criar muitas dependências circulares
```

---

## Resumo para Iniciantes

| Ação | Comando |
|------|---------|
| Ver tarefas | `*tarefas` |
| Criar tarefa | `*tarefas criar [nome]` |
| Começar tarefa | `*tarefas iniciar [id]` |
| Terminar tarefa | `*tarefas concluir [id]` |
| Ver detalhes | `*tarefas ver [id]` |

**Lembre-se:** Tarefas quebram trabalho grande em pedaços menores. Cada pedaço concluído é uma vitória!

---

## Dashboard de Tarefas (NOVO)

### Iniciar Dashboard

```bash
npm run dashboard
# Abre em http://localhost:3001
```

O dashboard oferece visualização em tempo real das tarefas com:
- **Kanban Board** — Tarefas por status
- **DAG View** — Dependências visuais
- **Terminal Prompts** — Copiar/colar para executar
- **Logs em tempo real** — Via Server-Sent Events

---

## Campos de DAG (NOVO)

Tarefas no dashboard suportam campos extras para execução paralela:

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `blockedBy` | string[] | IDs de tarefas que precisam completar primeiro |
| `blocks` | string[] | IDs de tarefas que esta tarefa bloqueia |
| `level` | number | Nível no DAG (0 = sem dependências, pode executar imediatamente) |
| `terminalPrompt` | string | Prompt pronto para copiar/colar no Claude Code |
| `agent` | string | Agente responsável (PM, ARCHITECT, DEVELOPER, etc) |
| `protocol` | string | Arquivo de protocolo relacionado |

### Exemplo de Tarefa Completa

```json
{
  "id": "task-123",
  "subject": "Implementar sistema de pagamentos",
  "description": "Criar integração com Stripe para processar pagamentos",
  "status": "pending",
  "agent": "DEVELOPER",
  "level": 1,
  "blockedBy": ["task-arch-001", "task-design-002"],
  "blocks": ["task-review-003", "task-qa-004"],
  "terminalPrompt": "claude \"Implemente o sistema de pagamentos conforme definido em docs/ARQUITETURA.md. Use o protocolo 01-DESENVOLVER.md\"",
  "protocol": "01-DESENVOLVER.md",
  "progress": 0,
  "logs": []
}
```

---

## Execução Paralela por Nível (NOVO)

O orchestrator executa tarefas em paralelo quando não há dependências:

```
NÍVEL 0 (executam em PARALELO - sem dependências):
├── Task A (agent: ARCHITECT)
├── Task B (agent: DESIGNER)
└── Task C (agent: DATA)

NÍVEL 1 (executa SEQUENCIAL - aguarda Nível 0):
└── Task D (agent: DEVELOPER) → blockedBy: [A, B, C]

NÍVEL 2 (executam em PARALELO - aguardam Nível 1):
├── Task E (agent: REVIEWER) → blockedBy: [D]
├── Task F (agent: QA) → blockedBy: [D]
└── Task G (agent: SECURITY) → blockedBy: [D]
```

### Benefícios

- **60-80% mais rápido** que execução sequencial
- Visualização clara de bloqueios
- Logs centralizados
- Prompts prontos para usar

---

## Comandos do Dashboard

| Comando | Função |
|---------|--------|
| `*dashboard` | Inicia o dashboard em localhost:3001 (somente consulta) |

### Observação importante

No modo dashboard, mutações de tarefa/squad ficam bloqueadas por design:
- `POST`, `PATCH` e `DELETE` retornam `403`
- a interface é destinada a consulta, monitoramento e acompanhamento
