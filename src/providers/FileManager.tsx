import { createContext, ReactChild, ReactElement, useContext, useEffect, useRef, useState } from 'react'
import { Context as SettingsContext } from '../providers/Settings'
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

  const init = async () => {
    if (filemanagerRef.current === null) {
      const signer = new PrivateKey('634fb5a872396d9693e5c9f9d7233cfa93f395c093371017ff44aa9ae6564cdd')
      const fm = new FileManager(new BeeDev('http://localhost:1633', { signer }))
      try {
        await fm.initialize()
        filemanagerRef.current = fm
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log('error filemanager init: ', error)
        filemanagerRef.current = null
      }
    }
  }

  useEffect(() => {
    init()
  }, [])

  return <Context.Provider value={{ filemanager: filemanagerRef.current }}>{children}</Context.Provider>
}
