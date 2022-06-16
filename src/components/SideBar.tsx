import { BeeModes } from '@ethersphere/bee-js'
import { Divider, Drawer, Grid, Link as MUILink, List } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { OpenInNewSharp } from '@material-ui/icons'
import { ReactElement, useContext } from 'react'
import { BookOpen, Briefcase, DollarSign, FileText, Home, Settings } from 'react-feather'
import { Link } from 'react-router-dom'
import Logo from '../assets/logo.svg'
import { config } from '../config'
import { Context } from '../providers/Bee'
import { ROUTES } from '../routes'
import SideBarItem from './SideBarItem'
import SideBarStatus from './SideBarStatus'
import Feedback from './Feedback'

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
    pathMatcherSubstring: '/files/',
  },
  {
    label: 'Account',
    path: ROUTES.ACCOUNT_WALLET,
    icon: Briefcase,
    pathMatcherSubstring: '/account/',
  },
  {
    label: 'Top Up',
    path: ROUTES.WALLET,
    icon: DollarSign,
    requiresMode: BeeModes.ULTRA_LIGHT,
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
      paddingBottom: theme.spacing(1),
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
      backgroundColor: '#212121',
      zIndex: 988,
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
    statusLink: {
      marginBottom: theme.spacing(7),
      display: 'block',
    },
  }),
)

export default function SideBar(): ReactElement {
  const classes = useStyles()
  const { nodeInfo } = useContext(Context)

  let feedbackLink

  if (config.SENTRY_KEY) {
    feedbackLink = <Feedback />
  }

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
            {navBarItems
              .filter(p => !p.requiresMode || nodeInfo?.beeMode === p.requiresMode)
              .map(p => (
                <Link to={p.path} key={p.path} className={classes.link}>
                  <SideBarItem
                    key={p.path}
                    iconStart={<p.icon className={classes.icon} />}
                    path={p.path}
                    pathMatcherSubstring={p.pathMatcherSubstring}
                    label={p.label}
                  />
                </Link>
              ))}
          </List>
          <Divider className={classes.divider} />
          <List>
            <MUILink href={config.BEE_DOCS_HOST} target="_blank" className={classes.link}>
              <SideBarItem
                iconStart={<BookOpen className={classes.icon} />}
                iconEnd={<OpenInNewSharp className={classes.iconSmall} />}
                label={<span>Docs</span>}
              />
            </MUILink>
          </List>
        </Grid>
        <Grid>
          <Link to={ROUTES.STATUS} className={`${classes.link} ${classes.statusLink}`}>
            <SideBarStatus path={ROUTES.STATUS} />
          </Link>
          {feedbackLink}
        </Grid>
      </Grid>
    </Drawer>
  )
}
