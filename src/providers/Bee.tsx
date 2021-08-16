import type { ChequebookBalance, Balance, Settlements } from '../types'
import { createContext, ReactChild, ReactElement, useEffect, useState } from 'react'
import { beeApi, beeDebugApi } from '../services/bee'
import { Token } from '../models/Token'
import semver from 'semver'
import { engines } from '../../package.json'

import type {
  NodeAddresses,
  ChequebookAddressResponse,
  LastChequesResponse,
  Health,
  Peer,
  Topology,
} from '@ethersphere/bee-js'
import { useLatestBeeRelease } from '../hooks/apiHooks'

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
  latestBeeRelease: LatestBeeRelease | null,
  debugApiHealth: Health | null,
  nodeAddresses: NodeAddresses | null,
  apiHealth: boolean,
  topology: Topology | null,
  chequebookAddress: ChequebookAddressResponse | null,
  chequebookBalance: ChequebookBalance | null,
): Status {
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
    topology: Boolean(topology?.connected && topology?.connected > 0),
    chequebook:
      Boolean(chequebookAddress?.chequebookAddress) &&
      chequebookBalance !== null &&
      chequebookBalance?.totalBalance.toBigNumber.isGreaterThan(0),
  }

  return { ...status, all: Object.values(status).every(v => v) }
}

export function Provider({ children }: Props): ReactElement {
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

  const refresh = async () => {
    // Don't want to refresh when already refreshing
    if (isRefreshing) return

    try {
      setIsRefreshing(true)

      setApiHealth(await beeApi.status.health())
      setDebugApiHealth(await beeDebugApi.status.nodeHealth())
      setNodeAddresses(await beeDebugApi.connectivity.addresses())
      setNodeTopology(await beeDebugApi.connectivity.topology())
      setChequebookAddress(await beeDebugApi.chequebook.address())
      setPeers(await beeDebugApi.connectivity.listPeers())

      const { totalBalance, availableBalance } = await beeDebugApi.chequebook.balance()
      setChequebookBalance({
        totalBalance: new Token(totalBalance),
        availableBalance: new Token(availableBalance),
      })

      const { balances } = await beeDebugApi.balance.balances()
      setPeerBalances(balances.map(({ peer, balance }) => ({ peer, balance: new Token(balance) })))

      setPeerCheques(await beeDebugApi.chequebook.getLastCheques())
      const { totalReceived, settlements, totalSent } = await beeDebugApi.settlements.getSettlements()
      setSettlements({
        totalReceived: new Token(totalReceived),
        totalSent: new Token(totalSent),
        settlements: settlements.map(({ peer, received, sent }) => ({
          peer,
          received: new Token(received),
          sent: new Token(sent),
        })),
      })

      setLastUpdate(Date.now())
    } catch (e) {
      setError(e)
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
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
  }, [frequency])

  return (
    <Context.Provider
      value={{
        status: getStatus(
          latestBeeRelease,
          debugApiHealth,
          nodeAddresses,
          apiHealth,
          topology,
          chequebookAddress,
          chequebookBalance,
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
