import { createContext, ReactChild, ReactElement, useState } from 'react'
import { SwarmFile } from '../utils/SwarmFile'

interface ContextInterface {
  files: SwarmFile[]
  setFiles: (files: SwarmFile[]) => void
}

const initialValues: ContextInterface = {
  files: [],
  setFiles: () => {}, // eslint-disable-line
}

export const Context = createContext<ContextInterface>(initialValues)
export const Consumer = Context.Consumer

interface Props {
  children: ReactChild
}

export function Provider({ children }: Props): ReactElement {
  const [files, setFiles] = useState<SwarmFile[]>(initialValues.files)

  return <Context.Provider value={{ files, setFiles }}>{children}</Context.Provider>
}
