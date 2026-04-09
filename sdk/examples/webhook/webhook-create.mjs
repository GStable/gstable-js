/**
 * 示例：创建 Webhook POST /webhook/create
 * 成功后请保存响应中的 key（验签用）。
 *
 * 在仓库根目录：
 *   export GSTABLE_API_KEY="sk_live_xxx"
 *   export GSTABLE_WEBHOOK_URL="https://api.yoursite.com/webhooks/gstable"
 *   node examples/webhook/webhook-create.mjs
 *
 * 可选：
 *   GSTABLE_WEBHOOK_NAME="生产接收端"
 *   GSTABLE_WEBHOOK_DESCRIPTION="说明"
 *   GSTABLE_SUBSCRIBED_EVENTS="session.paid,session.completed"
 */
import {
  createWebhookClient,
  exitOnSdkError,
  parseSubscribedEvents,
} from './webhook-example-common.mjs'

const webhookUrl = process.env.GSTABLE_WEBHOOK_URL?.trim()
if (!webhookUrl) {
  console.error('请设置 GSTABLE_WEBHOOK_URL（须为 HTTPS）')
  process.exit(1)
}

const webhookName =
  process.env.GSTABLE_WEBHOOK_NAME?.trim() ||
  `SDK Webhook ${new Date().toISOString().slice(0, 19)}`

const subscribedEvents = parseSubscribedEvents(
  process.env.GSTABLE_SUBSCRIBED_EVENTS,
  'session.paid,session.completed',
)
if (subscribedEvents.length === 0) {
  console.error('至少需要一个订阅事件')
  process.exit(1)
}

const body = {
  webhookName,
  webhookUrl,
  subscribedEvents,
}

if (process.env.GSTABLE_WEBHOOK_DESCRIPTION?.trim()) {
  body.webhookDescription = process.env.GSTABLE_WEBHOOK_DESCRIPTION.trim()
}

const client = createWebhookClient()

try {
  const created = await client.webhook.create(body)
  console.log(JSON.stringify(created, null, 2))
} catch (e) {
  exitOnSdkError(e)
}
