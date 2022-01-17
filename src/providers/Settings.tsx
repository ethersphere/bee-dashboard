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
  lockedApiSettings: boolean
}

const initialValues: ContextInterface = {
  apiUrl: config.BEE_API_HOST,
  apiDebugUrl: config.BEE_DEBUG_API_HOST,
  beeApi: null,
  beeDebugApi: null,
  setApiUrl: () => {}, // eslint-disable-line
  setDebugApiUrl: () => {}, // eslint-disable-line
  lockedApiSettings: false,
}

export const Context = createContext<ContextInterface>(initialValues)
export const Consumer = Context.Consumer

interface Props {
  children: ReactChild
  beeApiUrl?: string
  beeDebugApiUrl?: string
  lockedApiSettings?: boolean
}

export function Provider({
  children,
  beeApiUrl,
  beeDebugApiUrl,
  lockedApiSettings: extLockedApiSettings,
}: Props): ReactElement {
  const [apiUrl, setApiUrl] = useState<string>(initialValues.apiUrl)
  const [apiDebugUrl, setDebugApiUrl] = useState<string>(initialValues.apiDebugUrl)
  const [beeApi, setBeeApi] = useState<Bee | null>(null)
  const [beeDebugApi, setBeeDebugApi] = useState<BeeDebug | null>(null)
  const [lockedApiSettings] = useState<boolean>(Boolean(extLockedApiSettings))

  const url = beeApiUrl || apiUrl
  const debugUrl = beeDebugApiUrl || apiDebugUrl

  useEffect(() => {
    try {
      setBeeApi(new Bee(url))
      sessionStorage.setItem('api_host', url)
    } catch (e) {
      setBeeApi(null)
    }
  }, [url])

  useEffect(() => {
    try {
      setBeeDebugApi(new BeeDebug(debugUrl))
      sessionStorage.setItem('debug_api_host', debugUrl)
    } catch (e) {
      setBeeDebugApi(null)
    }
  }, [debugUrl])

  return (
    <Context.Provider
      value={{
        apiUrl: url,
        apiDebugUrl: debugUrl,
        beeApi,
        beeDebugApi,
        setApiUrl,
        setDebugApiUrl,
        lockedApiSettings,
      }}
    >
      {children}
    </Context.Provider>
  )
}
