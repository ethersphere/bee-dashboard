import { useContext, ReactElement } from 'react'
import ErrorBoundary from '../components/ErrorBoundary'
import AlertVersion from '../components/AlertVersion'
import { Container, CircularProgress } from '@material-ui/core'

import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'

import SideBar from '../components/SideBar'

import { Context } from '../providers/Bee'

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

  return (
    <div style={{ display: 'flex' }}>
      <SideBar />
      <Container className={classes.content}>
        <ErrorBoundary>
          <>
            <AlertVersion />
            {isLoading ? (
              <div style={{ textAlign: 'center', width: '100%' }}>
                <CircularProgress />
              </div>
            ) : (
              props.children
            )}
          </>
        </ErrorBoundary>
      </Container>
    </div>
  )
}

export default Dashboard
