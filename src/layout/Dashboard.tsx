import { CircularProgress, Container } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { ReactElement, useContext } from 'react'
import AlertVersion from '../components/AlertVersion'
import ErrorBoundary from '../components/ErrorBoundary'
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
