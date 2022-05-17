import { Box, Typography } from '@material-ui/core'
import { useSnackbar } from 'notistack'
import { ReactElement, useContext, useState } from 'react'
import { ArrowDown, Check } from 'react-feather'
import { useNavigate } from 'react-router'
import ExpandableListItem from '../../components/ExpandableListItem'
import ExpandableListItemActions from '../../components/ExpandableListItemActions'
import ExpandableListItemKey from '../../components/ExpandableListItemKey'
import { HistoryHeader } from '../../components/HistoryHeader'
import { Loading } from '../../components/Loading'
import { SwarmButton } from '../../components/SwarmButton'
import { SwarmDivider } from '../../components/SwarmDivider'
import { SwarmTextInput } from '../../components/SwarmTextInput'
import { BzzToken } from '../../models/BzzToken'
import { DaiToken } from '../../models/DaiToken'
import { Context } from '../../providers/TopUp'
import { swap } from '../../utils/swap'
import { TopUpProgressIndicator } from './TopUpProgressIndicator'

interface Props {
  header: string
  next: string
}

export function Swap({ header, next }: Props): ReactElement {
  const [loading, setLoading] = useState(false)
  const [hasSwapped, setSwapped] = useState(false)

  const { wallet } = useContext(Context)
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()

  if (!wallet) {
    return <Loading />
  }

  const daiToSwap = DaiToken.fromDecimal(wallet.dai.toDecimal.minus(1))

  const daiAfterSwap = new DaiToken(wallet.dai.toBigNumber.minus(daiToSwap.toBigNumber))
  const bzzAfterSwap = BzzToken.fromDecimal(daiAfterSwap.toDecimal.dividedBy(2))

  async function onSwap() {
    if (!wallet || hasSwapped) {
      return
    }
    setLoading(true)
    setSwapped(true)
    try {
      await swap(wallet.privateKey, daiToSwap.toString, '0.1')
      enqueueSnackbar('Successfully swapped', { variant: 'success' })
    } catch (error) {
      enqueueSnackbar(`Failed to swap: ${error}`, { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <HistoryHeader>{header}</HistoryHeader>
      <Box mb={4}>
        <TopUpProgressIndicator index={1} />
      </Box>
      <Box mb={2}>
        <Typography style={{ fontWeight: 'bold' }}>Swap some xDAI to BZZ</Typography>
      </Box>
      <Box mb={4}>
        <Typography>
          You need to swap xDAI to BZZ in order to use Swarm. Make sure to keep at least 1 xDAI in order to pay for
          transaction costs on the network.
        </Typography>
      </Box>
      <SwarmDivider mb={4} />
      <Box mb={4}>
        <Typography>
          Your current balance is {wallet.dai.toSignificantDigits(4)} xDAI and {wallet.bzz.toSignificantDigits(4)} BZZ.
        </Typography>
      </Box>
      <Box mb={4}>
        <SwarmTextInput
          label="Amount to swap"
          defaultValue={`${daiToSwap.toSignificantDigits(4)} XDAI`}
          name="x"
          onChange={() => false}
        />
      </Box>
      <Box mb={4}>
        <ArrowDown size={24} color="#aaaaaa" />
      </Box>
      <Box mb={0.25}>
        <ExpandableListItemKey label="Funding wallet address" value={wallet.address} expanded />
      </Box>
      <Box mb={0.25}>
        <ExpandableListItem
          label="Resulting XDAI balance after swap"
          value={`${daiAfterSwap.toSignificantDigits(4)} XDAI`}
        />
      </Box>
      <Box mb={2}>
        <ExpandableListItem
          label="Resulting BZZ balance after swap"
          value={`${bzzAfterSwap.toSignificantDigits(4)} BZZ`}
        />
      </Box>
      <ExpandableListItemActions>
        <SwarmButton
          iconType={Check}
          onClick={onSwap}
          disabled={hasSwapped || loading || wallet.dai.toDecimal.lte(1)}
          loading={loading}
        >
          Swap Now
        </SwarmButton>
        <SwarmButton
          iconType={Check}
          onClick={() => {
            navigate(next)
          }}
          disabled={loading || wallet.bzz.toDecimal.lte(0.1)}
        >
          Proceed
        </SwarmButton>
      </ExpandableListItemActions>
    </>
  )
}
