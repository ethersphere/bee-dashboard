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
