import { ReactElement } from 'react'
import { Link, useLocation } from 'react-router-dom'

import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import { ListItemText, ListItemIcon, ListItem, Divider, List, Drawer, Link as MUILink } from '@material-ui/core'
import { OpenInNewSharp } from '@material-ui/icons'
import { Home, FileText, DollarSign, Share2, Settings, Layers } from 'react-feather'
import { ROUTES } from '../routes'

import Logo from '../assets/logo.svg'

const navBarItems = [
  {
    label: 'Info',
    path: ROUTES.INFO,
    icon: Home,
  },
  {
    label: 'Files',
    path: ROUTES.FILES,
    icon: FileText,
  },
  {
    label: 'Stamps',
    path: ROUTES.STAMPS,
    icon: Layers,
  },
  {
    label: 'Accounting',
    path: ROUTES.ACCOUNTING,
    icon: DollarSign,
  },
  {
    label: 'Peers',
    path: ROUTES.PEERS,
    icon: Share2,
  },
  {
    label: 'Settings',
    path: ROUTES.SETTINGS,
    icon: Settings,
  },
]

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
    <Drawer variant="permanent">
      <div className={classes.root}>
        <div className={classes.logo}>
          <Link to={ROUTES.INFO}>
            <img alt="swarm" src={Logo} />
          </Link>
        </div>
        <List>
          {navBarItems.map(item => (
            <Link to={item.path} key={item.path} style={{ color: '#9f9f9f', textDecoration: 'none' }}>
              <ListItem
                button
                selected={location.pathname === item.path}
                className={location.pathname === item.path ? classes.activeSideBarItem : ''}
              >
                <ListItemIcon className={location.pathname === item.path ? classes.activeSideBar : ''}>
                  <item.icon style={{ height: '20px', color: '#9f9f9f' }} />
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
      </div>
    </Drawer>
  )
}
