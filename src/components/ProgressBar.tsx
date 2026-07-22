import Box from '@mui/material/Box'
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress'
import Typography from '@mui/material/Typography'
import React, { ReactElement } from 'react'

interface Props {
  linearProgressProps?: LinearProgressProps
  value: number
  indeterminate?: boolean
  label?: string
}

export function LinearProgressWithLabel({ indeterminate, value, linearProgressProps, label }: Props): ReactElement {
  const displayLabel = label ?? (indeterminate ? 'Syncing...' : `${Math.round(value)}%`)

  return (
    <Box display="flex" alignItems="center">
      <Box width="100%" mr={1}>
        <LinearProgress
          {...linearProgressProps}
          variant={indeterminate ? 'indeterminate' : 'determinate'}
          value={value}
        />
      </Box>
      <Box minWidth={35}>
        <Typography variant="body2" color="textSecondary">
          {displayLabel}
        </Typography>
      </Box>
    </Box>
  )
}
