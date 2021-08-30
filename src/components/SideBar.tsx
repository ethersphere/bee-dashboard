import type { ReactElement } from 'react'
import { Link } from 'react-router-dom'

import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import { OpenInNewSharp } from '@material-ui/icons'
import { Divider, List, Drawer, Link as MUILink } from '@material-ui/core'
import { Home, FileText, DollarSign, Share2, Settings, Layers, BookOpen } from 'react-feather'
import { ROUTES } from '../routes'
import SideBarItem from './SideBarItem'

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
      minHeight: '100vh',
      paddingBottom: theme.spacing(4),
    },
    logo: {
      margin: theme.spacing(8),
    },
    icon: {
      height: theme.spacing(4),
    },
    iconSmall: {
      height: theme.spacing(2),
    },
    link: {
      color: '#9f9f9f',
      textDecoration: 'none',
      '&:hover': {
        textDecoration: 'none',

        // https://github.com/mui-org/material-ui/issues/22543
        '@media (hover: none)': {
          textDecoration: 'none',
        },
      },
    },
  }),
)

interface Props {
  isOk: boolean
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
        <div>
          <List>
            {navBarItems.map(p => (
              <Link to={p.path} key={p.path} className={classes.link}>
                <SideBarItem
                  key={p.path}
                  iconStart={<p.icon className={classes.icon} />}
                  path={p.path}
                  label={p.label}
                />
              </Link>
            ))}
          </List>
          <Divider style={{ backgroundColor: '#2c2c2c', marginLeft: 32, marginRight: 32 }} />
          <List>
            <MUILink href={process.env.REACT_APP_BEE_DOCS_HOST} target="_blank" className={classes.link}>
              <SideBarItem
                iconStart={<BookOpen className={classes.icon} />}
                iconEnd={<OpenInNewSharp className={classes.iconSmall} />}
                label={<span>Docs</span>}
              />
            </MUILink>
          </List>
        </div>
        <Link to={ROUTES.STATUS} className={classes.link}>
          <SideBarItem
            iconStart={
              <span
                style={{
                  backgroundColor: props.isOk ? '#32c48d' : '#c9201f',
                  height: '14px',
                  width: '14px',
                  borderRadius: '50%',
                  display: 'inline-block',
                }}
              />
            }
            label={`Node ${props.isOk ? 'OK' : 'Error'}`}
          />
        </Link>
      </div>
    </Drawer>
  )
}
