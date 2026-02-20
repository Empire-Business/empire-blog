import { createClient } from '@/lib/supabase/server'

interface WebhookPayload {
  event: string
  data: Record<string, unknown>
  timestamp: string
}

interface WebhookConfig {
  id: string
  url: string
  secret: string | null
  events: string[]
}

export async function getActiveWebhooks(event: string): Promise<WebhookConfig[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('webhooks')
    .select('id, url, secret, events')
    .eq('is_active', true)

  if (error || !data) return []

  // Filter webhooks that listen to this event
  return data.filter((webhook) => webhook.events.includes(event))
}

export async function dispatchWebhook(
  event: string,
  data: Record<string, unknown>
): Promise<void> {
  const webhooks = await getActiveWebhooks(event)

  if (webhooks.length === 0) return

  const payload: WebhookPayload = {
    event,
    data,
    timestamp: new Date().toISOString(),
  }

  // Dispatch to all webhooks in parallel
  await Promise.allSettled(
    webhooks.map(async (webhook) => {
      try {
        const response = await fetch(webhook.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(webhook.secret && {
              'X-Webhook-Secret': webhook.secret,
              'X-Webhook-Signature': await generateSignature(payload, webhook.secret),
            }),
          },
          body: JSON.stringify(payload),
        })

        // Log the delivery
        await logDelivery(webhook.id, event, response.ok, response.status)
      } catch (error) {
        // Log failed delivery
        await logDelivery(
          webhook.id,
          event,
          false,
          0,
          error instanceof Error ? error.message : 'Unknown error'
        )
      }
    })
  )
}

async function generateSignature(
  payload: WebhookPayload,
  secret: string
): Promise<string> {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )

  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(JSON.stringify(payload))
  )

  // Convert to hex string instead of base64
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

async function logDelivery(
  webhookId: string,
  event: string,
  success: boolean,
  statusCode: number,
  error?: string
): Promise<void> {
  // For now, just console log. In production, you'd store this in a webhook_logs table
  console.log({
    webhookId,
    event,
    success,
    statusCode,
    error,
    timestamp: new Date().toISOString(),
  })
}
