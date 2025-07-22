import { ReactElement } from 'react'

import './ProgressBar.scss'

interface ProgressBarProps {
  value: number
  width?: string
  color?: string
  backgroundColor?: string
}

export function ProgressBar({
  value,
  width = '200px',
  color = '#ed8131',
  backgroundColor = 'white',
}: ProgressBarProps): ReactElement {
  return (
    <div className="fm-progress-bar" style={{ width: `${width}`, backgroundColor: `${backgroundColor}` }}>
      <div className="fm-progress-bar-fill" style={{ width: `${value}%`, backgroundColor: `${color}` }}></div>
    </div>
  )
}
