import { ReactElement } from 'react'

import { Container, CircularProgress } from '@material-ui/core'

import TroubleshootConnectionCard from '../../components/TroubleshootConnectionCard'
import { useApiHealth, useDebugApiHealth } from '../../hooks/apiHooks'
import Download from './Download'
import Upload from './Upload'
import TabsContainer from '../../components/TabsContainer'

export default function Files(): ReactElement {
  const { health, isLoadingHealth } = useApiHealth()
  const { nodeHealth, isLoadingNodeHealth } = useDebugApiHealth()

  if (isLoadingHealth || isLoadingNodeHealth) {
    return (
      <Container style={{ textAlign: 'center', padding: '50px' }}>
        <CircularProgress />
      </Container>
    )
  }

  if (!health || nodeHealth?.status !== 'ok') return <TroubleshootConnectionCard />

  return (
    <Container maxWidth="sm">
      <TabsContainer
        values={[
          {
            label: 'download',
            component: <Download />,
          },
          {
            label: 'upload',
            component: <Upload />,
          },
        ]}
      />
    </Container>
  )
}
