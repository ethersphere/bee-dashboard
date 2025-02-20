import { Box, createStyles, Grid, makeStyles, Typography } from '@material-ui/core'
import { BeeModes, BZZ, DAI } from '@upcoming/bee-js'
import { useSnackbar } from 'notistack'
import { ReactElement, useContext, useState } from 'react'
import { useNavigate } from 'react-router'
import BankCard from 'remixicon-react/BankCard2LineIcon'
import Check from 'remixicon-react/CheckLineIcon'
import Download from 'remixicon-react/DownloadLineIcon'
import Gift from 'remixicon-react/GiftLineIcon'
import MoneyDollarCircle from 'remixicon-react/MoneyDollarCircleLineIcon'
import ExpandableListItemActions from '../../components/ExpandableListItemActions'
import { HistoryHeader } from '../../components/HistoryHeader'
import { Loading } from '../../components/Loading'
import { SwarmButton } from '../../components/SwarmButton'
import TroubleshootConnectionCard from '../../components/TroubleshootConnectionCard'
import { Context as BeeContext, CheckState } from '../../providers/Bee'
import { Context as SettingsContext } from '../../providers/Settings'
import { Context as BalanceProvider } from '../../providers/WalletBalance'
import { ROUTES } from '../../routes'
import { restartBeeNode, upgradeToLightNode } from '../../utils/desktop'

const useStyles = makeStyles(() =>
  createStyles({
    checkWrapper: {
      background: 'rgba(0, 230, 118, 0.25)',
      borderRadius: 99999,
      width: '180px',
      height: '180px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  }),
)

const MINIMUM_XDAI = DAI.fromDecimalString('0.05')
const MINIMUM_XBZZ = BZZ.fromDecimalString('0.1')

export default function TopUp(): ReactElement {
  const navigate = useNavigate()
  const styles = useStyles()
  const { isDesktop, desktopUrl } = useContext(SettingsContext)
  const { nodeInfo, status } = useContext(BeeContext)
  const { balance } = useContext(BalanceProvider)
  const { rpcProviderUrl } = useContext(SettingsContext)
  const [loading, setLoading] = useState(false)
  const { enqueueSnackbar } = useSnackbar()

  const canUpgradeToLightNode =
    isDesktop &&
    nodeInfo?.beeMode === BeeModes.ULTRA_LIGHT &&
    balance?.dai.gte(MINIMUM_XDAI) &&
    balance?.bzz.gte(MINIMUM_XBZZ)

  async function restart() {
    setLoading(true)
    try {
      await upgradeToLightNode(desktopUrl, rpcProviderUrl)
      await restartBeeNode(desktopUrl)
      navigate(ROUTES.RESTART_LIGHT)
    } catch (error) {
      console.error(error) // eslint-disable-line
      enqueueSnackbar(`Failed to upgrade: ${error}`, { variant: 'error' })
    }
    setLoading(false)
  }

  if (status.all === CheckState.ERROR) return <TroubleshootConnectionCard />

  if (!balance) {
    return <Loading />
  }

  return (
    <>
      <HistoryHeader>Account</HistoryHeader>
      <Grid container direction="column" alignItems="center">
        <Box mb={6}>
          <div className={styles.checkWrapper}>
            <Download size={100} color="#ededed" />
          </div>
        </Box>
        <Box mb={1}>
          <Typography style={{ fontWeight: 'bold' }}>Transfer funds to your Swarm account</Typography>
        </Box>
        <Box mb={4}>
          <Typography align="center">Top up your account with xBZZ and xDAI.</Typography>
          <Typography align="center">
            If you&apos;re not familiar with cryptocurrencies, you can start with a bank card.
          </Typography>
        </Box>
        <ExpandableListItemActions>
          <SwarmButton iconType={Gift} onClick={() => navigate(ROUTES.TOP_UP_GIFT_CODE)}>
            Use a gift code
          </SwarmButton>
          <SwarmButton iconType={MoneyDollarCircle} onClick={() => navigate(ROUTES.TOP_UP_CRYPTO)}>
            Use xDAI
          </SwarmButton>
          <SwarmButton iconType={BankCard} onClick={() => navigate(ROUTES.TOP_UP_BANK_CARD)}>
            Get started with bank card
          </SwarmButton>
        </ExpandableListItemActions>
        {canUpgradeToLightNode && (
          <>
            <Box mt={8} mb={2}>
              <Typography align="center">
                It seems that you have enough balance to upgrade your bee node to light node. By upgrading you will gain
                access to file upload and faster downloads.
              </Typography>
            </Box>
            <ExpandableListItemActions>
              <SwarmButton iconType={Check} onClick={restart} disabled={loading} loading={loading}>
                Upgrade now
              </SwarmButton>
              <div />
            </ExpandableListItemActions>
          </>
        )}
      </Grid>
    </>
  )
}
