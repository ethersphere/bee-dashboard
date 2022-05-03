import { Box, Typography } from '@material-ui/core'
import { useSnackbar } from 'notistack'
import { ReactElement, useContext, useState } from 'react'
import { ArrowDown, Check } from 'react-feather'
import ExpandableListItem from '../../components/ExpandableListItem'
import ExpandableListItemKey from '../../components/ExpandableListItemKey'
import { HistoryHeader } from '../../components/HistoryHeader'
import { SwarmButton } from '../../components/SwarmButton'
import { Context as BeeContext } from '../../providers/Bee'
import { Context as TopUpContext } from '../../providers/TopUp'
import { Rpc } from '../../utils/rpc'
import { TopUpProgressIndicator } from './TopUpProgressIndicator'

const DUMMY_GAS_PRICE = '300000000000000'

interface Props {
  header: string
}

export function Fund({ header }: Props): ReactElement {
  const { xDaiBalance, xBzzBalance, jsonRpcProvider, wallet } = useContext(TopUpContext)
  const { nodeAddresses, balance } = useContext(BeeContext)

  const { enqueueSnackbar } = useSnackbar()

  const [loading, setLoading] = useState(false)

  async function onFund() {
    if (!nodeAddresses?.ethereum || !wallet) {
      return
    }
    // eslint-disable-next-line no-console
    console.log(xBzzBalance.toBigNumber.minus(DUMMY_GAS_PRICE).toString())
    setLoading(true)
    try {
      if (xBzzBalance.toBigNumber.gt(DUMMY_GAS_PRICE)) {
        await Rpc.sendBzzTransaction(
          wallet.getPrivateKeyString(),
          nodeAddresses.ethereum,
          xBzzBalance.toBigNumber.minus(DUMMY_GAS_PRICE).toString(),
          jsonRpcProvider,
        )
      }

      if (xDaiBalance.toBigNumber.gt(DUMMY_GAS_PRICE)) {
        await Rpc.sendNativeTransaction(
          wallet.getPrivateKeyString(),
          nodeAddresses.ethereum,
          xDaiBalance.toBigNumber.minus(DUMMY_GAS_PRICE).toString(),
          jsonRpcProvider,
        )
      }
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
      <Box mb={0.25}>
        <ExpandableListItemKey label="Funding wallet address" value={wallet?.getAddressString() || 'N/A'} />
      </Box>
      <Box mb={0.25}>
        <ExpandableListItem label="XDAI balance" value={`${xDaiBalance.toSignificantDigits(4)} XDAI`} />
      </Box>
      <Box mb={4}>
        <ExpandableListItem label="BZZ balance" value={`${xBzzBalance.toSignificantDigits(4)} BZZ`} />
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
