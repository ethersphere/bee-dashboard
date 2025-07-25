import type { NodeAddresses, Topology } from '@ethersphere/bee-js'
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
