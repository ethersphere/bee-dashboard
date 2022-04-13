import { ReactElement, useContext } from 'react'

import PeerBalances from './PeerBalances'
import TroubleshootConnectionCard from '../../components/TroubleshootConnectionCard'
import { CheckState, Context as BeeContext } from '../../providers/Bee'
import { Context as SettingsContext } from '../../providers/Settings'
import { useAccounting } from '../../hooks/accounting'
import ExpandableList from '../../components/ExpandableList'
import ExpandableListItem from '../../components/ExpandableListItem'
import ExpandableListItemActions from '../../components/ExpandableListItemActions'
import ExpandableListItemKey from '../../components/ExpandableListItemKey'
import WithdrawModal from '../../containers/WithdrawModal'
import DepositModal from '../../containers/DepositModal'

export default function Accounting(): ReactElement {
  const { status, nodeAddresses, chequebookAddress, chequebookBalance, settlements, peerBalances } =
    useContext(BeeContext)
  const { beeDebugApi } = useContext(SettingsContext)

  const { accounting, totalUncashed, isLoadingUncashed } = useAccounting(beeDebugApi, settlements, peerBalances)

  if (status.all === CheckState.ERROR) return <TroubleshootConnectionCard />

  return (
    <div>
      <ExpandableList label="Chequebook" defaultOpen>
        <ExpandableListItem label="Total Balance" value={`${chequebookBalance?.totalBalance.toFixedDecimal()} BZZ`} />
        <ExpandableListItem
          label="Available Uncommitted Balance"
          value={`${chequebookBalance?.availableBalance.toFixedDecimal()} BZZ`}
        />
        <ExpandableListItem
          label="Total Cheques Amount Sent"
          value={`${settlements?.totalSent.toFixedDecimal()} BZZ`}
        />
        <ExpandableListItem
          label="Total Cheques Amount Received"
          value={`${settlements?.totalReceived.toFixedDecimal()} BZZ`}
        />
        <ExpandableListItemActions>
          <WithdrawModal />
          <DepositModal />
        </ExpandableListItemActions>
      </ExpandableList>
      <ExpandableList label="Blockchain" defaultOpen>
        <ExpandableListItemKey label="Ethereum address" value={nodeAddresses?.ethereum || ''} />
        <ExpandableListItemKey label="Chequebook contract address" value={chequebookAddress?.chequebookAddress || ''} />
      </ExpandableList>
      <PeerBalances accounting={accounting} isLoadingUncashed={isLoadingUncashed} totalUncashed={totalUncashed} />
    </div>
  )
}
