import { BeeModes } from '@ethersphere/bee-js'
import { Box, Typography } from '@material-ui/core'
import BigNumber from 'bignumber.js'
import { useSnackbar } from 'notistack'
import { ReactElement, useContext, useEffect, useState } from 'react'
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
import { getBzzPriceAsDai, performSwap, restartBeeNode, upgradeToLightNode } from '../../utils/desktop'
import { TopUpProgressIndicator } from './TopUpProgressIndicator'
import config from '../../config'

const MINIMUM_XDAI = '0.1'
const MINIMUM_XBZZ = '0.1'

interface Props {
  header: string
}

export function Swap({ header }: Props): ReactElement {
  const [loading, setLoading] = useState(false)
  const [hasSwapped, setSwapped] = useState(false)
  const [userInputSwap, setUserInputSwap] = useState<string | null>(null)
  const [price, setPrice] = useState(DaiToken.fromDecimal('0.6', 18))

  const { providerUrl } = useContext(TopUpContext)
  const { balance, nodeAddresses, nodeInfo } = useContext(BeeContext)
  const isBeeDesktop = config.BEE_DESKTOP_ENABLED

  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    // eslint-disable-next-line no-console
    getBzzPriceAsDai().then(setPrice).catch(console.error)
  }, [])

  if (!balance || !nodeAddresses) {
    return <Loading />
  }

  const optimalSwap = balance.dai.minusBaseUnits('1')
  const lowAmountSwap = new DaiToken(balance.dai.toBigNumber.dividedToIntegerBy(2))

  let daiToSwap: DaiToken

  function isPositiveDecimal(value: string): boolean {
    try {
      return new BigNumber(value).isPositive()
    } catch {
      return false
    }
  }

  if (userInputSwap && isPositiveDecimal(userInputSwap)) {
    daiToSwap = DaiToken.fromDecimal(userInputSwap, 18)
  } else {
    daiToSwap = lowAmountSwap.toBigNumber.gt(optimalSwap.toBigNumber) ? lowAmountSwap : optimalSwap
  }

  const daiAfterSwap = new DaiToken(balance.dai.toBigNumber.minus(daiToSwap.toBigNumber))
  const bzzAfterSwap = new BzzToken(daiToSwap.toBigNumber.dividedBy(100).dividedToIntegerBy(price.toDecimal))

  const canUpgradeToLightNode = isBeeDesktop && nodeInfo?.beeMode === BeeModes.ULTRA_LIGHT

  async function restart() {
    try {
      await sleepMs(5_000)
      await upgradeToLightNode(providerUrl)
      await restartBeeNode()
      enqueueSnackbar('Upgraded to light node', { variant: 'success' })
      navigate(ROUTES.RESTART_LIGHT)
    } catch (error) {
      console.error(error) // eslint-disable-line
      enqueueSnackbar(`Failed to upgrade: ${error}`, { variant: 'error' })
    }
  }

  async function onSwap() {
    if (hasSwapped) {
      return
    }
    setLoading(true)
    setSwapped(true)
    try {
      await performSwap(daiToSwap.toString)
      enqueueSnackbar('Successfully swapped', { variant: 'success' })

      if (canUpgradeToLightNode) await restart()
    } catch (error) {
      console.error(error) // eslint-disable-line
      enqueueSnackbar(`Failed to swap: ${error}`, { variant: 'error' })
    } finally {
      balance?.refresh()
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
        <Typography style={{ fontWeight: 'bold' }}>Swap some xDAI to xBZZ</Typography>
      </Box>
      <Box mb={4}>
        <Typography>
          You need to swap xDAI to xBZZ in order to use Swarm. Make sure to keep at least {MINIMUM_XDAI} xDAI in order
          to pay for transaction costs on the network.
        </Typography>
      </Box>
      <SwarmDivider mb={4} />
      <Box mb={4}>
        <Typography>
          Your current balance is {balance.dai.toSignificantDigits(4)} xDAI and {balance.bzz.toSignificantDigits(4)}{' '}
          xBZZ.
        </Typography>
      </Box>
      <Box mb={4}>
        <SwarmTextInput
          label="Amount to swap"
          defaultValue={`${daiToSwap.toSignificantDigits(4)} xDAI`}
          placeholder={`${daiToSwap.toSignificantDigits(4)} xDAI`}
          name="x"
          onChange={event => setUserInputSwap(event.target.value)}
        />
        {daiAfterSwap.toDecimal.lt(MINIMUM_XDAI) ? (
          <Typography>Must keep at least {MINIMUM_XDAI} xDAI after swap!</Typography>
        ) : null}
        {bzzAfterSwap.toDecimal.lt(MINIMUM_XBZZ) ? (
          <Typography>Must have at least {MINIMUM_XBZZ} xBZZ after swap!</Typography>
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
          label="Resulting xDAI balance after swap"
          value={`${daiAfterSwap.toSignificantDigits(4)} xDAI`}
        />
      </Box>
      <Box mb={2}>
        <ExpandableListItem
          label="Resulting xBZZ balance after swap"
          value={`${bzzAfterSwap.toSignificantDigits(4)} xBZZ`}
        />
      </Box>
      <ExpandableListItemActions>
        <SwarmButton
          iconType={Check}
          onClick={onSwap}
          disabled={
            hasSwapped || loading || daiAfterSwap.toDecimal.lt(MINIMUM_XDAI) || bzzAfterSwap.toDecimal.lt(MINIMUM_XBZZ)
          }
          loading={loading}
        >
          {canUpgradeToLightNode ? 'Swap Now and Upgrade' : 'Swap Now'}
        </SwarmButton>
      </ExpandableListItemActions>
    </>
  )
}
