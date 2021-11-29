import { Utils } from '@ethersphere/bee-js'
import { Box } from '@material-ui/core'
import { saveAs } from 'file-saver'
import JSZip from 'jszip'
import { useSnackbar } from 'notistack'
import { ReactElement, useContext, useState } from 'react'
import { SwarmManifestList } from 'swarm-manifest-list'
import ExpandableListItemInput from '../../components/ExpandableListItemInput'
import { Context as SettingsContext } from '../../providers/Settings'
import { extractSwarmHash } from '../../utils'
import { convertBeeFileToBrowserFile, convertManifestToFiles } from '../../utils/file'
import { SwarmFile } from '../../utils/SwarmFile'
import { AssetPreview } from './AssetPreview'
import { DownloadActionBar } from './DownloadActionBar'

export default function Files(): ReactElement {
  const { apiUrl, beeApi } = useContext(SettingsContext)

  const [loading, setLoading] = useState(false)
  const [reference, setReference] = useState('')
  const [referenceError, setReferenceError] = useState<string | undefined>(undefined)
  const [files, setFiles] = useState<SwarmFile[]>([])
  const [swarmEntries, setSwarmEntries] = useState<Record<string, string>>({})
  const [indexDocument, setIndexDocument] = useState<string | null>(null)

  const { enqueueSnackbar } = useSnackbar()

  const validateChange = (value: string) => {
    if (Utils.isHexString(value, 64) || Utils.isHexString(value, 128)) setReferenceError(undefined)
    else setReferenceError('Incorrect format of swarm hash. Expected 64 or 128 hexstring characters.')
  }

  function onOpen() {
    window.open(`${apiUrl}/bzz/${reference}/`, '_blank')
  }

  async function onDownload() {
    if (!beeApi) {
      return
    }

    setLoading(true)

    if (Object.keys(swarmEntries).length === 1) {
      window.open(`${apiUrl}/bzz/${reference}/`, '_blank')
    } else {
      const zip = new JSZip()
      for (const [path, hash] of Object.entries(swarmEntries)) {
        zip.file(path, await beeApi.downloadData(hash))
      }
      const content = await zip.generateAsync({ type: 'blob' })
      saveAs(content, reference + '.zip')
    }
    setLoading(false)
  }

  async function onSwarmIdentifier(identifier: string) {
    if (!beeApi) {
      return
    }
    setLoading(true)
    setReference(identifier)
    try {
      const swarmManifestList = new SwarmManifestList(beeApi)
      const isManifest = await swarmManifestList.isManifest(identifier)

      if (!isManifest) {
        throw Error('The specified hash does not contain valid content.')
      }
      const entries = await swarmManifestList.getHashes(identifier)
      setSwarmEntries(entries)
      setIndexDocument(await swarmManifestList.getIndexDocument(identifier))

      if (Object.keys(entries).length === 1) {
        const response = await beeApi.downloadFile(identifier)
        setFiles([new SwarmFile(convertBeeFileToBrowserFile(response) as File)])
      } else {
        setFiles(convertManifestToFiles(entries))
      }
    } catch (error: unknown) {
      let message = typeof error === 'object' && error !== null && Reflect.get(error, 'message')

      if (message.includes('path address not found')) {
        message = 'The specified hash does not have an index document set.'
      }

      if (message.includes('Not Found: Not Found')) {
        message = 'The specified hash was not found.'
      }
      enqueueSnackbar(<span>Error: {message || 'Unknown'}</span>, { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const assetName = reference.slice(0, 8) + '[…]' + reference.slice(-8)

  if (files.length) {
    return (
      <>
        <Box mb={4}>
          <AssetPreview assetName={files.length ? assetName : undefined} files={files} />
        </Box>
        <DownloadActionBar
          onOpen={onOpen}
          onCancel={() => setFiles([])}
          onDownload={onDownload}
          hasIndexDocument={Boolean(indexDocument)}
          loading={loading}
        />
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
      confirmLabelDisabled={Boolean(referenceError) || loading}
      placeholder="e.g. 31fb0362b1a42536134c86bc58b97ac0244e5c6630beec3e27c2d1cecb38c605"
      expandedOnly
      mapperFn={value => recognizeSwarmHash(value)}
    />
  )
}
