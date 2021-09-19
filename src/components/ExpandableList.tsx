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
    rootLevel1: { marginTop: theme.spacing(1) },
    rootLevel2: { marginTop: theme.spacing(0.5) },
    header: {
      backgroundColor: theme.palette.background.paper,
    },
    content: {
      marginTop: theme.spacing(1),
    },
  }),
)

interface Props {
  children?: ReactNode
  label: ReactNode
  level?: 0 | 1 | 2
  defaultOpen?: boolean
}

export default function ExpandableList({ children, label, level, defaultOpen }: Props): ReactElement | null {
  const classes = useStyles()
  const [open, setOpen] = useState<boolean>(Boolean(defaultOpen))

  const handleClick = () => {
    setOpen(!open)
  }

  let rootLevelClass = ''
  let typographyVariant: 'h1' | 'h2' | 'h3' = 'h1'

  if (level === 1) {
    rootLevelClass = classes.rootLevel1
    typographyVariant = 'h2'
  } else if (level === 2) {
    rootLevelClass = classes.rootLevel2
    typographyVariant = 'h3'
  }

  return (
    <div className={`${classes.root} ${rootLevelClass}`}>
      <ListItem button onClick={handleClick} className={classes.header}>
        <ListItemText primary={<Typography variant={typographyVariant}>{label}</Typography>} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <div className={classes.content}>{children}</div>
      </Collapse>
    </div>
  )
}
