import { createContext, ReactChild, ReactElement, useEffect, useRef, useState } from 'react'
import { BatchId, BeeDev, PrivateKey } from '@upcoming/bee-js'
import { FileInfo, FileManager, FileManagerBrowser, FileManagerEvents } from '@solarpunkltd/file-manager-lib'

interface ContextInterface {
  filemanager: FileManager
  initialized: boolean
  choosedBatchIds: BatchId[]
  setChoosedBatchIds: (batchId: BatchId[]) => void
  getFilesForChoosedBatchIDs: (batchIds: BatchId[] | null) => FileInfo[] | null
}
const initialValues: ContextInterface = {
  filemanager: {} as FileManager,
  initialized: false,
  choosedBatchIds: [],
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setChoosedBatchIds: () => {},
  getFilesForChoosedBatchIDs: (batchIds: BatchId[] | null) => {
    return null
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
  const [choosedBatchIds, setChoosedBatchIds] = useState<BatchId[]>([])
  const getFilesForChoosedBatchIDs = (batchIds: BatchId[] | null): FileInfo[] | null => {
    if (batchIds === null) {
      return filemanagerRef.current.getFileInfoList()
    }
    const actualFileList: FileInfo[] = []
    batchIds?.forEach(batchId => {
      // eslint-disable-next-line eqeqeq
      actualFileList.push(...filemanagerRef.current.getFileInfoList().filter(f => f.batchId == batchId))
    })

    return actualFileList
  }

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
        choosedBatchIds: choosedBatchIds,
        setChoosedBatchIds: setChoosedBatchIds,
        getFilesForChoosedBatchIDs: getFilesForChoosedBatchIDs,
      }}
    >
      {children}
    </Context.Provider>
  )
}
