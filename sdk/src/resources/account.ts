import type { GStableHttp } from '../http'
import type { Account } from '../types/account'

/**
 * 账户模块 API（只读；创建/修改须在 Dashboard 完成）
 * @see https://docs.gstable.io/zh-Hans/docs/api/core-api/account
 */
export class AccountResource {
  constructor(private readonly http: GStableHttp) {}

  /** GET /account/detail/:accountId */
  detail(accountId: string): Promise<Account> {
    const id = encodeURIComponent(accountId)
    return this.http.requestJson<Account>('GET', `/account/detail/${id}`)
  }

  /** GET /account/list — 全量返回，无分页（单商户最多 20 个账户） */
  list(): Promise<Account[]> {
    return this.http.requestJson<Account[]>('GET', '/account/list')
  }
}
