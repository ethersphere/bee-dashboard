import { ReactElement } from 'react'
import { createPortal } from 'react-dom'
import { Button } from '../Button/Button'
import '../../styles/global.scss'
import './UpgradeTimeoutModal.scss'

interface UpgradeTimeoutModalProps {
  driveName: string
  onOk: () => void
}

export function UpgradeTimeoutModal({ driveName, onOk }: UpgradeTimeoutModalProps): ReactElement {
  const modalRoot = document.querySelector('.fm-main') || document.body

  return createPortal(
    <div className="fm-modal-container fm-upgrade-timeout-modal">
      <div className="fm-modal-window">
        <div className="fm-modal-window-header">Drive upgrade taking longer than expected</div>

        <div className="fm-modal-window-body">
          <div className="fm-modal-white-section">
            <p>
              The upgrade for <strong>{driveName}</strong> is taking longer than expected.
            </p>
          </div>
        </div>

        <div className="fm-modal-window-footer">
          <Button label="OK" variant="primary" onClick={onOk} />
        </div>
      </div>
    </div>,
    modalRoot,
  )
}
