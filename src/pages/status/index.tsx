import { useState, useEffect, ReactElement } from 'react'
import { Container, CircularProgress } from '@material-ui/core'

import NodeSetupWorkflow from './NodeSetupWorkflow'
import StatusCard from './StatusCard'
import EthereumAddressCard from '../../components/EthereumAddressCard'
import {
  useApiHealth,
  useDebugApiHealth,
  useApiNodeAddresses,
  useApiChequebookAddress,
  useApiNodeTopology,
  useApiChequebookBalance,
  useLatestBeeRelease,
} from '../../hooks/apiHooks'

export default function Status(): ReactElement {
  const [apiHost, setApiHost] = useState('')
  const [debugApiHost, setDebugApiHost] = useState('')

  const [statusChecksVisible, setStatusChecksVisible] = useState<boolean>(false)

  const { health, isLoadingHealth } = useApiHealth()
  const { nodeHealth, isLoadingNodeHealth } = useDebugApiHealth()
  const { nodeAddresses, isLoadingNodeAddresses } = useApiNodeAddresses()
  const { chequebookAddress, isLoadingChequebookAddress } = useApiChequebookAddress()
  const { topology: nodeTopology, isLoading: isLoadingNodeTopology } = useApiNodeTopology()
  const { chequebookBalance, isLoadingChequebookBalance } = useApiChequebookBalance()
  const { latestBeeRelease, isLoadingLatestBeeRelease } = useLatestBeeRelease()

  const fetchApiHost = () => {
    let apiHost

    if (sessionStorage.getItem('api_host')) {
      apiHost = String(sessionStorage.getItem('api_host') || '')
    } else {
      apiHost = String(process.env.REACT_APP_BEE_HOST)
    }
    setApiHost(apiHost)
  }

  const fetchDebugApiHost = () => {
    let debugApiHost

    if (sessionStorage.getItem('debug_api_host')) {
      debugApiHost = String(sessionStorage.getItem('debug_api_host') || '')
    } else {
      debugApiHost = String(process.env.REACT_APP_BEE_DEBUG_HOST)
    }
    setDebugApiHost(debugApiHost)
  }

  useEffect(() => {
    fetchApiHost()
    fetchDebugApiHost()
  }, [])

  if (
    isLoadingNodeHealth ||
    isLoadingHealth ||
    isLoadingChequebookAddress ||
    isLoadingNodeTopology ||
    isLoadingNodeAddresses ||
    isLoadingLatestBeeRelease ||
    isLoadingChequebookBalance
  ) {
    return (
      <Container style={{ textAlign: 'center', padding: '50px' }}>
        <CircularProgress />
      </Container>
    )
  }

  if (
    nodeHealth?.status === 'ok' &&
    health &&
    latestBeeRelease?.name === `v${nodeHealth?.version?.split('-')[0]}` &&
    nodeAddresses?.ethereum &&
    chequebookAddress?.chequebookaddress &&
    chequebookBalance &&
    chequebookBalance?.totalBalance > 0 &&
    nodeTopology?.connected &&
    nodeTopology?.connected > 0 &&
    !statusChecksVisible
  ) {
    return (
      <div>
        <StatusCard
          nodeHealth={nodeHealth}
          loadingNodeHealth={isLoadingNodeHealth}
          beeRelease={latestBeeRelease}
          loadingBeeRelease={isLoadingLatestBeeRelease}
          nodeAddresses={nodeAddresses}
          loadingNodeTopology={isLoadingNodeTopology}
          nodeTopology={nodeTopology}
          setStatusChecksVisible={setStatusChecksVisible}
        />
        <EthereumAddressCard
          nodeAddresses={nodeAddresses}
          isLoadingNodeAddresses={isLoadingNodeAddresses}
          chequebookAddress={chequebookAddress}
          isLoadingChequebookAddress={isLoadingChequebookAddress}
        />
      </div>
    )
  }

  return (
    <NodeSetupWorkflow
      beeRelease={latestBeeRelease}
      isLoadingBeeRelease={isLoadingLatestBeeRelease}
      nodeHealth={nodeHealth}
      isLoadingNodeHealth={isLoadingNodeHealth}
      nodeAddresses={nodeAddresses}
      isLoadingNodeAddresses={isLoadingNodeAddresses}
      nodeTopology={nodeTopology}
      isLoadingNodeTopology={isLoadingNodeTopology}
      nodeApiHealth={health}
      isLoadingHealth={isLoadingHealth}
      chequebookAddress={chequebookAddress}
      isLoadingChequebookAddress={isLoadingChequebookAddress}
      chequebookBalance={chequebookBalance}
      isLoadingChequebookBalance={isLoadingChequebookBalance}
      apiHost={apiHost}
      debugApiHost={debugApiHost}
      setStatusChecksVisible={setStatusChecksVisible}
    />
  )
}
