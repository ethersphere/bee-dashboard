import { PostageBatch } from '@ethersphere/bee-js'
import { createContext, ReactChild, ReactElement, useContext, useEffect, useState } from 'react'
import { Context as SettingsContext } from './Settings'

export interface EnrichedPostageBatch extends PostageBatch {
  usage: number
  usageText: string
}

interface ContextInterface {
  stamps: EnrichedPostageBatch[] | null
  error: Error | null
  isLoading: boolean
  lastUpdate: number | null
  start: (frequency?: number) => void
  stop: () => void
  refresh: () => Promise<void>
}

const initialValues: ContextInterface = {
  stamps: null,
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

export function enrichStamp(postageBatch: PostageBatch): EnrichedPostageBatch {
  const { depth, bucketDepth, utilization } = postageBatch

  const usage = utilization / Math.pow(2, depth - bucketDepth)
  const usageText = `${Math.ceil(usage * 100)}%`

  return {
    ...postageBatch,
    usage,
    usageText,
  }
}

export function Provider({ children }: Props): ReactElement {
  const { beeApi } = useContext(SettingsContext)
  const [stamps, setStamps] = useState<EnrichedPostageBatch[] | null>(initialValues.stamps)
  const [error, setError] = useState<Error | null>(initialValues.error)
  const [isLoading, setIsLoading] = useState<boolean>(initialValues.isLoading)
  const [lastUpdate, setLastUpdate] = useState<number | null>(initialValues.lastUpdate)
  const [frequency, setFrequency] = useState<number | null>(null)

  const refresh = async () => {
    if (isLoading) {
      return
    }

    if (!beeApi) {
      return
    }

    try {
      setIsLoading(true)
      const stamps = await beeApi.getAllPostageBatch()

      setStamps(stamps.filter(x => x.exists).map(enrichStamp))
      setLastUpdate(Date.now())
      setError(null)
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
    <Context.Provider value={{ stamps, error, isLoading, lastUpdate, start, stop, refresh }}>
      {children}
    </Context.Provider>
  )
}
