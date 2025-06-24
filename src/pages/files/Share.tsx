import { Box, Typography } from '@material-ui/core'
import { MantarayNode, NULL_ADDRESS } from '@upcoming/bee-js'
import { saveAs } from 'file-saver'
import JSZip from 'jszip'
import { useSnackbar } from 'notistack'
import { ReactElement, useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { HistoryHeader } from '../../components/HistoryHeader'
import { Loading } from '../../components/Loading'
import TroubleshootConnectionCard from '../../components/TroubleshootConnectionCard'
import { META_FILE_NAME } from '../../constants'
import { Context as BeeContext } from '../../providers/Bee'
import { Context as SettingsContext } from '../../providers/Settings'
import { ROUTES } from '../../routes'
import { determineHistoryName, HISTORY_KEYS, putHistory } from '../../utils/local-storage'
import { AssetPreview } from './AssetPreview'
import { AssetSummary } from './AssetSummary'
import { AssetSyncing } from './AssetSyncing'
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
  const [swarmEntries, setSwarmEntries] = useState<Record<string, string>>({})
  const [indexDocument, setIndexDocument] = useState<string | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [preview, setPreview] = useState<string | undefined>(undefined)
  const [metadata, setMetadata] = useState<Metadata | undefined>()

  async function prepare() {
    if (!beeApi || !status.all) {
      return
    }

    try {
      let manifest = await MantarayNode.unmarshal(beeApi, reference)
      await manifest.loadRecursively(beeApi)

      // If the manifest is a feed, resolve it and overwrite the manifest
      await manifest.resolveFeed(beeApi).then(
        async feed =>
          await feed.ifPresentAsync(async feedUpdate => {
            manifest = MantarayNode.unmarshalFromData(feedUpdate.payload.toUint8Array(), NULL_ADDRESS)
            await manifest.loadRecursively(beeApi)
          }),
      )

      const entries = manifest.collectAndMap()
      delete entries[META_FILE_NAME]
      setSwarmEntries(entries)

      const docsMetadata = manifest.getDocsMetadata()

      // needed in catch block, shadows the outer variable
      const indexDocument = docsMetadata.indexDocument
      setIndexDocument(indexDocument)

      try {
        const remoteMetadata = await beeApi.downloadFile(reference, META_FILE_NAME)
        const formattedMetadata = remoteMetadata.data.toJSON() as Metadata

        if (formattedMetadata.isVideo || formattedMetadata.isImage) {
          setPreview(`${apiUrl}/bzz/${reference}`)
        }
        setMetadata({ ...formattedMetadata, hash })
      } catch (e) {
        // if metadata is not available or invalid go with the default one
        const count = Object.keys(entries).length
        setMetadata({
          hash,
          type: count > 1 ? 'folder' : 'unknown',
          name: reference,
          count,
          isWebsite: Boolean(indexDocument && /.*\.html?$/i.test(indexDocument)),
          isVideo: Boolean(indexDocument && /.*\.(mp4|webm|ogg|mp3|ogg|wav)$/i.test(indexDocument)),
          isImage: Boolean(indexDocument && /.*\.(jpg|jpeg|png|gif|webp|svg)$/i.test(indexDocument)),
          // naive assumption based on indexDocument, we don't want to download the whole manifest
        })
      }
    } catch {
      setNotFound(true)
      enqueueSnackbar('The specified hash does not contain valid content.', { variant: 'error' })

      return
    }
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
        zip.file(path, (await beeApi.downloadData(hash)).toUint8Array())
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
