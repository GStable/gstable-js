import { GStableError } from '../errors'
import {
  GStableCommonError,
  GStablePlatformError,
  isCommonErrorCode,
  isPlatformErrorCode,
} from './common-platform'
import { GStableProductError, isProductErrorCode } from './product'

/**
 * 根据官方错误码构造对应的 {@link GStableError} 子类（商品 / 通用与验证 / 平台），供 HTTP 层与各资源统一使用。
 * @see https://docs.gstable.io/zh-Hans/docs/api/overview/errors
 */
export function createTypedApiError(code: number, message: string): GStableError {
  if (isProductErrorCode(code)) {
    return new GStableProductError(code, message)
  }
  if (isCommonErrorCode(code)) {
    return new GStableCommonError(code, message)
  }
  if (isPlatformErrorCode(code)) {
    return new GStablePlatformError(code, message)
  }
  return new GStableError(code, message)
}
