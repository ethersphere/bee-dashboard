import { ReactElement, ReactNode, useState } from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { Collapse, ListItem, ListItemText, Typography } from '@material-ui/core'
import { ExpandLess, ExpandMore } from '@material-ui/icons'

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
    content: {
      marginTop: theme.spacing(1),
    },
  }),
)

interface Props {
  children?: ReactNode
  label: ReactNode
  actions?: ReactNode
  level?: 0 | 1 | 2
  defaultOpen?: boolean
}

export default function ExpandableList({ children, label, level, defaultOpen, actions }: Props): ReactElement | null {
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
        <div style={{ display: 'flex', position: 'absolute', right: 16 }}>
          {actions}
          {open ? <ExpandLess /> : <ExpandMore />}
        </div>
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <div className={classes.content}>{children}</div>
      </Collapse>
    </div>
  )
}
