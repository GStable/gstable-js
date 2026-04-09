/** Webhook 状态：活跃 / 用户禁用 / 投递失败自动暂停 */
export type WebhookStatus = 'active' | 'inactive' | 'paused' | string

/**
 * Webhook 对象
 * @see https://docs.gstable.io/zh-Hans/docs/api/core-api/webhook-management
 */
export interface Webhook {
  webhookId: string
  webhookName: string
  webhookUrl: string
  webhookDescription?: string
  subscribedEvents: string[]
  /** 签名密钥，创建后返回；验签见 Webhook 事件文档 */
  key: string
  status: WebhookStatus
  createAt?: string
  updateAt?: string
}

/** POST /webhook/create */
export interface CreateWebhookBody {
  webhookName: string
  webhookUrl: string
  subscribedEvents: string[]
  webhookDescription?: string
}

/** POST /webhook/update（全量替换） */
export interface UpdateWebhookBody {
  webhookId: string
  webhookName: string
  webhookUrl: string
  subscribedEvents: string[]
  webhookDescription?: string
}

/** GET /webhook/list 的 data */
export interface WebhookListData {
  webhooks: Webhook[]
}
