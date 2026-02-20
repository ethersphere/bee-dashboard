import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import Radio from '@mui/material/Radio'
import { ReactElement, useState } from 'react'
import { createPortal } from 'react-dom'
import AlertIcon from 'remixicon-react/AlertLineIcon'
import TrashIcon from 'remixicon-react/DeleteBin6LineIcon'

import { TOOLTIPS } from '../../constants/tooltips'
import { FileAction } from '../../constants/transfers'
import { Button } from '../Button/Button'
import { Tooltip } from '../Tooltip/Tooltip'

import './DeleteFileModal.scss'

interface DeleteFileModalProps {
  name?: string
  names?: string[]
  currentDriveName?: string
  onCancelClick: () => void
  onProceed: (action: FileAction) => void
}

export function DeleteFileModal({
  name,
  names,
  currentDriveName,
  onCancelClick,
  onProceed,
}: DeleteFileModalProps): ReactElement {
  const [value, setValue] = useState<FileAction>(FileAction.Trash)

  const modalRoot = document.querySelector('.fm-main') || document.body
  const isBulk = Array.isArray(names) && names.length > 0
  const count = isBulk ? names.length : 1
  const headerText = isBulk ? `Delete ${count} file${count > 1 ? 's' : ''}?` : `Delete ${name}?`
  const subjectNoun = isBulk ? 'selected file(s)' : 'this file'

  return createPortal(
    <div className="fm-modal-container">
      <div className="fm-modal-window fm-delete-file-modal">
        <div className="fm-modal-window-header">
          <TrashIcon /> <span className="fm-main-font-color">{headerText}</span>
        </div>

        <div className="fm-modal-window-body">
          {isBulk && (
            <ul className="fm-delete-file-modal-list">
              {names.map(n => (
                <li key={n} className="fm-delete-file-modal-list-item" title={n}>
                  {n}
                </li>
              ))}
            </ul>
          )}
          <FormControl component="fieldset">
            <div className="fm-radio-group">
              <div className="fm-form-control-label">
                <FormControlLabel
                  value={FileAction.Trash}
                  control={<Radio checked={value === FileAction.Trash} onChange={() => setValue(FileAction.Trash)} />}
                  label={
                    <div className="fm-radio-label">
                      <div className="fm-radio-label-header fm-main-font-color fm-line-height-fit">
                        Move to Trash
                        <Tooltip label={TOOLTIPS.FILE_OPERATION_TRASH} iconSize="14px" />
                      </div>
                      <div onClick={e => e.preventDefault()}>
                        Moves {subjectNoun} to the trash. It will still take up space on{' '}
                        {currentDriveName ?? 'this drive'} and expire along with it. You can restore it later.
                      </div>
                    </div>
                  }
                />
              </div>

              <div className="fm-form-control-label">
                <FormControlLabel
                  value={FileAction.Forget}
                  control={<Radio checked={value === FileAction.Forget} onChange={() => setValue(FileAction.Forget)} />}
                  label={
                    <div className="fm-radio-label">
                      <div className="fm-radio-label-header fm-main-font-color fm-line-height-fit">
                        Forget
                        <Tooltip label={TOOLTIPS.FILE_OPERATION_FORGET} iconSize="14px" />
                      </div>
                      <div onClick={e => e.preventDefault()}>
                        Removes {subjectNoun} from your view. The data will remain on Swarm until{' '}
                        {currentDriveName ?? 'the drive'} expires. This action cannot be easily undone.
                      </div>
                    </div>
                  }
                />
              </div>

              <div className="fm-form-control-label">
                <FormControlLabel
                  value={FileAction.Destroy}
                  control={
                    <Radio checked={value === FileAction.Destroy} onChange={() => setValue(FileAction.Destroy)} />
                  }
                  label={
                    <div className="fm-radio-label">
                      <div className="fm-radio-label-header fm-main-font-color fm-line-height-fit">
                        Destroy entire drive {currentDriveName ? `‘${currentDriveName}’` : ''} to delete this{' '}
                        {subjectNoun}
                      </div>
                      <div className="fm-red-font" onClick={e => e.preventDefault()}>
                        <AlertIcon size="14px" className="fm-alert-icon-inline" />
                        Warning: This will make all files on this drive inaccessible. This action is irreversible.
                      </div>
                    </div>
                  }
                />
              </div>
            </div>
          </FormControl>
        </div>

        <div className="fm-modal-window-footer">
          <Button label="Proceed" variant="primary" onClick={() => onProceed(value)} />
          <Button label="Cancel" variant="secondary" onClick={onCancelClick} />
        </div>
      </div>
    </div>,
    modalRoot,
  )
}
