import { createContext, ReactChild, ReactElement, useEffect, useRef, useState } from 'react'
import { BeeDev, PrivateKey } from '@ethersphere/bee-js'
import {
  FileManager,
  FileManagerFactory,
  FileManagerEvents,
  FileManagerType,
  EventEmitter,
} from '@solarpunkltd/file-manager-lib'

interface ContextInterface {
  filemanager: FileManager | null
  initialized: boolean
}

const initialValues: ContextInterface = {
  filemanager: null,
  initialized: false,
}

export const Context = createContext<ContextInterface>(initialValues)
export const Consumer = Context.Consumer

interface Props {
  children: ReactChild
}

export function Provider({ children }: Props): ReactElement {
  const [filemanager, setFilemanager] = useState<FileManager | null>(null)
  const [initialized, setInitialized] = useState<boolean>(false)

  const init = async () => {
    const fmEmitter = new EventEmitter()
    fmEmitter.on(FileManagerEvents.FILEMANAGER_INITIALIZED, (e: boolean) => {
      setInitialized(e)
    })

    const signer = new PrivateKey('634fb5a872396d9693e5c9f9d7233cfa93f395c093371017ff44aa9ae6564cdd')
    const fm = await FileManagerFactory.create(
      FileManagerType.Browser,
      new BeeDev('http://localhost:1633', { signer }),
      fmEmitter,
    )
    setFilemanager(fm)
  }

  useEffect(() => {
    init()
  }, [])

  return <Context.Provider value={{ filemanager: filemanager, initialized }}>{children}</Context.Provider>
}
