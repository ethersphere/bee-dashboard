import type { ReactElement } from 'react'
import ExpandableElement from '../../components/ExpandableElement'
import ExpandableList from '../../components/ExpandableList'
import ExpandableListItem from '../../components/ExpandableListItem'
import ExpandableListItemKey from '../../components/ExpandableListItemKey'
import { EnrichedPostageBatch } from '../../providers/Stamps'
import { getHumanReadableFileSize } from '../../utils/file'
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
          expandable={
            <>
              <ExpandableListItemKey label="Batch ID" value={stamp.batchID} />
              <ExpandableListItem label="Depth" value={String(stamp.depth)} />
              <ExpandableListItem
                label="Capacity"
                value={`${getHumanReadableFileSize(2 ** stamp.depth * 4096 * stamp.usage)} / ${getHumanReadableFileSize(
                  2 ** stamp.depth * 4096,
                )}`}
              />
              <ExpandableListItem label="Amount" value={parseInt(stamp.amount, 10).toLocaleString()} />
            </>
          }
        >
          <PostageStamp stamp={stamp} shorten={true} />
        </ExpandableElement>
      ))}
    </ExpandableList>
  )
}

export default StampsTable
