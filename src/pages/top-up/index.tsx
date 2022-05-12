import { Box, Grid, Typography } from '@material-ui/core'
import { ReactElement, useContext } from 'react'
import { Check } from 'react-feather'
import { useNavigate } from 'react-router'
import ExpandableListItem from '../../components/ExpandableListItem'
import ExpandableListItemKey from '../../components/ExpandableListItemKey'
import { HistoryHeader } from '../../components/HistoryHeader'
import { SwarmButton } from '../../components/SwarmButton'
import { Context } from '../../providers/TopUp'
import { Ramp } from './Ramp'
import { TopUpProgressIndicator } from './TopUpProgressIndicator'

interface Props {
  header: string
  title: string
  p: ReactElement
  next: string
}

export default function Index({ header, title, p, next }: Props): ReactElement {
  const { wallet, xDaiBalance } = useContext(Context)
  const navigate = useNavigate()

  const disabled = xDaiBalance.toBigNumber.eq(0)

  return (
    <>
      {header === 'Top-up with bank card' && <Ramp address={wallet?.getAddressString()} />}
      <HistoryHeader>{header}</HistoryHeader>
      <Box mb={4}>
        <TopUpProgressIndicator index={0} />
      </Box>
      <Box mb={2}>
        <Typography style={{ fontWeight: 'bold' }}>{title}</Typography>
      </Box>
      <Box mb={4}>{p}</Box>
      <Box mb={4}>
        <Ramp address={wallet?.getAddressString()} />
      </Box>
      <Box mb={0.25}>
        <ExpandableListItemKey label="Funding wallet address" value={wallet?.getAddressString() || 'N/A'} expanded />
      </Box>
      <Box mb={4}>
        <ExpandableListItem label="xDAI balance" value={xDaiBalance.toSignificantDigits(4)} />
      </Box>
      <Grid container direction="row" justifyContent="space-between">
        <SwarmButton iconType={Check} onClick={() => navigate(next)} disabled={disabled}>
          Proceed
        </SwarmButton>
        {disabled ? <Typography>Please deposit xDAI to the address above in order to proceed.</Typography> : null}
      </Grid>
    </>
  )
}
