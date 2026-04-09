/**
 * 示例：Webhook 详情 GET /webhook/detail/:webhookId
 *
 * 在仓库根目录：
 *   export GSTABLE_API_KEY="sk_live_xxx"
 *   export GSTABLE_WEBHOOK_ID="wkid_xxx"
 *   node examples/webhook/webhook-detail.mjs
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
  const w = await client.webhook.detail(webhookId)
  console.log(JSON.stringify(w, null, 2))
} catch (e) {
  exitOnSdkError(e)
}
