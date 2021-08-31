import type { ReactElement, ReactNode } from 'react'
import { useLocation, matchPath } from 'react-router-dom'

import { createStyles, Theme, makeStyles, withStyles } from '@material-ui/core/styles'
import { ListItemText, ListItemIcon, ListItem } from '@material-ui/core'

const StyledListItem = withStyles((theme: Theme) => ({
  root: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    borderLeft: '4px solid rgba(0,0,0,0)',
    '&.Mui-selected, &.Mui-selected:hover': {
      borderLeft: `4px solid ${theme.palette.primary.main}`,
      backgroundColor: '#2c2c2c',
      color: '#f9f9f9',
    },
  },
  button: {
    '&:hover': {
      backgroundColor: '#2c2c2c',
      color: '#f9f9f9',

      // https://github.com/mui-org/material-ui/issues/22543
      '@media (hover: none)': {
        backgroundColor: '#2c2c2c',
        color: '#f9f9f9',
      },
    },
  },
}))(ListItem)

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    icon: {
      color: 'inherit',
    },
    activeIcon: {
      color: theme.palette.primary.main,
    },
  }),
)

interface Props {
  iconStart?: ReactNode
  iconEnd?: ReactNode
  path?: string
  label: ReactNode
}

export default function SideBarItem({ iconStart, iconEnd, path, label }: Props): ReactElement {
  const classes = useStyles()
  const location = useLocation()
  const isSelected = Boolean(matchPath(location.pathname, { path, exact: true }))

  return (
    <StyledListItem button selected={isSelected} disableRipple>
      <ListItemIcon className={isSelected ? classes.activeIcon : classes.icon}>{iconStart}</ListItemIcon>
      <ListItemText primary={label} />
      <ListItemIcon className={isSelected ? classes.activeIcon : classes.icon}>{iconEnd}</ListItemIcon>
    </StyledListItem>
  )
}
