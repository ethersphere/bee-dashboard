import { Box, Grid, Typography } from '@material-ui/core'
import { BeeModes } from '@upcoming/bee-js'
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
import TroubleshootConnectionCard from '../../../components/TroubleshootConnectionCard'
import { Context as BeeContext, CheckState } from '../../../providers/Bee'
import { Context as SettingsContext } from '../../../providers/Settings'
import { Context as BalanceProvider } from '../../../providers/WalletBalance'
import { ROUTES } from '../../../routes'
import { AccountNavigation } from '../AccountNavigation'
import { Header } from '../Header'

export function AccountWallet(): ReactElement {
  const { nodeAddresses, nodeInfo, status } = useContext(BeeContext)
  const { isDesktop } = useContext(SettingsContext)
  const { balance } = useContext(BalanceProvider)

  const navigate = useNavigate()

  function onCheckTransactions() {
    window.open(`https://gnosisscan.io/address/${nodeAddresses?.ethereum}`, '_blank')
  }

  function onInvite() {
    navigate(ROUTES.ACCOUNT_INVITATIONS)
  }

  function onDeposit() {
    navigate(ROUTES.TOP_UP)
  }

  if (status.all === CheckState.ERROR) return <TroubleshootConnectionCard />

  return (
    <>
      <Header />
      {nodeInfo?.beeMode !== BeeModes.ULTRA_LIGHT && <AccountNavigation active="WALLET" />}
      <Box mb={4}>
        <Grid container direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h2">Wallet balance</Typography>
          {isDesktop && (
            <SwarmButton onClick={onDeposit} iconType={Download}>
              Top up wallet
            </SwarmButton>
          )}
        </Grid>
      </Box>
      {balance && nodeAddresses ? (
        <>
          <Box mb={0.25}>
            <ExpandableListItemKey label="Node wallet address" value={nodeAddresses.ethereum.toChecksum()} expanded />
          </Box>
          <Box mb={0.25}>
            <ExpandableListItem label="xDAI balance" value={`${balance.dai.toSignificantDigits(4)} xDAI`} />
          </Box>
          <Box mb={2}>
            <ExpandableListItem label="xBZZ balance" value={`${balance.bzz.toSignificantDigits(4)} xBZZ`} />
          </Box>
        </>
      ) : (
        <Box mb={8}>
          <Loading />
        </Box>
      )}
      <ExpandableListItemActions>
        <SwarmButton onClick={onCheckTransactions} iconType={Link}>
          Check transactions
        </SwarmButton>
        {isDesktop && (
          <SwarmButton onClick={onInvite} iconType={Gift}>
            Invite to Swarm...
          </SwarmButton>
        )}
      </ExpandableListItemActions>
    </>
  )
}
