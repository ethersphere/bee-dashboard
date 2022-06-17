import { Box, Typography } from '@material-ui/core'
import { ReactElement } from 'react'

export function Header(): ReactElement {
  return (
    <Box mb={4}>
      <Typography variant="h1">Account</Typography>
    </Box>
  )
}
