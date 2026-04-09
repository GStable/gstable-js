/** 账户类型（文档当前仅支持 EVM 地址） */
export type AccountType = 'EVM::ADDR'

/** 账户状态 */
export type AccountStatus = 'normal'

/**
 * 收款账户对象（文档字段）
 * @see https://docs.gstable.io/zh-Hans/docs/api/core-api/account
 */
export interface Account {
  accountId: string
  accountName: string
  accountAddress: string
  accountType: AccountType
  settlementCurrencies: string[]
  version: string
  status: AccountStatus
  createAt?: string
  updateAt?: string
}
