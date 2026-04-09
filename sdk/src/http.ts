import { GStableError } from './errors'
import { createTypedApiError } from './errors/api-error'
import type { ApiEnvelope } from './types/common'

/**
 * Default private API origin for this SDK (see `GStableHttpOptions.baseUrl` to override).
 * Trailing slashes are normalized when building request URLs.
 */
export const DEFAULT_BASE_URL = 'https://api.gstable.io/api/v1/'

/**
 * Default public API origin (no `Authorization`; see `GStableHttpOptions.publicBaseUrl`).
 */
export const DEFAULT_PUBLIC_BASE_URL = 'https://api.gstable.io/public/api/v1'

function isApiEnvelope(v: unknown): v is ApiEnvelope<unknown> {
  return (
    v !== null &&
    typeof v === 'object' &&
    'code' in v &&
    typeof (v as ApiEnvelope<unknown>).code === 'number'
  )
}

/** Human-readable hint when the body is not JSON (e.g. gateway/HTML error page). */
function messageForNonJsonBody(status: number, bodyPreview: string): string {
  const trimmed = bodyPreview.trim().slice(0, 280).replace(/\s+/g, ' ')
  if (status === 403) {
    return [
      'HTTP 403: The server rejected the request and the response body is not typical API JSON.',
      'Common causes: invalid API key or insufficient permissions, WAF blocking, or base URL mismatch with https://docs.gstable.io.',
      'Verify GSTABLE_API_KEY and endpoint URLs; retry from a server or trusted network.',
      trimmed ? `(response snippet) ${trimmed}` : '',
    ]
      .filter(Boolean)
      .join(' ')
  }
  if (status === 401) {
    return `HTTP 401: Authentication failed. Check the Authorization header / API key.${trimmed ? ` ${trimmed}` : ''}`
  }
  return `HTTP ${status}${trimmed ? `: ${trimmed}` : ' (response is not JSON or is empty)'}`
}

function isGStableHttpDebug(): boolean {
  if (typeof process === 'undefined' || process.env == null) return false
  const v = process.env.GSTABLE_DEBUG
  return v === '1' || v === 'true'
}

function logOutgoingRequest(
  method: HttpMethod,
  url: string,
  headers: Record<string, string>,
): void {
  if (!isGStableHttpDebug()) return
  console.error('[GStable SDK debug]', JSON.stringify({ method, url, headers }, null, 2))
}

export type HttpMethod = 'GET' | 'POST'

export interface GStableHttpOptions {
  /** API Key，无需带 `Bearer ` 前缀 */
  apiKey: string
  /** 未设置时使用 {@link DEFAULT_BASE_URL} */
  baseUrl?: string
  /** 公共 API 根路径，未设置时使用 {@link DEFAULT_PUBLIC_BASE_URL} */
  publicBaseUrl?: string
  /** 可注入 fetch（测试或自定义环境） */
  fetchImpl?: typeof fetch
}

export class GStableHttp {
  private readonly baseUrl: string
  private readonly publicBaseUrl: string
  private readonly authHeader: string
  private readonly fetchFn: typeof fetch

  constructor(options: GStableHttpOptions) {
    this.baseUrl = (options.baseUrl ?? DEFAULT_BASE_URL).replace(/\/$/, '')
    this.publicBaseUrl = (options.publicBaseUrl ?? DEFAULT_PUBLIC_BASE_URL).replace(/\/$/, '')
    const key = options.apiKey.trim()
    this.authHeader = key.startsWith('Bearer ') ? key : `Bearer ${key}`
    this.fetchFn = options.fetchImpl ?? globalThis.fetch.bind(globalThis)
  }

  private extractEnvelopeData<T>(res: Response, rawText: string, parsed: unknown): T {
    if (!isApiEnvelope(parsed)) {
      throw new GStableError(
        res.status || -1,
        !res.ok
          ? messageForNonJsonBody(res.status, rawText)
          : 'Unexpected response: not a valid API envelope JSON',
      )
    }

    const envelope = parsed as ApiEnvelope<T>

    if (!res.ok) {
      throw createTypedApiError(
        envelope.code ?? res.status,
        envelope.message || `HTTP ${res.status}`,
      )
    }

    if (envelope.code !== 0) {
      throw createTypedApiError(envelope.code, envelope.message ?? 'API error')
    }

    return envelope.data
  }

  /**
   * 调用公共 API（不携带 Authorization），响应格式与私有 API 相同。
   */
  async requestPublicJson<T>(method: HttpMethod, path: string, body?: unknown): Promise<T> {
    const url = `${this.publicBaseUrl}${path.startsWith('/') ? path : `/${path}`}`
    const headers: Record<string, string> = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }
    logOutgoingRequest(method, url, headers)

    const init: RequestInit = { method, headers }

    if (method === 'POST' && body !== undefined) {
      init.body = JSON.stringify(body)
    }

    let res: Response
    try {
      res = await this.fetchFn(url, init)
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      throw new GStableError(-1, `Network error: ${msg}`)
    }

    const rawText = await res.text().catch(() => '')

    let parsed: unknown
    try {
      parsed = rawText.length > 0 ? JSON.parse(rawText) : undefined
    } catch {
      throw new GStableError(
        res.status || -1,
        messageForNonJsonBody(res.status, rawText),
      )
    }

    return this.extractEnvelopeData<T>(res, rawText, parsed)
  }

  async requestJson<T>(method: HttpMethod, path: string, body?: unknown): Promise<T> {
    const url = `${this.baseUrl}${path.startsWith('/') ? path : `/${path}`}`
    const headers: Record<string, string> = {
      Accept: 'application/json',
      Authorization: this.authHeader,
      'Content-Type': 'application/json',
    }
    logOutgoingRequest(method, url, headers)

    const init: RequestInit = { method, headers }

    if (method === 'POST' && body !== undefined) {
      init.body = JSON.stringify(body)
    }

    let res: Response
    try {
      res = await this.fetchFn(url, init)
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      throw new GStableError(-1, `Network error: ${msg}`)
    }

    const rawText = await res.text().catch(() => '')

    let parsed: unknown
    try {
      parsed = rawText.length > 0 ? JSON.parse(rawText) : undefined
    } catch {
      throw new GStableError(
        res.status || -1,
        messageForNonJsonBody(res.status, rawText),
      )
    }

    return this.extractEnvelopeData<T>(res, rawText, parsed)
  }
}
