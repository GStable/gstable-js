/**
 * 支持的结算/支付代币条目
 * @see https://docs.gstable.io/zh-Hans/docs/api/overview/supported-assets#%E6%9F%A5%E8%AF%A2%E8%83%BD%E5%8A%9B-api
 */
export interface SupportedToken {
  tokenId: string
  symbol: string
  chainId: string
  decimals: number
}

/** 单条支付路径（费率与限额） */
export interface PaymentCapabilityRoute {
  tokenId: string
  crosschain: boolean
  feeRatePPM: number
  minPaymentValue: number
  maxPaymentValue: number
}

/**
 * 支付能力矩阵：结算 tokenId -> 路由分组键（如 POL、ARB、ETH）-> 可选支付路径
 */
export type PaymentCapabilitiesMatrix = Record<string, Record<string, PaymentCapabilityRoute[]>>

/** GET /capabilities/all 返回的 data */
export interface PaymentCapabilities {
  supportedTokens: SupportedToken[]
  paymentCapabilities: PaymentCapabilitiesMatrix
}
