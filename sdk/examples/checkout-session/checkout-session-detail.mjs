/**
 * 示例：会话详情（对账）GET /session/:sessionId
 * 返回 session 与可选 transaction。
 *
 * 在仓库根目录：
 *   export GSTABLE_API_KEY="sk_live_xxx"
 *   export GSTABLE_SESSION_ID="sess_xxx"
 *   node examples/checkout-session/checkout-session-detail.mjs
 *
 * @see https://docs.gstable.io/zh-Hans/docs/api/core-api/checkout-session
 */
import { createCheckoutSessionClient, exitOnSdkError } from './checkout-session-example-common.mjs'

const sessionId = process.env.GSTABLE_SESSION_ID?.trim()
if (!sessionId) {
  console.error('请设置 GSTABLE_SESSION_ID')
  process.exit(1)
}

const client = createCheckoutSessionClient()

try {
  const detail = await client.checkoutSession.detail(sessionId)
  console.log(JSON.stringify(detail, null, 2))
} catch (e) {
  exitOnSdkError(e)
}
