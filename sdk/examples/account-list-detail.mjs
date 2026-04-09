/**
 * 示例：查询账户列表与账户详情（只读；创建/修改账户须在 Dashboard 完成）
 *
 * 运行：
 *   export GSTABLE_API_KEY="sk_live_xxx"
 *   node examples/account-list-detail.mjs
 *
 * 指定查看某一账户详情（可选）：
 *   export GSTABLE_ACCOUNT_ID="acc_xxx"
 *   node examples/account-list-detail.mjs
 *
 * 调试（打印 URL 与请求头，含 Authorization，勿泄露日志）：
 *   GSTABLE_DEBUG=1 node examples/account-list-detail.mjs
 *
 * 依赖编译产物 ../dist，修改 src/ 后请先：npm run build
 *
 * @see https://docs.gstable.io/zh-Hans/docs/api/core-api/account
 */
import { GStableClient, GStableError } from '../dist/index.js'

const key = process.env.GSTABLE_API_KEY
if (!key) {
  console.error('请设置环境变量 GSTABLE_API_KEY')
  process.exit(1)
}

const client = new GStableClient({ apiKey: key })

try {
  const accounts = await client.account.list()
  console.log('账户列表 (%d 个):', accounts.length)
  console.log(JSON.stringify(accounts, null, 2))

  const explicitId = process.env.GSTABLE_ACCOUNT_ID?.trim()
  const detailId = explicitId || accounts[0]?.accountId

  if (!detailId) {
    console.log('\n无可用 accountId，跳过详情查询（可设置 GSTABLE_ACCOUNT_ID）')
    process.exit(0)
  }

  if (!explicitId && accounts[0]?.accountId) {
    console.log('\n未设置 GSTABLE_ACCOUNT_ID，使用列表第一项查询详情：', detailId)
  }

  const account = await client.account.detail(detailId)
  console.log('\n账户详情:')
  console.log(JSON.stringify(account, null, 2))
} catch (e) {
  if (e instanceof GStableError) {
    console.error(`[GStableError] code=${e.code}\n${e.message}`)
  } else {
    console.error(e)
  }
  process.exit(1)
}
