import { Box, Divider } from '@mui/material'
import { ReactElement } from 'react'

interface Props {
  my?: number
  mt?: number
  mb?: number
  color?: string
}

export function SwarmDivider({ my, mt, mb, color = '#cbcbcb' }: Props): ReactElement {
  return (
    <Box my={my} mt={mt} mb={mb}>
      <Divider style={{ borderColor: color }} />
    </Box>
  )
}
