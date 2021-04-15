import type { ReactElement } from 'react'
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles'
import { Container, CircularProgress } from '@material-ui/core'

import AccountCard from '../accounting/AccountCard'
import BalancesTable from './BalancesTable'
import EthereumAddressCard from '../../components/EthereumAddressCard'
import TroubleshootConnectionCard from '../../components/TroubleshootConnectionCard'

import {
  useApiNodeAddresses,
  useApiChequebookAddress,
  useApiChequebookBalance,
  useApiHealth,
  useDebugApiHealth,
} from '../../hooks/apiHooks'
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

  const { chequebookAddress, isLoadingChequebookAddress } = useApiChequebookAddress()
  const { chequebookBalance, isLoadingChequebookBalance } = useApiChequebookBalance()
  const { nodeAddresses, isLoadingNodeAddresses } = useApiNodeAddresses()
  const { health, isLoadingHealth } = useApiHealth()
  const { nodeHealth, isLoadingNodeHealth } = useDebugApiHealth()
  const { isLoading, totalsent, totalreceived, accounting, isLoadingUncashed } = useAccounting()

  if (isLoadingHealth || isLoadingNodeHealth) {
    return (
      <Container style={{ textAlign: 'center', padding: '50px' }}>
        <CircularProgress />
      </Container>
    )
  }

  if (nodeHealth?.status !== 'ok' || !health) return <TroubleshootConnectionCard />

  return (
    <div className={classes.root}>
      <AccountCard
        chequebookAddress={chequebookAddress}
        isLoading={isLoadingChequebookAddress || isLoading || isLoadingChequebookBalance}
        chequebookBalance={chequebookBalance}
        totalsent={totalsent}
        totalreceived={totalreceived}
      />
      <EthereumAddressCard
        nodeAddresses={nodeAddresses}
        isLoadingNodeAddresses={isLoadingNodeAddresses}
        chequebookAddress={chequebookAddress}
        isLoadingChequebookAddress={isLoadingChequebookAddress}
      />
      <BalancesTable accounting={accounting} isLoadingUncashed={isLoadingUncashed} />
    </div>
  )
}
