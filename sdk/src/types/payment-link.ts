import type { ProductAttribute, ProductStatus } from './product'

/** 链接类型：固定金额 / 自定义金额（捐赠等） */
export type PaymentLinkType = 'fixed' | 'custom'

/** 手续费模型：1 收款方承担，2 付款方承担 */
export type PaymentLinkFeeModel = 1 | 2

/** 链接状态（文档示例含 active） */
export type PaymentLinkStatus = 'active' | string

/** 请求体中的行项目 */
export type PaymentLinkLineItemInput =
  | {
      itemType: 'product'
      productId: string
      quantity: number
      /** Micro 单位，须 > 0 */
      unitPrice: number
    }
  | {
      itemType: 'user_priced'
      productId: string
      quantity: number
      /** 可不传或 0 */
      unitPrice?: number
    }

/** POST /payment/link/create */
export interface CreatePaymentLinkBody {
  linkType: PaymentLinkType
  linkName: string
  accountId: string
  settlementToken: string
  feeModel: PaymentLinkFeeModel
  lineItems: PaymentLinkLineItemInput[]
  /** 1 需要邮箱，0 不需要 */
  payerEmailRequired?: number
  successUrl?: string
  customSuccessText?: string
  customDisabledText?: string
}

/** POST /payment/link/update（全量替换） */
export interface UpdatePaymentLinkBody extends CreatePaymentLinkBody {
  linkId: string
}

/** 行项目中的商品快照（详情/创建响应；列表不含 productData） */
export interface PaymentLinkLineItemProductData {
  productName: string
  productDescription?: string
  imageUrl?: string
  attributes?: ProductAttribute[]
  status?: ProductStatus | string
}

/** 响应中的单行项目 */
export interface PaymentLinkLineItem {
  lineItemId?: string
  itemType: string
  productId: string
  quantity: number
  unitPrice?: number
  productData?: PaymentLinkLineItemProductData
}

/**
 * 响应中的 lineItems 区块。
 * 列表/详情多为 `{ items }`；创建接口文档示例为外层含 `lineItems.items` 与 amount。
 */
export interface PaymentLinkLineItemsSection {
  items?: PaymentLinkLineItem[]
  lineItems?: { items?: PaymentLinkLineItem[] }
  amount?: number
}

export interface SettlementTokenInfo {
  tokenId: string
  contractAddress: string
  name: string
  symbol: string
  decimals: number
  chainId: string
}

/**
 * 支付链接对象
 * @see https://docs.gstable.io/zh-Hans/docs/api/core-api/payment-link
 */
export interface PaymentLink {
  linkId: string
  linkType: PaymentLinkType
  linkName: string
  lineItems: PaymentLinkLineItemsSection
  accountId: string
  settlementToken: string
  feeModel: PaymentLinkFeeModel
  amount: number
  payerEmailRequired?: number
  successUrl?: string
  customSuccessText?: string
  customDisabledText?: string
  linkUrl: string
  status: PaymentLinkStatus
  versionCode: string
  createAt?: string
  updateAt?: string
  accountName?: string
  accountAddress?: string
  settlementTokenInfo?: SettlementTokenInfo
}

/** GET /payment/link/list/:page/:size */
export interface PaymentLinkListData {
  links: PaymentLink[]
  total: number
  page: string
  size: string
}
