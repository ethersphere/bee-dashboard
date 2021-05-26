import { ReactElement, useContext, useEffect } from 'react'
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles'
import { Container, CircularProgress, LinearProgress } from '@material-ui/core'

import StampsTable from './StampsTable'
import TroubleshootConnectionCard from '../../components/TroubleshootConnectionCard'
import CreatePostageStampModal from './CreatePostageStampModal'
import LastUpdate from '../../components/LastUpdate'

import { useApiHealth, useDebugApiHealth } from '../../hooks/apiHooks'
import { Context } from '../../providers/Stamps'
import { start } from 'node:repl'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      display: 'grid',
      rowGap: theme.spacing(2),
    },
  }),
)

export default function Accounting(): ReactElement {
  const classes = useStyles()

  const { health, isLoadingHealth } = useApiHealth()
  const { nodeHealth, isLoadingNodeHealth } = useDebugApiHealth()
  const { stamps, isLoading, error, lastUpdate, start, stop } = useContext(Context)
  useEffect(() => {
    start()

    return () => stop()
  }, [])

  if (isLoadingHealth || isLoadingNodeHealth) {
    return (
      <Container style={{ textAlign: 'center', padding: '50px' }}>
        <CircularProgress />
      </Container>
    )
  }

  if (nodeHealth?.status !== 'ok' || !health) return <TroubleshootConnectionCard />

  return (
    <div className={classes.root}>
      {error && (
        <Container style={{ textAlign: 'center', padding: '50px' }}>
          Error loading postage stamps details: {error.message}
        </Container>
      )}
      {!error && (
        <>
          <CreatePostageStampModal />
          <LastUpdate date={lastUpdate} />
          <div>
            <div style={{ height: '5px' }}>{isLoading && <LinearProgress />}</div>
            <StampsTable postageStamps={stamps} />
          </div>
        </>
      )}
    </div>
  )
}
