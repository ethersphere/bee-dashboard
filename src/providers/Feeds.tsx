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
  Title: string
  Type: string
  Category: string
  Date: string
  Amount: string
  Provider: string
  Place: string
  reference: string
}

export interface dropDownOption {
  label: string
  value: string
}

const msg: Post = {
  Title: '',
  Type: 'Expenditure',
  Category: 'Groceries',
  Date: '11/12/2023',
  Amount: '0€',
  Provider: 'Africa',
  Place: 'Mbeng',
  reference: '',
}

interface ContextInterface {
  identities: Identity[]
  setIdentities: (identities: Identity[]) => void
  optionsArray: dropDownOption[]
  setDDOptions: (optionsArray: dropDownOption[]) => void
  isLoadingPosts: boolean
  setisLoadingPosts: (isLoadingPosts: boolean) => void
  Posts: Post[]
  setPostsList: (Posts: Post[]) => void
  PostData: Post
  setPostData: (PostData: Post) => void
}

const initialValues: ContextInterface = {
  identities: [],
  setIdentities: () => {}, // eslint-disable-line
  optionsArray: [],
  setDDOptions: () => {}, // eslint-disable-line
  isLoadingPosts: true,
  setisLoadingPosts: () => {
    return true
  },
  Posts: [],
  setPostsList: () => {
    return []
  },
  PostData: msg,
  setPostData: () => {
    return msg
  },
}

export const Context = createContext<ContextInterface>(initialValues)
export const Consumer = Context.Consumer

interface Props {
  children: ReactChild
}

export function Provider({ children }: Props): ReactElement {
  const [identities, setIdentities] = useState<Identity[]>(initialValues.identities)
  const [optionsArray, setDDOptions] = useState<dropDownOption[]>(initialValues.optionsArray)
  const [isLoadingPosts, setisLoadingPosts] = useState<boolean>(initialValues.isLoadingPosts)
  const [Posts, setPostsList] = useState<Post[]>(initialValues.Posts)
  const [PostData, setPostData] = useState<Post>(initialValues.PostData)

  useEffect(() => {
    const oa: dropDownOption[] = []
    try {
      setIdentities(JSON.parse(localStorage.getItem('feeds') || '[]'))
      identities.map((x, i) => oa.push({ label: x.name, value: x.name }))
      setDDOptions(oa)
    } catch {
      setIdentities([])
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Context.Provider
      value={{
        identities,
        setIdentities,
        optionsArray,
        setDDOptions,
        isLoadingPosts,
        setisLoadingPosts,
        Posts,
        setPostsList,
        PostData,
        setPostData,
      }}
    >
      {children}
    </Context.Provider>
  )
}
