/**
 * 示例：分页列出支付链接 GET /payment/link/list/:page/:size
 *
 * 在仓库根目录：
 *   export GSTABLE_API_KEY="sk_live_xxx"
 *   node examples/payment-link/payment-link-list.mjs
 *
 * 分页：
 *   GSTABLE_PAGE=2 GSTABLE_PAGE_SIZE=20 node examples/payment-link/payment-link-list.mjs
 *
 * 调试：GSTABLE_DEBUG=1 node examples/payment-link/payment-link-list.mjs
 *
 * @see https://docs.gstable.io/zh-Hans/docs/api/core-api/payment-link
 */
import { createPaymentLinkClient, exitOnSdkError } from './payment-link-example-common.mjs'

const page = Math.max(1, Number(process.env.GSTABLE_PAGE) || 1)
const size = Math.min(100, Math.max(1, Number(process.env.GSTABLE_PAGE_SIZE) || 10))

const client = createPaymentLinkClient()

try {
  const data = await client.paymentLink.list(page, size)
  console.log(`total=${data.total} page=${data.page} size=${data.size}`)
  console.log(JSON.stringify(data.links, null, 2))
} catch (e) {
  exitOnSdkError(e)
}
