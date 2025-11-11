import { ReactElement } from 'react'
import './ErrorModal.scss'
import { Button } from '../Button/Button'

interface ErrorModalProps {
  label: string
  onClick: () => void
}

export function ErrorModal({ label, onClick }: ErrorModalProps): ReactElement {
  return (
    <div className="fm-error-modal-container">
      <div className="fm-modal-window">
        <div className="fm-error-modal-message">{label}</div>
        <div className="fm-error-modal-button-container">
          <Button variant="primary" label="OK" width={100} onClick={onClick} />
        </div>
      </div>
    </div>
  )
}
