/**
 * 示例：刷新签名密钥 POST /webhook/key/refresh
 * 旧 key 立即失效，请同步更新服务端验签配置。
 *
 *   export GSTABLE_API_KEY="sk_live_xxx"
 *   export GSTABLE_WEBHOOK_ID="wkid_xxx"
 *   export GSTABLE_CONFIRM_REFRESH_KEY=yes
 *   node examples/webhook/webhook-refresh-key.mjs
 *
 * @see https://docs.gstable.io/zh-Hans/docs/api/core-api/webhook-management
 */
import { createWebhookClient, exitOnSdkError } from './webhook-example-common.mjs'

const webhookId = process.env.GSTABLE_WEBHOOK_ID?.trim()
if (!webhookId) {
  console.error('请设置 GSTABLE_WEBHOOK_ID')
  process.exit(1)
}

if (process.env.GSTABLE_CONFIRM_REFRESH_KEY !== 'yes') {
  console.error(
    '刷新后旧密钥立即失效。确认请设置 GSTABLE_CONFIRM_REFRESH_KEY=yes',
  )
  process.exit(1)
}

const client = createWebhookClient()

try {
  const result = await client.webhook.refreshKey(webhookId)
  console.log(JSON.stringify(result, null, 2))
  console.log(
    '提示：若线上接口在 data 中返回新 key，请以实际响应为准；SDK 当前将 refresh 响应类型定为 OperationSuccess。',
  )
} catch (e) {
  exitOnSdkError(e)
}
