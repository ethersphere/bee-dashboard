import { ReactElement, useContext } from 'react'
import ExpandableList from '../../../components/ExpandableList'
import ExpandableListItem from '../../../components/ExpandableListItem'
import ExpandableListItemActions from '../../../components/ExpandableListItemActions'
import ExpandableListItemKey from '../../../components/ExpandableListItemKey'
import TroubleshootConnectionCard from '../../../components/TroubleshootConnectionCard'
import DepositModal from '../../../containers/DepositModal'
import WithdrawModal from '../../../containers/WithdrawModal'
import { useAccounting } from '../../../hooks/accounting'
import { CheckState, Context as BeeContext } from '../../../providers/Bee'
import { Context as SettingsContext } from '../../../providers/Settings'
import PeerBalances from '../../accounting/PeerBalances'
import { AccountNavigation } from '../AccountNavigation'
import { Header } from '../Header'
import { Box } from '@material-ui/core'

export function AccountChequebook(): ReactElement {
  const { status, nodeAddresses, chequebookAddress, chequebookBalance, settlements, peerBalances } =
    useContext(BeeContext)
  const { beeDebugApi } = useContext(SettingsContext)

  const { accounting, totalUncashed, isLoadingUncashed } = useAccounting(beeDebugApi, settlements, peerBalances)

  if (status.all === CheckState.ERROR) return <TroubleshootConnectionCard />

  const showChequebook = chequebookBalance?.totalBalance !== undefined

  return (
    <>
      <Header />
      <AccountNavigation active="CHEQUEBOOK" />
      <div>
        {showChequebook && (
          <ExpandableList label="Chequebook" defaultOpen>
            <ExpandableListItem
              label="Total Balance"
              value={`${chequebookBalance?.totalBalance.toFixedDecimal()} xBZZ`}
            />
            <ExpandableListItem
              label="Available Uncommitted Balance"
              value={`${chequebookBalance?.availableBalance.toFixedDecimal()} xBZZ`}
            />
            <ExpandableListItem
              label="Total Cheques Amount Sent"
              value={`${settlements?.totalSent.toFixedDecimal()} xBZZ`}
            />
            <Box mb={2}>
              <ExpandableListItem
                label="Total Cheques Amount Received"
                value={`${settlements?.totalReceived.toFixedDecimal()} xBZZ`}
              />
            </Box>
            <ExpandableListItemActions>
              <WithdrawModal />
              <DepositModal />
            </ExpandableListItemActions>
          </ExpandableList>
        )}
        <ExpandableList label="Blockchain" defaultOpen>
          <ExpandableListItemKey label="Ethereum address" value={nodeAddresses?.ethereum || ''} />
          <ExpandableListItemKey
            label="Chequebook contract address"
            value={chequebookAddress?.chequebookAddress || ''}
          />
        </ExpandableList>
        <PeerBalances accounting={accounting} isLoadingUncashed={isLoadingUncashed} totalUncashed={totalUncashed} />
      </div>
    </>
  )
}
