import { createContext, ReactChild, ReactElement, useEffect, useRef } from 'react'
import { FileManager } from '@solarpunkltd/file-manager-lib'

interface ContextInterface {
  filemanager: FileManager
}

const initialValues: ContextInterface = {
  filemanager: {} as FileManager,
}

export const Context = createContext<ContextInterface>(initialValues)
export const Consumer = Context.Consumer

interface Props {
  children: ReactChild
}

export function Provider({ children }: Props): ReactElement {
  const filemanagerRef = useRef<FileManager | null>(null)

  if (filemanagerRef.current === null) {
    filemanagerRef.current = new FileManager()
  }

  useEffect(() => {
    if (filemanagerRef.current) {
      filemanagerRef.current.initialize()
    }
  }, [])

  const filemanager = filemanagerRef.current

  return <Context.Provider value={{ filemanager }}>{children}</Context.Provider>
}
