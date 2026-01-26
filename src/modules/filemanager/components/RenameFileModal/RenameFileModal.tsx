import { ReactElement, useEffect, useMemo, useRef, useState } from 'react'
import '../../styles/global.scss'
import './RenameFileModal.scss'

import { Button } from '../Button/Button'
import EditIcon from 'remixicon-react/EditLineIcon'
import { createPortal } from 'react-dom'
import { safeSetState } from '../../utils/common'

const maxFileNameLength = 60

interface RenameFileModalProps {
  currentName: string
  takenNames?: Set<string> | string[]
  onCancelClick: () => void
  onProceed: (newName: string) => void | Promise<void>
}

export function RenameFileModal({
  currentName,
  takenNames,
  onCancelClick,
  onProceed,
}: RenameFileModalProps): ReactElement {
  const [value, setValue] = useState(currentName)
  const [touched, setTouched] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const isMountedRef = useRef(true)

  useEffect(() => {
    isMountedRef.current = true

    return () => {
      isMountedRef.current = false
    }
  }, [])

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 0)

    return () => clearTimeout(t)
  }, [])

  const taken = useMemo(() => {
    if (!takenNames) return new Set<string>()

    return Array.isArray(takenNames) ? new Set(takenNames) : takenNames
  }, [takenNames])

  const trimmed = useMemo(() => value.trim(), [value])

  const error = useMemo(() => {
    if (!touched) return ''

    if (!trimmed) return 'Name is required.'

    if (trimmed === currentName) return 'Enter a different name.'

    if (/[\\/:*?"<>|]+/.test(trimmed)) return 'Name contains invalid characters.'

    if (taken.has(trimmed)) return 'A different file already uses this name. Please choose another.'

    return ''
  }, [touched, trimmed, currentName, taken])

  const canSubmit =
    trimmed.length > 0 && trimmed !== currentName && !/[\\/:*?"<>|]+/.test(trimmed) && !taken.has(trimmed)

  const handleSubmit = async () => {
    if (!canSubmit || submitting) {
      setTouched(true)

      return
    }
    try {
      setSubmitting(true)
      await onProceed(trimmed)
    } finally {
      safeSetState(isMountedRef, setSubmitting)(false)
    }
  }

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = e => {
    if (e.key === 'Enter') {
      e.preventDefault()
      void handleSubmit()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      onCancelClick()
    }
  }

  const modalRoot = (document.querySelector('.fm-main') as HTMLElement) || document.body

  return createPortal(
    <div className="fm-modal-container fm-rename-modal">
      <div className="fm-modal-window">
        <div className="fm-modal-window-header">
          <EditIcon size="21px" />
          <span className="fm-main-font-color">Rename file</span>
        </div>

        <div className="fm-modal-window-body">
          <div className="fm-modal-white-section">
            <label htmlFor="fm-rename-input" className="fm-soft-text" style={{ display: 'block', marginBottom: 8 }}>
              New name
            </label>
            <input
              id="fm-rename-input"
              ref={inputRef}
              type="text"
              className="fm-input fm-rename-input"
              value={value}
              onChange={e => setValue(e.target.value)}
              onBlur={() => setTouched(true)}
              onKeyDown={onKeyDown}
              placeholder="Enter a new file name"
              maxLength={maxFileNameLength}
            />
            {error && (
              <div className="fm-error-text" style={{ marginTop: 8 }}>
                {error}
              </div>
            )}
            <div className="fm-soft-text" style={{ marginTop: 10, fontSize: 12 }}>
              This creates a new version that only changes metadata (no re-upload).
            </div>
          </div>
        </div>

        <div className="fm-modal-window-footer fm-space-between">
          <Button label="Cancel" variant="secondary" onClick={onCancelClick} />
          <Button
            label="Rename"
            variant="primary"
            onClick={() => void handleSubmit()}
            disabled={!canSubmit || submitting}
          />
        </div>
      </div>
    </div>,
    modalRoot,
  )
}
