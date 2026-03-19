import {
  AllSettlements,
  BeeModes,
  BZZ,
  ChainState,
  ChequebookAddressResponse,
  ChequebookBalanceResponse,
  LastChequesResponse,
  NodeAddresses,
  NodeInfo,
  Peer,
  PeerBalance,
  Topology,
  WalletBalance,
} from '@ethersphere/bee-js'
import {
  createContext,
  ReactElement,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import { useLatestBeeRelease } from '../hooks/apiHooks'

import { Context as SettingsContext } from './Settings'

const LAUNCH_GRACE_PERIOD = 35_000
const REFRESH_WHEN_OK = 30_000
const REFRESH_WHEN_ERROR = 5_000
const TIMEOUT = 3_000

export enum CheckState {
  CONNECTING = 'Connecting',
  OK = 'OK',
  WARNING = 'Warning',
  ERROR = 'Error',
  STARTING = 'Starting',
}

interface StatusItem {
  isEnabled: boolean
  checkState: CheckState
}

interface Status {
  all: CheckState
  apiConnection: StatusItem
  topology: StatusItem
  chequebook: StatusItem
}

interface ContextInterface {
  beeVersion: string | null
  status: Status
  error: Error | null
  apiHealth: boolean
  nodeAddresses: NodeAddresses | null
  nodeInfo: NodeInfo | null
  topology: Topology | null
  chequebookAddress: ChequebookAddressResponse | null
  peers: Peer[] | null
  chequebookBalance: ChequebookBalanceResponse | null
  stake: BZZ | null
  peerBalances: PeerBalance[] | null
  peerCheques: LastChequesResponse | null
  settlements: AllSettlements | null
  chainState: ChainState | null
  walletBalance: WalletBalance | null
  latestBeeRelease: LatestBeeRelease | null
  isLoading: boolean
  lastUpdate: number | null
  start: (frequency?: number) => void
  stop: () => void
  refresh: () => Promise<void>
}

const initialValues: ContextInterface = {
  beeVersion: null,
  status: {
    all: CheckState.ERROR,
    apiConnection: { isEnabled: false, checkState: CheckState.ERROR },
    topology: { isEnabled: false, checkState: CheckState.ERROR },
    chequebook: { isEnabled: false, checkState: CheckState.ERROR },
  },
  error: null,
  apiHealth: false,
  nodeAddresses: null,
  nodeInfo: null,
  topology: null,
  chequebookAddress: null,
  stake: null,
  peers: null,
  chequebookBalance: null,
  peerBalances: null,
  peerCheques: null,
  settlements: null,
  chainState: null,
  walletBalance: null,
  latestBeeRelease: null,
  isLoading: true,
  lastUpdate: null,
  start: () => {},
  stop: () => {},
  refresh: () => Promise.reject(),
}

export const Context = createContext<ContextInterface>(initialValues)
export const Consumer = Context.Consumer

interface Props {
  children: ReactNode
}

interface StatusProps {
  nodeInfo: NodeInfo | null
  apiHealth: boolean
  topology: Topology | null
  isWarmingUp: boolean
  chequebookAddress: ChequebookAddressResponse | null
  chequebookBalance: ChequebookBalanceResponse | null
  error: Error | null
  startedAt: number
}

function getStatus(props: StatusProps): Status {
  const { nodeInfo, apiHealth, topology, isWarmingUp, chequebookAddress, chequebookBalance, error, startedAt } = {
    ...props,
  }

  const status: Status = { ...initialValues.status }

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

    if (chequebookAddress?.chequebookAddress && chequebookBalance !== null) {
      status.chequebook.checkState = CheckState.OK
    } else {
      status.chequebook.checkState = CheckState.WARNING
    }
  }

  status.all = determineOverallStatus(status, isWarmingUp, startedAt)

  return status
}

function determineOverallStatus(status: Status, isWarmingUp: boolean, startedAt: number): CheckState {
  const hasErrors = Object.values(status).some(
    ({ isEnabled, checkState }) => isEnabled && checkState === CheckState.ERROR,
  )
  const hasWarnings = Object.values(status).some(
    ({ isEnabled, checkState }) => isEnabled && checkState === CheckState.WARNING,
  )
  const isInGracePeriod = Date.now() - startedAt < LAUNCH_GRACE_PERIOD

  if (isWarmingUp || isInGracePeriod) {
    return CheckState.CONNECTING
  }

  if (hasErrors) {
    return CheckState.ERROR
  }

  if (hasWarnings) {
    return CheckState.WARNING
  }

  return CheckState.OK
}

function getFulfilledValue<T>(result: PromiseSettledResult<T>): T | null {
  return result.status === 'fulfilled' ? result.value : null
}

// This does not need to be exposed and works much better as variable than state variable which may trigger some unnecessary re-renders
let isRefreshing = false

export function Provider({ children }: Props): ReactElement {
  const { beeApi } = useContext(SettingsContext)

  const [beeVersion, setBeeVersion] = useState<string | null>(null)
  const [apiHealth, setApiHealth] = useState<boolean>(false)
  const [isWarmingUp, setIsWarmingUp] = useState<boolean>(true)
  const [nodeAddresses, setNodeAddresses] = useState<NodeAddresses | null>(null)
  const [nodeInfo, setNodeInfo] = useState<NodeInfo | null>(null)
  const [topology, setNodeTopology] = useState<Topology | null>(null)
  const [chequebookAddress, setChequebookAddress] = useState<ChequebookAddressResponse | null>(null)
  const [peers, setPeers] = useState<Peer[] | null>(null)
  const [chequebookBalance, setChequebookBalance] = useState<ChequebookBalanceResponse | null>(null)
  const [stake, setStake] = useState<BZZ | null>(null)
  const [peerBalances, setPeerBalances] = useState<PeerBalance[] | null>(null)
  const [peerCheques, setPeerCheques] = useState<LastChequesResponse | null>(null)
  const [settlements, setSettlements] = useState<AllSettlements | null>(null)
  const [chainState, setChainState] = useState<ChainState | null>(null)
  const [walletBalance, setWalletBalance] = useState<WalletBalance | null>(null)
  const [startedAt, setStartedAt] = useState(() => Date.now())

  const { latestBeeRelease } = useLatestBeeRelease()

  const [error, setError] = useState<Error | null>(initialValues.error)
  const [isLoading, setIsLoading] = useState<boolean>(initialValues.isLoading)
  const [lastUpdate, setLastUpdate] = useState<number | null>(initialValues.lastUpdate)
  const [frequency, setFrequency] = useState<number | null>(REFRESH_WHEN_OK)

  const frequencyRef = useRef<number | null>(frequency)

  useEffect(() => {
    if (isWarmingUp) return

    setStartedAt(Date.now())
    const timer = setTimeout(() => setStartedAt(0), LAUNCH_GRACE_PERIOD)

    return () => clearTimeout(timer)
  }, [isWarmingUp])

  const refresh = useCallback(async () => {
    // Don't want to refresh when already refreshing
    if (isRefreshing) {
      return
    }

    // Not a valid bee api
    if (!beeApi) {
      setIsLoading(false)

      return
    }

    isRefreshing = true

    const [
      healthResult,
      statusResult,
      nodeAddressesResult,
      nodeInfoResult,
      topologyResult,
      peersResult,
      chequebookAddressResult,
      peerChequesResult,
      chainStateResult,
      walletResult,
      chequebookBalanceResult,
      stakeResult,
      peerBalancesResult,
      settlementsResult,
    ] = await Promise.allSettled([
      beeApi.getHealth({ timeout: TIMEOUT }),
      beeApi.getStatus({ timeout: TIMEOUT }),
      beeApi.getNodeAddresses({ timeout: TIMEOUT }),
      beeApi.getNodeInfo({ timeout: TIMEOUT }),
      beeApi.getTopology({ timeout: TIMEOUT }),
      beeApi.getPeers({ timeout: TIMEOUT }),
      beeApi.getChequebookAddress({ timeout: TIMEOUT }),
      beeApi.getLastCheques({ timeout: TIMEOUT }),
      beeApi.getChainState({ timeout: TIMEOUT }),
      beeApi.getWalletBalance({ timeout: TIMEOUT }),
      beeApi.getChequebookBalance({ timeout: TIMEOUT }),
      beeApi.getStake({ timeout: TIMEOUT }),
      beeApi.getAllBalances({ timeout: TIMEOUT }),
      beeApi.getAllSettlements(),
    ])

    // All setters called synchronously — React 18 batches them into one render.
    const health = getFulfilledValue(healthResult)
    setBeeVersion(health?.version ?? null)
    setApiHealth(Boolean(health))

    setIsWarmingUp(getFulfilledValue(statusResult)?.isWarmingUp ?? false)
    setNodeAddresses(getFulfilledValue(nodeAddressesResult))
    setNodeInfo(getFulfilledValue(nodeInfoResult))
    setNodeTopology(getFulfilledValue(topologyResult))
    setPeers(getFulfilledValue(peersResult))
    setChequebookAddress(getFulfilledValue(chequebookAddressResult))
    setPeerCheques(getFulfilledValue(peerChequesResult))
    setChainState(getFulfilledValue(chainStateResult))
    setWalletBalance(getFulfilledValue(walletResult))
    setChequebookBalance(getFulfilledValue(chequebookBalanceResult))
    setStake(getFulfilledValue(stakeResult))
    setPeerBalances(getFulfilledValue(peerBalancesResult)?.balances ?? null)
    setSettlements(getFulfilledValue(settlementsResult))
    setError(null)
    setIsLoading(false)
    setLastUpdate(Date.now())

    isRefreshing = false
  }, [beeApi])

  const start = useCallback(
    (freq = REFRESH_WHEN_OK) => {
      refresh()
      setFrequency(freq)
    },
    [refresh],
  )
  const stop = useCallback(() => setFrequency(null), [])

  const status = useMemo(
    () =>
      getStatus({
        nodeInfo,
        apiHealth,
        topology,
        isWarmingUp,
        chequebookAddress,
        chequebookBalance,
        error,
        startedAt,
      }),
    [nodeInfo, apiHealth, topology, chequebookAddress, chequebookBalance, error, startedAt, isWarmingUp],
  )

  useEffect(() => {
    const setStates = () => {
      setIsLoading(true)
      setApiHealth(false)
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

      if (beeApi !== null) {
        refresh()
      }
    }

    setStates()
  }, [beeApi, refresh])

  useEffect(() => {
    frequencyRef.current = frequency
  }, [frequency])

  useEffect(() => {
    const newFrequency = status.all !== CheckState.OK ? REFRESH_WHEN_ERROR : REFRESH_WHEN_OK
    const setFrequencyState = () => {
      if (newFrequency !== frequencyRef.current) {
        setFrequency(newFrequency)
      }
    }

    setFrequencyState()
  }, [status.all])

  // Start the update loop
  useEffect(() => {
    // Start autorefresh only if the frequency is set
    if (frequency) {
      const interval = setInterval(refresh, frequency)

      return () => clearInterval(interval)
    }
  }, [frequency, beeApi, refresh])

  const contextValue = useMemo(
    () => ({
      beeVersion,
      status,
      error,
      apiHealth,
      nodeAddresses,
      nodeInfo,
      topology,
      chequebookAddress,
      peers,
      chequebookBalance,
      stake,
      peerBalances,
      peerCheques,
      settlements,
      chainState,
      walletBalance,
      latestBeeRelease,
      isLoading,
      lastUpdate,
      start,
      stop,
      refresh,
    }),
    [
      beeVersion,
      status,
      error,
      apiHealth,
      nodeAddresses,
      nodeInfo,
      topology,
      chequebookAddress,
      peers,
      chequebookBalance,
      stake,
      peerBalances,
      peerCheques,
      settlements,
      chainState,
      walletBalance,
      latestBeeRelease,
      isLoading,
      lastUpdate,
      start,
      stop,
      refresh,
    ],
  )

  return <Context.Provider value={contextValue}>{children}</Context.Provider>
}
