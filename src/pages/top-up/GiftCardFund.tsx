import { Box, Typography } from '@material-ui/core'
import { useSnackbar } from 'notistack'
import { ReactElement, useContext, useEffect, useState } from 'react'
import Check from 'remixicon-react/CheckLineIcon'
import ArrowDown from 'remixicon-react/ArrowDownLineIcon'
import { useNavigate, useParams } from 'react-router'
import ExpandableListItem from '../../components/ExpandableListItem'
import ExpandableListItemKey from '../../components/ExpandableListItemKey'
import { HistoryHeader } from '../../components/HistoryHeader'
import { Loading } from '../../components/Loading'
import { ProgressIndicator } from '../../components/ProgressIndicator'
import { SwarmButton } from '../../components/SwarmButton'
import { SwarmDivider } from '../../components/SwarmDivider'
import { Context as BeeContext } from '../../providers/Bee'
import { Context as SettingsContext } from '../../providers/Settings'
import { ROUTES } from '../../routes'
import { sleepMs } from '../../utils'
import { restartBeeNode, upgradeToLightNode } from '../../utils/desktop'
import { ResolvedWallet } from '../../utils/wallet'
import config from '../../config'
import { BeeModes } from '@ethersphere/bee-js'

export function GiftCardFund(): ReactElement {
  const isBeeDesktop = config.BEE_DESKTOP_ENABLED
  const { nodeAddresses, balance, nodeInfo } = useContext(BeeContext)
  const { provider, providerUrl } = useContext(SettingsContext)

  const [loading, setLoading] = useState(false)
  const [wallet, setWallet] = useState<ResolvedWallet | null>(null)

  const { privateKeyString } = useParams()

  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()

  useEffect(() => {
    if (!privateKeyString || !provider) {
      return
    }

    ResolvedWallet.make(privateKeyString, provider).then(setWallet)
  }, [privateKeyString, provider])

  if (!wallet || !balance) {
    return <Loading />
  }

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

  async function onFund() {
    if (!wallet || !nodeAddresses || !providerUrl) {
      return
    }

    setLoading(true)

    try {
      await wallet.transfer(nodeAddresses.ethereum, providerUrl)
      enqueueSnackbar('Successfully funded node', { variant: 'success' })

      if (canUpgradeToLightNode) await restart()
    } catch (error) {
      console.error(error) // eslint-disable-line
      enqueueSnackbar(`Failed to fund: ${error}`, { variant: 'error' })
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
        <ExpandableListItem label="xDAI balance" value={`${wallet.dai.toSignificantDigits(4)} xDAI`} />
      </Box>
      <Box mb={4}>
        <ExpandableListItem label="xBZZ balance" value={`${wallet.bzz.toSignificantDigits(4)} xBZZ`} />
      </Box>
      <Box mb={4}>
        <ArrowDown size={24} color="#aaaaaa" />
      </Box>
      <Box mb={0.25}>
        <ExpandableListItemKey label="Node wallet address" value={nodeAddresses?.ethereum || 'N/A'} expanded />
      </Box>
      <Box mb={0.25}>
        <ExpandableListItem label="xDAI balance" value={`${balance.dai.toSignificantDigits(4)} xDAI`} />
      </Box>
      <Box mb={2}>
        <ExpandableListItem label="xBZZ balance" value={`${balance.bzz.toSignificantDigits(4)} xBZZ`} />
      </Box>
      <SwarmButton iconType={Check} onClick={onFund} disabled={loading} loading={loading}>
        {canUpgradeToLightNode ? 'Send all funds to your node and Upgrade' : 'Send all funds to your node'}
      </SwarmButton>
    </>
  )
}
