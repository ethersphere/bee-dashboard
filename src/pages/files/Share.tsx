import { Box, Typography } from '@material-ui/core'
import { saveAs } from 'file-saver'
import JSZip from 'jszip'
import { useSnackbar } from 'notistack'
import { ReactElement, useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { HistoryHeader } from '../../components/HistoryHeader'
import { Loading } from '../../components/Loading'
import TroubleshootConnectionCard from '../../components/TroubleshootConnectionCard'
import { META_FILE_NAME, PREVIEW_FILE_NAME } from '../../constants'
import { Context as BeeContext } from '../../providers/Bee'
import { Context as SettingsContext } from '../../providers/Settings'
import { ROUTES } from '../../routes'
import { determineHistoryName, HISTORY_KEYS, putHistory } from '../../utils/local-storage'
import { ManifestJs } from '../../utils/manifest'
import { AssetPreview } from './AssetPreview'
import { AssetSummary } from './AssetSummary'
import { DownloadActionBar } from './DownloadActionBar'
import { AssetSyncing } from './AssetSyncing'
import { isSupportedVideoType } from '../../utils/video'
import { isSupportedImageType } from '../../utils/image'

export function Share(): ReactElement {
  const { apiUrl, beeApi } = useContext(SettingsContext)
  const { status } = useContext(BeeContext)

  const { hash } = useParams()
  const reference = hash! // eslint-disable-line

  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()

  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)
  const [swarmEntries, setSwarmEntries] = useState<Record<string, string>>({})
  const [indexDocument, setIndexDocument] = useState<string | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [preview, setPreview] = useState<string | undefined>(undefined)
  const [metadata, setMetadata] = useState<Metadata | undefined>()

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
    const indexDocument = await manifestJs.getIndexDocumentPath(reference)
    setIndexDocument(indexDocument)

    const previewFile = Boolean(entries[PREVIEW_FILE_NAME])

    delete entries[META_FILE_NAME]
    delete entries[PREVIEW_FILE_NAME]
    setSwarmEntries(entries)

    const count = Object.keys(entries).length

    let metadata: Metadata | undefined = {
      hash,
      size: 0,
      type: count > 1 ? 'folder' : 'unknown',
      name: reference,
      isWebsite: Boolean(indexDocument) && count > 1,
      count,
    }

    try {
      const mtdt = await beeApi.downloadFile(reference, META_FILE_NAME)
      const remoteMetadata = mtdt.data.text()
      const formattedMetadata = JSON.parse(remoteMetadata) as Metadata

      const isVideo = isSupportedVideoType(formattedMetadata.type)
      const isImage = isSupportedImageType(formattedMetadata.type)
      metadata = { ...metadata, ...formattedMetadata, isVideo, isImage }
    } catch (e) {} // eslint-disable-line no-empty

    if (previewFile) {
      setPreview(`${apiUrl}/bzz/${reference}/${PREVIEW_FILE_NAME}`)
    }

    setMetadata(metadata)
  }

  function onOpen() {
    window.open(`${apiUrl}/bzz/${reference}/`, '_blank')
  }

  function onClose() {
    if (navigate.length > 0) {
      // There is at least one different route in browser history that we can return to
      navigate(-1)
    } else {
      // This is the first page user opened, navigate to upload page instead of going back
      navigate(ROUTES.UPLOAD)
    }
  }

  function onUpdateFeed() {
    navigate(ROUTES.ACCOUNT_FEEDS_UPDATE.replace(':hash', reference))
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
        <AssetPreview metadata={metadata} previewUri={preview} />
      </Box>
      <Box mb={4}>
        <AssetSummary isWebsite={metadata?.isWebsite} reference={reference} />
      </Box>
      <Box mb={4}>
        <AssetSyncing reference={reference} />
      </Box>
      <DownloadActionBar
        onOpen={onOpen}
        onCancel={onClose}
        onDownload={onDownload}
        onUpdateFeed={onUpdateFeed}
        hasIndexDocument={Boolean(metadata?.isWebsite)}
        loading={downloading}
      />
    </>
  )
}
