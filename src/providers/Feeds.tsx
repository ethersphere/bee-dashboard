import { createContext, ReactChild, ReactElement, useEffect, useState } from 'react'

export type IdentityType = 'V3' | 'PRIVATE_KEY'

export interface Identity {
  uuid: string
  name: string
  website: boolean
  topic: string
  feedHash?: string
  identity: string
  address: string
  type: IdentityType
}

export interface Post {
  Title: String
  Type: String
  Category: String
  Date: String
  Amount: String
  Provider: String
  Place: String
  reference: String
}

interface ContextInterface {
  identities: Identity[]
  setIdentities: (identities: Identity[]) => void
  posts: Post[]
  setPosts: (posts: Post[]) => void
}

const initialValues: ContextInterface = {
  identities: [],
  setIdentities: () => {}, // eslint-disable-line
  posts: [],
  setPosts: () => {},
}

export const Context = createContext<ContextInterface>(initialValues)
export const Consumer = Context.Consumer

interface Props {
  children: ReactChild
}

export function Provider({ children }: Props): ReactElement {
  const [identities, setIdentities] = useState<Identity[]>(initialValues.identities)
  const [posts, setPosts] = useState<Post[]>(initialValues.posts)
  useEffect(() => {
    try {
      setIdentities(JSON.parse(localStorage.getItem('feeds') || '[]'))
    } catch {
      setIdentities([])
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return <Context.Provider value={{ identities, setIdentities, posts, setPosts }}>{children}</Context.Provider>
}
