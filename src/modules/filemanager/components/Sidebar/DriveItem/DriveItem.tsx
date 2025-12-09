import { ReactElement, useState, useContext, useEffect, useRef, useMemo } from 'react'
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
  const isMountedRef = useRef(true)
  const [isUpgrading, setIsUpgrading] = useState(false)
  const [isDestroying, setIsDestroying] = useState(false)
  const [actualStamp, setActualStamp] = useState<PostageBatch>(stamp)

  const { showContext, pos, contextRef, setPos, setShowContext } = useContextMenu<HTMLDivElement>()

  const { setView, setActualItemView } = useView()

  useEffect(() => {
    return () => {
      isMountedRef.current = false
    }
  }, [])

  useEffect(() => {
    setActualStamp(stamp)
  }, [stamp])

  function handleMenuClick(e: React.MouseEvent) {
    setShowContext(true)
    setPos({ x: e.clientX, y: e.clientY })
  }

  function handleDestroyDriveClick() {
    setShowContext(false)
  }

  useEffect(() => {
    const id = drive.id.toString()
    const batchId = stamp.batchID.toString()

    const onStart = (e: Event) => {
      const { driveId } = (e as CustomEvent).detail || {}

      if (driveId === id) {
        setIsUpgrading(true)
      }
    }

    const onEnd = async (e: Event) => {
      const { driveId, success, error } = (e as CustomEvent).detail || {}

      if (!success) {
        if (error) {
          setErrorMessage?.(error)
        }

        setShowError(true)
      }

      if (driveId === id) {
        setIsUpgrading(false)

        const upgradedStamp = await refreshStamp(batchId)

        if (!isMountedRef.current) return

        if (upgradedStamp) {
          setActualStamp(upgradedStamp)
        }
      }
    }

    window.addEventListener('fm:drive-upgrade-start', onStart as EventListener)
    window.addEventListener('fm:drive-upgrade-end', onEnd as EventListener)

    return () => {
      window.removeEventListener('fm:drive-upgrade-start', onStart as EventListener)
      window.removeEventListener('fm:drive-upgrade-end', onEnd as EventListener)
    }
  }, [drive.id, setShowError, setErrorMessage, stamp.batchID, refreshStamp])

  const { capacityPct, usedSize, stampSize } = useMemo(() => {
    const filesPerDrive = files.filter(fi => fi.driveId === drive.id.toString())

    return calculateStampCapacityMetrics(actualStamp, filesPerDrive, drive.redundancyLevel)
  }, [actualStamp, drive, files])

  return (
    <div
      className={`fm-drive-item-container${isSelected ? ' fm-drive-item-container-selected' : ''}`}
      onClick={() => {
        setView(ViewType.File)
        setActualItemView?.(drive.name)
      }}
    >
      <div
        className="fm-drive-item-info"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="fm-drive-item-header">
          <div className="fm-drive-item-icon">{isHovered ? <DriveFill size="16px" /> : <Drive size="16px" />}</div>
          <div>{truncateNameMiddle(drive.name, 35, 8, 8)}</div>
        </div>
        <div className="fm-drive-item-content">
          <div className="fm-drive-item-capacity">
            Capacity <ProgressBar value={capacityPct} width="64px" /> {usedSize} / {stampSize}
          </div>
          <div className="fm-drive-item-capacity">
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
                <div
                  className="fm-context-item red"
                  onClick={() => {
                    handleDestroyDriveClick()
                    setIsDestroyDriveModalOpen(true)
                  }}
                >
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
          doDestroy={async () => {
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
          }}
        />
      )}
    </div>
  )
}
