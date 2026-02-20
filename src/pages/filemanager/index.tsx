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
import { Context as SettingsContext } from '@/providers/Settings'

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
  handleVisibility: (isVisible: boolean) => void
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

export function FileManagerPage(): ReactElement {
  const isMountedRef = useRef(true)
  const [showInitialModal, setShowInitialModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [hasAdminDrive, setHasAdminDrive] = useState(false)
  const [hasPk, setHasPk] = useState<boolean>(getSignerPk() !== undefined)
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [showResetModal, setShowResetModal] = useState<boolean>(false)
  const [isCreationInProgress, setIsCreationInProgress] = useState<boolean>(false)
  const [showConnectionError, setShowConnectionError] = useState<boolean>(false)
  const [cacheHelpUrl, setCacheHelpUrl] = useState<string>(cacheClearUrls[BrowserPlatform.Chrome])

  const { status } = useContext(BeeContext)
  const { beeApi } = useContext(SettingsContext)
  const { fm, shallReset, adminDrive, initializationError, init } = useContext(FMContext)

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

  useEffect(() => {
    if (status.all !== CheckState.OK) {
      setShowConnectionError(true)
    } else {
      setShowConnectionError(false)
    }
  }, [status.all])

  useEffect(() => {
    if (!beeApi) {
      return
    }

    if (!hasPk) {
      setIsLoading(false)

      return
    }

    setShowResetModal(shallReset)

    if (shallReset) {
      setShowInitialModal(true)

      return
    }

    if (initializationError) {
      setIsLoading(false)

      return
    }

    if (fm) {
      const hasAdminStamp = Boolean(fm.adminStamp)
      const tmpHasAdminDrive = Boolean(adminDrive)
      setHasAdminDrive(hasAdminStamp || tmpHasAdminDrive)
      setIsLoading(false)

      setShowInitialModal(!(hasAdminStamp || tmpHasAdminDrive))

      return
    }

    setIsLoading(true)
  }, [fm, beeApi, hasPk, initializationError, adminDrive, shallReset])

  const handlePrivateKeySaved = useCallback(async () => {
    if (!isMountedRef.current) return

    setHasPk(true)

    if (fm) {
      if (!isMountedRef.current) return

      setIsLoading(false)

      return
    }

    setIsLoading(true)
    const manager = await init()

    if (!isMountedRef.current) return

    setIsLoading(false)

    const hasAdminStamp = Boolean(manager?.adminStamp)
    const tmpHasAdminDrive = Boolean(adminDrive)

    setShowInitialModal(!(hasAdminStamp || tmpHasAdminDrive))
  }, [fm, adminDrive, init])

  const isEmptyState = useMemo(() => {
    return showInitialModal && !isLoading && !hasAdminDrive && !isCreationInProgress
  }, [showInitialModal, isLoading, hasAdminDrive, isCreationInProgress])
  const isInvalidState = useMemo(
    () => shallReset && fm && !isCreationInProgress,
    [shallReset, fm, isCreationInProgress],
  )

  const loading = !fm?.adminStamp || !adminDrive

  const isFormbricksActive = Boolean(fm && fm.adminStamp && adminDrive && !showInitialModal && !loading)

  if (!hasPk) {
    return <PrivateKeyModalBlock onSaved={handlePrivateKeySaved} />
  }

  if (initializationError && !isLoading && !shallReset) {
    return (
      <InitializationErrorBlock
        onOk={() => {
          removeSignerPk()
          setHasPk(false)
        }}
      />
    )
  }

  if (showResetModal) {
    return <ResetModalBlock cacheHelpUrl={cacheHelpUrl} onConfirm={() => setShowResetModal(false)} />
  }

  if (!showErrorModal && (isEmptyState || isInvalidState)) {
    return (
      <InitialModalBlock
        resetState={shallReset}
        handleVisibility={(isVisible: boolean) => setShowInitialModal(isVisible)}
        handleShowError={(flag: boolean, error?: string) => {
          setShowErrorModal(flag)

          if (error) setErrorMessage(error)
        }}
        setIsCreationInProgress={(isCreating: boolean) => setIsCreationInProgress(isCreating)}
      />
    )
  }

  if (!fm) {
    return <LoadingBlock />
  }

  if (showErrorModal) {
    return (
      <ErrorModalBlock
        label={
          'Error creating Admin Drive. Please try again. Possible causes include insufficient xDAI balance or a lost connection to the RPC.'
        }
        onClick={() => {
          setShowErrorModal(false)
          setShowInitialModal(true)
          setErrorMessage('')
        }}
      />
    )
  }

  return (
    <FileManagerMainContent
      fm={fm}
      showConnectionError={showConnectionError}
      setShowConnectionError={() => setShowConnectionError(false)}
      isFormbricksActive={isFormbricksActive}
      errorMessage={errorMessage}
      setErrorMessage={setErrorMessage}
      loading={loading}
      adminDrive={adminDrive}
      isCreationInProgress={isCreationInProgress}
    />
  )
}
