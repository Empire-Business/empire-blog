---
## PARA CLAUDE E CODEX (AI INSTRUCTIONS)

Este protocolo é invocado pelo comando `*atualizar`.
Objetivo: atualizar instalações existentes com segurança, checkpoint completo e sincronização obrigatória de arquivos de agente.
---

# 23-ATUALIZAR.md - Protocolo Oficial de Atualização

## Quando Usar

- projeto já possui Empire Vibe Coding instalado
- saiu nova versão do framework/protocolos/runtime
- usuário quer atualizar mantendo rollback seguro

---

## Uso do Comando

### Atualização padrão (latest estável)

```text
*atualizar
```

### Atualização com versão pinada

```text
*atualizar vX.Y.Z
```

---

## Princípios Obrigatórios

1. checkpoint completo antes de alterar qualquer arquivo
2. execução via instalador oficial (`install.sh`)
3. modo único obrigatório: sempre manter `CLAUDE.md` e `AGENTS.md`
4. pós-update obrigatório com validação e rollback documentado

---

## Passo 1 - Preflight Obrigatório

### 1.1 Detectar estado atual

Verificar:

- existência de `CLAUDE.md`
- existência de `AGENTS.md`
- existência de `.claude/settings.local.json`
- presença de `empire-dashboard/` (runtime ativo) ou docs-only
- customizações locais em `empire-dashboard/`, `squads/`, `docs/`

### 1.2 Detectar drift de instruções

- se `CLAUDE.md` e `AGENTS.md` divergirem, executar `*sincronizar` antes do update

### 1.3 STOP POINT de confirmação

Mostrar resumo com:

- versão alvo (latest ou pinada)
- impacto esperado
- necessidade de `--refresh-runtime`
- plano de rollback

```text
🛑 STOP_POINT_CONFIRMACAO_UPDATE
```

---

## Passo 2 - Checkpoint Completo (Obrigatório)

### 2.1 Backup local

Criar:

```text
.empire-update/backups/<timestamp>/
```

Incluir:

- `CLAUDE.md`
- `AGENTS.md`
- `.claude/`
- `vibe-coding/`
- `docs/`
- `squads/`
- `empire-dashboard/` (se existir)

### 2.2 Snapshot Git (quando disponível)

- registrar branch
- criar commit/tag de segurança antes do update

### 2.3 Rollback definido antes de executar

- restauração por backup
- reversão por snapshot Git
- validação após rollback

---

## Passo 3 - Resolução de Versão

1. se usuário informou `vX.Y.Z`, usar essa tag
2. se não informou, usar latest stable release
3. se resolução automática falhar, pedir tag explícita

```text
🛑 STOP_POINT_VERSAO_INVALIDA
```

---

## Passo 4 - Execução

### 4.1 Definir origem remota

```bash
EMPIRE_VIBE_CODING_GITHUB_RAW="https://raw.githubusercontent.com/Empire-Business/empire-vibe-coding/<ref>"
```

### 4.2 Executar instalador oficial

Exemplo:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/Empire-Business/empire-vibe-coding/<ref>/install.sh) --refresh-runtime
```

Regras:

- se instalação era docs-only, manter docs-only por padrão
- usar `--refresh-runtime` quando runtime existir e não houver bloqueio por customização
- se houver customização local sensível em `empire-dashboard/`, pedir confirmação antes de refresh

```text
🛑 STOP_POINT_RUNTIME_CUSTOMIZADO
```

---

## Passo 5 - Pós-Update

### 5.1 Verificação de integridade

- `CLAUDE.md` presente
- `AGENTS.md` presente
- igualdade byte a byte entre os dois
- `.claude/settings.local.json` presente com `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`
- `vibe-coding/PROTOCOLOS/23-ATUALIZAR.md` presente
- `vibe-coding/PROTOCOLOS/24-SINCRONIZAR.md` presente
- script `dashboard` na raiz quando runtime estiver ativo

### 5.2 Registro

Atualizar `docs/MUDANCAS.md` com:

- versão anterior -> versão nova
- data/hora
- flags usadas
- observações de customizações preservadas

### 5.3 Checklist final

- [ ] preflight executado
- [ ] backup criado
- [ ] snapshot Git criado (ou justificativa)
- [ ] update aplicado
- [ ] validações pós-update ok
- [ ] rollback documentado

---

## O que NÃO Fazer

```text
❌ Atualizar sem checkpoint completo
❌ Ignorar drift entre CLAUDE.md e AGENTS.md
❌ Sobrescrever runtime customizado sem confirmação
❌ Encerrar sem validar rollback
```
