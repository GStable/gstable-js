import { rewriteProductBusinessError } from '../errors/product'
import type { GStableHttp } from '../http'
import type {
  CreateProductBody,
  OperationSuccess,
  Product,
  ProductListByIdsBody,
  ProductListData,
  UpdateProductBody,
} from '../types/product'

/**
 * 商品模块 API
 * @see https://docs.gstable.io/zh-Hans/docs/api/core-api/product
 *
 * 商品业务错误码 100301–100306 会抛出 `GStableProductError`（仍为 `GStableError` 子类），
 * @see https://docs.gstable.io/zh-Hans/docs/api/overview/errors#%E5%95%86%E5%93%81%E7%AE%A1%E7%90%86-1003xx
 */
export class ProductResource {
  constructor(private readonly http: GStableHttp) {}

  private async invoke<T>(operation: () => Promise<T>): Promise<T> {
    try {
      return await operation()
    } catch (e) {
      throw rewriteProductBusinessError(e)
    }
  }

  /** POST /product/create */
  create(body: CreateProductBody): Promise<Product> {
    return this.invoke(() =>
      this.http.requestJson<Product>('POST', '/product/create', body),
    )
  }

  /** POST /product/update（全量替换） */
  update(body: UpdateProductBody): Promise<OperationSuccess> {
    return this.invoke(() =>
      this.http.requestJson<OperationSuccess>('POST', '/product/update', body),
    )
  }

  /**
   * GET /product/list/:page/:size
   * @param page 从 1 开始
   * @param size 每页条数，最大 100
   */
  list(page: number, size: number): Promise<ProductListData> {
    const p = encodeURIComponent(String(page))
    const s = encodeURIComponent(String(size))
    return this.invoke(() =>
      this.http.requestJson<ProductListData>('GET', `/product/list/${p}/${s}`),
    )
  }

  /** POST /product/list/by/ids — 不存在的 id 会被静默忽略 */
  listByIds(body: ProductListByIdsBody): Promise<Product[]> {
    return this.invoke(() =>
      this.http.requestJson<Product[]>('POST', '/product/list/by/ids', body),
    )
  }

  /** POST /product/archive */
  archive(productId: string): Promise<OperationSuccess> {
    return this.invoke(() =>
      this.http.requestJson<OperationSuccess>('POST', '/product/archive', {
        productId,
      }),
    )
  }

  /** POST /product/unarchive */
  unarchive(productId: string): Promise<OperationSuccess> {
    return this.invoke(() =>
      this.http.requestJson<OperationSuccess>('POST', '/product/unarchive', {
        productId,
      }),
    )
  }

  /** POST /product/remove — 仅未被任何 Payment Link 引用过的商品可删 */
  remove(productId: string): Promise<OperationSuccess> {
    return this.invoke(() =>
      this.http.requestJson<OperationSuccess>('POST', '/product/remove', {
        productId,
      }),
    )
  }
}
