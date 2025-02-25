import { createContext, ReactChild, ReactElement, useEffect, useRef } from 'react'
import { BeeDev, PrivateKey } from '@upcoming/bee-js'
import { FileManager } from '@solarpunkltd/file-manager-lib'

interface ContextInterface {
  filemanager: FileManager | null
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

  const signer = new PrivateKey('634fb5a872396d9693e5c9f9d7233cfa93f395c093371017ff44aa9ae6564cdd')
  filemanagerRef.current = new FileManager(new BeeDev('http://localhost:1633', { signer }))

  const init = async () => {
    if (filemanagerRef.current !== null) {
      try {
        await filemanagerRef.current.initialize()
      } catch (error) {
        console.log('filemanager init error: ', error)
      }
    }
  }

  useEffect(() => {
    init()
  }, [])

  return <Context.Provider value={{ filemanager: filemanagerRef.current }}>{children}</Context.Provider>
}
