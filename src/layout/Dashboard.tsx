import { CircularProgress, Container } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import React, { ReactElement, useContext } from 'react'
import ErrorBoundary from '../components/ErrorBoundary'
import SideBar from '../components/SideBar'
import { Context } from '../providers/Bee'
import config from '../config'
import * as Sentry from '@sentry/react'
import ItsBroken from './ItsBroken'

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
