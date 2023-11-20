import { Collapse, ListItem } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { ExpandLess, ExpandMore } from '@material-ui/icons'
import { ReactElement, ReactNode, useState } from 'react'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      padding: 0,
      margin: 0,
      marginTop: theme.spacing(4),
      '&:first-child': {
        marginTop: 0,
      },
    },
    rootLevel1: { marginTop: theme.spacing(1) },
    rootLevel2: { marginTop: theme.spacing(0.5) },
    header: {
      backgroundColor: theme.palette.background.paper,
    },
    contentLevel0: {
      marginTop: theme.spacing(1),
    },
    contentLevel12: {
      marginTop: theme.spacing(0.25),
      '& > li:last-of-type': {
        marginBottom: theme.spacing(2),
      },
    },
    infoText: {
      color: '#c9c9c9',
    },
  }),
)

interface Props {
  children: ReactNode
  expandable: ReactNode
  defaultOpen?: boolean
}

export default function ExpandableElement({ children, expandable, defaultOpen }: Props): ReactElement | null {
  const classes = useStyles()
  const [open, setOpen] = useState<boolean>(Boolean(defaultOpen))

  const handleClick = () => {
    setOpen(!open)
  }

  return (
    <div className={`${classes.root} ${classes.rootLevel2}`}>
      <ListItem button onClick={handleClick} className={classes.header}>
        {children}
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <div className={classes.contentLevel12}>{expandable}</div>
      </Collapse>
    </div>
  )
}
