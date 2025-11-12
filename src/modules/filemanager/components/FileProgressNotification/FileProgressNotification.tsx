import { ReactElement, useEffect, useMemo, useRef, useState } from 'react'
import './FileProgressNotification.scss'
import UpIcon from 'remixicon-react/ArrowUpSLineIcon'
import DownIcon from 'remixicon-react/ArrowDownSLineIcon'
import { FileProgressWindow } from '../FileProgressWindow/FileProgressWindow'
import { FileTransferType, TransferStatus } from '../../constants/transfers'

type ProgressItem = {
  name: string
  size?: string
  percent?: number
  kind?: FileTransferType
  status?: TransferStatus
  driveName?: string
  etaSec?: number
  elapsedSec?: number
}

interface FileProgressNotificationProps {
  label?: string
  type: FileTransferType
  open?: boolean
  count?: number
  items?: ProgressItem[]
  onRowClose?: (name: string) => void
  onCloseAll?: () => void
}

export function FileProgressNotification({
  label,
  type,
  open,
  count,
  items,
  onRowClose,
  onCloseAll,
}: FileProgressNotificationProps): ReactElement | null {
  const [showFileProgressWindow, setShowFileProgressWindow] = useState(Boolean(open))
  const [openedByUser, setOpenedByUser] = useState(false)
  const autoHideTimer = useRef<number | null>(null)

  const allDone = useMemo(() => {
    if (!items || items.length === 0) return false

    return items.every(i => (typeof i.percent === 'number' ? i.percent >= 100 : i.status === TransferStatus.Done))
  }, [items])

  useEffect(() => {
    if (open) {
      setShowFileProgressWindow(true)
      setOpenedByUser(false)
    }
  }, [open])

  useEffect(() => {
    if (autoHideTimer.current) {
      window.clearTimeout(autoHideTimer.current)
      autoHideTimer.current = null
    }

    if (showFileProgressWindow && allDone && !openedByUser) {
      autoHideTimer.current = window.setTimeout(() => {
        setShowFileProgressWindow(false)
        autoHideTimer.current = null
      }, 3000) as unknown as number
    }

    return () => {
      if (autoHideTimer.current) {
        window.clearTimeout(autoHideTimer.current)
        autoHideTimer.current = null
      }
    }
  }, [showFileProgressWindow, allDone, openedByUser])

  const handleOpenClick = () => {
    setOpenedByUser(true)
    setShowFileProgressWindow(true)
  }

  return (
    <div style={{ position: 'relative' }}>
      <div className="fm-file-progress-notification" onClick={handleOpenClick} role="button" aria-label={label}>
        <span>{label}</span>
        {type === FileTransferType.Upload && <UpIcon size="16px" style={{ marginLeft: 6 }} />}
        {type === FileTransferType.Download && <DownIcon size="16px" style={{ marginLeft: 6 }} />}
      </div>

      {showFileProgressWindow && (
        <FileProgressWindow
          numberOfFiles={items && items.length ? undefined : count}
          items={items}
          type={type}
          onCancelClick={() => setShowFileProgressWindow(false)}
          onRowClose={onRowClose}
          onCloseAll={() => {
            onCloseAll?.()
            setShowFileProgressWindow(false)
          }}
        />
      )}
    </div>
  )
}
