import { Bee, BeeDebug } from '@ethersphere/bee-js'
import { providers } from 'ethers'
import { createContext, ReactNode, ReactElement, useEffect, useState } from 'react'
import { useGetBeeConfig } from '../hooks/apiHooks'
import { restartBeeNode, setJsonRpcInDesktop } from '../utils/desktop'
import { DEFAULT_BEE_API_HOST, DEFAULT_BEE_DEBUG_API_HOST, DEFAULT_RPC_URL } from '../constants'

const LocalStorageKeys = {
  providerUrl: 'json-rpc-provider',
}

const providerUrl = localStorage.getItem('json-rpc-provider') || DEFAULT_RPC_URL

interface ContextInterface {
  apiUrl: string
  apiDebugUrl: string
  beeApi?: Bee
  beeDebugApi?: BeeDebug
  lockedApiSettings: boolean
  desktopApiKey: string
  isDesktop: boolean
  desktopUrl: string
  providerUrl: string
  provider: providers.JsonRpcProvider
  cors?: string
  dataDir?: string
  ensResolver?: string
  setApiUrl: (url: string) => void
  setDebugApiUrl: (url: string) => void
  setAndPersistJsonRpcProvider: (url: string) => Promise<void>
  isLoading: boolean
  error?: Error
}

const initialValues: ContextInterface = {
  apiUrl: DEFAULT_BEE_API_HOST,
  apiDebugUrl: DEFAULT_BEE_DEBUG_API_HOST,
  setApiUrl: () => {}, // eslint-disable-line
  setDebugApiUrl: () => {}, // eslint-disable-line
  lockedApiSettings: false,
  isDesktop: false,
  desktopApiKey: '',
  desktopUrl: window.location.origin,
  setAndPersistJsonRpcProvider: async () => {}, // eslint-disable-line
  providerUrl,
  provider: new providers.JsonRpcProvider(providerUrl),
  isLoading: true,
}

export const Context = createContext<ContextInterface>(initialValues)
export const Consumer = Context.Consumer

interface InitialSettings {
  beeApiUrl?: string
  beeDebugApiUrl?: string
  lockedApiSettings?: boolean
  isDesktop?: boolean
  desktopUrl?: string
}

interface Props extends InitialSettings {
  children: ReactNode
}

export function Provider({ children, ...propsSettings }: Props): ReactElement {
  const desktopUrl = propsSettings.desktopUrl ?? initialValues.desktopUrl
  const isDesktop = Boolean(propsSettings.isDesktop)

  const [apiUrl, setApiUrl] = useState<string>(initialValues.apiUrl)
  const [apiDebugUrl, setDebugApiUrl] = useState<string>(initialValues.apiDebugUrl)
  const [beeApi, setBeeApi] = useState<Bee | undefined>()
  const [beeDebugApi, setBeeDebugApi] = useState<BeeDebug | undefined>()
  const [desktopApiKey, setDesktopApiKey] = useState<string>(initialValues.desktopApiKey)
  const [providerUrl, setProviderUrl] = useState(initialValues.providerUrl)
  const [provider, setProvider] = useState(initialValues.provider)
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
      setBeeApi(undefined)
    }
  }, [url])

  useEffect(() => {
    try {
      setBeeDebugApi(new BeeDebug(debugUrl))
      sessionStorage.setItem('debug_api_host', debugUrl)
    } catch (e) {
      setBeeDebugApi(undefined)
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
        provider,
        providerUrl,
        cors: config?.['cors-allowed-origins'],
        dataDir: config?.['data-dir'],
        ensResolver: config?.['resolver-options'],
        setAndPersistJsonRpcProvider: setAndPersistJsonRpcProviderClosure(isDesktop, setProviderUrl, setProvider),
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
  isBeeDesktop: boolean,
  setProviderUrl: (url: string) => void,
  setProvider: (prov: providers.JsonRpcProvider) => void,
) {
  return async (providerUrl: string) => {
    try {
      localStorage.setItem(LocalStorageKeys.providerUrl, providerUrl)
      setProviderUrl(providerUrl)
      setProvider(new providers.JsonRpcProvider(providerUrl))

      if (isBeeDesktop) {
        await setJsonRpcInDesktop(providerUrl)
        await restartBeeNode()
      }
    } catch (error) {
      console.error(error) // eslint-disable-line
    }
  }
}
