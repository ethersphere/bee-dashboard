import { createContext, ReactChild, ReactElement, useContext, useEffect, useState } from 'react'
import { BatchId, BeeDev, PrivateKey } from '@ethersphere/bee-js'

import { FileInfo, FileManager, FileManagerBase } from '@solarpunkltd/file-manager-lib'
import { Context as SettingsContext } from './Settings'
import { FileManagerEvents } from '@solarpunkltd/file-manager-lib'

interface ContextInterface {
  filemanager: FileManager | null
  isGroupingOn: boolean
  setIsGroupingOn: (isGroupingOn: boolean) => void
  selectedBatchIds: BatchId[]
  setSelectedBatchIds: (batchId: BatchId[]) => void
  fileOrder: string
  setFileOrder: (order: string) => void
  fileDownLoadQueue: FileInfo[]
  setFileDownLoadQueue: (queue: FileInfo[]) => void
  isNewVolumeCreated: boolean
  setIsNewVolumeCreated: (isNewVolumeCreated: boolean) => void
}
const initialValues: ContextInterface = {
  filemanager: null,
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
  setFileDownLoadQueue: (_: FileInfo[]): void => {
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
  const [selectedBatchIds, setSelectedBatchIds] = useState<BatchId[]>([])
  const [isGroupingOn, setIsGroupingOn] = useState<boolean>(false)
  const [fileOrder, setFileOrder] = useState<string>('nameAsc')
  const [fileDownLoadQueue, setFileDownLoadQueue] = useState<FileInfo[]>([])
  const [isNewVolumeCreated, setIsNewVolumeCreated] = useState<boolean>(false)

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

  return (
    <Context.Provider
      value={{
        filemanager,
        isGroupingOn,
        setIsGroupingOn,
        selectedBatchIds,
        setSelectedBatchIds,
        fileOrder,
        setFileOrder,
        fileDownLoadQueue,
        setFileDownLoadQueue,
        isNewVolumeCreated,
        setIsNewVolumeCreated,
      }}
    >
      {children}
    </Context.Provider>
  )
}
