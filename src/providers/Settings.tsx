import { Bee, BeeDebug } from '@ethersphere/bee-js'
import { providers } from 'ethers'
import { createContext, ReactChild, ReactElement, useEffect, useState } from 'react'
import { config } from '../config'
import { BeeConfig, useGetBeeConfig } from '../hooks/apiHooks'
import { setJsonRpcInDesktop } from '../utils/desktop'

const LocalStorageKeys = {
  providerUrl: 'json-rpc-provider',
}

const providerUrl = localStorage.getItem('json-rpc-provider') || config.DEFAULT_RPC_URL

interface ContextInterface {
  apiUrl: string
  apiDebugUrl: string
  beeApi: Bee | null
  beeDebugApi: BeeDebug | null
  setApiUrl: (url: string) => void
  setDebugApiUrl: (url: string) => void
  lockedApiSettings: boolean
  desktopApiKey: string
  config: BeeConfig | null
  setAndPersistJsonRpcProvider: (url: string) => void
  providerUrl: string
  provider: providers.JsonRpcProvider
  isLoading: boolean
  error: Error | null
}

const initialValues: ContextInterface = {
  apiUrl: config.BEE_API_HOST,
  apiDebugUrl: config.BEE_DEBUG_API_HOST,
  beeApi: null,
  beeDebugApi: null,
  setApiUrl: () => {}, // eslint-disable-line
  setDebugApiUrl: () => {}, // eslint-disable-line
  lockedApiSettings: false,
  desktopApiKey: '',
  config: null,
  setAndPersistJsonRpcProvider: () => {}, // eslint-disable-line
  providerUrl,
  provider: new providers.JsonRpcProvider(providerUrl),
  isLoading: true,
  error: null,
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
  const [desktopApiKey, setDesktopApiKey] = useState<string>(initialValues.desktopApiKey)
  const [providerUrl, setProviderUrl] = useState(initialValues.providerUrl)
  const [provider, setProvider] = useState(initialValues.provider)
  const { config, isLoading, error } = useGetBeeConfig()

  function setAndPersistJsonRpcProvider(providerUrl: string) {
    localStorage.setItem(LocalStorageKeys.providerUrl, providerUrl)
    setProviderUrl(providerUrl)
    setProvider(new providers.JsonRpcProvider(providerUrl))
    // eslint-disable-next-line no-console
    setJsonRpcInDesktop(providerUrl).catch(console.error)
  }

  function makeHttpUrl(string: string): string {
    if (!string.startsWith('http')) {
      return `http://${string}`
    }

    return string
  }

  const url = makeHttpUrl(config?.['api-addr'] || beeApiUrl || apiUrl)
  const debugUrl = makeHttpUrl(config?.['debug-api-addr'] || beeDebugApiUrl || apiDebugUrl)

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search)
    const newApiKey = urlSearchParams.get('v')

    if (newApiKey) {
      localStorage.setItem('apiKey', newApiKey)
      window.location.search = ''
      setDesktopApiKey(newApiKey)
    }
  }, [])

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
        desktopApiKey,
        config,
        provider,
        providerUrl,
        setAndPersistJsonRpcProvider,
        isLoading,
        error,
      }}
    >
      {children}
    </Context.Provider>
  )
}
