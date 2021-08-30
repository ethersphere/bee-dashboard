import type { ReactElement } from 'react'
import { useLocation } from 'react-router-dom'

import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import { ListItemText, ListItemIcon, ListItem } from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      alignContent: 'space-between',
    },
    logo: {
      margin: 64,
    },
    activeSideBar: {
      color: '#dd7700',
    },
    toolbar: theme.mixins.toolbar,
  }),
)

interface Props {
  icon: ReactElement
  path: string
  label: string
}

export default function SideBarItem({ icon, path, label }: Props): ReactElement {
  const classes = useStyles()
  const location = useLocation()

  return (
    <ListItem button selected={location.pathname === path} disableRipple>
      <ListItemIcon className={location.pathname === path ? classes.activeSideBar : ''}>{icon}</ListItemIcon>
      <ListItemText primary={label} />
    </ListItem>
  )
}
