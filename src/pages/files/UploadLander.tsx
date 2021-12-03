import { ReactElement } from 'react'
import { History } from '../../components/History'
import { HISTORY_KEYS } from '../../utils/local-storage'
import { FileNavigation } from './FileNavigation'
import { UploadArea } from './UploadArea'

const MAX_FILE_SIZE = 1_000_000_000 // 1 gigabyte

export function UploadLander(): ReactElement {
  return (
    <>
      <FileNavigation active="UPLOAD" />
      <UploadArea maximumSizeInBytes={MAX_FILE_SIZE} />
      <History title="Upload History" localStorageKey={HISTORY_KEYS.UPLOAD_HISTORY} />
    </>
  )
}
