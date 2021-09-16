import { ReactElement, ReactNode, useState, useContext } from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { Alert, AlertTitle } from '@material-ui/lab'
import Collapse from '@material-ui/core/Collapse'
import { Paper, Typography } from '@material-ui/core'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      padding: 0,
      margin: 0,
    },
    header: {
      backgroundColor: theme.palette.background.paper,
    },
    content: {
      marginTop: theme.spacing(1),
    },
    level1: { marginBottom: theme.spacing(1) },
    level2: {},
  }),
)

interface Props {
  children?: ReactNode
  label: string
  level?: 0 | 1 | 2
  defaultOpen?: boolean
}

export default function ExpandableList({ children, label, level, defaultOpen }: Props): ReactElement | null {
  const classes = useStyles()
  const [open, setOpen] = useState<boolean>(Boolean(defaultOpen))

  const handleClick = () => {
    setOpen(!open)
  }

  return (
    <div className={classes.root}>
      <ListItem button onClick={handleClick} className={classes.header}>
        <ListItemText primary={<Typography variant="h1">{label}</Typography>} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <div className={classes.content}>{children}</div>
      </Collapse>
    </div>
  )
}
