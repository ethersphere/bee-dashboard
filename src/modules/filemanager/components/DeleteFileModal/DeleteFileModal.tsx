import { ReactElement, useState } from 'react'
import './DeleteFileModal.scss'
import { FMButton } from '../FMButton/FMButton'
import { createPortal } from 'react-dom'
import TrashIcon from 'remixicon-react/DeleteBin6LineIcon'
import AlertIcon from 'remixicon-react/AlertLineIcon'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import { preventDefault } from '../../utils/utils'

interface DeleteFileModalProps {
  name: string
  onCancelClick: () => void
}

export function DeleteFileModal({ name, onCancelClick }: DeleteFileModalProps): ReactElement {
  const [value, setValue] = useState('female')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value)
  }
  const modalRoot = document.querySelector('.fm-main') || document.body

  return createPortal(
    <div className="fm-modal-container">
      <div className="fm-modal-window fm-delete-file-modal">
        <div className="fm-modal-window-header">
          <TrashIcon /> <span className="fm-main-font-color">Delete {name}?</span>
        </div>
        <div className="fm-modal-window-body">
          <FormControl component="fieldset">
            <RadioGroup
              aria-label="gender"
              name="gender1"
              value={value}
              onChange={handleChange}
              className="fm-radio-group"
            >
              <FormControlLabel
                className="fm-form-control-label"
                value="female"
                control={<Radio className="fm-radio-button" />}
                label={
                  <div className="fm-radio-label">
                    <div className="fm-radio-label-header  fm-main-font-color fm-line-height-fit">Move to Trash</div>
                    <div onClick={preventDefault}>
                      Moves this file to the trash. It will still take up space on MyDriveA and expire along with it.
                      You can restore it later.
                    </div>
                  </div>
                }
              />
              <FormControlLabel
                className="fm-form-control-label"
                value="male"
                control={<Radio className="fm-radio-button" />}
                label={
                  <div className="fm-radio-label">
                    <div className="fm-radio-label-header  fm-main-font-color fm-line-height-fit">Forget</div>
                    <div onClick={preventDefault}>
                      Removes this file from your view. The data will remain on Swarm until MyDriveA expires. This
                      action cannot be easily undone.
                    </div>
                  </div>
                }
              />
              <FormControlLabel
                className="fm-form-control-label"
                value="other"
                control={<Radio className="fm-radio-button" />}
                label={
                  <div className="fm-radio-label">
                    <div className="fm-radio-label-header fm-main-font–color fm-line-height-fit">
                      Destroy entire drive &apos;Drive A&apos; to delete this file
                    </div>
                    <div className="fm-red-font" onClick={preventDefault}>
                      <AlertIcon size="14px" className="fm-alert-icon-inline" />
                      Warning: This will make all files on MyDriveA inaccessible. This action is irreversible.
                    </div>
                  </div>
                }
              />
            </RadioGroup>
          </FormControl>
        </div>
        <div className="fm-modal-window-footer">
          <FMButton label="Proceed" variant="primary" onClick={onCancelClick} />
          <FMButton label="Cancel" variant="secondary" onClick={onCancelClick} />
        </div>
      </div>
    </div>,
    modalRoot,
  )
}
