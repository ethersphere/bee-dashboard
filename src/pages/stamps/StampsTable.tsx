import type { ReactElement } from 'react'
import ExpandableElement from '../../components/ExpandableElement'
import ExpandableList from '../../components/ExpandableList'
import ExpandableListItemKey from '../../components/ExpandableListItemKey'
import { EnrichedPostageBatch } from '../../providers/Stamps'
import { PostageStamp } from './PostageStamp'

interface Props {
  postageStamps: EnrichedPostageBatch[] | null
}

function StampsTable({ postageStamps }: Props): ReactElement | null {
  if (postageStamps === null) return null

  return (
    <ExpandableList label="Postage Stamps" defaultOpen>
      {postageStamps.map(stamp => (
        <ExpandableElement
          key={stamp.batchID}
          expandable={<ExpandableListItemKey label="Batch ID" value={stamp.batchID} />}
        >
          <PostageStamp stamp={stamp} shorten={true} />
        </ExpandableElement>
      ))}
    </ExpandableList>
  )
}

export default StampsTable
