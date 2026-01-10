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
import { Tooltip } from '../../Tooltip/Tooltip'
import { TOOLTIPS } from '../../../constants/tooltips'
import { FILE_MANAGER_EVENTS } from '../../../constants/common'

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

  const { showContext, pos, contextRef, setPos, setShowContext } = useContextMenu<HTMLDivElement>()

  const { setView, setActualItemView } = useView()

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
        setIsUpgrading(() => true)
      }
    },
    [setIsUpgrading],
  )

  const handleUpgradeEnd = useCallback(
    (driveId: string, id: string, success: boolean, error: string | undefined, updatedStamp?: PostageBatch) => {
      if (driveId !== id) {
        return
      }

      setIsUpgrading(() => false)

      if (!success && error) {
        setErrorMessage?.(error)
        setShowError(true)

        return
      }

      if (updatedStamp) {
        setActualStamp(updatedStamp)
      }
    },
    [setErrorMessage, setShowError],
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

    const onStart = (e: Event) => {
      const { driveId } = (e as CustomEvent).detail || {}
      handleUpgradeStart(driveId, id)
    }

    const onEnd = (e: Event) => {
      const { driveId, success, error, updatedStamp } = (e as CustomEvent).detail || {}
      handleUpgradeEnd(driveId, id, success, error, updatedStamp)
    }

    const onFileUploaded = async (e: Event) => {
      const { fileInfo } = (e as CustomEvent).detail || {}

      if (fileInfo && fileInfo.driveId === id) {
        const updatedStamp = await refreshStamp(actualStamp.batchID.toString())

        if (updatedStamp) {
          setActualStamp(updatedStamp)
        }
      }
    }

    window.addEventListener(FILE_MANAGER_EVENTS.DRIVE_UPGRADE_START, onStart as EventListener)
    window.addEventListener(FILE_MANAGER_EVENTS.DRIVE_UPGRADE_END, onEnd as EventListener)
    window.addEventListener(FILE_MANAGER_EVENTS.FILE_UPLOADED, onFileUploaded as EventListener)

    return () => {
      window.removeEventListener(FILE_MANAGER_EVENTS.DRIVE_UPGRADE_START, onStart as EventListener)
      window.removeEventListener(FILE_MANAGER_EVENTS.DRIVE_UPGRADE_END, onEnd as EventListener)
      window.removeEventListener(FILE_MANAGER_EVENTS.FILE_UPLOADED, onFileUploaded as EventListener)
    }
  }, [drive.id, actualStamp, handleUpgradeStart, handleUpgradeEnd, refreshStamp])

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
  const capacityClassName = `fm-drive-item-capacity ${isUpgrading ? 'fm-drive-item-capacity-updating' : ''}`
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
              label={isUpgrading ? TOOLTIPS.DRIVE_CAPACITY_UPDATING : TOOLTIPS.DRIVE_CAPACITY_INFO}
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
