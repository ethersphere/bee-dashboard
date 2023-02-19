export class AuthError extends Error {
  constructor() {
    super('Bad API key')
    this.name = 'AuthError'
  }
}

export function isAuthError(error: unknown): error is AuthError {
  return error instanceof Error && error.name === 'AuthError'
}
