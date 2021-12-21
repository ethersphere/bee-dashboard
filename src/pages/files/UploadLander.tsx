import { ReactElement, useContext } from 'react'
import { History } from '../../components/History'
import TroubleshootConnectionCard from '../../components/TroubleshootConnectionCard'
import { Context as BeeContext } from '../../providers/Bee'
import { defaultUploadOrigin } from '../../providers/File'
import { HISTORY_KEYS } from '../../utils/local-storage'
import { FileNavigation } from './FileNavigation'
import { UploadArea } from './UploadArea'

export function UploadLander(): ReactElement {
  const { status } = useContext(BeeContext)

  if (!status.all) return <TroubleshootConnectionCard />

  return (
    <>
      <FileNavigation active="UPLOAD" />
      <UploadArea showHelp={true} uploadOrigin={defaultUploadOrigin} />
      <History title="Upload History" localStorageKey={HISTORY_KEYS.UPLOAD_HISTORY} />
    </>
  )
}
