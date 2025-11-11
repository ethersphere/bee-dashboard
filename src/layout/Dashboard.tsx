import { Button, CircularProgress, Container, IconButton } from '@material-ui/core'
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles'
import { useSnackbar } from 'notistack'
import React, { ReactElement, useContext, useEffect } from 'react'
import CloseIcon from 'remixicon-react/CloseCircleLineIcon'
import ErrorBoundary from '../components/ErrorBoundary'
import { Flex } from '../components/Flex'
import SideBar from '../components/SideBar'
import { BEE_DESKTOP_LATEST_RELEASE_PAGE } from '../constants'
import { useBeeDesktop, useNewBeeDesktopVersion } from '../hooks/apiHooks'
import { Context as BeeContext } from '../providers/Bee'
import { Context as SettingsContext } from '../providers/Settings'
import { useLocation } from 'react-router-dom'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    content: {
      backgroundColor: theme.palette.background.default,
      minHeight: '100vh',
    },

    fileManagerOn: {
      padding: '0px',
    },
  }),
)

interface Props {
  children?: ReactElement
  errorReporting?: (err: Error) => void
}

const Dashboard = (props: Props): ReactElement => {
  const location = useLocation()

  const isFileManagerOn = location.pathname.startsWith('/filemanager')
  const classes = useStyles()

  const { isLoading } = useContext(BeeContext)
  const { isDesktop, desktopUrl } = useContext(SettingsContext)
  const { desktopAutoUpdateEnabled } = useBeeDesktop(isDesktop, desktopUrl)
  const { newBeeDesktopVersion } = useNewBeeDesktopVersion(isDesktop, desktopUrl, desktopAutoUpdateEnabled)
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()

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
  }, [enqueueSnackbar, closeSnackbar, newBeeDesktopVersion, desktopAutoUpdateEnabled])

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
    <Flex>
      <SideBar />
      <Container className={`${classes.content} ${isFileManagerOn ? classes.fileManagerOn : ''}`}>
        {' '}
        <ErrorBoundary errorReporting={props.errorReporting}>{content}</ErrorBoundary>
      </Container>
    </Flex>
  )
}

export default Dashboard
