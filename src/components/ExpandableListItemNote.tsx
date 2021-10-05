import { ReactElement, ReactNode } from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'
import ListItem from '@material-ui/core/ListItem'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    header: {
      backgroundColor: '#F7F7F7',
      marginBottom: theme.spacing(0.25),
    },
    typography: {
      color: '#242424',
    },
  }),
)

interface Props {
  children?: ReactNode | ReactNode[]
}

export default function ExpandableListItemNote({ children }: Props): ReactElement | null {
  const classes = useStyles()

  return (
    <ListItem className={classes.header}>
      <Typography variant="body1" className={classes.typography}>
        {children}
      </Typography>
    </ListItem>
  )
}
