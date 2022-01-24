import { Box } from '@material-ui/core'
import { useSnackbar } from 'notistack'
import { ReactElement, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DocumentationText } from '../../components/DocumentationText'
import { HistoryHeader } from '../../components/HistoryHeader'
import { ProgressIndicator } from '../../components/ProgressIndicator'
import TroubleshootConnectionCard from '../../components/TroubleshootConnectionCard'
import { Context as BeeContext } from '../../providers/Bee'
import { Context as IdentityContext, Identity } from '../../providers/Feeds'
import { Context as FileContext } from '../../providers/File'
import { Context as SettingsContext } from '../../providers/Settings'
import { Context as StampsContext, EnrichedPostageBatch } from '../../providers/Stamps'
import { ROUTES } from '../../routes'
import { detectIndexHtml, getAssetNameFromFiles, packageFile } from '../../utils/file'
import { persistIdentity, updateFeed } from '../../utils/identity'
import { HISTORY_KEYS, putHistory } from '../../utils/local-storage'
import { FeedPasswordDialog } from '../feeds/FeedPasswordDialog'
import { PostageStampCreation } from '../stamps/PostageStampCreation'
import { PostageStampSelector } from '../stamps/PostageStampSelector'
import { AssetPreview } from './AssetPreview'
import { StampPreview } from './StampPreview'
import { UploadActionBar } from './UploadActionBar'
import { META_FILE_NAME, PREVIEW_FILE_NAME } from '../../constants'

export function Upload(): ReactElement {
  const [step, setStep] = useState(0)
  const [stampMode, setStampMode] = useState<'SELECT' | 'BUY'>('SELECT')
  const [stamp, setStamp] = useState<EnrichedPostageBatch | null>(null)
  const [isUploading, setUploading] = useState(false)
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false)

  const { refresh } = useContext(StampsContext)
  const { beeApi } = useContext(SettingsContext)
  const { files, setFiles, uploadOrigin, metadata, previewUri, previewBlob } = useContext(FileContext)
  const { identities, setIdentities } = useContext(IdentityContext)
  const { status } = useContext(BeeContext)

  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()

  useEffect(() => {
    refresh()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (!status.all) return <TroubleshootConnectionCard />

  if (!files.length) {
    setFiles([])
    navigate(ROUTES.UPLOAD, { replace: true })

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
    if (!beeApi || !files.length || !stamp || !metadata) {
      return
    }

    let fls = files.map(packageFile) // Apart from packaging, this is needed to not modify the original files array as it can trigger effects
    let indexDocument = undefined

    if (files.length === 1) indexDocument = files[0].name
    else if (files.length > 1) {
      const idx = detectIndexHtml(files)

      if (idx) {
        if (idx.commonPrefix) {
          const substrStart = idx.commonPrefix.length
          indexDocument = idx.indexPath.substr(substrStart)
          fls = fls.map(f => {
            const path = (f.path as string).substr(substrStart)

            return { ...f, path, webkitRelativePath: path, fullPath: path }
          })
        } else {
          indexDocument = idx.indexPath
        }
      }
    }
    const lastModified = files[0].lastModified

    // We want to store only some metadata
    const mtd: SwarmMetadata = {
      name: metadata.name,
      size: metadata.size,
    }

    // Type of the file only makes sense for a single file
    if (files.length === 1) mtd.type = metadata.type

    const metafile = new File([JSON.stringify(mtd)], META_FILE_NAME, {
      type: 'application/json',
      lastModified,
    })
    fls.push(packageFile(metafile))

    if (previewBlob) {
      const previewFile = new File([previewBlob], PREVIEW_FILE_NAME, {
        type: 'image/jpeg',
        lastModified,
      })
      fls.push(packageFile(previewFile))
    }

    setUploading(true)

    beeApi
      .uploadFiles(stamp.batchID, fls, { indexDocument })
      .then(hash => {
        putHistory(HISTORY_KEYS.UPLOAD_HISTORY, hash.reference, getAssetNameFromFiles(files))

        if (uploadOrigin.origin === 'UPLOAD') {
          navigate(ROUTES.HASH.replace(':hash', hash.reference), { replace: true })
        } else {
          updateFeed(beeApi, identity as Identity, hash.reference, stamp.batchID, password as string).then(() => {
            persistIdentity(identities, identity as Identity)
            setIdentities([...identities])
            navigate(ROUTES.FEEDS_PAGE.replace(':uuid', uploadOrigin.uuid as string), { replace: true })
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
      {(step === 0 || step === 2) && <AssetPreview metadata={metadata} previewUri={previewUri} />}
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
