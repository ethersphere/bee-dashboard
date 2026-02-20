import { PostageBatch } from '@ethersphere/bee-js'
import { createContext, ReactElement, ReactNode, useCallback, useContext, useEffect, useRef, useState } from 'react'

import { Context as SettingsContext } from './Settings'

const DEFUALT_REFRESH_REQUENCY_MS = 30_000

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
  start: () => {},
  stop: () => {},
  refresh: () => Promise.reject(),
}

export const Context = createContext<ContextInterface>(initialValues)
export const Consumer = Context.Consumer

interface Props {
  children: ReactNode
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

  const isLoadingRef = useRef<boolean>(isLoading)

  useEffect(() => {
    isLoadingRef.current = isLoading
  }, [isLoading])

  const refresh = useCallback(async () => {
    if (isLoadingRef.current || !beeApi) {
      return
    }

    try {
      setIsLoading(true)
      const stamps = await beeApi.getPostageBatches()

      setStamps(stamps.map(enrichStamp))
      setLastUpdate(Date.now())
      setError(null)
    } catch (e) {
      setError(e as Error)
    } finally {
      setIsLoading(false)
    }
  }, [beeApi])

  const start = (freq = DEFUALT_REFRESH_REQUENCY_MS) => setFrequency(freq)
  const stop = () => setFrequency(null)

  useEffect(() => {
    if (beeApi) {
      refresh()
    }
  }, [beeApi, refresh])

  useEffect(() => {
    if (frequency) {
      const interval = setInterval(refresh, frequency)

      return () => clearInterval(interval)
    }
  }, [frequency, refresh])

  return (
    <Context.Provider value={{ stamps, error, isLoading, lastUpdate, start, stop, refresh }}>
      {children}
    </Context.Provider>
  )
}
