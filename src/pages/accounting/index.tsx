import { ReactElement, useContext } from 'react'

import BalancesTable from './BalancesTable'
import EthereumAddressCard from '../../components/EthereumAddressCard'
import TroubleshootConnectionCard from '../../components/TroubleshootConnectionCard'
import { Context as BeeContext } from '../../providers/Bee'
import { Context as SettingsContext } from '../../providers/Settings'
import { useAccounting } from '../../hooks/accounting'
import ExpandableList from '../../components/ExpandableList'
import ExpandableListItem from '../../components/ExpandableListItem'
import ExpandableListItemKey from '../../components/ExpandableListItemKey'
import WithdrawModal from '../../containers/WithdrawModal'
import DepositModal from '../../containers/DepositModal'

export default function Accounting(): ReactElement {
  const { status, nodeAddresses, chequebookAddress, chequebookBalance, settlements, peerBalances } =
    useContext(BeeContext)
  const { beeDebugApi } = useContext(SettingsContext)

  const { accounting, isLoadingUncashed } = useAccounting(beeDebugApi, settlements, peerBalances)

  if (!status.all) return <TroubleshootConnectionCard />

  return (
    <div>
      <ExpandableList
        label="Chequebook"
        defaultOpen
        actions={
          <div style={{ display: 'flex' }}>
            <WithdrawModal />
            <DepositModal />
          </div>
        }
      >
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
      </ExpandableList>
      <ExpandableList label="Blockchain" defaultOpen>
        <ExpandableListItemKey label="Ethereum address" value={nodeAddresses?.ethereum || ''} />
        <ExpandableListItemKey label="Chequebook contract address" value={chequebookAddress?.chequebookAddress || ''} />
      </ExpandableList>
      <ExpandableList label="Peers" defaultOpen>
        <BalancesTable accounting={accounting} isLoadingUncashed={isLoadingUncashed} />
      </ExpandableList>
    </div>
  )
}
