import { AllSettlements, Bee, BZZ, LastCashoutActionResponse, PeerBalance, Settlements } from '@upcoming/bee-js'
import { useEffect, useState } from 'react'
import { makeRetriablePromise, unwrapPromiseSettlements } from '../utils'

interface UseAccountingHook {
  isLoadingUncashed: boolean
  totalUncashed: BZZ
  accounting: Accounting[] | null
}

export interface Accounting {
  peer: string
  uncashedAmount: BZZ
  balance: BZZ
  received: BZZ
  sent: BZZ
  total: BZZ
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
  balances: PeerBalance[] | null,
  settlements?: Settlements[],
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
        sent: BZZ.fromPLUR('0'),
        received: BZZ.fromPLUR('0'),
        uncashedAmount: BZZ.fromPLUR('0'),
        total: balance,
      }),
  )

  settlements.forEach(
    ({ peer, sent, received }) =>
      (accounting[peer] = {
        ...accounting[peer],
        sent,
        received,
        total: accounting[peer].balance.plus(received).minus(sent),
      }),
  )

  // If there are no cheques (and hence last cashout actions)
  if (!uncashedAmounts) return Object.values(accounting).sort((a, b) => (a.peer < b.peer ? -1 : 1))

  uncashedAmounts?.forEach(({ peer, uncashedAmount }) => {
    accounting[peer].uncashedAmount = uncashedAmount
  })

  // Return sorted by the uncashed amount first and then by the peer id
  return Object.values(accounting).sort((a, b) => {
    const diff = Number(b.uncashedAmount.minus(a.uncashedAmount))

    if (diff !== 0) {
      return diff
    }

    return a.peer < b.peer ? -1 : 1
  })
}

export const useAccounting = (
  beeApi: Bee | null,
  settlements: AllSettlements | null,
  balances: PeerBalance[] | null,
): UseAccountingHook => {
  const [isLoadingUncashed, setIsloadingUncashed] = useState<boolean>(false)
  const [uncashedAmounts, setUncashedAmounts] = useState<LastCashoutActionResponse[] | undefined>(undefined)

  useEffect(() => {
    // We don't have any settlements loaded yet or we are already loading/have loaded the uncashed amounts
    if (isLoadingUncashed || !beeApi || !settlements || uncashedAmounts) return

    setIsloadingUncashed(true)
    const promises = settlements.settlements
      .filter(({ received }) => received.gt(BZZ.fromPLUR('0')))
      .map(({ peer }) => makeRetriablePromise(() => beeApi.getLastCashoutAction(peer)))

    Promise.allSettled(promises).then(settlements => {
      const results = unwrapPromiseSettlements(settlements)
      setUncashedAmounts(results.fulfilled)
      setIsloadingUncashed(false)
    })
  }, [settlements, isLoadingUncashed, uncashedAmounts, beeApi])

  const accounting = mergeAccounting(balances, settlements?.settlements, uncashedAmounts)

  let totalUncashed = BZZ.fromPLUR('0')
  accounting?.forEach(({ uncashedAmount }) => (totalUncashed = totalUncashed.plus(uncashedAmount)))

  return {
    isLoadingUncashed,
    totalUncashed,
    accounting,
  }
}
