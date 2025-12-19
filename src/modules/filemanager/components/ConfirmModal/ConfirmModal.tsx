import { ReactElement } from 'react'
import '../../styles/global.scss'
import './ConfirmModal.scss'
import { Button } from '../Button/Button'
import { createPortal } from 'react-dom'

interface ConfirmModalProps {
  title?: React.ReactNode
  message?: React.ReactNode
  confirmLabel?: string
  cancelLabel?: string
  onConfirm?: () => void | Promise<void>
  onCancel?: () => void
  showFooter?: boolean
  isProgress?: boolean
  spinnerMessage?: string
  showMinimize?: boolean
  onMinimize?: () => void
  background?: boolean
}

export function ConfirmModal({
  title = 'Are you sure?',
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  showFooter = true,
  isProgress = false,
  spinnerMessage,
  showMinimize = true,
  onMinimize,
  background = true,
}: ConfirmModalProps): ReactElement {
  const modalRoot = document.querySelector('.fm-main') || document.body

  return createPortal(
    <div className={`fm-modal-container fm-confirm-modal ${background ? '' : 'fm-modal-no-background'}`}>
      <div className="fm-modal-window">
        <div className="fm-modal-window-header">{title}</div>

        <div className="fm-modal-window-body">
          {isProgress ? (
            <div className="fm-spinner-center">
              <div className="fm-spinner-message">
                <div>{spinnerMessage || 'Working…'}</div>
                <div className="fm-mini-spinner" />
              </div>
              {showMinimize && <Button label="Minimize" variant="secondary" onClick={onMinimize} />}
            </div>
          ) : (
            <div className="fm-modal-white-section">{message}</div>
          )}
        </div>

        {showFooter && (onCancel || onConfirm) && (
          <div className="fm-modal-window-footer">
            {onCancel && <Button label={cancelLabel} variant="secondary" onClick={onCancel} />}
            {onConfirm && <Button label={confirmLabel} variant="primary" onClick={() => onConfirm()} />}
          </div>
        )}
      </div>
    </div>,
    modalRoot,
  )
}
