import { Box } from '@material-ui/core'
import { saveAs } from 'file-saver'
import JSZip from 'jszip'
import { ReactElement, useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { SwarmManifestList } from 'swarm-manifest-list'
import { Loading } from '../../components/Loading'
import { Context as SettingsContext } from '../../providers/Settings'
import { convertBeeFileToBrowserFile, convertManifestToFiles } from '../../utils/file'
import { SwarmFile } from '../../utils/SwarmFile'
import { AssetPreview } from './AssetPreview'
import { AssetSummary } from './AssetSummary'
import { DownloadActionBar } from './DownloadActionBar'

interface Props {
  match: {
    params: {
      hash: string
    }
  }
}

export function Share(props: Props): ReactElement {
  const { apiUrl, beeApi } = useContext(SettingsContext)
  const reference = props.match.params.hash
  const history = useHistory()

  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)
  const [files, setFiles] = useState<SwarmFile[]>([])
  const [swarmEntries, setSwarmEntries] = useState<Record<string, string>>({})
  const [indexDocument, setIndexDocument] = useState<string | null>(null)

  async function prepare() {
    if (!beeApi) {
      return
    }

    const swarmManifestList = new SwarmManifestList(beeApi)
    const isManifest = await swarmManifestList.isManifest(reference)

    if (!isManifest) {
      throw Error('The specified hash does not contain valid content.')
    }
    const entries = await swarmManifestList.getHashes(reference)
    setSwarmEntries(entries)
    const indexDocument = await swarmManifestList.getIndexDocument(reference)
    setIndexDocument(indexDocument)

    if (Object.keys(entries).length === 1) {
      const response = await beeApi.downloadFile(reference)
      setFiles([new SwarmFile(convertBeeFileToBrowserFile(response) as File)])
    } else {
      setFiles(convertManifestToFiles(entries))
    }
  }

  function onOpen() {
    window.open(`${apiUrl}/bzz/${reference}/`, '_blank')
  }

  function onClose() {
    history.goBack()
  }

  useEffect(() => {
    setLoading(true)
    prepare().then(() => {
      setLoading(false)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reference])

  async function onDownload() {
    if (!beeApi) {
      return
    }
    setDownloading(true)

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
    setDownloading(false)
  }

  const assetName = reference.slice(0, 8) + '[…]' + reference.slice(-8)

  if (loading) {
    return <Loading />
  }

  return (
    <>
      <Box mb={4}>
        <AssetPreview files={files} assetName={assetName} />
      </Box>
      <Box mb={4}>
        <AssetSummary hash={reference} />
      </Box>
      <DownloadActionBar
        onOpen={onOpen}
        onCancel={onClose}
        onDownload={onDownload}
        hasIndexDocument={Boolean(indexDocument && files.length > 1)}
        loading={downloading}
      />
    </>
  )
}
