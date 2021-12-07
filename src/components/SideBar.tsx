import { Divider, Drawer, Grid, Link as MUILink, List } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { OpenInNewSharp } from '@material-ui/icons'
import type { ReactElement } from 'react'
import { BookOpen, DollarSign, FileText, Home, Layers, Settings } from 'react-feather'
import { Link } from 'react-router-dom'
import Logo from '../assets/logo.svg'
import { ROUTES } from '../routes'
import SideBarItem from './SideBarItem'
import SideBarStatus from './SideBarStatus'

const navBarItems = [
  {
    label: 'Info',
    path: ROUTES.INFO,
    icon: Home,
  },
  {
    label: 'Files',
    path: ROUTES.UPLOAD,
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
    label: 'Settings',
    path: ROUTES.SETTINGS,
    icon: Settings,
  },
]

const drawerWidth = 300

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexWrap: 'nowrap',
      minHeight: '100vh',
      paddingTop: theme.spacing(8),
      paddingBottom: theme.spacing(8),
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
      backgroundColor: '#212121',
    },
    logo: {
      marginLeft: theme.spacing(8),
      marginRight: theme.spacing(8),
    },
    icon: {
      height: theme.spacing(4),
    },
    iconSmall: {
      height: theme.spacing(2),
    },
    divider: {
      backgroundColor: '#2c2c2c',
      marginLeft: theme.spacing(4),
      marginRight: theme.spacing(4),
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

export default function SideBar(): ReactElement {
  const classes = useStyles()

  return (
    <Drawer className={classes.drawer} variant="permanent" anchor="left" classes={{ paper: classes.drawerPaper }}>
      <Grid container direction="column" justifyContent="space-between" className={classes.root}>
        <Grid className={classes.logo}>
          <Link to={ROUTES.INFO}>
            <img alt="swarm" src={Logo} />
          </Link>
        </Grid>
        <Grid>
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
          <Divider className={classes.divider} />
          <List>
            <MUILink href={process.env.REACT_APP_BEE_DOCS_HOST} target="_blank" className={classes.link}>
              <SideBarItem
                iconStart={<BookOpen className={classes.icon} />}
                iconEnd={<OpenInNewSharp className={classes.iconSmall} />}
                label={<span>Docs</span>}
              />
            </MUILink>
          </List>
        </Grid>
        <Grid>
          <Link to={ROUTES.STATUS} className={classes.link}>
            <SideBarStatus path={ROUTES.STATUS} />
          </Link>
        </Grid>
      </Grid>
    </Drawer>
  )
}
