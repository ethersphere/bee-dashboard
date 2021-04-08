import { ChequebookAddressResponse, ChequebookBalanceResponse, NodeAddresses, Topology } from '@ethersphere/bee-js'
import {
  useApiChequebookAddress,
  useApiChequebookBalance,
  useApiHealth,
  useApiNodeAddresses,
  useApiNodeTopology,
  useDebugApiHealth,
  useLatestBeeRelease,
} from './apiHooks'

interface StatusHookCommon {
  isLoading: boolean
  isOk: boolean
}

interface StatusNodeVersionHook extends StatusHookCommon {
  userVersion: string
  latestVersion: string
  latestUrl: string
}

export const useStatusNodeVersion = (): StatusNodeVersionHook => {
  const { latestBeeRelease, isLoadingLatestBeeRelease } = useLatestBeeRelease()
  const { nodeHealth, isLoadingNodeHealth } = useDebugApiHealth()

  return {
    isLoading: isLoadingNodeHealth || isLoadingLatestBeeRelease,
    isOk: Boolean(latestBeeRelease && latestBeeRelease.name === `v${nodeHealth?.version?.split('-')[0]}`),
    userVersion: nodeHealth?.version?.split('-')[0] || '-',
    latestVersion: latestBeeRelease?.name.substring(1) || '-',
    latestUrl: latestBeeRelease?.html_url || 'https://github.com/ethersphere/bee/releases/latest',
  }
}

interface StatusEthereumConnectionHook extends StatusHookCommon {
  nodeAddresses: NodeAddresses | null
}

export const useStatusEthereumConnection = (): StatusEthereumConnectionHook => {
  const { isLoadingNodeAddresses, nodeAddresses } = useApiNodeAddresses()

  return {
    isLoading: isLoadingNodeAddresses,
    isOk: Boolean(nodeAddresses?.ethereum),
    nodeAddresses,
  }
}

export const useStatusDebugConnection = (): StatusHookCommon => {
  const { isLoadingNodeHealth, nodeHealth } = useDebugApiHealth()

  return {
    isLoading: isLoadingNodeHealth,
    isOk: Boolean(nodeHealth?.status === 'ok'),
  }
}

export const useStatusConnection = (): StatusHookCommon => {
  const { isLoadingHealth, health } = useApiHealth()

  return {
    isLoading: isLoadingHealth,
    isOk: health,
  }
}

interface StatusTopologyHook extends StatusHookCommon {
  topology: Topology | null
}

export const useStatusTopology = (): StatusTopologyHook => {
  const { topology, isLoading } = useApiNodeTopology()

  return {
    isLoading,
    isOk: Boolean(topology?.connected && topology?.connected > 0),
    topology,
  }
}
interface StatusChequebookHook extends StatusHookCommon {
  chequebookBalance: ChequebookBalanceResponse | null
  chequebookAddress: ChequebookAddressResponse | null
}

export const useStatusChequebook = (): StatusChequebookHook => {
  const { chequebookAddress, isLoadingChequebookAddress } = useApiChequebookAddress()
  const { chequebookBalance, isLoadingChequebookBalance } = useApiChequebookBalance()

  return {
    isLoading: isLoadingChequebookAddress || isLoadingChequebookBalance,
    isOk:
      Boolean(chequebookAddress?.chequebookaddress) && chequebookBalance !== null && chequebookBalance.totalBalance > 0,
    chequebookBalance,
    chequebookAddress,
  }
}
