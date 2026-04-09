/**
 * 示例：按 ID 批量查询商品（POST /product/list/by/ids）
 * 不存在的 id 会被接口静默忽略。
 *
 * 在仓库根目录运行：
 *   export GSTABLE_API_KEY="sk_live_xxx"
 *   export GSTABLE_PRODUCT_IDS="prd_a,prd_b"
 *   node examples/product/product-list-by-ids.mjs
 *
 * 也可传入单个 id：
 *   GSTABLE_PRODUCT_IDS="prd_xxx" node examples/product/product-list-by-ids.mjs
 *
 * @see https://docs.gstable.io/zh-Hans/docs/api/core-api/product
 */
import { createProductClient, exitOnSdkError } from './product-example-common.mjs'

const raw = process.env.GSTABLE_PRODUCT_IDS?.trim()
if (!raw) {
  console.error('请设置 GSTABLE_PRODUCT_IDS，逗号分隔多个 productId，例如：prd_xxx,prd_yyy')
  process.exit(1)
}

const productIds = raw
  .split(/[,，]/)
  .map((s) => s.trim())
  .filter(Boolean)

if (productIds.length === 0) {
  console.error('GSTABLE_PRODUCT_IDS 解析后为空')
  process.exit(1)
}

const client = createProductClient()

try {
  const products = await client.product.listByIds({ productIds })
  console.log(`请求 ${productIds.length} 个 id，返回 ${products.length} 条`)
  console.log(JSON.stringify(products, null, 2))
} catch (e) {
  exitOnSdkError(e)
}
