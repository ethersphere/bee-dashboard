import { Grid, Typography } from '@material-ui/core'
import { ReactElement } from 'react'
import { CloseButton } from './CloseButton'

interface Props {
  children: string
  onClose: () => void
}

export function TitleWithClose({ children, onClose }: Props): ReactElement {
  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <span>&nbsp;</span>
      <Typography align="center">{children}</Typography>
      <CloseButton onClose={onClose} />
    </Grid>
  )
}
