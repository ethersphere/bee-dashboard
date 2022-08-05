import { Divider, Drawer, Grid, Link as MUILink, List } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { ReactElement, useContext } from 'react'
import { Link } from 'react-router-dom'
import FilesIcon from 'remixicon-react/ArrowUpDownLineIcon'
import DocsIcon from 'remixicon-react/BookOpenLineIcon'
import ExternalLinkIcon from 'remixicon-react/ExternalLinkLineIcon'
import HomeIcon from 'remixicon-react/Home3LineIcon'
import SettingsIcon from 'remixicon-react/Settings2LineIcon'
import AccountIcon from 'remixicon-react/Wallet3LineIcon'
import { Context as BeeContext } from '../providers/Bee'
import { Context as SettingsContext } from '../providers/Settings'
import DashboardLogo from '../assets/dashboard-logo.svg'
import DesktopLogo from '../assets/desktop-logo.svg'
import { config } from '../config'
import { ROUTES } from '../routes'
import SideBarItem from './SideBarItem'
import SideBarStatus from './SideBarStatus'
import { BeeModes } from '@ethersphere/bee-js'

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
      zIndex: 988,
    },
    logo: {
      marginLeft: theme.spacing(8),
      marginRight: theme.spacing(8),
    },
    icon: {
      height: theme.spacing(4),
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
  const { isBeeDesktop } = useContext(SettingsContext)
  const { nodeInfo } = useContext(BeeContext)

  const navBarItems = [
    {
      label: 'Info',
      path: ROUTES.INFO,
      icon: HomeIcon,
    },
    {
      label: 'Files',
      path: nodeInfo?.beeMode === BeeModes.ULTRA_LIGHT ? ROUTES.DOWNLOAD : ROUTES.UPLOAD,
      icon: FilesIcon,
      pathMatcherSubstring: '/files/',
    },
    {
      label: 'Account',
      path: ROUTES.ACCOUNT_WALLET,
      icon: AccountIcon,
      pathMatcherSubstring: '/account/',
    },
    {
      label: 'Settings',
      path: ROUTES.SETTINGS,
      icon: SettingsIcon,
    },
  ]

  return (
    <Drawer className={classes.drawer} variant="permanent" anchor="left" classes={{ paper: classes.drawerPaper }}>
      <Grid container direction="column" justifyContent="space-between" className={classes.root}>
        <Grid className={classes.logo}>
          <Link to={ROUTES.INFO}>
            <img alt="swarm" src={isBeeDesktop ? DesktopLogo : DashboardLogo} />
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
                iconStart={<DocsIcon className={classes.icon} />}
                iconEnd={<ExternalLinkIcon className={classes.icon} color="#595959" />}
                label={<span>Docs</span>}
              />
            </MUILink>
          </List>
        </Grid>
        <Grid>
          <List>
            <Link to={ROUTES.STATUS} className={classes.link}>
              <SideBarStatus path={ROUTES.STATUS} />
            </Link>
          </List>
        </Grid>
      </Grid>
    </Drawer>
  )
}
