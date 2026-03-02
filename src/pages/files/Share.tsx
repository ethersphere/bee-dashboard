import { Bytes } from '@ethersphere/bee-js'
import { Box, Typography } from '@mui/material'
import { saveAs } from 'file-saver'
import JSZip from 'jszip'
import { useSnackbar } from 'notistack'
import { ReactElement, useContext, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { HistoryHeader } from '../../components/HistoryHeader'
import { Loading } from '../../components/Loading'
import TroubleshootConnectionCard from '../../components/TroubleshootConnectionCard'
import { META_FILE_NAME } from '../../constants'
import { Context as BeeContext } from '../../providers/Bee'
import { Context as SettingsContext } from '../../providers/Settings'
import { ROUTES } from '../../routes'
import { determineHistoryName, LocalStorageKeys, putHistory } from '../../utils/localStorage'
import { loadManifest } from '../../utils/manifest'

import { AssetPreview } from './AssetPreview'
import { AssetSummary } from './AssetSummary'
import { AssetSyncing } from './AssetSyncing'
import { DownloadActionBar } from './DownloadActionBar'

export function Share(): ReactElement {
  const { apiUrl, beeApi } = useContext(SettingsContext)
  const { status } = useContext(BeeContext)

  const { hash } = useParams()

  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()

  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)
  const [swarmEntries, setSwarmEntries] = useState<Record<string, string>>({})
  const [indexDocument, setIndexDocument] = useState<string | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [preview, setPreview] = useState<string | undefined>(undefined)
  const [metadata, setMetadata] = useState<Metadata | undefined>()

  const isMountedRef = useRef(true)

  async function prepare() {
    if (!beeApi || !status.all || !hash) {
      return
    }

    try {
      const manifest = await loadManifest(beeApi, hash)
      const entries = manifest.collectAndMap()
      delete entries[META_FILE_NAME]

      if (!isMountedRef.current) return

      setSwarmEntries(entries)

      const docsMetadata = manifest.getDocsMetadata()

      // needed in catch block, shadows the outer variable
      const indexDocument = docsMetadata.indexDocument

      if (!isMountedRef.current) return

      setIndexDocument(indexDocument)

      try {
        const remoteMetadata = await beeApi.downloadFile(hash, META_FILE_NAME)
        const formattedMetadata = remoteMetadata.data.toJSON() as Metadata

        if (formattedMetadata.isVideo || formattedMetadata.isAudio || formattedMetadata.isImage) {
          if (!isMountedRef.current) return
          setPreview(`${apiUrl}/bzz/${hash}`)
        }

        if (!isMountedRef.current) return

        setMetadata({ ...formattedMetadata, hash })
      } catch {
        // if metadata is not available or invalid go with the default one
        const count = Object.keys(entries).length

        if (!isMountedRef.current) return

        setMetadata({
          hash,
          type: count > 1 ? 'folder' : 'unknown',
          name: hash,
          count,
          isWebsite: Boolean(indexDocument && /.*\.html?$/i.test(indexDocument)),
          isVideo: Boolean(indexDocument && /.*\.(mp4|webm|ogv)$/i.test(indexDocument)),
          isAudio: Boolean(indexDocument && /.*\.(mp3|ogg|oga|wav|webm|m4a|aac|flac)$/i.test(indexDocument)),
          isImage: Boolean(indexDocument && /.*\.(jpg|jpeg|png|gif|webp|svg)$/i.test(indexDocument)),
          // naive assumption based on indexDocument, we don't want to download the whole manifest
        })
      }
    } catch {
      if (!isMountedRef.current) return

      setNotFound(true)
      enqueueSnackbar('The specified hash does not contain valid content.', { variant: 'error' })

      return
    }
  }

  function onOpen() {
    window.open(`${apiUrl}/bzz/${hash}/`, '_blank')
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
    if (!hash) {
      // eslint-disable-next-line no-console
      console.error('hash is invalid')

      return
    }

    navigate(ROUTES.ACCOUNT_FEEDS_UPDATE.replace(':hash', hash))
  }

  useEffect(() => {
    isMountedRef.current = true

    return () => {
      isMountedRef.current = false
    }
  }, [])

  useEffect(() => {
    setLoading(true)
    prepare().finally(() => {
      if (!isMountedRef.current) return
      setLoading(false)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hash])

  async function onDownload() {
    if (!beeApi || !hash) {
      // eslint-disable-next-line no-console
      console.error('hash is invalid')

      return
    }

    putHistory(LocalStorageKeys.downloadHistory, hash, determineHistoryName(hash, indexDocument))
    setDownloading(true)

    if (Object.keys(swarmEntries).length === 1) {
      const singleFileName = Object.keys(swarmEntries)[0]
      const singleFileHash = Object.values(swarmEntries)[0]

      let fileData: Bytes
      try {
        fileData = await beeApi.downloadData(singleFileHash)
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to download file: ', err)

        return
      }

      const dataArray = fileData.toUint8Array()
      const arrayBuffer = new ArrayBuffer(dataArray.length)
      const view = new Uint8Array(arrayBuffer)
      view.set(dataArray)
      const blob = new Blob([arrayBuffer], { type: metadata?.type || 'application/octet-stream' })
      saveAs(blob, metadata?.name || singleFileName || hash)
    } else {
      const zip = new JSZip()
      for (const [path, hash] of Object.entries(swarmEntries)) {
        try {
          zip.file(path, (await beeApi.downloadData(hash)).toUint8Array())
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error('Failed to download files: ', err)

          return
        }
      }

      let content: Blob
      try {
        content = await zip.generateAsync({ type: 'blob' })
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to compress file: ', err)

        return
      }

      saveAs(content, hash + '.zip')
    }

    if (!isMountedRef.current) return

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
        <AssetSummary isWebsite={metadata?.isWebsite} reference={hash} />
      </Box>
      <Box mb={4}>
        <AssetSyncing reference={hash} />
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
