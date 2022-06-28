import type { ReactElement } from 'react'
import CashoutModal from '../../components/CashoutModal'
import ExpandableList from '../../components/ExpandableList'
import ExpandableListItem from '../../components/ExpandableListItem'
import ExpandableListItemActions from '../../components/ExpandableListItemActions'
import ExpandableListItemKey from '../../components/ExpandableListItemKey'
import { Accounting } from '../../hooks/accounting'
import type { Token } from '../../models/Token'

interface Props {
  isLoadingUncashed: boolean
  totalUncashed: Token
  accounting: Accounting[] | null
}

export default function PeerBalances({ accounting, isLoadingUncashed, totalUncashed }: Props): ReactElement | null {
  return (
    <ExpandableList
      label={`Peers (${accounting?.length || 0})`}
      info={`${totalUncashed.toFixedDecimal()} xBZZ (uncashed)`}
    >
      <ExpandableListItem label="Uncashed Amount Total" value={`${totalUncashed.toFixedDecimal()} xBZZ`} />
      {accounting?.map(({ peer, balance, received, sent, uncashedAmount, total }) => (
        <ExpandableList
          key={peer}
          label={`Peer ${peer.slice(0, 8)}[…]`}
          level={1}
          info={`${uncashedAmount.toFixedDecimal()} xBZZ (uncashed)`}
        >
          <ExpandableListItemKey label="Peer ID" value={peer} />
          <ExpandableListItem label="Outstanding Balance" value={`${balance.toFixedDecimal()} xBZZ`} />
          <ExpandableListItem
            label="Settlements Sent / Received"
            value={`-${sent.toFixedDecimal()} / ${received.toFixedDecimal()} xBZZ`}
          />
          <ExpandableListItem label="Total" value={`${total.toFixedDecimal()} xBZZ`} />
          <ExpandableListItem
            label="Uncashed Amount"
            value={isLoadingUncashed ? 'loading…' : `${uncashedAmount.toFixedDecimal()} xBZZ`}
          />
          {uncashedAmount.toBigNumber.isGreaterThan('0') && (
            <ExpandableListItemActions>
              <CashoutModal uncashedAmount={uncashedAmount.toFixedDecimal()} peerId={peer} />
            </ExpandableListItemActions>
          )}
        </ExpandableList>
      ))}
    </ExpandableList>
  )
}
