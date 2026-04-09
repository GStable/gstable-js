import type { GStableHttp } from '../http'
import type { PaymentCapabilities } from '../types/capability'

/**
 * 公共「支付能力」查询（无需鉴权，使用 public Base URL）
 * @see https://docs.gstable.io/zh-Hans/docs/api/overview/supported-assets#%E6%9F%A5%E8%AF%A2%E8%83%BD%E5%8A%9B-api
 */
export class CapabilityResource {
  constructor(private readonly http: GStableHttp) {}

  /** GET /capabilities/all */
  all(): Promise<PaymentCapabilities> {
    return this.http.requestPublicJson<PaymentCapabilities>('GET', '/capabilities/all')
  }
}
