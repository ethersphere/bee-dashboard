import type {
  ChequebookAddressResponse,
  Health,
  LastChequesResponse,
  NodeAddresses,
  Peer,
  Topology,
} from '@ethersphere/bee-js'
import { createContext, ReactChild, ReactElement, useContext, useEffect, useState } from 'react'
import semver from 'semver'
import { engines } from '../../package.json'
import { useLatestBeeRelease } from '../hooks/apiHooks'
import { Token } from '../models/Token'
import type { Balance, ChequebookBalance, Settlements } from '../types'
import { Context as SettingsContext } from './Settings'

interface Status {
  all: boolean
  version: boolean
  blockchainConnection: boolean
  debugApiConnection: boolean
  apiConnection: boolean
  topology: boolean
  chequebook: boolean
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
  nodeAddresses: NodeAddresses | null
  topology: Topology | null
  chequebookAddress: ChequebookAddressResponse | null
  peers: Peer[] | null
  chequebookBalance: ChequebookBalance | null
  peerBalances: Balance[] | null
  peerCheques: LastChequesResponse | null
  settlements: Settlements | null
  latestBeeRelease: LatestBeeRelease | null
  isLoading: boolean
  isRefreshing: boolean
  lastUpdate: number | null
  start: (frequency?: number) => void
  stop: () => void
  refresh: () => Promise<void>
}

const startedInDevMode = window.location.search.includes('devMode=1')

const initialValues: ContextInterface = {
  status: {
    all: false,
    version: false,
    blockchainConnection: false,
    debugApiConnection: false,
    apiConnection: false,
    topology: false,
    chequebook: false,
  },
  latestPublishedVersion: undefined,
  latestUserVersion: undefined,
  latestUserVersionExact: undefined,
  isLatestBeeVersion: false,
  latestBeeVersionUrl: 'https://github.com/ethersphere/bee/releases/latest',
  error: null,
  apiHealth: false,
  debugApiHealth: null,
  nodeAddresses: null,
  topology: null,
  chequebookAddress: null,
  peers: null,
  chequebookBalance: null,
  peerBalances: null,
  peerCheques: null,
  settlements: null,
  latestBeeRelease: null,
  isLoading: true,
  isRefreshing: false,
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
  apiHealth: boolean,
  topology: Topology | null,
  chequebookAddress: ChequebookAddressResponse | null,
  chequebookBalance: ChequebookBalance | null,
  error: Error | null,
): Status {
  // FIXME: `devMode` is a temporary workaround to be able to develop with only one node
  const devMode = startedInDevMode || Boolean(process.env.REACT_APP_DEV_MODE)
  const status = {
    version: Boolean(
      debugApiHealth &&
        semver.satisfies(debugApiHealth.version, engines.bee, {
          includePrerelease: true,
        }),
    ),
    blockchainConnection: Boolean(nodeAddresses?.ethereum),
    debugApiConnection: Boolean(debugApiHealth?.status === 'ok'),
    apiConnection: apiHealth,
    topology: Boolean(topology?.connected && topology?.connected > 0) || devMode,
    chequebook:
      (Boolean(chequebookAddress?.chequebookAddress) &&
        chequebookBalance !== null &&
        chequebookBalance?.totalBalance.toBigNumber.isGreaterThan(0)) ||
      devMode,
  }

  return { ...status, all: !error && Object.values(status).every(v => v) }
}

export function Provider({ children }: Props): ReactElement {
  const { beeApi, beeDebugApi } = useContext(SettingsContext)
  const [apiHealth, setApiHealth] = useState<boolean>(false)
  const [debugApiHealth, setDebugApiHealth] = useState<Health | null>(null)
  const [nodeAddresses, setNodeAddresses] = useState<NodeAddresses | null>(null)
  const [topology, setNodeTopology] = useState<Topology | null>(null)
  const [chequebookAddress, setChequebookAddress] = useState<ChequebookAddressResponse | null>(null)
  const [peers, setPeers] = useState<Peer[] | null>(null)
  const [chequebookBalance, setChequebookBalance] = useState<ChequebookBalance | null>(null)
  const [peerBalances, setPeerBalances] = useState<Balance[] | null>(null)
  const [peerCheques, setPeerCheques] = useState<LastChequesResponse | null>(null)
  const [settlements, setSettlements] = useState<Settlements | null>(null)
  const { latestBeeRelease } = useLatestBeeRelease()

  const [error, setError] = useState<Error | null>(initialValues.error)
  const [isLoading, setIsLoading] = useState<boolean>(initialValues.isLoading)
  const [isRefreshing, setIsRefreshing] = useState<boolean>(initialValues.isRefreshing)
  const [lastUpdate, setLastUpdate] = useState<number | null>(initialValues.lastUpdate)
  const [frequency, setFrequency] = useState<number | null>(30000)

  const latestPublishedVersion = semver.coerce(latestBeeRelease?.name)?.version
  const latestUserVersion = semver.coerce(debugApiHealth?.version)?.version
  const latestUserVersionExact = debugApiHealth?.version

  useEffect(() => {
    setIsLoading(true)

    setApiHealth(false)

    refresh()
  }, [beeApi]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setIsLoading(true)

    setDebugApiHealth(null)
    setNodeAddresses(null)
    setNodeTopology(null)
    setPeers(null)
    setChequebookAddress(null)
    setChequebookBalance(null)
    setPeerBalances(null)
    setPeerCheques(null)
    setSettlements(null)

    refresh()
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
      setIsRefreshing(true)
      setError(null)

      // Wrap the chequebook balance call to return BZZ values as Token object
      const chequeBalanceWrapper = async () => {
        const { totalBalance, availableBalance } = await beeDebugApi.getChequebookBalance()

        return {
          totalBalance: new Token(totalBalance),
          availableBalance: new Token(availableBalance),
        }
      }

      // Wrap the balances call to return BZZ values as Token object
      const peerBalanceWrapper = async () => {
        const { balances } = await beeDebugApi.getAllBalances()

        return balances.map(({ peer, balance }) => ({ peer, balance: new Token(balance) }))
      }

      // Wrap the settlements call to return BZZ values as Token object
      const settlementsWrapper = async () => {
        const { totalReceived, settlements, totalSent } = await beeDebugApi.getAllSettlements()

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
          .isConnected()
          .then(setApiHealth)
          .catch(() => setApiHealth(false)),

        // Debug API health
        beeDebugApi
          .getHealth()
          .then(setDebugApiHealth)
          .catch(() => setDebugApiHealth(null)),

        // Node Addresses
        beeDebugApi
          .getNodeAddresses()
          .then(setNodeAddresses)
          .catch(() => setNodeAddresses(null)),

        // Network Topology
        beeDebugApi
          .getTopology()
          .then(setNodeTopology)
          .catch(() => setNodeTopology(null)),

        // Peers
        beeDebugApi
          .getPeers()
          .then(setPeers)
          .catch(() => setPeers(null)),

        // Chequebook address
        beeDebugApi
          .getChequebookAddress()
          .then(setChequebookAddress)
          .catch(() => setChequebookAddress(null)),

        // Cheques
        beeDebugApi
          .getLastCheques()
          .then(setPeerCheques)
          .catch(() => setPeerCheques(null)),

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
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
      setLastUpdate(Date.now())
    }
  }

  const start = (freq = 30000) => setFrequency(freq)
  const stop = () => setFrequency(null)

  // Start the update loop
  useEffect(() => {
    refresh()

    // Start autorefresh only if the frequency is set
    if (frequency) {
      const interval = setInterval(refresh, frequency)

      return () => clearInterval(interval)
    }
  }, [frequency, beeDebugApi, beeApi]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Context.Provider
      value={{
        status: getStatus(
          debugApiHealth,
          nodeAddresses,
          apiHealth,
          topology,
          chequebookAddress,
          chequebookBalance,
          error,
        ),
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
        nodeAddresses,
        topology,
        chequebookAddress,
        peers,
        chequebookBalance,
        peerBalances,
        peerCheques,
        settlements,
        latestBeeRelease,
        isLoading,
        isRefreshing,
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
