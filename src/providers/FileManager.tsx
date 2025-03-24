import { createContext, ReactChild, ReactElement, useContext, useEffect, useRef, useState } from 'react'
import { BatchId, BeeDev, PrivateKey, Reference } from '@ethersphere/bee-js'
import {
  FileInfo,
  FileManager,
  FileManagerFactory,
  FileManagerBrowser,
  FileManagerEvents,
  FileManagerType,
  EventEmitter,
} from '@solarpunkltd/file-manager-lib'
import { Context as StampContext } from './Stamps'
import { ReferenceWithHistory } from '@solarpunkltd/file-manager-lib/dist/types/utils/types'
import { Context as SettingsContext } from './Settings'

interface ContextInterface {
  filemanager: FileManager
  initialized: boolean
  isGroupingOn: boolean
  setIsGroupingOn: (isGroupingOn: boolean) => void
  selectedBatchIds: BatchId[]
  setSelectedBatchIds: (batchId: BatchId[]) => void
  fileOrder: string
  setFileOrder: (order: string) => void
  fileDownLoadQueue: (string | Reference)[]
  setFileDownLoadQueue: (queue: (string | Reference)[]) => void
}
const initialValues: ContextInterface = {
  filemanager: {} as FileManager,
  initialized: false,
  fileOrder: 'nameAsc',
  setFileOrder: (_: string): void => {
    return
  },
  isGroupingOn: false,
  setIsGroupingOn: (_: boolean): void => {
    return
  },
  selectedBatchIds: [],
  setSelectedBatchIds: (_: BatchId[]): void => {
    return
  },
  fileDownLoadQueue: [],
  setFileDownLoadQueue: (_: (string | Reference)[]): void => {
    return
  },
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

  const [selectedBatchIds, setSelectedBatchIds] = useState<BatchId[]>([])
  const [isGroupingOn, setIsGroupingOn] = useState(false)
  const [fileOrder, setFileOrder] = useState('nameAsc')
  const [fileDownLoadQueue, setFileDownLoadQueue] = useState([] as (string | Reference)[])

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

  return (
    <Context.Provider
      value={{
        filemanager: filemanagerRef.current,
        initialized,
        isGroupingOn,
        setIsGroupingOn: setIsGroupingOn,
        selectedBatchIds: selectedBatchIds,
        setSelectedBatchIds: setSelectedBatchIds,
        fileOrder,
        setFileOrder,
        fileDownLoadQueue: fileDownLoadQueue,
        setFileDownLoadQueue: setFileDownLoadQueue,
      }}
    >
      {children}
    </Context.Provider>
  )
}
