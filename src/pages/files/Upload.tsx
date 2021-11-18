import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { useSnackbar } from 'notistack'
import { ReactElement, useContext, useEffect, useState } from 'react'
import { Context as SettingsContext } from '../../providers/Settings'
import { Context, EnrichedPostageBatch } from '../../providers/Stamps'
import { detectIndexHtml, NameWithPath } from '../../utils/file'
import { CreatePostageStampModal } from '../stamps/CreatePostageStampModal'
import { SelectPostageStampModal } from '../stamps/SelectPostageStampModal'
import { PostUploadSummary } from './PostUploadSummary'
import { StampPreview } from './StampPreview'
import { UploadActionBar } from './UploadActionBar'
import { UploadArea } from './UploadArea'
import { UploadPreview } from './UploadPreview'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    content: { marginTop: theme.spacing(2) },
    loadingProgress: { textAlign: 'center', padding: '50px' },
  }),
)

const MAX_FILE_SIZE = 1_000_000_000 // 1 gigabyte

export default function Files(): ReactElement {
  const classes = useStyles()
  const [dropzoneKey, setDropzoneKey] = useState(0)
  const [files, setFiles] = useState<File[]>([])
  const [uploadReference, setUploadReference] = useState('')
  const [isBuyingStamp, setBuyingStamp] = useState(false)
  const [isSelectingStamp, setSelectingStamp] = useState(false)
  const [stamp, setStamp] = useState<EnrichedPostageBatch | null>(null)

  const { stamps, refresh } = useContext(Context)
  const { beeApi } = useContext(SettingsContext)
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    refresh()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const uploadFiles = () => {
    if (!beeApi || !files.length || !stamp) {
      return
    }

    const indexDocument = detectIndexHtml(files as unknown as NameWithPath[]) || undefined

    beeApi
      .uploadFiles(stamp.batchID, files, { indexDocument })
      .then(hash => setUploadReference(hash.reference))
      .catch(e => enqueueSnackbar(`Error uploading: ${e.message}`, { variant: 'error' }))
  }

  const reset = () => {
    setFiles([])
    setStamp(null)
  }

  const uploadNew = () => {
    setTimeout(() => {
      reset()
      setDropzoneKey(dropzoneKey + 1)
      setUploadReference('')
    }, 0)
  }

  return (
    <>
      {files.length ? (
        <UploadPreview files={files} />
      ) : (
        <UploadArea maximumSizeInBytes={MAX_FILE_SIZE} setFiles={setFiles} />
      )}
      {stamp !== null && !uploadReference ? <StampPreview stamp={stamp} /> : null}
      {files.length && !uploadReference ? (
        <UploadActionBar
          canSelectStamp={stamps !== null && stamps.length > 0}
          hasSelectedStamp={stamp !== null}
          onCancel={() => reset()}
          onBuy={() => setBuyingStamp(true)}
          onSelect={() => setSelectingStamp(true)}
          onUpload={() => uploadFiles()}
          onClearStamp={() => setStamp(null)}
        />
      ) : null}
      <div className={classes.content}>
        {uploadReference && (
          <PostUploadSummary onUploadNewClick={() => uploadNew()} uploadReference={uploadReference} />
        )}
      </div>
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
