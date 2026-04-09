/**
 * 示例：取消 Checkout Session POST /session/checkout/cancel
 * 仅 status=initialized 且 signedOnce=0 时可取消。
 *
 * 在仓库根目录：
 *   export GSTABLE_API_KEY="sk_live_xxx"
 *   export GSTABLE_SESSION_ID="sess_xxx"
 *   node examples/checkout-session/checkout-session-cancel.mjs
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
  const result = await client.checkoutSession.cancel(sessionId)
  console.log(JSON.stringify(result, null, 2))
} catch (e) {
  exitOnSdkError(e)
}
