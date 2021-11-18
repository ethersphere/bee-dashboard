import { Utils } from '@ethersphere/bee-js'
import { ReactElement, useContext, useState } from 'react'
import ExpandableListItemInput from '../../components/ExpandableListItemInput'
import { VerticalSpacing } from '../../components/VerticalSpacing'
import { Context as SettingsContext } from '../../providers/Settings'
import { convertBeeFileToBrowserFile } from '../../utils/file'
import { AssetPreview } from './AssetPreview'
import { DownloadActionBar } from './DownloadActionBar'

export default function Files(): ReactElement {
  const { apiUrl, beeApi } = useContext(SettingsContext)

  const [reference, setReference] = useState('')
  const [referenceError, setReferenceError] = useState<string | undefined>(undefined)
  const [downloadedFile, setDownloadedFile] = useState<Partial<File> | null>(null)

  const validateChange = (value: string) => {
    if (Utils.isHexString(value, 64) || Utils.isHexString(value, 128)) setReferenceError(undefined)
    else setReferenceError('Incorrect format of swarm hash. Expected 64 or 128 hexstring characters.')
  }

  function onDownload() {
    window.open(`${apiUrl}/bzz/${reference}/`, '_blank')
  }

  async function onSwarmIdentifier(identifier: string) {
    if (!beeApi) {
      return
    }
    setReference(identifier)
    const response = await beeApi.downloadFile(identifier)
    setDownloadedFile(convertBeeFileToBrowserFile(response))
  }

  if (downloadedFile) {
    return (
      <>
        <AssetPreview files={[downloadedFile as File]} />
        <VerticalSpacing px={32} />
        <DownloadActionBar onCancel={() => setDownloadedFile(null)} onDownload={() => onDownload()} />
      </>
    )
  }

  return (
    <ExpandableListItemInput
      label="Swarm Hash"
      onConfirm={value => onSwarmIdentifier(value)}
      onChange={validateChange}
      helperText={referenceError}
      confirmLabel={'Download'}
      confirmLabelDisabled={Boolean(referenceError)}
      placeholder="e.g. 31fb0362b1a42536134c86bc58b97ac0244e5c6630beec3e27c2d1cecb38c605"
      expandedOnly
    />
  )
}
