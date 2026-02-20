---
## PARA CLAUDE (AI INSTRUCTIONS)

Este protocolo é invocado pelo comando `*workflow` no CLAUDE.md.
Execute conforme as regras definidas no CLAUDE.md e em COMUNICACAO.md.
---

# Protocolo de Workflows (*workflow)

## Quando Usar

- Automatizar tarefas repetitivas
- Criar pipelines de CI/CD
- Configurar deploy automático
- Sincronizar dados entre sistemas
- Agendar tarefas (cron jobs)

---

## GitHub Actions

### Estrutura Básica

```yaml
# .github/workflows/main.yml
name: Nome do Workflow

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout código
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Instalar dependências
        run: npm ci

      - name: Rodar testes
        run: npm test

      - name: Build
        run: npm run build
```

### Workflows Comuns

#### CI - Teste e Build

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - run: npm ci
      - run: npm run lint
      - run: npm test
      - run: npm run build

    env:
      NODE_ENV: test
```

#### Deploy Vercel

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

#### Deploy Supabase

```yaml
# .github/workflows/supabase.yml
name: Supabase Deploy

on:
  push:
    branches: [main]
    paths:
      - 'supabase/migrations/**'

jobs:
  migrate:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: supabase/setup-cli@v1

      - name: Link project
        run: supabase link --project-ref ${{ secrets.SUPABASE_PROJECT_REF }}
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}

      - name: Push migrations
        run: supabase db push
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
```

#### Lint e Type Check

```yaml
# .github/workflows/check.yml
name: Check

on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint

  typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run typecheck
```

### Secrets do GitHub

```
Configurar em: repo → Settings → Secrets → Actions

Secrets comuns:
- VERCEL_TOKEN
- VERCEL_ORG_ID
- VERCEL_PROJECT_ID
- SUPABASE_ACCESS_TOKEN
- SUPABASE_PROJECT_REF
- DATABASE_URL
```

---

## Cron Jobs

### GitHub Actions Schedule

```yaml
# .github/workflows/cron.yml
name: Tarefa Diária

on:
  schedule:
    # Todo dia às 6h UTC (3h Brasília)
    - cron: '0 6 * * *'

jobs:
  task:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: node scripts/daily-task.js
```

### Sintaxe Cron

```
┌───────────── minuto (0-59)
│ ┌───────────── hora (0-23)
│ │ ┌───────────── dia do mês (1-31)
│ │ │ ┌───────────── mês (1-12)
│ │ │ │ ┌───────────── dia da semana (0-6) (0=Domingo)
│ │ │ │ │
* * * * *

Exemplos:
"0 6 * * *"     → Todo dia às 6:00
"0 */6 * * *"   → A cada 6 horas
"0 0 * * 0"     → Todo domingo à meia-noite
"0 0 1 * *"     → Primeiro dia de cada mês
```

---

## Supabase Edge Functions

### Criar Function

```bash
# Criar nova function
supabase functions new nome-da-function

# Estrutura criada:
# supabase/functions/nome-da-function/index.ts
```

### Template de Function

```typescript
// supabase/functions/hello/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

serve(async (req) => {
  const { name } = await req.json()

  const data = {
    message: `Olá, ${name}!`,
    timestamp: new Date().toISOString()
  }

  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' }
  })
})
```

### Function com Supabase Client

```typescript
// supabase/functions/get-user/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const { userId } = await req.json()

  const { data, error } = await supabase
    .from('usuarios')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' }
  })
})
```

### Deploy de Function

```bash
# Deploy de uma function específica
supabase functions deploy nome-da-function

# Deploy com secrets
supabase secrets set API_KEY=xxx
```

### Chamar Function

```typescript
// No frontend
const { data, error } = await supabase.functions.invoke('hello', {
  body: { name: 'João' }
})
```

---

## Webhooks

### Configurar Webhook

```typescript
// app/api/webhooks/stripe/route.ts
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    return new Response('Webhook Error', { status: 400 })
  }

  // Processar evento
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object
      // Atualizar banco, enviar email, etc
      break

    case 'invoice.paid':
      // Pagamento confirmado
      break

    case 'customer.subscription.deleted':
      // Cancelar acesso
      break
  }

  return new Response('OK', { status: 200 })
}
```

### Webhooks Comuns

```
Stripe:     /api/webhooks/stripe
GitHub:     /api/webhooks/github
Supabase:   /api/webhooks/supabase
Slack:      /api/webhooks/slack
```

---

## Automações Úteis

### Backup Automático

```yaml
# .github/workflows/backup.yml
name: Database Backup

on:
  schedule:
    - cron: '0 2 * * *' # Todo dia às 2h UTC

jobs:
  backup:
    runs-on: ubuntu-latest
    steps:
      - name: Dump database
        run: |
          pg_dump $DATABASE_URL > backup.sql
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}

      - name: Upload to S3
        run: |
          aws s3 cp backup.sql s3://my-bucket/backups/$(date +%Y-%m-%d).sql
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

### Notificação de Deploy

```yaml
# .github/workflows/notify.yml
name: Notify Deploy

on:
  workflow_run:
    workflows: ['Deploy']
    types: [completed]

jobs:
  notify:
    if: ${{ github.event.workflow_run.conclusion == 'success' }}
    runs-on: ubuntu-latest
    steps:
      - name: Slack Notification
        uses: slackapi/slack-github-action@v1
        with:
          payload: |
            {
              "text": "Deploy realizado com sucesso!",
              "blocks": [
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": ":rocket: *Deploy concluído*\nBranch: ${{ github.ref }}"
                  }
                }
              ]
            }
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

### Limpeza de Branches

```yaml
# .github/workflows/cleanup.yml
name: Cleanup Merged Branches

on:
  pull_request:
    types: [closed]

jobs:
  cleanup:
    if: github.event.pull_request.merged == true
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Delete merged branch
        run: |
          git push origin --delete ${{ github.head_ref }}
```

---

## Checklist de Workflow

### Antes de criar:

```
□ Defini o objetivo do workflow
□ Sei quando deve rodar (trigger)
□ Preparei os secrets necessários
□ Testei localmente (se possível)
```

### Ao configurar:

```
□ Secrets configurados no GitHub
□ Workflow file commitado
□ Workflow aparece na aba Actions
□ Testei com push ou trigger manual
```

### Manutenção:

```
□ Monitore falhas
□ Atualize actions periodicamente
□ Revise secrets quando necessário
```

---

## Troubleshooting

### Workflow não roda

```
1. Verificar se o arquivo está em .github/workflows/
2. Verificar sintaxe do YAML (indentação!)
3. Verificar se o branch está correto no 'on'
4. Verificar logs na aba Actions
```

### Secrets não funcionam

```
1. Nome exato (case-sensitive)
2. Configurado no repositório correto
3. Não usar em forks
```

### Falha no deploy

```
1. Verificar logs completos
2. Testar comandos localmente
3. Verificar se variáveis de ambiente estão corretas
4. Verificar permissões do token
```

---

## Resumo para Iniciantes

| Termo | Significado |
|-------|-------------|
| Workflow | Sequência automática de tarefas |
| Trigger | O que dispara o workflow (push, schedule) |
| Job | Grupo de steps que rodam juntos |
| Step | Uma tarefa individual |
| Secret | Senha/token guardado com segurança |
| Cron | Agendamento de horários |

**Lembre-se:** Automatize tarefas repetitivas. Se você faz a mesma coisa mais de 3 vezes, deveria ser um workflow.
