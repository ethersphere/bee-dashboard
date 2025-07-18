import { ReactElement, useState } from 'react'
import './VersionHistoryModal.scss'
import '../../styles/global.scss'

import { FMButton } from '../FMButton/FMButton'
import { createPortal } from 'react-dom'
import CalendarIcon from 'remixicon-react/CalendarLineIcon'
import HistoryIcon from 'remixicon-react/HistoryLineIcon'
import UserIcon from 'remixicon-react/UserLineIcon'
import DownloadIcon from 'remixicon-react/Download2LineIcon'
import { UpgradeDriveModal } from '../UpgradeDriveModal/UpgradeDriveModal'

interface VersionHistoryModalProps {
  fileName: string
  onCancelClick: () => void
}

const FILE_VERSIONS_MOCK = [
  {
    version: 'Current',
    versionHash: '1',
    isCurrent: true,
    size: '1.2MB',
    expiryDate: '2025-12-31',
    changes: 'Added new sections',
  },
  {
    version: 'v2',
    versionHash: '1',
    isCurrent: false,
    size: '1.1MB',
    expiryDate: '2025-10-15',
    changes: 'Updated content formatting',
  },
  {
    version: 'v1',
    versionHash: '1',
    isCurrent: false,
    size: '1.0MB',
    expiryDate: '2025-08-01',
    changes: 'Initial version',
  },
]

export function VersionHistoryModal({ fileName, onCancelClick }: VersionHistoryModalProps): ReactElement {
  const [showUpgradeDriveModal, setShowUpgradeDriveModal] = useState(false)
  const modalRoot = document.querySelector('.fm-main') || document.body

  return createPortal(
    <div className="fm-modal-container">
      <div className="fm-modal-window fm-upgrade-drive-modal">
        <div className="fm-modal-window-header">
          <HistoryIcon size="21px" />
          <span className="fm-main-font-color">Version history - {fileName}</span>
        </div>

        <div className="fm-modal-window-body fm-expiring-notification-modal-body">
          {FILE_VERSIONS_MOCK.map(item => (
            <div key={item.versionHash} className="fm-modal-white-section fm-space-between">
              <div className="fm-version-history-modal-section-left fm-space-between">
                <div className="fm-version-history-modal-section-left-row">
                  <div className="fm-emphasized-text">{item.version}</div>
                  {item.version === 'Current' && <div className="fm-current-tag">Current</div>}
                  <div className="fm-soft-text">{item.size}</div>
                </div>
                <div className="fm-version-history-modal-section-left-row">
                  <CalendarIcon size="12" /> {item.expiryDate} <UserIcon size="12" />
                </div>
                <div className="fm-version-history-modal-section-left-row">{item.changes}</div>
              </div>
              <div className="fm-version-history-modal-section-right">
                <FMButton
                  label="Download"
                  variant="secondary"
                  onClick={() => setShowUpgradeDriveModal(true)}
                  icon={<DownloadIcon size="15" />}
                />
                <FMButton label="Restore" variant="primary" onClick={() => setShowUpgradeDriveModal(true)} />
              </div>
            </div>
          ))}
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
