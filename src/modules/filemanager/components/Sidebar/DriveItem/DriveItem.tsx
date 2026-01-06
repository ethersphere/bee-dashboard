import { ReactElement, useState, useContext, useEffect, useMemo, useCallback } from 'react'
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
import { ViewType } from '../../../constants/transfers'
import { useView } from '../../../../../pages/filemanager/ViewContext'
import { Context as FMContext } from '../../../../../providers/FileManager'
import { PostageBatch } from '@ethersphere/bee-js'
import { DriveInfo } from '@solarpunkltd/file-manager-lib'
import { calculateStampCapacityMetrics, handleDestroyAndForgetDrive } from '../../../utils/bee'
import { Context as SettingsContext } from '../../../../../providers/Settings'
import { truncateNameMiddle } from '../../../utils/common'
import { useStampPollingWithState } from '../../../hooks/useStampPollingWithState'

interface DriveItemProps {
  drive: DriveInfo
  stamp: PostageBatch
  isSelected: boolean
  setErrorMessage?: (error: string) => void
}

export function DriveItem({ drive, stamp, isSelected, setErrorMessage }: DriveItemProps): ReactElement {
  const { fm, adminDrive, files, setShowError, refreshStamp } = useContext(FMContext)
  const { beeApi } = useContext(SettingsContext)

  const [isHovered, setIsHovered] = useState(false)
  const [isDestroyDriveModalOpen, setIsDestroyDriveModalOpen] = useState(false)
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false)
  const [isUpgradeDriveModalOpen, setIsUpgradeDriveModalOpen] = useState(false)
  const [isUpgrading, setIsUpgrading] = useState(false)
  const [isDestroying, setIsDestroying] = useState(false)
  const [actualStamp, setActualStamp] = useState<PostageBatch>(stamp)
  const [isCapacityUpdating, setIsCapacityUpdating] = useState(false)

  const { showContext, pos, contextRef, setPos, setShowContext } = useContextMenu<HTMLDivElement>()

  const { setView, setActualItemView } = useView()

  const { startPolling, isMountedRef } = useStampPollingWithState({
    refreshStamp,
    setActualStamp,
    setIsCapacityUpdating,
  })

  useEffect(() => {
    if (actualStamp.batchID.toString() !== stamp.batchID.toString()) {
      setActualStamp(stamp)

      return
    }

    const incomingSize = stamp.size.toBytes()
    const currentSize = actualStamp.size.toBytes()
    const incomingExpiry = stamp.duration.toEndDate().getTime()
    const currentExpiry = actualStamp.duration.toEndDate().getTime()

    if (incomingSize > currentSize || incomingExpiry > currentExpiry) {
      setActualStamp(stamp)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stamp])

  function handleMenuClick(e: React.MouseEvent) {
    setShowContext(true)
    setPos({ x: e.clientX, y: e.clientY })
  }

  const handleUpgradeStart = useCallback(
    (driveId: string, id: string) => {
      if (driveId === id) {
        setIsUpgrading(true)
      }
    },
    [setIsUpgrading],
  )

  const handleUpgradeEnd = useCallback(
    async (
      driveId: string,
      id: string,
      batchId: string,
      success: boolean,
      error: string | undefined,
      updatedStamp: PostageBatch | undefined,
      isStillUpdating: boolean,
    ) => {
      if (!success && error) {
        setErrorMessage?.(error)
        setShowError(true)
      }

      if (driveId === id) {
        setIsUpgrading(false)

        if (updatedStamp) {
          if (!isMountedRef.current) return
          setActualStamp(updatedStamp)

          if (isStillUpdating) {
            startPolling(batchId, updatedStamp)
          }
        } else {
          const upgradedStamp = await refreshStamp(batchId)

          if (!isMountedRef.current) return

          if (upgradedStamp) {
            setActualStamp(upgradedStamp)

            if (isStillUpdating) {
              startPolling(batchId, upgradedStamp)
            }
          } else if (isStillUpdating) {
            startPolling(batchId, actualStamp)
          }
        }
      }
    },
    [setErrorMessage, setShowError, isMountedRef, setActualStamp, startPolling, refreshStamp, actualStamp],
  )

  const doDestroy = useCallback(async () => {
    setIsDestroyDriveModalOpen(false)
    setIsProgressModalOpen(true)
    setIsDestroying(true)

    await handleDestroyAndForgetDrive({
      beeApi,
      fm,
      drive,
      isDestroy: true,
      adminDrive,
      onSuccess: () => {
        setIsDestroyDriveModalOpen(false)
        setIsDestroying(false)
        setIsProgressModalOpen(false)
      },
      onError: e => {
        setIsDestroyDriveModalOpen(false)
        setIsDestroying(false)
        setIsProgressModalOpen(false)
        setErrorMessage?.(`Error destroying drive: ${drive.name}: ${e}`)
        setShowError(true)
      },
    })
  }, [beeApi, fm, drive, adminDrive, setErrorMessage, setShowError])

  useEffect(() => {
    const id = drive.id.toString()
    const batchId = stamp.batchID.toString()

    const onStart = (e: Event) => {
      const { driveId } = (e as CustomEvent).detail || {}
      handleUpgradeStart(driveId, id)
    }

    const onEnd = (e: Event) => {
      const { driveId, success, error, updatedStamp, isStillUpdating } = (e as CustomEvent).detail || {}
      handleUpgradeEnd(driveId, id, batchId, success, error, updatedStamp, isStillUpdating)
    }

    window.addEventListener('fm:drive-upgrade-start', onStart as EventListener)
    window.addEventListener('fm:drive-upgrade-end', onEnd as EventListener)

    return () => {
      window.removeEventListener('fm:drive-upgrade-start', onStart as EventListener)
      window.removeEventListener('fm:drive-upgrade-end', onEnd as EventListener)
    }
  }, [drive.id, stamp.batchID, handleUpgradeStart, handleUpgradeEnd])

  const { capacityPct, usedSize, stampSize } = useMemo(() => {
    const filesPerDrive = files.filter(fi => fi.driveId === drive.id.toString())

    return calculateStampCapacityMetrics(actualStamp, filesPerDrive, drive.redundancyLevel)
  }, [actualStamp, drive, files])

  const handleDriveClick = useCallback(() => {
    setView(ViewType.File)
    setActualItemView?.(drive.name)
  }, [setView, setActualItemView, drive.name])

  const handleDestroyClick = useCallback(() => {
    setShowContext(false)
    setIsDestroyDriveModalOpen(true)
  }, [setShowContext, setIsDestroyDriveModalOpen])

  const containerClassName = `fm-drive-item-container${isSelected ? ' fm-drive-item-container-selected' : ''}`
  const capacityClassName = `fm-drive-item-capacity ${isCapacityUpdating ? 'fm-drive-item-capacity-updating' : ''}`
  const updatingTitle = isCapacityUpdating ? 'Capacity is updating... This may take a few moments.' : ''
  const expiryUpdatingTitle = isCapacityUpdating ? 'Expiry is updating... This may take a few moments.' : ''
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
          <div className={capacityClassName} title={updatingTitle}>
            Capacity <ProgressBar value={capacityPct} width="64px" /> {usedSize} / {stampSize}
          </div>
          <div className={capacityClassName} title={expiryUpdatingTitle}>
            Expiry date: {actualStamp.duration.toEndDate().toLocaleDateString()}
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
      {isUpgradeDriveModalOpen && (
        <UpgradeDriveModal
          stamp={actualStamp}
          drive={drive}
          onCancelClick={() => setIsUpgradeDriveModalOpen(false)}
          setErrorMessage={setErrorMessage}
        />
      )}

      {isUpgrading && (
        <div className="fm-drive-item-creating-overlay" aria-live="polite">
          <div className="fm-mini-spinner" />
          <span>Upgrading drive…</span>
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
    </div>
  )
}
