import { ReactElement, useContext, useEffect } from 'react'
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles'
import { Container, CircularProgress } from '@material-ui/core'

import StampsTable from './StampsTable'
import TroubleshootConnectionCard from '../../components/TroubleshootConnectionCard'
import CreatePostageStampModal from './CreatePostageStampModal'
import LastUpdate from '../../components/LastUpdate'

import { useApiHealth, useDebugApiHealth } from '../../hooks/apiHooks'
import { Context } from '../../providers/Stamps'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      display: 'grid',
      rowGap: theme.spacing(2),
    },
    actions: {
      display: 'flex',
      width: '100%',
      columnGap: theme.spacing(1),
      rowGap: theme.spacing(1),
      flex: '0 1 auto',
      flexWrap: 'wrap',
      alignItems: 'center',
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
          <div className={classes.actions}>
            <CreatePostageStampModal />
            <LastUpdate date={lastUpdate} />
            <div style={{ height: '5px' }}>{isLoading && <CircularProgress />}</div>
          </div>
          <StampsTable postageStamps={stamps} />
        </>
      )}
    </div>
  )
}
