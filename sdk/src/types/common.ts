/**
 * 与 GStable API 标准响应包络一致：https://docs.gstable.io/zh-Hans/docs/api/overview/introduction/
 */
export interface ApiEnvelope<T> {
  code: number
  message: string
  data: T
}
