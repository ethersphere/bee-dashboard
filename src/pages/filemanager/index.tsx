import { DriveInfo, FileManagerBase } from '@solarpunkltd/file-manager-lib'
import { ReactElement, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'

import { SearchProvider } from './SearchContext'
import { ViewProvider } from './ViewContext'

import './FileManager.scss'

import { AdminStatusBar } from '@/modules/filemanager/components/AdminStatusBar/AdminStatusBar'
import { Button } from '@/modules/filemanager/components/Button/Button'
import { ConfirmModal } from '@/modules/filemanager/components/ConfirmModal/ConfirmModal'
import { ErrorModal } from '@/modules/filemanager/components/ErrorModal/ErrorModal'
import { FileBrowser } from '@/modules/filemanager/components/FileBrowser/FileBrowser'
import { FormbricksIntegration } from '@/modules/filemanager/components/FormbricksIntegration/FormbricksIntegration'
import { Header } from '@/modules/filemanager/components/Header/Header'
import { InitialModal } from '@/modules/filemanager/components/InitialModal/InitialModal'
import { PrivateKeyModal } from '@/modules/filemanager/components/PrivateKeyModal/PrivateKeyModal'
import { Sidebar } from '@/modules/filemanager/components/Sidebar/Sidebar'
import { getSignerPk, removeSignerPk } from '@/modules/filemanager/utils/common'
import { CheckState, Context as BeeContext } from '@/providers/Bee'
import { Context as FMContext } from '@/providers/FileManager'
import { BrowserPlatform, cacheClearUrls, detectBrowser } from '@/providers/Platform'

function PrivateKeyModalBlock({ onSaved }: { onSaved: () => void }) {
  return (
    <div className="fm-main">
      <PrivateKeyModal onSaved={onSaved} />
    </div>
  )
}

function InitializationErrorBlock({ onOk }: { onOk: () => void }) {
  return (
    <div className="fm-main">
      <div className="fm-loading">
        <div className="fm-loading-title">Failed to initialize File Manager, reload and try again </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
          <div style={{ minWidth: '120px' }}>
            <Button label={'OK'} variant="primary" disabled={false} onClick={onOk} />
          </div>
        </div>
      </div>
    </div>
  )
}

function ResetModalBlock({ cacheHelpUrl, onConfirm }: { cacheHelpUrl: string; onConfirm: () => void }) {
  return (
    <div className="fm-main">
      <ConfirmModal
        title="Reset File Manager State"
        message={
          <span>
            Your File Manager state appears invalid. Please{' '}
            <a
              href={cacheHelpUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline', textDecoration: 'underline' }}
            >
              clear the browser cache
            </a>{' '}
            and reload the page. Then you can reset the File Manager to continue.
          </span>
        }
        confirmLabel="Continue"
        onConfirm={onConfirm}
        background={false}
      />
    </div>
  )
}

function InitialModalBlock(props: {
  resetState: boolean
  handleShowError: (flag: boolean, error?: string) => void
  setIsCreationInProgress: (isCreating: boolean) => void
}) {
  return (
    <div className="fm-main">
      <InitialModal {...props} />
    </div>
  )
}

function LoadingBlock() {
  return (
    <div className="fm-main">
      <div className="fm-loading" aria-live="polite">
        <div className="fm-spinner" aria-hidden="true" />
        <div className="fm-loading-title">File manager loading…</div>
        <div className="fm-loading-subtitle">Please wait a few seconds</div>
      </div>
    </div>
  )
}

function ErrorModalBlock({ onClick, label }: { onClick: () => void; label: string }) {
  return <ErrorModal label={label} onClick={onClick} />
}

function FileManagerMainContent(props: {
  fm: FileManagerBase | null
  showConnectionError: boolean
  setShowConnectionError: (v: boolean) => void
  isFormbricksActive: boolean
  errorMessage: string
  setErrorMessage: (msg: string) => void
  loading: boolean
  adminDrive: DriveInfo | null
  isCreationInProgress: boolean
}) {
  const {
    fm,
    showConnectionError,
    setShowConnectionError,
    isFormbricksActive,
    errorMessage,
    setErrorMessage,
    loading,
    adminDrive,
    isCreationInProgress,
  } = props

  return (
    <SearchProvider>
      <ViewProvider>
        <div className="fm-main">
          {showConnectionError && fm && (
            <ErrorModal
              label="Bee node connection error. Please check your node status. File Manager will continue when connection is restored."
              onClick={() => setShowConnectionError(false)}
            />
          )}
          <FormbricksIntegration isActive={isFormbricksActive} />
          <Header />
          <div className="fm-main-content">
            <Sidebar errorMessage={errorMessage} setErrorMessage={setErrorMessage} loading={loading} />
            <FileBrowser errorMessage={errorMessage} setErrorMessage={setErrorMessage} />
          </div>
          <AdminStatusBar
            adminStamp={fm?.adminStamp || null}
            adminDrive={adminDrive}
            loading={loading}
            isCreationInProgress={isCreationInProgress}
            setErrorMessage={setErrorMessage}
          />
        </div>
      </ViewProvider>
    </SearchProvider>
  )
}

enum PageState {
  Connecting = 'connecting', // still warming up — show nothing / loader
  NoPrivateKey = 'no-pk', // private key not set
  Loading = 'loading', // bee ready, pk present, FM init in progress
  Reset = 'reset', // STATE_INVALID emitted and user has not yet acknowledged
  InitError = 'init-error', // FM init completed with an error (non-reset case)
  Initial = 'initial', // FM ready but no admin stamp/drive → show InitialModal
  AdminError = 'admin-error', // drive creation failed
  Ready = 'ready', // fully operational
}

export function FileManagerPage(): ReactElement {
  const isMountedRef = useRef(true)
  const [hasPk, setHasPk] = useState<boolean>(getSignerPk() !== undefined)
  const [showAdminErrorModal, setAdminShowErrorModal] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [resetAcknowledged, setResetAcknowledged] = useState<boolean>(false)
  const [isCreationInProgress, setIsCreationInProgress] = useState<boolean>(false)
  const [connectionErrorDismissed, setConnectionErrorDismissed] = useState<boolean>(false)
  const [cacheHelpUrl, setCacheHelpUrl] = useState<string>(cacheClearUrls[BrowserPlatform.Chrome])

  const { status } = useContext(BeeContext)
  const { fm, initDone, shallReset, adminDrive, initializationError, notifyPkSaved } = useContext(FMContext)

  useEffect(() => {
    isMountedRef.current = true

    const getBrowserPlatform = async () => {
      const browserPlatform = await detectBrowser()
      setCacheHelpUrl(cacheClearUrls[browserPlatform])
    }

    getBrowserPlatform()

    return () => {
      isMountedRef.current = false
    }
  }, [])

  const { isBeeReady, isConnectionError } = useMemo(() => {
    const isConnecting = status.all === CheckState.CONNECTING
    const isApiOk = status.apiConnection.isEnabled && status.apiConnection.checkState === CheckState.OK

    return {
      isBeeReady: !isConnecting && isApiOk,
      isConnectionError: !isConnecting && !isApiOk && Boolean(fm),
    }
  }, [status, fm])

  useEffect(() => {
    if (!isConnectionError) {
      setConnectionErrorDismissed(false)
    }
  }, [isConnectionError])

  const pageState = useMemo((): PageState => {
    if (!isBeeReady && !initDone) return PageState.Connecting

    if (!hasPk) return PageState.NoPrivateKey

    if (!initDone) return PageState.Loading

    if (shallReset && !resetAcknowledged) return PageState.Reset

    if (initializationError && !shallReset) return PageState.InitError

    if (showAdminErrorModal) return PageState.AdminError

    const hasAdminStamp = Boolean(fm?.adminStamp)
    const hasAdminDrive = Boolean(adminDrive)

    if (!hasAdminStamp && !hasAdminDrive && !isCreationInProgress) return PageState.Initial

    return PageState.Ready
  }, [
    isBeeReady,
    hasPk,
    initDone,
    shallReset,
    resetAcknowledged,
    initializationError,
    showAdminErrorModal,
    fm,
    adminDrive,
    isCreationInProgress,
  ])

  const handlePrivateKeySaved = useCallback(() => {
    if (!isMountedRef.current) return

    setHasPk(true)

    if (fm) return

    notifyPkSaved()
  }, [fm, notifyPkSaved])

  const loading = !fm?.adminStamp || !adminDrive
  const isFormbricksActive = Boolean(fm && fm.adminStamp && adminDrive && !loading)

  if (pageState === PageState.Connecting || pageState === PageState.Loading) {
    return <LoadingBlock />
  }

  if (pageState === PageState.NoPrivateKey) {
    return <PrivateKeyModalBlock onSaved={handlePrivateKeySaved} />
  }

  if (pageState === PageState.InitError) {
    return (
      <InitializationErrorBlock
        onOk={() => {
          removeSignerPk()
          setHasPk(false)
        }}
      />
    )
  }

  if (pageState === PageState.Reset) {
    return <ResetModalBlock cacheHelpUrl={cacheHelpUrl} onConfirm={() => setResetAcknowledged(true)} />
  }

  if (pageState === PageState.Initial) {
    return (
      <InitialModalBlock
        resetState={shallReset}
        handleShowError={(flag: boolean, error?: string) => {
          setAdminShowErrorModal(flag)

          if (error) setErrorMessage(error)
        }}
        setIsCreationInProgress={(isCreating: boolean) => setIsCreationInProgress(isCreating)}
      />
    )
  }

  if (pageState === PageState.AdminError) {
    return (
      <ErrorModalBlock
        label={
          errorMessage ||
          'Error creating Admin Drive. Please try again. Possible causes include insufficient xDAI balance or a lost connection to the RPC.'
        }
        onClick={() => {
          setAdminShowErrorModal(false)
          setErrorMessage('')
        }}
      />
    )
  }

  return (
    <FileManagerMainContent
      fm={fm}
      showConnectionError={isConnectionError && !connectionErrorDismissed}
      setShowConnectionError={(show: boolean) => setConnectionErrorDismissed(!show)}
      isFormbricksActive={isFormbricksActive}
      errorMessage={errorMessage}
      setErrorMessage={setErrorMessage}
      loading={loading}
      adminDrive={adminDrive}
      isCreationInProgress={isCreationInProgress}
    />
  )
}
