import type { ReactElement } from 'react'
import { EnrichedPostageBatch } from '../../providers/Stamps'
import ExpandableList from '../../components/ExpandableList'
import ExpandableListItem from '../../components/ExpandableListItem'
import ExpandableListItemKey from '../../components/ExpandableListItemKey'

interface Props {
  postageStamps: EnrichedPostageBatch[] | null
}

function StampsTable({ postageStamps }: Props): ReactElement | null {
  if (postageStamps === null) return null

  return (
    <ExpandableList label="Postage Stamps" defaultOpen>
      {postageStamps.map(({ batchID, usageText }) => (
        <ExpandableList key={batchID} label={`${batchID.substr(0, 8)}[…]`} level={1} info={`${usageText} used`}>
          <ExpandableListItemKey label="Batch ID" value={batchID} />
          <ExpandableListItem label="Usage" value={usageText} />
        </ExpandableList>
      ))}
    </ExpandableList>
  )
}

export default StampsTable
