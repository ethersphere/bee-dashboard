import { ExpandLess, ExpandMore } from '@mui/icons-material'
import { Collapse, ListItemButton, ListItemText, Typography } from '@mui/material'
import { ReactElement, ReactNode, useState } from 'react'
import { makeStyles } from 'tss-react/mui'

import { Flex } from './Flex'

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
  },
  infoText: {
    color: '#c9c9c9',
  },
}))

interface Props {
  children?: ReactNode
  label: ReactNode
  info?: ReactNode
  level?: 0 | 1 | 2
  defaultOpen?: boolean
}

export default function ExpandableList({ children, label, level, defaultOpen, info }: Props): ReactElement | null {
  const { classes } = useStyles()
  const [open, setOpen] = useState<boolean>(Boolean(defaultOpen))

  const handleClick = () => {
    setOpen(!open)
  }

  let rootLevelClass = ''
  let typographyVariant: 'h1' | 'h2' | 'h3' = 'h1'
  let contentLevelClass = classes.contentLevel0

  if (level === 1) {
    rootLevelClass = classes.rootLevel1
    typographyVariant = 'h2'
    contentLevelClass = classes.contentLevel12
  } else if (level === 2) {
    rootLevelClass = classes.rootLevel2
    typographyVariant = 'h3'
    contentLevelClass = classes.contentLevel12
  }

  return (
    <div className={`${classes.root} ${rootLevelClass}`}>
      <ListItemButton onClick={handleClick} className={classes.header}>
        <ListItemText primary={<Typography variant={typographyVariant}>{label}</Typography>} />
        <Flex>
          {!open && (
            <Typography variant="body2" className={classes.infoText}>
              {info}
            </Typography>
          )}
          {open ? <ExpandLess /> : <ExpandMore />}
        </Flex>
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <div className={contentLevelClass}>{children}</div>
      </Collapse>
    </div>
  )
}
