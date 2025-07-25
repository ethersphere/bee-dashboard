import { Box, Grid, Typography } from '@material-ui/core'
import { DAI } from '@ethersphere/bee-js'
import { ReactElement, useContext } from 'react'
import { useNavigate } from 'react-router'
import Check from 'remixicon-react/CheckLineIcon'
import ExpandableListItem from '../../components/ExpandableListItem'
import ExpandableListItemKey from '../../components/ExpandableListItemKey'
import { HistoryHeader } from '../../components/HistoryHeader'
import { Loading } from '../../components/Loading'
import { SwarmButton } from '../../components/SwarmButton'
import { SwarmDivider } from '../../components/SwarmDivider'
import { Context } from '../../providers/Bee'
import { TopUpProgressIndicator } from './TopUpProgressIndicator'

const MINIMUM_XDAI = DAI.fromDecimalString('0.5')

interface Props {
  header: string
  title: string
  p: ReactElement
  next: string
}

export default function Index({ header, title, p, next }: Props): ReactElement {
  const { nodeAddresses, walletBalance } = useContext(Context)
  const navigate = useNavigate()

  if (!walletBalance || !nodeAddresses) {
    return <Loading />
  }

  const disabled = walletBalance.nativeTokenBalance.lt(MINIMUM_XDAI)

  return (
    <>
      <HistoryHeader>{header}</HistoryHeader>
      <Box mb={4}>
        <TopUpProgressIndicator index={0} />
      </Box>
      <Box mb={2}>
        <Typography style={{ fontWeight: 'bold' }}>{title}</Typography>
      </Box>
      <Box mb={4}>{p}</Box>
      <SwarmDivider mb={4} />
      <Box mb={0.25}>
        <ExpandableListItemKey label="Funding wallet address" value={nodeAddresses.ethereum.toChecksum()} expanded />
      </Box>
      <Box mb={4}>
        <ExpandableListItem label="xDAI balance" value={walletBalance.nativeTokenBalance.toSignificantDigits(4)} />
      </Box>
      <Grid container direction="row" justifyContent="space-between">
        <SwarmButton iconType={Check} onClick={() => navigate(next)} disabled={disabled}>
          Proceed
        </SwarmButton>
        {disabled ? (
          <Typography>
            Please deposit at least {MINIMUM_XDAI.toSignificantDigits(4)} xDAI to the address above in order to proceed.
          </Typography>
        ) : null}
      </Grid>
    </>
  )
}
