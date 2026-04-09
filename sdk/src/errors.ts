export class GStableError extends Error {
  readonly code: number

  constructor(code: number, message: string) {
    super(message)
    this.name = 'GStableError'
    this.code = code
  }
}

export function isGStableError(e: unknown): e is GStableError {
  return e instanceof GStableError
}
