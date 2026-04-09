/**
 * 示例：全量更新商品（POST /product/update）
 *
 * 运行前需有已知 productId。可先运行本目录 product-list.mjs 或 product-create.mjs 拿到 id。
 *
 * 在仓库根目录：
 *   export GSTABLE_API_KEY="sk_live_xxx"
 *   export GSTABLE_PRODUCT_ID="prd_xxx"
 *   node examples/product/product-update.mjs
 *
 * 可选覆盖名称/价格（Micro-USD，逗号分隔多个价格）：
 *   GSTABLE_PRODUCT_NAME="新名称" GSTABLE_COMMON_PRICES="1000000,2000000" node examples/product/product-update.mjs
 *
 * @see https://docs.gstable.io/zh-Hans/docs/api/core-api/product
 */
import { createProductClient, exitOnSdkError } from './product-example-common.mjs'

const productId = process.env.GSTABLE_PRODUCT_ID?.trim()
if (!productId) {
  console.error('请设置 GSTABLE_PRODUCT_ID')
  process.exit(1)
}

const client = createProductClient()

/** 默认：先拉列表里取该商品当前字段太难，这里用 env 拼全量 update 体；未设置名称则加时间戳后缀 */
const name =
  process.env.GSTABLE_PRODUCT_NAME?.trim() ||
  `SDK update ${new Date().toISOString().slice(0, 19)}`

let commonPrices
const pricesRaw = process.env.GSTABLE_COMMON_PRICES?.trim()
if (pricesRaw) {
  commonPrices = pricesRaw.split(/[,，]/).map((s) => Number(s.trim()))
  if (commonPrices.some((n) => !Number.isFinite(n))) {
    console.error('GSTABLE_COMMON_PRICES 需为数字，逗号分隔')
    process.exit(1)
  }
} else {
  commonPrices = [1_000_000, 3_000_000]
}

const body = {
  productId,
  name,
  description:
    process.env.GSTABLE_PRODUCT_DESCRIPTION?.trim() ||
    '由 examples/product/product-update.mjs 更新',
  imageUrl:
    process.env.GSTABLE_PRODUCT_IMAGE_URL?.trim() ||
    'https://dashboard.gstable.io/assets/logo-BvFuUg_A.png',
  attributes: [
    { name: '来源', value: 'GStable-SDK examples/product/product-update.mjs' },
    { name: '更新于', value: new Date().toISOString() },
  ],
  commonPrices,
}

try {
  const result = await client.product.update(body)
  console.log(JSON.stringify(result, null, 2))
} catch (e) {
  exitOnSdkError(e)
}
