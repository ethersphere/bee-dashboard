import { Bee } from '@ethersphere/bee-js'
import { providers } from 'ethers'
import { ReactElement, ReactNode, createContext, useEffect, useState } from 'react'
import { DEFAULT_BEE_API_HOST, DEFAULT_RPC_URL } from '../constants'
import { useGetBeeConfig } from '../hooks/apiHooks'

const LocalStorageKeys = {
  providerUrl: 'json-rpc-provider',
}

interface ContextInterface {
  apiUrl: string
  beeApi: Bee | null
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
  setAndPersistJsonRpcProvider: (url: string) => void
  isLoading: boolean
  error: Error | null
}

const initialValues: ContextInterface = {
  beeApi: null,
  apiUrl: DEFAULT_BEE_API_HOST,
  setApiUrl: () => {}, // eslint-disable-line
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

  const [apiUrl, setApiUrl] = useState<string>(
    sessionStorage.getItem('api_host') ?? propsSettings.beeApiUrl ?? initialValues.apiUrl,
  )
  const [beeApi, setBeeApi] = useState<Bee | null>(null)
  const [desktopApiKey, setDesktopApiKey] = useState<string>(initialValues.desktopApiKey)
  const [rpcProviderUrl, setRpcProviderUrl] = useState(propsProviderUrl)
  const [rpcProvider, setRpcProvider] = useState(new providers.JsonRpcProvider(propsProviderUrl))
  const { config, isLoading, error } = useGetBeeConfig(desktopUrl)

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
    const url = makeHttpUrl(config?.['api-addr'] ?? apiUrl)
    try {
      setBeeApi(new Bee(url))
      sessionStorage.setItem('api_host', url)
    } catch (e) {
      setBeeApi(null)
    }
  }, [apiUrl])

  return (
    <Context.Provider
      value={{
        apiUrl,
        beeApi,
        setApiUrl,
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
