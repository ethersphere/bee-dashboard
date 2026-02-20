import { ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material'
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
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(4),
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
}))

interface Props {
  path?: string
}

export default function SideBarItem({ path }: Props): ReactElement {
  const { status, isLoading } = useContext(Context)
  const { classes } = useStyles()
  const location = useLocation()
  const isSelected = Boolean(path && matchPath(location.pathname, path))

  return (
    <ListItemButton
      classes={{ root: `${classes.root} ${status.all ? '' : classes.rootError}` }}
      selected={isSelected}
      disableRipple
    >
      <ListItemIcon style={{ marginLeft: '30px' }}>
        <StatusIcon checkState={status.all} isLoading={isLoading} />
      </ListItemIcon>
      <ListItemText primary={<Typography className={classes.smallerText}>{`Node ${status.all}`}</Typography>} />
      <ListItemIcon className={classes.icon}>
        {status.all ? null : <ArrowRight className={classes.iconSmall} />}
      </ListItemIcon>
    </ListItemButton>
  )
}
