import { CircularProgress, Grid } from '@mui/material'
import { ReactElement } from 'react'

export function Loading(): ReactElement {
  return (
    <Grid container direction="row" justifyContent="center" alignItems="center">
      <CircularProgress />
    </Grid>
  )
}
