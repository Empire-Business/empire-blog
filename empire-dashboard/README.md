# Empire Dashboard (web)

Dashboard local para acompanhamento task-oriented do Empire Vibe Coding.

## Objetivo

- Exibir tarefas, squads, dependências e logs em tempo real
- Operar em modo consulta (read-only)
- Servir como monitor de execução local em `localhost`

## Executar localmente

```bash
# na raiz do projeto
npm run dashboard

# fallback direto no runtime
npm --prefix empire-dashboard run dashboard
```

Observações de instalação:

- o runtime é instalado por padrão em `empire-dashboard/`;
- o sistema opera em modo único obrigatório (`CLAUDE.md` + `AGENTS.md` sempre sincronizados);
- para drift entre arquivos de instrução, usar `*sincronizar`.

No repositório principal (desenvolvimento do dashboard web):

```bash
cd web
npm install
npm run dashboard
```

Abra `http://localhost:3001`.

## Modo read-only

As rotas de mutação são bloqueadas:

- `POST /api/tasks` -> `403`
- `PATCH /api/tasks/[id]` -> `403`
- `DELETE /api/tasks*` -> `403`
- `POST /api/squads` -> `403`
- `POST /api/squads/start` -> `403`
- `DELETE /api/squads*` -> `403`

## Persistência

O SQLite usa diretório configurável via `DASHBOARD_DATA_DIR`.
Fallback automático:

1. `DASHBOARD_DATA_DIR`
2. `<cwd>/data`
3. diretório temporário do sistema

Exemplo:

```bash
DASHBOARD_DATA_DIR=/tmp/empire-dashboard-data npm run dashboard
```

## Testes

```bash
# raiz do monorepo
npm run tutorial:check
npm run test:behavior
npm run web:test
```

## Sincronia do tutorial

Os dados didáticos do site são gerados por:

```bash
node ./scripts/generate-web-tutorial-data.mjs
```

Arquivo gerado:

- `web/data/tutorial.generated.json`

Validação (falha se houver drift):

```bash
node ./scripts/generate-web-tutorial-data.mjs --check
```

## Agentes

- Claude Code: Agent Teams nativo
- Codex: emulação de squads (líder + especialistas)

## Update seguro (instalações existentes)

- default: latest stable release;
- opcional: versão pinada (`vX.Y.Z`);
- obrigatórios: preflight + backup + snapshot Git (quando disponível);
- sempre finalizar com `*sincronizar` para paridade dos arquivos raiz.
