import { ReactElement, useContext } from 'react'
import ExpandableList from '../../../components/ExpandableList'
import ExpandableListItem from '../../../components/ExpandableListItem'
import ExpandableListItemNote from '../../../components/ExpandableListItemNote'
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
        {isOk ? 'You are connected to peers!' : 'Your node is not connected to any peers'}
      </ExpandableListItemNote>
      <ExpandableListItem label="Connected Peers" value={topology?.connected ? topology.connected : '-'} />
      <ExpandableListItem label="Discovered Peers" value={topology?.population ? topology.population : '-'} />
    </ExpandableList>
  )
}
