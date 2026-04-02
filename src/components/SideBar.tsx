import { BeeModes } from '@ethersphere/bee-js'
import { Box, Divider, Drawer, Grid, IconButton, Link as MUILink, List, Tooltip, Typography } from '@mui/material'
import { ReactElement, useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import FilesIcon from 'remixicon-react/ArrowUpDownLineIcon'
import DocsIcon from 'remixicon-react/BookOpenLineIcon'
import ExternalLinkIcon from 'remixicon-react/ExternalLinkLineIcon'
import FileManagerIcon from 'remixicon-react/FolderOpenLineIcon'
import GithubIcon from 'remixicon-react/GithubFillIcon'
import HomeIcon from 'remixicon-react/Home3LineIcon'
import MenuFoldIcon from 'remixicon-react/MenuFoldLineIcon'
import MenuUnfoldIcon from 'remixicon-react/MenuUnfoldLineIcon'
import SettingsIcon from 'remixicon-react/Settings2LineIcon'
import AccountIcon from 'remixicon-react/Wallet3LineIcon'
import { makeStyles } from 'tss-react/mui'

import DashboardLogo from '../assets/dashboard-logo.svg'
import DesktopLogo from '../assets/desktop-logo.svg'
import { BEE_DOCS_HOST, GITHUB_BEE_DASHBOARD_URL, GITHUB_BEE_DESKTOP_URL } from '../constants'
import { Context as BeeContext } from '../providers/Bee'
import { Context as SettingsContext } from '../providers/Settings'
import { ROUTES } from '../routes'

import SideBarItem from './SideBarItem'
import SideBarStatus from './SideBarStatus'

const drawerWidth = 300
const drawerWidthCollapsed = 72
const drawerHeaderHeight = 56

const useStyles = makeStyles()(theme => ({
  root: {
    flexWrap: 'nowrap',
    minHeight: `calc(100vh - ${drawerHeaderHeight}px)`,
    paddingBottom: theme.spacing(8),
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerCollapsed: {
    width: drawerWidthCollapsed,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: '#212121',
    zIndex: 988,
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperCollapsed: {
    width: drawerWidthCollapsed,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    height: drawerHeaderHeight,
    borderBottom: '1px solid #2c2c2c',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    flexShrink: 0,
  },
  logo: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    overflow: 'hidden',
  },
  logoImg: {
    maxWidth: '100%',
    display: 'block',
  },
  toggleButton: {
    color: '#9f9f9f',
    '&:hover': {
      color: '#f9f9f9',
      backgroundColor: '#2c2c2c',
    },
  },
  toggleButtonCollapsed: {
    marginLeft: 'auto',
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
}))

export default function SideBar(): ReactElement {
  const { classes } = useStyles()
  const { isDesktop } = useContext(SettingsContext)
  const { nodeInfo } = useContext(BeeContext)
  const [isCollapsed, setIsCollapsed] = useState(false)

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
      label: 'File Manager',
      path: ROUTES.FILEMANAGER,
      icon: FileManagerIcon,
      pathMatcherSubstring: '/filemanager',
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
    <Drawer
      className={`${classes.drawer} ${isCollapsed ? classes.drawerCollapsed : ''}`}
      variant="permanent"
      anchor="left"
      classes={{ paper: `${classes.drawerPaper} ${isCollapsed ? classes.drawerPaperCollapsed : ''}` }}
    >
      <div className={classes.header}>
        {!isCollapsed && (
          <Link to={ROUTES.INFO} className={classes.logo}>
            <img alt="swarm" className={classes.logoImg} src={isDesktop ? DesktopLogo : DashboardLogo} />
          </Link>
        )}
        <Tooltip title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'} placement="right">
          <IconButton
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`${classes.toggleButton} ${isCollapsed ? classes.toggleButtonCollapsed : ''}`}
          >
            {isCollapsed ? <MenuUnfoldIcon /> : <MenuFoldIcon />}
          </IconButton>
        </Tooltip>
      </div>
      <Grid container direction="column" justifyContent="space-between" className={classes.root}>
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
                  isCollapsed={isCollapsed}
                />
              </Link>
            ))}
          </List>
          <Divider className={classes.divider} />
          <List>
            <MUILink href={BEE_DOCS_HOST} target="_blank" className={classes.link}>
              <SideBarItem
                iconStart={<DocsIcon className={classes.icon} />}
                iconEnd={!isCollapsed ? <ExternalLinkIcon className={classes.icon} color="#595959" /> : undefined}
                label={<span>Docs</span>}
                isCollapsed={isCollapsed}
              />
            </MUILink>
          </List>
          <Divider className={classes.divider} />
          <List>
            <MUILink
              href={isDesktop ? GITHUB_BEE_DESKTOP_URL : GITHUB_BEE_DASHBOARD_URL}
              target="_blank"
              className={classes.link}
            >
              <SideBarItem
                iconStart={<GithubIcon className={classes.icon} />}
                iconEnd={!isCollapsed ? <ExternalLinkIcon className={classes.icon} color="#595959" /> : undefined}
                label={<span>GitHub</span>}
                isCollapsed={isCollapsed}
              />
            </MUILink>
          </List>
          <Divider className={classes.divider} />
          {!isCollapsed && (
            <Box mt={4}>
              <Link to={ROUTES.TOP_UP_GIFT_CODE}>
                <Typography align="center">Redeem gift code</Typography>
              </Link>
            </Box>
          )}
        </Grid>
        <Grid>
          <List>
            <Link to={ROUTES.STATUS} className={classes.link}>
              <SideBarStatus path={ROUTES.STATUS} isCollapsed={isCollapsed} />
            </Link>
          </List>
        </Grid>
      </Grid>
    </Drawer>
  )
}
