import { ReactElement, useState, useMemo, useEffect } from 'react'
import { Warning } from '@material-ui/icons'
import './ExpiringNotificationModal.scss'
import '../../styles/global.scss'

import { Button } from '../Button/Button'
import { createPortal } from 'react-dom'
import DriveIcon from 'remixicon-react/HardDrive2LineIcon'
import CalendarIcon from 'remixicon-react/CalendarLineIcon'
import AlertIcon from 'remixicon-react/AlertLineIcon'
import { UpgradeDriveModal } from '../UpgradeDriveModal/UpgradeDriveModal'
import { getDaysLeft } from '../../utils/common'

import { PostageBatch, Size } from '@ethersphere/bee-js'
import { DriveInfo } from '@solarpunkltd/file-manager-lib'

const EXPIRING_ITEMS_PAGE_SIZE = 3

interface ExpiringNotificationModalProps {
  stamps: PostageBatch[]
  drives: DriveInfo[]
  onCancelClick: () => void
  setErrorMessage?: (error: string) => void
}

export function ExpiringNotificationModal({
  stamps,
  drives,
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
    setCurrentPage(0)
  }, [stamps])

  if (stamps.length === 0) return <></>

  return createPortal(
    <div className="fm-modal-container">
      <div className="fm-modal-window fm-upgrade-drive-modal">
        <div className="fm-modal-window-header fm-red-font">
          <AlertIcon size="21px" /> Drives Expiring soon
        </div>
        <div>The following drives will expire soon. Extend them to keep your data accessible.</div>

        <div className="fm-modal-window-body fm-expiring-notification-modal-body">
          {paginatedStamps.map((stamp, index) => {
            const daysLeft = getDaysLeft(stamp.duration.toEndDate())
            let daysClass = ''

            const drive = drives.find(d => d.batchId.toString() === stamp.batchID.toString())

            if (!drive) return null

            if (daysLeft < 10) {
              daysClass = 'fm-red-font'
            } else if (daysLeft < 30) {
              daysClass = 'fm-swarm-orange-font'
            }

            return (
              <div
                key={`${stamp.batchID.toString()}-${currentPage}-${index}`}
                className="fm-modal-white-section fm-space-between"
              >
                <div className="fm-expiring-notification-modal-section-left fm-space-between">
                  <DriveIcon size="20" color="rgb(237, 129, 49)" />
                  <div>
                    <div className="fm-expiring-notification-modal-section-left-header fm-emphasized-text">
                      {stamp.label} {drive.isAdmin && <Warning style={{ fontSize: '16px' }} />}
                    </div>
                    <div className="fm-expiring-notification-modal-section-left-value">
                      {Size.fromBytes(stamp.size.toBytes() * stamp.usage).toFormattedString()} /{' '}
                      {stamp.size.toFormattedString()}
                    </div>
                  </div>
                </div>
                <div className="fm-expiring-notification-modal-section-right">
                  <div className="fm-expiring-notification-modal-section-right-header">
                    <CalendarIcon size="14" /> Expiry date: {stamp.duration.toEndDate().toLocaleDateString()}
                  </div>
                  <div className={daysClass}>{daysLeft} days left</div>
                  <div className="fm-expiring-notification-modal-section-right-button">
                    <Button
                      label="Upgrade"
                      variant="primary"
                      onClick={() => {
                        setActualStamp(stamp)
                        setActualDrive(drive)
                        setShowUpgradeDriveModal(true)
                      }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
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
