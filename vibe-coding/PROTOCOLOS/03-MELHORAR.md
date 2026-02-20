---
## PARA CLAUDE (AI INSTRUCTIONS)

Este protocolo é invocado pelo comando `*melhorar` no CLAUDE.md.
Execute conforme as regras definidas no CLAUDE.md e em COMUNICACAO.md.
---

# 03-MELHORAR.md

## Protocolo: Aprimoramento e Refatoração

Este documento estabelece o protocolo para melhorias contínuas, refatoração e otimização de código, mantendo qualidade e produtividade.

---

## 1. Quando Refatorar vs Reescrever

### 1.1 Matriz de Decisão

| Critério | Refatorar | Reescrever |
|----------|-----------|------------|
| Código legado | < 30% do código | > 70% do código |
| Testes existentes | > 60% coverage | < 20% coverage |
| Bugs conhecidos | Mínimos | Muitos críticos |
| Complexidade | Alta mas compreensível | Spaghetti code |
| Tempo disponível | Sprints regulares | Projeto dedicado |
| Dependências | Mantíveis | Depreciadas/quebradas |

### 1.2 Sinais de Que Precisa Refatorar

```markdown
## Código Smells - Precisa de Atenção

### Duplicação
- [ ] Mesma lógica em 3+ lugares
- [ ] Copiar-colar identificado
- [ ] Funções similares com pequenas variações

### Funções Longas
- [ ] Função > 50 linhas
- [ ] Múltiplas responsabilidades
- [ ] Too Many Parameters (> 4)

### Classes/Componentes Gordos
- [ ] Component > 300 linhas
- [ ] useEffect com muitas dependências
- [ ] Props > 10

### Nomenclatura Ruim
- [ ] Variáveis: `data`, `temp`, `info`
- [ ] Funções: `handleSomething1`, `doStuff`
- [ ] Classes: `Manager`, `Helper`, `Utils`

### Acoplamento Alto
- [ ] Mudança em A quebra B
- [ ] Imports circulares
- [ ] Props drilling > 3 níveis

###magic Values
- [ ] Números sem contexto no código
- [ ] Strings repetidas
- [ ] URLs hardcoded
```

### 1.3 Sinais de Que Precisa Reescrever

```markdown
## Código Morto - Precisa Remover

### Código Inalcançável
- [ ] Nunca chamado
- [ ] Condição impossível (if false)

### Feature Deprecated
- [ ] Flag de feature desativada há > 2 releases
- [ ] Referências a APIs antigas

### Comentários "Historia"
- [ ] "Este código é assim porque..."
- [ ] Comentários de quem não está mais na equipe
```

---

## 2. Checklist de Dívida Técnica

### 2.1 Inventário de Dívida

```markdown
## Dívida Técnica - Tracking

### Alta Prioridade (Resolver em 1 Sprint)
- [ ] TODO: Validar entrada de dados em /api/orders
- [ ] FIXME: Memory leak em notifications
- [ ] HACK: Login funciona mas não valida token

### Média Prioridade (Resolver em 1-2 Sprints)
- [ ] TODO: Componentizar Table genérica
- [ ] FIXME: Performance degradada com > 100 items
- [ ] XXX: Duplicação entre Auth services

### Baixa Prioridade ( backlog)
- [ ] Modernizar para React Server Components
- [ ] Substituir lodash por native JS
- [ ] Atualizar TypeScript strict mode
```

### 2.2 Métricas de Dívida

```typescript
// scripts/debt-check.ts
// Script para calcular score de dívida

const metrics = {
  linesOfCode: 15000,
  duplicatedLines: 450, // 3% duplicado
  complexFunctions: 12,
  uncoveredLines: 2000, // 13% sem teste
  todoComments: 25,
  deprecatedDependencies: 3,
}

const debtScore = {
  duplicatedLines: (450 / 15000) * 100, // 3% = ALERTA
  coverage: 100 - (2000 / 15000) * 100, // 87% = BOM
  complexity: 12, // 12 funcs complexas = ATENÇÃO
  todos: 25, // Muitos TODOs = ATRASO
}

console.log('Debt Score:', debtScore)
```

---

## 3. Performance Optimization Checklist

### 3.1 Core Web Vitals

```markdown
## LCP (Largest Contentful Paint) - < 2.5s
- [ ] Imagens otimizadas (WebP, AVIF)
- [ ] Lazy loading implementada
- [ ] Critical CSS inlined
- [ ] Font loading otimizado

## FID (First Input Delay) - < 100ms
- [ ] JS bundle pequeno
- [ ] Code splitting implementado
- [ ] Long tasks quebradas

## CLS (Cumulative Layout Shift) - < 0.1
- [ ] Dimensões de imagens definidas
- [ ] Font-display: swap
- [ ] Skeleton loaders
```

### 3.2 Database Performance

```sql
-- Análise de Queries Lentas
EXPLAIN ANALYZE
SELECT * FROM orders
WHERE user_id = 'xxx'
ORDER BY created_at DESC
LIMIT 20;

-- Verificar Índices
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'orders';

-- Queries Frequentes Cacheáveis
-- Para cada query que roda > 100ms, considerar cache
```

### 3.3 Frontend Performance

```typescript
// React Performance Checklist

// 1. Memoização
const MemoizedComponent = memo(({ data }) => {
  // Componente pesado
})

// 2. Code Splitting
const HeavyComponent = lazy(() => import('./HeavyComponent'))

// 3. Virtualização
import { useVirtualizer } from '@tanstack/react-virtual'

// 4. Debouncing/Throttling
import { useDebounce, useThrottle } from '@/hooks/useDebounce'

// 5. Image Optimization
import Image from 'next/image'
<Image
  src={src}
  alt={alt}
  width={width}
  height={height}
  placeholder="blur"
  blurDataURL={blurDataURL}
/>
```

---

## 4. Como Medir Antes/Depois

### 4.1 Benchmarking Setup

```typescript
// tests/performance/benchmarks.ts
import { describe, it, expect } from 'vitest'

describe('Performance Benchmarks', () => {
  const iterations = 1000

  it('should process 1000 items under 100ms', () => {
    const start = performance.now()

    const result = processItems(largeDataset)

    const end = performance.now()
    const duration = end - start

    expect(duration).toBeLessThan(100)
  })

  it('should render 100 components under 50ms', () => {
    const start = performance.now()

    render(<ComponentList items={items} />)

    const end = performance.now()
    const duration = end - start

    expect(duration).toBeLessThan(50)
  })
})
```

### 4.2 Lighthouse CI

```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI

on: [push]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4

      - name: Install deps
        run: npm ci

      - name: Build
        run: npm run build

      - name: Run Lighthouse
        uses: treosh/lighthouse-ci-action@v10
        with:
          urls: |
            https://staging.example.com
          budgetPath: ./lighthouse-budget.json
```

---

## 5. Estratégia de Migração Gradual

### 5.1 Pattern: Strangler Fig

```markdown
## Estratégia Strangler Fig

Sistema Antigo → Proxy → Sistema Novo
            ↓
      Decisão de Routing

### Passo a Passo

1. Criar facade/interface comum
2. Direcionar tráfego gradualmente
3. Monitorar métricas
4. Migrar funcionalidade por funcionalidade
5. Remover código antigo
```

### 5.2 Exemplo Prático

```typescript
// lib/api-legacy.ts (Código existente)
export async function getUser(id: string) {
  return legacyFetch(`/api/v1/users/${id}`)
}

// lib/api-facade.ts (Nova interface)
export interface User {
  id: string
  name: string
  email: string
}

export async function getUser(id: string): Promise<User> {
  // Decide dinamicamente qual API usar
  const useNewApi = featureFlags.useNewUserApi

  if (useNewApi) {
    return newFetch(`/api/users/${id}`)
  } else {
    const legacy = await legacyFetch(`/api/v1/users/${id}`)
    return mapLegacyToUser(legacy)
  }
}
```

### 5.3 Feature Flags

```typescript
// lib/feature-flags.ts
import { createClient } from '@/lib/supabase'

export async function getFeatureFlag(key: string): Promise<boolean> {
  const supabase = await createClient()

  const { data } = await supabase
    .from('feature_flags')
    .select('enabled')
    .eq('key', key)
    .single()

  return data?.enabled ?? false
}

// Uso gradual - 10% dos usuários
export async function shouldUseNewCheckout(): Promise<boolean> {
  const isEnabled = await getFeatureFlag('new_checkout')
  if (!isEnabled) return false

  const user = await getCurrentUser()
  const hash = hashString(user.id)
  return hash % 100 < 10 // 10%
}
```

---

## 6. Refatoração de Código

### 6.1 Extrair Função

```typescript
// ❌ Antes: Função longa
function processOrder(order: Order) {
  // Validação (20 linhas)
  // Cálculo (15 linhas)
  // Persistência (10 linhas)
  // Notificação (10 linhas)
}

// ✅ Depois: Funções small
function processOrder(order: Order) {
  validateOrder(order)
  const calculated = calculateOrderTotals(order)
  const saved = await persistOrder(calculated)
  await notifyOrderPlaced(saved)
}

function validateOrder(order: Order) {
  if (!order.items?.length) {
    throw new Error('Order must have items')
  }
  // ...
}
```

### 6.2 Substituir Condicionais por Polimorfismo

```typescript
// ❌ Antes: Switch/If complexo
function createNotification(type: string, data: any) {
  if (type === 'email') {
    return new EmailNotification(data)
  } else if (type === 'sms') {
    return new SMSNotification(data)
  } else if (type === 'push') {
    return new PushNotification(data)
  }
}

// ✅ Depois: Factory Pattern
interface Notification {
  send(): Promise<void>
}

class EmailNotification implements Notification {
  constructor(private data: EmailData) {}
  async send() { /* email logic */ }
}

class SMSNotification implements Notification {
  constructor(private data: SMSData) {}
  async send() { /* sms logic */ }
}

const NOTIFICATION_FACTORY: Record<string, new (data: any) => Notification> = {
  email: EmailNotification,
  sms: SMSNotification,
  push: PushNotification,
}

function createNotification<T extends Notification>(
  type: keyof typeof NOTIFICATION_FACTORY,
  data: ConstructorParameters<typeof NOTIFICATION_FACTORY[T]>[0]
): T {
  const Factory = NOTIFICATION_FACTORY[type]
  return new Factory(data) as T
}
```

### 6.3 Component Composition

```typescript
// ❌ Props Drilling
function GrandParent({ user }) {
  return <Parent user={user} />
}

function Parent({ user }) {
  return <Child user={user} />
}

function Child({ user }) {
  return <div>{user.name}</div>
}

// ✅ Composition Pattern
function GrandParent() {
  return (
    <AuthProvider>
      <AppLayout>
        <Dashboard />
      </AppLayout>
    </AuthProvider>
  )
}

function Dashboard() {
  const { user } = useAuth()
  return <div>{user.name}</div>
}
```

---

## 7. Checklist Final de Aprimoramento

```markdown
## Refactoring Checklist

### Preparação
- [ ] Backup do código atual
- [ ] Testes existentes passando
- [ ] Coverage atual documentado
- [ ] Baseline de performance registrado

### Execução
- [ ] Mudanças pequenas e incrementais
- [ ] Testes rodando após cada mudança
- [ ] Commits atômicos

### Validação
- [ ] Todos os testes passando
- [ ] Performance igual ou melhor
- [ ] Nenhum bug novo introduzido
- [ ] Typescript sem errors

### Documentação
- [ ] Changelog atualizado
- [ ] Decisões arquiteturais documentadas
- [ ] Patterns identificados e catalogados
```

---

## 8. Referências

| Recurso | URL |
|---------|-----|
| Refactoring Guru | https://refactoring.guru/ |
| MDN Performance | https://developer.mozilla.org/en-US/docs/Web/Performance |
| React Performance | https://react.dev/learn/render-and-commit |

---

**Versão:** 1.0.0
**Última atualização:** 2024-01-15
**Responsável:** Claude Code
