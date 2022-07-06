import { Button, CircularProgress, Container, IconButton } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import React, { ReactElement, useContext, useEffect } from 'react'
import { useSnackbar } from 'notistack'
import CloseIcon from 'remixicon-react/CloseCircleLineIcon'
import ErrorBoundary from '../components/ErrorBoundary'
import SideBar from '../components/SideBar'
import { Context } from '../providers/Bee'
import config from '../config'
import * as Sentry from '@sentry/react'
import ItsBroken from './ItsBroken'
import { useIsBeeDesktop, useNewBeeDesktopVersion } from '../hooks/apiHooks'
import { BEE_DESKTOP_LATEST_RELEASE_PAGE } from '../utils/desktop'

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
}

const Dashboard = (props: Props): ReactElement => {
  const classes = useStyles()

  const { isLoading } = useContext(Context)
  const { isBeeDesktop } = useIsBeeDesktop()
  const { newBeeDesktopVersion } = useNewBeeDesktopVersion(isBeeDesktop)
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()

  useEffect(() => {
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

  let errorBoundaryWithContent

  if (config.SENTRY_KEY) {
    errorBoundaryWithContent = (
      <Sentry.ErrorBoundary
        showDialog
        fallback={({ error, componentStack, resetError }) => <ItsBroken message={error.message} />}
      >
        {content}
      </Sentry.ErrorBoundary>
    )
  } else {
    errorBoundaryWithContent = <ErrorBoundary>{content}</ErrorBoundary>
  }

  return (
    <div style={{ display: 'flex' }}>
      <SideBar />
      <Container className={classes.content}>{errorBoundaryWithContent}</Container>
    </div>
  )
}

export default Dashboard
