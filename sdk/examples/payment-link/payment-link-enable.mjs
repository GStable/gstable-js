/**
 * 示例：启用支付链接 POST /payment/link/enable
 *
 * 在仓库根目录：
 *   export GSTABLE_API_KEY="sk_live_xxx"
 *   export GSTABLE_LINK_ID="lnk_xxx"
 *   node examples/payment-link/payment-link-enable.mjs
 *
 * @see https://docs.gstable.io/zh-Hans/docs/api/core-api/payment-link
 */
import { createPaymentLinkClient, exitOnSdkError } from './payment-link-example-common.mjs'

const linkId = process.env.GSTABLE_LINK_ID?.trim()
if (!linkId) {
  console.error('请设置 GSTABLE_LINK_ID')
  process.exit(1)
}

const client = createPaymentLinkClient()

try {
  const result = await client.paymentLink.enable(linkId)
  console.log(JSON.stringify(result, null, 2))
} catch (e) {
  exitOnSdkError(e)
}
