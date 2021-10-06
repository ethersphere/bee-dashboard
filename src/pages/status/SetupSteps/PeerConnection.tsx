import { ReactElement, useContext } from 'react'
import ExpandableList from '../../../components/ExpandableList'
import ExpandableListItemNote from '../../../components/ExpandableListItemNote'
import TopologyStats from '../../../components/TopologyStats'
import StatusIcon from '../../../components/StatusIcon'
import { Context } from '../../../providers/Bee'

export default function PeerConnection(): ReactElement | null {
  const { status, isLoading, topology } = useContext(Context)
  const isOk = status.topology

  return (
    <ExpandableList
      label={
        <>
          <StatusIcon isOk={isOk} isLoading={isLoading} /> Connection to Peers
        </>
      }
    >
      <ExpandableListItemNote>
        {isOk
          ? 'You are connected to other Bee nodes'
          : 'Your node is not connected to any peers. Please wait a bit if you just started the node, otherwise review your configuration file.'}
      </ExpandableListItemNote>

      <TopologyStats topology={topology} />
    </ExpandableList>
  )
}
