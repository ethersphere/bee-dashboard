import { LastCashoutActionResponse, PeerBalance, Settlements } from '@ethersphere/bee-js'
import { useEffect, useState } from 'react'
import { beeDebugApi } from '../services/bee'
import { useApiPeerBalances, useApiSettlements } from './apiHooks'

interface UseAccountingHook {
  isLoading: boolean
  isLoadingUncashed: boolean
  error: Error | null
  totalsent: number
  totalreceived: number
  accounting: Accounting[] | null
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
  balances?: PeerBalance[],
  settlements?: Settlements[],
  uncashedAmounts?: LastCashoutActionResponse[],
): Accounting[] | null {
  // Settlements or balances are still loading or there is an error -> return null
  if (!balances || !settlements) return null

  const accounting: Record<string, Accounting> = {}

  balances.forEach(
    // Some peers may not have settlement but all have balance (therefore initialize sent, received and uncashed to 0)
    ({ peer, balance }) => (accounting[peer] = { peer, balance, sent: 0, received: 0, uncashedAmount: 0 }),
  )

  settlements.forEach(({ peer, sent, received }) => (accounting[peer] = { ...accounting[peer], sent, received }))

  // If there are no cheques (and hence last cashout actions), we don't need to sort and can return values right away
  if (!uncashedAmounts) return Object.values(accounting)

  uncashedAmounts?.forEach(
    ({ peer, cumulativePayout }) => (accounting[peer].uncashedAmount = accounting[peer].received - cumulativePayout),
  )

  return Object.values(accounting).sort((a, b) => b.uncashedAmount - a.uncashedAmount)
}

export const useAccounting = (): UseAccountingHook => {
  const settlements = useApiSettlements()
  const balances = useApiPeerBalances()

  const [err, setErr] = useState<Error | null>(null)
  const [isLoadingUncashed, setIsloadingUncashed] = useState<boolean>(false)
  const [uncashedAmounts, setUncashedAmounts] = useState<LastCashoutActionResponse[] | undefined>(undefined)

  const error = balances.error || settlements.error || err

  useEffect(() => {
    // We don't have any settlements loaded yet or we are already loading/have loaded the uncashed amounts
    if (isLoadingUncashed || !settlements.settlements || uncashedAmounts || error) return

    setIsloadingUncashed(true)
    const promises = settlements.settlements.settlements.map(({ peer }) =>
      beeDebugApi.chequebook.getPeerLastCashout(peer),
    )
    Promise.all(promises)
      .then(setUncashedAmounts)
      .catch(setErr)
      .finally(() => setIsloadingUncashed(false))
  }, [settlements, isLoadingUncashed, uncashedAmounts, error])

  const accounting = mergeAccounting(
    balances.peerBalances?.balances,
    settlements.settlements?.settlements,
    uncashedAmounts,
  )

  return {
    isLoading: settlements.isLoadingSettlements || balances.isLoadingPeerBalances,
    isLoadingUncashed,
    error,
    accounting,
    totalsent: settlements.settlements?.totalsent || 0,
    totalreceived: settlements.settlements?.totalreceived || 0,
  }
}
