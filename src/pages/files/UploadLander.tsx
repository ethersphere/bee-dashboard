import { ReactElement } from 'react'
import { FileNavigation } from './FileNavigation'
import { UploadArea } from './UploadArea'

const MAX_FILE_SIZE = 1_000_000_000 // 1 gigabyte

export function UploadLander(): ReactElement {
  return (
    <>
      <FileNavigation active="UPLOAD" />
      <UploadArea maximumSizeInBytes={MAX_FILE_SIZE} />
    </>
  )
}
