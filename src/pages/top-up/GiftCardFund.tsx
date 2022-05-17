import { Box, Typography } from '@material-ui/core'
import { useSnackbar } from 'notistack'
import { ReactElement, useContext, useEffect, useState } from 'react'
import { ArrowDown, Check } from 'react-feather'
import { useNavigate, useParams } from 'react-router'
import ExpandableListItem from '../../components/ExpandableListItem'
import ExpandableListItemKey from '../../components/ExpandableListItemKey'
import { HistoryHeader } from '../../components/HistoryHeader'
import { Loading } from '../../components/Loading'
import { ProgressIndicator } from '../../components/ProgressIndicator'
import { SwarmButton } from '../../components/SwarmButton'
import { SwarmDivider } from '../../components/SwarmDivider'
import { Context as BeeContext } from '../../providers/Bee'
import { Context as TopUpContext } from '../../providers/TopUp'
import { ROUTES } from '../../routes'
import { restartBeeNode, upgradeToLightNode } from '../../utils/desktop'
import { ResolvedWallet } from '../../utils/wallet'

export function GiftCardFund(): ReactElement {
  const { nodeAddresses, balance } = useContext(BeeContext)
  const { jsonRpcProvider } = useContext(TopUpContext)

  const [loading, setLoading] = useState(false)
  const [wallet, setWallet] = useState<ResolvedWallet | null>(null)

  const { privateKeyString } = useParams()

  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()

  useEffect(() => {
    if (!privateKeyString) {
      return
    }

    ResolvedWallet.make(privateKeyString).then(setWallet)
  }, [privateKeyString])

  if (!wallet) {
    return <Loading />
  }

  async function onFund() {
    if (!wallet || !nodeAddresses) {
      return
    }

    setLoading(true)

    try {
      await wallet.transfer(nodeAddresses.ethereum)
      await upgradeToLightNode(jsonRpcProvider)
      await restartBeeNode()
      navigate(ROUTES.INFO)
      enqueueSnackbar('Successfully funded node', { variant: 'success' })
    } catch (error) {
      enqueueSnackbar(`Failed to fund node: ${error}`, { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <HistoryHeader>Top-up with gift code</HistoryHeader>
      <Box mb={4}>
        <ProgressIndicator index={1} steps={['Paste gift code', 'Fund your node']} />
      </Box>
      <Box mb={2}>
        <Typography style={{ fontWeight: 'bold' }}>Send funds to your Bee node</Typography>
      </Box>
      <Box mb={4}>
        <Typography>
          Deposit all the funds from the gift wallet to your node wallet address. You can use the button below to
          transfer all funds to your node.
        </Typography>
      </Box>
      <SwarmDivider mb={4} />
      <Box mb={0.25}>
        <ExpandableListItemKey label="Gift wallet address" value={wallet.address || 'N/A'} />
      </Box>
      <Box mb={0.25}>
        <ExpandableListItem label="XDAI balance" value={`${wallet.dai.toSignificantDigits(4)} XDAI`} />
      </Box>
      <Box mb={4}>
        <ExpandableListItem label="BZZ balance" value={`${wallet.bzz.toSignificantDigits(4)} BZZ`} />
      </Box>
      <Box mb={4}>
        <ArrowDown size={24} color="#aaaaaa" />
      </Box>
      <Box mb={0.25}>
        <ExpandableListItemKey label="Node wallet address" value={nodeAddresses?.ethereum || 'N/A'} expanded />
      </Box>
      <Box mb={0.25}>
        <ExpandableListItem label="XDAI balance" value={`${balance.xdai.toSignificantDigits(4)} XDAI`} />
      </Box>
      <Box mb={2}>
        <ExpandableListItem label="BZZ balance" value={`${balance.bzz.toSignificantDigits(4)} BZZ`} />
      </Box>
      <SwarmButton iconType={Check} onClick={onFund} disabled={loading} loading={loading}>
        Send all funds to your node
      </SwarmButton>
    </>
  )
}
