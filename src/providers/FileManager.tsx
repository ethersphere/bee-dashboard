import { createContext, ReactChild, ReactElement, useContext, useEffect, useState } from 'react'
import { Bee, BeeDev, PrivateKey } from '@ethersphere/bee-js'
import {
  FileManager,
  FileManagerFactory,
  FileManagerEvents,
  FileManagerType,
  EventEmitter,
} from '@solarpunkltd/file-manager-lib'
import { Context as SettingsContext } from '../providers/Settings'

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
  const { apiUrl } = useContext(SettingsContext)
  const [filemanager, setFilemanager] = useState<FileManager | null>(null)
  const [initialized, setInitialized] = useState<boolean>(false)

  const getSigner = (): PrivateKey | undefined => {
    const pkItem = localStorage.getItem('fmPrivateKey')

    if (pkItem) {
      try {
        return new PrivateKey(pkItem)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(`fmPrivateKey is invalid: ${error}`)
      }
    }
    // eslint-disable-next-line no-console
    console.log(`missing fmPrivateKey `)
  }

  useEffect(() => {
    const init = async () => {
      const signer = getSigner()

      if (signer) {
        const fmEmitter = new EventEmitter()
        fmEmitter.on(FileManagerEvents.FILEMANAGER_INITIALIZED, (e: boolean) => {
          setInitialized(e)
        })
        // TOOD: use Bee instead of BeeDev
        const bee = new BeeDev(apiUrl, { signer })
        const fm = await FileManagerFactory.create(FileManagerType.Browser, bee, fmEmitter)
        setFilemanager(fm)
      }
    }

    init()
  }, [apiUrl])

  return <Context.Provider value={{ filemanager: filemanager, initialized }}>{children}</Context.Provider>
}
