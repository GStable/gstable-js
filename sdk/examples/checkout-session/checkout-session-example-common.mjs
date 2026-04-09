/**
 * Checkout Session examples 共用：客户端、错误处理
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

export function createCheckoutSessionClient() {
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
