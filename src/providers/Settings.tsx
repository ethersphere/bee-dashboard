import { Bee, BeeDebug } from '@ethersphere/bee-js'
import { providers } from 'ethers'
import { ReactElement, ReactNode, createContext, useEffect, useState } from 'react'
import { DEFAULT_BEE_API_HOST, DEFAULT_BEE_DEBUG_API_HOST, DEFAULT_RPC_URL } from '../constants'
import { useGetBeeConfig } from '../hooks/apiHooks'

const LocalStorageKeys = {
  providerUrl: 'json-rpc-provider',
}

interface ContextInterface {
  apiUrl: string
  apiDebugUrl: string
  beeApi: Bee | null
  beeDebugApi: BeeDebug | null
  lockedApiSettings: boolean
  desktopApiKey: string
  isDesktop: boolean
  desktopUrl: string
  rpcProviderUrl: string
  rpcProvider: providers.JsonRpcProvider | null
  cors: string | null
  dataDir: string | null
  ensResolver: string | null
  setApiUrl: (url: string) => void
  setDebugApiUrl: (url: string) => void
  setAndPersistJsonRpcProvider: (url: string) => void
  isLoading: boolean
  error: Error | null
}

const initialValues: ContextInterface = {
  beeApi: null,
  beeDebugApi: null,
  apiUrl: DEFAULT_BEE_API_HOST,
  apiDebugUrl: DEFAULT_BEE_DEBUG_API_HOST,
  setApiUrl: () => {}, // eslint-disable-line
  setDebugApiUrl: () => {}, // eslint-disable-line
  lockedApiSettings: false,
  isDesktop: false,
  desktopApiKey: '',
  desktopUrl: window.location.origin,
  setAndPersistJsonRpcProvider: async () => {}, // eslint-disable-line
  rpcProviderUrl: '',
  rpcProvider: null,
  cors: null,
  dataDir: null,
  ensResolver: null,
  isLoading: true,
  error: null,
}

export const Context = createContext<ContextInterface>(initialValues)
export const Consumer = Context.Consumer

interface InitialSettings {
  beeApiUrl?: string
  beeDebugApiUrl?: string
  lockedApiSettings?: boolean
  isDesktop?: boolean
  desktopUrl?: string
  defaultRpcUrl?: string
}

interface Props extends InitialSettings {
  children: ReactNode
}

export function Provider({ children, ...propsSettings }: Props): ReactElement {
  const desktopUrl = propsSettings.desktopUrl ?? initialValues.desktopUrl
  const isDesktop = Boolean(propsSettings.isDesktop)
  const propsProviderUrl =
    localStorage.getItem(LocalStorageKeys.providerUrl) || propsSettings.defaultRpcUrl || DEFAULT_RPC_URL

  const [apiUrl, setApiUrl] = useState<string>(initialValues.apiUrl)
  const [apiDebugUrl, setDebugApiUrl] = useState<string>(initialValues.apiDebugUrl)
  const [beeApi, setBeeApi] = useState<Bee | null>(null)
  const [beeDebugApi, setBeeDebugApi] = useState<BeeDebug | null>(null)
  const [desktopApiKey, setDesktopApiKey] = useState<string>(initialValues.desktopApiKey)
  const [rpcProviderUrl, setRpcProviderUrl] = useState(propsProviderUrl)
  const [rpcProvider, setRpcProvider] = useState(new providers.JsonRpcProvider(propsProviderUrl))
  const { config, isLoading, error } = useGetBeeConfig(desktopUrl)

  const url = makeHttpUrl(
    config?.['api-addr'] ?? sessionStorage.getItem('api_host') ?? propsSettings.beeApiUrl ?? apiUrl,
  )
  const debugUrl = makeHttpUrl(
    config?.['debug-api-addr'] ??
      sessionStorage.getItem('debug_api_host') ??
      propsSettings.beeDebugApiUrl ??
      apiDebugUrl,
  )

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
        lockedApiSettings: Boolean(propsSettings.lockedApiSettings),
        desktopApiKey,
        isDesktop,
        desktopUrl,
        rpcProvider,
        rpcProviderUrl,
        cors: config?.['cors-allowed-origins'] ?? null,
        dataDir: config?.['data-dir'] ?? null,
        ensResolver: config?.['resolver-options'] ?? null,
        setAndPersistJsonRpcProvider: setAndPersistJsonRpcProviderClosure(setRpcProviderUrl, setRpcProvider),
        isLoading,
        error,
      }}
    >
      {children}
    </Context.Provider>
  )
}

function makeHttpUrl(string: string): string {
  if (!string.startsWith('http')) {
    return `http://${string}`
  }

  return string
}

function setAndPersistJsonRpcProviderClosure(
  setProviderUrl: (url: string) => void,
  setProvider: (prov: providers.JsonRpcProvider) => void,
) {
  return (providerUrl: string) => {
    localStorage.setItem(LocalStorageKeys.providerUrl, providerUrl)
    setProviderUrl(providerUrl)
    setProvider(new providers.JsonRpcProvider(providerUrl))
  }
}
