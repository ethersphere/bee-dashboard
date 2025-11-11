import { ReactElement } from 'react'
import './Button.scss'

interface ButtonProps {
  label: string
  onClick?: () => void
  icon?: ReactElement
  size?: 'small' | 'medium'
  variant?: 'primary' | 'secondary' | 'danger'
  disabled?: boolean
  width?: number
}

export function Button({
  label,
  onClick,
  icon,
  size = 'medium',
  variant = 'primary',
  disabled,
  width,
}: ButtonProps): ReactElement {
  return (
    <div
      className={`fm-button fm-button-${variant} fm-button-${size}${icon ? ' fm-button-icon' : ''}${
        disabled ? ' fm-button-disabled' : ''
      }`}
      onClick={disabled ? undefined : onClick}
      style={{ width: width ? `${width}px` : undefined }}
    >
      {icon} {label}
    </div>
  )
}
