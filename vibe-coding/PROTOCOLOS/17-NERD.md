---
## PARA CLAUDE (AI INSTRUCTIONS)

Este protocolo é invocado pelo comando `*nerd` no CLAUDE.md.
Execute conforme as regras definidas no CLAUDE.md e em COMUNICACAO.md.
---

# Protocolo Nerd (*nerd)

## Quando Usar

- Bug muito difícil de resolver
- Problema de performance complexo
- Precisa entender fundo como algo funciona
- Debugging profundo
- Otimização avançada
- Problema que ninguém mais consegue resolver

---

## Modo de Debug Profundo

### 1. Reproduzir o Problema

```
Passos para reproduzir:
1. Em qual ambiente acontece? (dev, staging, prod)
2. Quais passos exatos levam ao erro?
3. É consistente ou intermitente?
4. Quando começou a acontecer?
```

### 2. Isolar a Causa

```bash
# Comentário de código (testar pedaço por pedaço)
# 1. Desabilitar metade do código
# 2. Se parou de dar erro → está na metade desabilitada
# 3. Se continua → está na metade ativa
# 4. Repetir até achar o culpado
```

### 3. Binsearch de Commits

```bash
# Encontrar commit que introduziu o bug
git bisect start
git bisect bad HEAD          # Commit atual com bug
git bisect good v1.0.0       # Último commit conhecido sem bug

# Git vai navegar entre commits
# Para cada um, teste e diga:
git bisect good   # Se funcionar
git bisect bad    # Se tiver bug

# No final, git mostra o commit culpado
```

---

## Profiling

### JavaScript/TypeScript

```javascript
// Medir tempo de execução
console.time('minhaFuncao')
minhaFuncao()
console.timeEnd('minhaFuncao')
// Output: minhaFuncao: 45.23ms

// Medir com mais precisão
const start = performance.now()
minhaFuncao()
const end = performance.now()
console.log(`Tempo: ${(end - start).toFixed(2)}ms`)
```

### React Profiler

```jsx
import { Profiler } from 'react'

function onRenderCallback(
  id,           // ID do Profiler
  phase,        // "mount" ou "update"
  actualDuration,    // Tempo da renderização
  baseDuration,      // Tempo estimado sem memo
  startTime,         // Início
  commitTime         // Fim
) {
  console.log(`${id} ${phase}: ${actualDuration}ms`)
}

<Profiler id="MinhaApp" onRender={onRenderCallback}>
  <App />
</Profiler>
```

### Chrome DevTools

```
1. Abrir DevTools (F12)
2. Aba "Performance"
3. Clicar "Record"
4. Fazer a ação lenta
5. Parar gravação
6. Analisar flame graph

O que procurar:
- Barras longas = funções lentas
- Muitas barras pequenas = chamadas repetidas
- "Layout" ou "Paint" longos = problemas de render
```

---

## Memory Leaks

### Detectar

```javascript
// Node.js - Ver uso de memória
console.log(process.memoryUsage())
// {
//   rss: 49356800,        // Resident Set Size
//   heapTotal: 10469376,  // Heap total
//   heapUsed: 5397248,    // Heap usado
//   external: 1221390     // Memória externa
// }

// Monitorar ao longo do tempo
setInterval(() => {
  const used = process.memoryUsage().heapUsed / 1024 / 1024
  console.log(`Memória: ${Math.round(used * 100) / 100} MB`)
}, 1000)
```

### Causas Comuns

```javascript
// 1. Event listeners não removidos
// ❌ Leak
useEffect(() => {
  window.addEventListener('resize', handleResize)
}, [])
// ✅ Fix
useEffect(() => {
  window.addEventListener('resize', handleResize)
  return () => window.removeEventListener('resize', handleResize)
}, [])

// 2. Intervals não limpos
// ❌ Leak
useEffect(() => {
  setInterval(() => {}, 1000)
}, [])
// ✅ Fix
useEffect(() => {
  const id = setInterval(() => {}, 1000)
  return () => clearInterval(id)
}, [])

// 3. Closures acumulando
// ❌ Leak
const funcs = []
for (var i = 0; i < 1000000; i++) {
  funcs.push(() => i) // Cada uma captura o escopo
}
// ✅ Fix (usar let ou evitar criar tantas)
```

---

## Performance Web

### Core Web Vitals

```
LCP (Largest Contentful Paint)
- Meta: < 2.5s
- O que é: Tempo até o maior elemento visível aparecer
- Otimizar: Imagens, fontes, critical CSS

FID (First Input Delay)
- Meta: < 100ms
- O que é: Tempo até responder a primeira interação
- Otimizar: Reduzir JavaScript bloqueante

CLS (Cumulative Layout Shift)
- Meta: < 0.1
- O que é: Quanto a página "pula" durante carregamento
- Otimizar: Definir width/height de imagens
```

### Otimizações Comuns

```javascript
// 1. Lazy loading de componentes
const HeavyComponent = React.lazy(() => import('./Heavy'))

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <HeavyComponent />
    </Suspense>
  )
}

// 2. Memoização
const MemoizedComponent = React.memo(HeavyComponent)

// 3. useCallback para funções em props
const handleClick = useCallback(() => {
  // ...
}, [dependencies])

// 4. useMemo para cálculos pesados
const expensiveValue = useMemo(() => {
  return heavyCalculation(data)
}, [data])

// 5. Virtualização de listas longas
import { FixedSizeList } from 'react-window'
// Renderiza só o que está visível
```

### Bundle Size

```bash
# Analisar bundle
npx analyze

# Ver tamanho de dependências
npx cost-of-modules

# Tree shaking
# No package.json:
{
  "sideEffects": false
}
```

---

## Database Debugging

### Query Analysis

```sql
-- Ver plano de execução
EXPLAIN ANALYZE SELECT * FROM usuarios WHERE email = 'test@email.com';

-- Sinais de problema:
-- "Seq Scan" em tabela grande → precisa de índice
-- "Hash Join" com muitas linhas → query ineficiente
-- "Filter" removendo muitas linhas → WHERE mal otimizado

-- Ver locks ativos
SELECT
  pid,
  state,
  query,
  EXTRACT(EPOCH FROM (now() - query_start)) as segundos
FROM pg_stat_activity
WHERE state != 'idle'
ORDER BY query_start;

-- Matar query travada (CUIDADO!)
SELECT pg_terminate_backend(pid);
```

### Slow Query Log

```sql
-- Habilitar log de queries lentas
ALTER SYSTEM SET log_min_duration_statement = 1000; -- 1 segundo
SELECT pg_reload_conf();

-- Queries lentas vão aparecer nos logs do Supabase/postgres
```

---

## Network Debugging

### Fetch com Timeout

```javascript
// Evitar fetch preso para sempre
async function fetchWithTimeout(url, timeout = 5000) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      signal: controller.signal
    })
    return response
  } finally {
    clearTimeout(timeoutId)
  }
}
```

### Request Waterfall

```
Problema:
Request A (200ms)
  └── Request B (200ms)
      └── Request C (200ms)
Total: 600ms

Solução:
Request A (200ms)
Request B (200ms)
Request C (200ms)
Total: 200ms (paralelo!)

// Paralelizar com Promise.all
const [users, posts, comments] = await Promise.all([
  fetch('/users'),
  fetch('/posts'),
  fetch('/comments')
])
```

---

## Logs e Monitoramento

### Logging Estruturado

```javascript
// Níveis de log
logger.error('Algo deu muito errado', { error, context })
logger.warn('Algo preocupante', { details })
logger.info('Informação útil', { action, result })
logger.debug('Detalhes para debug', { data })

// Structured logging
console.log(JSON.stringify({
  level: 'error',
  message: 'Database connection failed',
  timestamp: new Date().toISOString(),
  context: {
    host: process.env.DB_HOST,
    error: err.message
  }
}))
```

### Sentry (Error Tracking)

```javascript
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
})

// Capturar erro manualmente
try {
  riskyOperation()
} catch (error) {
  Sentry.captureException(error)
  throw error
}

// Adicionar contexto
Sentry.setUser({ id: user.id, email: user.email })
Sentry.setTag('feature', 'checkout')
Sentry.setContext('order', { id: orderId, total })
```

---

## Debugging Tools

### VS Code Debug

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Next.js",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev"],
      "console": "integratedTerminal"
    }
  ]
}
```

### Debug no Código

```javascript
// Node.js debugger
debugger // Para execução aqui se estiver com debugger ativo

// Console avançado
console.table(array)      // Mostra como tabela
console.dir(obj, { depth: null })  // Mostra objeto completo
console.trace()           // Mostra stack trace
console.group('Grupo')    // Agrupa logs
console.groupEnd()
```

---

## Checklist Nerd

### Quando o bug é difícil:

```
□ Consigo reproduzir consistentemente?
□ Isolei a causa (bisect, comentar código)?
□ Verifiquei logs e erros no console?
□ Usei debugger/breakpoints?
□ Procurei no Google/GitHub issues?
□ Testei em ambiente isolado?
□ Revisei commits recentes relacionados?
```

### Quando performance está lenta:

```
□ Fiz profiling (Performance tab)?
□ Verifiquei uso de memória?
□ Analisei bundle size?
□ Verifiquei queries do banco?
□ Testei network timing?
□ Identifiquei o gargalo específico?
```

---

## Resumo para Iniciantes

| Técnica | Quando usar |
|---------|-------------|
| console.time() | Medir tempo de função |
| git bisect | Achar commit do bug |
| Chrome DevTools | Debug visual de performance |
| React.memo | Componente renderizando muito |
| Promise.all | Paralelizar requests |
| EXPLAIN ANALYZE | Query lenta no banco |

**Lembre-se:** O modo nerd é para quando nada mais funciona. Antes de mergulhar fundo, tente os comandos básicos (*bug, *erro).
