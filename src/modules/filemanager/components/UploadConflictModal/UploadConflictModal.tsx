import { ReactElement, useMemo, useState } from 'react'
import './UploadConflictModal.scss'
import '../../styles/global.scss'
import { Button } from '../Button/Button'
import WarningIcon from 'remixicon-react/ErrorWarningLineIcon'

interface Props {
  filename: string
  suggestedName: string
  existingNames: Set<string>
  isTrashedExisting?: boolean
  onKeepBoth: (newName: string) => void
  onReplace: () => void
  onCancel: () => void
}

export function UploadConflictModal({
  filename,
  suggestedName,
  existingNames,
  isTrashedExisting,
  onKeepBoth,
  onReplace,
  onCancel,
}: Props): ReactElement {
  const [customName, setCustomName] = useState<string>(suggestedName)
  const isNameValid = useMemo(() => {
    const n = (customName || '').trim()

    return n.length > 0 && !existingNames.has(n)
  }, [customName, existingNames])

  return (
    <div className="fm-modal-container">
      <div className="fm-modal-window fm-upload-conflict-modal">
        <div className="fm-modal-window-header">
          <WarningIcon size="18px" />
          <span className="fm-main-font-color">File already exists</span>
        </div>

        <div className="fm-modal-window-body">
          <div className="fm-modal-white-section">
            <div className="fm-conflict-row">
              <div className="fm-emphasized-text">A file named “{filename}” already exists in this drive.</div>
              <div className="fm-soft-text">What would you like to do?</div>
            </div>

            <div className="fm-conflict-option">
              <div className="fm-conflict-option-title">Keep both</div>
              <div className="fm-conflict-option-sub">
                Upload the new file as a separate item with a different name.
              </div>
              <div className="fm-conflict-rename-row">
                <label htmlFor="conflict-newname">New name</label>
                <input
                  id="conflict-newname"
                  type="text"
                  value={customName}
                  onChange={e => setCustomName(e.target.value)}
                  className="fm-input"
                  placeholder={suggestedName}
                />
                {!isNameValid && customName.trim().length > 0 && existingNames.has(customName.trim()) && (
                  <div className="fm-soft-text" style={{ marginTop: 6 }}>
                    That name already exists.
                  </div>
                )}
              </div>
              <Button
                label="Keep both"
                variant="secondary"
                onClick={() => isNameValid && onKeepBoth(customName.trim())}
                disabled={!isNameValid}
              />
            </div>

            <div className="fm-conflict-sep" />

            <div className="fm-conflict-option">
              <div className="fm-conflict-option-title">Replace</div>
              <div className="fm-conflict-option-sub">
                Replace the existing file by uploading this as a new version of “{filename}”.
              </div>
              <Button label="Replace" variant="primary" onClick={onReplace} />
            </div>
          </div>
          {isTrashedExisting && (
            <div className="fm-callout fm-callout--warning" role="note" aria-live="polite" style={{ marginTop: 12 }}>
              <span className="fm-callout__icon" aria-hidden>
                <WarningIcon size="16px" />
              </span>
              <span className="fm-callout__text">
                <b>Heads up:</b> The existing &apos;{filename}&apos; is currently in <b>Trash</b>.
              </span>
            </div>
          )}
        </div>

        <div className="fm-modal-window-footer">
          <div className="fm-expiring-notification-modal-footer-one-button">
            <Button label="Cancel" variant="secondary" onClick={onCancel} />
          </div>
        </div>
      </div>
    </div>
  )
}
