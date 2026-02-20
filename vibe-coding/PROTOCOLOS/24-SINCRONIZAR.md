---
## PARA CLAUDE E CODEX (AI INSTRUCTIONS)

Este protocolo é invocado pelo comando `*sincronizar`.
Objetivo: restaurar paridade obrigatória entre `CLAUDE.md` e `AGENTS.md`.
---

# 24-SINCRONIZAR.md - Protocolo de Sincronização Obrigatória

## Quando Usar

- drift detectado entre `CLAUDE.md` e `AGENTS.md`
- um dos arquivos foi removido
- antes de iniciar operação diária crítica
- após update do framework

---

## Regra de Bloqueio

Enquanto `CLAUDE.md` e `AGENTS.md` não estiverem idênticos byte a byte:

- bloquear comandos críticos (`*desenvolver`, `*agentes`, `*orquestrar`, `*atualizar`)
- permitir apenas `*sincronizar`, `*status` e diagnóstico

---

## Passo 1 - Preflight

Validar:

1. existência de fonte canônica (`vibe-coding/CLAUDE-INSTRUCTIONS.md`)
2. estado atual de `CLAUDE.md`
3. estado atual de `AGENTS.md`
4. permissões de escrita na raiz do projeto

Se fonte canônica estiver ausente, bloquear e orientar restauração da instalação.

---

## Passo 2 - Backup Obrigatório

Criar backup em:

```text
.empire-sync/backups/<timestamp>/
```

Itens para backup:

- `CLAUDE.md` (se existir)
- `AGENTS.md` (se existir)

Registrar no resumo final o caminho exato do backup.

---

## Passo 3 - Regeneração

1. usar `vibe-coding/CLAUDE-INSTRUCTIONS.md` como fonte única
2. sobrescrever `vibe-coding/CODEX-INSTRUCTIONS.md` com o mesmo conteúdo
3. sobrescrever `CLAUDE.md`
4. sobrescrever `AGENTS.md`

---

## Passo 4 - Validação

Validar obrigatoriamente:

- `CLAUDE.md` existe
- `AGENTS.md` existe
- `cmp`/comparação binária confirma igualdade byte a byte

Se falhar:

- restaurar backup imediatamente
- manter bloqueio operacional

---

## Passo 5 - Liberação

Com validação bem-sucedida:

- liberar execução normal de comandos
- registrar ação em `docs/MUDANCAS.md` (quando aplicável)

---

## Rollback

Se necessário, restaurar:

```text
cp .empire-sync/backups/<timestamp>/CLAUDE.md.before-sync CLAUDE.md
cp .empire-sync/backups/<timestamp>/AGENTS.md.before-sync AGENTS.md
```

Depois do rollback, executar `*sincronizar` novamente para retornar ao estado canônico.

---

## O que NÃO Fazer

```text
❌ Sincronizar sem backup
❌ Manter execução com arquivos divergentes
❌ Usar fontes diferentes para CLAUDE.md e AGENTS.md
❌ Liberar comandos críticos sem validação byte a byte
```
