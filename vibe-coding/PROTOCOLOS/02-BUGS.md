---
## PARA CLAUDE (AI INSTRUCTIONS)

Este protocolo é invocado pelo comando `*bug` no CLAUDE.md.
Execute conforme as regras definidas no CLAUDE.md e em COMUNICACAO.md.
---

# 02-BUGS.md

## Protocolo: Correção de Bugs

Este documento estabelece o protocolo padrão para identificar, reproduzir, corrigir e documentar bugs de forma eficiente e sistemática.

---

## 1. Priorização de Bugs

### 1.1 Classification Matrix

| Prioridade | Tempo de Resposta | Exemplos |
|------------|-------------------|----------|
| **Crítico** | Imediato (< 2h) | Vazamento de dados, sistema down, perda de dados |
| **Alto** | 24h | Login quebrado, checkout impossibilitado, dados incorretos |
| **Médio** | 72h | Bugs visuais, UX frustrante mas funcional |
| **Baixo** | Próxima sprint | Bugs cosméticos, melhorias de UX |

### 1.2 Critérios de Prioridade

```markdown
## Crítico (P0)
- Sistema indisponível
- Falha de segurança
- Perda/corrupção de dados
- Checkout/pagamento quebrado

## Alto (P1)
- Funcionalidade principal inoperante
- Dados incorretos sendo exibidos
- Autenticação falhando consistentemente

## Médio (P2)
- Funcionalidade secundária quebrada
- Bugs visuais que afetam UX
- Performance degradada

## Baixo (P3)
- Bugs cosméticos
- Sugestões de melhoria
- edge cases raramente atingidos
```

---

## 2. Step 1: Reproduzir o Bug

### 2.1 Template de Bug Report

```markdown
## Bug Report Template

### Título
[BUG] - Descrição curta e clara

### Prioridade
- [ ] Crítico | [ ] Alto | [ ] Médio | [ ] Baixo

### Descrição
Descrição detalhada do problema encontrado.

### Passos para Reproduzir
1. Vá para a página X
2. Clique no botão Y
3. Selecione a opção Z
4. Observe o erro: [descreva o comportamento esperado vs atual]

### Comportamento Atual
[Descreva o que está acontecendo]

### Comportamento Esperado
[Descreva o que deveria acontecer]

### Screenshots/Vídeos
[Adicione evidências visuais]

### Ambiente
- SO: [ex: macOS Sonoma]
- Browser: [ex: Chrome 120]
- Versão do App: [ex: 1.2.3]
- Dispositivo: [ex: Desktop/Mobile]

### Logs de Erro
```console
[cole o erro aqui]
```

### Dados Relevantes
```json
{
  "userId": "xxx",
  "orderId": "xxx",
  "timestamp": "xxx"
}
```

### Análise Inicial
[O que você já descobriu sobre a causa?]
```

### 2.2 Workflow de Reprodução

```bash
# 1. Verificar se o bug existe na versão atual
git log --oneline -5

# 2. Criar branch específica para o bug
git checkout -b bugfix/breve-descricao

# 3. Documentar passos de reprodução em comentário
```

---

## 3. Step 2: Isolar a Causa

### 3.1 Debugging Checklist

```markdown
## Análise de Causa Raiz

### 1. Identificar o Fluxo
- [ ] Qual componente/API está envolvido?
- [ ] Qualquer erro no console?
- [ ] Network tab mostra erros?

### 2. Verificar Dados
- [ ] Dados estão chegando corretamente?
- [ ] Tipos estão corretos?
- [ ] Validação está falhando?

### 3. Analisar Código
- [ ] Condicionais estão corretas?
- [ ] Tratamento de null/undefined?
- [ ] Dependencies do useEffect?
- [ ] State updates assíncronos?

### 4. Ferramentas
- [ ] Console.log para debug
- [ ] React DevTools
- [ ] Network tab
- [ ] Breakpoints no debugger
```

### 3.2 Técnicas de Isolamento

```typescript
// ❌ Código problemático
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price * item.qty, 0)
}

// ✅ Debugging approach
function calculateTotal(items) {
  console.log('Items received:', items)
  console.log('Type of items:', typeof items)
  console.log('Is array?:', Array.isArray(items))

  if (!Array.isArray(items)) {
    console.error('Items não é array!')
    return 0
  }

  return items.reduce((sum, item) => {
    console.log('Processing item:', item)
    return sum + (item.price || 0) * (item.qty || 0)
  }, 0)
}
```

### 3.3 Identificar Padrões Comuns

| Categoria | Sintoma | Causa Comum |
|-----------|---------|-------------|
| **State** | UI não atualiza | Mutação direta, dependências faltantes |
| **Async** | Dados vazios | Não aguardou promise, race condition |
| **Auth** | Redirect loop | Condicional mal formatada |
| **Form** | Validation não funciona | registration faltante |
| **API** | 403/401 | Token expirado, RLS policy |
| **Performance** | Re-renders excessivos | useEffect sem dependências |
| **Null** | Cannot read property | Verificação faltante |
| **Types** | TypeScript error | any usado incorretamente |

---

## 4. Step 3: Corrigir

### 4.1 Estratégias de Correção

```markdown
## Estratégia: IDEAL

I - Isolated (Isolado)
✅ Correção deve afetar apenas o código problemático

D - Defensive (Defensivo)
✅ Adicionar validações e checks

E - Explicit (Explícito)
✅ Tipos claros, nomes descritivos

A - Atomic (Atômico)
✅ Uma correção por PR

L - Logical (Lógico)
✅ Deve fazer sentido no contexto
```

### 4.2 Correções Seguras

```typescript
// ❌ Perigoso: Corrigir sem entender contexto
function handleClick() {
  setLoading(true)
  api.call() // Removido try-catch "para simplificar"
}

// ✅ Seguro: Correção com tratamento adequado
function handleClick() {
  setLoading(true)

  try {
    await api.call()
  } catch (error) {
    console.error('Error:', error)
    toast.error('Operação falhou')
  } finally {
    setLoading(false)
  }
}
```

### 4.3 Padrão de Correção

```typescript
// Antes: Bug
function UserProfile({ userId }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(setUser)
  }, []) // ❌ Dependência faltante!

  return <div>{user.name}</div> // ❌ user pode ser null
}

// Depois: Correção
function UserProfile({ userId }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!userId) return

    setLoading(true)
    setError(null)

    fetch(`/api/users/${userId}`)
      .then(async (res) => {
        if (!res.ok) throw new Error('User not found')
        const data = await res.json()
        setUser(data)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [userId])

  if (loading) return <Skeleton />
  if (error) return <Error message={error} />
  if (!user) return null

  return <div>{user.name}</div>
}
```

---

## 5. Step 4: Testar

### 5.1 Tipos de Teste para Bugs

```markdown
## Test Coverage para Bug Fix

### 1. Unit Test
- [ ] Teste do componente/função que falhou
- [ ] Teste do caso específico do bug

### 2. Integration Test
- [ ] Teste do fluxo completo
- [ ] Teste de edge cases relacionados

### 3. Regression Test
- [ ] Verificar que outras funcionalidades ainda funcionam
- [ ] Testar fluxos relacionados
```

### 5.2 Exemplo de Teste Regressivo

```typescript
// Teste do bug corrigido
it('should handle null user gracefully', () => {
  const { container } = render(<UserProfile userId={null} />)
  expect(container).toHaveTextContent(/carregando/i)
})

it('should display user name when user exists', () => {
  const mockUser = { id: '1', name: 'John', email: 'john@example.com' }

  render(<UserProfile userId="1" />)

  // Simular API response
  vi.spyOn(window, 'fetch').mockResolvedValueOnce({
    ok: true,
    json: async () => mockUser,
  } as Response)

  expect(screen.getByText('John')).toBeInTheDocument()
})

it('should not crash on API error', async () => {
  vi.spyOn(window, 'fetch').mockRejectedValueOnce(new Error('API Error'))

  render(<UserProfile userId="invalid" />)

  await waitFor(() => {
    expect(screen.getByRole('alert')).toHaveTextContent(/erro/i)
  })
})
```

---

## 6. Step 5: Documentar

### 6.1 Changelog Entry

```markdown
## Changelog

### [1.2.1] - 2024-01-15

### Fixed
- [#123] Login não funcionava após refresh (causa: token não era persistido corretamente)
- [#124] Carrinho mostrava itens duplicados (causa: key duplicada no map)
- [#125] Upload de imagem falhava em arquivos > 5MB (causa: limite hardcoded)
```

### 6.2 Post-Mortem Template

```markdown
## Post-Mortem: [Nome do Bug]

### Resumo
Breve descrição do que aconteceu.

### Impacto
- Usuários afetados: X%
- Tempo de inatividade: Y horas
- Receita perdida: Z

### Causa Raiz
Explicação técnica detalhada.

### Timeline
- [DD/MM HH:mm] Bug reportado
- [DD/MM HH:mm] Investigação iniciada
- [DD/MM HH:mm] Causa identificada
- [DD/MM HH:mm] Correção implementada
- [DD/MM HH:mm] Deploy realizado
- [DD/MM HH:mm] Bug resolvido

### O Que Deu Certo
- [ ] Monitoramento detectou rapidamente
- [ ] Documentação auxiliou na investigação
- [ ] Tests identificaram o problema

### O Que Pode Melhorar
- [ ] Melhor test coverage
- [ ] Alertas mais específicos
- [ ] Documentação mais clara

### Ações de Follow-up
- [ ] Adicionar test para prevenir regressão
- [ ] Melhorar monitoramento
- [ ] Revisar código similar
```

---

## 7. Checklist Final de Correção

```markdown
## Bug Fix Checklist

### Reprodução
- [ ] Bug reproduzido localmente
- [ ] Steps documentados

### Análise
- [ ] Causa raiz identificada
- [ ] Padrão similar verificado no código

### Correção
- [ ] Correção implementada
- [ ] Código segue padrões do projeto
- [ ] Tipos TypeScript atualizados

### Testes
- [ ] Teste unitário adicionado
- [ ] Teste cobre edge cases
- [ ] Testes existentes ainda passam
- [ ] Regression testado

### Documentação
- [ ] Changelog atualizado
- [ ] Documentação de API atualizada (se aplicável)
- [ ] Post-mortem escrito (se crítico)

### Review
- [ ] PR revisado
- [ ] Deploy em staging verificado
```

---

## 8. Referências

| Recurso | URL |
|---------|-----|
| Bug Bash Template | https://docs.github.com/issues/tracking-your-work-with-issues |
| Incident Response | https://response.pagerduty.com/ |
| Post-Mortems | https://www.atlassian.com/incident-management/postmortem |

---

**Versão:** 1.0.0
**Última atualização:** 2024-01-15
**Responsável:** Claude Code
