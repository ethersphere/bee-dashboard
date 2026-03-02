import { Grid } from '@mui/material'
import { ReactElement, ReactNode } from 'react'
import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()(theme => ({
  wrapper: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  action: {
    marginBottom: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
}))

interface Props {
  children: ReactNode | ReactNode[]
}

export default function ExpandableListItemActions({ children }: Props): ReactElement | null {
  const { classes } = useStyles()

  if (Array.isArray(children)) {
    return (
      <div className={classes.wrapper}>
        {children
          // Exclude falsy values to allow conditional rendering
          .filter(x => x)
          .map((a, i) => (
            <div key={i} className={classes.action}>
              {a}
            </div>
          ))}
      </div>
    )
  }

  return (
    <Grid container direction="row">
      <Grid className={classes.action}>{children}</Grid>
    </Grid>
  )
}
