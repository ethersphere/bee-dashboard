import { PostageBatch } from '@ethersphere/bee-js'
import { createContext, ReactChild, ReactElement, useEffect, useState } from 'react'
import { beeApi } from '../services/bee'

interface ContextInterface {
  stamps: PostageBatch[] | null
  error: Error | null
  isLoading: boolean
  lastUpdate: number | null
  start: (frequency?: number) => void
  stop: () => void
}

const initialValues: ContextInterface = {
  stamps: null,
  error: null,
  isLoading: false,
  lastUpdate: null,
  start: () => {}, // eslint-disable-line
  stop: () => {}, // eslint-disable-line
}

export const Context = createContext<ContextInterface>(initialValues)
export const Consumer = Context.Consumer

interface Props {
  children: ReactChild
}

export function Provider({ children }: Props): ReactElement {
  const [stamps, setStamps] = useState<PostageBatch[] | null>(initialValues.stamps)
  const [error, setError] = useState<Error | null>(initialValues.error)
  const [isLoading, setIsLoading] = useState<boolean>(initialValues.isLoading)
  const [lastUpdate, setLastUpdate] = useState<number | null>(initialValues.lastUpdate)
  const [frequency, setFrequency] = useState<number | null>()

  const refresh = () => {
    // Don't want to refresh back to back
    if (isLoading) return

    setIsLoading(true)
    beeApi.stamps
      .getPostageStamps()
      .then(stamps => {
        setStamps(stamps)
        setIsLoading(false)
        setLastUpdate(Date.now())
      })
      .catch(setError)
  }

  const start = (freq = 3000) => setFrequency(freq)
  const stop = () => setFrequency(null)

  useEffect(() => {
    refresh()

    if (frequency) {
      const interval = setInterval(refresh, frequency)

      return () => clearInterval(interval)
    }
  }, [frequency])

  return <Context.Provider value={{ stamps, error, isLoading, lastUpdate, start, stop }}>{children}</Context.Provider>
}
