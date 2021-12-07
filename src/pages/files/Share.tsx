import { ManifestJs } from '@ethersphere/manifest-js'
import { Box } from '@material-ui/core'
import { saveAs } from 'file-saver'
import JSZip from 'jszip'
import { ReactElement, useContext, useEffect, useState } from 'react'
import { RouteComponentProps, useHistory } from 'react-router-dom'
import { Loading } from '../../components/Loading'
import { Context as SettingsContext } from '../../providers/Settings'
import { ROUTES } from '../../routes'
import { convertBeeFileToBrowserFile, convertManifestToFiles } from '../../utils/file'
import { shortenHash } from '../../utils/hash'
import { determineHistoryName, HISTORY_KEYS, putHistory } from '../../utils/local-storage'
import { SwarmFile } from '../../utils/SwarmFile'
import { AssetPreview } from './AssetPreview'
import { AssetSummary } from './AssetSummary'
import { DownloadActionBar } from './DownloadActionBar'

interface MatchParams {
  hash: string
}

export function Share(props: RouteComponentProps<MatchParams>): ReactElement {
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

    const manifestJs = new ManifestJs(beeApi)
    const isManifest = await manifestJs.isManifest(reference)

    if (!isManifest) {
      throw Error('The specified hash does not contain valid content.')
    }
    const entries = await manifestJs.getHashes(reference)
    setSwarmEntries(entries)
    const indexDocument = await manifestJs.getIndexDocumentPath(reference)
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
    // POP means there is no history - nowhere to go back yet
    if (history.action === 'POP') {
      history.push(ROUTES.UPLOAD)
    } else {
      history.goBack()
    }
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
    putHistory(HISTORY_KEYS.DOWNLOAD_HISTORY, reference, determineHistoryName(reference, indexDocument))
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

  const assetName = shortenHash(reference)

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
