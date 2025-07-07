import { ReactElement } from 'react'
import './ActionButton.scss'

interface ActionButtonProps {
  label: string
  width?: string
  height?: string
  fontSize?: string
}

export function ActionButton({ label, width = '100%', height, fontSize }: ActionButtonProps): ReactElement {
  return (
    <div className="fm-extend-button" style={{ width, height, fontSize }}>
      {label}
    </div>
  )
}
