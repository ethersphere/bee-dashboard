import { Box } from '@mui/material'
import { useSnackbar } from 'notistack'
import { ReactElement, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { DocumentationText } from '../../components/DocumentationText'
import { HistoryHeader } from '../../components/HistoryHeader'
import { ProgressIndicator } from '../../components/ProgressIndicator'
import TroubleshootConnectionCard from '../../components/TroubleshootConnectionCard'
import { META_FILE_NAME } from '../../constants'
import { CheckState, Context as BeeContext } from '../../providers/Bee'
import { Context as IdentityContext, Identity, IdentityType } from '../../providers/Feeds'
import { Context as FileContext } from '../../providers/File'
import { Context as SettingsContext } from '../../providers/Settings'
import { Context as StampsContext, EnrichedPostageBatch } from '../../providers/Stamps'
import { ROUTES } from '../../routes'
import { waitUntilStampUsable } from '../../utils'
import { detectIndexHtml, getAssetNameFromFiles, packageFile } from '../../utils/file'
import { persistIdentity, updateFeed } from '../../utils/identity'
import { LocalStorageKeys, putHistory } from '../../utils/localStorage'
import { FeedPasswordDialog } from '../feeds/FeedPasswordDialog'
import { PostageStampAdvancedCreation } from '../stamps/PostageStampAdvancedCreation'
import { PostageStampSelector } from '../stamps/PostageStampSelector'

import { AssetPreview } from './AssetPreview'
import { FileOrigin } from './FileNavigation'
import { StampPreview } from './StampPreview'
import { StampMode, UploadActionBar } from './UploadActionBar'

export function Upload(): ReactElement {
  const [step, setStep] = useState(0)
  const [stampMode, setStampMode] = useState<StampMode>(StampMode.Select)
  const [stamp, setStamp] = useState<EnrichedPostageBatch | null>(null)
  const [isUploading, setUploading] = useState(false)
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false)

  const { stamps, refresh } = useContext(StampsContext)
  const { beeApi } = useContext(SettingsContext)
  const { files, setFiles, uploadOrigin, metadata, previewUri } = useContext(FileContext)
  const { identities, setIdentities } = useContext(IdentityContext)
  const { status } = useContext(BeeContext)

  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()

  const hasAnyStamps = stamps !== null && stamps.length > 0

  useEffect(() => {
    refresh()
  }, [refresh])

  if (status.all === CheckState.ERROR) return <TroubleshootConnectionCard />

  if (!files.length) {
    setFiles([])
    navigate(ROUTES.UPLOAD, { replace: true })

    return <></>
  }

  const identity = uploadOrigin.uuid ? identities.find(x => x.uuid === uploadOrigin.uuid) : null

  const onUpload = () => {
    if (uploadOrigin.origin === FileOrigin.Upload) {
      uploadFiles()
    } else {
      if ((identity as Identity).type === IdentityType.PrivateKey) {
        uploadFiles()
      } else {
        setShowPasswordPrompt(true)
      }
    }
  }

  const uploadFiles = async (password?: string) => {
    if (!beeApi || !files.length || !stamp || !metadata) {
      return
    }

    let fls: FilePath[] = files.map(f => packageFile(f)) // Apart from packaging, this is needed to not modify the original files array as it can trigger effects
    let indexDocument: string | undefined = undefined // This means we assume it's folder

    if (files.length === 1) indexDocument = unescape(encodeURIComponent(files[0].name))
    else if (files.length > 1) {
      const idx = detectIndexHtml(files)

      // This is a website
      if (idx) {
        // The website is in some directory, remove it
        if (idx.commonPrefix) {
          const substrStart = idx.commonPrefix.length
          indexDocument = idx.indexPath.slice(substrStart)
          fls = files.map(f => {
            const path = (f.path as string).slice(substrStart)

            return packageFile(f, path)
          })
        } else {
          // The website is not packed in a directory
          indexDocument = idx.indexPath
        }
      }
    }

    const lastModified = files[0].lastModified

    const metafile = new File([JSON.stringify(metadata)], META_FILE_NAME, {
      type: 'application/json',
      lastModified,
    })
    fls.push(packageFile(metafile))

    setUploading(true)

    await waitUntilStampUsable(stamp.batchID, beeApi)

    beeApi
      .uploadFiles(stamp.batchID, fls, { indexDocument, deferred: true })
      .then(hash => {
        putHistory(LocalStorageKeys.uploadHistory, hash.reference.toHex(), getAssetNameFromFiles(files))

        if (uploadOrigin.origin === FileOrigin.Upload) {
          navigate(ROUTES.HASH.replace(':hash', hash.reference.toHex()), { replace: true })
        } else {
          updateFeed(beeApi, identity as Identity, hash.reference, stamp.batchID, password as string).then(() => {
            persistIdentity(identities, identity as Identity)
            setIdentities([...identities])
            navigate(ROUTES.ACCOUNT_FEEDS_VIEW.replace(':uuid', uploadOrigin.uuid as string), { replace: true })
          })
        }
      })
      .catch(e => {
        // eslint-disable-next-line no-console
        console.error(e)
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
            {hasAnyStamps && stampMode === StampMode.Select ? (
              <PostageStampSelector onSelect={stamp => setStamp(stamp)} defaultValue={stamp?.batchID.toHex()} />
            ) : (
              <PostageStampAdvancedCreation onFinished={() => setStampMode(StampMode.Select)} />
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
      {step === 2 && stamp && (
        <>
          <StampPreview stamp={stamp} />
          <Box mb={4}>
            <DocumentationText>
              Please do not close the application until your file is uploaded to your local node!
            </DocumentationText>
          </Box>
        </>
      )}
      <UploadActionBar
        step={step}
        onCancel={reset}
        onGoBack={() => setStep(step => step - 1)}
        onProceed={() => setStep(step => step + 1)}
        onUpload={onUpload}
        isUploading={isUploading}
        hasStamp={Boolean(stamp)}
        hasAnyStamps={hasAnyStamps}
        uploadLabel={identity ? 'Update Feed' : 'Upload To Your Node'}
        stampMode={stampMode}
        setStampMode={setStampMode}
      />
    </>
  )
}
