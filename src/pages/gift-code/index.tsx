import { Box, Typography } from '@material-ui/core'
import { useSnackbar } from 'notistack'
import { ReactElement, useContext, useEffect, useState } from 'react'
import { Check, X } from 'react-feather'
import { useNavigate } from 'react-router'
import ExpandableListItem from '../../components/ExpandableListItem'
import ExpandableListItemActions from '../../components/ExpandableListItemActions'
import ExpandableListItemKey from '../../components/ExpandableListItemKey'
import { HistoryHeader } from '../../components/HistoryHeader'
import { Loading } from '../../components/Loading'
import { SwarmButton } from '../../components/SwarmButton'
import { Context as BeeContext } from '../../providers/Bee'
import { Context as TopUpContext } from '../../providers/TopUp'
import { createGiftWallet } from '../../utils/desktop'
import { generateWallet } from '../../utils/identity'
import { ResolvedWallet } from '../../utils/wallet'

export default function Index(): ReactElement {
  const { giftWallets, addGiftWallet } = useContext(TopUpContext)
  const { balance } = useContext(BeeContext)

  const [loading, setLoading] = useState(false)
  const [balances, setBalances] = useState<ResolvedWallet[]>([])

  useEffect(() => {
    async function mapGiftWallets() {
      const results = []
      for (const giftWallet of giftWallets) {
        results.push(await ResolvedWallet.make(giftWallet))
      }
      setBalances(results)
    }

    mapGiftWallets()
  }, [giftWallets])

  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()

  async function onCreate() {
    enqueueSnackbar('Sending funds to gift wallet...')
    setLoading(true)
    try {
      const wallet = generateWallet()
      addGiftWallet(wallet)
      await createGiftWallet(wallet.getAddressString())
      enqueueSnackbar('Succesfully funded gift wallet', { variant: 'success' })
    } catch (error) {
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

  return (
    <>
      <HistoryHeader>Invite to Swarm...</HistoryHeader>
      <Box mb={4}>
        <Typography>
          Generate and share a gift wallet that anyone can use to set-up their light node with Swarm Desktop. This will
          use 1 XDAI and 5 BZZ from your node wallet.
        </Typography>
      </Box>
      <Box mb={0.25}>
        <ExpandableListItem label="XDAI balance" value={`${balance.dai.toSignificantDigits(4)} XDAI`} />
      </Box>
      <Box mb={2}>
        <ExpandableListItem label="BZZ balance" value={`${balance.bzz.toSignificantDigits(4)} BZZ`} />
      </Box>
      <Box mb={4}>
        {balances.map((x, i) => (
          <Box mb={2} key={i}>
            <ExpandableListItemKey label={`swarm${String(i).padStart(3, '0')}`} value={x.privateKey} />
            <ExpandableListItemKey label="Address" value={x.address} />
            <ExpandableListItem label="XDAI balance" value={`${x.dai.toSignificantDigits(4)} XDAI`} />
            <ExpandableListItem label="BZZ balance" value={`${x.bzz.toSignificantDigits(4)} BZZ`} />
          </Box>
        ))}
      </Box>
      <ExpandableListItemActions>
        <SwarmButton onClick={onCreate} iconType={Check} loading={loading} disabled={loading}>
          Generate gift wallet
        </SwarmButton>
        <SwarmButton onClick={onCancel} cancel iconType={X} disabled={loading}>
          Cancel
        </SwarmButton>
      </ExpandableListItemActions>
    </>
  )
}
