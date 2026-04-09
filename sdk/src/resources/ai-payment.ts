import type { GStableHttp } from '../http'
import type {
  AiPaymentSession,
  CreatePaymentSessionBody,
  CreatePaymentSessionResult,
  PreparePaymentBody,
  PreparePaymentResult,
} from '../types/ai-payment'

/**
 * AI Payment Protocol（EIP-712 签名由调用方生成后传入）
 * @see https://docs.gstable.io/zh-Hans/docs/api/ai-payment/create-session
 * @see https://docs.gstable.io/zh-Hans/docs/api/ai-payment/get-session
 * @see https://docs.gstable.io/zh-Hans/docs/api/ai-payment/prepare-payment
 */
export class AiPaymentResource {
  constructor(private readonly http: GStableHttp) {}

  /** POST /payment/session/create */
  createSession(body: CreatePaymentSessionBody): Promise<CreatePaymentSessionResult> {
    return this.http.requestJson<CreatePaymentSessionResult>(
      'POST',
      '/payment/session/create',
      body,
    )
  }

  /**
   * GET /session/:sessionId
   * 与核心 `checkoutSession.detail` 同路径；本方法按 AI 文档将 data 解析为含 `aiView` 的扁平结构。
   */
  getSession(sessionId: string): Promise<AiPaymentSession> {
    const id = encodeURIComponent(sessionId)
    return this.http.requestJson<AiPaymentSession>('GET', `/session/${id}`)
  }

  /** POST /payment/prepare */
  preparePayment(body: PreparePaymentBody): Promise<PreparePaymentResult> {
    return this.http.requestJson<PreparePaymentResult>('POST', '/payment/prepare', body)
  }
}
