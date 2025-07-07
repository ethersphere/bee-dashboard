import { ReactElement } from 'react'
import InfoIcon from 'remixicon-react/InformationLineIcon'

import './OwnerStatusBar.scss'
import { ProgressBar } from '../ProgressBar/ProgressBar'

export function OwnerStatusBar(): ReactElement {
  return (
    <div className="fm-owner-status-bar-container">
      <div className="fm-owner-status-bar-left">
        <div>Capacity: 8 GB/10 GB</div>
        <ProgressBar value={35} width={150} />
        <div>File Manager Available: Until: 2025-05-25</div>
        <div className="fm-owner-status-bar-info-tooltip-wrapper">
          <InfoIcon size="16px" />
          <span className="fm-owner-status-bar-tooltip">
            The File Manager works only while your storage remains valid. If it expires, all catalogue metadata is
            permanently lost.
          </span>
        </div>
      </div>
      <div className="fm-owner-status-bar-upgrade-button">Manage</div>
    </div>
  )
}
