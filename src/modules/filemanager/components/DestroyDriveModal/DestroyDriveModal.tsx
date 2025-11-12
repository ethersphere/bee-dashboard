import { ReactElement, useState } from 'react'
import '../../styles/global.scss'
import './DestroyDriveModal.scss'
import { Button } from '../Button/Button'
import { createPortal } from 'react-dom'
import { DriveInfo } from '@solarpunkltd/file-manager-lib'

interface DestroyDriveModalProps {
  drive: DriveInfo
  onCancelClick: () => void
  doDestroy: () => void | Promise<void>
}

export function DestroyDriveModal({ drive, onCancelClick, doDestroy }: DestroyDriveModalProps): ReactElement {
  const [driveNameInput, setDriveNameInput] = useState('')
  const destroyDriveText = `DESTROY DRIVE ${drive.name}`
  const modalRoot = document.querySelector('.fm-main') || document.body

  return createPortal(
    <div className="fm-modal-container">
      <div className="fm-modal-window">
        <div className="fm-modal-window-header fm-red-font">Destroy entire drive</div>
        <div className="fm-modal-window-body">
          <div className="fm-modal-body-destroy">
            <div className="fm-emphasized-text">Destroy Drive? This Action Is Permanent</div>
            <div>All files stored only on this drive will become inaccessible.</div>
            <div>
              While the data may still temporarily persist on Swarm, it will be permanently removed once the storage
              expires and the data is garbage collected by the network. The File Manager will no longer recognise or
              recover these files.
            </div>
            <div>Confirmation:</div>
            <div>Requires typing a fixed expression to prevent accidental deletion. This action cannot be undone.</div>
            <div>
              Type: <span className="fm-emphasized-text">{destroyDriveText}</span>
            </div>
            <div className="fm-modal-window-input-container">
              <input
                type="text"
                id="drive-name"
                placeholder={destroyDriveText}
                value={driveNameInput}
                onChange={e => setDriveNameInput(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="fm-modal-window-footer">
          <Button
            label="Destroy entire drive"
            variant="danger"
            disabled={destroyDriveText !== driveNameInput}
            onClick={() => doDestroy()}
          />
          <Button label="Cancel" variant="secondary" onClick={onCancelClick} />
        </div>
      </div>
    </div>,
    modalRoot,
  )
}
