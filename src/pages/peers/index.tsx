import { Container, CircularProgress } from '@material-ui/core/'
import PeerTable from './PeerTable'
import TroubleshootConnectionCard from '../../components/TroubleshootConnectionCard'

import { useApiNodeTopology, useApiNodePeers, useDebugApiHealth } from '../../hooks/apiHooks'
import TopologyStats from '../../components/TopologyStats'

export default function Peers() {
  const topology = useApiNodeTopology()
  const debugHealth = useDebugApiHealth()
  const peers = useApiNodePeers()

  if (debugHealth.isLoadingNodeHealth) {
    return (
      <Container style={{ textAlign: 'center', padding: '50px' }}>
        <CircularProgress />
      </Container>
    )
  }

  if (debugHealth.error) {
    return <TroubleshootConnectionCard />
  }

  return (
    <>
      <TopologyStats {...topology} />
      <PeerTable {...peers} />
    </>
  )
}
