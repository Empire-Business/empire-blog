---
## PARA CLAUDE (AI INSTRUCTIONS)

IMPORTANTE - LEIA COM ATENÇÃO:

1. NUNCA implemente código durante *roadmap
2. SEMPRE mostre checkpoint antes de começar
3. SEMPRE verifique se PRD existe primeiro
4. SEMPRE pare em STOP POINTS
5. Este comando CRIA DOCUMENTAÇÃO, não código
---

# 21-ROADMAP.md - Protocolo de Roadmap

## Quando Usar

- `*roadmap` → Criar/atualizar roadmap do projeto
- Depois de criar o PRD (`*prd`)
- Antes de começar desenvolvimento (`*desenvolver`)
- Quando precisar planejar fases e prioridades

---

## ⚠️ VERIFICAÇÃO DE PRÉ-REQUISITO (OBRIGATÓRIO)

### ANTES de começar, VERIFIQUE se o PRD existe:

**USE `ls` ou `Read` para VERIFICAR EXPLICITAMENTE.**

```
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║  🔒 VERIFICAÇÃO DE PRÉ-REQUISITO                             ║
║                                                               ║
║  O Roadmap precisa do PRD para saber O QUE planejar.         ║
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
║  🛑 ROADMAP BLOQUEADO                                         ║
║                                                               ║
║  O pré-requisito está faltando:                               ║
║                                                               ║
║  [❌] PRD docs/PRD.md                                         ║
║                                                               ║
║  O Roadmap define QUANDO fazer cada coisa.                   ║
║  Mas sem saber O QUE fazer (PRD), não dá para planejar!      ║
║                                                               ║
║  Para resolver: Execute *prd primeiro                        ║
║                                                               ║
║  NÃO POSSO PROSSEGUIR até o PRD existir.                     ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝

🛑 STOP_POINT_BLOQUEIO
→ NÃO prossiga com roadmap
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
║  O PRD está disponível. Vou usá-lo para criar o roadmap.     ║
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
│  📅 Roadmap - Plano de Execução                                 │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ✅ VOU FAZER:                                                  │
│                                                                 │
│     1. Ler o PRD para entender o escopo                        │
│     2. Fazer até 5 perguntas sobre prioridades                 │
│     3. Criar docs/ROADMAP.md com fases e tarefas               │
│     4. Organizar em ordem lógica de execução                   │
│                                                                 │
│  ❌ NÃO VOU FAZER:                                              │
│                                                                 │
│     ✗ Implementar código                                        │
│     ✗ Criar arquivos de programação                             │
│     ✗ Fazer estimativas de tempo (só complexidade)             │
│     ✗ Definir tecnologias (isso é *arquitetura)                │
│                                                                 │
│  📁 ARQUIVO QUE SERÁ CRIADO:                                    │
│     → docs/ROADMAP.md                                           │
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

1. Funcionalidades MUST (obrigatórias para MVP)
2. Funcionalidades SHOULD (importantes)
3. Funcionalidades COULD (nice to have)
4. Dependências identificadas
5. Riscos mencionados
```

### ETAPA 2: Perguntas de Priorização (máx. 5)

```
Depois da confirmação, faça ATÉ 5 perguntas:

1. Qual funcionalidade é a mais crítica para o MVP?
   (Sem isso, o projeto não faz sentido)

2. Existe alguma data importante (lançamento, evento)?
   (Isso afeta a priorização)

3. Qual funcionalidade você quer que os usuários vejam primeiro?
   (Primeira impressão)

4. Tem alguma dependência externa que pode atrasar?
   (APIs terceiras, aprovações, etc)

5. Prefiro entregar menos funcionalidades mas funcionando bem,
   ou mais funcionalidades mas mais simples?
   (Qualidade vs Quantidade)

🛑 STOP_POINT_PERGUNTA
→ ESPERE o usuário responder TODAS as perguntas
→ Se não responder alguma, use DEFAULTS (veja abaixo)
```

### ETAPA 3: Criar o Roadmap

```
Após receber as respostas:

1. Gerar docs/ROADMAP.md usando a estrutura abaixo
2. Organizar em fases lógicas
3. Incluir checklist de tarefas por fase
4. NÃO incluir estimativas de tempo (use T-shirt sizing)

🛑 STOP_POINT_DOCUMENTACAO
→ MOSTRE o conteúdo criado
→ PERGUNTE se quer ajustar algo
→ SÓ continue após aprovação
```

### ETAPA 4: Próximos Passos

```
Depois de aprovar o Roadmap:

1. SUGIRA próximos passos (não execute automaticamente):
   - "Agora precisamos definir a arquitetura" (*arquitetura)
   - "Quer definir como vai ser visualmente?" (*design)
   - "Quer ver o status completo?" (*status)

2. Mostre progresso dos pré-requisitos:

   ╔═══════════════════════════════════════════════════════════════╗
   ║                                                               ║
   ║  📊 STATUS DE PRÉ-REQUISITOS                                 ║
   ║                                                               ║
   ║  [✅] PRD         docs/PRD.md                                 ║
   ║  [❌] Arquitetura docs/ARQUITETURA/                           ║
   ║  [✅] Roadmap     docs/ROADMAP.md                             ║
   ║  [❌] Design      docs/DESIGN/                                ║
   ║                                                               ║
   ║  Próximo passo sugerido: *arquitetura                        ║
   ║                                                               ║
   ╚═══════════════════════════════════════════════════════════════╝

🛑 STOP_POINT_ETAPA
→ ESPERE o usuário escolher o próximo passo
```

---

## ESTRUTURA DO ROADMAP

### Cabeçalho

```markdown
# ROADMAP: [Nome do Projeto]

| Campo | Valor |
|-------|-------|
| **Versão** | 1.0 |
| **Última atualização** | [Data de hoje] |
| **Status** | Em planejamento |

> Este roadmap define a ordem de implementação do projeto.
> Consulte o PRD em `docs/PRD.md` para detalhes das funcionalidades.

---

## 📋 Resumo Executivo

**Objetivo:** [Uma frase descrevendo o objetivo principal]

**Fases:** [Número] fases planejadas

**Status atual:** Fase [X] - [Nome da fase]

---

## 🎯 Visão Geral das Fases

| Fase | Nome | Status | Complexidade |
|------|------|--------|--------------|
| 0 | Preparação | [ ] Pendente | - |
| 1 | MVP | [ ] Pendente | M |
| 2 | Melhorias | [ ] Pendente | S |
| 3 | Futuro | [ ] Pendente | L |
```

---

### FASE 0: Preparação (Obrigatório)

```markdown
---

## 📅 FASE 0: Preparação

Antes de começar a desenvolver, precisamos ter a documentação completa:

- [ ] **PRD criado** → docs/PRD.md ✅
- [ ] **Arquitetura definida** → docs/ARQUITETURA/
- [ ] **Roadmap criado** → docs/ROADMAP.md ✅
- [ ] **Design System definido** → docs/DESIGN/ ou Tailwind

**Status:** Em andamento

> 💡 Execute *arquitetura e *design para completar esta fase.
```

---

### FASE 1: MVP (Minimum Viable Product)

```markdown
---

## 📅 FASE 1: MVP

**Objetivo:** O mínimo necessário para ter um produto funcional.

**Complexidade:** M (Moderado)

**Dependências:** Fase 0 completa

### Tarefas

| ID | Tarefa | Prioridade | Complexidade | Status |
|----|--------|------------|--------------|--------|
| M1 | [Funcionalidade principal 1] | P0 | M | [ ] |
| M2 | [Funcionalidade principal 2] | P0 | S | [ ] |
| M3 | [Funcionalidade principal 3] | P0 | L | [ ] |
| M4 | [Funcionalidade secundária] | P1 | S | [ ] |

### Critérios de Lançamento

- [ ] Usuário consegue fazer [ação principal]
- [ ] Fluxo principal funciona sem erros
- [ ] Testado em [dispositivos/navegadores]
- [ ] Performance aceitável (< 3s carregamento)
```

---

### FASE 2: Melhorias Pós-MVP

```markdown
---

## 📅 FASE 2: Melhorias Pós-MVP

**Objetivo:** Funcionalidades importantes mas não críticas para o lançamento.

**Complexidade:** S (Simples)

**Dependências:** Fase 1 completa

### Tarefas

| ID | Tarefa | Prioridade | Complexidade | Status |
|----|--------|------------|--------------|--------|
| I1 | [Funcionalidade 5] | P1 | M | [ ] |
| I2 | [Funcionalidade 6] | P1 | S | [ ] |
| I3 | [Funcionalidade 7] | P2 | S | [ ] |
```

---

### FASE 3: Futuro (Backlog)

```markdown
---

## 📅 FASE 3: Futuro (Backlog)

**Objetivo:** Ideias para o futuro, sem data definida.

### Tarefas

| ID | Tarefa | Prioridade | Complexidade | Status |
|----|--------|------------|--------------|--------|
| F1 | [Funcionalidade 8] | P2 | M | Backlog |
| F2 | [Funcionalidade 9] | P3 | L | Backlog |
```

---

### Legenda

```markdown
---

## 📖 Legenda

### Prioridades

| Símbolo | Significado |
|---------|-------------|
| P0 | Obrigatório para MVP - não pode faltar |
| P1 | Importante - deve ter logo após MVP |
| P2 | Nice to have - quando tiver tempo |
| P3 | Futuro - talvez nunca |

### Complexidade (T-Shirt Sizing)

| Size | Descrição |
|------|-----------|
| XS | Muito simples (< 2h) |
| S | Simples (2-4h) |
| M | Moderado (4-8h) |
| L | Complexo (1-2 dias) |
| XL | Muito complexo (> 2 dias, quebrar!) |

### Status

| Status | Significado |
|--------|-------------|
| [ ] | Pendente |
| [>] | Em andamento |
| [x] | Completo |
| [-] | Bloqueado |
```

---

### Status de Pré-requisitos

```markdown
---

## 📊 Status de Pré-requisitos

| Documento | Status | Arquivo |
|-----------|--------|---------|
| PRD | ✅ | docs/PRD.md |
| Arquitetura | ❌ | docs/ARQUITETURA/ |
| Roadmap | ✅ | docs/ROADMAP.md |
| Design | ❌ | docs/DESIGN/ |

> 🔒 Complete todos os pré-requisitos antes de `*desenvolver`.
```

---

### Histórico de Mudanças

```markdown
---

## 📝 Histórico de Mudanças

| Data | Versão | Mudança |
|------|--------|---------|
| [Data] | 1.0.0 | Criação inicial do roadmap |

---

## Para atualizar este roadmap:
- Use `*roadmap` para revisar
- Marque tarefas como completas quando terminar
- Mova tarefas entre fases conforme necessário
```

---

## T-SHIRT SIZING (Complexidade)

Use esta escala para estimar complexidade:

| Size | Descrição | Exemplos |
|------|-----------|----------|
| **XS** | Muito simples, óbvio | Mudar texto, ajustar cor |
| **S** | Simples, direto | Campo de formulário, validação simples |
| **M** | Moderado, alguma complexidade | CRUD completo, integração simples |
| **L** | Complexo, múltiplas partes | Fluxo de pagamento, autenticação |
| **XL** | Muito complexo, quebrar! | Sistema inteiro, refatoração grande |

**Regra:** Se for XXL (mais que 1 semana), QUEBRE em tarefas menores!

---

## DEFAULTS (se faltar informação)

Use estes valores quando não tiver informação:

| Item | Default |
|------|---------|
| Número de fases | 3-4 fases para MVP |
| Primeira fase | Funcionalidade core |
| Complexidade padrão | M (moderado) |
| Prioridade | Baseada em dependências |
| Backlog | Features COULD do PRD |

---

## RESUMO PARA INICIANTES

| Termo | Significado |
|-------|-------------|
| Roadmap | Plano de viagem do projeto |
| Fase | Grupo de tarefas relacionadas |
| MVP | Versão mínima que já funciona |
| Backlog | Lista de coisas para depois |
| T-shirt Size | Medida de complexidade (não tempo!) |
| Critério de pronto | Como saber que terminou |
| P0 | Obrigatório, não pode faltar |
| P1 | Importante, mas pode esperar |
| P2 | Nice to have, faz quando der tempo |

---

## ⚠️ LEMBRETE FINAL

```
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║  Este comando CRIA DOCUMENTAÇÃO.                              ║
║                                                               ║
║  NÃO implementa código.                                       ║
║  NÃO define tecnologias (isso é *arquitetura).               ║
║  NÃO faz estimativas de tempo (use T-shirt sizing).          ║
║                                                               ║
║  Roadmap = Plano, não cronograma!                             ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
```
