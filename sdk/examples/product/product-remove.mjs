/**
 * 示例：删除商品（POST /product/remove）
 * 仅未被任何 Payment Link 引用过的商品可删；操作不可逆。
 *
 * 在仓库根目录：
 *   export GSTABLE_API_KEY="sk_live_xxx"
 *   export GSTABLE_PRODUCT_ID="prd_xxx"
 *   export GSTABLE_CONFIRM_REMOVE=yes
 *   node examples/product/product-remove.mjs
 *
 * @see https://docs.gstable.io/zh-Hans/docs/api/core-api/product
 */
import { createProductClient, exitOnSdkError } from './product-example-common.mjs'

const productId = process.env.GSTABLE_PRODUCT_ID?.trim()
if (!productId) {
  console.error('请设置 GSTABLE_PRODUCT_ID')
  process.exit(1)
}

if (process.env.GSTABLE_CONFIRM_REMOVE !== 'yes') {
  console.error(
    '删除不可逆。若确认删除，请设置 GSTABLE_CONFIRM_REMOVE=yes 后重试。',
  )
  process.exit(1)
}

const client = createProductClient()

try {
  const result = await client.product.remove(productId)
  console.log(JSON.stringify(result, null, 2))
} catch (e) {
  exitOnSdkError(e)
}
