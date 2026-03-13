import { ListItemButton, ListItemIcon, ListItemText, Tooltip, Typography } from '@mui/material'
import { ReactElement, useContext } from 'react'
import { matchPath, useLocation } from 'react-router-dom'
import ArrowRight from 'remixicon-react/ArrowRightLineIcon'
import { makeStyles } from 'tss-react/mui'

import { Context } from '../providers/Bee'

import StatusIcon from './StatusIcon'

const useStyles = makeStyles()(theme => ({
  icon: {
    color: 'inherit',
  },
  iconSmall: {
    height: theme.spacing(2),
  },

  root: {
    height: theme.spacing(4),
    paddingLeft: theme.spacing(0),
    paddingRight: theme.spacing(0),
    color: '#f9f9f9',
    borderLeft: '0px solid rgba(0,0,0,0)',
    '&.Mui-selected, &.Mui-selected:hover': {
      borderLeft: `0px solid ${theme.palette.primary.main}`,
      backgroundColor: '#2c2c2c',
    },
  },
  rootError: {
    backgroundColor: 'rgba(255, 58, 82, 0.25)',
  },
  button: {
    '&:hover': {
      backgroundColor: '#2c2c2c',
      color: 'white',

      // https://github.com/mui-org/material-ui/issues/22543
      '@media (hover: none)': {
        backgroundColor: '#2c2c2c',
        color: 'white',
      },
    },
  },
  smallerText: {
    fontSize: '0.9rem',
    whiteSpace: 'nowrap',
  },
  rootCollapsed: {
    justifyContent: 'center',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  statusIcon: {
    marginLeft: '30px',
    minWidth: 0,
  },
  statusIconCollapsed: {
    marginLeft: 0,
    minWidth: 0,
  },
  statusText: {
    marginLeft: theme.spacing(2),
  },
}))

interface Props {
  path?: string
  isCollapsed?: boolean
}

export default function SideBarItem({ path, isCollapsed }: Props): ReactElement {
  const { status, isLoading } = useContext(Context)
  const { classes } = useStyles()
  const location = useLocation()
  const isSelected = Boolean(path && matchPath(location.pathname, path))

  return (
    <Tooltip title={isCollapsed ? `Node ${status.all}` : ''} placement="right">
      <ListItemButton
        classes={{
          root: `${classes.root} ${status.all ? '' : classes.rootError} ${isCollapsed ? classes.rootCollapsed : ''}`,
        }}
        selected={isSelected}
        disableRipple
      >
        <ListItemIcon className={isCollapsed ? classes.statusIconCollapsed : classes.statusIcon}>
          <StatusIcon checkState={status.all} isLoading={isLoading} />
        </ListItemIcon>
        {!isCollapsed && (
          <>
            <ListItemText
              primary={
                <Typography
                  className={`${classes.smallerText} ${classes.statusText}`}
                >{`Node ${status.all}`}</Typography>
              }
            />
            <ListItemIcon className={classes.icon}>
              {status.all ? null : <ArrowRight className={classes.iconSmall} />}
            </ListItemIcon>
          </>
        )}
      </ListItemButton>
    </Tooltip>
  )
}
