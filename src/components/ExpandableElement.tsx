import { ExpandLess, ExpandMore } from '@mui/icons-material'
import { Collapse, ListItemButton } from '@mui/material'
import { ReactElement, ReactNode, useState } from 'react'
import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()(theme => ({
  root: {
    width: '100%',
    padding: 0,
    margin: 0,
    marginTop: theme.spacing(4),
    '&:first-of-type': {
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
}))

interface Props {
  children: ReactNode
  expandable: ReactNode
  defaultOpen?: boolean
}

export default function ExpandableElement({ children, expandable, defaultOpen }: Props): ReactElement | null {
  const { classes } = useStyles()
  const [open, setOpen] = useState<boolean>(Boolean(defaultOpen))

  const handleClick = () => {
    setOpen(!open)
  }

  return (
    <div className={`${classes.root} ${classes.rootLevel2}`}>
      <ListItemButton onClick={handleClick} className={classes.header}>
        {children}
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <div className={classes.contentLevel12}>{expandable}</div>
      </Collapse>
    </div>
  )
}
