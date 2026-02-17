import { ReactElement, useState, useMemo, useEffect, useContext, useCallback } from 'react'
import './AdminStatusBar.scss'
import { ProgressBar } from '../ProgressBar/ProgressBar'
import { Tooltip } from '../Tooltip/Tooltip'
import { PostageBatch } from '@ethersphere/bee-js'
import { DriveInfo, estimateDriveListMetadataSize } from '@solarpunkltd/file-manager-lib'
import { Context as FMContext } from '../../../../providers/FileManager'
import { ConfirmModal } from '../ConfirmModal/ConfirmModal'
import { calculateStampCapacityMetrics } from '../../utils/bee'
import { getHumanReadableFileSize } from '../../../../utils/file'
import { UpgradeDriveModal } from '../UpgradeDriveModal/UpgradeDriveModal'
import { UpgradeTimeoutModal } from '../UpgradeTimeoutModal/UpgradeTimeoutModal'
import { FILE_MANAGER_EVENTS, POLLING_TIMEOUT_MS } from '../../constants/common'
import { useStampPolling } from '../../hooks/useStampPolling'
import { TOOLTIPS } from '../../constants/tooltips'

interface AdminStatusBarProps {
  adminStamp: PostageBatch | null
  adminDrive: DriveInfo | null
  loading: boolean
  isCreationInProgress: boolean
  setErrorMessage?: (error: string) => void
}

export function AdminStatusBar({
  adminStamp,
  adminDrive,
  loading,
  isCreationInProgress,
  setErrorMessage,
}: AdminStatusBarProps): ReactElement {
  const { drives, setShowError, refreshStamp } = useContext(FMContext)

  const [isUpgradeDriveModalOpen, setIsUpgradeDriveModalOpen] = useState(false)
  const [isUpgradeTimeoutModalOpen, setIsUpgradeTimeoutModalOpen] = useState(false)
  const [isUpgrading, setIsUpgrading] = useState(false)
  const [actualStamp, setActualStamp] = useState<PostageBatch | null>(adminStamp)
  const [showProgressModal, setShowProgressModal] = useState(true)

  const handleStampUpdated = useCallback((updatedStamp: PostageBatch) => {
    setActualStamp(updatedStamp)
  }, [])

  const handlePollingStateChange = useCallback((_isPolling: boolean) => {
    // no-op
  }, [])

  const { startPolling } = useStampPolling({
    onStampUpdated: handleStampUpdated,
    onPollingStateChange: handlePollingStateChange,
    refreshStamp,
    timeout: POLLING_TIMEOUT_MS,
  })

  useEffect(() => {
    setShowProgressModal(isCreationInProgress || loading)
  }, [isCreationInProgress, loading, setShowProgressModal])

  useEffect(() => {
    if (!adminStamp || !actualStamp) {
      setActualStamp(adminStamp)

      return
    }

    if (actualStamp.batchID.toString() !== adminStamp.batchID.toString()) {
      setActualStamp(adminStamp)

      return
    }

    const incomingSize = adminStamp.size.toBytes()
    const currentSize = actualStamp.size.toBytes()
    const incomingExpiry = adminStamp.duration.toEndDate().getTime()
    const currentExpiry = actualStamp.duration.toEndDate().getTime()

    if (incomingSize > currentSize || incomingExpiry > currentExpiry) {
      setActualStamp(adminStamp)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminStamp])

  useEffect(() => {
    if (!adminDrive) return

    const id = adminDrive.id.toString()

    const onStart = (e: Event) => {
      const { driveId } = (e as CustomEvent).detail || {}

      if (driveId === id) {
        setIsUpgrading(true)
      }
    }

    const onEnd = (e: Event) => {
      const { driveId, success, error, updatedStamp } = (e as CustomEvent).detail || {}

      if (driveId !== id) return

      if (!success && error) {
        setIsUpgrading(false)
        setErrorMessage?.(error)
        setShowError(true)

        return
      }

      if (updatedStamp) {
        setActualStamp(updatedStamp)
      }

      setIsUpgrading(false)
    }

    const onTimeout = (e: Event) => {
      const { driveId } = (e as CustomEvent).detail || {}

      if (driveId === id) {
        setIsUpgradeTimeoutModalOpen(true)
      }
    }

    window.addEventListener(FILE_MANAGER_EVENTS.DRIVE_UPGRADE_START, onStart as EventListener)
    window.addEventListener(FILE_MANAGER_EVENTS.DRIVE_UPGRADE_END, onEnd as EventListener)
    window.addEventListener(FILE_MANAGER_EVENTS.DRIVE_UPGRADE_TIMEOUT, onTimeout as EventListener)

    return () => {
      window.removeEventListener(FILE_MANAGER_EVENTS.DRIVE_UPGRADE_START, onStart as EventListener)
      window.removeEventListener(FILE_MANAGER_EVENTS.DRIVE_UPGRADE_END, onEnd as EventListener)
      window.removeEventListener(FILE_MANAGER_EVENTS.DRIVE_UPGRADE_TIMEOUT, onTimeout as EventListener)
    }
  }, [adminDrive, setErrorMessage, setShowError])

  const handleTimeoutCancel = useCallback(() => {
    setIsUpgrading(false)
    setIsUpgradeTimeoutModalOpen(false)

    // Restart polling to continue checking for capacity updates
    if (actualStamp) {
      startPolling(actualStamp)
    }
  }, [actualStamp, startPolling])

  const { capacityPct, usedSize, totalSize } = useMemo(() => {
    if (!actualStamp) {
      return {
        capacityPct: 0,
        usedSize: '—',
        totalSize: '—',
      }
    }

    const estimatedDlSizeBytes = estimateDriveListMetadataSize(drives) * drives.length
    const {
      capacityPct: reportedPct,
      usedBytes: reportedUsedBytes,
      stampSizeBytes,
    } = calculateStampCapacityMetrics(actualStamp, [], adminDrive?.redundancyLevel)
    const actualUsedSizeBytes = Math.max(reportedUsedBytes, estimatedDlSizeBytes)
    const actualPct = Math.max(reportedPct, (actualUsedSizeBytes / stampSizeBytes) * 100)

    return {
      capacityPct: actualPct,
      usedSize: getHumanReadableFileSize(actualUsedSizeBytes),
      totalSize: getHumanReadableFileSize(stampSizeBytes),
    }
  }, [actualStamp, adminDrive, drives])

  const expiresAt = useMemo(
    () => (actualStamp ? actualStamp.duration.toEndDate().toLocaleDateString() : '—'),
    [actualStamp],
  )

  const isBusy = loading || isUpgrading || isCreationInProgress
  const blurCls = isBusy ? ' is-loading' : ''
  const statusVerb = isCreationInProgress ? 'Creating' : 'Loading'
  const statusText = statusVerb + '  admin drive, please do not reload'

  const renderModalsAndOverlays = () => {
    return (
      <>
        {isUpgradeDriveModalOpen && actualStamp && adminDrive && (
          <UpgradeDriveModal
            stamp={actualStamp}
            drive={adminDrive}
            onCancelClick={() => setIsUpgradeDriveModalOpen(false)}
            setErrorMessage={setErrorMessage}
          />
        )}

        {isUpgradeTimeoutModalOpen && adminDrive && actualStamp && (
          <UpgradeTimeoutModal driveName={adminDrive.name} onOk={handleTimeoutCancel} />
        )}

        {isUpgrading && (
          <div className="fm-drive-item-creating-overlay" aria-live="polite">
            <div className="fm-mini-spinner" />
            <span>Upgrading admin drive…</span>
          </div>
        )}

        {showProgressModal && (
          <ConfirmModal
            title="Admin Drive Creation"
            isProgress
            spinnerMessage={statusText}
            showFooter={false}
            showMinimize={true}
            onMinimize={() => setShowProgressModal(false)}
          />
        )}
      </>
    )
  }

  return (
    <div>
      <div className={`fm-admin-status-bar-container${blurCls}`} aria-busy={isBusy ? 'true' : 'false'}>
        <div className="fm-admin-status-bar-left">
          <div
            className={`fm-drive-item-capacity ${isUpgrading ? 'fm-drive-item-capacity-updating' : ''}`}
            title={isUpgrading ? 'Capacity is updating... This may take a few moments.' : ''}
          >
            Capacity <ProgressBar value={capacityPct} width="150px" /> {usedSize} / {totalSize}
          </div>

          <div>File Manager Available: Until: {expiresAt}</div>

          <Tooltip label={TOOLTIPS.ADMIN_STATUS_WARNING} />
        </div>

        {renderModalsAndOverlays()}

        <div
          className="fm-admin-status-bar-upgrade-button"
          onClick={() => !isBusy && actualStamp && adminDrive && setIsUpgradeDriveModalOpen(true)}
          aria-disabled={isBusy ? 'true' : 'false'}
        >
          {isBusy ? 'Working…' : 'Manage'}
        </div>
      </div>
      {!showProgressModal && (loading || isCreationInProgress) && (
        <div className="fm-admin-status-bar-progress-pill-container">
          <div className="fm-admin-status-progress-pill" onClick={() => setShowProgressModal(true)}>
            {statusText}
          </div>
        </div>
      )}
    </div>
  )
}
