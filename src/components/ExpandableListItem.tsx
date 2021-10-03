import { ReactElement, ReactNode } from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { Typography, Grid } from '@material-ui/core'
import ListItem from '@material-ui/core/ListItem'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    header: {
      backgroundColor: theme.palette.background.paper,
      marginBottom: theme.spacing(0.25),
      wordBreak: 'break-word',
    },
  }),
)

interface Props {
  label?: string
  value?: ReactNode
}

export default function ExpandableListItem({ label, value }: Props): ReactElement | null {
  const classes = useStyles()

  return (
    <ListItem className={classes.header}>
      <Grid container direction="row" justifyContent="space-between" alignItems="center">
        {label && <Typography variant="body1">{label}</Typography>}
        {value && <Typography variant="body2">{value}</Typography>}
      </Grid>
    </ListItem>
  )
}
