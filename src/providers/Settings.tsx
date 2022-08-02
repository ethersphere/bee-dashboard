import { Bee, BeeDebug } from '@ethersphere/bee-js'
import { providers } from 'ethers'
import { createContext, ReactNode, ReactElement, useEffect, useState } from 'react'
import { config as appConfig } from '../config'
import { useGetBeeConfig } from '../hooks/apiHooks'
import { restartBeeNode, setJsonRpcInDesktop } from '../utils/desktop'

const LocalStorageKeys = {
  providerUrl: 'json-rpc-provider',
}

const providerUrl = localStorage.getItem('json-rpc-provider') || appConfig.DEFAULT_RPC_URL

interface ContextInterface {
  apiUrl: string
  apiDebugUrl: string
  beeApi: Bee | null
  beeDebugApi: BeeDebug | null
  lockedApiSettings: boolean
  desktopApiKey: string
  providerUrl: string
  provider: providers.JsonRpcProvider
  cors: string | null
  dataDir: string | null
  ensResolver: string | null
  setApiUrl: (url: string) => void
  setDebugApiUrl: (url: string) => void
  setAndPersistJsonRpcProvider: (url: string) => Promise<void>
  isBeeDesktop: boolean
  isLoading: boolean
  error: Error | null
}

const initialValues: ContextInterface = {
  apiUrl: appConfig.BEE_API_HOST,
  apiDebugUrl: appConfig.BEE_DEBUG_API_HOST,
  beeApi: null,
  beeDebugApi: null,
  setApiUrl: () => {}, // eslint-disable-line
  setDebugApiUrl: () => {}, // eslint-disable-line
  lockedApiSettings: false,
  desktopApiKey: '',
  setAndPersistJsonRpcProvider: async () => {}, // eslint-disable-line
  providerUrl,
  provider: new providers.JsonRpcProvider(providerUrl),
  cors: null,
  dataDir: null,
  ensResolver: null,
  isBeeDesktop: false,
  isLoading: true,
  error: null,
}

export const Context = createContext<ContextInterface>(initialValues)
export const Consumer = Context.Consumer

interface Props {
  children: ReactNode
  beeApiUrl?: string
  beeDebugApiUrl?: string
  lockedApiSettings?: boolean
  isBeeDesktop?: boolean
}

export function Provider({
  children,
  beeApiUrl,
  beeDebugApiUrl,
  lockedApiSettings: extLockedApiSettings,
  isBeeDesktop: extIsBeeDesktop,
}: Props): ReactElement {
  const [apiUrl, setApiUrl] = useState<string>(initialValues.apiUrl)
  const [apiDebugUrl, setDebugApiUrl] = useState<string>(initialValues.apiDebugUrl)
  const [beeApi, setBeeApi] = useState<Bee | null>(null)
  const [beeDebugApi, setBeeDebugApi] = useState<BeeDebug | null>(null)
  const [desktopApiKey, setDesktopApiKey] = useState<string>(initialValues.desktopApiKey)
  const [providerUrl, setProviderUrl] = useState(initialValues.providerUrl)
  const [provider, setProvider] = useState(initialValues.provider)
  const { config, isLoading, error } = useGetBeeConfig()

  const isBeeDesktop = extIsBeeDesktop ?? appConfig.BEE_DESKTOP_ENABLED

  console.log({ isBeeDesktop, appConfig }) //eslint-disable-line

  async function setAndPersistJsonRpcProvider(providerUrl: string) {
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
        lockedApiSettings: Boolean(extLockedApiSettings),
        desktopApiKey,
        provider,
        providerUrl,
        cors: config?.['cors-allowed-origins'] ?? null,
        dataDir: config?.['data-dir'] ?? null,
        ensResolver: config?.['resolver-options'] ?? null,
        setAndPersistJsonRpcProvider,
        isBeeDesktop: Boolean(isBeeDesktop),
        isLoading,
        error,
      }}
    >
      {children}
    </Context.Provider>
  )
}
