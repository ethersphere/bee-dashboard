import { CircularProgress } from '@mui/material'
import type { ReactElement } from 'react'

import { CheckState } from '../providers/Bee'

interface Props {
  checkState: CheckState
  isLoading?: boolean
  size?: number | string
  className?: string
}

export default function StatusIcon({ checkState, size, className, isLoading }: Props): ReactElement {
  const s = size || '1rem'

  if (isLoading) return <CircularProgress size={s} className={className} />

  let backgroundColor: string
  switch (checkState) {
    case CheckState.OK:
      backgroundColor = '#1de600'
      break
    case CheckState.WARNING:
      backgroundColor = 'orange'
      break
    case CheckState.ERROR:
      backgroundColor = '#ff3a52'
      break
    case CheckState.STARTING:
      backgroundColor = 'orange'
      break
    case CheckState.CONNECTING:
      backgroundColor = '#0074D9'
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
