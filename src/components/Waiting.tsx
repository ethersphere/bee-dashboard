import { CircularProgress, Grid } from '@mui/material'
import { ReactElement } from 'react'

export function Waiting(): ReactElement {
  return (
    <Grid container direction="row" justifyContent="center" alignItems="center">
      <CircularProgress size={240} style={{ color: '#ffffff' }} />
    </Grid>
  )
}
