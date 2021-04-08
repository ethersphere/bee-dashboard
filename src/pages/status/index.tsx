import { ReactElement } from 'react'
import { Container, CircularProgress } from '@material-ui/core'

import NodeSetupWorkflow from './NodeSetupWorkflow'
import StatusCard from './StatusCard'
import EthereumAddressCard from '../../components/EthereumAddressCard'
import {
  useStatusEthereumConnection,
  useStatusNodeVersion,
  useStatusDebugConnection,
  useStatusConnection,
  useStatusTopology,
  useStatusChequebook,
} from '../../hooks/status'

export default function Status(): ReactElement {
  const nodeVersion = useStatusNodeVersion()
  const ethereumConnection = useStatusEthereumConnection()
  const debugApiConnection = useStatusDebugConnection()
  const apiConnection = useStatusConnection()
  const topology = useStatusTopology()
  const chequebook = useStatusChequebook()

  if (
    nodeVersion.isLoading ||
    ethereumConnection.isLoading ||
    debugApiConnection.isLoading ||
    apiConnection.isLoading ||
    topology.isLoading ||
    chequebook.isLoading
  ) {
    return (
      <Container style={{ textAlign: 'center', padding: '50px' }}>
        <CircularProgress />
      </Container>
    )
  }

  return (
    <div>
      <StatusCard />
      {ethereumConnection.nodeAddresses && chequebook.chequebookAddress && (
        <EthereumAddressCard
          nodeAddresses={ethereumConnection.nodeAddresses}
          isLoadingNodeAddresses={ethereumConnection.isLoading}
          chequebookAddress={chequebook.chequebookAddress}
          isLoadingChequebookAddress={chequebook.isLoading}
        />
      )}
      <NodeSetupWorkflow />
    </div>
  )
}
