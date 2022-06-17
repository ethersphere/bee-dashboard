import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core'
import { createStyles, makeStyles, Theme, withStyles } from '@material-ui/core/styles'
import type { ReactElement, ReactNode } from 'react'
import { matchPath, useLocation } from 'react-router-dom'

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
  pathMatcherSubstring?: string
}

export default function SideBarItem({ iconStart, iconEnd, path, label, pathMatcherSubstring }: Props): ReactElement {
  const classes = useStyles()
  const location = useLocation()
  const isSelected = pathMatcherSubstring
    ? location.pathname.startsWith(pathMatcherSubstring)
    : Boolean(path && matchPath(location.pathname, path))

  return (
    <StyledListItem button selected={isSelected} disableRipple>
      <ListItemIcon className={isSelected ? classes.activeIcon : classes.icon}>{iconStart}</ListItemIcon>
      <ListItemText primary={label} />
      <ListItemIcon className={isSelected ? classes.activeIcon : classes.icon}>{iconEnd}</ListItemIcon>
    </StyledListItem>
  )
}
