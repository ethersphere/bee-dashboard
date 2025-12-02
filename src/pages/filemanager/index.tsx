import { ReactElement, useContext, useEffect, useState, useRef, useCallback, useMemo } from 'react'
import './FileManager.scss'
import { SearchProvider } from './SearchContext'
import { ViewProvider } from './ViewContext'
import { Header } from '../../modules/filemanager/components/Header/Header'
import { Sidebar } from '../../modules/filemanager/components/Sidebar/Sidebar'
import { AdminStatusBar } from '../../modules/filemanager/components/AdminStatusBar/AdminStatusBar'
import { FileBrowser } from '../../modules/filemanager/components/FileBrowser/FileBrowser'
import { InitialModal } from '../../modules/filemanager/components/InitialModal/InitialModal'
import { Context as FMContext } from '../../providers/FileManager'
import { Context as BeeContext, CheckState } from '../../providers/Bee'
import { PrivateKeyModal } from '../../modules/filemanager/components/PrivateKeyModal/PrivateKeyModal'
import { getSignerPk, removeSignerPk } from '../../../src/modules/filemanager/utils/common'
import { ErrorModal } from '../../../src/modules/filemanager/components/ErrorModal/ErrorModal'
import { ConfirmModal } from '../../modules/filemanager/components/ConfirmModal/ConfirmModal'
import { Button } from '../../modules/filemanager/components/Button/Button'
import { FormbricksIntegration } from '../../modules/filemanager/components/FormbricksIntegration/FormbricksIntegration'

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

  const { status } = useContext(BeeContext)
  const { fm, shallReset, adminDrive, initializationError, init } = useContext(FMContext)

  useEffect(() => {
    isMountedRef.current = true

    return () => {
      isMountedRef.current = false
    }
  }, [])

  useEffect(() => {
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
  }, [fm, hasPk, initializationError, adminDrive, shallReset])

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

  if (status.all !== CheckState.OK) {
    return (
      <div className="fm-main">
        <div className="fm-loading">
          <div className="fm-loading-title">Bee node error - cannot load File Manager</div>
        </div>
      </div>
    )
  }

  if (!hasPk) {
    return (
      <div className="fm-main">
        <PrivateKeyModal onSaved={handlePrivateKeySaved} />
      </div>
    )
  }

  if (initializationError && !isLoading && !shallReset) {
    return (
      <div className="fm-main">
        <div className="fm-loading">
          <div className="fm-loading-title">Failed to initialize File Manager, reload and try again </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
            <div style={{ minWidth: '120px' }}>
              <Button
                label={'OK'}
                variant="primary"
                disabled={false}
                onClick={() => {
                  removeSignerPk()
                  setHasPk(false)
                }}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (showResetModal) {
    return (
      <div className="fm-main">
        <ConfirmModal
          title="Reset File Manager State"
          message="Your File Manager state appears invalid. Please reset it to continue."
          confirmLabel="Proceed"
          onConfirm={() => {
            setShowResetModal(false)
          }}
          background={false}
        />
      </div>
    )
  }

  if (!showErrorModal && (isEmptyState || isInvalidState)) {
    return (
      <div className="fm-main">
        <InitialModal
          resetState={shallReset}
          handleVisibility={(isVisible: boolean) => setShowInitialModal(isVisible)}
          handleShowError={(flag: boolean) => setShowErrorModal(flag)}
          setIsCreationInProgress={(isCreating: boolean) => setIsCreationInProgress(isCreating)}
        />
      </div>
    )
  }

  if (!fm) {
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

  if (showErrorModal) {
    return (
      <ErrorModal
        label={
          'Error during admin state creation, try again. The reasons can be: insufficient xDAI balance, communication lost with RPC.'
        }
        onClick={() => {
          setShowErrorModal(false)
          setShowInitialModal(true)
        }}
      />
    )
  }

  return (
    <SearchProvider>
      <ViewProvider>
        <div className="fm-main">
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
