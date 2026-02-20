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

import { WalletAddress } from '../utils/wallet'

import { Context as BeeContext } from './Bee'
import { Context as SettingsContext } from './Settings'

interface ContextInterface {
  balance: WalletAddress | null
  error: Error | null
  isLoading: boolean
  lastUpdate: number | null
  start: (frequency?: number) => void
  stop: () => void
  refresh: () => Promise<void>
}

const initialValues: ContextInterface = {
  balance: null,
  error: null,
  isLoading: false,
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

const DEFUALT_REFRESH_REQUENCY_MS = 30_000

export function Provider({ children }: Props): ReactElement {
  const { rpcProvider } = useContext(SettingsContext)
  const { nodeAddresses } = useContext(BeeContext)
  const [balance, setBalance] = useState<WalletAddress | null>(initialValues.balance)
  const [error, setError] = useState<Error | null>(initialValues.error)
  const [isLoading, setIsLoading] = useState<boolean>(initialValues.isLoading)

  const balanceRef = useRef<WalletAddress | null>(balance)
  const isLoadingRef = useRef<boolean>(isLoading)
  const [lastUpdate, setLastUpdate] = useState<number | null>(initialValues.lastUpdate)
  const [frequency, setFrequency] = useState<number | null>(null)

  useEffect(() => {
    balanceRef.current = balance
  }, [balance])

  useEffect(() => {
    isLoadingRef.current = isLoading
  }, [isLoading])

  useEffect(() => {
    if (nodeAddresses?.ethereum && rpcProvider) {
      WalletAddress.make(nodeAddresses.ethereum.toHex(), rpcProvider).then(setBalance)
    } else {
      setBalance(null)
    }
  }, [nodeAddresses, rpcProvider])

  const refresh = useCallback(async () => {
    // Don't want to refresh when already refreshing
    if (isLoadingRef.current) return

    if (!balanceRef.current) return

    try {
      setIsLoading(true)

      setBalance(await balanceRef.current.refresh())
      setLastUpdate(Date.now())
    } catch (e) {
      setError(e as Error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const start = useCallback((freq = DEFUALT_REFRESH_REQUENCY_MS) => setFrequency(freq), [])
  const stop = useCallback(() => setFrequency(null), [])

  // Start the update loop
  useEffect(() => {
    refresh()

    // Start autorefresh only if the frequency is set
    if (frequency) {
      const interval = setInterval(refresh, frequency)

      return () => clearInterval(interval)
    }
  }, [frequency, refresh])

  const contextValue = useMemo(
    () => ({
      balance,
      error,
      isLoading,
      lastUpdate,
      start,
      stop,
      refresh,
    }),
    [balance, error, isLoading, lastUpdate, start, stop, refresh],
  )

  return <Context.Provider value={contextValue}>{children}</Context.Provider>
}
