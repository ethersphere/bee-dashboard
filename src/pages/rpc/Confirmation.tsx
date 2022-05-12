import { Box, createStyles, Grid, makeStyles, Typography } from '@material-ui/core'
import { ReactElement } from 'react'
import { Battery, BatteryCharging, Check } from 'react-feather'
import { useNavigate } from 'react-router'
import ExpandableListItemActions from '../../components/ExpandableListItemActions'
import { HistoryHeader } from '../../components/HistoryHeader'
import { SwarmButton } from '../../components/SwarmButton'
import { ROUTES } from '../../routes'

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

export default function Confirmation(): ReactElement {
  const navigate = useNavigate()

  const styles = useStyles()

  return (
    <>
      <HistoryHeader>Connect to the blockchain</HistoryHeader>
      <Grid container direction="column" alignItems="center">
        <Box mb={6}>
          <div className={styles.checkWrapper}>
            <Check size={100} color="#ededed" />
          </div>
        </Box>
        <Box mb={1}>
          <Typography style={{ fontWeight: 'bold' }}>Your node&apos;s RPC endpoint is set up correctly!</Typography>
        </Box>
        <Box mb={4}>
          <Typography align="center">Lastly, you will need to top-up your node wallet.</Typography>
          <Typography align="center">
            If you&apos;re not familiar with cryptocurrencies, you can start with a bank card.
          </Typography>
        </Box>
        <ExpandableListItemActions>
          <SwarmButton iconType={Battery} onClick={() => navigate(ROUTES.TOP_UP_BANK_CARD)}>
            Get started with bank card
          </SwarmButton>
          <SwarmButton iconType={BatteryCharging} onClick={() => navigate(ROUTES.TOP_UP_BANK_CARD)}>
            Use DAI
          </SwarmButton>
        </ExpandableListItemActions>
      </Grid>
    </>
  )
}
