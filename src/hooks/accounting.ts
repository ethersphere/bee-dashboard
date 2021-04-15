import { useEffect, useState } from 'react'
import { beeDebugApi } from '../services/bee'
import { useApiPeerBalances, useApiSettlements } from './apiHooks'

interface UseAccountingHook {
  isLoading: boolean
  isLoadingUncashed: boolean
  totalsent: number
  totalreceived: number
  accounting: Record<string, Accounting> | null
}

interface CashoutInfo {
  uncashedAmount: number
  peer: string
}

export const useAccounting = (): UseAccountingHook => {
  const settlements = useApiSettlements()
  const balances = useApiPeerBalances()
  const accounting: Record<string, Accounting> = {}
  const [isLoadingUncashed, setIsloadingUncashed] = useState<boolean>(false)
  const [uncashedAmounts, setUncashedAmounts] = useState<CashoutInfo[] | null>(null)

  balances.peerBalances?.balances.forEach(
    // Some peers may not have settlement but all have balance (therefore initialize sent + received to 0)
    ({ peer, balance }) => (accounting[peer] = { balance, sent: 0, received: 0, uncashedAmount: 0 }),
  )

  settlements.settlements?.settlements.forEach(
    ({ peer, sent, received }) => (accounting[peer] = { ...accounting[peer], sent, received }),
  )

  uncashedAmounts?.forEach(({ peer, uncashedAmount }) => (accounting[peer].uncashedAmount = uncashedAmount))

  useEffect(() => {
    // We don't have any settlements loaded yet or we are already loading/loaded the uncashed amounts
    if (isLoadingUncashed || settlements.settlements === null || uncashedAmounts !== null) return

    setIsloadingUncashed(true)
    const promises = settlements.settlements.settlements.map(({ peer }) =>
      beeDebugApi.chequebook.getPeerLastCashout(peer),
    )
    Promise.all(promises)
      .then(res => {
        setUncashedAmounts((res as unknown) as CashoutInfo[])
        setIsloadingUncashed(false)
      })
      .catch(console.error) // eslint-disable-line
  }, [settlements, isLoadingUncashed])

  return {
    isLoading: settlements.isLoadingSettlements || balances.isLoadingPeerBalances,
    isLoadingUncashed,
    accounting,
    totalsent: settlements.settlements?.totalsent || 0,
    totalreceived: settlements.settlements?.totalreceived || 0,
  }
}
