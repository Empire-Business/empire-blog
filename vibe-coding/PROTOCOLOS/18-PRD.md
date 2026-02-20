---
## PARA CLAUDE (AI INSTRUCTIONS)

IMPORTANTE - LEIA COM ATENÇÃO:

1. NUNCA implemente código durante *prd
2. SEMPRE mostre checkpoint antes de começar
3. SEMPRE faça perguntas PRIMEIRO
4. SEMPRE pare em STOP POINTS
5. Este comando CRIA DOCUMENTAÇÃO, não código
---

# 18-PRD.md - Protocolo de PRD Generator

## Quando Usar

- `*prd` → Gerar/atualizar PRD
- `*começar` → Quando usuário escolhe "Criar PRD"
- Antes de desenvolver features grandes
- Quando precisa alinhar visão com stakeholders

---

## ⚠️ CHECKPOINT INICIAL (OBRIGATÓRIO)

### ANTES de começar, SEMPRE mostre:

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  📋 PRD Generator - Documento de Requisitos                    │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ✅ VOU FAZER:                                                  │
│                                                                 │
│     1. Fazer até 5 perguntas para entender sua ideia           │
│     2. Criar docs/PRD.md com as respostas                      │
│     3. Incluir seção leiga (sem jargão técnico)                │
│     4. Incluir seção técnica (para desenvolvedores)            │
│                                                                 │
│  ❌ NÃO VOU FAZER:                                              │
│                                                                 │
│     ✗ Implementar código                                        │
│     ✗ Criar arquivos de programação                             │
│     ✗ Configurar ambiente                                       │
│     ✗ Instalar dependências                                     │
│     ✗ Criar banco de dados                                      │
│                                                                 │
│  📁 ARQUIVO QUE SERÁ CRIADO:                                    │
│     → docs/PRD.md                                               │
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

### ETAPA 1: Perguntas de Entendimento (máx. 5)

```
Depois da confirmação, faça ATÉ 5 perguntas:

1. Qual é a ideia principal do projeto?
   (Uma frase que descreve o que você quer criar)

2. Para quem é esse projeto?
   (Quem vai usar? Que tipo de pessoa?)

3. Qual problema principal ele resolve?
   (O que a pessoa sofre hoje que seu projeto vai resolver?)

4. O que define sucesso para você?
   (Como você sabe que funcionou? Que métrica importa?)

5. O que está FORA de escopo?
   (O que você NÃO quer que o projeto faça?)

🛑 STOP_POINT_PERGUNTA
→ ESPERE o usuário responder TODAS as perguntas
→ Se não responder alguma, use DEFAULTS (veja abaixo)
```

### ETAPA 2: Criar o Documento

```
Após receber as respostas:

1. Gerar docs/PRD.md usando a estrutura abaixo
2. Incluir seção leiga (linguagem simples)
3. Incluir seção técnica (para desenvolvedores)

🛑 STOP_POINT_DOCUMENTACAO
→ MOSTRE o conteúdo criado
→ PERGUNTE se quer ajustar algo
→ SÓ continue após aprovação
```

### ETAPA 3: Próximos Passos

```
Depois de aprovar o PRD:

1. SUGIRA próximos passos (não execute automaticamente):
   - "Quer que eu crie o roadmap?" (*roadmap)
   - "Quer que eu configure o ambiente?" (*setup)
   - "Quer começar a desenvolver?" (*desenvolver)

2. NÃO crie arquivos automaticamente

🛑 STOP_POINT_ETAPA
→ ESPERE o usuário escolher o próximo passo
```

---

## ESTRUTURA DO PRD

### 0. CABEÇALHO

```markdown
# PRD: [Nome do Projeto]

| Campo | Valor |
|-------|-------|
| **One-liner** | [Uma frase descrevendo o projeto] |
| **Owner** | [Quem é responsável] |
| **Status** | Draft |
| **Data** | [Data de hoje] |
```

---

### 1. RESUMO PARA LEIGOS (OBRIGATÓRIO)

Esta seção deve ser compreensível por qualquer pessoa, sem conhecimento técnico.

```markdown
## 1. Resumo para Leigos

### O que é
[Explicar em 2-3 frases simples, como se estivesse explicando para um amigo]

### Para quem é
[Descrever o tipo de pessoa que vai usar]

### Qual problema resolve
[Usar exemplo do dia a dia]

**Exemplo:**
> "Hoje, Maria perde 2 horas por dia procurando documentos espalhados em pastas diferentes..."

### Como funciona (passo a passo simples)
1. [Passo 1]
2. [Passo 2]
3. [Passo 3]

### O que o usuário consegue fazer
- [ ] [Ação 1]
- [ ] [Ação 2]
- [ ] [Ação 3]
- [ ] [Ação 4]

### O que NÃO faz (importante!)
- [ ] [Limitação 1]
- [ ] [Limitação 2]
- [ ] [Limitação 3]

### Benefícios
**Para o usuário:**
- [Benefício 1]
- [Benefício 2]

**Para o negócio:**
- [Benefício 1]
- [Benefício 2]

### Exemplo Prático (história)
[História curta com começo, meio e fim mostrando alguém usando]

> **João é dono de uma pequena loja...**
>
> [Descrever a situação antes, como usou o sistema, e o resultado depois]

### Riscos e Cuidados (em linguagem simples)
| Risco | O que pode acontecer | Como evitar |
|-------|---------------------|-------------|
| [Risco 1] | [Consequência] | [Prevenção] |

### Glossário Leigo
| Termo | Significado simples |
|-------|---------------------|
| [Termo 1] | [Explicação com analogia] |
| [Termo 2] | [Explicação com analogia] |
```

---

### 2. CONTEXTO E PROBLEMA (Técnico)

```markdown
## 2. Contexto e Problema

### Dor do Usuário
[Descrever a dor em detalhes]

### Impacto
- **Quantitativo:** [Números se houver]
- **Qualitativo:** [Como afeta o dia a dia]

### Por que agora?
[Timing: o que mudou que torna isso urgente/importante agora?]

### Alternativas atuais
| Alternativa | Prós | Contras |
|-------------|------|---------|
| [Opção 1] | [+] | [-] |
| [Opção 2] | [+] | [-] |
| Fazer nada | [+] | [-] |
```

---

### 3. OBJETIVOS E SUCESSO

```markdown
## 3. Objetivos, Não-Objetivos e Definição de Sucesso

### Objetivos
1. [Objetivo 1 - deve ser mensurável]
2. [Objetivo 2]
3. [Objetivo 3]

### Não-Objetivos (explicitamente fora de escopo)
1. [O que NÃO vamos fazer]
2. [O que NÃO vamos fazer]

### Definição de Sucesso
| Métrica | Baseline | Meta | Como medir |
|---------|----------|------|------------|
| [Métrica 1] | [Atual] | [Desejado] | [Fonte] |
| [Métrica 2] | [Atual] | [Desejado] | [Fonte] |
| [Métrica 3] | [Atual] | [Desejado] | [Fonte] |

**Se não souber a baseline:** Marcar como "(Assumption)"
```

---

### 4. USUÁRIOS E PERSONAS

```markdown
## 4. Usuários, Personas e Cenários

### Persona Primária
**Nome:** [Nome fictício]
**Idade/Perfil:** [Características]
**Dor principal:** [O que mais sofre]
**Motivação:** [O que a move]
**Frustração atual:** [Como resolve hoje]

### Persona Secundária (se houver)
[Mesma estrutura]

### Jobs To Be Done (JTBD)
| Job | Contexto | Motivação | Resultado esperado |
|-----|----------|-----------|-------------------|
| [Job 1] | [Quando] | [Para que] | [Resultado] |

### Cenários de Uso
1. **Cenário principal:** [Descrever]
2. **Cenário secundário:** [Descrever]

### Anti-Cenários (quando NÃO usar)
- [Situação onde não se aplica]
```

---

### 5. ESCOPO E PRIORIZAÇÃO

```markdown
## 5. Escopo e Priorização

### MUST (obrigatório para MVP)
- [ ] [Feature 1]
- [ ] [Feature 2]
- [ ] [Feature 3]

### SHOULD (importante, mas não bloqueante)
- [ ] [Feature 4]
- [ ] [Feature 5]

### COULD (nice to have)
- [ ] [Feature 6]
- [ ] [Feature 7]

### WON'T (explicitamente fora)
- [ ] [Feature 8] - [Razão]

### Critérios de Corte
[Cortar se:]
- [Critério 1]
- [Critério 2]
```

---

### 6. FLUXOS DE USUÁRIO

```markdown
## 6. Fluxos de Usuário

### Happy Path (caminho ideal)
1. Usuário abre o app
2. [Ação 1]
3. [Ação 2]
4. [Resultado]

### Fluxos Alternativos
| Condição | Caminho alternativo |
|----------|---------------------|
| [Se X] | [Então Y] |

### Fluxos de Erro
| Erro | Mensagem | Ação de recuperação |
|------|----------|---------------------|
| [Erro 1] | "[Mensagem]" | [O que fazer] |

### Estados do Sistema
| Estado | Descrição | Próximo estado |
|--------|-----------|----------------|
| [Estado 1] | [Descrição] | [Próximo] |
```

---

### 7. REQUISITOS FUNCIONAIS

```markdown
## 7. Requisitos Funcionais (FR)

### FR-001: [Nome da funcionalidade]

**Descrição:**
[O que deve fazer]

**Regras de negócio:**
- RN1: [Regra]
- RN2: [Regra]

**Exemplos:**
- Se [condição], então [resultado]

**Entradas:**
| Campo | Tipo | Obrigatório | Validação |
|-------|------|-------------|-----------|
| [Campo 1] | [Tipo] | Sim/Não | [Regra] |

**Saídas:**
- [O que retorna]

**Permissões (RBAC):**
| Role | Pode ver? | Pode editar? |
|------|-----------|--------------|
| Admin | Sim | Sim |
| Member | Sim | Não |

**Estados:**
[Diagrama ou descrição de estados]

**Erros:**
| Código | Mensagem | Causa |
|--------|----------|-------|
| E001 | "[Mensagem]" | [Quando ocorre] |

**Edge Cases:**
- [Caso extremo 1]
- [Caso extremo 2]

**Dependências:**
- [Dependência 1]

---

### FR-002: [Próxima funcionalidade]
[Repetir estrutura]
```

---

### 8. REQUISITOS NÃO-FUNCIONAIS

```markdown
## 8. Requisitos Não-Funcionais (NFR)

### Performance
| Métrica | Meta | Como medir |
|---------|------|------------|
| Tempo de resposta API (p95) | < 300ms | [Ferramenta] |
| LCP (p95) | < 2.5s | [Ferramenta] |
| TTFB | < 600ms | [Ferramenta] |

### Disponibilidade
- **SLO:** 99.5% (Assumption se não tiver baseline)

### Segurança
- [ ] Rate limiting implementado
- [ ] Logs de auditoria
- [ ] OWASP Top 10 verificado
- [ ] Inputs sanitizados
- [ ] HTTPS obrigatório

### Privacidade (LGPD)
- [ ] Dados PII identificados
- [ ] Política de retenção definida
- [ ] Função de exclusão implementada
- [ ] Função de exportação implementada
- [ ] Consentimento coletado

### Observabilidade
- [ ] Logs estruturados
- [ ] Métricas de negócio
- [ ] Tracing distribuído
- [ ] Alertas configurados

### Acessibilidade
- [ ] WCAG 2.1 AA compliance
- [ ] Navegação por teclado
- [ ] Contraste adequatdo
- [ ] Textos alternativos

### Resiliência
- [ ] Retries com backoff exponencial
- [ ] Idempotência em operações críticas
- [ ] Circuit breaker para serviços externos
```

---

### 9. UX NOTES

```markdown
## 9. UX Notes

### Princípios de UI
1. [Princípio 1]
2. [Princípio 2]

### Microcopy
| Elemento | Texto |
|----------|-------|
| Botão principal | "[Texto]" |
| Mensagem de sucesso | "[Texto]" |
| Mensagem de erro | "[Texto]" |

### Estados
| Estado | Aparência | Texto |
|--------|-----------|-------|
| Loading | [Spinner/placeholder] | "Carregando..." |
| Empty | [Ilustração] | "[Mensagem]" |
| Error | [Ícone] | "[Mensagem]" |
| Success | [Checkmark] | "[Mensagem]" |
```

---

### 10. DADOS E MODELO

```markdown
## 10. Dados e Modelo

### Entidades Principais
| Entidade | Campos principais | Relacionamentos |
|----------|-------------------|-----------------|
| [Entidade 1] | [Campos] | [Relacionamentos] |

### Campos PII (dados pessoais)
| Campo | Entidade | Justificativa | Retenção |
|-------|----------|---------------|----------|
| [Campo] | [Entidade] | [Por que precisa] | [Por quanto tempo] |

### Políticas
- **Retenção:** [Política]
- **Consentimento:** [Como coletar]
```

---

### 11. INTEGRAÇÕES E APIs

```markdown
## 11. Integrações e APIs

### APIs Externas Detectadas

**IMPORTANTE:** Para cada API externa identificada, execute `*api [nome]` ANTES de desenvolver.

| API | Categoria | Status | Documentação |
|-----|-----------|--------|--------------|
| [Nome] | [Categoria] | [ ] Pendente | docs/APIS-DOCS/[nome].md |

**Categorias comuns:** IA, Pagamentos, Auth, Email, SMS, Storage, Analytics

#### Checklist por API
Para cada API detectada:
- [ ] Executar `*api [nome]` para documentar
- [ ] Adicionar variáveis ao .env.template
- [ ] Estimar custos mensais
- [ ] Verificar rate limits
- [ ] Definir estratégia de retry/fallback

### Endpoints da API Interna
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | /api/v1/[recurso] | [Descrição] |
| GET | /api/v1/[recurso]/:id | [Descrição] |
```

---

### 12. ANALYTICS

```markdown
## 12. Analytics e Tracking

### Convenção de Nomes
- Eventos: `snake_case` (ex: `user_signed_up`)
- Propriedades: `snake_case` (ex: `plan_type`)

### Eventos Principais
| Evento | Propriedades | Quando |
|--------|--------------|--------|
| [evento_nome] | prop1, prop2 | [Trigger] |

### Funis
**Funil de [Nome]:**
1. `[passo_1]` → 100%
2. `[passo_2]` → [expected %]
3. `[passo_3]` → [expected %]
```

---

### 13. SEGURANÇA E COMPLIANCE

```markdown
## 13. Segurança, Abuso e Compliance

### Vetores de Ataque
| Vetor | Mitigação |
|-------|-----------|
| [Vetor 1] | [Como prevenir] |

### Auditoria
- [ ] Log de ações sensíveis
- [ ] Rastreamento de quem fez o quê
- [ ] Retenção de logs

### LGPD/Compliance
- [ ] Checklist de conformidade
```

---

### 14. PLANO DE LANÇAMENTO

```markdown
## 14. Plano de Lançamento

### Feature Flags
- `feature_[nome]`: Controla disponibilidade

### Rollout
| Fase | Porcentagem | Critério de sucesso | Rollback se |
|------|-------------|---------------------|-------------|
| Beta | 5% | [Métrica] | [Condição] |
| Gradual 1 | 25% | [Métrica] | [Condição] |
| Gradual 2 | 50% | [Métrica] | [Condição] |
| Full | 100% | - | - |
```

---

### 15. RISCOS E MITIGAÇÕES

```markdown
## 15. Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação | Dono |
|-------|---------------|---------|-----------|------|
| [Risco 1] | Alta/Média/Baixa | Alto/Médio/Baixo | [Ação] | [Quem] |
```

---

### 16. CRITÉRIOS DE ACEITAÇÃO

```markdown
## 16. Critérios de Aceitação (Gherkin)

### AC-001: [Nome do critério]

**Cenário:** Happy Path
```gherkin
Dado que [contexto inicial]
Quando [ação do usuário]
Então [resultado esperado]
```

**Cenário:** Erro
```gherkin
Dado que [contexto]
Quando [ação que causa erro]
Então [mensagem de erro esperada]
```
```

---

### 17. ROADMAP E ESTIMATIVAS

```markdown
## 17. Roadmap e Estimativa

### Fases
| Fase | Entregáveis | Dependências | Estimativa |
|------|-------------|--------------|------------|
| Fase 1 | [Itens] | [Dependências] | T-shirt size |
| Fase 2 | [Itens] | [Dependências] | T-shirt size |

### T-Shirt Sizing
- **XS:** < 2 horas
- **S:** 2-4 horas
- **M:** 4-8 horas
- **L:** 1-2 dias
- **XL:** 3-5 dias
- **XXL:** > 1 semana (quebrar!)
```

---

### 18. PRÓXIMOS PASSOS

```markdown
## 18. Próximos Passos

1. [ ] [Ação concreta 1]
2. [ ] [Ação concreta 2]
3. [ ] [Ação concreta 3]
4. [ ] [Ação concreta 4]
5. [ ] [Ação concreta 5]
```

---

## DEFAULTS (se faltar informação)

Use estes valores quando não tiver informação:

| Item | Default |
|------|---------|
| Plataforma | Web responsivo primeiro |
| Auth | Email + OAuth (Google) |
| Roles | Admin, Member, Viewer |
| API p95 | < 300ms |
| LCP p95 | < 2.5s |
| SLO | 99.5% |
| Acessibilidade | WCAG 2.1 AA |
| LGPD | Minimização, retenção, exclusão, exportação |
| Observabilidade | Logs + métricas + tracing |

---

## RESUMO PARA INICIANTES

| Termo | Significado |
|-------|-------------|
| PRD | Documento que descreve o que vamos construir |
| MVP | Versão mínima que já funciona |
| Persona | Descrição de quem vai usar |
| Happy Path | Caminho ideal sem erros |
| Edge Case | Situação extrema/rara |
| FR | Requisito Funcional (o que faz) |
| NFR | Requisito Não-Funcional (como funciona) |
| KPI | Indicador de sucesso |
| AC | Critério de Aceite (como testar) |
| SLO | Meta de disponibilidade |

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
║  PRD = Documento, não código!                                 ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
```
