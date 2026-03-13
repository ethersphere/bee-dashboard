import { ListItemButton, ListItemIcon, ListItemText, Tooltip } from '@mui/material'
import type { ReactElement, ReactNode } from 'react'
import { matchPath, useLocation } from 'react-router-dom'
import { makeStyles } from 'tss-react/mui'

const useItemStyles = makeStyles()(theme => ({
  root: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    borderLeft: '4px solid rgba(0,0,0,0)',
    '&.Mui-selected, &.Mui-selected:hover': {
      borderLeft: `4px solid ${theme.palette.primary.main}`,
      backgroundColor: '#2c2c2c',
      color: '#f9f9f9',
    },
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
  rootCollapsed: {
    justifyContent: 'center',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
}))

const useStyles = makeStyles()(theme => ({
  icon: {
    color: 'inherit',
    minWidth: 0,
  },
  activeIcon: {
    color: theme.palette.primary.main,
    minWidth: 0,
  },
  label: {
    marginLeft: theme.spacing(2),
  },
}))

interface Props {
  iconStart?: ReactNode
  iconEnd?: ReactNode
  path?: string
  label: ReactNode
  pathMatcherSubstring?: string
  isCollapsed?: boolean
}

export default function SideBarItem({
  iconStart,
  iconEnd,
  path,
  label,
  pathMatcherSubstring,
  isCollapsed,
}: Props): ReactElement {
  const { classes } = useStyles()
  const { classes: itemClasses } = useItemStyles()
  const location = useLocation()
  const isSelected = pathMatcherSubstring
    ? location.pathname.startsWith(pathMatcherSubstring)
    : Boolean(path && matchPath(location.pathname, path))

  return (
    <Tooltip title={isCollapsed ? label : ''} placement="right">
      <ListItemButton
        className={`${itemClasses.root} ${isCollapsed ? itemClasses.rootCollapsed : ''}`}
        selected={isSelected}
        disableRipple
      >
        <ListItemIcon className={isSelected ? classes.activeIcon : classes.icon}>{iconStart}</ListItemIcon>
        {!isCollapsed && <ListItemText primary={label} className={classes.label} />}
        {!isCollapsed && iconEnd && (
          <ListItemIcon className={isSelected ? classes.activeIcon : classes.icon}>{iconEnd}</ListItemIcon>
        )}
      </ListItemButton>
    </Tooltip>
  )
}
