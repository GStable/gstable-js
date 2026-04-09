/**
 * 示例：Webhook 全量列表 GET /webhook/list（无分页，单账户最多 10 个）
 *
 * 在仓库根目录：
 *   export GSTABLE_API_KEY="sk_live_xxx"
 *   node examples/webhook/webhook-list.mjs
 *
 * @see https://docs.gstable.io/zh-Hans/docs/api/core-api/webhook-management
 */
import { createWebhookClient, exitOnSdkError } from './webhook-example-common.mjs'

const client = createWebhookClient()

try {
  const data = await client.webhook.list()
  console.log(`共 ${data.webhooks.length} 个`)
  console.log(JSON.stringify(data.webhooks, null, 2))
} catch (e) {
  exitOnSdkError(e)
}
