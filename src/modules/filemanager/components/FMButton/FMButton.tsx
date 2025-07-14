import { ReactElement } from 'react'
import './FMButton.scss'

interface FMButtonProps {
  label: string
  onClick?: () => void

  size?: 'small' | 'medium'
  variant?: 'primary' | 'secondary' | 'danger'
  disabled?: boolean
}

export function FMButton({
  label,
  size = 'medium',
  variant = 'primary',
  onClick,
  disabled,
}: FMButtonProps): ReactElement {
  return (
    <div
      className={`fm-button fm-button-${variant} fm-button-${size} ${disabled ? ' fm-button-disabled' : ''}`}
      onClick={disabled ? undefined : onClick}
    >
      {label}
    </div>
  )
}
