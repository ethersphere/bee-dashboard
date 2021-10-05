import { ReactElement, useContext } from 'react'

import DebugConnectionCheck from './SetupSteps/DebugConnectionCheck'
import NodeConnectionCheck from './SetupSteps/NodeConnectionCheck'
import VersionCheck from './SetupSteps/VersionCheck'
import EthereumConnectionCheck from './SetupSteps/EthereumConnectionCheck'
import ChequebookDeployFund from './SetupSteps/ChequebookDeployFund'
import PeerConnection from './SetupSteps/PeerConnection'
import { Context } from '../../providers/Bee'

export default function NodeSetupWorkflow(): ReactElement {
  const {
    status,
    isLoading,
    latestUserVersion,
    latestPublishedVersion,
    isLatestBeeVersion,
    latestBeeVersionUrl,
    topology,
    nodeAddresses,
    chequebookAddress,
  } = useContext(Context)

  return (
    <>
      <DebugConnectionCheck isOk={status.debugApiConnection} />
      <VersionCheck
        isOk={status.version}
        isLatestBeeVersion={isLatestBeeVersion}
        userVersion={latestUserVersion}
        latestVersion={latestPublishedVersion}
        latestUrl={latestBeeVersionUrl}
      />
      <EthereumConnectionCheck isOk={status.blockchainConnection} nodeAddresses={nodeAddresses} />
      <ChequebookDeployFund chequebookAddress={chequebookAddress?.chequebookAddress} isOk={status.chequebook} />
      <NodeConnectionCheck isOk={status.apiConnection} />
      <PeerConnection isOk={status.topology} topology={topology} />
    </>
  )
}
