import { CircularProgress, Grid } from '@material-ui/core'
import { ReactElement } from 'react'

export function Loading(): ReactElement {
  return (
    <Grid container direction="row" justifyContent="space-between" alignItems="center">
      <CircularProgress />
    </Grid>
  )
}
