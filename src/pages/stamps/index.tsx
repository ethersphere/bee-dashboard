import { Button, CircularProgress, Container } from '@material-ui/core'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { ReactElement, useContext, useEffect, useState } from 'react'
import { PlusSquare } from 'react-feather'
import TroubleshootConnectionCard from '../../components/TroubleshootConnectionCard'
import { Context as BeeContext } from '../../providers/Bee'
import { Context as StampsContext } from '../../providers/Stamps'
import { CreatePostageStampModal } from './CreatePostageStampModal'
import StampsTable from './StampsTable'

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

export default function Stamp(): ReactElement {
  const classes = useStyles()

  const [isBuyingStamp, setBuyingStamp] = useState(false)

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
            {isBuyingStamp ? (
              <CreatePostageStampModal onClose={() => setBuyingStamp(false)} />
            ) : (
              <Button
                onClick={() => setBuyingStamp(true)}
                variant="contained"
                startIcon={<PlusSquare size="1.25rem" color="#dd7700" />}
              >
                Buy New Postage Stamp
              </Button>
            )}
            <div style={{ height: '5px' }}>{isLoading && <CircularProgress />}</div>
          </div>
          <StampsTable postageStamps={stamps} />
        </>
      )}
    </div>
  )
}
