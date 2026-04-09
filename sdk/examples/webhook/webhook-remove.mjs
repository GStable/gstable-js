/**
 * 示例：删除 Webhook POST /webhook/remove（不可逆）
 *
 *   export GSTABLE_API_KEY="sk_live_xxx"
 *   export GSTABLE_WEBHOOK_ID="wkid_xxx"
 *   export GSTABLE_CONFIRM_REMOVE=yes
 *   node examples/webhook/webhook-remove.mjs
 *
 * @see https://docs.gstable.io/zh-Hans/docs/api/core-api/webhook-management
 */
import { createWebhookClient, exitOnSdkError } from './webhook-example-common.mjs'

const webhookId = process.env.GSTABLE_WEBHOOK_ID?.trim()
if (!webhookId) {
  console.error('请设置 GSTABLE_WEBHOOK_ID')
  process.exit(1)
}

if (process.env.GSTABLE_CONFIRM_REMOVE !== 'yes') {
  console.error('删除不可逆。确认请设置 GSTABLE_CONFIRM_REMOVE=yes')
  process.exit(1)
}

const client = createWebhookClient()

try {
  const result = await client.webhook.remove(webhookId)
  console.log(JSON.stringify(result, null, 2))
} catch (e) {
  exitOnSdkError(e)
}
