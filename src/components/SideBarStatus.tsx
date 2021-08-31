import { ReactElement, useContext } from 'react'
import { useLocation, matchPath } from 'react-router-dom'
import { ArrowRight } from 'react-feather'

import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import { ListItemText, ListItemIcon, ListItem } from '@material-ui/core'
import { Context } from '../providers/Bee'

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
      fontSize: '14px',
      borderLeft: '0px solid rgba(0,0,0,0)',
      '&.Mui-selected, &.Mui-selected:hover': {
        borderLeft: `0px solid ${theme.palette.primary.main}`,
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
  }),
)

interface Props {
  path?: string
}

export default function SideBarItem({ path }: Props): ReactElement {
  const { status } = useContext(Context)
  const classes = useStyles()
  const location = useLocation()
  const isSelected = Boolean(matchPath(location.pathname, { path, exact: true }))

  return (
    <ListItem button classes={{ root: classes.root, button: classes.button }} selected={isSelected} disableRipple>
      <ListItemIcon>
        <span
          style={{
            backgroundColor: status.all ? '#1de600' : '#ff3a52',
            height: '14px',
            width: '14px',
            borderRadius: '50%',
            display: 'inline-block',
            marginLeft: 30,
          }}
        />
      </ListItemIcon>
      <ListItemText primary={`Node ${status.all ? 'OK' : 'Error'}`} />
      <ListItemIcon className={classes.icon}>
        {status.all ? null : <ArrowRight className={classes.iconSmall} />}
      </ListItemIcon>
    </ListItem>
  )
}
