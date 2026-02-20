---
## PARA CLAUDE (AI INSTRUCTIONS)

Este protocolo é invocado pelo comando `*planejar` no CLAUDE.md.
Execute conforme as regras definidas no CLAUDE.md e em COMUNICACAO.md.
---

# Protocolo de Planejamento (*planejar)

## Quando Usar

- Iniciando projeto complexo
- Planejando sprint
- Antes de refatoração grande
- Dividindo feature em etapas
- Estimando prazos
- Identificando riscos

---

## Estrutura WBS (Work Breakdown Structure)

### O que é WBS?

```
WBS = Dividir o trabalho em partes menores e gerenciáveis

Nível 1: Projeto
├── Nível 2: Fases/Épicos
│   ├── Nível 3: Features
│   │   ├── Nível 4: Tarefas
│   │   │   └── Nível 5: Subtarefas
```

### Exemplo: App de E-commerce

```
📦 E-commerce App
├── 🎯 Fase 1: Fundação
│   ├── Setup do projeto
│   │   ├── Criar repositório
│   │   ├── Configurar ESLint/Prettier
│   │   └── Setup Supabase
│   ├── Autenticação
│   │   ├── Tela de login
│   │   ├── Tela de cadastro
│   │   └── Recuperação de senha
│   └── Layout base
│       ├── Header
│       ├── Footer
│       └── Navegação
│
├── 🎯 Fase 2: Catálogo
│   ├── Listagem de produtos
│   ├── Filtros e busca
│   ├── Página de produto
│   └── Categorias
│
├── 🎯 Fase 3: Carrinho
│   ├── Adicionar/remover
│   ├── Atualizar quantidade
│   └── Cálculo de totais
│
├── 🎯 Fase 4: Checkout
│   ├── Endereço
│   ├── Pagamento
│   └── Confirmação
│
└── 🎯 Fase 5: Pós-venda
    ├── Pedidos
    ├── Status de entrega
    └── Avaliações
```

---

## Critérios de Aceite

### Formato

```markdown
## Feature: [Nome da Feature]

### Critérios de Aceite

**Dado** [contexto inicial]
**Quando** [ação do usuário]
**Então** [resultado esperado]

### Exemplos

#### Login
**Dado** que estou na página de login
**Quando** insiro email "user@email.com" e senha "123456"
  E clico em "Entrar"
**Então** devo ser redirecionado para o dashboard
  E ver mensagem "Bem-vindo!"

#### Erro de Login
**Dado** que estou na página de login
**Quando** insiro email "user@email.com" e senha "errada"
  E clico em "Entrar"
**Então** devo ver mensagem "Email ou senha incorretos"
  E continuar na página de login
```

### Checklist de Critérios

```
□ Critérios são testáveis?
□ Cobrem o caminho feliz?
□ Cobrem casos de erro?
□ Cobrem edge cases?
□ São específicos o suficiente?
```

---

## Estimativas

### T-Shirt Sizing

```
XS  → < 2 horas    → Muito simples, óbvio
S   → 2-4 horas    → Simples, sem surpresas
M   → 4-8 horas    → Médio, algum desafio
L   → 1-2 dias     → Complexo, precisa pensar
XL  → 3-5 dias     → Muito complexo, incerteza
XXL → > 1 semana   → Gigante, quebrar em menores!
```

### Fibonacci (Story Points)

```
1  → Trivial
2  → Muito fácil
3  → Fácil
5  → Médio
8  → Difícil
13 → Muito difícil
21 → Quebrar em menores
```

### Planning Poker

```
Equipe vota simultaneamente:
1. Cada um escolhe um número (1, 2, 3, 5, 8, 13...)
2. Revelam ao mesmo tempo
3. Se discrepância grande → discutir
4. Chegar em consenso
```

---

## Matriz de Riscos

### Identificar Riscos

```markdown
## Riscos do Projeto

| Risco | Probabilidade | Impacto | Mitigação |
|-------|--------------|---------|-----------|
| API externa instável | Alta | Alto | Implementar cache + retry |
| Estimativa errada | Média | Médio | Buffer de 20% no prazo |
| Mudança de escopo | Alta | Alto | Definir MVP bem claro |
| Performance ruim | Baixa | Alto | Testes de carga |
| Bug em produção | Média | Alto | CI/CD + testes |
```

### Probabilidade x Impacto

```
                 IMPACTO
           Baixo  Médio  Alto
         ┌───────┬───────┬───────┐
    Alto │  ⚠️   │  🔴   │  🔴   │
PROB     ├───────┼───────┼───────┤
   Médio │  🟡   │  ⚠️   │  🔴   │
         ├───────┼───────┼───────┤
    Baixo│  ✅   │  🟡   │  ⚠️   │
         └───────┴───────┴───────┘

✅ = Aceitar    🟡 = Monitorar
⚠️ = Mitigar    🔴 = Evitar/Escalate
```

---

## Roadmap de Planejamento

### Template

```markdown
# Roadmap: [Nome do Projeto]

## Visão
[Uma frase descrevendo o objetivo final]

## Marcos (Milestones)

### M1: MVP - [Data]
- [ ] Feature 1
- [ ] Feature 2
- [ ] Feature 3

### M2: V1.0 - [Data]
- [ ] Feature 4
- [ ] Feature 5

### M3: V2.0 - [Data]
- [ ] Feature 6
- [ ] Feature 7

## Backlog
- Feature 8
- Feature 9

## Riscos
- [Risco 1] → [Mitigação]
- [Risco 2] → [Mitigação]
```

---

## Priorização

### MoSCoW

```
MUST    → Obrigatório (sem isso, não entrega)
SHOULD → Importante (agrega muito valor)
COULD   → Desejável (nice to have)
WON'T   → Não vai ter (desta versão)
```

### RICE Score

```
RICE = (Reach × Impact × Confidence) / Effort

Reach      → Quantas pessoas afeta? (por trimestre)
Impact     → Quanto impacto? (0.25 a 3)
Confidence → Quão certo estamos? (50% a 100%)
Effort     → Quanto trabalho? (pessoa-mês)

Exemplo:
Feature A: (1000 × 2 × 80%) / 2 = 800
Feature B: (500 × 3 × 100%) / 1 = 1500

Feature B tem RICE maior → priorizar
```

### Value vs Effort

```
         Alto Valor
              │
     Q2       │       Q1
  (Evaluar)   │   (Fazer primeiro)
              │
──────────────┼──────────────
              │
     Q3       │       Q4
  (Se sobrar  │   (Evitar/Ficar
   tempo)     │    para depois)
              │
         Baixo Valor

    Baixo Effort ─── Alto Effort
```

---

## Definição de Pronto (DoD)

### Definition of Done

```markdown
## Uma tarefa está PRONTA quando:

### Código
- [ ] Código funciona localmente
- [ ] Passa lint sem erros
- [ ] Sem console.logs
- [ ] Código limpo e legível

### Testes
- [ ] Testes unitários passando
- [ ] Novos testes para código novo
- [ ] Cobertura mantida ou aumentada

### Documentação
- [ ] MUDANCAS.md atualizado
- [ ] Comentários em código complexo
- [ ] README atualizado (se necessário)

### Review
- [ ] Code review aprovado
- [ ] *garantir executado
- [ ] Testado em staging (se aplicável)

### Deploy
- [ ] Build passa
- [ ] Migrações rodadas (se necessário)
- [ ] Feature flags configuradas (se necessário)
```

---

## Planejamento de Sprint

### Estrutura

```markdown
# Sprint [Número] - [Data Início] a [Data Fim]

## Objetivo
[Meta da sprint em uma frase]

## Tarefas

### Alta Prioridade (MUST)
| ID | Tarefa | Estimativa | Responsável |
|----|--------|------------|-------------|
| 1  | Login  | M          | -           |
| 2  | CRUD   | L          | -           |

### Média Prioridade (SHOULD)
| ID | Tarefa | Estimativa | Responsável |
|----|--------|------------|-------------|
| 3  | Filtros| S          | -           |

### Baixa Prioridade (COULD)
| ID | Tarefa | Estimativa | Responsável |
|----|--------|------------|-------------|
| 4  | Tema   | XS         | -           |

## Capacidade
- Dias úteis: 10
- Pessoas: 1
- Capacidade: ~60-80 pontos

## Riscos
- [Identificar riscos da sprint]
```

### Daily Standup

```
O que fiz ontem?
O que vou fazer hoje?
Algum bloqueio?
```

---

## Checklist de Planejamento

### Antes de começar:

```
□ Entendi o objetivo do projeto
□ Identifiquei stakeholders
□ Defini escopo do MVP
□ Mapeei dependências
□ Identifiquei riscos principais
□ Tenho recursos necessários
```

### Durante o planejamento:

```
□ Quebrei em tarefas pequenas
□ Estimei cada tarefa
□ Defini prioridades
□ Criei critérios de aceite
□ Identifiquei riscos e mitigações
□ Defini marcos (milestones)
```

### Após planejar:

```
□ Plano documentado em docs/
□ ROADMAP.md atualizado
□ Tarefas criadas (*tarefas)
□ Time alinhado (se houver)
□ Próximo passo claro
```

---

## Resumo para Iniciantes

| Termo | Significado |
|-------|-------------|
| WBS | Dividir projeto em partes menores |
| MVP | Versão mínima que funciona |
| Critério de Aceite | Como saber que está pronto |
| Estimativa | "Acho que demora X" |
| Risco | O que pode dar errado |
| DoD | Checklist de "pronto" |

**Lembre-se:** Um bom plano não é perfeito, é realista. Planos mudam, e isso é normal.
