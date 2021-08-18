import { createContext, ReactChild, ReactElement, useState, useEffect } from 'react'
import { Bee, BeeDebug } from '@ethersphere/bee-js'

interface ContextInterface {
  apiUrl: string
  apiDebugUrl: string
  beeApi: Bee | null
  beeDebugApi: BeeDebug | null
  setApiUrl: (url: string) => void
  setDebugApiUrl: (url: string) => void
}

const initialValues: ContextInterface = {
  apiUrl: sessionStorage.getItem('api_host') || process.env.REACT_APP_BEE_HOST || 'http://localhost:1633',
  apiDebugUrl:
    sessionStorage.getItem('debug_api_host') || process.env.REACT_APP_BEE_DEBUG_HOST || 'http://localhost:1635',
  beeApi: null,
  beeDebugApi: null,
  setApiUrl: (url: string) => {}, // eslint-disable-line
  setDebugApiUrl: (url: string) => {}, // eslint-disable-line
}

export const Context = createContext<ContextInterface>(initialValues)
export const Consumer = Context.Consumer

interface Props {
  children: ReactChild
}

export function Provider({ children }: Props): ReactElement {
  const [apiUrl, setApiUrl] = useState<string>(initialValues.apiUrl)
  const [apiDebugUrl, setDebugApiUrl] = useState<string>(initialValues.apiDebugUrl)
  const [beeApi, setBeeApi] = useState<Bee | null>(new Bee(apiUrl))
  const [beeDebugApi, setBeeDebugApi] = useState<BeeDebug | null>(new BeeDebug(apiDebugUrl))

  useEffect(() => {
    setBeeApi(new Bee(apiUrl))
    setBeeDebugApi(new BeeDebug(apiDebugUrl))

    sessionStorage.setItem('api_host', apiUrl)
    sessionStorage.setItem('debug_api_host', apiDebugUrl)
  }, [apiUrl, apiDebugUrl])

  return (
    <Context.Provider value={{ apiUrl, apiDebugUrl, beeApi, beeDebugApi, setApiUrl, setDebugApiUrl }}>
      {children}
    </Context.Provider>
  )
}
