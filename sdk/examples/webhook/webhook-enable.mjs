/**
 * 示例：启用 Webhook POST /webhook/enable（含从 paused 恢复）
 *
 *   export GSTABLE_API_KEY="sk_live_xxx"
 *   export GSTABLE_WEBHOOK_ID="wkid_xxx"
 *   node examples/webhook/webhook-enable.mjs
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
  const result = await client.webhook.enable(webhookId)
  console.log(JSON.stringify(result, null, 2))
} catch (e) {
  exitOnSdkError(e)
}
