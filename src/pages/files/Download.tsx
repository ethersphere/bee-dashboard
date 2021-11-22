import { Utils } from '@ethersphere/bee-js'
import { Box } from '@material-ui/core'
import { ReactElement, useContext, useState } from 'react'
import ExpandableListItemInput from '../../components/ExpandableListItemInput'
import { Context as SettingsContext } from '../../providers/Settings'
import { extractSwarmHash } from '../../utils'
import { convertBeeFileToBrowserFile } from '../../utils/file'
import { SwarmFile } from '../../utils/SwarmFile'
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
        <Box mb={4}>
          <AssetPreview files={[new SwarmFile(downloadedFile as File)]} />
        </Box>
        <DownloadActionBar onCancel={() => setDownloadedFile(null)} onDownload={onDownload} />
      </>
    )
  }

  function recognizeSwarmHash(value: string) {
    if (value.length < 64) {
      return value
    }

    const hash = extractSwarmHash(value)

    if (hash) {
      return hash
    }

    return value
  }

  return (
    <ExpandableListItemInput
      label="Swarm Hash"
      onConfirm={value => onSwarmIdentifier(value)}
      onChange={validateChange}
      helperText={referenceError}
      confirmLabel={'Search'}
      confirmLabelDisabled={Boolean(referenceError)}
      placeholder="e.g. 31fb0362b1a42536134c86bc58b97ac0244e5c6630beec3e27c2d1cecb38c605"
      expandedOnly
      mapperFn={value => recognizeSwarmHash(value)}
    />
  )
}
