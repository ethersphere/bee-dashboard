import type { ReactElement } from 'react'
import { CircularProgress } from '@material-ui/core'

interface Props {
  isOk: boolean
  isLoading?: boolean
  size?: number | string
  className?: string
}

export default function StatusIcon({ isOk, size, className, isLoading }: Props): ReactElement {
  if (isLoading) return <CircularProgress size={size || '1rem'} className={className} />

  return (
    <span
      className={className}
      style={{
        backgroundColor: isOk ? '#1de600' : '#ff3a52',
        height: size || '1rem',
        width: size || '1rem',
        borderRadius: '50%',
        display: 'inline-block',
      }}
    />
  )
}
