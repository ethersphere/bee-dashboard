import { ReactElement, useEffect, useState } from 'react'
import './FileProgressNotification.scss'
import UpIcon from 'remixicon-react/ArrowUpSLineIcon'
import DownIcon from 'remixicon-react/ArrowDownSLineIcon'
import { FileProgressWindow } from '../FileProgressWindow/FileProgressWindow'
import { FileTransferType } from '../../constants/constants'

type ProgressItem = { name: string; percent?: number; size?: string }

interface FileProgressNotificationProps {
  label?: string
  type: FileTransferType
  open?: boolean
  count?: number
  items?: ProgressItem[]
}

export function FileProgressNotification({
  label,
  type,
  open,
  count,
  items,
}: FileProgressNotificationProps): ReactElement | null {
  const [showFileProgressWindow, setShowFileProgressWindow] = useState(Boolean(open))

  useEffect(() => {
    setShowFileProgressWindow(Boolean(open))
  }, [open])

  return (
    <div style={{ position: 'relative' }}>
      <div className="fm-file-progress-notification" onClick={() => setShowFileProgressWindow(true)}>
        {label}
        {type === FileTransferType.Upload && <UpIcon size="16px" color="green" />}
        {type === FileTransferType.Download && <DownIcon size="16px" color="red" />}
      </div>

      {showFileProgressWindow && (
        <FileProgressWindow
          numberOfFiles={items && items.length ? undefined : count}
          items={items}
          type={type}
          onCancelClick={() => setShowFileProgressWindow(false)}
        />
      )}
    </div>
  )
}
