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
import { createContext, ReactChild, ReactElement, useContext, useEffect, useState } from 'react'
import { useLatestBeeRelease } from '../hooks/apiHooks'
import { Context as SettingsContext } from './Settings'

const LAUNCH_GRACE_PERIOD = 15_000
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
  setStatus: (status: Status) => void
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
  setStatus: () => {}, // eslint-disable-line
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
  nodeInfo: NodeInfo | null,
  apiHealth: boolean,
  topology: Topology | null,
  chequebookAddress: ChequebookAddressResponse | null,
  chequebookBalance: ChequebookBalanceResponse | null,
  error: Error | null,
  startedAt: number,
): Status {
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
    } else status.chequebook.checkState = CheckState.OK
  }

  status.all = determineOverallStatus(status, startedAt)

  return status
}

function determineOverallStatus(status: Status, startedAt: number): CheckState {
  const hasErrors = Object.values(status).some(
    ({ isEnabled, checkState }) => isEnabled && checkState === CheckState.ERROR,
  )
  const hasWarnings = Object.values(status).some(
    ({ isEnabled, checkState }) => isEnabled && checkState === CheckState.WARNING,
  )
  const isInGracePeriod = Date.now() - startedAt < LAUNCH_GRACE_PERIOD

  if (hasErrors && isInGracePeriod) {
    return CheckState.CONNECTING
  } else if (hasErrors) {
    return CheckState.ERROR
  } else if (hasWarnings) {
    return CheckState.WARNING
  } else {
    return CheckState.OK
  }
}

// This does not need to be exposed and works much better as variable than state variable which may trigger some unnecessary re-renders
let isRefreshing = false

interface Props {
  children: ReactChild
}

export function Provider({ children }: Props): ReactElement {
  const { beeApi } = useContext(SettingsContext)
  const [beeVersion, setBeeVersion] = useState<string | null>(null)
  const [apiHealth, setApiHealth] = useState<boolean>(false)
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
  const [startedAt] = useState(Date.now())

  // Make status stateful
  const [status, setStatus] = useState<Status>(initialValues.status)

  const { latestBeeRelease } = useLatestBeeRelease()

  const [error, setError] = useState<Error | null>(initialValues.error)
  const [isLoading, setIsLoading] = useState<boolean>(initialValues.isLoading)
  const [lastUpdate, setLastUpdate] = useState<number | null>(initialValues.lastUpdate)
  const [frequency, setFrequency] = useState<number | null>(30000)

  useEffect(() => {
    setIsLoading(true)

    setApiHealth(false)

    if (beeApi !== null) refresh()
  }, [beeApi]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setIsLoading(true)
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
  }, [beeApi]) // eslint-disable-line react-hooks/exhaustive-deps

  const refresh = async () => {
    // Don't want to refresh when already refreshing
    if (isRefreshing) {
      return
    }

    // Not a valid bee api
    if (!beeApi) {
      setIsLoading(false)

      return
    }

    try {
      isRefreshing = true
      setError(null)

      const promises = [
        // API health
        beeApi
          .getHealth({ timeout: TIMEOUT })
          .then(response => setBeeVersion(response.version))
          .then(() => setApiHealth(true))
          .catch(() => {
            setBeeVersion(null)
            setApiHealth(false)
          }),

        // Node Addresses
        beeApi
          .getNodeAddresses({ timeout: TIMEOUT })
          .then(setNodeAddresses)
          .catch(() => setNodeAddresses(null)),

        // NodeInfo
        beeApi
          .getNodeInfo({ timeout: TIMEOUT })
          .then(setNodeInfo)
          .catch(() => setNodeInfo(null)),

        // Network Topology
        beeApi
          .getTopology({ timeout: TIMEOUT })
          .then(setNodeTopology)
          .catch(() => setNodeTopology(null)),

        // Peers
        beeApi
          .getPeers({ timeout: TIMEOUT })
          .then(setPeers)
          .catch(() => setPeers(null)),

        // Chequebook address
        beeApi
          .getChequebookAddress({ timeout: TIMEOUT })
          .then(setChequebookAddress)
          .catch(() => setChequebookAddress(null)),

        // Cheques
        beeApi
          .getLastCheques({ timeout: TIMEOUT })
          .then(setPeerCheques)
          .catch(() => setPeerCheques(null)),

        // Chain state
        beeApi
          .getChainState({ timeout: TIMEOUT })
          .then(setChainState)
          .catch(() => setChainState(null)),

        // Wallet
        beeApi
          .getWalletBalance({ timeout: TIMEOUT })
          .then(setWalletBalance)
          .catch(() => setWalletBalance(null)),

        // Chequebook balance
        beeApi
          .getChequebookBalance({ timeout: TIMEOUT })
          .then(setChequebookBalance)
          .catch(() => setChequebookBalance(null)),

        beeApi
          .getStake({ timeout: TIMEOUT })
          .then(stake => setStake(stake))
          .catch(() => setStake(null)),

        // Peer balances
        beeApi
          .getAllBalances({ timeout: TIMEOUT })
          .then(x => setPeerBalances(x.balances))
          .catch(() => setPeerBalances(null)),

        // Settlements
        beeApi
          .getAllSettlements()
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

  // Update status when dependent values change
  useEffect(() => {
    const newStatus = getStatus(nodeInfo, apiHealth, topology, chequebookAddress, chequebookBalance, error, startedAt)
    setStatus(newStatus)
  }, [nodeInfo, apiHealth, topology, chequebookAddress, chequebookBalance, error, startedAt])

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
  }, [frequency, beeApi]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Context.Provider
      value={{
        beeVersion,
        status,
        setStatus,
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
      }}
    >
      {children}
    </Context.Provider>
  )
}
