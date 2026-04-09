/**
 * 示例：禁用 Webhook POST /webhook/disable
 *
 *   export GSTABLE_API_KEY="sk_live_xxx"
 *   export GSTABLE_WEBHOOK_ID="wkid_xxx"
 *   node examples/webhook/webhook-disable.mjs
 *
 * @see https://docs.gstable.io/zh-Hans/docs/api/core-api/webhook-management
 */
import { createWebhookClient, exitOnSdkError } from './webhook-example-common.mjs'

const webhookId = process.env.GSTABLE_WEBHOOK_ID?.trim()
if (!webhookId) {
  console.error('请设置 GSTABLE_WEBHOOK_ID')
  process.exit(1)
}

const client = createWebhookClient()

try {
  const result = await client.webhook.disable(webhookId)
  console.log(JSON.stringify(result, null, 2))
} catch (e) {
  exitOnSdkError(e)
}
