# Sistema de Agent Teams - Empire Vibe Coding

## O que é

Agent Teams é um modo de execução com:
- 1 agente líder (PM)
- N subagentes especialistas (ARCHITECT, DEVELOPER, QA, etc.)
- coordenação por plano, dependências e critérios de pronto

Objetivo: resolver tarefas complexas com mais consistência e menos retrabalho.

---

## Papel do PM (líder)

O PM é o líder padrão. Ele:
1. Entende o objetivo do usuário
2. Quebra em etapas
3. Define especialistas necessários
4. Define dependências/paralelismo
5. Consolida resultado final

Arquivo de referência: `squads/PM.md`

---

## Especialistas disponíveis

| Agente | Especialidade |
|---|---|
| ARCHITECT | Arquitetura e decisões técnicas |
| DEVELOPER | Implementação e refatoração |
| REVIEWER | Revisão técnica e riscos de regressão |
| QA | Testes e validação de comportamento |
| SECURITY | Segurança e exposição de risco |
| DESIGNER | UX, interface e acessibilidade |
| DATA | Dados, performance e consultas |

---

## Como ativar

### 1) Via comando explícito

```text
*agentes
[descrição da tarefa]
```

### 2) Via detecção automática

Sem `*agentes`, o sistema ativa Agent Teams quando a tarefa for complexa (multi-domínio, alto risco, várias frentes).

---

## Ferramenta do Claude Code

Para Agent Teams, usar a ferramenta **`Task`** (subagentes).

Não usar o fluxo legado de `TaskCreate/TaskUpdate` para delegação de subagentes.

Pré-requisito de ambiente:

```bash
export CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1
```

---

## Fluxo padrão (obrigatório)

1. **Checkpoint curto**
- O que vai fazer
- O que não vai fazer
- Time proposto

2. **Criar PM-líder**
- PM gera plano estruturado com especialistas, dependências e critérios de pronto

3. **Criar especialistas**
- Sessão principal cria subagentes com base no plano do líder

4. **Executar por dependência**
- Rodar paralelo quando não há dependência
- Rodar sequencial quando houver bloqueio

5. **Consolidar resultado**
- Resumo único para o usuário
- Riscos pendentes
- Próximos passos

---

## Times padrão

### Feature Team
PM + ARCHITECT + DEVELOPER + REVIEWER + QA

Adicionar SECURITY se envolver:
- auth
- pagamento
- dados sensíveis

Adicionar DESIGNER se houver impacto relevante de UX/UI.

### Bug Team
PM + DEVELOPER + QA

Adicionar SECURITY para bug crítico/sensível.

### Performance Team
PM + DATA + DEVELOPER + QA

### Security Team
PM + SECURITY + DEVELOPER + REVIEWER

---

## Regra importante de limitação

No Claude Code, subagente não cria outro subagente.

Portanto:
- líder PM planeja
- sessão principal cria os especialistas

Esse é o padrão oficial deste projeto.

---

## Output esperado para o usuário

```markdown
✅ Agent Team concluído

**Líder:** PM
**Especialistas acionados:** [lista]

**Entregas:**
- [item]
- [item]

**Riscos pendentes:**
- [item] ou "Nenhum crítico"

**Próximos passos:**
1. [ação]
2. [ação]
```

---

## Criando agente customizado

Crie arquivos em `squads/custom/`.

Template mínimo:

```markdown
# NOME-DO-AGENTE.md

## Especialidade
[O que esse agente resolve]

## Quando Invocar
[Quando chamar]

## Input Esperado
[Contexto mínimo necessário]

## Output Esperado
[Formato de retorno]

## Checklist de Validação
- [ ] Critério 1
- [ ] Critério 2
```
