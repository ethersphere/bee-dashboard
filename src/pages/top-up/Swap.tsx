import { Box, Typography } from '@material-ui/core'
import { useSnackbar } from 'notistack'
import { ReactElement, useContext, useState } from 'react'
import { ArrowDown, Check } from 'react-feather'
import { useNavigate } from 'react-router'
import ExpandableListItem from '../../components/ExpandableListItem'
import ExpandableListItemActions from '../../components/ExpandableListItemActions'
import ExpandableListItemKey from '../../components/ExpandableListItemKey'
import { HistoryHeader } from '../../components/HistoryHeader'
import { SwarmButton } from '../../components/SwarmButton'
import { SwarmTextInput } from '../../components/SwarmTextInput'
import { Token } from '../../models/Token'
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

  const { wallet, xDaiBalance, xBzzBalance } = useContext(Context)
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()

  const xDaiAfterSwap = new Token(xDaiBalance.toBigNumber.dividedToIntegerBy(2).toString(), 18)
  const xBzzAfterSwap = new Token(xDaiBalance.toBigNumber.dividedToIntegerBy(400).toString(), 16)

  async function onSwap() {
    if (!wallet || hasSwapped) {
      return
    }
    setLoading(true)
    setSwapped(true)
    try {
      await swap(wallet.getPrivateKeyString(), xDaiBalance.toBigNumber.dividedToIntegerBy(2).toString(), '1')
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
      <Box mb={4}>
        <Typography>
          Your current balance is {xDaiBalance.toSignificantDigits(4)} xDAI and {xBzzBalance.toSignificantDigits(4)}{' '}
          BZZ.
        </Typography>
      </Box>
      <Box mb={4}>
        <SwarmTextInput
          label="Amount to swap"
          defaultValue={`${xDaiAfterSwap.toSignificantDigits(4)} XDAI`}
          name="x"
          onChange={() => false}
        />
      </Box>
      <Box mb={4}>
        <ArrowDown size={24} color="#aaaaaa" />
      </Box>
      <Box mb={0.25}>
        <ExpandableListItemKey label="Funding wallet address" value={wallet?.getAddressString() || 'N/A'} expanded />
      </Box>
      <Box mb={0.25}>
        <ExpandableListItem
          label="Resulting XDAI balance after swap"
          value={`${xDaiAfterSwap.toSignificantDigits(4)} XDAI`}
        />
      </Box>
      <Box mb={2}>
        <ExpandableListItem
          label="Resulting BZZ balance after swap"
          value={`${xBzzAfterSwap.toSignificantDigits(4)} BZZ`}
        />
      </Box>
      <ExpandableListItemActions>
        <SwarmButton iconType={Check} onClick={onSwap} disabled={hasSwapped || loading} loading={loading}>
          Swap Now
        </SwarmButton>
        <SwarmButton
          iconType={Check}
          onClick={() => {
            navigate(next)
          }}
          disabled={xBzzBalance.toBigNumber.eq(0) || loading}
        >
          Proceed
        </SwarmButton>
      </ExpandableListItemActions>
    </>
  )
}
