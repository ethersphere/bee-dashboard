import {
  BeeModes,
  ChainState,
  ChequebookAddressResponse,
  Health,
  LastChequesResponse,
  NodeAddresses,
  NodeInfo,
  Peer,
  Topology,
} from '@ethersphere/bee-js'
import { createContext, ReactChild, ReactElement, useContext, useEffect, useState } from 'react'
import semver from 'semver'
import PackageJson from '../../package.json'
import { useLatestBeeRelease } from '../hooks/apiHooks'
import { Token } from '../models/Token'
import type { Balance, ChequebookBalance, Settlements } from '../types'
import { Context as SettingsContext } from './Settings'

const REFRESH_WHEN_OK = 30_000
const REFRESH_WHEN_ERROR = 5_000
const TIMEOUT = 3_000

export enum CheckState {
  OK = 'OK',
  WARNING = 'Warning',
  ERROR = 'Error',
}

interface StatusItem {
  isEnabled: boolean
  checkState: CheckState
}

interface Status {
  all: CheckState
  version: StatusItem
  blockchainConnection: StatusItem
  debugApiConnection: StatusItem
  apiConnection: StatusItem
  topology: StatusItem
  chequebook: StatusItem
}

interface ContextInterface {
  status: Status
  latestPublishedVersion?: string
  latestUserVersion?: string
  latestUserVersionExact?: string
  isLatestBeeVersion: boolean
  latestBeeVersionUrl: string
  error: Error | null
  apiHealth: boolean
  debugApiHealth: Health | null
  debugApiReadiness: boolean
  nodeAddresses: NodeAddresses | null
  nodeInfo: NodeInfo | null
  topology: Topology | null
  chequebookAddress: ChequebookAddressResponse | null
  peers: Peer[] | null
  chequebookBalance: ChequebookBalance | null
  peerBalances: Balance[] | null
  peerCheques: LastChequesResponse | null
  settlements: Settlements | null
  chainState: ChainState | null
  chainId: number | null
  latestBeeRelease: LatestBeeRelease | null
  isLoading: boolean
  lastUpdate: number | null
  start: (frequency?: number) => void
  stop: () => void
  refresh: () => Promise<void>
}

const initialValues: ContextInterface = {
  status: {
    all: CheckState.ERROR,
    version: { isEnabled: false, checkState: CheckState.ERROR },
    blockchainConnection: { isEnabled: false, checkState: CheckState.ERROR },
    debugApiConnection: { isEnabled: false, checkState: CheckState.ERROR },
    apiConnection: { isEnabled: false, checkState: CheckState.ERROR },
    topology: { isEnabled: false, checkState: CheckState.ERROR },
    chequebook: { isEnabled: false, checkState: CheckState.ERROR },
  },
  latestPublishedVersion: undefined,
  latestUserVersion: undefined,
  latestUserVersionExact: undefined,
  isLatestBeeVersion: false,
  latestBeeVersionUrl: 'https://github.com/ethersphere/bee/releases/latest',
  error: null,
  apiHealth: false,
  debugApiHealth: null,
  debugApiReadiness: false,
  nodeAddresses: null,
  nodeInfo: null,
  topology: null,
  chequebookAddress: null,
  peers: null,
  chequebookBalance: null,
  peerBalances: null,
  peerCheques: null,
  settlements: null,
  chainState: null,
  chainId: null,
  latestBeeRelease: null,
  isLoading: true,
  lastUpdate: null,
  start: () => {}, // eslint-disable-line
  stop: () => {}, // eslint-disable-line
  refresh: () => Promise.reject(),
}

export const Context = createContext<ContextInterface>(initialValues)
export const Consumer = Context.Consumer

interface Props {
  children: ReactChild
}

function getStatus(
  debugApiHealth: Health | null,
  nodeAddresses: NodeAddresses | null,
  nodeInfo: NodeInfo | null,
  apiHealth: boolean,
  topology: Topology | null,
  chequebookAddress: ChequebookAddressResponse | null,
  chequebookBalance: ChequebookBalance | null,
  error: Error | null,
): Status {
  const status: Status = { ...initialValues.status }

  // Version check
  status.version.isEnabled = true
  status.version.checkState =
    debugApiHealth &&
    semver.satisfies(debugApiHealth.version, PackageJson.engines.bee, {
      includePrerelease: true,
    })
      ? CheckState.OK
      : CheckState.ERROR

  // Blockchain connection check
  status.blockchainConnection.isEnabled = true
  status.blockchainConnection.checkState = Boolean(debugApiHealth?.status === 'ok') ? CheckState.OK : CheckState.ERROR

  // Debug API connection check
  status.debugApiConnection.isEnabled = true
  status.debugApiConnection.checkState = Boolean(debugApiHealth?.status === 'ok') ? CheckState.OK : CheckState.ERROR

  // API connection check
  status.apiConnection.isEnabled = true
  status.apiConnection.checkState = apiHealth ? CheckState.OK : CheckState.ERROR

  // Topology check
  if (nodeInfo && [BeeModes.FULL, BeeModes.LIGHT, BeeModes.ULTRA_LIGHT].includes(nodeInfo.beeMode)) {
    status.topology.isEnabled = true
    status.topology.checkState = topology?.connected && topology?.connected > 0 ? CheckState.OK : CheckState.WARNING
  }

  // Chequebook check
  if (error || (nodeInfo && [BeeModes.FULL, BeeModes.LIGHT].includes(nodeInfo.beeMode))) {
    status.chequebook.isEnabled = true

    if (
      chequebookAddress?.chequebookAddress &&
      chequebookBalance !== null &&
      chequebookBalance?.totalBalance.toBigNumber.isGreaterThan(0)
    ) {
      status.chequebook.checkState = CheckState.OK
    } else if (chequebookAddress?.chequebookAddress) status.chequebook.checkState = CheckState.WARNING
    else status.chequebook.checkState = CheckState.OK
  }

  // Determine overall status
  if (Object.values(status).some(({ isEnabled, checkState }) => isEnabled && checkState === CheckState.ERROR)) {
    status.all = CheckState.ERROR
  } else if (
    Object.values(status).some(({ isEnabled, checkState }) => isEnabled && checkState === CheckState.WARNING)
  ) {
    status.all = CheckState.WARNING
  } else {
    status.all = CheckState.OK
  }

  return status
}

// This does not need to be exposed and works much better as variable than state variable which may trigger some unnecessary re-renders
let isRefreshing = false

export function Provider({ children }: Props): ReactElement {
  const { beeApi, beeDebugApi } = useContext(SettingsContext)
  const [apiHealth, setApiHealth] = useState<boolean>(false)
  const [debugApiHealth, setDebugApiHealth] = useState<Health | null>(null)
  const [debugApiReadiness, setDebugApiReadiness] = useState(false)
  const [nodeAddresses, setNodeAddresses] = useState<NodeAddresses | null>(null)
  const [nodeInfo, setNodeInfo] = useState<NodeInfo | null>(null)
  const [topology, setNodeTopology] = useState<Topology | null>(null)
  const [chequebookAddress, setChequebookAddress] = useState<ChequebookAddressResponse | null>(null)
  const [peers, setPeers] = useState<Peer[] | null>(null)
  const [chequebookBalance, setChequebookBalance] = useState<ChequebookBalance | null>(null)
  const [peerBalances, setPeerBalances] = useState<Balance[] | null>(null)
  const [peerCheques, setPeerCheques] = useState<LastChequesResponse | null>(null)
  const [settlements, setSettlements] = useState<Settlements | null>(null)
  const [chainState, setChainState] = useState<ChainState | null>(null)
  const [chainId, setChainId] = useState<number | null>(null)

  const { latestBeeRelease } = useLatestBeeRelease()

  const [error, setError] = useState<Error | null>(initialValues.error)
  const [isLoading, setIsLoading] = useState<boolean>(initialValues.isLoading)
  const [lastUpdate, setLastUpdate] = useState<number | null>(initialValues.lastUpdate)
  const [frequency, setFrequency] = useState<number | null>(30000)

  const latestPublishedVersion = semver.coerce(latestBeeRelease?.name)?.version
  const latestUserVersion = semver.coerce(debugApiHealth?.version)?.version
  const latestUserVersionExact = debugApiHealth?.version

  useEffect(() => {
    setIsLoading(true)

    setApiHealth(false)

    if (beeApi !== null) refresh()
  }, [beeApi]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setIsLoading(true)

    setDebugApiHealth(null)
    setNodeAddresses(null)
    setNodeTopology(null)
    setNodeInfo(null)
    setPeers(null)
    setChequebookAddress(null)
    setChequebookBalance(null)
    setPeerBalances(null)
    setPeerCheques(null)
    setSettlements(null)
    setChainState(null)

    if (beeDebugApi !== null) refresh()
  }, [beeDebugApi]) // eslint-disable-line react-hooks/exhaustive-deps

  const refresh = async () => {
    // Don't want to refresh when already refreshing
    if (isRefreshing) return

    // Not a valid bee api
    if (!beeApi || !beeDebugApi) {
      setIsLoading(false)

      return
    }

    try {
      isRefreshing = true
      setError(null)

      // Wrap the chequebook balance call to return BZZ values as Token object
      const chequeBalanceWrapper = async () => {
        const { totalBalance, availableBalance } = await beeDebugApi.getChequebookBalance({ timeout: TIMEOUT })

        return {
          totalBalance: new Token(totalBalance),
          availableBalance: new Token(availableBalance),
        }
      }

      // Wrap the balances call to return BZZ values as Token object
      const peerBalanceWrapper = async () => {
        const { balances } = await beeDebugApi.getAllBalances({ timeout: TIMEOUT })

        return balances.map(({ peer, balance }) => ({ peer, balance: new Token(balance) }))
      }

      // Wrap the settlements call to return BZZ values as Token object
      const settlementsWrapper = async () => {
        const { totalReceived, settlements, totalSent } = await beeDebugApi.getAllSettlements({ timeout: TIMEOUT })

        return {
          totalReceived: new Token(totalReceived),
          totalSent: new Token(totalSent),
          settlements: settlements.map(({ peer, received, sent }) => ({
            peer,
            received: new Token(received),
            sent: new Token(sent),
          })),
        }
      }

      const promises = [
        // API health
        beeApi
          .isConnected({ timeout: TIMEOUT })
          .then(setApiHealth)
          .catch(() => setApiHealth(false)),

        // Debug API health
        beeDebugApi
          .getHealth({ timeout: TIMEOUT })
          .then(setDebugApiHealth)
          .catch(() => setDebugApiHealth(null)),

        // Debug API readiness
        beeDebugApi
          .getReadiness({ timeout: TIMEOUT })
          .then(setDebugApiReadiness)
          .catch(() => setDebugApiReadiness(false)),

        // Node Addresses
        beeDebugApi
          .getNodeAddresses({ timeout: TIMEOUT })
          .then(setNodeAddresses)
          .catch(() => setNodeAddresses(null)),

        // NodeInfo
        beeDebugApi
          .getNodeInfo({ timeout: TIMEOUT })
          .then(setNodeInfo)
          .catch(() => setNodeInfo(null)),

        // Network Topology
        beeDebugApi
          .getTopology({ timeout: TIMEOUT })
          .then(setNodeTopology)
          .catch(() => setNodeTopology(null)),

        // Peers
        beeDebugApi
          .getPeers({ timeout: TIMEOUT })
          .then(setPeers)
          .catch(() => setPeers(null)),

        // Chequebook address
        beeDebugApi
          .getChequebookAddress({ timeout: TIMEOUT })
          .then(setChequebookAddress)
          .catch(() => setChequebookAddress(null)),

        // Cheques
        beeDebugApi
          .getLastCheques({ timeout: TIMEOUT })
          .then(setPeerCheques)
          .catch(() => setPeerCheques(null)),

        // Chain state
        beeDebugApi
          .getChainState({ timeout: TIMEOUT })
          .then(setChainState)
          .catch(() => setChainState(null)),

        // Wallet
        beeDebugApi
          .getWalletBalance({ timeout: TIMEOUT })
          .then(({ chainID }) => setChainId(chainID))
          .catch(() => setChainId(null)),

        // Chequebook balance
        chequeBalanceWrapper()
          .then(setChequebookBalance)
          .catch(() => setChequebookBalance(null)),

        // Peer balances
        peerBalanceWrapper()
          .then(setPeerBalances)
          .catch(() => setPeerBalances(null)),

        // Settlements
        settlementsWrapper()
          .then(setSettlements)
          .catch(() => setSettlements(null)),
      ]

      await Promise.allSettled(promises)
    } catch (e) {
      setError(e as Error)
    }

    setIsLoading(false)
    isRefreshing = false
    setLastUpdate(Date.now())
  }

  const start = (freq = REFRESH_WHEN_OK) => {
    refresh()
    setFrequency(freq)
  }
  const stop = () => setFrequency(null)

  const status = getStatus(
    debugApiHealth,
    nodeAddresses,
    nodeInfo,
    apiHealth,
    topology,
    chequebookAddress,
    chequebookBalance,
    error,
  )

  useEffect(() => {
    let newFrequency = REFRESH_WHEN_OK

    if (status.all !== 'OK') newFrequency = REFRESH_WHEN_ERROR

    if (newFrequency !== frequency) setFrequency(newFrequency)
  }, [status.all, frequency])

  // Start the update loop
  useEffect(() => {
    // Start autorefresh only if the frequency is set
    if (frequency) {
      const interval = setInterval(refresh, frequency)

      return () => clearInterval(interval)
    }
  }, [frequency, beeDebugApi, beeApi]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Context.Provider
      value={{
        status,
        latestUserVersion,
        latestUserVersionExact,
        latestPublishedVersion,
        isLatestBeeVersion: Boolean(
          latestPublishedVersion &&
            latestUserVersion &&
            semver.satisfies(latestPublishedVersion, latestUserVersion, {
              includePrerelease: true,
            }),
        ),
        latestBeeVersionUrl: latestBeeRelease?.html_url || 'https://github.com/ethersphere/bee/releases/latest',
        error,
        apiHealth,
        debugApiHealth,
        debugApiReadiness,
        nodeAddresses,
        nodeInfo,
        topology,
        chequebookAddress,
        peers,
        chequebookBalance,
        peerBalances,
        peerCheques,
        settlements,
        chainState,
        chainId,
        latestBeeRelease,
        isLoading,
        lastUpdate,
        start,
        stop,
        refresh,
      }}
    >
      {children}
    </Context.Provider>
  )
}
