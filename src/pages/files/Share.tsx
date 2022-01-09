import { ManifestJs } from '@ethersphere/manifest-js'
import { Box, Typography } from '@material-ui/core'
import { saveAs } from 'file-saver'
import JSZip from 'jszip'
import { useSnackbar } from 'notistack'
import { ReactElement, useContext, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { HistoryHeader } from '../../components/HistoryHeader'
import { Loading } from '../../components/Loading'
import TroubleshootConnectionCard from '../../components/TroubleshootConnectionCard'
import { Context as BeeContext } from '../../providers/Bee'
import { Context as SettingsContext } from '../../providers/Settings'
import { ROUTES } from '../../routes'
import { convertBeeFileToBrowserFile, convertManifestToFiles } from '../../utils/file'
import { shortenHash } from '../../utils/hash'
import { determineHistoryName, HISTORY_KEYS, putHistory } from '../../utils/local-storage'
import { SwarmFile } from '../../utils/SwarmFile'
import { AssetPreview } from './AssetPreview'
import { AssetSummary } from './AssetSummary'
import { DownloadActionBar } from './DownloadActionBar'

export function Share(): ReactElement {
  const { apiUrl, beeApi } = useContext(SettingsContext)
  const { status } = useContext(BeeContext)

  const { hash } = useParams()
  const reference = hash! // eslint-disable-line

  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()

  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)
  const [files, setFiles] = useState<SwarmFile[]>([])
  const [swarmEntries, setSwarmEntries] = useState<Record<string, string>>({})
  const [indexDocument, setIndexDocument] = useState<string | null>(null)
  const [notFound, setNotFound] = useState(false)

  async function prepare() {
    if (!beeApi || !status.all) {
      return
    }

    const manifestJs = new ManifestJs(beeApi)
    const isManifest = await manifestJs.isManifest(reference)

    if (!isManifest) {
      setNotFound(true)
      enqueueSnackbar('The specified hash does not contain valid content.', { variant: 'error' })

      return
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
    if (navigate.length > 0) {
      navigate(ROUTES.UPLOAD)
    } else {
      navigate(-1)
    }
  }

  function onUpdateFeed() {
    navigate(ROUTES.FEEDS_UPDATE.replace(':hash', reference))
  }

  useEffect(() => {
    setLoading(true)
    prepare().finally(() => {
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

  if (!status.all) return <TroubleshootConnectionCard />

  if (loading) {
    return <Loading />
  }

  if (notFound) {
    return (
      <>
        <HistoryHeader>Not Found</HistoryHeader>
        <Typography>The specified hash is not found.</Typography>
      </>
    )
  }

  return (
    <>
      <Box mb={4}>
        <AssetPreview files={files} assetName={assetName} />
      </Box>
      <Box mb={4}>
        <AssetSummary files={files} hash={reference} />
      </Box>
      <DownloadActionBar
        onOpen={onOpen}
        onCancel={onClose}
        onDownload={onDownload}
        onUpdateFeed={onUpdateFeed}
        hasIndexDocument={Boolean(indexDocument && files.length > 1)}
        loading={downloading}
      />
    </>
  )
}
