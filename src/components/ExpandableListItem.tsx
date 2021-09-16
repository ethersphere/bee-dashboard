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
    },
    header: {
      backgroundColor: theme.palette.background.paper,
      marginBottom: theme.spacing(0.25),
    },
  }),
)

interface Props {
  children?: ReactNode
}

export default function ExpandableListItem({ children }: Props): ReactElement | null {
  const classes = useStyles()

  return <ListItem className={classes.header}>{children}</ListItem>
}
