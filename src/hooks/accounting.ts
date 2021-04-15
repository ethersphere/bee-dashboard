import { useApiPeerBalances, useApiSettlements } from './apiHooks'

interface UseAccountingHook {
  isLoading: boolean
  totalsent: number
  totalreceived: number
  accounting: Record<string, Accounting> | null
}

export const useAccounting = (): UseAccountingHook => {
  const settlements = useApiSettlements()
  const balances = useApiPeerBalances()
  const accounting: Record<string, Accounting> = {}

  balances.peerBalances?.balances.forEach(
    // Some peers may not have settlement but all have balance (therefore initialize sent + received to 0)
    ({ peer, balance }) => (accounting[peer] = { ...accounting[peer], balance, sent: 0, received: 0 }),
  )

  settlements.settlements?.settlements.forEach(
    ({ peer, sent, received }) => (accounting[peer] = { ...accounting[peer], sent, received }),
  )

  return {
    isLoading: settlements.isLoadingSettlements || balances.isLoadingPeerBalances,
    accounting,
    totalsent: settlements.settlements?.totalsent || 0,
    totalreceived: settlements.settlements?.totalreceived || 0,
  }
}
