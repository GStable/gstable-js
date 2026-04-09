/**
 * 示例：创建支付链接 POST /payment/link/create（固定金额 + 库存商品）
 *
 * 在仓库根目录：
 *   export GSTABLE_API_KEY="sk_live_xxx"
 *   export GSTABLE_ACCOUNT_ID="acc_xxx"
 *   export GSTABLE_PRODUCT_ID="prd_xxx"
 *   node examples/payment-link/payment-link-create.mjs
 *
 * 可选：
 *   GSTABLE_SETTLEMENT_TOKEN=polygon::usdt
 *   GSTABLE_LINK_NAME="我的收款链接"
 *   GSTABLE_FEE_MODEL=1|2
 *   GSTABLE_UNIT_PRICE=1000000
 *   GSTABLE_LINE_QUANTITY=1
 *   GSTABLE_SUCCESS_URL=https://example.com/ok
 *   GSTABLE_PAYER_EMAIL_REQUIRED=0|1
 *
 * custom + user_priced 请自行改脚本或调 API；文档见官方支付链接页。
 *
 * @see https://docs.gstable.io/zh-Hans/docs/api/core-api/payment-link
 */
import { createPaymentLinkClient, exitOnSdkError } from './payment-link-example-common.mjs'

const accountId = process.env.GSTABLE_ACCOUNT_ID?.trim()
const productId = process.env.GSTABLE_PRODUCT_ID?.trim()
if (!accountId || !productId) {
  console.error('请设置 GSTABLE_ACCOUNT_ID 与 GSTABLE_PRODUCT_ID')
  process.exit(1)
}

const settlementToken =
  process.env.GSTABLE_SETTLEMENT_TOKEN?.trim() || 'polygon::usdt'
const linkName =
  process.env.GSTABLE_LINK_NAME?.trim() ||
  `SDK 支付链接 ${new Date().toISOString().slice(0, 19)}`
const feeModel = Number(process.env.GSTABLE_FEE_MODEL) === 2 ? 2 : 1
const unitPrice = Number(process.env.GSTABLE_UNIT_PRICE) || 1_000_000
const quantity = Math.max(1, Number(process.env.GSTABLE_LINE_QUANTITY) || 1)

const payerEmailRaw = process.env.GSTABLE_PAYER_EMAIL_REQUIRED
const payerEmailRequired =
  payerEmailRaw === '1' || payerEmailRaw === '0' ? Number(payerEmailRaw) : 0

const body = {
  linkType: 'fixed',
  linkName,
  accountId,
  settlementToken,
  feeModel,
  payerEmailRequired,
  lineItems: [
    {
      itemType: 'product',
      productId,
      quantity,
      unitPrice,
    },
  ],
}

if (process.env.GSTABLE_SUCCESS_URL?.trim()) {
  body.successUrl = process.env.GSTABLE_SUCCESS_URL.trim()
}
if (process.env.GSTABLE_CUSTOM_SUCCESS_TEXT?.trim()) {
  body.customSuccessText = process.env.GSTABLE_CUSTOM_SUCCESS_TEXT.trim()
}
if (process.env.GSTABLE_CUSTOM_DISABLED_TEXT?.trim()) {
  body.customDisabledText = process.env.GSTABLE_CUSTOM_DISABLED_TEXT.trim()
}

const client = createPaymentLinkClient()

try {
  const link = await client.paymentLink.create(body)
  console.log(JSON.stringify(link, null, 2))
} catch (e) {
  exitOnSdkError(e)
}
