import { createContext, ReactChild, ReactElement, useContext, useEffect, useState } from 'react'
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
  start: () => {}, // eslint-disable-line
  stop: () => {}, // eslint-disable-line
  refresh: () => Promise.reject(),
}

export const Context = createContext<ContextInterface>(initialValues)
export const Consumer = Context.Consumer

interface Props {
  children: ReactChild
}

export function Provider({ children }: Props): ReactElement {
  const { rpcProvider } = useContext(SettingsContext)
  const { nodeAddresses } = useContext(BeeContext)
  const [balance, setBalance] = useState<WalletAddress | null>(initialValues.balance)
  const [error, setError] = useState<Error | null>(initialValues.error)
  const [isLoading, setIsLoading] = useState<boolean>(initialValues.isLoading)
  const [lastUpdate, setLastUpdate] = useState<number | null>(initialValues.lastUpdate)
  const [frequency, setFrequency] = useState<number | null>(null)

  useEffect(() => {
    if (nodeAddresses?.ethereum && rpcProvider) {
      WalletAddress.make(nodeAddresses.ethereum.toHex(), rpcProvider).then(setBalance)
    } else {
      setBalance(null)
    }
  }, [nodeAddresses, rpcProvider])

  const refresh = async () => {
    // Don't want to refresh when already refreshing
    if (isLoading) return

    if (!balance) return

    try {
      setIsLoading(true)

      setBalance(await balance.refresh())
      setLastUpdate(Date.now())
    } catch (e) {
      setError(e as Error)
    } finally {
      setIsLoading(false)
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
  }, [frequency]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Context.Provider value={{ balance, error, isLoading, lastUpdate, start, stop, refresh }}>
      {children}
    </Context.Provider>
  )
}
