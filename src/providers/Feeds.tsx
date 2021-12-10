import { createContext, ReactChild, ReactElement, useEffect, useState } from 'react'

export interface Feed {
  name: string
  feedHash: string
  identity: string
  identityType: 'WITH_PW' | 'WITHOUT_PW'
  hasPassword: boolean
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
