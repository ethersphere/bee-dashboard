import type { ReactElement } from 'react'

import ExpandableList from '../../components/ExpandableList'
import ExpandableListItem from '../../components/ExpandableListItem'
import ExpandableListItemKey from '../../components/ExpandableListItemKey'

import CashoutModal from '../../components/CashoutModal'
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
      info={`${totalUncashed.toFixedDecimal()} BZZ (uncashed)`}
    >
      <ExpandableListItem label="Uncashed Amount Total" value={`${totalUncashed.toFixedDecimal()} BZZ`} />
      {accounting?.map(({ peer, balance, received, sent, uncashedAmount, total }) => (
        <ExpandableList
          key={peer}
          label={`Peer ${peer.substr(0, 8)}[…]`}
          level={1}
          info={`${uncashedAmount.toFixedDecimal()} BZZ (uncashed)`}
        >
          <ExpandableListItemKey label="Peer ID" value={peer} />
          <ExpandableListItem label="Outstanding Balance" value={`${balance.toFixedDecimal()} BZZ`} />
          <ExpandableListItem
            label="Settlements Sent / Received"
            value={`-${sent.toFixedDecimal()} / ${received.toFixedDecimal()} BZZ`}
          />
          <ExpandableListItem label="Total" value={`${total.toFixedDecimal()} BZZ`} />
          <ExpandableListItem
            label="Uncashed Amount"
            value={isLoadingUncashed ? 'loading...' : `${uncashedAmount.toFixedDecimal()} BZZ`}
          />
          {uncashedAmount.toBigNumber.isGreaterThan('0') && (
            <CashoutModal uncashedAmount={uncashedAmount.toFixedDecimal()} peerId={peer} />
          )}
        </ExpandableList>
      ))}
    </ExpandableList>
  )
}
