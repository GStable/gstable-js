import type { GStableHttp } from '../http'
import type { OperationSuccess } from '../types/product'
import type {
  CreatePaymentLinkBody,
  PaymentLink,
  PaymentLinkListData,
  UpdatePaymentLinkBody,
} from '../types/payment-link'

/**
 * 支付链接模块 API
 * @see https://docs.gstable.io/zh-Hans/docs/api/core-api/payment-link
 */
export class PaymentLinkResource {
  constructor(private readonly http: GStableHttp) {}

  /** POST /payment/link/create */
  create(body: CreatePaymentLinkBody): Promise<PaymentLink> {
    return this.http.requestJson<PaymentLink>('POST', '/payment/link/create', body)
  }

  /** POST /payment/link/update（全量替换） */
  update(body: UpdatePaymentLinkBody): Promise<OperationSuccess> {
    return this.http.requestJson<OperationSuccess>('POST', '/payment/link/update', body)
  }

  /** POST /payment/link/disable */
  disable(linkId: string): Promise<OperationSuccess> {
    return this.http.requestJson<OperationSuccess>('POST', '/payment/link/disable', {
      linkId,
    })
  }

  /** POST /payment/link/enable */
  enable(linkId: string): Promise<OperationSuccess> {
    return this.http.requestJson<OperationSuccess>('POST', '/payment/link/enable', {
      linkId,
    })
  }

  /** GET /payment/link/:linkId */
  detail(linkId: string): Promise<PaymentLink> {
    const id = encodeURIComponent(linkId)
    return this.http.requestJson<PaymentLink>('GET', `/payment/link/${id}`)
  }

  /**
   * GET /payment/link/list/:page/:size
   * @param page 从 1 开始
   */
  list(page: number, size: number): Promise<PaymentLinkListData> {
    const p = encodeURIComponent(String(page))
    const s = encodeURIComponent(String(size))
    return this.http.requestJson<PaymentLinkListData>(
      'GET',
      `/payment/link/list/${p}/${s}`,
    )
  }
}
