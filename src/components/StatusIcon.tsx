import type { ReactElement } from 'react'
import { CircularProgress } from '@material-ui/core'
import { CheckState } from '../providers/Bee'

interface Props {
  isOk: CheckState
  isLoading?: boolean
  size?: number | string
  className?: string
}

export default function StatusIcon({ isOk, size, className, isLoading }: Props): ReactElement {
  const s = size || '1rem'

  if (isLoading) return <CircularProgress size={s} className={className} />

  let backgroundColor: string
  switch (isOk) {
    case CheckState.OK:
      backgroundColor = '#1de600'
      break
    case CheckState.WARNING:
      backgroundColor = 'orange'
      break
    case CheckState.ERROR:
      backgroundColor = '#ff3a52'
      break
    default:
      // Default is error
      backgroundColor = '#ff3a52'
  }

  return (
    <span
      className={className}
      style={{
        backgroundColor,
        height: s,
        width: s,
        borderRadius: '50%',
        display: 'inline-block',
      }}
    />
  )
}
