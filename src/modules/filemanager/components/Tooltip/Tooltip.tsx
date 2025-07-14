import { ReactElement } from 'react'
import InfoIcon from 'remixicon-react/InformationLineIcon'
import './Tooltip.scss'

interface TooltipProps {
  label: string
  iconSize?: string
}

export function Tooltip({ label, iconSize = '16px' }: TooltipProps): ReactElement {
  return (
    <div className="fm-tooltip-wrapper">
      <InfoIcon size={iconSize} />
      <div className="fm-tooltip-container">{label}</div>
    </div>
  )
}
