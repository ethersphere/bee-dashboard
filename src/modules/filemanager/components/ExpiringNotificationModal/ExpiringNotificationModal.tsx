import { ReactElement, useState } from 'react'
import './ExpiringNotificationModal.scss'
import '../../styles/global.scss'

import { FMButton } from '../FMButton/FMButton'
import { createPortal } from 'react-dom'
import DriveIcon from 'remixicon-react/HardDrive2LineIcon'
import CalendarIcon from 'remixicon-react/CalendarLineIcon'
import AlertIcon from 'remixicon-react/AlertLineIcon'
import { UpgradeDriveModal } from '../UpgradeDriveModal/UpgradeDriveModal'
import { getDaysLeft } from '../../utils/utils'

const EXPIRING_DRIVES = [
  {
    driveName: 'Drive A',
    driveUsedCapacity: '7GB',
    driveTotalCapacity: '10GB',
    expiryDate: '2025-07-25',
  },
  {
    driveName: 'Drive B',
    driveUsedCapacity: '2GB',
    driveTotalCapacity: '5GB',
    expiryDate: '2025-07-30',
  },
  {
    driveName: 'Drive C',
    driveUsedCapacity: '9GB',
    driveTotalCapacity: '10GB',
    expiryDate: '2025-07-28',
  },
  {
    driveName: 'Drive C',
    driveUsedCapacity: '9GB',
    driveTotalCapacity: '10GB',
    expiryDate: '2025-07-29',
  },
]

interface ExpiringNotificationModalProps {
  onCancelClick: () => void
}

export function ExpiringNotificationModal({ onCancelClick }: ExpiringNotificationModalProps): ReactElement {
  const [showUpgradeDriveModal, setShowUpgradeDriveModal] = useState(false)
  const modalRoot = document.querySelector('.fm-main') || document.body

  return createPortal(
    <div className="fm-modal-container">
      <div className="fm-modal-window fm-upgrade-drive-modal">
        <div className="fm-modal-window-header fm-red-font">
          <AlertIcon size="21px" /> Drives Expiring soon
        </div>
        <div>The following drives will expire soon. Extend them to keep your data accessible.</div>

        <div className="fm-modal-window-body fm-expiring-notification-modal-body">
          {EXPIRING_DRIVES.map(drive => {
            const daysLeft = getDaysLeft(drive.expiryDate)
            let daysClass = ''

            if (daysLeft < 10) {
              daysClass = 'fm-red-font'
            } else if (daysLeft < 30) {
              daysClass = 'fm-swarm-orange-font'
            }

            return (
              <div key={drive.driveName} className="fm-modal-white-section fm-space-between">
                <div className="fm-expiring-notification-modal-section-left fm-space-between">
                  <DriveIcon size="20" color="rgb(237, 129, 49)" />
                  <div>
                    <div className="fm-expiring-notification-modal-section-left-header fm-emphasized-text">
                      {drive.driveName}
                    </div>
                    <div className="fm-expiring-notification-modal-section-left-value">
                      {drive.driveUsedCapacity}/{drive.driveTotalCapacity}
                    </div>
                  </div>
                </div>
                <div className="fm-expiring-notification-modal-section-right">
                  <div className="fm-expiring-notification-modal-section-right-header">
                    <CalendarIcon size="14" /> Expiry date: {drive.expiryDate}
                  </div>
                  <div className={daysClass}>{daysLeft} days left</div>
                  <div className="fm-expiring-notification-modal-section-right-button">
                    <FMButton label="Upgrade" variant="primary" onClick={() => setShowUpgradeDriveModal(true)} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <div className="fm-modal-window-footer">
          <div className="fm-expiring-notification-modal-footer-one-button">
            <FMButton label="Cancel" variant="secondary" onClick={onCancelClick} />
          </div>
        </div>
      </div>
      {showUpgradeDriveModal && <UpgradeDriveModal onCancelClick={onCancelClick} containerColor="none" />}
    </div>,
    modalRoot,
  )
}
