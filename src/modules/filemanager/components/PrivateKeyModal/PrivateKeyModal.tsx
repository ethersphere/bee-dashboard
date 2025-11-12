import { useState, ReactElement, useEffect } from 'react'
import './PrivateKeyModal.scss'
import { Button } from '../Button/Button'
import { setSignerPk, getSigner } from '../../utils/common'
import { PrivateKey } from '@ethersphere/bee-js'
import ClipboardIcon from 'remixicon-react/FileCopyLineIcon'
import CheckDoubleLineIcon from 'remixicon-react/CheckDoubleLineIcon'
import { Tooltip } from '../Tooltip/Tooltip'
import { TOOLTIPS } from '../../constants/tooltips'

type Props = { onSaved: () => void }

export function PrivateKeyModal({ onSaved }: Props): ReactElement {
  const [value, setValue] = useState('')
  const [confirmValue, setConfirmValue] = useState('')
  const [showError, setShowError] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    handleGenerateNew()
  }, [])

  const handleCopyPrivateKey = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
    } catch {
      // eslint-disable-next-line no-console
      console.debug('Failed to copy private key to clipboard')
    }
  }

  const handleGenerateNew = () => {
    const id = crypto.randomUUID()
    const signer = getSigner(id)
    const privKey = signer.toHex()

    setValue(privKey)
    setConfirmValue('')
    setCopied(false)
    setShowError(false)
  }

  const handleBlur = () => {
    if (!value.trim()) {
      return
    }

    try {
      new PrivateKey(value)
      setShowError(false)
    } catch {
      setShowError(true)
      setCopied(false)
    }
  }

  const handleSave = () => {
    try {
      new PrivateKey(value)
      setSignerPk(value)
      onSaved()
    } catch {
      setShowError(true)
    }
  }

  return (
    <div className="fm-initialization-modal-container">
      <div className="fm-modal-window">
        <div className="fm-modal-window-header">
          <div>Create Private Key</div>
        </div>
        <div>
          Using a private key ensures that only you can access this File Manager instance. Save it securely before
          continuing.
        </div>
        <div className="fm-modal-info-warning flex-column">
          <span className="fm-modal-info-warning-text-header">IMPORTANT: Lost keys cannot be recovered</span>
          <span>
            Swarm never stores private keys. If you lose this key, access to this File Manager instance will be
            permanently lost.
          </span>
        </div>
        <div className="fm-modal-window-body">
          <div className="fm-modal-window-input-container">
            <label htmlFor="fm-private-key" className="fm-emphasized-text fm-private-key-label">
              <span>New Private key</span>
              <button
                onClick={handleGenerateNew}
                type="button"
                className="fm-generate-btn"
                onMouseEnter={e => (e.currentTarget.style.background = '#e5e7eb')}
                onMouseLeave={e => (e.currentTarget.style.background = '#f3f4f6')}
              >
                Generate New
              </button>
            </label>

            <div className="fm-private-key-input-row">
              <input
                id="fm-private-key"
                type="text"
                className={`fm-input${showError ? ' has-error' : ''} fm-private-key-input`}
                autoComplete="off"
                value={value}
                onChange={e => {
                  setValue(e.target.value)
                  setCopied(false)
                  setShowError(false)
                }}
                onBlur={handleBlur}
                spellCheck={false}
              />
              {
                <button
                  className="fm-copy-btn"
                  onClick={handleCopyPrivateKey}
                  aria-label="Copy private key"
                  type="button"
                  title={copied ? 'Copied!' : 'Copy'}
                >
                  {copied ? <CheckDoubleLineIcon size="16px" /> : <ClipboardIcon size="16px" />}
                </button>
              }
              <Tooltip label={TOOLTIPS.PRIVATE_KEY_MODAL_GENERATED_KEY} />
            </div>
            <div className="fm-input-hint-error">{showError ? 'Invalid private key.' : ''}</div>
          </div>

          <div className="fm-modal-window-input-container">
            <label htmlFor="fm-private-key-confirm" className="fm-emphasized-text fm-confirm-key-label">
              Confirm Private Key
            </label>
            <div className="fm-private-key-input-row">
              <input
                id="fm-private-key-confirm"
                type="text"
                className="fm-input fm-confirm-key-input"
                placeholder="Paste or type your private key again"
                autoComplete="off"
                value={confirmValue}
                onChange={e => setConfirmValue(e.target.value)}
                spellCheck={false}
              />
            </div>
            <div className="fm-input-hint fm-confirm-key-hint">
              {confirmValue && value === confirmValue ? '✓ Private keys match!' : ''}
            </div>
          </div>
        </div>

        <div className="fm-modal-window-body">
          <div className="flex-row">
            <div>
              <b>Safety Reminder:</b>
            </div>
          </div>
          <span>
            A copy of your private key is stored in this browser for convenience, but it’s not a backup - clearing
            browser data or switching devices will remove it.{' '}
            <b>Make sure you’ve saved your private key before continuing.</b>
          </span>
        </div>

        <div className="fm-modal-window-footer">
          <Button
            label="Save"
            variant="primary"
            onClick={handleSave}
            disabled={!value || !confirmValue || value !== confirmValue || showError}
          />
        </div>
      </div>
    </div>
  )
}

export default PrivateKeyModal
