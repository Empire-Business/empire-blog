---
## PARA CLAUDE (AI INSTRUCTIONS)

Este protocolo é invocado pelo comando `*lançar` no CLAUDE.md.
Execute conforme as regras definidas no CLAUDE.md e em COMUNICACAO.md.
---

# 05-LANCAR.md

## Protocolo: Checklist de Lançamento

Este documento estabelece o checklist completo para validar e lançar uma nova versão em produção com confiança.

---

## 1. Segurança (OWASP Checklist)

### 1.1 Autenticação e Autorização

```markdown
## Autenticação
- [ ] Senhas hasheadas (bcrypt/argon2)
- [ ] Rate limiting em login (/login, /forgot-password)
- [ ] MFA disponível para contas sensíveis
- [ ] Session timeout configurado (30 min inatividade)
- [ ] Password policy implementada (min 8 chars, complexa)
- [ ] Breach password checking (Have I Been Pwned)

## Autorização
- [ ] RLS policies configuradas em todas as tabelas
- [ ] Checks no client E no server
- [ ] API routes protegidas
- [ ] Admin routes com acesso restrito
- [ ] Webhooks com signature verification
```

### 1.2 Validação de Input

```typescript
// lib/validators/user.ts
import { z } from 'zod'

export const userSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(8).max(128),
  name: z.string().min(1).max(100),
  // Não confie em IDs do client
  role: z.enum(['user', 'admin']).optional(),
}).strict() // Rejeita campos desconhecidos

// ✅ Usar validação Zod em todas as entradas
export async function createUser(data: unknown) {
  const result = userSchema.safeParse(data)
  if (!result.success) {
    throw new Error('Invalid input')
  }
  // Usar result.data (types garantidos)
}
```

### 1.3 Proteção Contra Ataques

| Ataque | Proteção | Verificado |
|--------|----------|------------|
| **XSS** | React auto-escape, CSP headers | ☐ |
| **CSRF** | CSRF tokens, SameSite cookies | ☐ |
| **SQL Injection** | Supabase client (parameterized) | ☐ |
| **SSRF** | Allowlist de URLs, não permitir internas | ☐ |
| **IDOR** | Authorization checks, UUIDs | ☐ |
| **Rate Limiting** | 100 req/min por IP | ☐ |
| **Sensitive Data** | Encryption at rest, HTTPS only | ☐ |

### 1.4 Security Headers

```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Security Headers
  response.headers.set('X-DNS-Prefetch-Control', 'on')
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin')
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.google-analytics.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://*.supabase.co;"
  )
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

  return response
}
```

---

## 2. Performance (Core Web Vitals)

### 2.1 LCP (Largest Contentful Paint)

```markdown
## LCP Target: < 2.5s

### Imagens
- [ ] Usar WebP/AVIF
- [ ] Lazy loading para below-fold
- [ ] Explicit width/height
- [ ] Blur placeholders (blurDataURL)
- [ ] CDNs configurados

### Fontes
- [ ] Font-display: swap
- [ ] Preload de fontes críticas
- [ ] subset de caracteres necessários

### CSS/JS
- [ ] Critical CSS inlined
- [ ] Defer non-critical JS
- [ ] Code splitting ativo
```

### 2.2 FID (First Input Delay)

```markdown
## FID Target: < 100ms

### JavaScript
- [ ] Bundle size < 200KB (gzip)
- [ ] Third-party scripts em延迟
- [ ] Long tasks quebradas (> 50ms)

### Lazy Loading
- [ ] Routes lazy loaded
- [ ] Components não-críticos em lazy
- [ ] Heavy libraries dinamicamente importadas
```

### 2.3 CLS (Cumulative Layout Shift)

```markdown
## CLS Target: < 0.1

### Evitar Layout Shifts
- [ ] Aspect ratios em imagens/vídeos
- [ ] Skeleton loaders
- [ ] Font-display: swap (evita FOIT/FOUT)
- [ ] Reserve espaço para anúncios
- [ ] CSS animations transform-only
```

### 2.4 Lighthouse CI Check

```yaml
# .github/workflows/lighthouse.yml
- name: Lighthouse CI
  uses: treosh/lighthouse-ci-action@v10
  with:
    urls: |
      https://production.example.com
    configPath: ./lighthouserc.json
    budgetPath: ./lighthouse-budget.json

// lighthouse-budget.json
{
  "ci": {
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 0.9 }],
        "categories:best-practices": ["error", { "minScore": 0.9 }],
        "categories:seo": ["error", { "minScore": 0.9 }]
      }
    }
  }
}
```

---

## 3. Accessibility (WCAG 2.1 AA)

### 3.1 Checklist de A11y

```markdown
## WCAG 2.1 AA Checklist

### 1.1 Text Alternatives
- [ ] Todas as imagens têm alt text
- [ ] Ícones decorativos com alt=""
- [ ] Áudio/video tem transcrição

### 1.2 Time-based Media
- [ ] Vídeos têm legendas
- [ ] Áudio tem transcrição

### 1.3 Adaptable
- [ ] Conteúdo logical order
- [ ] Info/estrutura via CSS
- [ ] Link purpose claro
- [ ] Labels visíveis

### 1.4 Distinguishable
- [ ] Color isn't sole info carrier
- [ ] Contraste 4.5:1 (normal), 3:1 (large)
- [ ] Resize texto 200% sem quebra

### 2.1 Keyboard Accessible
- [ ] Todo interactive é focável
- [ ] Focus order logical
- [ ] No keyboard trap
- [ ] Skip links disponíveis

### 2.4 Navigable
- [ ] Page titles descritivos
- [ ] Headings hierarchy (h1→h2→h3)
- [ ] Focus visible
- [ ] Link purpose claro

### 3.1 Readable
- [ ] html lang setado
- [ ] Erros de linguagem marcados

### 3.3 Input Assistance
- [ ] Labels associados
- [ ] Error identification clara
- [ ] Suggestions de correção
- [ ] Error prevention (confirmação)
```

### 3.2 Testes de A11y

```typescript
// tests/a11y.ts
import { test, expect } from '@playwright/test'

test('homepage meets accessibility standards', async ({ page }) => {
  // Checar contrastes
  await expect(page).toHaveContrast('white', 'blue', { threshold: 4.5 })

  // Checar labels ARIA
  await expect(page.locator('input')).toHaveAccessibleName()

  // Checar headings hierarchy
  await expect(page.locator('h1')).toHaveCount(1)

  // Checar keyboard navigation
  await page.keyboard.press('Tab')
  await expect(page.locator(':focus')).toBeVisible()
})

// test/accessibility.spec.tsx
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

test('component is accessible', async () => {
  const { container } = render(<MyComponent />)

  const results = await axe(container, {
    rules: {
      'color-contrast': { enabled: true },
      'keyboard': { enabled: true },
      'label': { enabled: true },
    },
  })

  expect(results.violations).toHaveLength(0)
})
```

---

## 4. SEO Basics

### 4.1 On-Page SEO

```typescript
// app/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'My App - Description',
    template: '%s | My App',
  },
  description: 'My App description for search engines',
  keywords: ['keyword1', 'keyword2', 'keyword3'],
  authors: [{ name: 'My Company' }],
  creator: 'My Company',
  publisher: 'My Company',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://myapp.com',
    siteName: 'My App',
    title: 'My App',
    description: 'My App description',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'My App',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'My App',
    description: 'My App description',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

// app/sitemap.ts
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://myapp.com'

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    // ... mais páginas
  ]
}
```

### 4.2 SEO Checklist

```markdown
## SEO Technical

- [ ] Canonical URLs configurados
- [ ] Sitemap.xml gerado automaticamente
- [ ] Robots.txt configurado
- [ ] Structured data (Schema.org)
- [ ] hreflang para i18n
- [ ] Open Graph tags
- [ ] Twitter Cards
- [ ] Favicon configurado
- [ ] 404 page customizada
- [ ] 301 redirects para páginas antigas
- [ ] HTTPS everywhere
```

---

## 5. Analytics Setup

### 5.1 Google Analytics 4

```typescript
// lib/analytics/gtag.ts
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID

declare global {
  interface Window {
    gtag: (...args: any[]) => void
    dataLayer: any[]
  }
}

export const initGA = () => {
  if (!GA_ID) return

  window.dataLayer = window.dataLayer || []
  function gtag(...args: any[]) {
    window.dataLayer.push(args)
  }
  window.gtag = gtag

  gtag('js', new Date())
  gtag('config', GA_ID, {
    page_path: window.location.pathname,
  })
}

export const trackPageView = (url: string) => {
  if (!GA_ID) return
  window.gtag('config', GA_ID, { page_path: url })
}

export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (!GA_ID) return
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  })
}
```

### 5.2 Events Essenciais

```typescript
// tracking events
export const EVENTS = {
  SIGNUP: 'signup',
  LOGIN: 'login',
  CHECKOUT_START: 'begin_checkout',
  PURCHASE: 'purchase',
  SEARCH: 'search',
  SHARE: 'share',
  LEAD: 'generate_lead',
} as const

// Uso
<Button onClick={() => trackEvent(EVENTS.SIGNUP, 'auth', 'Google')}>
  Sign up
</Button>
```

---

## 6. Error Tracking

### 6.1 Sentry Setup

```typescript
// instrumentacion.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,

  // Ignorar errors esperados
  ignoreErrors: [
    'ResizeObserver loop limit exceeded',
    'ResizeObserver loop completed with undelivered notifications',
  ],

  // Filtrar por ambiente
  beforeSend(event, hint) {
    if (process.env.NODE_ENV === 'production') {
      return event
    }
    return null // Não enviar em dev
  },
})

// Error Boundary
import { ErrorBoundary } from '@sentry/react'

<ErrorBoundary
  fallback={({ error, resetError }) => (
    <ErrorFallback error={error} onReset={resetError} />
  )}
>
  <App />
</ErrorBoundary>
```

### 6.2 Monitoring Setup

```markdown
## Health Checks

- [ ] Endpoint /healthcheck configurado
- [ ] Database connection check
- [ ] External API health checks
- [ ] Disk space monitoring
- [ ] Memory usage monitoring
- [ ] Error rate alerts (Slack/Discord)
- [ ] Uptime monitoring (Pingdom/UptimeRobot)

## Alerts

| Alerta | Threshold | Notificação |
|--------|-----------|-------------|
| Error rate | > 1% | Slack + SMS |
| Response time P95 | > 2s | Slack |
| CPU | > 80% | Slack |
| Memory | > 85% | Slack |
| Disk | > 90% | Slack + SMS |
```

---

## 7. Checklist Final de Lançamento

```markdown
## 🚀 Release Checklist

### 1. Código
- [ ] Branch: main/develop em sync
- [ ] Últimos commits testados
- [ ] Build passa localmente
- [ ] TypeScript sem errors

### 2. Testes
- [ ] Unit tests passando (> 80%)
- [ ] Integration tests passando
- [ ] E2E tests passando
- [ ] Smoke tests em staging

### 3. Segurança
- [ ] Security audit passou (npm audit)
- [ ] Dependencies atualizadas
- [ ] Environment variables setadas
- [ ] Security headers configurados
- [ ] RLS policies verificadas

### 4. Performance
- [ ] Lighthouse > 90 em todas categorias
- [ ] Bundle size acceptable
- [ ] Images otimizadas
- [ ] CDN configurado

### 5. A11y
- [ ] aXe tests passando
- [ ] Keyboard navigation testado
- [ ] Screen reader testado
- [ ] WCAG AA compliance

### 6. SEO
- [ ] Meta tags configuradas
- [ ] Sitemap gerado
- [ ] Robots.txt configurado
- [ ] Canonical URLs ok

### 7. Analytics
- [ ] GA4 configurado
- [ ] Events tracking funcionando
- [ ] Conversions definidas
- [ ] Dashboard criado

### 8. Monitoring
- [ ] Error tracking ativo
- [ ] Alerts configurados
- [ ] Health checks funcionando
- [ ] Logs centralizados

### 9. Documentação
- [ ] README atualizado
- [ ] API docs atualizadas
- [ ] Changelog atualizado
- [ ] Deployment docs atualizadas

### 10. Comunicação
- [ ] Stakeholders notificados
- [ ] Support team informado
- [ ] Rollback plan documentado
- [ ] Canary/deployment window ok
```

---

## 8. Rollback Plan

```markdown
## Rollback Procedure

### Gatilhos
- [ ] Error rate > 5%
- [ ] Revenue drop > 10%
- [ ] User reports > 50 em 1 hora
- [ ] Core functionality quebrada

### Steps de Rollback
```bash
# Git
git revert HEAD
git push --force origin main

# Ou
git checkout <previous-tag>
git push --force origin main

# Database
supabase db restore --project-id $ID backup_$(date -d yesterday +%Y%m%d).sql
```

### Comunicação
- [ ] Notificar stakeholders imediatamente
- [ ] Post no status page
- [ ] Atualizar documentação
```

---

## 9. Referências

| Recurso | URL |
|---------|-----|
| OWASP Top 10 | https://owasp.org/ |
| WCAG 2.1 | https://www.w3.org/WAI/WCAG21/quickref/ |
| Lighthouse | https://developers.google.com/web/tools/lighthouse |
| Next.js SEO | https://nextjs.org/docs/app/api-reference/file-conventions/metadata |

---

**Versão:** 1.0.0
**Última atualização:** 2024-01-15
**Responsável:** Claude Code
