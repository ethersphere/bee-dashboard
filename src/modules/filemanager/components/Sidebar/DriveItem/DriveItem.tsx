import { ReactElement, useState, useContext, useEffect, useMemo, useCallback, useRef, memo } from 'react'
import { createPortal } from 'react-dom'
import Drive from 'remixicon-react/HardDrive2LineIcon'
import DriveFill from 'remixicon-react/HardDrive2FillIcon'
import MoreFill from 'remixicon-react/MoreFillIcon'
import './DriveItem.scss'
import { ProgressBar } from '../../ProgressBar/ProgressBar'
import { ContextMenu } from '../../ContextMenu/ContextMenu'
import { useContextMenu } from '../../../hooks/useContextMenu'
import { Button } from '../../Button/Button'
import { DestroyDriveModal, ProgressDestroyModal } from '../../DestroyDriveModal/DestroyDriveModal'
import { UpgradeDriveModal } from '../../UpgradeDriveModal/UpgradeDriveModal'
import { UpgradeTimeoutModal } from '../../UpgradeTimeoutModal/UpgradeTimeoutModal'
import { ViewType } from '../../../constants/transfers'
import { useView } from '../../../../../pages/filemanager/ViewContext'
import { Context as FMContext } from '../../../../../providers/FileManager'
import { PostageBatch } from '@ethersphere/bee-js'
import { DriveInfo } from '@solarpunkltd/file-manager-lib'
import { calculateStampCapacityMetrics, handleDestroyAndForgetDrive } from '../../../utils/bee'
import { Context as SettingsContext } from '../../../../../providers/Settings'
import { truncateNameMiddle } from '../../../utils/common'
import { Tooltip } from '../../Tooltip/Tooltip'
import { TOOLTIPS } from '../../../constants/tooltips'
import { FILE_MANAGER_EVENTS, UPLOAD_POLLING_TIMEOUT_MS } from '../../../constants/common'
import { useStampPolling } from '../../../hooks/useStampPolling'

function useDriveEventListeners(
  driveId: string,
  handleUpgradeStart: (eventDriveId: string, id: string) => void,
  handleUpgradeEnd: (
    eventDriveId: string,
    id: string,
    success: boolean,
    error: string | undefined,
    updatedStamp?: PostageBatch,
  ) => void,
  handleUpgradeTimeout: (eventDriveId: string, id: string) => void,
  handleFileUploaded: (e: Event) => void,
) {
  useEffect(() => {
    const onStart = (e: Event) => {
      const { driveId: eventDriveId } = (e as CustomEvent).detail || {}
      handleUpgradeStart(eventDriveId, driveId)
    }

    const onEnd = (e: Event) => {
      const { driveId: eventDriveId, success, error, updatedStamp } = (e as CustomEvent).detail || {}
      handleUpgradeEnd(eventDriveId, driveId, success, error, updatedStamp)
    }

    const onTimeout = (e: Event) => {
      const { driveId: eventDriveId } = (e as CustomEvent).detail || {}
      handleUpgradeTimeout(eventDriveId, driveId)
    }

    window.addEventListener(FILE_MANAGER_EVENTS.DRIVE_UPGRADE_START, onStart as EventListener)
    window.addEventListener(FILE_MANAGER_EVENTS.DRIVE_UPGRADE_END, onEnd as EventListener)
    window.addEventListener(FILE_MANAGER_EVENTS.DRIVE_UPGRADE_TIMEOUT, onTimeout as EventListener)
    window.addEventListener(FILE_MANAGER_EVENTS.FILE_UPLOADED, handleFileUploaded as EventListener)

    return () => {
      window.removeEventListener(FILE_MANAGER_EVENTS.DRIVE_UPGRADE_START, onStart as EventListener)
      window.removeEventListener(FILE_MANAGER_EVENTS.DRIVE_UPGRADE_END, onEnd as EventListener)
      window.removeEventListener(FILE_MANAGER_EVENTS.DRIVE_UPGRADE_TIMEOUT, onTimeout as EventListener)
      window.removeEventListener(FILE_MANAGER_EVENTS.FILE_UPLOADED, handleFileUploaded as EventListener)
    }
  }, [driveId, handleUpgradeStart, handleUpgradeEnd, handleUpgradeTimeout, handleFileUploaded])
}

interface DriveModalsProps {
  isUpgradeDriveModalOpen: boolean
  setIsUpgradeDriveModalOpen: (open: boolean) => void
  isUpgradeTimeoutModalOpen: boolean
  actualStamp: PostageBatch
  drive: DriveInfo
  setErrorMessage?: (error: string) => void
  isUpgrading: boolean
  isCapacityUpdating: boolean
  isDestroying: boolean
  setIsProgressModalOpen: (open: boolean) => void
  isProgressModalOpen: boolean
  isDestroyDriveModalOpen: boolean
  setIsDestroyDriveModalOpen: (open: boolean) => void
  doDestroy: () => Promise<void>
  onCancelTimeout: () => void
}

function DriveModals({
  isUpgradeDriveModalOpen,
  setIsUpgradeDriveModalOpen,
  isUpgradeTimeoutModalOpen,
  actualStamp,
  drive,
  setErrorMessage,
  isUpgrading,
  isCapacityUpdating,
  isDestroying,
  setIsProgressModalOpen,
  isProgressModalOpen,
  isDestroyDriveModalOpen,
  setIsDestroyDriveModalOpen,
  doDestroy,
  onCancelTimeout,
}: DriveModalsProps): ReactElement | null {
  return (
    <>
      {isUpgradeDriveModalOpen && (
        <UpgradeDriveModal
          stamp={actualStamp}
          drive={drive}
          onCancelClick={() => setIsUpgradeDriveModalOpen(false)}
          setErrorMessage={setErrorMessage}
        />
      )}

      {isUpgradeTimeoutModalOpen && <UpgradeTimeoutModal driveName={drive.name} onOk={onCancelTimeout} />}

      {isUpgrading && (
        <div className="fm-drive-item-creating-overlay" aria-live="polite">
          <div className="fm-mini-spinner" />
          <span>Upgrading drive…</span>
        </div>
      )}
      {isCapacityUpdating && !isUpgrading && (
        <div className="fm-drive-item-creating-overlay" aria-live="polite">
          <div className="fm-mini-spinner" />
          <span>Updating capacity…</span>
        </div>
      )}
      {isDestroying && (
        <div
          className="fm-drive-item-creating-overlay"
          aria-live="polite"
          onClick={() => setIsProgressModalOpen(true)}
          style={{ cursor: 'pointer' }}
          title="Click to show progress modal"
        >
          <div className="fm-mini-spinner" />
          <span>Destroying drive…</span>
        </div>
      )}
      {isProgressModalOpen && isDestroying && (
        <ProgressDestroyModal drive={drive} onMinimize={() => setIsProgressModalOpen(false)} />
      )}
      {isDestroyDriveModalOpen && (
        <DestroyDriveModal
          drive={drive}
          onCancelClick={() => setIsDestroyDriveModalOpen(false)}
          doDestroy={doDestroy}
        />
      )}
    </>
  )
}

interface DriveItemProps {
  drive: DriveInfo
  stamp: PostageBatch
  isSelected: boolean
  setErrorMessage?: (error: string) => void
}

function DriveItemComponent({ drive, stamp, isSelected, setErrorMessage }: DriveItemProps): ReactElement {
  const { fm, adminDrive, files, setShowError, refreshStamp } = useContext(FMContext)
  const { beeApi } = useContext(SettingsContext)

  const driveId = drive.id.toString()

  const [isHovered, setIsHovered] = useState(false)
  const [isDestroyDriveModalOpen, setIsDestroyDriveModalOpen] = useState(false)
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false)
  const [isUpgradeDriveModalOpen, setIsUpgradeDriveModalOpen] = useState(false)
  const [isUpgradeTimeoutModalOpen, setIsUpgradeTimeoutModalOpen] = useState(false)
  const [isUpgrading, setIsUpgrading] = useState(false)
  const [isCapacityUpdating, setIsCapacityUpdating] = useState(false)
  const [isDestroying, setIsDestroying] = useState(false)
  const [actualStamp, setActualStamp] = useState<PostageBatch>(stamp)
  const batchIDRef = useRef(stamp.batchID)
  const isUpgradingRef = useRef(false)
  const actualStampRef = useRef(actualStamp)
  const startPollingRef = useRef<((stamp: PostageBatch) => void) | null>(null)
  const stopPollingRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    actualStampRef.current = actualStamp
  }, [actualStamp])

  const handleStampUpdated = useCallback((updatedStamp: PostageBatch) => {
    setActualStamp(updatedStamp)
    batchIDRef.current = updatedStamp.batchID
  }, [])

  const handlePollingStateChange = useCallback((isPolling: boolean) => {
    setIsCapacityUpdating(isPolling)
  }, [])

  const { startPolling, stopPolling } = useStampPolling({
    onStampUpdated: handleStampUpdated,
    onPollingStateChange: handlePollingStateChange,
    refreshStamp,
    timeout: UPLOAD_POLLING_TIMEOUT_MS,
  })

  useEffect(() => {
    startPollingRef.current = startPolling
  }, [startPolling])

  useEffect(() => {
    stopPollingRef.current = stopPolling
  }, [stopPolling])

  const { showContext, pos, contextRef, setPos, setShowContext } = useContextMenu<HTMLDivElement>()

  const { setView, setActualItemView } = useView()

  useEffect(() => {
    if (isUpgradingRef.current) {
      return
    }

    if (actualStamp.batchID.toString() !== stamp.batchID.toString()) {
      setActualStamp(stamp)
      batchIDRef.current = stamp.batchID

      return
    }

    const incomingSize = stamp.size.toBytes()
    const currentSize = actualStamp.size.toBytes()
    const incomingExpiry = stamp.duration.toEndDate().getTime()
    const currentExpiry = actualStamp.duration.toEndDate().getTime()

    if (incomingSize > currentSize || incomingExpiry > currentExpiry) {
      setActualStamp(stamp)
      batchIDRef.current = stamp.batchID
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stamp])

  useEffect(() => {
    return () => {
      if (stopPollingRef.current) {
        stopPollingRef.current()
      }
    }
  }, [])

  function handleMenuClick(e: React.MouseEvent) {
    setShowContext(true)
    setPos({ x: e.clientX, y: e.clientY })
  }

  const handleUpgradeStart = useCallback((driveId: string, id: string) => {
    if (driveId !== id) return

    isUpgradingRef.current = true
    setIsUpgrading(true)
  }, [])

  const handleUpgradeEnd = useCallback(
    (driveId: string, id: string, success: boolean, error: string | undefined, updatedStamp?: PostageBatch) => {
      if (driveId !== id) return

      const resetUpgrading = () => {
        setIsUpgrading(false)
        isUpgradingRef.current = false
      }

      if (!success && error) {
        resetUpgrading()
        setErrorMessage?.(error)
        setShowError(true)

        return
      }

      if (updatedStamp) {
        setActualStamp(updatedStamp)
        batchIDRef.current = updatedStamp.batchID
        setTimeout(resetUpgrading, 300)
      } else {
        resetUpgrading()
      }
    },
    [setErrorMessage, setShowError],
  )

  const doDestroy = useCallback(async () => {
    const closeModals = () => {
      setIsDestroyDriveModalOpen(false)
      setIsDestroying(false)
      setIsProgressModalOpen(false)
    }

    setIsDestroyDriveModalOpen(false)
    setIsProgressModalOpen(true)
    setIsDestroying(true)

    await handleDestroyAndForgetDrive({
      beeApi,
      fm,
      drive,
      isDestroy: true,
      adminDrive,
      onSuccess: closeModals,
      onError: e => {
        closeModals()
        setErrorMessage?.(`Error destroying drive: ${drive.name}: ${e}`)
        setShowError(true)
      },
    })
  }, [beeApi, fm, drive, adminDrive, setErrorMessage, setShowError])

  const handleUpgradeTimeout = useCallback(
    (eventDriveId: string, id: string) => {
      if (eventDriveId !== id) return
      setIsUpgradeTimeoutModalOpen(true)
    },
    [setIsUpgradeTimeoutModalOpen],
  )

  const handleCancelTimeout = useCallback(() => {
    setIsUpgrading(false)
    isUpgradingRef.current = false
    setIsUpgradeTimeoutModalOpen(false)

    if (startPollingRef.current && actualStampRef.current) {
      startPollingRef.current(actualStampRef.current)
    }
  }, [])

  const handleFileUploaded = useCallback(
    (e: Event) => {
      const { fileInfo } = (e as CustomEvent).detail || {}

      if (!fileInfo || fileInfo.driveId !== driveId || !startPollingRef.current) return

      startPollingRef.current(actualStampRef.current)
    },
    [driveId],
  )

  useDriveEventListeners(driveId, handleUpgradeStart, handleUpgradeEnd, handleUpgradeTimeout, handleFileUploaded)

  const { capacityPct, usedSize, stampSize } = useMemo(() => {
    const filesPerDrive = files.filter(fi => fi.driveId === drive.id.toString())

    return calculateStampCapacityMetrics(actualStamp, filesPerDrive, drive.redundancyLevel, isCapacityUpdating)
  }, [actualStamp, drive, files, isCapacityUpdating])

  const handleDriveClick = useCallback(() => {
    setView(ViewType.File)
    setActualItemView?.(drive.name)
  }, [setView, setActualItemView, drive.name])

  const handleDestroyClick = useCallback(() => {
    setShowContext(false)
    setIsDestroyDriveModalOpen(true)
  }, [setShowContext, setIsDestroyDriveModalOpen])

  const selectedClass = isSelected ? ' fm-drive-item-container-selected' : ''
  const containerClassName = `fm-drive-item-container${selectedClass}`

  const updatingClass = isUpgrading || isCapacityUpdating ? ' fm-drive-item-capacity-updating' : ''
  const capacityClassName = `fm-drive-item-capacity${updatingClass}`

  const driveIcon = isHovered ? <DriveFill size="16px" /> : <Drive size="16px" />

  return (
    <div className={containerClassName} onClick={handleDriveClick}>
      <div
        className="fm-drive-item-info"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="fm-drive-item-header">
          <div className="fm-drive-item-icon">{driveIcon}</div>
          <div>{truncateNameMiddle(drive.name, 35, 8, 8)}</div>
        </div>
        <div className="fm-drive-item-content">
          <div className={capacityClassName}>
            <span>
              Capacity <ProgressBar value={capacityPct} width="64px" /> {usedSize} / {stampSize}
            </span>
            <Tooltip
              label={
                isUpgrading || isCapacityUpdating ? TOOLTIPS.DRIVE_CAPACITY_UPDATING : TOOLTIPS.DRIVE_CAPACITY_INFO
              }
              iconSize="12px"
              disableMargin={true}
            />
          </div>
          <div className={capacityClassName}>
            <span>Expiry date: {actualStamp.duration.toEndDate().toLocaleDateString()}</span>
          </div>
        </div>
      </div>
      <div className="fm-drive-item-actions">
        <MoreFill
          size="13"
          className={`fm-pointer${isUpgrading || isDestroying ? ' fm-disabled' : ''}`}
          onClick={!isUpgrading && !isDestroying ? handleMenuClick : undefined}
          aria-disabled={isUpgrading || isDestroying ? 'true' : 'false'}
        />
        {showContext &&
          createPortal(
            <div
              ref={contextRef}
              className="fm-drive-item-context-menu"
              style={{
                top: pos.y,
                left: pos.x,
              }}
            >
              <ContextMenu>
                <div className="fm-context-item red" onClick={handleDestroyClick}>
                  Destroy entire drive
                </div>
              </ContextMenu>
            </div>,

            document.body,
          )}
        <Button
          label="Upgrade"
          variant="primary"
          size="small"
          disabled={isUpgrading || isDestroying}
          onClick={() => setIsUpgradeDriveModalOpen(true)}
        />
      </div>
      <DriveModals
        isUpgradeDriveModalOpen={isUpgradeDriveModalOpen}
        setIsUpgradeDriveModalOpen={setIsUpgradeDriveModalOpen}
        isUpgradeTimeoutModalOpen={isUpgradeTimeoutModalOpen}
        actualStamp={actualStamp}
        drive={drive}
        setErrorMessage={setErrorMessage}
        isUpgrading={isUpgrading}
        isCapacityUpdating={isCapacityUpdating}
        isDestroying={isDestroying}
        setIsProgressModalOpen={setIsProgressModalOpen}
        isProgressModalOpen={isProgressModalOpen}
        isDestroyDriveModalOpen={isDestroyDriveModalOpen}
        setIsDestroyDriveModalOpen={setIsDestroyDriveModalOpen}
        doDestroy={doDestroy}
        onCancelTimeout={handleCancelTimeout}
      />
    </div>
  )
}

function arePropsEqual(prevProps: DriveItemProps, nextProps: DriveItemProps) {
  const driveIdEqual = prevProps.drive.id.toString() === nextProps.drive.id.toString()
  const stampIdEqual = prevProps.stamp.batchID.toString() === nextProps.stamp.batchID.toString()
  const isSelectedEqual = prevProps.isSelected === nextProps.isSelected

  return driveIdEqual && stampIdEqual && isSelectedEqual
}

export const MemoizedDriveItem = memo(DriveItemComponent, arePropsEqual)
export const DriveItem = MemoizedDriveItem
