import { PostageBatch } from '@ethersphere/bee-js'
import { DriveInfo, FileInfo } from '@solarpunkltd/file-manager-lib'
import { ReactElement, useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import AlertIcon from 'remixicon-react/AlertLineIcon'

import { getDaysLeft } from '../../utils/common'
import { Button } from '../Button/Button'
import { UpgradeDriveModal } from '../UpgradeDriveModal/UpgradeDriveModal'

import { ExpiringNotificationModalItem } from './ExpiringNotificationModalItem/ExpiringNotificationModalItem'

import './ExpiringNotificationModal.scss'
import '../../styles/global.scss'

const EXPIRING_ITEMS_PAGE_SIZE = 3

interface ExpiringNotificationModalProps {
  stamps: PostageBatch[]
  drives: DriveInfo[]
  files: FileInfo[]
  onCancelClick: () => void
  setErrorMessage?: (error: string) => void
}

export function ExpiringNotificationModal({
  stamps,
  drives,
  files,
  onCancelClick,
  setErrorMessage,
}: ExpiringNotificationModalProps): ReactElement {
  const [showUpgradeDriveModal, setShowUpgradeDriveModal] = useState(false)
  const [actualStamp, setActualStamp] = useState<PostageBatch | undefined>(undefined)
  const [actualDrive, setActualDrive] = useState<DriveInfo | undefined>(undefined)
  const [currentPage, setCurrentPage] = useState(0)
  const modalRoot = document.querySelector('.fm-main') || document.body

  const sortedStamps = useMemo(() => {
    return [...stamps].sort((a, b) => {
      const daysLeftA = getDaysLeft(a.duration.toEndDate())
      const daysLeftB = getDaysLeft(b.duration.toEndDate())

      return daysLeftA - daysLeftB
    })
  }, [stamps])

  const totalPages = Math.ceil(sortedStamps.length / EXPIRING_ITEMS_PAGE_SIZE)
  const startIndex = currentPage * EXPIRING_ITEMS_PAGE_SIZE
  const paginatedStamps = sortedStamps.slice(startIndex, startIndex + EXPIRING_ITEMS_PAGE_SIZE)

  useEffect(() => {
    if (currentPage !== 0) {
      setCurrentPage(0)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stamps])

  if (stamps.length === 0) return <></>

  return createPortal(
    <div className="fm-modal-container">
      <div className="fm-modal-window fm-upgrade-drive-modal">
        <div className="fm-modal-window-header fm-red-font">
          <AlertIcon size="21px" /> Drives Expiring soon
        </div>
        <div>The following drives will expire soon. Extend them to keep your data accessible.</div>
        <div className="fm-modal-window-scrollable">
          <div className="fm-modal-window-body fm-expiring-notification-modal-body">
            {paginatedStamps.map((stamp, index) => (
              <ExpiringNotificationModalItem
                key={`${stamp.batchID.toString()}-${currentPage}-${index}`}
                stamp={stamp}
                drives={drives}
                files={files}
                currentPage={currentPage}
                index={index}
                onUpgradeClick={(stamp, drive) => {
                  setActualStamp(stamp)
                  setActualDrive(drive)
                  setShowUpgradeDriveModal(true)
                }}
              />
            ))}
          </div>
        </div>
        <div className="fm-modal-window-footer">
          <div className="fm-expiring-notification-modal-footer-one-button">
            <Button label="Cancel" variant="secondary" onClick={onCancelClick} />
          </div>
          {totalPages > 1 && (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span>
                Page {currentPage + 1} / {totalPages} · total {sortedStamps.length}
              </span>
              {currentPage > 0 && (
                <Button label="Previous" variant="secondary" onClick={() => setCurrentPage(prev => prev - 1)} />
              )}
              {currentPage + 1 < totalPages && (
                <Button label="Next" variant="primary" onClick={() => setCurrentPage(prev => prev + 1)} />
              )}
            </div>
          )}
        </div>
      </div>
      {showUpgradeDriveModal && actualStamp && actualDrive && (
        <UpgradeDriveModal
          stamp={actualStamp}
          onCancelClick={onCancelClick}
          containerColor="none"
          drive={actualDrive}
          setErrorMessage={setErrorMessage}
        />
      )}
    </div>,
    modalRoot,
  )
}
