---
## PARA CLAUDE E CODEX (AI INSTRUCTIONS)

Este protocolo define como executar times de agentes em dois modos:
- **Claude Code:** Agent Teams nativo.
- **Codex:** emulação de squads (líder + especialistas).

Regras obrigatórias:
1. Sempre rode um **líder PM** primeiro para planejar o time.
2. Depois, a sessão principal cria/executa especialistas com base no plano do líder.
3. Consolide resultados e reporte progresso em linguagem simples.
4. Se Agent Teams nativo não estiver disponível, use emulação sem interromper a execução.

Limitação importante do Claude Code:
- Subagentes não criam outros subagentes diretamente.
- Portanto: o líder planeja, e a sessão principal cria os subagentes.
---

# 20-AGENTES.md - Protocolo Agent Teams (Líder + Subagentes)

## Objetivo

Usar Agent Teams para resolver tarefas complexas com mais velocidade e qualidade, mantendo:
- liderança central (PM)
- especialistas por domínio
- contexto controlado
- output consolidado

---

## Pré-requisitos

### 1) Agent Teams habilitado

No terminal onde o Claude Code roda:

```bash
export CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1
```

### 2) Papéis disponíveis

Use os papéis em `squads/` como base de comportamento:
- PM (líder)
- ARCHITECT
- DEVELOPER
- REVIEWER
- QA
- SECURITY
- DESIGNER
- DATA

---

## Quando ativar Agent Teams

### Ativação explícita (comando)

Ative sempre quando o usuário usar:
- `*agentes`
- `*agentes [tipo] [objetivo]`

### Ativação automática (sem comando)

Ative automaticamente quando a tarefa tiver **score >= 3**:

| Critério | Pontos |
|---|---:|
| Envolve 2+ domínios (ex: backend + frontend, código + segurança) | +1 |
| Envolve 6+ arquivos ou 2+ pastas principais | +1 |
| Toca área de alto risco (auth, pagamentos, dados sensíveis, migração) | +1 |
| Tem 3+ blocos independentes executáveis em paralelo | +1 |
| É bug crítico/incidente de produção | +1 |

Se `score >= 3`, informar:
- que vai ativar Agent Teams
- quem será o líder
- quais especialistas serão acionados

---

## Fluxo oficial (Líder + Subagentes)

### PASSO 0 - Checkpoint curto

Antes da execução, mostrar:
- O que vai fazer
- O que não vai fazer
- Time sugerido
- Pedido de confirmação (quando necessário pelas regras do projeto)

🛑 STOP_POINT_CONFIRMACAO

### PASSO 1 - Criar o líder (PM)

A sessão principal invoca um subagente via `Task` com:
- `subagent_type`: `general-purpose` (ou custom PM, se existir)
- `prompt`: instruções para planejar execução, dependências e critérios de pronto

Output obrigatório do líder:

```json
{
  "team_name": "Feature Squad",
  "objective": "...",
  "specialists": [
    {
      "role": "ARCHITECT",
      "goal": "...",
      "inputs": ["..."],
      "deliverables": ["..."],
      "depends_on": [],
      "done_criteria": ["..."]
    }
  ],
  "execution_order": ["ARCHITECT", "DEVELOPER", "REVIEWER", "QA"],
  "parallel_groups": [["ARCHITECT", "DESIGNER"], ["REVIEWER", "QA"]],
  "risks": ["..."],
  "quality_gates": ["..."]
}
```

### PASSO 2 - Criar subagentes especialistas

A sessão principal cria subagentes (um `Task` por especialista), usando:
- objetivo específico do especialista
- contexto mínimo necessário
- critérios de pronto definidos pelo líder
- referência do arquivo em `squads/[ROLE].md`

## Modo Codex (emulação)

Quando Agent Teams nativo não existir (ex.: Codex), seguir o mesmo contrato emulado:

### Fase 1 - Líder PM
- produzir plano com especialistas necessários;
- explicitar dependências e critérios de pronto;
- definir blocos paralelizáveis.

### Fase 2 - Especialistas
- executar cada frente por domínio (arquitetura, implementação, QA, segurança, etc.);
- manter isolamento de contexto por frente.

### Fase 3 - Paralelismo
- rodar em paralelo apenas frentes independentes;
- tarefas dependentes aguardam conclusão dos pré-requisitos.

### Fase 4 - Consolidação
- consolidar decisões, mudanças e riscos remanescentes;
- publicar próximos passos com prioridade.

### PASSO 3 - Resolver dependências

Respeitar ordem e paralelismo:
- tarefas no mesmo grupo paralelo podem rodar juntas
- tarefas dependentes só começam após outputs necessários

### PASSO 4 - Consolidação final

No fim, consolidar:
- decisões técnicas
- alterações realizadas
- riscos remanescentes
- próximos passos recomendados

Se houver conflito entre especialistas, chamar o líder novamente para decisão final.

---

## Templates por tipo de squad

### Feature Squad

Líder + especialistas:
- PM-LÍDER
- ARCHITECT
- DEVELOPER
- REVIEWER
- QA
- SECURITY (obrigatório se envolver auth/pagamento/dados sensíveis)
- DESIGNER (se houver UI/UX relevante)

### Bug Squad

Líder + especialistas:
- PM-LÍDER
- DEVELOPER
- QA
- SECURITY (se bug crítico ou superfície sensível)

### Performance Squad

Líder + especialistas:
- PM-LÍDER
- DATA
- DEVELOPER
- QA

### Security Squad

Líder + especialistas:
- PM-LÍDER
- SECURITY
- DEVELOPER
- REVIEWER

---

## Mapeamento por comando (auto-disparo)

| Comando | Quando usar time automático |
|---|---|
| `*desenvolver` | Feature média/grande, integração externa, múltiplos módulos |
| `*bug` | Bug crítico, comportamento intermitente, causa não clara |
| `*arquitetura` | Mudança estrutural com impacto em implementação |
| `*melhorar` | Refatoração em cadeia com risco de regressão |
| `*seguranca` | Vulnerabilidade, auth, LGPD, segredos, permissões |

Se for tarefa pequena e local (1 arquivo, 1 domínio), não abrir team completo.

---

## Prompt-base do líder (PM)

Use este modelo ao invocar o líder:

```text
Você é o PM-LÍDER do Agent Team.
Objetivo do usuário: [objetivo]
Contexto do projeto: [resumo]
Arquivos/pastas relevantes: [lista]

Sua missão:
1) Definir especialistas necessários
2) Definir ordem/dependências/paralelismo
3) Definir entregáveis e critérios de pronto
4) Apontar riscos e quality gates

Responda no JSON obrigatório do protocolo 20-AGENTES.
```

## Prompt-base dos especialistas

```text
Você é o especialista [ROLE].
Siga o papel descrito em squads/[ROLE].md.
Objetivo: [goal]
Entradas: [inputs]
Critérios de pronto: [done_criteria]

Responda com:
1) O que foi feito
2) Arquivos afetados
3) Decisões tomadas
4) Pendências/riscos
```

---

## Fallbacks obrigatórios

### Se Agent Teams estiver desligado

- Avisar claramente
- Executar em modo manual/sequencial
- Manter mesmo plano de líder + especialistas (sem subagentes reais)

### Se o líder falhar em planejar

- Aplicar template padrão do squad escolhido
- Prosseguir com escopo reduzido
- Informar limitação ao usuário

---

## Output final para o usuário

```markdown
✅ Agent Team concluído

**Líder:** PM
**Especialistas acionados:** [lista]

**Resumo do que foi entregue:**
- [item]
- [item]

**Arquivos/áreas impactadas:**
- [item]

**Riscos pendentes:**
- [item] ou "Nenhum crítico"

**Próximo passo recomendado:**
1. [ação]
2. [ação]
```

---

## Regras de segurança e qualidade

- Não ocultar falhas de subagente.
- Não pular validação quando houver risco alto.
- Não declarar concluído sem checar critérios de pronto.
- Sempre registrar mudanças e decisões nos docs do projeto quando aplicável.

---

## Resumo rápido

1. Detectar necessidade (comando ou auto-score)
2. Criar líder PM via `Task`
3. Gerar plano estruturado
4. Criar subagentes especializados via `Task`
5. Consolidar outputs + reportar

Este é o padrão oficial para Agent Teams neste projeto.
