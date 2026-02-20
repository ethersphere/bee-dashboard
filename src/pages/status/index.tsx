import { ReactElement, useContext } from 'react'

import { Context } from '../../providers/Settings'

import ChequebookDeployFund from './SetupSteps/ChequebookDeployFund'
import DesktopConnection from './SetupSteps/DesktopConnectionCheck'
import NodeConnectionCheck from './SetupSteps/NodeConnectionCheck'
import PeerConnection from './SetupSteps/PeerConnection'

export default function NodeSetupWorkflow(): ReactElement {
  const { isDesktop } = useContext(Context)

  return (
    <div>
      {isDesktop && <DesktopConnection />}
      <NodeConnectionCheck />
      <ChequebookDeployFund />
      <PeerConnection />
    </div>
  )
}
