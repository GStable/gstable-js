/** 商品状态 */
export type ProductStatus = 'active' | 'archived'

/** 自定义属性（如尺码、颜色） */
export interface ProductAttribute {
  name: string
  value: string
}

/** 商品对象（文档字段） */
export interface Product {
  productId: string
  name: string
  description?: string
  imageUrl?: string
  status: ProductStatus
  /** Micro-USD，如 1000000 = $1.00 */
  commonPrices: number[]
  attributes?: ProductAttribute[]
  /** 列表接口可能返回 */
  createAt?: string
}

/** POST /product/create */
export interface CreateProductBody {
  name: string
  commonPrices: number[]
  description?: string
  imageUrl?: string
  attributes?: ProductAttribute[]
}

/** POST /product/update（全量替换） */
export interface UpdateProductBody {
  productId: string
  name: string
  description?: string
  imageUrl?: string
  attributes?: ProductAttribute[]
  commonPrices: number[]
}

/** GET /product/list/:page/:size */
export interface ProductListData {
  total: number
  page: string
  size: string
  products: Product[]
}

/** POST /product/list/by/ids */
export interface ProductListByIdsBody {
  productIds: string[]
}

/** 仅含 success 的 data */
export interface OperationSuccess {
  success: boolean
}
