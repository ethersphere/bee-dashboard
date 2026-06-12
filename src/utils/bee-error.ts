import { BeeResponseError, BZZ, DAI, WalletBalance } from '@ethersphere/bee-js'
import { ProviderContext } from 'notistack'

/**
 * Extracts the most meaningful, human-readable reason from an error thrown by the Bee API.
 *
 * Bee-js `BeeResponseError.message` only contains the generic HTTP layer message
 * (e.g. "Request failed with status code 402"), while the actual reason reported by the
 * Bee node (e.g. "out of funds") is in `responseBody`.
 */
export function extractBeeApiErrorMessage(error: unknown): string {
  if (error instanceof BeeResponseError) {
    const body = error.responseBody as { message?: unknown } | string | undefined

    if (typeof body === 'string' && body) {
      return body
    }

    if (body && typeof body === 'object' && typeof body.message === 'string' && body.message) {
      return body.message
    }
  }

  if (error instanceof Error) {
    return error.message
  }

  return String(error)
}

/**
 * Checks whether the node's wallet can cover a stamp purchase before sending the transaction.
 *
 * @returns an actionable error message, or null when the balance is sufficient or unknown
 */
export function getStampFundsShortageMessage(cost: BZZ, walletBalance: WalletBalance | null): string | null {
  if (!walletBalance) {
    return null
  }

  if (cost.gt(walletBalance.bzzBalance)) {
    return (
      `Not enough xBZZ: need ${cost.toSignificantDigits(4)}, ` +
      `have ${walletBalance.bzzBalance.toSignificantDigits(4)}. ` +
      'Add funds under Account > Wallet.'
    )
  }

  if (DAI.fromDecimalString('0').eq(walletBalance.nativeTokenBalance)) {
    return 'No xDAI to pay for gas fees. Add funds under Account > Wallet.'
  }

  return null
}

/**
 * Shows an error snackbar when the node's wallet cannot cover a stamp purchase.
 *
 * @returns true when the purchase should be aborted
 */
export function notifyStampFundsShortage(
  cost: BZZ,
  walletBalance: WalletBalance | null,
  enqueueSnackbar: ProviderContext['enqueueSnackbar'],
): boolean {
  const fundsShortage = getStampFundsShortageMessage(cost, walletBalance)

  if (fundsShortage) {
    enqueueSnackbar(fundsShortage, { variant: 'error' })

    return true
  }

  return false
}
