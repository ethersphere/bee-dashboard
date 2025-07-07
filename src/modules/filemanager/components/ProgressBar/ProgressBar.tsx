import { ReactElement } from 'react'

import './ProgressBar.scss'

interface ProgressBarProps {
  value: number
  width?: number
}

export function ProgressBar({ value, width = 200 }: ProgressBarProps): ReactElement {
  return (
    <div className="fm-progress-bar" style={{ width: `${width}px` }}>
      <div className="fm-progress-bar-fill" style={{ width: `${value}%` }}></div>
    </div>
  )
}
