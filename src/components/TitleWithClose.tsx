import { createStyles, Grid, makeStyles, Typography } from '@material-ui/core'
import { ReactElement } from 'react'
import { CloseButton } from './CloseButton'

interface Props {
  children: string
  onClose: () => void
}

const useStyles = makeStyles(() =>
  createStyles({
    text: {
      color: '#606060',
      fontWeight: 'bold',
    },
  }),
)

export function TitleWithClose({ children, onClose }: Props): ReactElement {
  const classes = useStyles()

  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <span>&nbsp;</span>
      <Typography className={classes.text} align="center">
        {children}
      </Typography>
      <CloseButton onClose={onClose} />
    </Grid>
  )
}
