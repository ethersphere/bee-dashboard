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
      marginLeft: '240px',
      flexGrow: 1,
      backgroundColor: theme.palette.background.default,
      padding: theme.spacing(3),
      paddingBottom: '65px',
    },
  }),
)

interface Props {
  children?: ReactElement
}

const Dashboard = (props: Props): ReactElement => {
  const classes = useStyles()

  const { isLoading, status } = useContext(Context)

  return (
    <div>
      <SideBar isOk={status.all} />
      <ErrorBoundary>
        <main className={classes.content}>
          <AlertVersion />
          {isLoading ? (
            <Container style={{ textAlign: 'center', padding: '50px' }}>
              <CircularProgress />
            </Container>
          ) : (
            props.children
          )}
        </main>
      </ErrorBoundary>
    </div>
  )
}

export default Dashboard
