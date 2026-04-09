/**
 * 示例：分页列出商品（GET /product/list/:page/:size）
 *
 * 在仓库根目录运行：
 *   export GSTABLE_API_KEY="sk_live_xxx"
 *   node examples/product/product-list.mjs
 *
 * 可选分页（默认第 1 页、每页 10 条，size 最大 100）：
 *   GSTABLE_PAGE=2 GSTABLE_PAGE_SIZE=20 node examples/product/product-list.mjs
 *
 * 调试：
 *   GSTABLE_DEBUG=1 node examples/product/product-list.mjs
 *
 * @see https://docs.gstable.io/zh-Hans/docs/api/core-api/product
 */
import { createProductClient, exitOnSdkError } from './product-example-common.mjs'

const page = Math.max(1, Number(process.env.GSTABLE_PAGE) || 1)
const size = Math.min(100, Math.max(1, Number(process.env.GSTABLE_PAGE_SIZE) || 10))

const client = createProductClient()

try {
  const data = await client.product.list(page, size)
  console.log(`total=${data.total} page=${data.page} size=${data.size}`)
  console.log(JSON.stringify(data.products, null, 2))
} catch (e) {
  exitOnSdkError(e)
}
