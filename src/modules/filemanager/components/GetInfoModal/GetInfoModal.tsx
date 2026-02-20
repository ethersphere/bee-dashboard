import { ReactElement, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import ClipboardIcon from 'remixicon-react/FileCopyLineIcon'
import InfoIcon from 'remixicon-react/InformationLineIcon'

import type { FileProperty, FilePropertyGroup } from '../../utils/infoGroups'
import { Button } from '../Button/Button'

import './GetInfoModal.scss'

interface GetInfoModalProps {
  name: string
  properties: FilePropertyGroup[]
  onCancelClick: () => void
}

const COPY_TIMEOUT_MS = 2000

export function GetInfoModal({ name, onCancelClick, properties }: GetInfoModalProps): ReactElement {
  const modalRoot = document.querySelector('.fm-main') || document.body
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const timeoutRef = useRef<Record<string, NodeJS.Timeout>>({})

  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      Object.values(timeoutRef.current).forEach(clearTimeout)
    }
  }, [])

  const handleCopy = async (prop: FileProperty) => {
    try {
      await navigator.clipboard.writeText(prop.raw ?? prop.value)

      if (timeoutRef.current[prop.key]) {
        clearTimeout(timeoutRef.current[prop.key])
      }

      setCopiedKey(prop.key)

      timeoutRef.current[prop.key] = setTimeout(() => {
        setCopiedKey(prev => (prev === prop.key ? null : prev))
        delete timeoutRef.current[prop.key]
      }, COPY_TIMEOUT_MS)
    } catch {
      /* noop */
    }
  }

  return createPortal(
    <div className="fm-modal-container">
      <div className="fm-modal-window fm-get-info-modal">
        <div className="fm-modal-window-header">
          <InfoIcon /> <span className="fm-main-font-color">File Information - {name}</span>
        </div>

        <div className="fm-modal-window-body fm-get-info-body">
          {properties.map(group => (
            <div key={group.title} className="fm-get-info-modal-group">
              <div className="fm-get-info-modal-group-title">
                {group.icon}
                {group.title}
              </div>

              <div className="fm-get-info-modal-group-properties">
                {group.properties.map(prop => (
                  <div key={prop.key} className="fm-get-info-modal-property-row">
                    <span className="fm-get-info-modal-property-label">{prop.label}</span>
                    {prop.raw || prop.value.includes('...') ? (
                      <button
                        className="fm-get-info-modal-property-value fm-copyable-value"
                        onClick={() => handleCopy(prop)}
                        aria-label={`Copy ${prop.label}`}
                        type="button"
                      >
                        <ClipboardIcon size="12px" />
                        <span className="fm-copyable-value-text">{prop.value}</span>
                        {copiedKey === prop.key && <span className="fm-copied-indicator">Copied!</span>}
                      </button>
                    ) : (
                      <span className="fm-get-info-modal-property-value">{prop.value}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="fm-modal-window-footer">
          <div className="fm-get-info-modal-footer-one-button">
            <Button label="Close" variant="secondary" onClick={onCancelClick} />
          </div>
        </div>
      </div>
    </div>,
    modalRoot,
  )
}
