# Lista de Comandos - Empire Vibe Coding

## Como Usar

Digite comandos com `*` para ativar o comportamento correspondente.

## Modo Unico Obrigatorio

Este sistema opera sempre com os dois arquivos raiz:

- `CLAUDE.md`
- `AGENTS.md`

Regra operacional diaria:

1. Antes de executar comandos `*`, validar que os dois arquivos existem.
2. Validar que os dois arquivos estao identicos byte a byte.
3. Se faltar arquivo ou houver drift, bloquear execucao e rodar `*sincronizar`.

---

## FLUXO OBRIGATORIO DE DOCUMENTACAO

Antes de entrar em desenvolvimento amplo, siga a ordem recomendada:

1. `*prd` - define o que sera construido
2. `*arquitetura` - define como sera construido
3. `*roadmap` - define ordem e entregas
4. `*design` - define direcao visual e UX
5. `*desenvolver` - implementacao

Excecoes: `*bug`, `*erro`, manutencao simples e ajustes localizados.

---

## Comandos Principais

| Comando | Funcao | O que acontece |
|---------|--------|----------------|
| `*começar` | Iniciar projeto | Tutorial interativo: mostra menu, espera resposta e direciona |
| `*setup` | Configurar ambiente tecnico | Executa setup tecnico guiado com base em `01-SETUP-TECNICO.md` |
| `*desenvolver` | Modo desenvolvimento | Ativa protocolo de desenvolvimento |
| `*bug` | Reportar problema | Ativa protocolo de correcao de bugs |
| `*erro` | Resolver erro | Ajuda guiada para erros de terminal/navegador |
| `*termo` | Explicar termo | Explica termo tecnico com linguagem simples |
| `*comando` | Verificar comando | Checa risco antes de executar comandos |
| `*lançar` | Preparar lancamento | Executa checklist pre-publicacao |

## Comandos de Documentação

| Comando | Funcao | O que acontece |
|---------|--------|----------------|
| `*roadmap` | Ver/atualizar roadmap | Atualiza `docs/ROADMAP.md` |
| `*decisão` | Registrar decisao | Atualiza `docs/DECISOES.md` |
| `*mudança` | Registrar mudanca | Atualiza `docs/MUDANCAS.md` |
| `*arquitetura` | Atualizar arquitetura | Atualiza `docs/ARQUITETURA.md` |
| `*status` | Ver status do projeto | Resume progresso, pendencias e proximos passos |

## Comandos de Design & UX

| Comando | Funcao | O que acontece |
|---------|--------|----------------|
| `*design` | Design System | Tokens, cores, tipografia e padronizacao visual |
| `*ux` | UX Design | Heuristicas, fluxos, acessibilidade e estados |

## Comandos de Qualidade

| Comando | Funcao | O que acontece |
|---------|--------|----------------|
| `*seguranca` | Auditoria de seguranca | Checklist OWASP, segredos, superficies de risco |
| `*qualidade` | Checar qualidade | Revisao de codigo, estrutura e padroes |
| `*garantir` | Garantidor de qualidade | Unico comando que aprova mudancas |
| `*revisar` | Code review | Revisao completa com pontos de risco |

## Comandos de Infra & Banco

| Comando | Funcao | O que acontece |
|---------|--------|----------------|
| `*banco` | Saude do banco | Diagnostico de queries, indices e integridade |
| `*supabase` | Configurar Supabase | Setup e validacao de configuracao Supabase |

## Comandos de Automação

| Comando | Funcao | O que acontece |
|---------|--------|----------------|
| `*workflow` | Criar workflows | CI/CD e automacoes de projeto |
| `*orquestrar` | Orquestrar comandos | Combina comandos para resolver cenarios complexos |
| `*tarefas` | Gerenciar tarefas | Planejamento e acompanhamento task-oriented |
| `*dashboard` | Abrir dashboard | Inicia dashboard local em localhost (somente leitura) |
| `*atualizar` | Atualizar instalacao | Atualiza instalacao existente para latest estavel ou versao pinada (`vX.Y.Z`) com checkpoint e rollback |
| `*sincronizar` | Sincronizar instrucoes | Regera `CLAUDE.md` e `AGENTS.md` da mesma fonte e valida igualdade byte a byte |

## Comandos de Planejamento

| Comando | Funcao | O que acontece |
|---------|--------|----------------|
| `*planejar` | Planejamento detalhado | WBS, riscos, estimativas e criterios |
| `*especificar` | Criar spec de feature | Cria documento em `docs/specs/` |
| `*prd` | Gerar PRD completo | Cria documentacao de requisitos (sem implementar codigo) |

## Comandos de Integração

| Comando | Funcao | O que acontece |
|---------|--------|----------------|
| `*api` | Documentar API externa | Pesquisa e documenta API antes da integracao |

## Comandos de Especialistas

| Comando | Funcao | O que acontece |
|---------|--------|----------------|
| `*nerd` | Problemas complexos | Diagnostico profundo e otimizacao avancada |
| `*agentes` | Usar agentes | Claude: Agent Teams nativo. Codex: emulacao de squads (lider + especialistas) |
| `*melhorar` | Refatorar codigo | Propoe melhorias estruturais e tecnicas |

## Comando de Ajuda

| Comando | Funcao |
|---------|--------|
| `*ajuda` | Mostra todos os comandos disponiveis |

---

## Comportamentos Essenciais

### `*começar`

- sempre abre menu interativo
- sempre espera resposta do usuario
- nao cria arquivos automaticamente

### `*setup`

- executa setup tecnico do projeto
- usa `vibe-coding/PROTOCOLOS/01-SETUP-TECNICO.md` como fonte
- prepara ambiente antes de desenvolvimento amplo

### `*dashboard`

- foco em acompanhamento local
- execucao em `localhost`
- API de mutacao bloqueada (`403`)

### `*sincronizar`

- executa `vibe-coding/PROTOCOLOS/24-SINCRONIZAR.md`
- faz backup obrigatorio antes de reescrever
- regenera `CLAUDE.md` e `AGENTS.md` da mesma fonte
- bloqueia comandos criticos enquanto houver drift

### `*atualizar`

- executa atualizacao segura de instalacoes existentes
- default: latest stable release
- opcional: versao pinada (`*atualizar vX.Y.Z`)
- exige checkpoint completo (backup + snapshot Git quando disponivel)
- sincroniza os dois arquivos de instrucoes apos atualizar

### `*agentes`

- usa lider PM + especialistas
- Claude: Agent Teams nativo
- Codex: execucao emulada com planejamento + especialistas + consolidacao
- pode ativar automaticamente quando o escopo exigir coordenacao

---

## Resumo por Categoria

| Categoria | Qtd | Comandos |
|-----------|-----|----------|
| Principais | 8 | começar, setup, desenvolver, bug, erro, termo, comando, lançar |
| Documentacao | 5 | roadmap, decisão, mudança, arquitetura, status |
| Design & UX | 2 | design, ux |
| Qualidade | 4 | seguranca, qualidade, garantir, revisar |
| Infra & Banco | 2 | banco, supabase |
| Automacao | 6 | workflow, orquestrar, tarefas, dashboard, atualizar, sincronizar |
| Planejamento | 3 | planejar, especificar, prd |
| Integracao | 1 | api |
| Especialistas | 3 | nerd, agentes, melhorar |
| Ajuda | 1 | ajuda |
| **TOTAL** | **35** | |

---

## Referencias principais

- `vibe-coding/PROTOCOLOS/00-COMEÇAR.md`
- `vibe-coding/PROTOCOLOS/20-AGENTES.md`
- `vibe-coding/PROTOCOLOS/15-TAREFAS.md`
- `vibe-coding/PROTOCOLOS/23-ATUALIZAR.md`
- `vibe-coding/PROTOCOLOS/24-SINCRONIZAR.md`
- `vibe-coding/BANDEIRAS-VERMELHAS.md`
