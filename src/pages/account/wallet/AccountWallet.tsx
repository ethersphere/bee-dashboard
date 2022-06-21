import { Box, Grid, Typography } from '@material-ui/core'
import { ReactElement, useContext } from 'react'
import { useNavigate } from 'react-router'
import Download from 'remixicon-react/DownloadLineIcon'
import Gift from 'remixicon-react/GiftLineIcon'
import Link from 'remixicon-react/LinkIcon'
import ExpandableListItem from '../../../components/ExpandableListItem'
import ExpandableListItemActions from '../../../components/ExpandableListItemActions'
import ExpandableListItemKey from '../../../components/ExpandableListItemKey'
import { Loading } from '../../../components/Loading'
import { SwarmButton } from '../../../components/SwarmButton'
import { Context } from '../../../providers/Bee'
import { ROUTES } from '../../../routes'
import { AccountNavigation } from '../AccountNavigation'
import { Header } from '../Header'

export function AccountWallet(): ReactElement {
  const { balance, nodeAddresses } = useContext(Context)

  const navigate = useNavigate()

  function onCheckTransactions() {
    window.open(`https://blockscout.com/xdai/mainnet/address/${nodeAddresses?.ethereum}/transactions`, '_blank')
  }

  function onInvite() {
    navigate(ROUTES.ACCOUNT_INVITATIONS)
  }

  function onDeposit() {
    navigate(ROUTES.CONFIRMATION)
  }

  return (
    <>
      <Header />
      <AccountNavigation active="WALLET" />
      <Box mb={4}>
        <Grid container direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h2">Wallet balance</Typography>
          <SwarmButton onClick={onDeposit} iconType={Download}>
            Deposit
          </SwarmButton>
        </Grid>
      </Box>
      {balance && nodeAddresses ? (
        <>
          <Box mb={0.25}>
            <ExpandableListItemKey label="Node wallet address" value={nodeAddresses.ethereum} expanded />
          </Box>
          <Box mb={0.25}>
            <ExpandableListItem label="XDAI balance" value={`${balance.dai.toSignificantDigits(4)} XDAI`} />
          </Box>
          <Box mb={2}>
            <ExpandableListItem label="BZZ balance" value={`${balance.bzz.toSignificantDigits(4)} BZZ`} />
          </Box>
        </>
      ) : (
        <Box mb={8}>
          <Loading />
        </Box>
      )}
      <ExpandableListItemActions>
        <SwarmButton onClick={onCheckTransactions} iconType={Link}>
          Check transactions on Blockscout
        </SwarmButton>
        <SwarmButton onClick={onInvite} iconType={Gift}>
          Invite to Swarm...
        </SwarmButton>
      </ExpandableListItemActions>
    </>
  )
}
