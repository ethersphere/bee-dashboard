import type { ReactElement } from 'react'
import { CircularProgress } from '@material-ui/core'

interface Props {
  isOk: boolean
  isLoading?: boolean
  size?: number | string
  className?: string
}

export default function StatusIcon({ isOk, size, className, isLoading }: Props): ReactElement {
  const s = size || '1rem'

  if (isLoading) return <CircularProgress size={s} className={className} />

  return (
    <span
      className={className}
      style={{
        backgroundColor: isOk ? '#1de600' : '#ff3a52',
        height: s,
        width: s,
        borderRadius: '50%',
        display: 'inline-block',
      }}
    />
  )
}
