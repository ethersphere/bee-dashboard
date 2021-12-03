import { Bee, BeeDebug } from '@ethersphere/bee-js'
import { createContext, ReactChild, ReactElement, useEffect, useState } from 'react'
import { config } from '../config'

interface ContextInterface {
  apiUrl: string
  apiDebugUrl: string
  beeApi: Bee | null
  beeDebugApi: BeeDebug | null
  setApiUrl: (url: string) => void
  setDebugApiUrl: (url: string) => void
}

const initialValues: ContextInterface = {
  apiUrl: config.BEE_API_HOST,
  apiDebugUrl: config.BEE_DEBUG_API_HOST,
  beeApi: null,
  beeDebugApi: null,
  setApiUrl: () => {}, // eslint-disable-line
  setDebugApiUrl: () => {}, // eslint-disable-line
}

export const Context = createContext<ContextInterface>(initialValues)
export const Consumer = Context.Consumer

interface Props {
  children: ReactChild
  beeApiUrl?: string
  beeDebugApiUrl?: string
}

export function Provider({ children, beeApiUrl, beeDebugApiUrl }: Props): ReactElement {
  const [apiUrl, setApiUrl] = useState<string>(initialValues.apiUrl)
  const [apiDebugUrl, setDebugApiUrl] = useState<string>(initialValues.apiDebugUrl)
  const [beeApi, setBeeApi] = useState<Bee | null>(null)
  const [beeDebugApi, setBeeDebugApi] = useState<BeeDebug | null>(null)

  useEffect(() => {
    try {
      setBeeApi(new Bee(apiUrl))
      sessionStorage.setItem('api_host', apiUrl)
    } catch (e) {
      setBeeApi(null)
    }
  }, [apiUrl])

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('bee-api-url2', beeApiUrl)

    if (beeApiUrl) setApiUrl(beeApiUrl)
  }, [beeApiUrl])

  useEffect(() => {
    if (beeDebugApiUrl) setDebugApiUrl(beeDebugApiUrl)
  }, [beeDebugApiUrl])

  useEffect(() => {
    try {
      setBeeDebugApi(new BeeDebug(apiDebugUrl))
      sessionStorage.setItem('debug_api_host', apiDebugUrl)
    } catch (e) {
      setBeeDebugApi(null)
    }
  }, [apiDebugUrl])

  return (
    <Context.Provider value={{ apiUrl, apiDebugUrl, beeApi, beeDebugApi, setApiUrl, setDebugApiUrl }}>
      {children}
    </Context.Provider>
  )
}
