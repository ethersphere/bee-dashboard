import { Grid } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { ReactElement, ReactNode } from 'react'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    action: {
      marginTop: theme.spacing(0.75),
      marginBottom: theme.spacing(1),
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
        {children
          .filter(x => x)
          .map((a, i) => (
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
