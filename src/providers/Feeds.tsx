import { createContext, ReactElement, ReactNode, useEffect, useState } from 'react'

import { LocalStorageKeys } from '../utils/localStorage'

export enum IdentityType {
  V3 = 'V3',
  PrivateKey = 'PRIVATE_KEY',
}

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
  setIdentities: () => {},
}

export const Context = createContext<ContextInterface>(initialValues)
export const Consumer = Context.Consumer

interface Props {
  children: ReactNode
}

export function Provider({ children }: Props): ReactElement {
  const [identities, setIdentities] = useState<Identity[]>(initialValues.identities)

  useEffect(() => {
    try {
      setIdentities(JSON.parse(localStorage.getItem(LocalStorageKeys.feeds) || '[]'))
    } catch {
      setIdentities([])
    }
  }, [setIdentities])

  return <Context.Provider value={{ identities, setIdentities }}>{children}</Context.Provider>
}
