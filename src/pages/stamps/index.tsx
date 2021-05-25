import type { ReactElement } from 'react'
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles'
import { Container, CircularProgress } from '@material-ui/core'

import StampsTable from './StampsTable'
import TroubleshootConnectionCard from '../../components/TroubleshootConnectionCard'
import CreatePostageStampModal from './CreatePostageStampModal'

import { useApiHealth, useDebugApiHealth, useGetPostageStamps } from '../../hooks/apiHooks'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      display: 'grid',
      rowGap: theme.spacing(3),
    },
  }),
)

export default function Accounting(): ReactElement {
  const classes = useStyles()

  const { health, isLoadingHealth } = useApiHealth()
  const { nodeHealth, isLoadingNodeHealth } = useDebugApiHealth()
  const { postageStamps, isLoading, error } = useGetPostageStamps()

  if (isLoadingHealth || isLoadingNodeHealth || isLoading) {
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
          <StampsTable postageStamps={postageStamps} />
        </>
      )}
    </div>
  )
}
