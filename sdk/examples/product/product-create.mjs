/**
 * 示例：创建商品（需 Node >= 18）
 *
 * 在仓库根目录运行：
 *   export GSTABLE_API_KEY="sk_live_xxx"
 *   node examples/product/product-create.mjs
 *
 * 调试（打印 URL 与请求头，含 Authorization，勿泄露日志）：
 *   GSTABLE_DEBUG=1 node examples/product/product-create.mjs
 *
 * 同目录其它示例：product-list.mjs、product-list-by-ids.mjs、product-update.mjs、
 * product-archive-unarchive.mjs、product-remove.mjs
 *
 * 依赖编译产物 ../../dist，修改 src/ 后请先：npm run build
 */
import { createProductClient, exitOnSdkError } from './product-example-common.mjs'

const client = createProductClient()

/** commonPrices 为 Micro-USD：1_000_000 = $1.00 */
const body = {
  name: `SDK 示例商品 ${new Date().toISOString().slice(0, 19)}`,
  description: '由 examples/product/product-create.mjs 创建',
  commonPrices: [1_000_000, 2_000_000],
  imageUrl: 'https://dashboard.gstable.io/assets/logo-BvFuUg_A.png',
  attributes: [{ name: '来源', value: 'GStable-SDK examples/product/product-create.mjs' }],
}

try {
  const product = await client.product.create(body)
  console.log(JSON.stringify(product, null, 2))
} catch (e) {
  exitOnSdkError(e)
}
