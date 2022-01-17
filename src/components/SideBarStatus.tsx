import { ReactElement, useContext } from 'react'
import { useLocation, matchPath } from 'react-router-dom'
import { ArrowRight } from 'react-feather'

import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import { ListItemText, ListItemIcon, ListItem, Typography } from '@material-ui/core'
import { Context } from '../providers/Bee'
import StatusIcon from './StatusIcon'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
    },
  }),
)

interface Props {
  path?: string
}

export default function SideBarItem({ path }: Props): ReactElement {
  const { status, isLoading } = useContext(Context)
  const classes = useStyles()
  const location = useLocation()
  const isSelected = Boolean(path && matchPath(location.pathname, path))

  return (
    <ListItem
      button
      classes={{ root: `${classes.root} ${status.all ? '' : classes.rootError}`, button: classes.button }}
      selected={isSelected}
      disableRipple
    >
      <ListItemIcon style={{ marginLeft: '30px' }}>
        <StatusIcon isOk={status.all} isLoading={isLoading} />
      </ListItemIcon>
      <ListItemText
        primary={<Typography className={classes.smallerText}>{`Node ${status.all ? 'OK' : 'Error'}`}</Typography>}
      />
      <ListItemIcon className={classes.icon}>
        {status.all ? null : <ArrowRight className={classes.iconSmall} />}
      </ListItemIcon>
    </ListItem>
  )
}
