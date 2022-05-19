import { Box, Typography } from '@material-ui/core'
import { useSnackbar } from 'notistack'
import { ReactElement, useContext, useState } from 'react'
import { ArrowDown, Check } from 'react-feather'
import { useNavigate } from 'react-router'
import ExpandableListItem from '../../components/ExpandableListItem'
import ExpandableListItemKey from '../../components/ExpandableListItemKey'
import { HistoryHeader } from '../../components/HistoryHeader'
import { Loading } from '../../components/Loading'
import { SwarmButton } from '../../components/SwarmButton'
import { SwarmDivider } from '../../components/SwarmDivider'
import { Context as BeeContext } from '../../providers/Bee'
import { Context as TopUpContext } from '../../providers/TopUp'
import { ROUTES } from '../../routes'
import { restartBeeNode, upgradeToLightNode } from '../../utils/desktop'
import { TopUpProgressIndicator } from './TopUpProgressIndicator'

interface Props {
  header: string
}

export function Fund({ header }: Props): ReactElement {
  const { wallet, jsonRpcProvider } = useContext(TopUpContext)
  const { nodeAddresses, balance } = useContext(BeeContext)

  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)

  if (!wallet || !balance) {
    return <Loading />
  }

  async function onFund() {
    if (!nodeAddresses?.ethereum || !wallet) {
      return
    }
    setLoading(true)
    try {
      await wallet.transfer(nodeAddresses.ethereum, jsonRpcProvider)
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
      <HistoryHeader>{header}</HistoryHeader>
      <Box mb={4}>
        <TopUpProgressIndicator index={2} />
      </Box>
      <Box mb={2}>
        <Typography style={{ fontWeight: 'bold' }}>Send funds to your Bee node</Typography>
      </Box>
      <Box mb={4}>
        <Typography>
          Lastly, deposit all the funds from the funding wallet to your node wallet address. You can use the button
          below to transfer all funds to your node.
        </Typography>
      </Box>
      <SwarmDivider mb={4} />
      <Box mb={0.25}>
        <ExpandableListItemKey label="Funding wallet address" value={wallet.address || 'N/A'} />
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
        <ExpandableListItem label="XDAI balance" value={`${balance.dai.toSignificantDigits(4)} XDAI`} />
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
