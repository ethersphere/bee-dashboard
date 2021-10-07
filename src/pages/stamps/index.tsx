import { ReactElement, useContext, useEffect } from 'react'
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles'
import { Container, CircularProgress } from '@material-ui/core'

import StampsTable from './StampsTable'
import CreatePostageStampModal from './CreatePostageStampModal'

import { Context } from '../../providers/Stamps'

const useStyles = makeStyles((theme: Theme) =>
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
  const { stamps, isLoading, error, start, stop } = useContext(Context)
  useEffect(() => {
    start()

    return () => stop()
  }, [])

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
