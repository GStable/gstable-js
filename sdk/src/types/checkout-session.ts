import type { ProductAttribute } from './product'
import type { PaymentLinkLineItemProductData } from './payment-link'

/** 手续费：1 商户承担（默认），2 用户承担 */
export type CheckoutSessionFeeModel = 1 | 2

/** 会话生命周期状态 */
export type CheckoutSessionStatus =
  | 'initialized'
  | 'paid'
  | 'settling'
  | 'completed'
  | 'settlement_pending'
  | 'expired'
  | 'cancelled'
  | string

/** one_time 行项目在请求中的商品描述 */
export interface OneTimeProductDataInput {
  productName: string
  productDescription?: string
  imageUrl?: string
  attributes?: ProductAttribute[]
}

/** POST /session/checkout/create 的 lineItems 元素 */
export type CheckoutLineItemInput =
  | {
      itemType: 'product'
      productId: string
      quantity: number
      unitPrice: number
    }
  | {
      itemType: 'one_time'
      quantity: number
      unitPrice: number
      productData: OneTimeProductDataInput
    }

/** POST /session/checkout/create */
export interface CreateCheckoutSessionBody {
  accountId: string
  settlementToken: string
  lineItems: CheckoutLineItemInput[]
  successUrl?: string
  /** 1 必填邮箱，0 选填 */
  payerEmailRequired?: number
  feeModel?: CheckoutSessionFeeModel
  /** 过期 Unix 时间戳（秒）；默认约当前 +30 分钟，最小间隔 1800 秒 */
  expirationTime?: number
  metadata?: Record<string, unknown>
}

/** 响应中的单行项目 */
export interface CheckoutLineItem {
  lineItemId?: string
  itemType: string
  productId: string
  quantity: number
  unitPrice: number
  productData?: PaymentLinkLineItemProductData
}

export interface CheckoutLineItemsSection {
  items: CheckoutLineItem[]
}

/**
 * Checkout Session（创建接口返回或嵌于查询结果 session 内）
 * @see https://docs.gstable.io/zh-Hans/docs/api/core-api/checkout-session
 */
export interface CheckoutSession {
  sessionId: string
  sessionType: string
  businessId: string
  businessType: string
  clientCode: string
  payer: string
  payerEmail: string
  payerEmailRequired: number
  paidToken: string
  receiptId: string
  recipient: string
  settlementToken: string
  feeModel: CheckoutSessionFeeModel
  amount: number
  lineItems: CheckoutLineItemsSection
  expirationTime: number
  successUrl?: string
  paymentUrl: string
  signedOnce: number
  initiateTx: string
  completeTx: string
  paymentSucceededTime: string | null
  settlementSucceededTime: string | null
  createAt: string
  status: CheckoutSessionStatus
  metadata?: Record<string, unknown>
}

/** GET /session/:sessionId 等接口中的链上交易摘要 */
export interface SessionTransaction {
  orderId: string
  channelId: string
  orderType: number
  from: string
  to: string
  metaData: string
  totalValue: number
  paymentValue: number
  feeValue: number
  netValue: number
  sourceTx: string
  targetTx: string
  executeTime: string
  finalizeTime: string
}

/** GET /session/:sessionId 的 data */
export interface SessionDetail {
  session: CheckoutSession
  transaction?: SessionTransaction
}

/** 会话列表单项 */
export interface SessionListEntry {
  session: CheckoutSession
  transaction?: SessionTransaction
}

/** GET /session/list/... 的 data（文档示例中 page/size 为数字） */
export interface CheckoutSessionListData {
  total: number
  page: number
  size: number
  sessions: SessionListEntry[]
}
