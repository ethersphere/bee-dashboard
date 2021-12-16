import { createContext, ReactChild, ReactElement, useEffect, useState } from 'react'

export type IdentityType = 'V3' | 'PRIVATE_KEY'

export interface Feed {
  uuid: string
  name: string
  feedHash?: string
  identity: string
  type: IdentityType
}

interface ContextInterface {
  feeds: Feed[]
  setFeeds: (feeds: Feed[]) => void
}

const initialValues: ContextInterface = {
  feeds: [],
  setFeeds: () => {}, // eslint-disable-line
}

export const Context = createContext<ContextInterface>(initialValues)
export const Consumer = Context.Consumer

interface Props {
  children: ReactChild
}

export function Provider({ children }: Props): ReactElement {
  const [feeds, setFeeds] = useState<Feed[]>(initialValues.feeds)

  useEffect(() => {
    setFeeds(JSON.parse(localStorage.getItem('feeds') || '[]'))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return <Context.Provider value={{ feeds, setFeeds }}>{children}</Context.Provider>
}
