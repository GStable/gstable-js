/**
 * Webhook examples 共用
 * 依赖：项目根目录 dist/（在仓库根执行 npm run build）
 */
import {
  GStableClient,
  GStableError,
  GStableProductError,
} from '../../dist/index.js'

export function requireApiKey() {
  const key = process.env.GSTABLE_API_KEY
  if (!key?.trim()) {
    console.error('请设置环境变量 GSTABLE_API_KEY')
    process.exit(1)
  }
  return key.trim()
}

export function createWebhookClient() {
  return new GStableClient({ apiKey: requireApiKey() })
}

export function exitOnSdkError(e) {
  if (e instanceof GStableProductError) {
    console.error(
      `[GStableProductError] productErrorCode=${e.productErrorCode} code=${e.code}\n${e.message}`,
    )
  } else if (e instanceof GStableError) {
    console.error(`[GStableError] code=${e.code}\n${e.message}`)
  } else {
    console.error(e)
  }
  process.exit(1)
}

/** 逗号分隔事件名，默认文档常用组合 */
export function parseSubscribedEvents(envValue, fallbackCsv) {
  const raw = envValue?.trim() || fallbackCsv
  return raw
    .split(/[,，]/)
    .map((s) => s.trim())
    .filter(Boolean)
}
