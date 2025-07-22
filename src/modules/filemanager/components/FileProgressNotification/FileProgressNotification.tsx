import { ReactElement, useState } from 'react'
import './FileProgressNotification.scss'
import UpIcon from 'remixicon-react/ArrowUpSLineIcon'
import DownIcon from 'remixicon-react/ArrowDownSLineIcon'
import { FileProgressWindow } from '../FileProgressWindow/FileProgressWindow'
import { FileTransferType } from '../../constants/constants'

interface FileProgressNotificationProps {
  label?: string
  percent?: string
  type: FileTransferType
}

export function FileProgressNotification({ label, percent, type }: FileProgressNotificationProps): ReactElement | null {
  const [showFileProgressWindow, setShowFileProgressWindow] = useState(false)

  return (
    <div style={{ position: 'relative' }}>
      <div className="fm-file-progress-notification" onClick={() => setShowFileProgressWindow(true)}>
        {label}
        {type === FileTransferType.Upload && <UpIcon size="16px" color="green" />}
        {type === FileTransferType.Download && <DownIcon size="16px" color="red" />}
      </div>

      {showFileProgressWindow && (
        <FileProgressWindow
          numberOfFiles={3}
          type={type}
          onCancelClick={() => {
            setShowFileProgressWindow(false)
          }}
        />
      )}
    </div>
  )
}
