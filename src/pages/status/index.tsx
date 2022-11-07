import { Context } from '../../providers/Settings'
import { ReactElement, useContext } from 'react'

import DebugConnectionCheck from './SetupSteps/DebugConnectionCheck'
import DesktopConnection from './SetupSteps/DesktopConnectionCheck'
import NodeConnectionCheck from './SetupSteps/NodeConnectionCheck'
import VersionCheck from './SetupSteps/VersionCheck'
import EthereumConnectionCheck from './SetupSteps/EthereumConnectionCheck'
import ChequebookDeployFund from './SetupSteps/ChequebookDeployFund'
import PeerConnection from './SetupSteps/PeerConnection'

export default function NodeSetupWorkflow(): ReactElement {
  const { isDesktop } = useContext(Context)

  return (
    <div>
      {isDesktop && <DesktopConnection />}
      <NodeConnectionCheck />
      <DebugConnectionCheck />
      {!isDesktop && <VersionCheck />}
      <EthereumConnectionCheck />
      <ChequebookDeployFund />
      <PeerConnection />
    </div>
  )
}
