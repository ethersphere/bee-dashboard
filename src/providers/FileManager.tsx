import { createContext, ReactChild, ReactElement, useContext, useEffect, useRef, useState } from 'react'
import { BatchId, BeeDev, PrivateKey, Reference } from '@upcoming/bee-js'
import { FileInfo, FileManager, FileManagerBrowser, FileManagerEvents } from '@solarpunkltd/file-manager-lib'
import { Context as StampContext } from './Stamps'
import { ReferenceWithHistory } from '@solarpunkltd/file-manager-lib/dist/types/utils/types'

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
  const signer = new PrivateKey('634fb5a872396d9693e5c9f9d7233cfa93f395c093371017ff44aa9ae6564cdd')
  const filemanagerRef = useRef<FileManager>(new FileManagerBrowser(new BeeDev('http://localhost:1633', { signer })))
  const [initialized, setInitialized] = useState<boolean>(false)
  const [selectedBatchIds, setSelectedBatchIds] = useState<BatchId[]>([])
  const [isGroupingOn, setIsGroupingOn] = useState(false)
  const [fileOrder, setFileOrder] = useState('nameAsc')
  const [fileDownLoadQueue, setFileDownLoadQueue] = useState([] as (string | Reference)[])

  const init = () => {
    if (filemanagerRef.current !== null) {
      filemanagerRef.current.emitter.on(FileManagerEvents.FILEMANAGER_INITIALIZED, (e: boolean) => {
        setInitialized(e)
      })
      filemanagerRef.current.initialize()
    }
  }
  useEffect(() => {
    init()
  }, [])

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
