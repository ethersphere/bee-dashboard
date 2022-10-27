import { ReactElement, ReactNode, useContext } from 'react'
import ExpandableList from '../../../components/ExpandableList'
import ExpandableListItemNote from '../../../components/ExpandableListItemNote'
import TopologyStats from '../../../components/TopologyStats'
import StatusIcon from '../../../components/StatusIcon'
import { CheckState, Context } from '../../../providers/Bee'

export default function PeerConnection(): ReactElement | null {
  const { status, isLoading, topology } = useContext(Context)
  const { isEnabled, checkState } = status.topology
  const { checkState: debugApiCheckState } = status.debugApiConnection

  if (!isEnabled || debugApiCheckState === CheckState.ERROR) return null

  let text: ReactNode
  switch (checkState) {
    case CheckState.OK:
      text = 'You are connected to other Bee nodes'
      break

    // Both error state and warning state
    default:
      text =
        'Your node is not connected to any peers. Please wait a bit if you just started the node, otherwise review your configuration file.'
  }

  return (
    <ExpandableList
      label={
        <>
          <StatusIcon checkState={checkState} isLoading={isLoading} /> Connection to Peers
        </>
      }
    >
      <ExpandableListItemNote>{text}</ExpandableListItemNote>

      <TopologyStats topology={topology} />
    </ExpandableList>
  )
}
