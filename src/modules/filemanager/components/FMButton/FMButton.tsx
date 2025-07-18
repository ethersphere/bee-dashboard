import { ReactElement } from 'react'
import './FMButton.scss'

interface FMButtonProps {
  label: string
  onClick?: () => void
  icon?: ReactElement
  size?: 'small' | 'medium'
  variant?: 'primary' | 'secondary' | 'danger'
  disabled?: boolean
}

export function FMButton({
  label,
  onClick,
  icon,
  size = 'medium',
  variant = 'primary',
  disabled,
}: FMButtonProps): ReactElement {
  return (
    <div
      className={`fm-button fm-button-${variant} fm-button-${size}${icon ? ' fm-button-icon' : ''}${
        disabled ? ' fm-button-disabled' : ''
      }`}
      onClick={disabled ? undefined : onClick}
    >
      {icon} {label}
    </div>
  )
}
