export class AuthError extends Error {
  constructor() {
    super('Bad API key')
    this.name = 'AuthError'
  }
}

export function isAuthError(error: unknown): error is AuthError {
  return error instanceof Error && error.name === 'AuthError'
}

export class SwapError extends Error {
  snackbarMessage: string
  originalError?: Error

  constructor(snackbarMessage: string, error?: Error) {
    super(error?.message || snackbarMessage)
    this.name = 'SwapError'
    this.originalError = error
    this.snackbarMessage = snackbarMessage
  }
}

export function isSwapError(error: unknown): error is SwapError {
  return error instanceof Error && error.name === 'SwapError'
}

export function wrapWithSwapError<T>(promise: Promise<T>, snackbarMessage: string): Promise<T> {
  return promise.catch((error: Error) => {
    if (isAuthError(error)) {
      throw new SwapError('Bad API key, reopen dashboard through Swarm Desktop', error)
    }
    throw new SwapError(snackbarMessage, error)
  })
}
