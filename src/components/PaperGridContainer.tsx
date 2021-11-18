import { Grid, makeStyles } from '@material-ui/core'
import { ReactElement, ReactNode } from 'react'

interface Props {
  children: ReactNode | ReactNode[]
}

const useStyles = makeStyles(theme => ({
  grid: {
    backgroundColor: theme.palette.background.paper,
  },
}))

export function PaperGridContainer({ children }: Props): ReactElement {
  const classes = useStyles()

  return (
    <Grid className={classes.grid} container justifyContent="space-between" alignItems="center" direction="row">
      {children}
    </Grid>
  )
}
