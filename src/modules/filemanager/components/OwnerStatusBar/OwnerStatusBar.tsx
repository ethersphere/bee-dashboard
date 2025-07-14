import { ReactElement } from 'react'

import './OwnerStatusBar.scss'
import { ProgressBar } from '../ProgressBar/ProgressBar'
import { Tooltip } from '../Tooltip/Tooltip'

export function OwnerStatusBar(): ReactElement {
  return (
    <div className="fm-owner-status-bar-container">
      <div className="fm-owner-status-bar-left">
        <div>Capacity: 8 GB/10 GB</div>
        <ProgressBar value={35} width={150} />
        <div>File Manager Available: Until: 2025-05-25</div>
        <Tooltip
          label="The File Manager works only while your storage remains valid. If it expires, all catalogue metadata is
            permanently lost."
        />
      </div>
      <div className="fm-owner-status-bar-upgrade-button">Manage</div>
    </div>
  )
}
