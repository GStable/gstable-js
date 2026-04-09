import { GStableError } from '../errors'

/**
 * 通用与验证错误（400XXX）
 * @see https://docs.gstable.io/zh-Hans/docs/api/overview/errors#4-%E9%80%9A%E7%94%A8%E4%B8%8E%E9%AA%8C%E8%AF%81%E9%94%99%E8%AF%AF-common
 */
export const CommonErrorCodes = {
  INVALID_FIELD_FORMAT: 400101,
  UNSUPPORTED_CURRENCY: 400201,
  UNSUPPORTED_CHANNEL: 400202,
  SETTLEMENT_CAPABILITIES_NOT_FOUND: 400203,
  STAT_NOT_FOUND: 400301,
} as const

export type CommonErrorCode = (typeof CommonErrorCodes)[keyof typeof CommonErrorCodes]

const COMMON_ERROR_CODE_SET: ReadonlySet<number> = new Set<number>(
  Object.values(CommonErrorCodes) as CommonErrorCode[],
)

export const CommonErrorMessages: Record<CommonErrorCode, string> = {
  [CommonErrorCodes.INVALID_FIELD_FORMAT]: 'Invalid field format',
  [CommonErrorCodes.UNSUPPORTED_CURRENCY]: 'Unsupported currency',
  [CommonErrorCodes.UNSUPPORTED_CHANNEL]: 'Unsupported channel',
  [CommonErrorCodes.SETTLEMENT_CAPABILITIES_NOT_FOUND]: 'Settlement capabilities not found',
  [CommonErrorCodes.STAT_NOT_FOUND]: 'Stat not found',
}

export function isCommonErrorCode(code: number): code is CommonErrorCode {
  return COMMON_ERROR_CODE_SET.has(code)
}

export class GStableCommonError extends GStableError {
  readonly commonErrorCode: CommonErrorCode

  constructor(code: CommonErrorCode, message: string) {
    super(code, message)
    this.name = 'GStableCommonError'
    this.commonErrorCode = code
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

export function isGStableCommonError(e: unknown): e is GStableCommonError {
  return e instanceof GStableCommonError
}

/**
 * 平台系统错误（900XXX / 999999）
 * @see https://docs.gstable.io/zh-Hans/docs/api/overview/errors#5-%E5%B9%B3%E5%8F%B0%E7%B3%BB%E7%BB%9F%E9%94%99%E8%AF%AF-platform
 */
export const PlatformErrorCodes = {
  TOO_MANY_REQUESTS: 900101,
  FAILED_TO_CREATE_RECORD: 900201,
  FAILED_TO_UPDATE_RECORD: 900202,
  FAILED_TO_QUERY_RECORD: 900203,
  IMAGE_PROCESSING_FAILED: 900301,
  INTERNAL_SYSTEM_ERROR: 999999,
} as const

export type PlatformErrorCode = (typeof PlatformErrorCodes)[keyof typeof PlatformErrorCodes]

const PLATFORM_ERROR_CODE_SET: ReadonlySet<number> = new Set<number>(
  Object.values(PlatformErrorCodes) as PlatformErrorCode[],
)

export const PlatformErrorMessages: Record<PlatformErrorCode, string> = {
  [PlatformErrorCodes.TOO_MANY_REQUESTS]: 'Too many requests',
  [PlatformErrorCodes.FAILED_TO_CREATE_RECORD]: 'Failed to create record',
  [PlatformErrorCodes.FAILED_TO_UPDATE_RECORD]: 'Failed to update record',
  [PlatformErrorCodes.FAILED_TO_QUERY_RECORD]: 'Failed to query record',
  [PlatformErrorCodes.IMAGE_PROCESSING_FAILED]: 'Image processing failed',
  [PlatformErrorCodes.INTERNAL_SYSTEM_ERROR]: 'Internal system error',
}

export function isPlatformErrorCode(code: number): code is PlatformErrorCode {
  return PLATFORM_ERROR_CODE_SET.has(code)
}

export class GStablePlatformError extends GStableError {
  readonly platformErrorCode: PlatformErrorCode

  constructor(code: PlatformErrorCode, message: string) {
    super(code, message)
    this.name = 'GStablePlatformError'
    this.platformErrorCode = code
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

export function isGStablePlatformError(e: unknown): e is GStablePlatformError {
  return e instanceof GStablePlatformError
}
