import { createContext, ReactChild, ReactElement, useEffect, useState } from 'react'

export type IdentityType = 'V3' | 'PRIVATE_KEY'

export interface Identity {
  uuid: string
  name: string
  feedHash?: string
  identity: string
  address: string
  type: IdentityType
}

interface ContextInterface {
  identities: Identity[]
  setIdentities: (identities: Identity[]) => void
}

const initialValues: ContextInterface = {
  identities: [],
  setIdentities: () => {}, // eslint-disable-line
}

export const Context = createContext<ContextInterface>(initialValues)
export const Consumer = Context.Consumer

interface Props {
  children: ReactChild
}

export function Provider({ children }: Props): ReactElement {
  const [identities, setIdentities] = useState<Identity[]>(initialValues.identities)

  useEffect(() => {
    try {
      setIdentities(JSON.parse(localStorage.getItem('feeds') || '[]'))
    } catch {
      setIdentities([])
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return <Context.Provider value={{ identities, setIdentities }}>{children}</Context.Provider>
}
