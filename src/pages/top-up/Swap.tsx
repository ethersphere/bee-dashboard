import { Box, Typography } from '@material-ui/core'
import { useSnackbar } from 'notistack'
import { ReactElement, useContext, useState } from 'react'
import { useNavigate } from 'react-router'
import ArrowDown from 'remixicon-react/ArrowDownCircleLineIcon'
import Check from 'remixicon-react/CheckLineIcon'
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
import { Context as BeeContext } from '../../providers/Bee'
import { Context as TopUpContext } from '../../providers/TopUp'
import { ROUTES } from '../../routes'
import { sleepMs } from '../../utils'
import { performSwap, restartBeeNode, upgradeToLightNode } from '../../utils/desktop'
import { TopUpProgressIndicator } from './TopUpProgressIndicator'

const MINIMUM_DAI = '0.1'
const MINIMUM_BZZ = '0.1'

interface Props {
  header: string
}

export function Swap({ header }: Props): ReactElement {
  const [loading, setLoading] = useState(false)
  const [hasSwapped, setSwapped] = useState(false)
  const [userInputSwap, setUserInputSwap] = useState<string | null>(null)

  const { providerUrl } = useContext(TopUpContext)
  const { balance, nodeAddresses } = useContext(BeeContext)

  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()

  if (!balance || !nodeAddresses) {
    return <Loading />
  }

  const optimalSwap = balance.dai.minusBaseUnits('1')
  const lowAmountSwap = new DaiToken(balance.dai.toBigNumber.dividedToIntegerBy(2))

  let daiToSwap: DaiToken

  if (userInputSwap && parseFloat(userInputSwap)) {
    daiToSwap = DaiToken.fromDecimal(userInputSwap, 18)
  } else {
    daiToSwap = lowAmountSwap.toBigNumber.gt(optimalSwap.toBigNumber) ? lowAmountSwap : optimalSwap
  }

  const daiAfterSwap = new DaiToken(balance.dai.toBigNumber.minus(daiToSwap.toBigNumber))
  const bzzAfterSwap = new BzzToken(daiToSwap.toBigNumber.dividedBy(100).dividedToIntegerBy(0.6)) // TODO get price

  async function onSwap() {
    if (hasSwapped || !providerUrl) {
      return
    }
    setLoading(true)
    setSwapped(true)
    try {
      await performSwap(daiToSwap.toString)
      enqueueSnackbar('Successfully swapped, restarting...', { variant: 'success' })
      await sleepMs(5_000)
      await upgradeToLightNode(providerUrl)
      await restartBeeNode()
      navigate(ROUTES.RESTART_LIGHT)
      enqueueSnackbar('Upgraded to light node', { variant: 'success' })
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
          You need to swap xDAI to BZZ in order to use Swarm. Make sure to keep at least 0.1 xDAI in order to pay for
          transaction costs on the network.
        </Typography>
      </Box>
      <SwarmDivider mb={4} />
      <Box mb={4}>
        <Typography>
          Your current balance is {balance.dai.toSignificantDigits(4)} xDAI and {balance.bzz.toSignificantDigits(4)}{' '}
          BZZ.
        </Typography>
      </Box>
      <Box mb={4}>
        <SwarmTextInput
          label="Amount to swap"
          defaultValue={`${daiToSwap.toSignificantDigits(4)} XDAI`}
          placeholder={`${daiToSwap.toSignificantDigits(4)} XDAI`}
          name="x"
          onChange={event => setUserInputSwap(event.target.value)}
        />
        {daiAfterSwap.toDecimal.lt(MINIMUM_DAI) ? (
          <Typography>Must keep at least 0.1 xDAI after swap!</Typography>
        ) : null}
        {bzzAfterSwap.toDecimal.lt(MINIMUM_BZZ) ? (
          <Typography>Must have at least 0.1 xBZZ after swap!</Typography>
        ) : null}
      </Box>
      <Box mb={4}>
        <ArrowDown size={24} color="#aaaaaa" />
      </Box>
      <Box mb={0.25}>
        <ExpandableListItemKey label="Funding wallet address" value={nodeAddresses.ethereum} expanded />
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
          disabled={
            hasSwapped || loading || daiAfterSwap.toDecimal.lt(MINIMUM_DAI) || bzzAfterSwap.toDecimal.lt(MINIMUM_DAI)
          }
          loading={loading}
        >
          Swap Now
        </SwarmButton>
      </ExpandableListItemActions>
    </>
  )
}
