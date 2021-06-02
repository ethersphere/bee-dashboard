import { ChequebookAddressResponse } from '@ethersphere/bee-js'
import {
  ChequebookBalance,
  useApiChequebookAddress,
  useApiChequebookBalance,
  useApiHealth,
  useApiNodeAddresses,
  useApiNodeTopology,
  useDebugApiHealth,
  useLatestBeeRelease,
} from './apiHooks'
import semver from 'semver'
import { engines } from '../../package.json'

export interface StatusChequebookHook extends StatusHookCommon {
  chequebookBalance: ChequebookBalance | null
  chequebookAddress: ChequebookAddressResponse | null
}

export const useStatusNodeVersion = (): StatusNodeVersionHook => {
  const { latestBeeRelease, isLoadingLatestBeeRelease } = useLatestBeeRelease()
  const { nodeHealth, isLoadingNodeHealth } = useDebugApiHealth()

  const latestVersion = semver.coerce(latestBeeRelease?.name)?.version
  const latestUserVersion = semver.coerce(nodeHealth?.version)?.version

  const isLatestBeeVersion = Boolean(
    latestVersion &&
      latestUserVersion &&
      semver.satisfies(latestVersion, latestUserVersion, {
        includePrerelease: true,
      }),
  )

  return {
    isLoading: isLoadingNodeHealth || isLoadingLatestBeeRelease,
    isOk: Boolean(
      nodeHealth &&
        semver.satisfies(nodeHealth.version, engines.bee, {
          includePrerelease: true,
        }),
    ),
    userVersion: nodeHealth?.version,
    latestVersion,
    latestUrl: latestBeeRelease?.html_url || 'https://github.com/ethersphere/bee/releases/latest',
    isLatestBeeVersion,
  }
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

export const useStatusTopology = (): StatusTopologyHook => {
  const { topology, isLoading } = useApiNodeTopology()

  return {
    isLoading,
    isOk: Boolean(topology?.connected && topology?.connected > 0),
    topology,
  }
}

export const useStatusChequebook = (): StatusChequebookHook => {
  const { chequebookAddress, isLoadingChequebookAddress } = useApiChequebookAddress()
  const { chequebookBalance, isLoadingChequebookBalance } = useApiChequebookBalance()

  return {
    isLoading: isLoadingChequebookAddress || isLoadingChequebookBalance,
    isOk:
      Boolean(chequebookAddress?.chequebookAddress) &&
      chequebookBalance !== null &&
      chequebookBalance?.totalBalance.toBigNumber.isGreaterThan(0),
    chequebookBalance,
    chequebookAddress,
  }
}
