import type { ReactElement } from 'react'

import DebugConnectionCheck from './SetupSteps/DebugConnectionCheck'
import NodeConnectionCheck from './SetupSteps/NodeConnectionCheck'
import VersionCheck from './SetupSteps/VersionCheck'
import EthereumConnectionCheck from './SetupSteps/EthereumConnectionCheck'
import ChequebookDeployFund from './SetupSteps/ChequebookDeployFund'
import PeerConnection from './SetupSteps/PeerConnection'

export default function NodeSetupWorkflow(): ReactElement {
  return (
    <div>
      <DebugConnectionCheck />
      <VersionCheck />
      <EthereumConnectionCheck />
      <ChequebookDeployFund />
      <NodeConnectionCheck />
      <PeerConnection />
    </div>
  )
}
