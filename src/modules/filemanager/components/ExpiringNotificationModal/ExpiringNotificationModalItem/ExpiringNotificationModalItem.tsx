import { PostageBatch } from '@ethersphere/bee-js'
import { Warning } from '@mui/icons-material'
import { DriveInfo, FileInfo } from '@solarpunkltd/file-manager-lib'
import { ReactElement } from 'react'
import CalendarIcon from 'remixicon-react/CalendarLineIcon'
import DriveIcon from 'remixicon-react/HardDrive2LineIcon'

import { calculateStampCapacityMetrics } from '../../../utils/bee'
import { getDaysLeft } from '../../../utils/common'
import { Button } from '../../Button/Button'

import '../../../styles/global.scss'

interface ExpiringNotificationModalItemProps {
  stamp: PostageBatch
  drives: DriveInfo[]
  files: FileInfo[]
  currentPage: number
  index: number
  onUpgradeClick: (stamp: PostageBatch, drive: DriveInfo) => void
}

export function ExpiringNotificationModalItem({
  stamp,
  drives,
  files,
  currentPage,
  index,
  onUpgradeClick,
}: ExpiringNotificationModalItemProps): ReactElement | null {
  const daysLeft = getDaysLeft(stamp.duration.toEndDate())
  let daysClass = ''

  const drive = drives.find(d => d.batchId.toString() === stamp.batchID.toString())

  if (!drive) return null

  const filesPerDrive = files.filter(fi => fi.driveId === drive.id.toString())

  const { usedSize, stampSize } = calculateStampCapacityMetrics(stamp, filesPerDrive, drive.redundancyLevel)

  if (daysLeft < 10) {
    daysClass = 'fm-red-font'
  } else if (daysLeft < 30) {
    daysClass = 'fm-swarm-orange-font'
  }

  return (
    <div
      key={`${stamp.batchID.toString()}-${currentPage}-${index}`}
      className="fm-modal-white-section fm-space-between"
    >
      <div className="fm-expiring-notification-modal-section-left fm-space-between">
        <DriveIcon size="20" color="rgb(237, 129, 49)" />
        <div>
          <div className="fm-expiring-notification-modal-section-left-header fm-emphasized-text">
            {stamp.label} {drive.isAdmin && <Warning style={{ fontSize: '16px' }} />}
          </div>
          <div className="fm-expiring-notification-modal-section-left-value">
            {usedSize} / {stampSize}
          </div>
        </div>
      </div>
      <div className="fm-expiring-notification-modal-section-right">
        <div className="fm-expiring-notification-modal-section-right-header">
          <CalendarIcon size="14" /> Expiry date: {stamp.duration.toEndDate().toLocaleDateString()}
        </div>
        <div className={daysClass}>{daysLeft} days left</div>
        <div className="fm-expiring-notification-modal-section-right-button">
          <Button label="Upgrade" variant="primary" onClick={() => onUpgradeClick(stamp, drive)} />
        </div>
      </div>
    </div>
  )
}
