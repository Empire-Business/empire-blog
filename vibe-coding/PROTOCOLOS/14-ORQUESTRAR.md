---
## PARA CLAUDE (AI INSTRUCTIONS)

Este protocolo é invocado pelo comando `*orquestrar` no CLAUDE.md.
Execute conforme as regras definidas no CLAUDE.md e em COMUNICACAO.md.
---

# Protocolo de Orquestração (*orquestrar)

## Quando Usar

- Problema complexo que precisa de múltiplos comandos
- Não sabe qual comando usar
- Quer combinar vários comandos em sequência
- Diagnóstico completo do projeto

---

## Árvore de Decisão

### Problema → Comando(s)

```
┌─────────────────────────────────────────────────────────────────┐
│                     QUAL É O PROBLEMA?                          │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
   [Novo projeto]        [Bug/Erro]           [Feature nova]
        │                     │                     │
        ▼                     ▼                     ▼
   *começar              *bug                 *desenvolver
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
         [Mensagem      [Comportamento   [Performance]
          de erro]       estranho]
              │               │               │
              ▼               ▼               ▼
           *erro          *investigar     *banco +
                                         *nerd

┌─────────────────────────────────────────────────────────────────┐
│                    O QUE PRECISA FAZER?                         │
└─────────────────────────────────────────────────────────────────┘
                              │
    ┌──────────┬──────────────┼──────────────┬────────────┐
    ▼          ▼              ▼              ▼            ▼
[Segurança] [Qualidade] [Documentar] [Automação] [Lançar]
    │          │              │              │            │
    ▼          ▼              ▼              ▼            ▼
*seguranca  *qualidade    *mudança     *workflow     *lançar
    +                       +              +
 *garantir              *decisão       *tarefas

┌─────────────────────────────────────────────────────────────────┐
│                    QUEM VAI FAZER?                              │
└─────────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
         [Sozinho]       [Equipe]       [Especialista]
              │               │               │
              ▼               ▼               ▼
           (você)         *agentes      *nerd / *ux /
                                       *design / *banco
```

---

## Fluxos Compostos

### 1. Novo Projeto Completo

```
*começar
    ↓
*desenvolver (iterativo)
    ↓
*mudança (a cada feature)
    ↓
*seguranca (antes de lançar)
    ↓
*qualidade
    ↓
*garantir
    ↓
*lançar
```

### 2. Bug Crítico em Produção

```
*bug
    ↓
    └── Se difícil → *agentes ou *nerd
    ↓
*garantir (aprovar fix)
    ↓
*mudança
    ↓
(lançar hotfix)
```

### 3. Performance Lenta

```
*banco (diagnóstico)
    ↓
    └── Se problema de query → *nerd
    └── Se problema de índice → criar índice
    └── Se problema de conexão → *supabase
    ↓
*garantir
    ↓
*mudança
```

### 4. Refatoração Grande

```
*qualidade (análise)
    ↓
*melhorar
    ↓
*revisar
    ↓
*seguranca (verificar)
    ↓
*garantir
    ↓
*mudança
```

### 5. Setup de Projeto Existente

```
*status
    ↓
*arquitetura (se desatualizado)
    ↓
*supabase (se precisar)
    ↓
*workflow (CI/CD)
    ↓
*seguranca
    ↓
*desenvolver
```

---

## Combinações Recomendadas

### Por Objetivo

| Objetivo | Comandos | Ordem |
|----------|----------|-------|
| Começar projeto | começar → desenvolver | 1, 2 |
| Resolver bug | bug → garantir → mudança | 1, 2, 3 |
| Adicionar feature | desenvolver → garantir → mudança | 1, 2, 3 |
| Preparar lançamento | seguranca → qualidade → garantir → lançar | 1, 2, 3, 4 |
| Otimizar performance | banco → nerd → garantir | 1, 2, 3 |
| Refatorar | qualidade → melhorar → garantir | 1, 2, 3 |
| Documentar | decisão → mudança → status | 1, 2, 3 |
| Automatizar | workflow → tarefas | 1, 2 |

### Por Área

| Área | Comandos Disponíveis |
|------|---------------------|
| Principais | começar, desenvolver, bug, erro, termo, comando, lançar |
| Documentação | roadmap, decisão, mudança, arquitetura, status |
| Design & UX | design, ux |
| Qualidade | seguranca, qualidade, garantir, revisar |
| Infra & Banco | banco, supabase |
| Automação | workflow, orquestrar, tarefas |
| Planejamento | planejar, especificar |
| Especialistas | nerd, agentes, melhorar |

---

## Uso Prático

### Exemplo: "Meu app está lento"

```
Você digita:
*orquestrar Meu app está lento

Claude responde:
Vou diagnosticar o problema. Vou usar esta sequência:

1. *banco - Verificar saúde do banco de dados
   → Queries lentas?
   → Índices faltando?
   → Dead tuples?

2. Se banco OK → *nerd para análise de performance
   → Profiling do código
   → Memory leaks?
   → Bundle size?

3. Após correção → *garantir
   → Verificar se resolveu
   → Aprovar mudança

4. *mudança - Documentar a correção

Posso começar?
```

### Exemplo: "Preciso adicionar autenticação"

```
Você digita:
*orquestrar Preciso adicionar autenticação

Claude responde:
Vou usar esta sequência:

1. *desenvolver - Implementar autenticação
   → Configurar provider (Supabase Auth, NextAuth, etc)
   → Criar telas de login/cadastro
   → Proteger rotas

2. *seguranca - Verificar implementação
   → Senhas hasheadas?
   → Tokens com expiração?
   → RLS configurado?

3. *ux - Garantir boa experiência
   → Estados de loading
   → Mensagens de erro claras
   → Recuperação de senha

4. *garantir - Aprovar para produção

5. *mudança - Documentar

Posso começar?
```

---

## Perguntas de Diagnóstico

### Quando o usuário pedir *orquestrar

O Claude deve fazer estas perguntas (se necessário):

```
1. O que está tentando fazer?
   - Nova feature? Bug? Otimização? Documentação?

2. Qual a urgência?
   - Crítico (produção parada)?
   - Alto (precisa hoje)?
   - Normal (esta semana)?

3. Já tentou algo?
   - Qual comando usou?
   - Qual foi o resultado?

4. Tem preferência de abordagem?
   - Mais rápido ou mais completo?
   - Sozinho ou com agentes?
```

---

## Matriz de Decisão

```
                    URGÊNCIA
                Baixa    Alta
           ┌─────────┬─────────┐
      Nova │ *planejar│*desen-  │
      │     │         │volver   │
      │     ├─────────┼─────────┤
 COM- │ Bug │ *bug    │*bug +   │
 PLEX-│     │         │*nerd    │
      │     ├─────────┼─────────┤
      │Opti-│*banco + │*banco + │
      │mizar│*qualida-│*nerd    │
      │     │de       │         │
           └─────────┴─────────┘
```

---

## Integração com Tarefas

### Criar Plano de Ação

```
Quando orquestrar algo complexo:

1. *tarefas - Criar tarefas para cada etapa
2. Executar comandos na ordem
3. *tarefas - Marcar concluídas
4. *garantir - Aprovar conjunto
5. *mudança - Documentar
```

### Exemplo

```
*orquestrar Vou refatorar todo o sistema de pagamentos

Claude cria tarefas:
├── [ ] 1. *qualidade - Analisar código atual
├── [ ] 2. *especificar - Criar spec da refatoração
├── [ ] 3. *desenvolver - Implementar mudanças
├── [ ] 4. *seguranca - Verificar segurança (PCI, etc)
├── [ ] 5. *revisar - Code review completo
├── [ ] 6. *garantir - Aprovar mudança
└── [ ] 7. *mudança - Documentar no changelog

Posso começar pela tarefa 1?
```

---

## Checklist do Orquestrador

### Antes de começar:

```
□ Entendi o problema/objetivo
□ Identifiquei os comandos necessários
□ Defini a ordem lógica
□ Verifiquei dependências
□ Confirmei com o usuário
```

### Durante execução:

```
□ Executo comandos na ordem
□ Reporto progresso
□ Pergunto se pular algo
□ Adapto se necessário
```

### Ao finalizar:

```
□ Todas etapas concluídas
□ *garantir foi executado
□ *mudança documentado
□ Próximos passos claros
```

---

## Resumo para Iniciantes

| Situação | Use |
|----------|-----|
| Não sei qual comando | *orquestrar + descrição |
| Coisa complexa | *orquestrar para ver o plano |
| Múltiplos comandos | *orquestrar coordena tudo |
| Quero um diagnóstico | *orquestrar + "análise completa" |

**Lembre-se:** *orquestrar é seu assistente de navegação. Ele sabe qual comando usar em cada situação.
