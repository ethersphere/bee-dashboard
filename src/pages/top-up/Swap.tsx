import { BeeModes } from '@ethersphere/bee-js'
import { Box, Typography } from '@material-ui/core'
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
import { Context as SettingsContext } from '../../providers/Settings'
import { Context as BalanceProvider } from '../../providers/WalletBalance'
import { ROUTES } from '../../routes'
import { sleepMs } from '../../utils'
import { getBzzPriceAsDai, performSwap, restartBeeNode, upgradeToLightNode } from '../../utils/desktop'
import { TopUpProgressIndicator } from './TopUpProgressIndicator'

const MINIMUM_XDAI = '0.1'
const MINIMUM_XBZZ = '0.1'

interface Props {
  header: string
}

export function Swap({ header }: Props): ReactElement {
  const [loading, setLoading] = useState(false)
  const [hasSwapped, setSwapped] = useState(false)
  const [userInputSwap, setUserInputSwap] = useState<string | null>(null)
  const [price, setPrice] = useState(DaiToken.fromDecimal('0.6'))
  const [error, setError] = useState<string | null>(null)
  const [daiToSwap, setDaiToSwap] = useState<DaiToken | null>(null)
  const [bzzAfterSwap, setBzzAfterSwap] = useState<BzzToken | null>(null)
  const [daiAfterSwap, setDaiAfterSwap] = useState<DaiToken | null>(null)

  const { rpcProviderUrl, isDesktop, desktopUrl } = useContext(SettingsContext)
  const { nodeAddresses, nodeInfo } = useContext(BeeContext)
  const { balance } = useContext(BalanceProvider)

  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()

  // Fetch current price of BZZ
  useEffect(() => {
    // eslint-disable-next-line no-console
    getBzzPriceAsDai(desktopUrl).then(setPrice).catch(console.error)
  }, [desktopUrl])

  // Set the initial xDAI to swap
  useEffect(() => {
    if (!balance) {
      return
    }

    const minimumOptimalValue = DaiToken.fromDecimal('1').plusBaseUnits(MINIMUM_XDAI).toDecimal

    if (balance.dai.toDecimal.isGreaterThanOrEqualTo(minimumOptimalValue)) {
      // Balance has at least 1 + MINIMUM_XDAI xDai
      setDaiToSwap(balance.dai.minusBaseUnits('1'))
    } else {
      // Balance is low, halve the amount
      setDaiToSwap(new DaiToken(balance.dai.toBigNumber.dividedToIntegerBy(2)))
    }
  }, [balance])

  // Set the xDAI to swap based on user input
  useEffect(() => {
    setError(null)
    try {
      if (userInputSwap) {
        const dai = DaiToken.fromDecimal(userInputSwap)
        setDaiToSwap(dai)

        if (dai.toDecimal.lte(0)) {
          setError('xDAI to swap must be a positive number')
        }
      }
    } catch {
      setError('Cannot parse xDAI amount')
    }
  }, [userInputSwap])

  // Calculate the amount of tokens after swap
  useEffect(() => {
    if (!balance || !daiToSwap || error) {
      return
    }
    const daiAfterSwap = new DaiToken(balance.dai.toBigNumber.minus(daiToSwap.toBigNumber))
    setDaiAfterSwap(daiAfterSwap)
    const tokensConverted = BzzToken.fromDecimal(daiToSwap.toBigNumber.dividedToIntegerBy(price.toBigNumber))
    const bzzAfterSwap = new BzzToken(tokensConverted.toBigNumber.plus(balance.bzz.toBigNumber))
    setBzzAfterSwap(bzzAfterSwap)

    if (daiAfterSwap.toDecimal.lt(MINIMUM_XDAI)) {
      setError(`Must keep at least ${MINIMUM_XDAI} xDAI after swap!`)
    } else if (bzzAfterSwap.toDecimal.lt(MINIMUM_XBZZ)) {
      setError(`Must have at least ${MINIMUM_XBZZ} xBZZ after swap!`)
    }
  }, [error, balance, daiToSwap, price])

  if (!balance || !nodeAddresses || !daiToSwap || !bzzAfterSwap || !daiAfterSwap) {
    return <Loading />
  }

  const canUpgradeToLightNode = isDesktop && nodeInfo?.beeMode === BeeModes.ULTRA_LIGHT

  async function restart() {
    try {
      await sleepMs(5_000)
      await upgradeToLightNode(desktopUrl, rpcProviderUrl)
      await restartBeeNode(desktopUrl)

      enqueueSnackbar('Upgraded to light node', { variant: 'success' })
      navigate(ROUTES.RESTART_LIGHT)
    } catch (error) {
      console.error(error) // eslint-disable-line
      enqueueSnackbar(`Failed to upgrade: ${error}`, { variant: 'error' })
    }
  }

  async function onSwap() {
    if (hasSwapped || !daiToSwap) {
      return
    }
    setLoading(true)
    setSwapped(true)

    try {
      await performSwap(desktopUrl, daiToSwap.toString)
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
          label="xDAI to swap"
          defaultValue={daiToSwap.toSignificantDigits(4)}
          placeholder={daiToSwap.toSignificantDigits(4)}
          name="x"
          onChange={event => setUserInputSwap(event.target.value)}
        />
        {error && <Typography>{error}</Typography>}
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
          disabled={hasSwapped || loading || error !== null}
          loading={loading}
        >
          {canUpgradeToLightNode ? 'Swap Now and Upgrade' : 'Swap Now'}
        </SwarmButton>
      </ExpandableListItemActions>
    </>
  )
}
