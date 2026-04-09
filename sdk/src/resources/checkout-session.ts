import type { GStableHttp } from '../http'
import type {
  CheckoutSession,
  CheckoutSessionListData,
  CreateCheckoutSessionBody,
  SessionDetail,
} from '../types/checkout-session'
import type { OperationSuccess } from '../types/product'

/**
 * 支付会话（Checkout Session）API
 */
export class CheckoutSessionResource {
  constructor(private readonly http: GStableHttp) {}

  /** POST /session/checkout/create */
  create(body: CreateCheckoutSessionBody): Promise<CheckoutSession> {
    return this.http.requestJson<CheckoutSession>('POST', '/session/checkout/create', body)
  }

  /** POST /session/checkout/cancel（仅 initialized 且 signedOnce = 0） */
  cancel(sessionId: string): Promise<OperationSuccess> {
    return this.http.requestJson<OperationSuccess>('POST', '/session/checkout/cancel', {
      sessionId,
    })
  }

  /** GET /session/:sessionId — Checkout 与 Payment Link 会话均可查 */
  detail(sessionId: string): Promise<SessionDetail> {
    const id = encodeURIComponent(sessionId)
    return this.http.requestJson<SessionDetail>('GET', `/session/${id}`)
  }

  private listByPath(path: string, page: number, size: number): Promise<CheckoutSessionListData> {
    const p = encodeURIComponent(String(page))
    const s = encodeURIComponent(String(size))
    return this.http.requestJson<CheckoutSessionListData>('GET', `${path}/${p}/${s}`)
  }

  /** GET /session/list/all/:page/:size */
  listAll(page: number, size: number): Promise<CheckoutSessionListData> {
    return this.listByPath('/session/list/all', page, size)
  }

  /** GET /session/list/paid/:page/:size */
  listPaid(page: number, size: number): Promise<CheckoutSessionListData> {
    return this.listByPath('/session/list/paid', page, size)
  }

  /** GET /session/list/settling/:page/:size */
  listSettling(page: number, size: number): Promise<CheckoutSessionListData> {
    return this.listByPath('/session/list/settling', page, size)
  }

  /** GET /session/list/completed/:page/:size */
  listCompleted(page: number, size: number): Promise<CheckoutSessionListData> {
    return this.listByPath('/session/list/completed', page, size)
  }

  /** GET /session/list/cancelled/:page/:size */
  listCancelled(page: number, size: number): Promise<CheckoutSessionListData> {
    return this.listByPath('/session/list/cancelled', page, size)
  }

  /** GET /session/list/settlement/pending/:page/:size */
  listSettlementPending(page: number, size: number): Promise<CheckoutSessionListData> {
    return this.listByPath('/session/list/settlement/pending', page, size)
  }
}
