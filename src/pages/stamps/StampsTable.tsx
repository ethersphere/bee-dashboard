import { ReactElement, useContext } from 'react'
import TimerFlashFill from 'remixicon-react/TimerFlashFillIcon'
import TimerFlashLine from 'remixicon-react/TimerFlashLineIcon'
import ExpandableElement from '../../components/ExpandableElement'
import ExpandableList from '../../components/ExpandableList'
import ExpandableListItem from '../../components/ExpandableListItem'
import ExpandableListItemActions from '../../components/ExpandableListItemActions'
import ExpandableListItemKey from '../../components/ExpandableListItemKey'
import StampExtensionModal from '../../components/StampExtensionModal'
import { Context } from '../../providers/Settings'
import { EnrichedPostageBatch } from '../../providers/Stamps'
import { secondsToTimeString } from '../../utils'
import { getHumanReadableFileSize } from '../../utils/file'
import { PostageStamp } from './PostageStamp'

interface Props {
  postageStamps: EnrichedPostageBatch[] | null
}

function StampsTable({ postageStamps }: Props): ReactElement | null {
  const { beeDebugApi } = useContext(Context)

  if (!postageStamps || !beeDebugApi) {
    return null
  }

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
              <ExpandableListItem
                label="Expires in"
                value={stamp.batchTTL === -1 ? 'does not expire' : `${secondsToTimeString(stamp.batchTTL)}`}
              />
              <ExpandableListItem label="Label" value={stamp.label} />
              <ExpandableListItem label="Usable" value={stamp.usable ? 'yes' : 'no'} />
              <ExpandableListItem label="Exists" value={stamp.exists ? 'yes' : 'no'} />
              <ExpandableListItem label="Immutable" value={stamp.immutableFlag ? 'yes' : 'no'} />
              <ExpandableListItem label="Purchase Block Number" value={stamp.blockNumber} />
              <ExpandableListItemActions>
                <StampExtensionModal
                  type="Topup"
                  icon={<TimerFlashFill size="1rem" />}
                  beeDebug={beeDebugApi}
                  stamp={stamp.batchID}
                />
                <StampExtensionModal
                  type="Dilute"
                  icon={<TimerFlashLine size="1rem" />}
                  beeDebug={beeDebugApi}
                  stamp={stamp.batchID}
                />
              </ExpandableListItemActions>
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
