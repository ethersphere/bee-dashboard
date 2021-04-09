import { ReactElement } from 'react'
import { Container, CircularProgress } from '@material-ui/core'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'

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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      display: 'grid',
      rowGap: theme.spacing(3),
    },
  }),
)

export default function Status(): ReactElement {
  const classes = useStyles()

  const nodeVersion = useStatusNodeVersion()
  const ethereumConnection = useStatusEthereumConnection()
  const debugApiConnection = useStatusDebugConnection()
  const apiConnection = useStatusConnection()
  const topology = useStatusTopology()
  const chequebook = useStatusChequebook()

  const checks = [nodeVersion, ethereumConnection, debugApiConnection, apiConnection, topology, chequebook]

  // If any check data are still loading
  if (!checks.every(c => !c.isLoading)) {
    return (
      <Container style={{ textAlign: 'center', padding: '50px' }}>
        <CircularProgress />
      </Container>
    )
  }

  return (
    <div className={classes.root}>
      <StatusCard
        userBeeVersion={nodeVersion.userVersion}
        latestBeeVersion={nodeVersion.latestVersion}
        isOk={checks.every(c => c.isOk)}
        nodeTopology={topology.topology}
        nodeAddresses={ethereumConnection.nodeAddresses}
      />
      {ethereumConnection.nodeAddresses && chequebook.chequebookAddress && (
        <EthereumAddressCard
          nodeAddresses={ethereumConnection.nodeAddresses}
          isLoadingNodeAddresses={ethereumConnection.isLoading}
          chequebookAddress={chequebook.chequebookAddress}
          isLoadingChequebookAddress={chequebook.isLoading}
        />
      )}
      <NodeSetupWorkflow
        nodeVersion={nodeVersion}
        ethereumConnection={ethereumConnection}
        debugApiConnection={debugApiConnection}
        apiConnection={apiConnection}
        topology={topology}
        chequebook={chequebook}
      />
    </div>
  )
}
