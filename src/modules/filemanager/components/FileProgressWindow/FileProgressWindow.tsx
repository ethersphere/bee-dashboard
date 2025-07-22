import { ReactElement } from 'react'
import CloseIcon from 'remixicon-react/CloseLineIcon'
import './FileProgressWindow.scss'
import { GetIconElement } from '../../utils/GetIconElement'
import { ProgressBar } from '../ProgressBar/ProgressBar'
import { FileTransferType } from '../../constants/constants'

interface FileProgressWindowProps {
  numberOfFiles?: number
  type: FileTransferType
  onCancelClick: () => void
}

export function FileProgressWindow({
  numberOfFiles,
  type,
  onCancelClick,
}: FileProgressWindowProps): ReactElement | null {
  const FILES_MOCK = [
    { name: 'example.zip', percent: 67, size: '3.4MB' },
    { name: 'filename.jpg', percent: 20, size: '12.8MB' },
    { name: 'test.jpg', percent: 78, size: '2.5MB' },
  ]

  return (
    <div className="fm-file-progress-window">
      <div className="fm-file-progress-window-header">
        <div className="fm-emphasized-text">
          {FILES_MOCK.length} {type}
          {FILES_MOCK.length === 1 ? '' : 's'}
        </div>
        <div className="fm-file-progress-window-header-close" onClick={onCancelClick}>
          <CloseIcon size="16" />
        </div>
      </div>

      {FILES_MOCK.map(file => (
        <div className="fm-file-progress-window-file-item" key={file.name}>
          <div className="fm-file-progress-window-file-type-icon">
            <GetIconElement size="14" icon="image" color="black" />
          </div>
          <div className="fm-file-progress-window-file-datas">
            <div className="fm-file-progress-window-file-item-header">
              <div>{file.name}</div>
              <div>{file.percent}%</div>
            </div>
            <ProgressBar
              value={file.percent}
              width="100%"
              backgroundColor="rgb(229, 231, 235)"
              color={type === FileTransferType.Download ? 'rgb(220, 38, 38)' : 'rgb(34, 197, 94)'}
            />
            <div className="fm-file-progress-window-file-item-footer">
              <div>{file.size}</div>
              <div>{type === FileTransferType.Download ? 'Downloading...' : 'Uploading...'}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
