import { Box, Typography } from '@material-ui/core'
import { ReactElement, useContext } from 'react'
import { Gift, Link } from 'react-feather'
import { useNavigate } from 'react-router'
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
  const { balance } = useContext(Context)

  const navigate = useNavigate()

  if (!balance) {
    return <Loading />
  }

  function onCheckTransactions() {
    window.open(`https://blockscout.com/xdai/mainnet/address/${balance?.address}/transactions`, '_blank')
  }

  function onInvite() {
    navigate(ROUTES.ACCOUNT_INVITATIONS)
  }

  return (
    <>
      <Header />
      <AccountNavigation active="WALLET" />
      <Box mb={4}>
        <Typography variant="h2">Wallet balance</Typography>
      </Box>
      <Box mb={0.25}>
        <ExpandableListItemKey label="Node wallet address" value={balance.address} expanded />
      </Box>
      <Box mb={0.25}>
        <ExpandableListItem label="XDAI balance" value={`${balance.dai.toSignificantDigits(4)} XDAI`} />
      </Box>
      <Box mb={2}>
        <ExpandableListItem label="BZZ balance" value={`${balance.bzz.toSignificantDigits(4)} BZZ`} />
      </Box>
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
