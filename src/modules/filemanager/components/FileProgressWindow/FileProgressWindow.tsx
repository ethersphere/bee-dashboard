import { ReactElement } from 'react'
import CloseIcon from 'remixicon-react/CloseLineIcon'
import './FileProgressWindow.scss'
import { GetIconElement } from '../../utils/GetIconElement'
import { ProgressBar } from '../ProgressBar/ProgressBar'
import { FileTransferType } from '../../constants/constants'

type ProgressItem = {
  name: string
  percent?: number
  size?: string
}

interface FileProgressWindowProps {
  numberOfFiles?: number
  items?: ProgressItem[]
  type: FileTransferType
  onCancelClick: () => void
}

export function FileProgressWindow({
  numberOfFiles,
  items,
  type,
  onCancelClick,
}: FileProgressWindowProps): ReactElement | null {
  const count = items?.length ?? numberOfFiles ?? 0

  const rows: ProgressItem[] =
    items && items.length > 0
      ? items
      : Array.from({ length: count }, (_, i) => ({
          name: `Pending file ${i + 1}`,
          percent: 0,
          size: '',
        }))

  const noun = type === FileTransferType.Download ? 'download' : 'upload'
  const statusText = type === FileTransferType.Download ? 'Downloading…' : 'Uploading…'
  const barColor = type === FileTransferType.Download ? 'rgb(220, 38, 38)' : 'rgb(34, 197, 94)'

  return (
    <div className="fm-file-progress-window">
      <div className="fm-file-progress-window-header">
        <div className="fm-emphasized-text">
          {count} {noun}
          {count === 1 ? '' : 's'}
        </div>
        <div className="fm-file-progress-window-header-close" onClick={onCancelClick} role="button" aria-label="Close">
          <CloseIcon size="16" />
        </div>
      </div>

      {rows.map(file => (
        <div className="fm-file-progress-window-file-item" key={file.name}>
          <div className="fm-file-progress-window-file-type-icon">
            <GetIconElement size="14" icon={file.name || 'file'} color="black" />
          </div>
          <div className="fm-file-progress-window-file-datas">
            <div className="fm-file-progress-window-file-item-header">
              <div className="truncate">{file.name}</div>
              <div>{typeof file.percent === 'number' ? `${Math.max(0, Math.min(100, file.percent))}%` : ''}</div>
            </div>
            <ProgressBar
              value={typeof file.percent === 'number' ? Math.max(0, Math.min(100, file.percent)) : 0}
              width="100%"
              backgroundColor="rgb(229, 231, 235)"
              color={barColor}
            />
            <div className="fm-file-progress-window-file-item-footer">
              <div>{file.size || '—'}</div>
              <div>{statusText}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
