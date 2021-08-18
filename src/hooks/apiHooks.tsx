import { useState, useEffect } from 'react'

import { beeDebugApi } from '../services/bee'
import axios from 'axios'
import { Token } from '../models/Token'

export interface Balance {
  peer: string
  balance: Token
}

export interface PeerBalanceHook {
  peerBalances: Balance[] | null
  isLoadingPeerBalances: boolean
  error: Error | null
}

export const useApiPeerBalances = (): PeerBalanceHook => {
  const [peerBalances, setPeerBalances] = useState<Balance[] | null>(null)
  const [isLoadingPeerBalances, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    setLoading(true)
    beeDebugApi.balance
      .balances()
      .then(res => {
        // for some reason sometimes these are numbers and not BigInts
        const balances = res.balances.map(({ peer, balance }) => ({ peer, balance: new Token(balance) }))
        setPeerBalances(balances)
      })
      .catch(error => {
        setError(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return { peerBalances, isLoadingPeerBalances, error }
}

export interface Settlement {
  peer: string
  received: Token
  sent: Token
}

export interface Settlements {
  totalReceived: Token
  totalSent: Token
  settlements: Settlement[]
}

export interface SettlementsHook {
  settlements: Settlements | null
  isLoadingSettlements: boolean
  error: Error | null
}

export const useApiSettlements = (): SettlementsHook => {
  const [settlements, setSettlements] = useState<Settlements | null>(null)
  const [isLoadingSettlements, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    setLoading(true)
    beeDebugApi.settlements
      .getSettlements()
      .then(({ totalReceived, settlements, totalSent }) => {
        const set = {
          totalReceived: new Token(totalReceived),
          totalSent: new Token(totalSent),
          settlements: settlements.map(({ peer, received, sent }) => ({
            peer,
            received: new Token(received),
            sent: new Token(sent),
          })),
        }
        setSettlements(set)
      })
      .catch(error => {
        setError(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return { settlements, isLoadingSettlements, error }
}

export interface LatestBeeReleaseHook {
  latestBeeRelease: LatestBeeRelease | null
  isLoadingLatestBeeRelease: boolean
  error: Error | null
}

export const useLatestBeeRelease = (): LatestBeeReleaseHook => {
  const [latestBeeRelease, setLatestBeeRelease] = useState<LatestBeeRelease | null>(null)
  const [isLoadingLatestBeeRelease, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BEE_GITHUB_REPO_URL}/releases/latest`)
      .then(res => {
        setLatestBeeRelease(res.data)
      })
      .catch((error: Error) => {
        setError(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return { latestBeeRelease, isLoadingLatestBeeRelease, error }
}
