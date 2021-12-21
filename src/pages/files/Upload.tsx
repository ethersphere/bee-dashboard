import { Box } from '@material-ui/core'
import { useSnackbar } from 'notistack'
import { ReactElement, useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { DocumentationText } from '../../components/DocumentationText'
import { HistoryHeader } from '../../components/HistoryHeader'
import { ProgressIndicator } from '../../components/ProgressIndicator'
import { Context as IdentityContext, Identity } from '../../providers/Feeds'
import { Context as FileContext } from '../../providers/File'
import { Context as SettingsContext } from '../../providers/Settings'
import { Context as StampsContext, EnrichedPostageBatch } from '../../providers/Stamps'
import { ROUTES } from '../../routes'
import { detectIndexHtml, getAssetNameFromFiles } from '../../utils/file'
import { persistIdentity, updateFeed } from '../../utils/identity'
import { HISTORY_KEYS, putHistory } from '../../utils/local-storage'
import { FeedPasswordDialog } from '../feeds/FeedPasswordDialog'
import { PostageStampCreation } from '../stamps/PostageStampCreation'
import { PostageStampSelector } from '../stamps/PostageStampSelector'
import { AssetPreview } from './AssetPreview'
import { StampPreview } from './StampPreview'
import { UploadActionBar } from './UploadActionBar'

export function Upload(): ReactElement {
  const [step, setStep] = useState(0)
  const [stampMode, setStampMode] = useState<'SELECT' | 'BUY'>('SELECT')
  const [stamp, setStamp] = useState<EnrichedPostageBatch | null>(null)
  const [isUploading, setUploading] = useState(false)
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false)

  const { refresh } = useContext(StampsContext)
  const { beeApi } = useContext(SettingsContext)
  const { files, setFiles, uploadOrigin } = useContext(FileContext)
  const { identities, setIdentities } = useContext(IdentityContext)
  const { enqueueSnackbar } = useSnackbar()
  const history = useHistory()

  useEffect(() => {
    refresh()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (!files.length) {
    setFiles([])
    history.replace(ROUTES.UPLOAD)

    return <></>
  }

  const identity = uploadOrigin.uuid ? identities.find(x => x.uuid === uploadOrigin.uuid) : null

  const onUpload = () => {
    if (uploadOrigin.origin === 'UPLOAD') {
      uploadFiles()
    } else {
      if ((identity as Identity).type === 'PRIVATE_KEY') {
        uploadFiles()
      } else {
        setShowPasswordPrompt(true)
      }
    }
  }

  const uploadFiles = (password?: string) => {
    if (!beeApi || !files.length || !stamp) {
      return
    }

    const indexDocument = files.length === 1 ? files[0].name : detectIndexHtml(files) || undefined

    setUploading(true)

    beeApi
      .uploadFiles(stamp.batchID, files as unknown as File[], { indexDocument })
      .then(hash => {
        putHistory(HISTORY_KEYS.UPLOAD_HISTORY, hash.reference, getAssetNameFromFiles(files))

        if (uploadOrigin.origin === 'UPLOAD') {
          history.replace(ROUTES.HASH.replace(':hash', hash.reference))
        } else {
          updateFeed(beeApi, identity as Identity, hash.reference, stamp.batchID, password as string).then(() => {
            persistIdentity(identities, identity as Identity)
            setIdentities([...identities])
            history.replace(ROUTES.FEEDS_PAGE.replace(':uuid', uploadOrigin.uuid as string))
          })
        }
      })
      .catch(e => {
        enqueueSnackbar(`Error uploading: ${e.message}`, { variant: 'error' })
        setUploading(false)
      })
  }

  const reset = () => {
    setStep(0)
    setFiles([])
    setStamp(null)
    setUploading(false)
  }

  const onFeedPasswordGiven = (password: string) => {
    uploadFiles(password)
  }

  return (
    <>
      {showPasswordPrompt && (
        <FeedPasswordDialog
          loading={isUploading}
          feedName={(identity as Identity).name}
          onCancel={() => setShowPasswordPrompt(false)}
          onProceed={onFeedPasswordGiven}
        />
      )}
      {identity && <HistoryHeader>{`Update "${identity.name}"`}</HistoryHeader>}
      {!identity && <HistoryHeader>Upload</HistoryHeader>}
      <Box mb={4}>
        <ProgressIndicator steps={['Preview', 'Add postage stamp', 'Upload to node']} index={step} />
      </Box>
      {(step === 0 || step === 2) && <AssetPreview files={files} />}
      {step === 1 && (
        <>
          <Box mb={2}>
            {stampMode === 'SELECT' ? (
              <PostageStampSelector onSelect={stamp => setStamp(stamp)} defaultValue={stamp?.batchID} />
            ) : (
              <PostageStampCreation onFinished={() => setStampMode('SELECT')} />
            )}
          </Box>
          <Box mb={4}>
            <DocumentationText>
              Please refer to the{' '}
              <a
                href="https://docs.ethswarm.org/debug-api/#tag/Postage-Stamps/paths/~1stamps~1{amount}~1{depth}/post"
                target="_blank"
                rel="noreferrer"
              >
                official Bee documentation
              </a>{' '}
              to understand these values.
            </DocumentationText>
          </Box>
        </>
      )}
      {step === 2 && stamp && <StampPreview stamp={stamp} />}
      <UploadActionBar
        step={step}
        onCancel={reset}
        onGoBack={() => setStep(step => step - 1)}
        onProceed={() => setStep(step => step + 1)}
        onUpload={onUpload}
        isUploading={isUploading}
        hasStamp={Boolean(stamp)}
        uploadLabel={identity ? 'Update Feed' : 'Upload To Your Node'}
        stampMode={stampMode}
        setStampMode={setStampMode}
      />
    </>
  )
}
