import { LastCashoutActionResponse, BeeDebug } from '@ethersphere/bee-js'
import { useEffect, useState } from 'react'
import { Token } from '../models/Token'
import { makeRetriablePromise, unwrapPromiseSettlements } from '../utils'
import { Balance, Settlements, Settlement } from '../types'

interface UseAccountingHook {
  isLoadingUncashed: boolean
  accounting: Accounting[] | null
}

export interface Accounting {
  peer: string
  uncashedAmount: Token
  balance: Token
  received: Token
  sent: Token
  total: Token
}

/**
 * Merges the balances, settlements and uncashedAmounts arrays into single array which is sorted by uncashed amounts (if any)
 *
 * @param balances         Balances for all peers
 * @param settlements      Settlements for all peers which has some settlement
 * @param uncashedAmounts  Array of getPeerLastCashout responses which is needed to calculate uncashed amount
 *
 * @returns
 */
function mergeAccounting(
  balances: Balance[] | null,
  settlements?: Settlement[],
  uncashedAmounts?: LastCashoutActionResponse[],
): Accounting[] | null {
  // Settlements or balances are still loading or there is an error -> return null
  if (!balances || !settlements) return null

  const accounting: Record<string, Accounting> = {}

  balances.forEach(
    // Some peers may not have settlement but all have balance (therefore initialize sent, received and uncashed to 0)
    ({ peer, balance }) =>
      (accounting[peer] = {
        peer,
        balance,
        sent: new Token('0'),
        received: new Token('0'),
        uncashedAmount: new Token('0'),
        total: balance,
      }),
  )

  settlements.forEach(
    ({ peer, sent, received }) =>
      (accounting[peer] = {
        ...accounting[peer],
        sent,
        received,
        total: new Token(accounting[peer].balance.toBigNumber.plus(received.toBigNumber).minus(sent.toBigNumber)),
      }),
  )

  // If there are no cheques (and hence last cashout actions), we don't need to sort and can return values right away
  if (!uncashedAmounts) return Object.values(accounting)

  uncashedAmounts?.forEach(({ peer, uncashedAmount }) => {
    accounting[peer].uncashedAmount = new Token(uncashedAmount)
  })

  return Object.values(accounting).sort((a, b) =>
    b.uncashedAmount.toBigNumber.minus(a.uncashedAmount.toBigNumber).toNumber(),
  )
}

export const useAccounting = (
  beeDebugApi: BeeDebug | null,
  settlements: Settlements | null,
  balances: Balance[] | null,
): UseAccountingHook => {
  const [isLoadingUncashed, setIsloadingUncashed] = useState<boolean>(false)
  const [uncashedAmounts, setUncashedAmounts] = useState<LastCashoutActionResponse[] | undefined>(undefined)

  useEffect(() => {
    // We don't have any settlements loaded yet or we are already loading/have loaded the uncashed amounts
    if (isLoadingUncashed || !beeDebugApi || !settlements || uncashedAmounts) return

    setIsloadingUncashed(true)
    const promises = settlements.settlements
      .filter(({ received }) => received.toBigNumber.gt('0'))
      .map(({ peer }) => makeRetriablePromise(() => beeDebugApi.getLastCashoutAction(peer)))

    Promise.allSettled(promises).then(settlements => {
      const results = unwrapPromiseSettlements(settlements)
      setUncashedAmounts(results.fulfilled)
      setIsloadingUncashed(false)
    })
  }, [settlements, isLoadingUncashed, uncashedAmounts])

  const accounting = mergeAccounting(balances, settlements?.settlements, uncashedAmounts)

  return {
    isLoadingUncashed,
    accounting,
  }
}
