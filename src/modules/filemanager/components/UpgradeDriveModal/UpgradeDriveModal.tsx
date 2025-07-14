import { ReactElement, useState } from 'react'
import './UpgradeDriveModal.scss'
import '../../styles/global.scss'

import { CustomDropdown } from '../CustomDropdown/CustomDropdown'
import { FMButton } from '../FMButton/FMButton'
import { createPortal } from 'react-dom'
import DriveIcon from 'remixicon-react/HardDrive2LineIcon'
import DatabaseIcon from 'remixicon-react/Database2LineIcon'
import WalletIcon from 'remixicon-react/Wallet3LineIcon'
import ExternalLinkIcon from 'remixicon-react/ExternalLinkLineIcon'
import CalendarIcon from 'remixicon-react/CalendarLineIcon'

const initialCapacityOptions = [
  { value: '5', label: '5 GB' },
  { value: '10', label: '10 GB' },
  { value: '20', label: '20 GB' },
  { value: '50', label: '50 GB' },
  { value: '100', label: '100 GB' },
]

const desiredLifetimeOptions = [
  { value: '1', label: '1 year' },
  { value: '2', label: '2 year' },
  { value: '3', label: '3 year' },
  { value: '5', label: '5 year' },
]

interface UpgradeDriveModalProps {
  driveName?: string
  onCancelClick: () => void
}

export function UpgradeDriveModal({ driveName, onCancelClick }: UpgradeDriveModalProps): ReactElement {
  const [capacity, setCapacity] = useState('personal')
  const [lifetime, setLifetime] = useState('personal')

  const modalRoot = document.querySelector('.fm-main') || document.body

  return createPortal(
    <div className="fm-modal-container">
      <div className="fm-modal-window fm-upgrade-drive-modal">
        <div className="fm-modal-window-header">
          <DriveIcon size="18px" /> Upgrade {driveName}
        </div>
        <div>Choose extension period and additional storage for your drive.</div>
        <div className="fm-modal-window-body">
          <div className="fm-upgrade-drive-modal-wallet">
            <div className="fm-upgrade-drive-modal-wallet-header fm-emphasized-text">
              <WalletIcon size="14px" color="rgb(237, 129, 49)" /> Wallet information
            </div>
            <div className="fm-upgrade-drive-modal-wallet-info">
              <div>Balance</div>
              <div>245.67 BZZ</div>
            </div>
            <div className="fm-upgrade-drive-modal-wallet-info">
              <div>Wallet address:</div>
              <div className="fm-value-snippet">0x742d...4a9c</div>
            </div>
            <div className="fm-upgrade-drive-modal-info fm-swarm-orange-font">
              <a
                className="fm-upgrade-drive-modal-info-link fm-pointer"
                href="https://www.ethswarm.org/get-bzz#how-to-get-bzz"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLinkIcon size="14px" />
                Need help topping up?
              </a>
            </div>
          </div>
        </div>
        <div className="fm-modal-window-body">
          <div className="fm-upgrade-drive-modal-input-row">
            <div className="fm-modal-window-input-container">
              <CustomDropdown
                id="drive-type"
                label="Additional storage"
                icon={<DatabaseIcon size="14px" color="rgb(237, 129, 49)" />}
                options={initialCapacityOptions}
                value={capacity}
                onChange={setCapacity}
                placeholder="Select a value"
              />
            </div>
            <div className="fm-modal-window-input-container">
              <CustomDropdown
                id="drive-type"
                label="Duration"
                icon={<CalendarIcon size="14px" color="rgb(237, 129, 49)" />}
                options={desiredLifetimeOptions}
                value={lifetime}
                onChange={setLifetime}
                placeholder="Select a value"
              />
            </div>
          </div>

          <div className="fm-upgrade-drive-modal-estimated-cost">
            <div className="fm-emphasized-text">Summary</div>
            <div>Drive: {driveName}</div>
            <div>Extension period: 1 month (5.00 BZZ)</div>
            <div>Additional storage: 5 GB (3.00 BZZ)</div>
            <div className="fm-upgrade-drive-modal-info fm-emphasized-text">
              Total: <span className="fm-swarm-orange-font">8.00 BZZ</span>
            </div>
          </div>
        </div>
        <div className="fm-modal-window-footer">
          <FMButton label="Create drive" variant="primary" />
          <FMButton label="Cancel" variant="secondary" onClick={onCancelClick} />
        </div>
      </div>
    </div>,
    modalRoot,
  )
}
