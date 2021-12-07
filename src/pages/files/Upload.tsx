import { useSnackbar } from 'notistack'
import { ReactElement, useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { HistoryHeader } from '../../components/HistoryHeader'
import { Context as FileContext } from '../../providers/File'
import { Context as SettingsContext } from '../../providers/Settings'
import { Context, EnrichedPostageBatch } from '../../providers/Stamps'
import { ROUTES } from '../../routes'
import { detectIndexHtml, getAssetNameFromFiles } from '../../utils/file'
import { HISTORY_KEYS, putHistory } from '../../utils/local-storage'
import { CreatePostageStampModal } from '../stamps/CreatePostageStampModal'
import { SelectPostageStampModal } from '../stamps/SelectPostageStampModal'
import { AssetPreview } from './AssetPreview'
import { StampPreview } from './StampPreview'
import { UploadActionBar } from './UploadActionBar'

export function Upload(): ReactElement {
  const [isBuyingStamp, setBuyingStamp] = useState(false)
  const [isSelectingStamp, setSelectingStamp] = useState(false)
  const [stamp, setStamp] = useState<EnrichedPostageBatch | null>(null)
  const [isUploading, setUploading] = useState(false)

  const { stamps, refresh } = useContext(Context)
  const { beeApi } = useContext(SettingsContext)
  const { files, setFiles } = useContext(FileContext)
  const { enqueueSnackbar } = useSnackbar()
  const history = useHistory()

  if (!files.length) {
    setFiles([])
    history.replace(ROUTES.UPLOAD)
  }

  useEffect(() => {
    refresh()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const uploadFiles = () => {
    if (!beeApi || !files.length || !stamp) {
      return
    }

    const indexDocument = files.length === 1 ? files[0].name : detectIndexHtml(files) || undefined

    setUploading(true)

    beeApi
      .uploadFiles(stamp.batchID, files as unknown as File[], { indexDocument })
      .then(hash => {
        putHistory(HISTORY_KEYS.UPLOAD_HISTORY, hash.reference, getAssetNameFromFiles(files))
        history.replace(ROUTES.HASH.replace(':hash', hash.reference))
      })
      .catch(e => {
        enqueueSnackbar(`Error uploading: ${e.message}`, { variant: 'error' })
        setUploading(false)
      })
  }

  const reset = () => {
    setFiles([])
    setStamp(null)
    setUploading(false)
  }

  return (
    <>
      <HistoryHeader>Upload</HistoryHeader>
      {files.length && <AssetPreview files={files} />}
      {stamp !== null ? <StampPreview stamp={stamp} /> : null}
      {files.length && (
        <UploadActionBar
          canSelectStamp={stamps !== null && stamps.length > 0}
          hasSelectedStamp={stamp !== null}
          onCancel={reset}
          onBuy={() => setBuyingStamp(true)}
          onSelect={() => setSelectingStamp(true)}
          onUpload={uploadFiles}
          onClearStamp={() => setStamp(null)}
          isUploading={isUploading}
        />
      )}
      {isBuyingStamp ? <CreatePostageStampModal onClose={() => setBuyingStamp(false)} /> : null}
      {stamps && isSelectingStamp ? (
        <SelectPostageStampModal
          stamps={stamps}
          onClose={() => setSelectingStamp(false)}
          onSelect={stamp => setStamp(stamp)}
        />
      ) : null}
    </>
  )
}
