import type { ReactElement } from 'react'
import ExpandableList from '../../../components/ExpandableList'
import ExpandableListItem from '../../../components/ExpandableListItem'
import ExpandableListItemNote from '../../../components/ExpandableListItemNote'

type Props = StatusTopologyHook

export default function PeerConnection({ isOk, topology }: Props): ReactElement | null {
  return (
    <ExpandableList label={'Connection To Peers'}>
      <ExpandableListItemNote>
        {isOk ? 'You are connected to peers!' : 'Your node is not connected to any peers'}
      </ExpandableListItemNote>
      <ExpandableListItem label="Connected Peers" value={topology?.connected ? topology.connected : '-'} />
      <ExpandableListItem label="Discovered Peers" value={topology?.population ? topology.population : '-'} />
    </ExpandableList>
  )
}
