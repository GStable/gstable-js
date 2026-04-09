import { GStableHttp, type GStableHttpOptions } from './http'
import { AccountResource } from './resources/account'
// import { AiPaymentResource } from './resources/ai-payment'
import { CapabilityResource } from './resources/capability'
import { CheckoutSessionResource } from './resources/checkout-session'
import { PaymentLinkResource } from './resources/payment-link'
import { ProductResource } from './resources/product'
import { WebhookResource } from './resources/webhook'

export interface GStableClientOptions extends GStableHttpOptions {}

export class GStableClient {
  private readonly http: GStableHttp

  readonly product: ProductResource

  readonly account: AccountResource

  readonly paymentLink: PaymentLinkResource

  readonly capability: CapabilityResource

  readonly checkoutSession: CheckoutSessionResource

  /** AI Payment Protocol（创建会话 / 查询 / 准备支付） */
  // readonly aiPayment: AiPaymentResource

  readonly webhook: WebhookResource

  constructor(options: GStableClientOptions) {
    if (!options.apiKey?.trim()) {
      throw new Error('GStableClient: apiKey is required')
    }
    this.http = new GStableHttp(options)
    this.product = new ProductResource(this.http)
    this.account = new AccountResource(this.http)
    this.paymentLink = new PaymentLinkResource(this.http)
    this.capability = new CapabilityResource(this.http)
    this.checkoutSession = new CheckoutSessionResource(this.http)
    // this.aiPayment = new AiPaymentResource(this.http)
    this.webhook = new WebhookResource(this.http)
  }
}
