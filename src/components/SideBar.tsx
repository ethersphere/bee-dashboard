import { ReactElement } from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'

import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import { ListItemText, ListItemIcon, ListItem, Divider, List, Drawer, Link as MUILink } from '@material-ui/core'
import { OpenInNewSharp } from '@material-ui/icons'
import { Activity, FileText, DollarSign, Share2, Settings, Layers } from 'react-feather'

import SwarmLogoOrange from '../assets/swarm-logo-orange.svg'
import { Health } from '@ethersphere/bee-js'

import LastUpdate from './LastUpdate'

const drawerWidth = 240

const navBarItems = [
  {
    label: 'Status',
    id: 'status',
    path: '/',
    icon: Activity,
  },
  {
    label: 'Files',
    id: 'files',
    path: '/files/',
    icon: FileText,
  },
  {
    label: 'Stamps',
    id: 'stamps',
    path: '/stamps/',
    icon: Layers,
  },
  {
    label: 'Accounting',
    id: 'accounting',
    path: '/accounting/',
    icon: DollarSign,
  },
  {
    label: 'Peers',
    id: 'peers',
    path: '/peers/',
    icon: Share2,
  },
  {
    label: 'Settings',
    id: 'settings',
    path: '/settings/',
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

interface Props extends RouteComponentProps {
  themeMode: string
  health: boolean
  nodeHealth: Health | null
  lastUpdate: number | null
}

export default function SideBar(props: Props): ReactElement {
  const classes = useStyles()

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
          <Link to="/">
            <img
              alt="swarm"
              className={classes.logo}
              src={props.themeMode === 'light' ? SwarmLogoOrange : SwarmLogoOrange}
              style={{ maxHeight: '30px', alignItems: 'center' }}
            />
          </Link>
        </div>
        <List>
          {navBarItems.map(item => (
            <Link to={item.path} key={item.id} style={{ color: 'inherit', textDecoration: 'none' }}>
              <ListItem
                button
                selected={props.location.pathname === item.path}
                className={props.location.pathname === item.path ? classes.activeSideBarItem : ''}
              >
                <ListItemIcon className={props.location.pathname === item.path ? classes.activeSideBar : ''}>
                  <item.icon style={{ height: '20px' }} />
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  className={props.location.pathname === item.path ? classes.activeSideBar : ''}
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
          <ListItem>
            <div style={{ marginRight: '30px' }}>
              <div
                style={{
                  backgroundColor: props.health ? '#32c48d' : '#c9201f',
                  marginRight: '7px',
                  height: '10px',
                  width: '10px',
                  borderRadius: '50%',
                  display: 'inline-block',
                }}
              />
              <span>API</span>
            </div>
            <div>
              <div
                style={{
                  backgroundColor: props.nodeHealth?.status === 'ok' ? '#32c48d' : '#c9201f',
                  marginRight: '7px',
                  height: '10px',
                  width: '10px',
                  borderRadius: '50%',
                  display: 'inline-block',
                }}
              />
              <span>Debug API</span>
            </div>
          </ListItem>
          <div style={{ width: '100%', textAlign: 'center' }}>
            <LastUpdate date={props.lastUpdate} />
          </div>
        </div>
      </Drawer>
    </div>
  )
}
