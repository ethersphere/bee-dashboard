import {
  BeeModes,
  ChainState,
  ChequebookAddressResponse,
  LastChequesResponse,
  NodeAddresses,
  NodeInfo,
  Peer,
  Topology,
} from '@ethersphere/bee-js'
import { ReactChild, ReactElement, createContext, useContext, useEffect, useState } from 'react'
import { useLatestBeeRelease } from '../hooks/apiHooks'
import { BzzToken } from '../models/BzzToken'
import { Token } from '../models/Token'
import type { Balance, ChequebookBalance, Settlements } from '../types'
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
  status: Status
  error: Error | null
  apiHealth: boolean
  nodeAddresses: NodeAddresses | null
  nodeInfo: NodeInfo | null
  topology: Topology | null
  chequebookAddress: ChequebookAddressResponse | null
  peers: Peer[] | null
  chequebookBalance: ChequebookBalance | null
  stake: BzzToken | null
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
  nodeInfo: NodeInfo | null,
  apiHealth: boolean,
  topology: Topology | null,
  chequebookAddress: ChequebookAddressResponse | null,
  chequebookBalance: ChequebookBalance | null,
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
  const [apiHealth, setApiHealth] = useState<boolean>(false)
  const [nodeAddresses, setNodeAddresses] = useState<NodeAddresses | null>(null)
  const [nodeInfo, setNodeInfo] = useState<NodeInfo | null>(null)
  const [topology, setNodeTopology] = useState<Topology | null>(null)
  const [chequebookAddress, setChequebookAddress] = useState<ChequebookAddressResponse | null>(null)
  const [peers, setPeers] = useState<Peer[] | null>(null)
  const [chequebookBalance, setChequebookBalance] = useState<ChequebookBalance | null>(null)
  const [stake, setStake] = useState<BzzToken | null>(null)
  const [peerBalances, setPeerBalances] = useState<Balance[] | null>(null)
  const [peerCheques, setPeerCheques] = useState<LastChequesResponse | null>(null)
  const [settlements, setSettlements] = useState<Settlements | null>(null)
  const [chainState, setChainState] = useState<ChainState | null>(null)
  const [chainId, setChainId] = useState<number | null>(null)
  const [startedAt] = useState(Date.now())

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

      // Wrap the chequebook balance call to return BZZ values as Token object
      const chequeBalanceWrapper = async () => {
        const { totalBalance, availableBalance } = await beeApi.getChequebookBalance({ timeout: TIMEOUT })

        return {
          totalBalance: new Token(totalBalance),
          availableBalance: new Token(availableBalance),
        }
      }

      // Wrap the balances call to return BZZ values as Token object
      const peerBalanceWrapper = async () => {
        const { balances } = await beeApi.getAllBalances({ timeout: TIMEOUT })

        return balances.map(({ peer, balance }) => ({ peer, balance: new Token(balance) }))
      }

      // Wrap the settlements call to return BZZ values as Token object
      const settlementsWrapper = async () => {
        const { totalReceived, settlements, totalSent } = await beeApi.getAllSettlements({ timeout: TIMEOUT })

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
          .then(({ chainID }) => setChainId(chainID))
          .catch(() => setChainId(null)),

        // Chequebook balance
        chequeBalanceWrapper()
          .then(setChequebookBalance)
          .catch(() => setChequebookBalance(null)),

        beeApi
          .getStake({ timeout: TIMEOUT })
          .then(stake => setStake(new BzzToken(stake)))
          .catch(() => setStake(null)),

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

  const status = getStatus(nodeInfo, apiHealth, topology, chequebookAddress, chequebookBalance, error, startedAt)

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
