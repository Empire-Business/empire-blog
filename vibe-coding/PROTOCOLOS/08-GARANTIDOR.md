---
## PARA CLAUDE (AI INSTRUCTIONS)

Este protocolo é invocado pelo comando `*garantir` no CLAUDE.md.
Execute conforme as regras definidas no CLAUDE.md e em COMUNICACAO.md.

IMPORTANTE: Este é o ÚNICO protocolo que pode aprovar mudanças.
---

# Protocolo Garantidor de Qualidade (*garantir)

## IMPORTANTE: Este é o ÚNICO comando que pode aprovar mudanças

O comando `*garantir` é especial. Ele é o **garantidor oficial** do projeto.

**REGRA:** Nenhuma mudança em `docs/MUDANCAS.md` pode ser marcada como `[x]` (aprovada) sem passar por este protocolo.

---

## Quando Usar

- Após implementar uma feature
- Antes de marcar tarefa como concluída
- Para aprovar mudanças no código
- Antes de fazer merge/deploy
- Quando alguém pedir "aprovação"

---

## Processo de Aprovação em 3 Etapas

### Etapa 1: Verificação Técnica

```
□ Código funciona (testado manualmente)
□ Testes passam (se existirem)
□ Sem erros de lint
□ Sem console.logs esquecidos
□ Sem código comentado
□ Tipos corretos (TypeScript)
```

**Comandos de verificação:**
```bash
# Rodar testes
npm test

# Verificar lint
npm run lint

# Build (TypeScript)
npm run build
```

### Etapa 2: Verificação de Qualidade

```
□ Código é legível (outro dev entende)
□ Nomes são descritivos
□ Sem code smells óbvios
□ Segue padrões do projeto
□ Sem duplicação desnecessária
```

**Checklist de code smells:**
- Funções com mais de 30 linhas?
- Parâmetros demais (5+)?
- Nested ifs profundos?
- Magic numbers?

### Etapa 3: Verificação de Documentação

```
□ docs/MUDANCAS.md atualizado
□ docs/DECISOES.md (se decisão técnica)
□ docs/ROADMAP.md (se tarefa concluída)
□ docs/ARQUITETURA.md (se mudou estrutura)
□ Comentários nos pontos complexos
```

---

## Formato de Aprovação

### Assinatura Digital

Ao aprovar uma mudança, o Claude deve gerar uma assinatura no formato:

```
✅ APROVADO em [DATA] às [HORA]
   Verificado por: Claude (Empire Vibe Coding)
   Checklist: 3/3 etapas completas
   Hash: [primeiros 8 caracteres do hash da mudança]
```

### Exemplo de Entrada Aprovada em MUDANCAS.md

```markdown
## [Unreleased]

### Added
- [x] Sistema de login com Google OAuth
  ✅ APROVADO em 2024-01-15 às 14:30
  ✅ Verificado: Testes passaram, sem code smells, documentado
  ✅ Checklist: 3/3

### Changed
- [x] Refatorado componente de navegação
  ✅ APROVADO em 2024-01-15 às 16:45
```

---

## Fluxo Completo de Aprovação

```
┌─────────────────┐
│  Mudança feita  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  *garantir      │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  ETAPA 1: Verificação Técnica       │
│  □ Código funciona?                 │
│  □ Testes passam?                   │
│  □ Sem erros?                       │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  ETAPA 2: Verificação de Qualidade  │
│  □ Código legível?                  │
│  □ Sem code smells?                 │
│  □ Segue padrões?                   │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  ETAPA 3: Documentação              │
│  □ MUDANCAS.md atualizado?          │
│  □ Outros docs necessários?         │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────┐
│  REPROVADO?     │───────► Corrigir problemas
└────────┬────────┘         e tentar novamente
         │
         ▼ (todas aprovadas)
┌─────────────────┐
│  ✅ APROVADO    │
│  Marcar [x]     │
│  Assinar        │
└─────────────────┘
```

---

## Quando REPROVAR

### Motivos para reprovação:

1. **Código não funciona**
   - Bugs encontrados
   - Comportamento inesperado

2. **Testes falhando**
   - Testes unitários quebrados
   - Cobertura muito baixa

3. **Code smells graves**
   - Funções com 50+ linhas
   - Duplicação excessiva
   - Nomes confusos

4. **Documentação faltando**
   - MUDANCAS.md não atualizado
   - Decisão não documentada

5. **Problemas de segurança**
   - Credenciais no código
   - SQL injection possível
   - XSS vulnerável

### Mensagem de Reprovação

```
❌ REPROVADO

Problemas encontrados:
1. [Problema 1]
2. [Problema 2]

Ações necessárias:
- [ ] [Ação 1]
- [ ] [Ação 2]

Execute *garantir novamente após correções.
```

---

## Auditoria

### Log de Aprovações

Todas as aprovações ficam registradas em `docs/MUDANCAS.md` com:
- Data e hora
- Verificador (Claude)
- Status do checklist
- Hash de referência

### Consultar Histórico

```bash
# Ver todas as aprovações
grep -A 3 "✅ APROVADO" docs/MUDANCAS.md

# Ver aprovações do mês
grep "APROVADO em $(date +%Y-%m)" docs/MUDANCAS.md
```

---

## Exceções

### Aprovação Rápida (Hotfix)

Para correções urgentes em produção, permite aprovação simplificada:

```
⚠️ APROVAÇÃO RÁPIDA (Hotfix)
   Motivo: [erro crítico em produção]
   Verificação mínima: Código funciona + sem erros
   Ação pendente: Revisão completa em 24h
```

### Aprovação Condicional

Quando a mudança é boa mas precisa de acompanhamento:

```
⚠️ APROVADO CONDICIONALMENTE
   Condição: [o que precisa ser feito]
   Prazo: [data limite]
   Ticket: [referência para acompanhar]
```

---

## Integração com Outros Comandos

| Comando | Relação com *garantir |
|---------|----------------------|
| `*seguranca` | Deve passar antes de aprovar |
| `*qualidade` | Deve passar antes de aprovar |
| `*revisar` | Output usado na Etapa 2 |
| `*lançar` | Exige tudo aprovado |
| `*mudança` | Apenas *garantir pode marcar [x] |

---

## Resumo para Iniciantes

| Situação | O que fazer |
|----------|-------------|
| Terminei uma feature | Digite `*garantir` |
| Quero marcar tarefa como feita | Use `*garantir` primeiro |
| Código foi aprovado | Pode fazer commit/deploy |
| Foi reprovado | Corrija os problemas e tente de novo |

**Lembre-se:** `*garantir` é seu amigo. Ele evita que você lance código com bugs ou mal escrito.
