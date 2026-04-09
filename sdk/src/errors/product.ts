import { GStableError } from '../errors'

/**
 * 商品管理业务错误码（1003XX）
 * @see https://docs.gstable.io/zh-Hans/docs/api/overview/errors#%E5%95%86%E5%93%81%E7%AE%A1%E7%90%86-1003xx
 */
export const ProductErrorCodes = {
  /** 指定的 Product ID 不存在 */
  NOT_FOUND: 100301,
  /** 批量操作中部分商品 ID 不存在 */
  PARTIAL_MISSING: 100302,
  /** 批量操作中部分商品状态不可用 */
  PARTIALLY_UNAVAILABLE: 100303,
  /** 商品未处于激活状态，无法用于创建链接或会话 */
  NOT_ACTIVE: 100304,
  /** 商品已被关联使用，无法执行某些特定修改 */
  HAS_BEEN_USED: 100305,
  /** 商品已被逻辑删除 */
  HAS_BEEN_REMOVED: 100306,
} as const

export type ProductErrorCode = (typeof ProductErrorCodes)[keyof typeof ProductErrorCodes]

const PRODUCT_ERROR_CODE_SET: ReadonlySet<number> = new Set<number>(
  Object.values(ProductErrorCodes) as ProductErrorCode[],
)

/** 文档中的英文 message，仅作展示参考；业务判断请使用 {@link ProductErrorCodes} */
export const ProductErrorMessages: Record<ProductErrorCode, string> = {
  [ProductErrorCodes.NOT_FOUND]: 'Product not found',
  [ProductErrorCodes.PARTIAL_MISSING]: 'Product partial missing',
  [ProductErrorCodes.PARTIALLY_UNAVAILABLE]: 'Product partially unavailable',
  [ProductErrorCodes.NOT_ACTIVE]: 'Product is not active',
  [ProductErrorCodes.HAS_BEEN_USED]: 'Product has been used',
  [ProductErrorCodes.HAS_BEEN_REMOVED]: 'Product has been removed',
}

export function isProductErrorCode(code: number): code is ProductErrorCode {
  return PRODUCT_ERROR_CODE_SET.has(code)
}

/**
 * 商品模块 API 返回 1003XX 时的专用异常，可通过 `instanceof` 与 `productErrorCode` 分支处理。
 * 请依据 `code` / `productErrorCode` 编写逻辑，勿依赖 `message` 文案。
 */
export class GStableProductError extends GStableError {
  readonly productErrorCode: ProductErrorCode

  constructor(code: ProductErrorCode, message: string) {
    super(code, message)
    this.name = 'GStableProductError'
    this.productErrorCode = code
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

export function isGStableProductError(e: unknown): e is GStableProductError {
  return e instanceof GStableProductError
}

/** 将 {@link GStableError} 中属于商品业务码的异常转为 {@link GStableProductError}，其它值原样返回 */
export function rewriteProductBusinessError(error: unknown): unknown {
  if (error instanceof GStableProductError) {
    return error
  }
  if (error instanceof GStableError && isProductErrorCode(error.code)) {
    return new GStableProductError(error.code, error.message)
  }
  return error
}
