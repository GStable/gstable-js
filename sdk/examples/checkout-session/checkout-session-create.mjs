/**
 * 示例：创建 Checkout Session POST /session/checkout/create
 *（一次性收银台；行项目示例为库存商品 product）
 *
 * 在仓库根目录：
 *   export GSTABLE_API_KEY="sk_live_xxx"
 *   export GSTABLE_ACCOUNT_ID="acc_xxx"
 *   export GSTABLE_PRODUCT_ID="prd_xxx"
 *   node examples/checkout-session/checkout-session-create.mjs
 *
 * 可选：
 *   GSTABLE_SETTLEMENT_TOKEN=polygon::usdc
 *   GSTABLE_FEE_MODEL=1|2
 *   GSTABLE_LINE_QUANTITY=1
 *   GSTABLE_UNIT_PRICE=1000000
 *   GSTABLE_SUCCESS_URL=https://example.com/success
 *   GSTABLE_PAYER_EMAIL_REQUIRED=0|1
 *   GSTABLE_EXPIRATION_TIME=1735689600
 *
 * @see https://docs.gstable.io/zh-Hans/docs/api/core-api/checkout-session
 */
import { createCheckoutSessionClient, exitOnSdkError } from './checkout-session-example-common.mjs'

const accountId = process.env.GSTABLE_ACCOUNT_ID?.trim()
const productId = process.env.GSTABLE_PRODUCT_ID?.trim()
if (!accountId || !productId) {
  console.error('请设置 GSTABLE_ACCOUNT_ID 与 GSTABLE_PRODUCT_ID')
  process.exit(1)
}

const settlementToken =
  process.env.GSTABLE_SETTLEMENT_TOKEN?.trim() || 'polygon::usdc'
const feeModel = Number(process.env.GSTABLE_FEE_MODEL) === 2 ? 2 : 1
const quantity = Math.max(1, Number(process.env.GSTABLE_LINE_QUANTITY) || 1)
const unitPrice = Number(process.env.GSTABLE_UNIT_PRICE) || 1_000_000

const body = {
  accountId,
  settlementToken,
  lineItems: [
    {
      itemType: 'product',
      productId,
      quantity,
      unitPrice,
    },
  ],
  feeModel,
}

if (process.env.GSTABLE_SUCCESS_URL?.trim()) {
  body.successUrl = process.env.GSTABLE_SUCCESS_URL.trim()
}

const perRaw = process.env.GSTABLE_PAYER_EMAIL_REQUIRED
if (perRaw === '0' || perRaw === '1') {
  body.payerEmailRequired = Number(perRaw)
}

const exp = process.env.GSTABLE_EXPIRATION_TIME?.trim()
if (exp) {
  const t = Number(exp)
  if (!Number.isFinite(t)) {
    console.error('GSTABLE_EXPIRATION_TIME 须为 Unix 秒时间戳数字')
    process.exit(1)
  }
  body.expirationTime = t
}

if (process.env.GSTABLE_SESSION_METADATA_JSON?.trim()) {
  try {
    body.metadata = JSON.parse(process.env.GSTABLE_SESSION_METADATA_JSON.trim())
  } catch {
    console.error('GSTABLE_SESSION_METADATA_JSON 须为合法 JSON')
    process.exit(1)
  }
}

const client = createCheckoutSessionClient()

try {
  const session = await client.checkoutSession.create(body)
  console.log(JSON.stringify(session, null, 2))
} catch (e) {
  exitOnSdkError(e)
}
