import { ReactElement } from 'react'
import { Link, useLocation } from 'react-router-dom'

import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import { ListItemText, ListItemIcon, ListItem, Divider, List, Drawer, Link as MUILink } from '@material-ui/core'
import { OpenInNewSharp } from '@material-ui/icons'
import { Home, FileText, DollarSign, Share2, Settings, Layers } from 'react-feather'
import { ROUTES } from '../routes'

import SwarmLogoOrange from '../assets/swarm-logo-orange.svg'

const drawerWidth = 240

const navBarItems = [
  {
    label: 'Info',
    id: 'info',
    path: ROUTES.INFO,
    icon: Home,
  },
  {
    label: 'Files',
    id: 'files',
    path: ROUTES.FILES,
    icon: FileText,
  },
  {
    label: 'Stamps',
    id: 'stamps',
    path: ROUTES.STAMPS,
    icon: Layers,
  },
  {
    label: 'Accounting',
    id: 'accounting',
    path: ROUTES.ACCOUNTING,
    icon: DollarSign,
  },
  {
    label: 'Peers',
    id: 'peers',
    path: ROUTES.PEERS,
    icon: Share2,
  },
  {
    label: 'Settings',
    id: 'settings',
    path: ROUTES.SETTINGS,
    icon: Settings,
  },
]

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    appBar: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
    logo: {
      padding: 1,
      marginTop: 20,
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    activeSideBar: {
      color: '#dd7700',
    },
    activeSideBarItem: {
      borderLeft: '4px solid #dd7700',
      backgroundColor: 'inherit !important',
    },
    toolbar: theme.mixins.toolbar,
  }),
)

interface Props {
  isOk: boolean
}

export default function SideBar(props: Props): ReactElement {
  const classes = useStyles()
  const location = useLocation()

  return (
    <div className={classes.root}>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
        anchor="left"
      >
        <div className={classes.toolbar} style={{ textAlign: 'left', marginLeft: 20 }}>
          <Link to={ROUTES.INFO}>
            <img
              alt="swarm"
              className={classes.logo}
              src={SwarmLogoOrange}
              style={{ maxHeight: '30px', alignItems: 'center' }}
            />
          </Link>
        </div>
        <List>
          {navBarItems.map(item => (
            <Link to={item.path} key={item.id} style={{ color: 'inherit', textDecoration: 'none' }}>
              <ListItem
                button
                selected={location.pathname === item.path}
                className={location.pathname === item.path ? classes.activeSideBarItem : ''}
              >
                <ListItemIcon className={location.pathname === item.path ? classes.activeSideBar : ''}>
                  <item.icon style={{ height: '20px' }} />
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  className={location.pathname === item.path ? classes.activeSideBar : ''}
                />
              </ListItem>
            </Link>
          ))}
        </List>
        <Divider />
        <List>
          <MUILink href={process.env.REACT_APP_BEE_DOCS_HOST} target="_blank" style={{ textDecoration: 'none' }}>
            <ListItem button>
              <ListItemText primary={'Docs'} />
              <OpenInNewSharp fontSize="small" />
            </ListItem>
          </MUILink>
        </List>
        <div style={{ position: 'fixed', bottom: 0, width: 'inherit', padding: '10px' }}>
          <Link to={ROUTES.STATUS} style={{ marginRight: '30px', color: 'inherit', textDecoration: 'none' }}>
            <ListItem>
              <span
                style={{
                  backgroundColor: props.isOk ? '#32c48d' : '#c9201f',
                  marginRight: '7px',
                  height: '10px',
                  width: '10px',
                  borderRadius: '50%',
                  display: 'inline-block',
                }}
              />
              <span>Node {props.isOk ? 'OK' : 'Error'}</span>
            </ListItem>
          </Link>
        </div>
      </Drawer>
    </div>
  )
}
