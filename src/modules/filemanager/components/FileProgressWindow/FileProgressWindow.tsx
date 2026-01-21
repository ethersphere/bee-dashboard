import { ReactElement, useLayoutEffect, useRef } from 'react'
import CloseIcon from 'remixicon-react/CloseLineIcon'
import ArrowDownIcon from 'remixicon-react/ArrowDownSLineIcon'
import './FileProgressWindow.scss'
import { GetIconElement } from '../../utils/GetIconElement'
import { ProgressBar } from '../ProgressBar/ProgressBar'
import { FileTransferType, TransferBarColor, TransferStatus, ProgressItem } from '../../constants/transfers'
import { capitalizeFirstLetter, truncateNameMiddle } from '../../utils/common'
import { guessMime } from '../../utils/view'

interface FileProgressWindowProps {
  numberOfFiles?: number
  items?: ProgressItem[]
  type: FileTransferType
  onCancelClick: () => void
  onRowClose?: (name: string) => void
  onCloseAll?: () => void
}

const formatEta = (sec?: number) => {
  if (sec === undefined || sec === null) return ''

  if (sec <= 0) return 'Done'
  const s = Math.ceil(sec)
  const mm = Math.floor(s / 60)
  const ss = s % 60

  return mm > 0 ? `${mm}m ${ss}s left` : `${ss}s left`
}

const formatDuration = (sec?: number) => {
  if (sec === undefined || sec === null) return ''
  const s = Math.max(0, Math.round(sec))
  const mm = Math.floor(s / 60)
  const ss = s % 60

  return mm > 0 ? `${mm}m ${ss}s` : `${ss}s`
}

export function FileProgressWindow({
  numberOfFiles,
  items,
  type,
  onCancelClick,
  onRowClose,
  onCloseAll,
}: FileProgressWindowProps): ReactElement | null {
  const listRef = useRef<HTMLDivElement | null>(null)
  const firstRowRef = useRef<HTMLDivElement | null>(null)
  const count = items?.length ?? numberOfFiles ?? 0
  const rows: ProgressItem[] =
    items && items.length > 0
      ? items
      : Array.from({ length: count }, (_, i) => ({ name: `Pending file ${i + 1}`, percent: 0, size: '' }))

  const getTransferInfo = (item: ProgressItem, pct?: number) => {
    const transferType = capitalizeFirstLetter(item?.kind ?? type)
    const verb = `${transferType}ing`
    const actualStatus = item.status || (pct && pct >= 100 ? TransferStatus.Done : verb)

    return {
      statusText: capitalizeFirstLetter(actualStatus),
      barColor: TransferBarColor[transferType as keyof typeof TransferBarColor],
    }
  }

  const allDone =
    rows.length > 0 &&
    rows.every(r => {
      const pct = Number.isFinite(r.percent) ? Math.round(r.percent as number) : undefined

      return (
        r.status === TransferStatus.Done ||
        r.status === TransferStatus.Error ||
        r.status === TransferStatus.Cancelled ||
        (typeof pct === 'number' && pct >= 100)
      )
    })

  useLayoutEffect(() => {
    const rowEl = firstRowRef.current
    const listEl = listRef.current

    if (!rowEl || !listEl) return

    const rowH = rowEl.getBoundingClientRect().height
    const safeRowH = rowH > 0 ? rowH : 72
    listEl.style.maxHeight = `${safeRowH * 5}px`
  }, [rows.length])

  return (
    <div className="fm-file-progress-window">
      <div className="fm-file-progress-window-header">
        <div className="fm-emphasized-text">
          {count} {type}
          {count === 1 ? '' : 's'}
        </div>

        <div className="fm-file-progress-window-header-actions">
          <button
            className="fm-file-progress-window-header-btn fm-file-progress-window-header-dismiss"
            aria-label="Dismiss all"
            type="button"
            disabled={!allDone}
            onClick={() => onCloseAll?.()}
          >
            <CloseIcon size="16" />
          </button>

          <button
            className="fm-file-progress-window-header-btn fm-file-progress-window-header-hide"
            aria-label="Hide"
            type="button"
            onClick={onCancelClick}
          >
            <ArrowDownIcon size="16" />
          </button>
        </div>
      </div>
      <div className="fm-file-progress-window-list" ref={listRef}>
        {rows.map((item, idx) => {
          const pctNum = Number.isFinite(item.percent)
            ? Math.max(0, Math.min(100, Math.round(item.percent as number)))
            : undefined

          const isComplete = (pctNum ?? 0) >= 100 || item.status === TransferStatus.Done
          const isActive =
            item.status === TransferStatus.Uploading ||
            item.status === TransferStatus.Downloading ||
            item.status === TransferStatus.Queued

          const rowActionLabel = isActive ? 'Cancel' : 'Dismiss'

          const transferInfo = getTransferInfo(item, pctNum)

          const getCenterText = () => {
            if (!isComplete && typeof item.etaSec === 'number') return formatEta(item.etaSec)

            if (isComplete && typeof item.elapsedSec === 'number') return formatDuration(item.elapsedSec)

            return ''
          }

          const centerDisplay = getCenterText() || '\u00A0'

          const { mime } = guessMime(item.name)
          const mimeType = mime.split('/')[0].toLowerCase() || 'file'

          return (
            <div
              className="fm-file-progress-window-file-item"
              key={item.uuid || `${item.name}-${idx}`}
              ref={idx === 0 ? firstRowRef : undefined}
            >
              <div className="fm-file-progress-window-file-type-icon">
                <GetIconElement size="14" icon={mimeType} color="black" />
              </div>

              <div className="fm-file-progress-window-file-datas">
                <div className="fm-file-progress-window-file-item-header">
                  <div className="fm-file-progress-window-name" title={item.name}>
                    <div className="fm-file-progress-window-name-text">{truncateNameMiddle(item.name, 25, 8, 8)}</div>
                    {item.driveName && (
                      <div className="fm-drive-line">
                        <span className="fm-drive-chip" title={`Drive: ${item.driveName}`}>
                          {truncateNameMiddle(item.driveName, 25, 8, 8)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="fm-file-progress-window-percent" aria-live="polite">
                    {typeof pctNum === 'number' ? `${pctNum}%` : ''}
                  </div>

                  <button
                    className="fm-file-progress-window-row-close"
                    aria-label={rowActionLabel}
                    onClick={() => onRowClose?.(item.name)}
                    type="button"
                  >
                    <CloseIcon size="14" />
                  </button>
                </div>

                <ProgressBar
                  value={typeof pctNum === 'number' ? pctNum : 0}
                  width="100%"
                  backgroundColor="rgb(229, 231, 235)"
                  color={transferInfo.barColor}
                />

                <div className="fm-file-progress-window-file-item-footer">
                  <div className="fm-file-progress-window-size">{item.size || '—'}</div>
                  <div className="fm-file-progress-window-center">{centerDisplay}</div>
                  <div className="fm-file-progress-window-status">{transferInfo.statusText}</div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
