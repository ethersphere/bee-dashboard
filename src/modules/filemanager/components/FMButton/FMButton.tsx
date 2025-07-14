import { ReactElement } from 'react'
import './FMButton.scss'

interface FMButtonProps {
  label: string
  onClick?: () => void

  size?: 'small' | 'medium'
  variant?: 'primary' | 'secondary'
}

export function FMButton({ label, size = 'medium', variant = 'primary', onClick }: FMButtonProps): ReactElement {
  return (
    <div className={`fm-button fm-button-${variant} fm-button-${size}`} onClick={onClick}>
      {label}
    </div>
  )
}
