import { ReactElement, JSXElementConstructor } from 'react'
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
    toolbar: theme.mixins.toolbar,
  }),
)

interface Props {
  isOk: boolean
}

interface PropsRow {
  icon: ReactElement
  path: string
  label: string
}

function Row({ icon, path, label }: PropsRow): ReactElement {
  const classes = useStyles()
  const location = useLocation()

  return (
    <Link to={path} key={path} style={{ color: '#9f9f9f', textDecoration: 'none' }}>
      <ListItem button selected={location.pathname === path} disableRipple>
        <ListItemIcon className={location.pathname === path ? classes.activeSideBar : ''}>{icon}</ListItemIcon>
        <ListItemText primary={label} />
      </ListItem>
    </Link>
  )
}

export default function SideBar(props: Props): ReactElement {
  const classes = useStyles()

  return (
    <Drawer variant="permanent">
      <div className={classes.root}>
        <div className={classes.logo}>
          <Link to={ROUTES.INFO}>
            <img alt="swarm" src={Logo} />
          </Link>
        </div>
        <List>
          {navBarItems.map(p => (
            <Row
              key={p.path}
              icon={<p.icon style={{ height: '36px', color: '#9f9f9f' }} />}
              path={p.path}
              label={p.label}
            />
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
