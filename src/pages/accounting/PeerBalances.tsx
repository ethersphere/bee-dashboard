import { BZZ } from '@ethersphere/bee-js'
import type { ReactElement } from 'react'
import CashoutModal from '../../components/CashoutModal'
import ExpandableList from '../../components/ExpandableList'
import ExpandableListItem from '../../components/ExpandableListItem'
import ExpandableListItemActions from '../../components/ExpandableListItemActions'
import ExpandableListItemKey from '../../components/ExpandableListItemKey'
import { Accounting } from '../../hooks/accounting'

interface Props {
  isLoadingUncashed: boolean
  totalUncashed: BZZ
  accounting: Accounting[] | null
}

export default function PeerBalances({ accounting, isLoadingUncashed, totalUncashed }: Props): ReactElement | null {
  const uncashedPeers = accounting?.filter(({ uncashedAmount }) => uncashedAmount.gt(BZZ.fromPLUR('0'))) || []

  return (
    <ExpandableList
      label={`Peers (${uncashedPeers.length})`}
      info={`${totalUncashed.toSignificantDigits(4)} xBZZ (uncashed)`}
    >
      <ExpandableListItem label="Uncashed Amount Total" value={`${totalUncashed.toSignificantDigits(4)} xBZZ`} />
      {uncashedPeers.map(({ peer, balance, received, sent, uncashedAmount, total }) => (
        <ExpandableList
          key={peer}
          label={`Peer ${peer.slice(0, 8)}[…]`}
          level={1}
          info={`${uncashedAmount.toSignificantDigits(4)} xBZZ (uncashed)`}
        >
          <ExpandableListItemKey label="Peer ID" value={peer} />
          <ExpandableListItem label="Outstanding Balance" value={`${balance.toSignificantDigits(4)} xBZZ`} />
          <ExpandableListItem
            label="Settlements Sent / Received"
            value={`-${sent.toSignificantDigits(4)} / ${received.toSignificantDigits(4)} xBZZ`}
          />
          <ExpandableListItem label="Total" value={`${total.toSignificantDigits(4)} xBZZ`} />
          <ExpandableListItem
            label="Uncashed Amount"
            value={isLoadingUncashed ? 'loading…' : `${uncashedAmount.toSignificantDigits(4)} xBZZ`}
          />
          {uncashedAmount.gt(BZZ.fromPLUR('0')) && (
            <ExpandableListItemActions>
              <CashoutModal uncashedAmount={uncashedAmount.toSignificantDigits(4)} peerId={peer} />
            </ExpandableListItemActions>
          )}
        </ExpandableList>
      ))}
    </ExpandableList>
  )
}
