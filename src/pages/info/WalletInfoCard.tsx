import { useContext } from 'react'
import { useNavigate } from 'react-router'
import Upload from 'remixicon-react/UploadLineIcon'
import Wallet from 'remixicon-react/Wallet3LineIcon'
import Card from '../../components/Card'
import { Context as BeeContext } from '../../providers/Bee'
import { Context as BalanceProvider } from '../../providers/WalletBalance'
import { ROUTES } from '../../routes'

export function WalletInfoCard() {
  const { nodeInfo } = useContext(BeeContext)
  const { balance, error } = useContext(BalanceProvider)
  const navigate = useNavigate()

  let balanceText = 'Loading...'

  if (error) {
    balanceText = 'Could not load...'
    console.error(error) // eslint-disable-line
  } else if (balance) {
    balanceText = `${balance.bzz.toSignificantDigits(4)} xBZZ | ${balance.dai.toSignificantDigits(4)} xDAI`
  }

  if (nodeInfo?.beeMode && ['light', 'full', 'dev'].includes(nodeInfo.beeMode)) {
    return (
      <Card
        buttonProps={{
          iconType: Wallet,
          children: 'Manage your wallet',
          onClick: () => navigate(ROUTES.ACCOUNT_WALLET),
        }}
        icon={<Wallet />}
        title={balanceText}
        subtitle="Current wallet balance."
        status="ok"
      />
    )
  }

  return (
    <Card
      buttonProps={{
        iconType: Wallet,
        children: 'Setup wallet',
        onClick: () => navigate(ROUTES.TOP_UP),
      }}
      icon={<Upload />}
      title="Your wallet is not setup."
      subtitle="To share content on Swarm, please setup your wallet."
      status="error"
    />
  )
}
