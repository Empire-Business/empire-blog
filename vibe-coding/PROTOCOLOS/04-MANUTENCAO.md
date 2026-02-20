---
## PARA CLAUDE (AI INSTRUCTIONS)

Este protocolo é invocado pelo CLAUDE.md.
Execute conforme as regras definidas no CLAUDE.md e em COMUNICACAO.md.
---

# 04-MANUTENCAO.md

## Protocolo: Manutenção de Projetos em Produção

Este documento estabelece o protocolo para manter projetos em produção, garantindo estabilidade, segurança e evolução contínua.

---

## 1. Monitoramento de Erros

### 1.1 Stack de Monitoramento

```typescript
// lib/monitoring/client.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,

  // Traces
  tracesSampleRate: 0.1,

  // Sessions
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  // Integração com Next.js
  integrations: [
    Sentry.replayIntegration(),
    Sentry.extraErrorDataIntegration(),
  ],
})

// Helper para erros customizados
export function captureError(error: Error, context?: Record<string, any>) {
  Sentry.captureException(error, {
    extra: context,
  })
}
```

### 1.2 Tipos de Erros para Monitorar

```markdown
## Erros Críticos (Alertar Imediatamente)
- [ ] 5xx errors
- [ ] Autenticação falha em massa
- [ ] Checkout quebrado
- [ ] Dados corrompidos

## Erros de Alerta (Revisar Diariamente)
- [ ] 4xx errors (exceto 401/403 esperados)
- [ ] Performance degradada
- [ ] Falhas de validação
- [ ] Deprecation warnings

## Erros Informativos (Revisar Semanalmente)
- [ ] Warnings de console
- [ ] Deprecation notices
- [ ] User feedback negatives
```

### 1.3 Dashboards Recomendados

| Ferramenta | Propósito | URLs |
|------------|-----------|------|
| Sentry | Error tracking | https://sentry.io/ |
| DataDog/APM | Performance | https://www.datadoghq.com/ |
| CloudWatch | Infra | https://aws.amazon.com/cloudwatch/ |
| Supabase Dashboard | Database | https://supabase.com/dashboard |

---

## 2. Atualização de Dependências

### 2.1 Estratégia de Updates

```markdown
## Frequência de Updates

### Semanalmente (Patch)
- [ ] Security patches
- [ ] Bug fixes críticos
- [ ] Dependências de desenvolvimento

### Mensalmente (Minor)
- [ ] Novas features menores
- [ ] Mejoras de performance
- [ ] Breaking changes menores

### Trimestralmente (Major)
- [ ] Versões major
- [ ] Refatorações necessárias
- [ ] Testing completo
```

### 2.2 Dependabot Configuration

```yaml
# .github/dependabot.yml
version: 2
updates:
  # npm
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
      time: "09:00"
    open-pull-requests-limit: 10
    labels:
      - "dependencies"
      - "npm"
    commit-message:
      prefix: "chore(deps)"
    groups:
      development-dependencies:
        dependency-type: "development"
        update-types: ["minor", "patch"]
      react-ecosystem:
        patterns:
          - "react*"
          - "@types/react*"
        update-types: ["minor", "patch"]

  # GitHub Actions
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
```

### 2.3 Checklist de Update

```markdown
## Dependency Update Checklist

### Antes do Update
- [ ] Backup do projeto
- [ ] Tests passando
- [ ] Revisar changelog da dependência
- [ ] Verificar breaking changes

### Durante o Update
- [ ] npm update --save
- [ ] npm audit fix
- [ ] TypeScript compilando

### Depois do Update
- [ ] Tests passando
- [ ] Build passando
- [ ] Smoke tests em staging
- [ ] E2E tests passando
- [ ] Review de performance

### Rollback Plan
- [ ] Commit anterior funcionando
- [ ] Versão anterior documentada
```

---

## 3. Backup e Recovery

### 3.1 Backup do Supabase

```bash
#!/bin/bash
# scripts/backup.sh

# Configuração
PROJECT_ID="your-project-id"
BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Backup do banco de dados
echo "Creating database backup..."
supabase db dump --project-id $PROJECT_ID > "$BACKUP_DIR/db_$DATE.sql"

# Backup do storage (arquivos)
echo "Downloading storage files..."
supabase storage download --project-id $PROJECT_ID --output "$BACKUP_DIR/storage_$DATE.tar.gz"

# Limpar backups antigos (manter últimos 7)
find $BACKUP_DIR -name "db_*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "storage_*.tar.gz" -mtime +7 -delete

echo "Backup completed: $DATE"
```

### 3.2 Schedule de Backup

```yaml
# .github/workflows/backup.yml
name: Daily Backup

on:
  schedule:
    - cron: '0 3 * * *'  # Todo dia às 3AM
  workflow_dispatch:

jobs:
  backup:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Supabase CLI
        uses: supabase/setup-cli@v1

      - name: Create Backup
        run: |
          supabase db dump --project-id ${{ secrets.SUPABASE_PROJECT_ID }} > backup.sql

      - name: Upload to S3
        uses: aws-actions/upload-s3@v4
        with:
          bucket: ${{ secrets.BACKUP_BUCKET }}
          file: backup.sql
          key: backups/$(date +%Y%m%d).sql
```

### 3.3 Recovery Procedure

```markdown
## Recovery Procedure

### 1. Identificar o Problema
- [ ] Data/hora do último backup válido
- [ ] Causa da perda/corrupção
- [ ] Escopo dos dados afetados

### 2. Preparar Ambiente
- [ ] Database restaurada em staging
- [ ] Tests passando no backup
- [ ] Time notificado

### 3. Executar Recovery
```bash
# Restaurar banco
supabase db restore --project-id $PROJECT_ID backup_20240115.sql

# Verificar integridade
supabase db check-integrity

# Restaurar storage
supabase storage upload --project-id $PROJECT_ID backup/storage.tar.gz
```

### 4. Validar
- [ ] Dados restaurados corretamente
- [ ] Funcionalidades críticas operantes
- [ ] Users conseguem fazer login
- [ ] Orders processando corretamente

### 5. Documentar
- [ ] Post-mortem
- [ ] Lições aprendidas
- [ ] Procedimento atualizado
```

---

## 4. Documentação Viva

### 4.1 Estrutura de Documentação

```
docs/
├── ARCHITECTURE.md          # Decisões arquiteturais
├── API.md                   # Endpoints e contratos
├── DEPLOYMENT.md            # Processos de deploy
├── MONITORING.md            # Dashboards e alertas
├── INCIDENTS.md            # Histórico de incidentes
├── ONBOARDING.md           # Guia para novos devs
└── ROLES.md                # Responsabilidades
```

### 4.2 Template de ADR (Architecture Decision Record)

```markdown
# ADR-001: Use Supabase para Backend

## Status
Aceito

## Contexto
Precisávamos de uma solução de backend rápida para MVPs.

## Decisão
Usar Supabase como BaaS (Backend as a Service).

### Opções Consideradas
1. Supabase - ✅ Escolhida
2. Firebase - ❌ Vendor lock-in
3. Custom Node.js - ❌ Demorado demais

## Consequências

### Positivas
- Rápida implementação
- Documentação excelente
- Supabase Auth incluso

### Negativas
- Vendor lock-in
- Custo pode crescer

## Data
2024-01-15
```

### 4.3 Mantendo Documentação Atualizada

```markdown
## Documentação como Código

### Onde Documentar

| Tipo | Onde |
|------|------|
| Bugs conhecidos | GitHub Issues +标签 `documentation` |
| Decisões técnicas | ADRs em docs/ |
| API changes | OpenAPI spec (Swagger) |
| Database schema | Supabase Dashboard + docs/schema.md |
| Runbooks | docs/runbooks/ |

### Triggers para Atualização

- [ ] Novo feature shipped
- [ ] Bug workaround implementado
- [ ] Deprecation notada
- [ ] Mudança de configuração
- [ ] Incidente resolvido
```

---

## 5. Logs e Observabilidade

### 5.1 Structured Logging

```typescript
// lib/logger.ts
import pino from 'pino'

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  base: {
    service: 'my-app',
    environment: process.env.NODE_ENV,
  },
  timestamp: pino.stdTimeFunctions.isoTime,
})

// log levels
export const log = {
  info: (msg: string, meta?: Record<string, any>) =>
    logger.info(meta, msg),

  error: (msg: string, meta?: Record<string, any>) =>
    logger.error(meta, msg),

  warn: (msg: string, meta?: Record<string, any>) =>
    logger.warn(meta, msg),

  debug: (msg: string, meta?: Record<string, any>) =>
    logger.debug(meta, msg),
}
```

### 5.2 Logs por Domínio

```typescript
// API Routes
export async function GET(request: Request) {
  const start = Date.now()

  try {
    const data = await fetchData()

    log.info('API Response', {
      path: '/api/data',
      duration: Date.now() - start,
      status: 200,
    })

    return Response.json(data)
  } catch (error) {
    log.error('API Error', {
      path: '/api/data',
      error: error.message,
      duration: Date.now() - start,
    })

    return Response.json({ error: 'Internal Error' }, { status: 500 })
  }
}

// Auth Events
export function onAuthCallback(event: AuthEvent) {
  log.info('Auth Event', {
    type: event.type,
    userId: event.user?.id,
    timestamp: new Date().toISOString(),
  })
}
```

### 5.3 Dashboards Essenciais

```markdown
## Métricas de Negócio (Daily)
- [ ] DAU/MAU
- [ ] Conversion rate
- [ ] Revenue
- [ ] User signups

## Métricas Técnicas (Hourly)
- [ ] Error rate (< 1%)
- [ ] Response time P95 (< 500ms)
- [ ] Uptime (> 99.9%)
- [ ] API availability

## Alertas Críticos
- [ ] Error spike (> 5%)
- [ ] Response time P95 (> 1s)
- [ ] CPU > 80%
- [ ] Memory > 85%
- [ ] Disk > 90%
```

---

## 6. Checklist de Manutenção Semanal

```markdown
## Manutenção Semanal

### Segunda-feira
- [ ] Review de erros do fim de semana
- [ ] Verificar alertas do monitoring
- [ ] Update de dependências de segurança

### Terça-feira
- [ ] Processar PRs de dependências
- [ ] Smoke tests em staging
- [ ] Review de logs de aplicação

### Quarta-feira
- [ ] Database maintenance (vacuum, analyze)
- [ ] Review de performance
- [ ] Backup verification

### Quinta-feira
- [ ] Documentação atualizada
- [ ] Runbooks revisados
- [ ] Alertas revisados

### Sexta-feira
- [ ] Sweep de issues abertas
- [ ] Planning para próxima semana
- [ ] Compliance check
```

---

## 7. Referências

| Recurso | URL |
|---------|-----|
| Sentry Docs | https://docs.sentry.io/ |
| Supabase Backups | https://supabase.com/docs/guides/platform/backups |
| Prometheus | https://prometheus.io/docs/ |
| Runbooks | https://www.runbooks.dev/ |

---

**Versão:** 1.0.0
**Última atualização:** 2024-01-15
**Responsável:** Claude Code
