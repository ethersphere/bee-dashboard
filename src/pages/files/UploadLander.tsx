import { ReactElement, useContext } from 'react'

import { History } from '../../components/History'
import TroubleshootConnectionCard from '../../components/TroubleshootConnectionCard'
import { CheckState, Context as BeeContext } from '../../providers/Bee'
import { defaultUploadOrigin } from '../../providers/File'
import { LocalStorageKeys } from '../../utils/localStorage'

import { FileNavigation, FileOrigin } from './FileNavigation'
import { UploadArea } from './UploadArea'

export function UploadLander(): ReactElement {
  const { status } = useContext(BeeContext)

  if (status.all === CheckState.ERROR) return <TroubleshootConnectionCard />

  return (
    <>
      <FileNavigation active={FileOrigin.Upload} />
      <UploadArea showHelp={true} uploadOrigin={defaultUploadOrigin} />
      <History title="Upload History" localStorageKey={LocalStorageKeys.uploadHistory} />
    </>
  )
}
