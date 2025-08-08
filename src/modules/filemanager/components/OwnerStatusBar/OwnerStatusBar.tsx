import { ReactElement } from 'react'

import './OwnerStatusBar.scss'
import { ProgressBar } from '../ProgressBar/ProgressBar'
import { Tooltip } from '../Tooltip/Tooltip'
import { PostageBatch } from '@ethersphere/bee-js'

interface OwnerStatusBarProps {
  ownerStamp?: PostageBatch
}

export function OwnerStatusBar({ ownerStamp }: OwnerStatusBarProps): ReactElement {
  return (
    <div className="fm-owner-status-bar-container">
      <div className="fm-owner-status-bar-left">
        {ownerStamp && (
          <div className="fm-drive-item-capacity">
            Capacity <ProgressBar value={ownerStamp.usage * 100} width="150px" />{' '}
            {(ownerStamp.size.toGigabytes() - ownerStamp.remainingSize.toGigabytes()).toFixed(1)} GB /{' '}
            {ownerStamp.size.toGigabytes().toFixed(1)} GB
          </div>
        )}

        <div>File Manager Available: Until: {ownerStamp?.duration.toEndDate().toLocaleDateString()}</div>
        <Tooltip
          label="The File Manager works only while your storage remains valid. If it expires, all catalogue metadata is
            permanently lost."
        />
      </div>
      <div className="fm-owner-status-bar-upgrade-button">Manage</div>
    </div>
  )
}
