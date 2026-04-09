/**
 * 示例：按状态分页查询会话列表（/session/list/...）
 *
 * 在仓库根目录：
 *   export GSTABLE_API_KEY="sk_live_xxx"
 *   node examples/checkout-session/checkout-session-list.mjs
 *
 * 筛选（默认 all）：
 *   GSTABLE_LIST_FILTER=all|paid|settling|completed|cancelled|settlement_pending
 *
 * 分页：
 *   GSTABLE_PAGE=1 GSTABLE_PAGE_SIZE=10
 *
 * 调试：GSTABLE_DEBUG=1 node examples/checkout-session/checkout-session-list.mjs
 *
 * @see https://docs.gstable.io/zh-Hans/docs/api/core-api/checkout-session
 */
import { createCheckoutSessionClient, exitOnSdkError } from './checkout-session-example-common.mjs'

const filter = (process.env.GSTABLE_LIST_FILTER || 'all').trim().toLowerCase().replace(/-/g, '_')
const page = Math.max(1, Number(process.env.GSTABLE_PAGE) || 1)
const size = Math.min(100, Math.max(1, Number(process.env.GSTABLE_PAGE_SIZE) || 10))

const client = createCheckoutSessionClient()

const runners = {
  all: () => client.checkoutSession.listAll(page, size),
  paid: () => client.checkoutSession.listPaid(page, size),
  settling: () => client.checkoutSession.listSettling(page, size),
  completed: () => client.checkoutSession.listCompleted(page, size),
  cancelled: () => client.checkoutSession.listCancelled(page, size),
  settlement_pending: () => client.checkoutSession.listSettlementPending(page, size),
}

const run = runners[filter]
if (!run) {
  console.error(
    `未知 GSTABLE_LIST_FILTER=${filter}，可选：${Object.keys(runners).join(', ')}`,
  )
  process.exit(1)
}

try {
  const data = await run()
  console.log(`filter=${filter} total=${data.total} page=${data.page} size=${data.size}`)
  console.log(JSON.stringify(data.sessions, null, 2))
} catch (e) {
  exitOnSdkError(e)
}
