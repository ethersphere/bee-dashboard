import { Bee } from '@ethersphere/bee-js'
import { JsonRpcProvider } from 'ethers'
import { createContext, ReactElement, ReactNode, useCallback, useEffect, useMemo, useState } from 'react'

import { DEFAULT_BEE_API_HOST, DEFAULT_RPC_URL } from '../constants'
import { useGetBeeConfig } from '../hooks/apiHooks'
import { newGnosisProvider } from '../utils/chain'
import { LocalStorageKeys } from '../utils/localStorage'

interface ContextInterface {
  apiUrl: string
  beeApi: Bee | null
  lockedApiSettings: boolean
  desktopApiKey: string
  isDesktop: boolean
  desktopUrl: string
  rpcProviderUrl: string
  rpcProvider: JsonRpcProvider | null
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
  setApiUrl: () => {},
  lockedApiSettings: false,
  isDesktop: false,
  desktopApiKey: '',
  desktopUrl: window.location.origin,
  setAndPersistJsonRpcProvider: async () => {},
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
    localStorage.getItem(LocalStorageKeys.apiHost) ?? propsSettings.beeApiUrl ?? initialValues.apiUrl,
  )
  const [beeApi, setBeeApi] = useState<Bee | null>(null)
  const [desktopApiKey, setDesktopApiKey] = useState<string>(initialValues.desktopApiKey)
  const [rpcProviderUrl, setRpcProviderUrl] = useState(propsProviderUrl)
  const [rpcProvider, setRpcProvider] = useState(newGnosisProvider(propsProviderUrl))

  const { config, isLoading, error } = useGetBeeConfig(desktopUrl)

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search)
    const newApiKey = urlSearchParams.get('v')

    if (newApiKey) {
      localStorage.setItem(LocalStorageKeys.apiKey, newApiKey)
      window.location.search = ''
      setDesktopApiKey(newApiKey)
    }
  }, [])

  useEffect(() => {
    const url = makeHttpUrl(localStorage.getItem(LocalStorageKeys.apiHost) ?? config?.['api-addr'] ?? apiUrl)

    const setBeeApiState = () => {
      try {
        setBeeApi(new Bee(url))
      } catch {
        setBeeApi(null)
      }
    }

    setBeeApiState()
  }, [config, apiUrl])

  const updateApiUrl = useCallback((url: string) => {
    const userProvidedUrl = makeHttpUrl(url)

    try {
      setBeeApi(new Bee(userProvidedUrl))
      localStorage.setItem(LocalStorageKeys.apiHost, userProvidedUrl)
      setApiUrl(userProvidedUrl)
    } catch (_) {
      setBeeApi(null)
    }
  }, [])

  const setAndPersistJsonRpcProvider = useCallback((providerUrl: string) => {
    localStorage.setItem(LocalStorageKeys.providerUrl, providerUrl)
    setRpcProviderUrl(providerUrl)
    setRpcProvider(newGnosisProvider(providerUrl))
  }, [])

  const contextValue = useMemo(
    () => ({
      apiUrl,
      beeApi,
      setApiUrl: updateApiUrl,
      lockedApiSettings: Boolean(propsSettings.lockedApiSettings),
      desktopApiKey,
      isDesktop,
      desktopUrl,
      rpcProvider,
      rpcProviderUrl,
      cors: config?.['cors-allowed-origins'] ?? null,
      dataDir: config?.['data-dir'] ?? null,
      ensResolver: config?.['resolver-options'] ?? null,
      setAndPersistJsonRpcProvider,
      isLoading,
      error,
    }),
    [
      apiUrl,
      beeApi,
      updateApiUrl,
      propsSettings.lockedApiSettings,
      desktopApiKey,
      isDesktop,
      desktopUrl,
      rpcProvider,
      rpcProviderUrl,
      config,
      setAndPersistJsonRpcProvider,
      isLoading,
      error,
    ],
  )

  return <Context.Provider value={contextValue}>{children}</Context.Provider>
}

function makeHttpUrl(string: string): string {
  if (!string.startsWith('http')) {
    return `http://${string}`
  }

  return string
}
