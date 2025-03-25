import { createContext, ReactChild, ReactElement, useContext, useEffect, useState } from 'react'
import { BeeDev, PrivateKey } from '@ethersphere/bee-js'
import { FileManager, FileManagerBase, FileManagerEvents } from '@solarpunkltd/file-manager-lib'
import { Context as SettingsContext } from '../providers/Settings'

interface ContextInterface {
  filemanager: FileManager | null
}

const initialValues: ContextInterface = {
  filemanager: null,
}

export const Context = createContext<ContextInterface>(initialValues)
export const Consumer = Context.Consumer

interface Props {
  children: ReactChild
}

export function Provider({ children }: Props): ReactElement {
  const { apiUrl } = useContext(SettingsContext)
  const [filemanager, setFilemanager] = useState<FileManager | null>(null)

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
        // TODO: use Bee instead of BeeDev
        const bee = new BeeDev(apiUrl, { signer })
        const fm = new FileManagerBase(bee)
        fm.emitter.on(FileManagerEvents.FILEMANAGER_INITIALIZED, (e: boolean) => {
          setFilemanager(fm)
        })
        await fm.initialize()
      }
    }

    init()
  }, [apiUrl])

  return <Context.Provider value={{ filemanager: filemanager }}>{children}</Context.Provider>
}
