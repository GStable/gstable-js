/**
 * 示例：归档商品再取消归档（POST /product/archive、/product/unarchive）
 *
 * 在仓库根目录：
 *   export GSTABLE_API_KEY="sk_live_xxx"
 *   export GSTABLE_PRODUCT_ID="prd_xxx"
 *   node examples/product/product-archive-unarchive.mjs
 *
 * 若只想执行其中一步：
 *   GSTABLE_ARCHIVE_ONLY=1 node examples/product/product-archive-unarchive.mjs
 *   GSTABLE_UNARCHIVE_ONLY=1 node examples/product/product-archive-unarchive.mjs
 *
 * @see https://docs.gstable.io/zh-Hans/docs/api/core-api/product
 */
import { createProductClient, exitOnSdkError } from './product-example-common.mjs'

const productId = process.env.GSTABLE_PRODUCT_ID?.trim()
if (!productId) {
  console.error('请设置 GSTABLE_PRODUCT_ID')
  process.exit(1)
}

const archiveOnly = process.env.GSTABLE_ARCHIVE_ONLY === '1'
const unarchiveOnly = process.env.GSTABLE_UNARCHIVE_ONLY === '1'

if (archiveOnly && unarchiveOnly) {
  console.error('不能同时设置 GSTABLE_ARCHIVE_ONLY 与 GSTABLE_UNARCHIVE_ONLY')
  process.exit(1)
}

const client = createProductClient()

try {
  if (!unarchiveOnly) {
    console.log('archive…')
    const a = await client.product.archive(productId)
    console.log(JSON.stringify(a, null, 2))
  }

  if (!archiveOnly) {
    console.log('unarchive…')
    const u = await client.product.unarchive(productId)
    console.log(JSON.stringify(u, null, 2))
  }
} catch (e) {
  exitOnSdkError(e)
}
