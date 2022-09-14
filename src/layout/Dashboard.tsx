import { Button, CircularProgress, Container, IconButton } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import React, { ReactElement, useContext, useEffect } from 'react'
import { useSnackbar } from 'notistack'
import CloseIcon from 'remixicon-react/CloseCircleLineIcon'
import ErrorBoundary from '../components/ErrorBoundary'
import SideBar from '../components/SideBar'
import { Context as BeeContext } from '../providers/Bee'
import { Context as SettingsContext } from '../providers/Settings'
import { useBeeDesktop, useNewBeeDesktopVersion } from '../hooks/apiHooks'
import { BEE_DESKTOP_LATEST_RELEASE_PAGE } from '../constants'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    content: {
      backgroundColor: theme.palette.background.default,
      minHeight: '100vh',
    },
  }),
)

interface Props {
  children?: ReactElement
  errorReporting?: (err: Error) => void
}

const Dashboard = (props: Props): ReactElement => {
  const classes = useStyles()

  const { isLoading, isLatestBeeVersion, latestBeeRelease, latestBeeVersionUrl, latestUserVersion } =
    useContext(BeeContext)
  const { isDesktop, desktopUrl } = useContext(SettingsContext)
  const { desktopAutoUpdateEnabled } = useBeeDesktop(isDesktop, desktopUrl)
  const { newBeeDesktopVersion } = useNewBeeDesktopVersion(isDesktop, desktopUrl, desktopAutoUpdateEnabled)
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()

  // New version of Bee client notification
  useEffect(() => {
    if (!isLoading && !isDesktop && !isLatestBeeVersion && latestBeeRelease && latestUserVersion) {
      enqueueSnackbar(`There is new Bee version ${latestBeeRelease?.name}!`, {
        variant: 'warning',
        preventDuplicate: true,
        key: 'beeNewVersion',
        persist: true,
        action: key => (
          <React.Fragment>
            <Button
              onClick={() => {
                window.open(latestBeeVersionUrl)
                closeSnackbar(key)
              }}
            >
              Download release
            </Button>
            <IconButton
              onClick={() => {
                closeSnackbar(key)
              }}
            >
              <CloseIcon />
            </IconButton>
          </React.Fragment>
        ),
      })
    }
  }, [
    closeSnackbar,
    enqueueSnackbar,
    isLatestBeeVersion,
    isDesktop,
    latestBeeRelease,
    latestBeeVersionUrl,
    isLoading,
    latestUserVersion,
  ])

  useEffect(() => {
    // When autoupdate is enabled then we leave the version check for the built-in Electron update mechanism
    if (desktopAutoUpdateEnabled) {
      return
    }

    if (newBeeDesktopVersion !== '') {
      enqueueSnackbar(`There is new Swarm Dashboard version ${newBeeDesktopVersion}!`, {
        variant: 'warning',
        preventDuplicate: true,
        key: 'desktopNewVersion',
        persist: true,
        action: key => (
          <React.Fragment>
            <Button
              onClick={() => {
                window.open(BEE_DESKTOP_LATEST_RELEASE_PAGE)
                closeSnackbar(key)
              }}
            >
              Download release
            </Button>
            <IconButton
              onClick={() => {
                closeSnackbar(key)
              }}
            >
              <CloseIcon />
            </IconButton>
          </React.Fragment>
        ),
      })
    }
  }, [enqueueSnackbar, closeSnackbar, newBeeDesktopVersion])

  const content = (
    <>
      {isLoading ? (
        <div style={{ textAlign: 'center', width: '100%' }}>
          <CircularProgress />
        </div>
      ) : (
        props.children
      )}
    </>
  )

  return (
    <div style={{ display: 'flex' }}>
      <SideBar />
      <Container className={classes.content}>
        {' '}
        <ErrorBoundary errorReporting={props.errorReporting}>{content}</ErrorBoundary>
      </Container>
    </div>
  )
}

export default Dashboard
