import { ReactElement, useContext, useEffect } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { Container, CircularProgress } from '@material-ui/core'

import StampsTable from './StampsTable'
import CreatePostageStampModal from './CreatePostageStampModal'

import { Context as StampsContext } from '../../providers/Stamps'
import TroubleshootConnectionCard from '../../components/TroubleshootConnectionCard'
import { Context as BeeContext } from '../../providers/Bee'

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      width: '100%',
      display: 'grid',
    },
    actions: {
      display: 'flex',
      width: '100%',
      flex: '0 1 auto',
      flexWrap: 'wrap',
      alignItems: 'center',
    },
  }),
)

export default function Accounting(): ReactElement {
  const classes = useStyles()
  const { stamps, isLoading, error, start, stop } = useContext(StampsContext)
  const { status } = useContext(BeeContext)

  useEffect(() => {
    if (!status.all) return
    start()

    return () => stop()
  }, [status]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!status.all) return <TroubleshootConnectionCard />

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
            <div style={{ height: '5px' }}>{isLoading && <CircularProgress />}</div>
          </div>
          <StampsTable postageStamps={stamps} />
        </>
      )}
    </div>
  )
}
