# Instruções de Operação - Empire Vibe Coding

Este arquivo é a fonte canônica de instruções do sistema.
Ele deve gerar, sem variação, os dois arquivos raiz do projeto:

- `CLAUDE.md`
- `AGENTS.md`

## Leitura Obrigatória

Antes de executar qualquer comando `*`, leia nesta ordem:

1. `CLAUDE.md` e `AGENTS.md` (devem estar idênticos byte a byte)
2. `vibe-coding/COMANDOS.md`
3. Protocolo específico em `vibe-coding/PROTOCOLOS/`

## Regras Duras

1. Se `CLAUDE.md` ou `AGENTS.md` faltar, bloquear execução de comandos críticos.
2. Se houver drift entre os dois arquivos, bloquear execução de comandos críticos.
3. Em qualquer bloqueio acima, executar fluxo de `*sincronizar`.
4. Atualizações relevantes devem registrar documentação em `docs/`.
5. `*garantir` é o único comando que aprova mudança para produção.

## Fluxo Base para Comandos `*`

1. Identificar comando solicitado.
2. Validar sincronização de `CLAUDE.md` e `AGENTS.md`.
3. Ler protocolo correspondente.
4. Fazer checkpoint curto (o que vai fazer / riscos / confirmação quando necessário).
5. Executar sem pular STOP_POINT.
6. Atualizar documentação (`docs/MUDANCAS.md`, `docs/DECISOES.md`, `docs/ROADMAP.md`, `docs/ARQUITETURA.md`) quando aplicável.

## Comandos Oficiais

Use `vibe-coding/COMANDOS.md` como catálogo canônico para todos os comandos.

Comandos de operação diária obrigatórios:

- `*começar`
- `*setup`
- `*dashboard`
- `*agentes`
- `*atualizar`
- `*sincronizar`
- `*ajuda`

## Comportamentos Obrigatórios por Comando

### `*começar`

- abrir menu interativo
- esperar resposta
- direcionar para o comando correto
- não criar PRD/código automaticamente

### `*setup`

- ler `vibe-coding/PROTOCOLOS/01-SETUP-TECNICO.md`
- executar setup técnico guiado (ferramentas, integrações e pré-requisitos)
- confirmar dependências críticas antes de liberar desenvolvimento

### `*dashboard`

- informar que é local (`localhost`)
- informar que é read-only
- direcionar para:
  - `npm run dashboard`
  - fallback: `npm --prefix empire-dashboard run dashboard`

### `*agentes`

- usar líder PM + especialistas
- Claude Code: Agent Teams nativo
- Codex: emulação de squads (líder + especialistas + consolidação)
- permitir paralelismo apenas em frentes independentes

### `*atualizar`

- ler `vibe-coding/PROTOCOLOS/23-ATUALIZAR.md`
- executar preflight + checkpoint completo
- atualizar para latest estável ou versão pinada (`vX.Y.Z`)
- sincronizar `CLAUDE.md` e `AGENTS.md` ao final

### `*sincronizar`

- ler `vibe-coding/PROTOCOLOS/24-SINCRONIZAR.md`
- criar backup obrigatório em `.empire-sync/backups/<timestamp>/`
- regenerar `CLAUDE.md` e `AGENTS.md` da mesma fonte
- validar igualdade byte a byte
- só liberar comandos após validação

## Ativação Automática de Agentes

Ativar `*agentes` mesmo sem comando explícito quando houver:

- tarefa multi-domínio
- alto risco (auth, pagamentos, segurança, dados sensíveis)
- múltiplas frentes independentes

## Estrutura Esperada do Projeto

```text
projeto/
├── CLAUDE.md
├── AGENTS.md
├── .claude/
│   ├── settings.json
│   ├── settings.local.json
│   └── custom_instructions.md
├── docs/
├── vibe-coding/
├── squads/
└── empire-dashboard/
```

## Checklist Pós-Mudança

- [ ] Atualizei `docs/MUDANCAS.md`?
- [ ] Se houve decisão técnica, atualizei `docs/DECISOES.md`?
- [ ] Se concluí etapa, atualizei `docs/ROADMAP.md`?
- [ ] Se alterei arquitetura, atualizei `docs/ARQUITETURA.md`?
- [ ] Verifiquei que `CLAUDE.md` e `AGENTS.md` continuam idênticos?
