---
## PARA CLAUDE E CODEX (AI INSTRUCTIONS)

IMPORTANTE:

1. Este comando é um tutorial interativo.
2. Não crie arquivos automaticamente.
3. Sempre mostre o menu e espere resposta.
4. Valide sincronização entre `CLAUDE.md` e `AGENTS.md` antes de seguir.
---

# 00-COMEÇAR.md - Tutorial Interativo

## Quando Usar

- `*começar`
- usuário não sabe por onde iniciar
- primeira interação com o sistema

---

## Comportamento Obrigatório

### Passo 1: Mostrar Menu

```text
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║     🚀 BEM-VINDO AO EMPIRE VIBE CODING!                       ║
║                                                               ║
║     O que você quer fazer?                                    ║
║                                                               ║
║     1. 📝 Criar PRD do projeto                                ║
║     2. 📊 Ver status do projeto                               ║
║     3. 🔧 Configurar ambiente técnico                         ║
║     4. 🐛 Reportar bug/erro                                   ║
║     5. 💡 Tirar dúvida de termo                               ║
║     6. 📚 Ver todos os comandos                               ║
║     7. 🤖 Usar agentes especializados                         ║
║     8. 🏗️ Preparar projeto para desenvolvimento              ║
║     9. 🔄 Atualizar instalação existente                      ║
║     10. 🔁 Sincronizar CLAUDE.md + AGENTS.md                 ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝

Digite o número da opção ou descreva sua necessidade.
```

### Passo 2: STOP POINT

```text
🛑 STOP_POINT_PERGUNTA
→ Esperar resposta do usuário
→ Não continuar automaticamente
```

### Passo 3: Direcionamento

| Opção | Comando | Ação |
|-------|---------|------|
| 1 | `*prd` | Ler `18-PRD.md` e seguir protocolo |
| 2 | `*status` | Mostrar resumo do projeto |
| 3 | `*setup` | Ler `01-SETUP-TECNICO.md` |
| 4 | `*bug` | Ler `02-BUGS.md` |
| 5 | `*termo` | Ler `GLOSSARIO.md` |
| 6 | `*ajuda` | Mostrar `COMANDOS.md` |
| 7 | `*agentes` | Ler `20-AGENTES.md` |
| 8 | Fluxo guiado | PRD → Arquitetura → Roadmap → Design |
| 9 | `*atualizar` | Ler `23-ATUALIZAR.md` |
| 10 | `*sincronizar` | Ler `24-SINCRONIZAR.md` |

---

## Opção 8 - Preparar Projeto

Fluxo:

1. `*prd`
2. `*arquitetura`
3. `*roadmap`
4. `*design`

Regras:

- confirmar cada etapa antes de avançar
- não implementar código durante esse fluxo

---

## Opção 9 - Atualizar Instalação

Regras mínimas:

1. preflight completo
2. checkpoint com backup + snapshot Git quando disponível
3. execução de update via instalador oficial
4. validação pós-update + rollback documentado

---

## Opção 10 - Sincronizar Arquivos de Agente

Regras mínimas:

1. validar existência de `CLAUDE.md` e `AGENTS.md`
2. criar backup obrigatório
3. regenerar ambos da mesma fonte canônica
4. validar igualdade byte a byte
5. só liberar comandos após sync

---

## Proibido

```text
❌ Criar arquivos automaticamente no *começar
❌ Implementar código sem confirmação
❌ Pular menu e ir direto para execução
❌ Ignorar drift entre CLAUDE.md e AGENTS.md
```
