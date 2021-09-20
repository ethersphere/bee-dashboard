import { ReactElement, useContext } from 'react'
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles'

import AccountCard from '../accounting/AccountCard'
import BalancesTable from './BalancesTable'
import EthereumAddressCard from '../../components/EthereumAddressCard'
import TroubleshootConnectionCard from '../../components/TroubleshootConnectionCard'
import { Context as BeeContext } from '../../providers/Bee'
import { Context as SettingsContext } from '../../providers/Settings'
import { useAccounting } from '../../hooks/accounting'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      display: 'grid',
      rowGap: theme.spacing(3),
    },
  }),
)

export default function Accounting(): ReactElement {
  const classes = useStyles()

  const { status, nodeAddresses, chequebookAddress, chequebookBalance, settlements, peerBalances } =
    useContext(BeeContext)
  const { beeDebugApi } = useContext(SettingsContext)

  const { accounting, isLoadingUncashed } = useAccounting(beeDebugApi, settlements, peerBalances)

  if (!status.all) return <TroubleshootConnectionCard />

  return (
    <div className={classes.root}>
      <AccountCard
        chequebookAddress={chequebookAddress}
        chequebookBalance={chequebookBalance}
        totalsent={settlements?.totalSent}
        totalreceived={settlements?.totalReceived}
      />
      <EthereumAddressCard nodeAddresses={nodeAddresses} chequebookAddress={chequebookAddress} />
      <BalancesTable accounting={accounting} isLoadingUncashed={isLoadingUncashed} />
    </div>
  )
}
