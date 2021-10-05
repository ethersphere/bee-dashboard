import { ReactElement, ReactNode } from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { Grid } from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    action: {
      marginTop: theme.spacing(0.75),
      marginRight: theme.spacing(1),
    },
  }),
)

interface Props {
  children: ReactNode | ReactNode[]
}

export default function ExpandableListItemActions({ children }: Props): ReactElement | null {
  const classes = useStyles()

  if (Array.isArray(children)) {
    return (
      <Grid container direction="row">
        {children.map((a, i) => (
          <Grid key={i} className={classes.action}>
            {a}
          </Grid>
        ))}
      </Grid>
    )
  }

  return (
    <Grid container direction="row">
      <Grid className={classes.action}>{children}</Grid>
    </Grid>
  )
}
