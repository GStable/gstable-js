import type { GStableHttp } from '../http'
import type { OperationSuccess } from '../types/product'
import type {
  CreateWebhookBody,
  UpdateWebhookBody,
  Webhook,
  WebhookListData,
} from '../types/webhook'

/**
 * Webhook 管理 API（单账户最多 10 个端点）
 */
export class WebhookResource {
  constructor(private readonly http: GStableHttp) {}

  /** POST /webhook/create */
  create(body: CreateWebhookBody): Promise<Webhook> {
    return this.http.requestJson<Webhook>('POST', '/webhook/create', body)
  }

  /** POST /webhook/update（全量替换） */
  update(body: UpdateWebhookBody): Promise<OperationSuccess> {
    return this.http.requestJson<OperationSuccess>('POST', '/webhook/update', body)
  }

  /** GET /webhook/list — 全量，无分页 */
  list(): Promise<WebhookListData> {
    return this.http.requestJson<WebhookListData>('GET', '/webhook/list')
  }

  /** GET /webhook/detail/:webhookId */
  detail(webhookId: string): Promise<Webhook> {
    const id = encodeURIComponent(webhookId)
    return this.http.requestJson<Webhook>('GET', `/webhook/detail/${id}`)
  }

  /** POST /webhook/disable */
  disable(webhookId: string): Promise<OperationSuccess> {
    return this.http.requestJson<OperationSuccess>('POST', '/webhook/disable', {
      webhookId,
    })
  }

  /** POST /webhook/enable（含从 paused 恢复） */
  enable(webhookId: string): Promise<OperationSuccess> {
    return this.http.requestJson<OperationSuccess>('POST', '/webhook/enable', {
      webhookId,
    })
  }

  /** POST /webhook/key/refresh — 旧 key 立即失效 */
  refreshKey(webhookId: string): Promise<OperationSuccess> {
    return this.http.requestJson<OperationSuccess>('POST', '/webhook/key/refresh', {
      webhookId,
    })
  }

  /** POST /webhook/remove */
  remove(webhookId: string): Promise<OperationSuccess> {
    return this.http.requestJson<OperationSuccess>('POST', '/webhook/remove', {
      webhookId,
    })
  }
}
