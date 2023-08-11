import { Box, Tooltip, Typography } from '@material-ui/core'
import { Wallet } from 'ethers'
import { useSnackbar } from 'notistack'
import { ReactElement, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import Check from 'remixicon-react/CheckLineIcon'
import X from 'remixicon-react/CloseLineIcon'
import ExpandableListItem from '../../components/ExpandableListItem'
import ExpandableListItemActions from '../../components/ExpandableListItemActions'
import ExpandableListItemKey from '../../components/ExpandableListItemKey'
import { HistoryHeader } from '../../components/HistoryHeader'
import { Loading } from '../../components/Loading'
import { SwarmButton } from '../../components/SwarmButton'
import { Token } from '../../models/Token'
import { Context as SettingsContext } from '../../providers/Settings'
import { Context as TopUpContext } from '../../providers/TopUp'
import { Context as BalanceProvider } from '../../providers/WalletBalance'
import { createGiftWallet } from '../../utils/desktop'
import { ResolvedWallet } from '../../utils/wallet'

const GIFT_WALLET_FUND_DAI_AMOUNT = Token.fromDecimal('0.1', 18)
const GIFT_WALLET_FUND_BZZ_AMOUNT = Token.fromDecimal('0.5', 16)

export default function Index(): ReactElement {
  const { giftWallets, addGiftWallet } = useContext(TopUpContext)
  const { rpcProvider, desktopUrl } = useContext(SettingsContext)
  const { balance } = useContext(BalanceProvider)

  const [loading, setLoading] = useState(false)
  const [balances, setBalances] = useState<ResolvedWallet[]>([])

  useEffect(() => {
    async function mapGiftWallets() {
      if (!rpcProvider) {
        return
      }
      const results = []
      for (const giftWallet of giftWallets) {
        results.push(await ResolvedWallet.make(giftWallet, rpcProvider))
      }
      setBalances(results)
    }

    mapGiftWallets()
  }, [giftWallets, rpcProvider])

  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()

  async function onCreate() {
    enqueueSnackbar('Sending funds to gift wallet...')
    setLoading(true)
    try {
      const wallet = Wallet.createRandom()
      addGiftWallet(wallet)
      await createGiftWallet(desktopUrl, wallet.address)
      enqueueSnackbar('Succesfully funded gift wallet', { variant: 'success' })
    } catch (error) {
      console.error(error) // eslint-disable-line
      enqueueSnackbar(`Failed to fund gift wallet: ${error}`, { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  function onCancel() {
    navigate(-1)
  }

  if (!balance) {
    return <Loading />
  }

  const notEnoughFundsCheck =
    balance.dai.toBigNumber.isLessThanOrEqualTo(GIFT_WALLET_FUND_DAI_AMOUNT.toBigNumber) ||
    balance.bzz.toBigNumber.isLessThan(GIFT_WALLET_FUND_BZZ_AMOUNT.toBigNumber)

  return (
    <>
      <HistoryHeader>Invite to Swarm...</HistoryHeader>
      <Box mb={4}>
        <Typography>
          Generate and share a gift wallet that anyone can use to set-up their light node with Swarm Desktop. This will
          use {GIFT_WALLET_FUND_DAI_AMOUNT.toSignificantDigits(2)} xDAI and{' '}
          {GIFT_WALLET_FUND_BZZ_AMOUNT.toSignificantDigits(2)} xBZZ from your node wallet.
        </Typography>
      </Box>
      <Box mb={0.25}>
        <ExpandableListItem label="xDAI balance" value={`${balance.dai.toSignificantDigits(4)} xDAI`} />
      </Box>
      <Box mb={2}>
        <ExpandableListItem label="xBZZ balance" value={`${balance.bzz.toSignificantDigits(4)} xBZZ`} />
      </Box>
      <Box mb={4}>
        {balances.map((x, i) => (
          <Box mb={2} key={i}>
            <ExpandableListItemKey label={`swarm${String(i).padStart(3, '0')}`} value={x.privateKey} />
            <ExpandableListItemKey label="Address" value={x.address} />
            <ExpandableListItem label="xDAI balance" value={`${x.dai.toSignificantDigits(4)} xDAI`} />
            <ExpandableListItem label="xBZZ balance" value={`${x.bzz.toSignificantDigits(4)} xBZZ`} />
          </Box>
        ))}
      </Box>
      <ExpandableListItemActions>
        <Tooltip title={'Not enough funds'} placement="top" open={notEnoughFundsCheck} arrow>
          <div>
            <SwarmButton
              onClick={onCreate}
              iconType={Check}
              loading={loading}
              disabled={loading || notEnoughFundsCheck}
            >
              Generate gift wallet
            </SwarmButton>
          </div>
        </Tooltip>
        <SwarmButton onClick={onCancel} cancel iconType={X} disabled={loading}>
          Cancel
        </SwarmButton>
      </ExpandableListItemActions>
    </>
  )
}
