/**
 * AI Payment Protocol — 支付会话 / 准备支付
 * @see https://docs.gstable.io/zh-Hans/docs/api/ai-payment/create-session
 * @see https://docs.gstable.io/zh-Hans/docs/api/ai-payment/get-session
 * @see https://docs.gstable.io/zh-Hans/docs/api/ai-payment/prepare-payment
 */

/** EIP-712 消息：创建支付会话 */
export interface CreatePaymentSessionMessage {
  purpose: 'create_payment_session'
  linkId: string
  linkVersion: string
  merchantId: string
  payer: string
  paymentChainId: string
  paymentToken: string
  amount: string
  authorizationNonce: string
  authorizationExpiresAt: string
}

/** POST /payment/session/create */
export interface CreatePaymentSessionBody {
  message: CreatePaymentSessionMessage
  signature: string
}

/** AI 视图（文档结构可能随协议扩展，字段按需收窄） */
export interface AiPaymentView {
  pricingModel?: { type: string }
  workflow?: {
    stage: string
    nextAction?: {
      action: string
      authorizationRequired?: boolean
      description?: string
    }
  }
  preparePaymentRequirement?: unknown
  paymentExecutionGuide?: unknown
  completePaymentSessionGuide?: unknown
}

/** POST /payment/session/create 返回的 data */
export interface CreatePaymentSessionResult {
  sessionId: string
  sessionType: string
  sessionExpiresAt: number
  aiView: AiPaymentView
}

/**
 * GET /session/:sessionId — AI 流程下的会话详情（扁平结构，含 aiView）。
 * 与核心 API 会话查询共用路径；若需 `session`/`transaction` 对账结构请使用 `checkoutSession.detail`。
 */
export interface AiPaymentSession {
  sessionId: string
  sessionType: string
  lineItems?: unknown[]
  aiView: AiPaymentView
}

/** EIP-712 消息：准备支付 */
export interface PreparePaymentMessage {
  purpose: 'prepare_payment'
  sessionId: string
  merchantId: string
  payer: string
  payerEmail: string
  paymentChainId: string
  paymentToken: string
  authorizationNonce: string
  authorizationExpiresAt: string
}

/** POST /payment/prepare */
export interface PreparePaymentBody {
  message: PreparePaymentMessage
  signature: string
}

/** POST /payment/prepare 返回的 data */
export interface PreparePaymentResult {
  calldata: string
  aiView: AiPaymentView
}
