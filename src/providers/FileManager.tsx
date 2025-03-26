import { createContext, ReactChild, ReactElement, useContext, useEffect, useRef, useState } from 'react'
import { BatchId, BeeDev, PrivateKey, Reference } from '@ethersphere/bee-js'

import { FileManager, FileManagerBase } from '@solarpunkltd/file-manager-lib'
import { Context as SettingsContext } from './Settings'
import { FileManagerEvents } from '@solarpunkltd/file-manager-lib'

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
  isNewVolumeCreated: boolean
  setIsNewVolumeCreated: (isNewVolumeCreated: boolean) => void
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
  isNewVolumeCreated: false,
  setIsNewVolumeCreated: (_: boolean): void => {
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
  const [isNewVolumeCreated, setIsNewVolumeCreated] = useState(false)

  useEffect(() => {
    const init = async () => {
      const signer = getSigner()

      if (signer) {
        // TOOD: use Bee instead of BeeDev
        const bee = new BeeDev(apiUrl, { signer })
        const fm = new FileManagerBase(bee)
        fm.emitter.on(FileManagerEvents.FILEMANAGER_INITIALIZED, (e: boolean) => {
          setInitialized(e)
          setFilemanager(fm)
        })
        await fm.initialize()
      }
    }

    init()
  }, [apiUrl])

  return (
    <Context.Provider
      value={{
        filemanager: filemanager as FileManager,
        initialized,
        isGroupingOn,
        setIsGroupingOn: setIsGroupingOn,
        selectedBatchIds: selectedBatchIds,
        setSelectedBatchIds: setSelectedBatchIds,
        fileOrder,
        setFileOrder,
        fileDownLoadQueue: fileDownLoadQueue,
        setFileDownLoadQueue: setFileDownLoadQueue,
        isNewVolumeCreated: isNewVolumeCreated,
        setIsNewVolumeCreated: setIsNewVolumeCreated,
      }}
    >
      {children}
    </Context.Provider>
  )
}
