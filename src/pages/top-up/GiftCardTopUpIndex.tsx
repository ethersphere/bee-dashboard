import { Box, Typography } from '@material-ui/core'
import { Wallet } from 'ethers'
import { useSnackbar } from 'notistack'
import { ReactElement, useContext, useState } from 'react'
import ArrowRight from 'remixicon-react/ArrowRightLineIcon'
import { useNavigate } from 'react-router'
import { Context as TopUpContext } from '../../providers/TopUp'
import { HistoryHeader } from '../../components/HistoryHeader'
import { ProgressIndicator } from '../../components/ProgressIndicator'
import { SwarmButton } from '../../components/SwarmButton'
import { SwarmDivider } from '../../components/SwarmDivider'
import { SwarmTextInput } from '../../components/SwarmTextInput'
import { BzzToken } from '../../models/BzzToken'
import { DaiToken } from '../../models/DaiToken'
import { ROUTES } from '../../routes'
import { Rpc } from '../../utils/rpc'

export function GiftCardTopUpIndex(): ReactElement {
  const { provider } = useContext(TopUpContext)
  const [loading, setLoading] = useState(false)
  const [giftCode, setGiftCode] = useState('')

  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()

  async function onProceed() {
    if (!provider) return

    setLoading(true)
    try {
      const wallet = new Wallet(giftCode, provider)
      const dai = new DaiToken(await Rpc._eth_getBalance(wallet.address, provider))
      const bzz = new BzzToken(await Rpc._eth_getBalanceERC20(wallet.address, provider))

      if (dai.toDecimal.lt(0.001) || bzz.toDecimal.lt(0.001)) {
        throw Error('Gift wallet does not have enough funds')
      }
      enqueueSnackbar('Successfully verified gift wallet', { variant: 'success' })
      navigate(ROUTES.TOP_UP_GIFT_CODE_FUND.replace(':privateKeyString', giftCode))
    } catch (error) {
      console.error(error) // eslint-disable-line
      enqueueSnackbar(`Gift wallet could not be verified: ${error}`, { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <HistoryHeader>Top-up with gift code</HistoryHeader>
      <Box mb={4}>
        <ProgressIndicator index={0} steps={['Paste gift code', 'Fund your node']} />
      </Box>
      <Box mb={2}>
        <Typography style={{ fontWeight: 'bold' }}>Please paste your gift code below</Typography>
      </Box>
      <Box mb={4}>
        A gift code is a unique key to a gift wallet that you can use to fund your node. Please don&apos;t share your
        gift code as it can only be used once.
      </Box>
      <SwarmDivider mb={4} />
      <Box mb={2}>
        <SwarmTextInput
          label="Gift code"
          name="gift-code"
          onChange={event => {
            setGiftCode(event.target.value)
          }}
        />
      </Box>
      <SwarmButton iconType={ArrowRight} loading={loading} disabled={loading} onClick={onProceed}>
        Proceed
      </SwarmButton>
    </>
  )
}
