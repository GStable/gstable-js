/**
 * 示例：全量更新支付链接 POST /payment/link/update
 * 先拉取详情，将 lineItems 映射为请求体，再用环境变量覆盖部分字段。
 *
 * 在仓库根目录：
 *   export GSTABLE_API_KEY="sk_live_xxx"
 *   export GSTABLE_LINK_ID="lnk_xxx"
 *   node examples/payment-link/payment-link-update.mjs
 *
 * 可选覆盖：
 *   GSTABLE_LINK_NAME="新名称"
 *   GSTABLE_FEE_MODEL=1|2
 *   GSTABLE_SETTLEMENT_TOKEN=polygon::usdc
 *   GSTABLE_SUCCESS_URL=...
 *   GSTABLE_PAYER_EMAIL_REQUIRED=0|1
 *   GSTABLE_CUSTOM_SUCCESS_TEXT=...
 *   GSTABLE_CUSTOM_DISABLED_TEXT=...
 *
 * @see https://docs.gstable.io/zh-Hans/docs/api/core-api/payment-link
 */
import {
  createPaymentLinkClient,
  exitOnSdkError,
  lineItemsInputFromPaymentLink,
} from './payment-link-example-common.mjs'

const linkId = process.env.GSTABLE_LINK_ID?.trim()
if (!linkId) {
  console.error('请设置 GSTABLE_LINK_ID')
  process.exit(1)
}

const client = createPaymentLinkClient()

try {
  const current = await client.paymentLink.detail(linkId)
  const lineItems = lineItemsInputFromPaymentLink(current)

  const feeModel = process.env.GSTABLE_FEE_MODEL
  const body = {
    linkId,
    linkType: current.linkType,
    linkName:
      process.env.GSTABLE_LINK_NAME?.trim() || current.linkName,
    accountId: current.accountId,
    settlementToken:
      process.env.GSTABLE_SETTLEMENT_TOKEN?.trim() || current.settlementToken,
    feeModel:
      feeModel === '2' ? 2 : feeModel === '1' ? 1 : current.feeModel,
    lineItems,
    payerEmailRequired:
      process.env.GSTABLE_PAYER_EMAIL_REQUIRED === '1'
        ? 1
        : process.env.GSTABLE_PAYER_EMAIL_REQUIRED === '0'
          ? 0
          : (current.payerEmailRequired ?? 0),
    successUrl:
      process.env.GSTABLE_SUCCESS_URL !== undefined
        ? process.env.GSTABLE_SUCCESS_URL.trim()
        : current.successUrl,
    customSuccessText:
      process.env.GSTABLE_CUSTOM_SUCCESS_TEXT !== undefined
        ? process.env.GSTABLE_CUSTOM_SUCCESS_TEXT.trim()
        : current.customSuccessText,
    customDisabledText:
      process.env.GSTABLE_CUSTOM_DISABLED_TEXT !== undefined
        ? process.env.GSTABLE_CUSTOM_DISABLED_TEXT.trim()
        : current.customDisabledText,
  }

  if (body.successUrl === '') delete body.successUrl
  if (body.customSuccessText === '') delete body.customSuccessText
  if (body.customDisabledText === '') delete body.customDisabledText

  const result = await client.paymentLink.update(body)
  console.log(JSON.stringify(result, null, 2))
} catch (e) {
  exitOnSdkError(e)
}
