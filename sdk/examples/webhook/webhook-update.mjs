/**
 * 示例：全量更新 Webhook POST /webhook/update
 * 先拉 detail，再用环境变量覆盖部分字段后提交。
 *
 * 在仓库根目录：
 *   export GSTABLE_API_KEY="sk_live_xxx"
 *   export GSTABLE_WEBHOOK_ID="wkid_xxx"
 *   node examples/webhook/webhook-update.mjs
 *
 * 可选覆盖：
 *   GSTABLE_WEBHOOK_NAME
 *   GSTABLE_WEBHOOK_URL
 *   GSTABLE_WEBHOOK_DESCRIPTION（设为空字符串可清空描述）
 *   GSTABLE_SUBSCRIBED_EVENTS="session.paid"
 *
 * @see https://docs.gstable.io/zh-Hans/docs/api/core-api/webhook-management
 */
import {
  createWebhookClient,
  exitOnSdkError,
  parseSubscribedEvents,
} from './webhook-example-common.mjs'

const webhookId = process.env.GSTABLE_WEBHOOK_ID?.trim()
if (!webhookId) {
  console.error('请设置 GSTABLE_WEBHOOK_ID')
  process.exit(1)
}

const client = createWebhookClient()

try {
  const current = await client.webhook.detail(webhookId)

  const eventsRaw = process.env.GSTABLE_SUBSCRIBED_EVENTS
  const subscribedEvents = eventsRaw
    ? parseSubscribedEvents(eventsRaw, '')
    : current.subscribedEvents

  if (!subscribedEvents.length) {
    console.error('subscribedEvents 不能为空（未设置 GSTABLE_SUBSCRIBED_EVENTS 时沿用详情原值）')
    process.exit(1)
  }

  const descEnv = process.env.GSTABLE_WEBHOOK_DESCRIPTION
  const body = {
    webhookId,
    webhookName:
      process.env.GSTABLE_WEBHOOK_NAME?.trim() ?? current.webhookName,
    webhookUrl:
      process.env.GSTABLE_WEBHOOK_URL?.trim() ?? current.webhookUrl,
    subscribedEvents,
    webhookDescription:
      descEnv !== undefined ? descEnv.trim() : current.webhookDescription,
  }

  const result = await client.webhook.update(body)
  console.log(JSON.stringify(result, null, 2))
} catch (e) {
  exitOnSdkError(e)
}
