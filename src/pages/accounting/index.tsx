import { ReactElement, useContext } from 'react'
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles'
import { Container } from '@material-ui/core'

import AccountCard from '../accounting/AccountCard'
import BalancesTable from './BalancesTable'
import EthereumAddressCard from '../../components/EthereumAddressCard'
import TroubleshootConnectionCard from '../../components/TroubleshootConnectionCard'
import { Context } from '../../providers/Bee'
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

  const { status, nodeAddresses, chequebookAddress, chequebookBalance, settlements } = useContext(Context)

  const { accounting, isLoadingUncashed, error } = useAccounting()

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
      {error && (
        <Container style={{ textAlign: 'center', padding: '50px' }}>
          Error loading accounting details: {error.message}
        </Container>
      )}
      {!error && <BalancesTable accounting={accounting} isLoadingUncashed={isLoadingUncashed} />}
    </div>
  )
}
