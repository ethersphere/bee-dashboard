import type { NodeAddresses, Topology } from '@ethersphere/bee-js'
import type { Token } from './models/Token'
import { CheckState } from './providers/Bee'

export interface StatusHookCommon {
  checkState: CheckState
}

export interface StatusNodeVersionHook extends StatusHookCommon {
  userVersion?: string
  latestVersion?: string
  latestUrl: string
  isLatestBeeVersion: boolean
}
export interface StatusEthereumConnectionHook extends StatusHookCommon {
  nodeAddresses: NodeAddresses | null
}
export interface StatusTopologyHook extends StatusHookCommon {
  topology: Topology | null
}

export interface ChequebookBalance {
  totalBalance: Token
  availableBalance: Token
}

export interface Balance {
  peer: string
  balance: Token
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
