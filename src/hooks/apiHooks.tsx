import { useState, useEffect } from 'react'

import {
  NodeAddresses,
  ChequebookAddressResponse,
  ChequebookBalanceResponse,
  BalanceResponse,
  LastChequesResponse,
  AllSettlements,
  LastCashoutActionResponse,
  Health,
  Peer,
  Topology,
  LastChequesForPeerResponse,
} from '@ethersphere/bee-js'

import { beeDebugApi, beeApi } from '../services/bee'

export interface HealthHook {
  health: boolean
  isLoadingHealth: boolean
  error: Error | null
}
export const useApiHealth = (): HealthHook => {
  const [health, setHealth] = useState<boolean>(false)
  const [isLoadingHealth, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    setLoading(true)
    beeApi.status
      .health()
      .then(res => {
        setHealth(res)
      })
      .catch(error => {
        setError(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return { health, isLoadingHealth, error }
}

export interface DebugHealthHook {
  nodeHealth: Health | null
  isLoadingNodeHealth: boolean
  error: Error | null
}

export const useDebugApiHealth = (): DebugHealthHook => {
  const [nodeHealth, setNodeHealth] = useState<Health | null>(null)
  const [isLoadingNodeHealth, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    setLoading(true)
    beeDebugApi.status
      .nodeHealth()
      .then(res => {
        setNodeHealth(res)
      })
      .catch(error => {
        setError(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return { nodeHealth, isLoadingNodeHealth, error }
}

export interface NodeAddressesHook {
  nodeAddresses: NodeAddresses | null
  isLoadingNodeAddresses: boolean
  error: Error | null
}

export const useApiNodeAddresses = (): NodeAddressesHook => {
  const [nodeAddresses, setNodeAddresses] = useState<NodeAddresses | null>(null)
  const [isLoadingNodeAddresses, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    setLoading(true)
    beeDebugApi.connectivity
      .addresses()
      .then(res => {
        setNodeAddresses(res)
      })
      .catch(error => {
        setError(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return { nodeAddresses, isLoadingNodeAddresses, error }
}

export interface NodeTopologyHook {
  topology: Topology | null
  isLoading: boolean
  error: Error | null
}

export const useApiNodeTopology = (): NodeTopologyHook => {
  const [topology, setNodeTopology] = useState<Topology | null>(null)
  const [isLoading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    setLoading(true)
    beeDebugApi.connectivity
      .topology()
      .then(res => {
        setNodeTopology(res)
      })
      .catch(error => {
        setError(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return { topology, isLoading, error }
}
export interface ChequebookAddressHook {
  chequebookAddress: ChequebookAddressResponse | null
  isLoadingChequebookAddress: boolean
  error: Error | null
}

export const useApiChequebookAddress = (): ChequebookAddressHook => {
  const [chequebookAddress, setChequebookAddress] = useState<ChequebookAddressResponse | null>(null)
  const [isLoadingChequebookAddress, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    setLoading(true)
    beeDebugApi.chequebook
      .address()
      .then(res => {
        setChequebookAddress(res)
      })
      .catch(error => {
        setError(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return { chequebookAddress, isLoadingChequebookAddress, error }
}

export interface NodePeersHook {
  peers: Peer[] | null
  isLoading: boolean
  error: Error | null
}

export const useApiNodePeers = (): NodePeersHook => {
  const [peers, setPeers] = useState<Peer[] | null>(null)
  const [isLoading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    setLoading(true)
    beeDebugApi.connectivity
      .listPeers()
      .then(res => {
        setPeers(res)
      })
      .catch(error => {
        setError(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return { peers, isLoading, error }
}

export interface ChequebookBalanceHook {
  chequebookBalance: ChequebookBalanceResponse | null
  isLoadingChequebookBalance: boolean
  error: Error | null
}

export const useApiChequebookBalance = (): ChequebookBalanceHook => {
  const [chequebookBalance, setChequebookBalance] = useState<ChequebookBalanceResponse | null>(null)
  const [isLoadingChequebookBalance, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    setLoading(true)
    beeDebugApi.chequebook
      .balance()
      .then(res => {
        setChequebookBalance(res)
      })
      .catch(error => {
        setError(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return { chequebookBalance, isLoadingChequebookBalance, error }
}

export interface PeerBalanceHook {
  peerBalances: BalanceResponse | null
  isLoadingPeerBalances: boolean
  error: Error | null
}

export const useApiPeerBalances = (): PeerBalanceHook => {
  const [peerBalances, setPeerBalances] = useState<BalanceResponse | null>(null)
  const [isLoadingPeerBalances, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    setLoading(true)
    beeDebugApi.balance
      .balances()
      .then(res => {
        setPeerBalances(res)
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

export interface PeerChequesHook {
  peerCheques: LastChequesResponse | null
  isLoadingPeerCheques: boolean
  error: Error | null
}

export const useApiPeerCheques = (): PeerChequesHook => {
  const [peerCheques, setPeerCheques] = useState<LastChequesResponse | null>(null)
  const [isLoadingPeerCheques, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    setLoading(true)
    beeDebugApi.chequebook
      .getLastCheques()
      .then(res => {
        setPeerCheques(res)
      })
      .catch(error => {
        setError(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return { peerCheques, isLoadingPeerCheques, error }
}

export interface PeerLastChequesHook {
  peerCheque: LastChequesForPeerResponse | null
  isLoadingPeerCheque: boolean
  error: Error | null
}

export const useApiPeerLastCheque = (peerId: string): PeerLastChequesHook => {
  const [peerCheque, setPeerCheque] = useState<LastChequesForPeerResponse | null>(null)
  const [isLoadingPeerCheque, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    setLoading(true)
    beeDebugApi.chequebook
      .getPeerLastCheques(peerId)
      .then(res => {
        setPeerCheque(res)
      })
      .catch(error => {
        setError(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [peerId])

  return { peerCheque, isLoadingPeerCheque, error }
}

export interface SettlementsHook {
  settlements: AllSettlements | null
  isLoadingSettlements: boolean
  error: Error | null
}

export const useApiSettlements = (): SettlementsHook => {
  const [settlements, setSettlements] = useState<AllSettlements | null>(null)
  const [isLoadingSettlements, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    setLoading(true)
    beeDebugApi.settlements
      .getSettlements()
      .then(res => {
        setSettlements(res)
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

export interface PeerLastCashoutHook {
  peerCashout: LastCashoutActionResponse | null
  isLoadingPeerCashout: boolean
  error: Error | null
}

export const useApiPeerLastCashout = (peerId: string): PeerLastCashoutHook => {
  const [peerCashout, setPeerCashout] = useState<LastCashoutActionResponse | null>(null)
  const [isLoadingPeerCashout, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    setLoading(true)
    beeDebugApi.chequebook
      .getPeerLastCashout(peerId)
      .then(res => {
        setPeerCashout(res)
      })
      .catch(error => {
        setError(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [peerId])

  return { peerCashout, isLoadingPeerCashout, error }
}
