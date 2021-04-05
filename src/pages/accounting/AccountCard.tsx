import { ReactElement } from 'react'

import { createStyles, makeStyles } from '@material-ui/core/styles'
import { Card, CardContent, Typography, Grid } from '@material-ui/core/'
import { Skeleton } from '@material-ui/lab'
import WithdrawlModal from '../../components/WithdrawlModal'
import DepositModal from '../../components/DepositModal'
import CashoutModal from '../../components/CashoutModal'

import { ConvertBalanceToBZZ } from '../../utils/common'

import type { AllSettlements, ChequebookAddressResponse } from '@ethersphere/bee-js'

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      display: 'flex',
    },
    details: {
      display: 'flex',
    },
    address: {
      color: 'grey',
      fontWeight: 400,
    },
    content: {
      flexGrow: 1,
    },
    status: {
      color: '#fff',
      backgroundColor: '#76a9fa',
    },
  }),
)

interface ChequebookBalance {
  totalBalance: number
  availableBalance: number
}

interface Props {
  chequebookAddress: ChequebookAddressResponse | null
  isLoadingChequebookAddress: boolean
  chequebookBalance: ChequebookBalance | null
  isLoadingChequebookBalance: boolean
  settlements: AllSettlements | null
  isLoadingSettlements: boolean
}

function AccountCard(props: Props): ReactElement {
  const classes = useStyles()

  return (
    <div>
      <div style={{ justifyContent: 'space-between', display: 'flex' }}>
        <h2 style={{ marginTop: '0px' }}>Accounting</h2>
        <div style={{ display: 'flex' }}>
          <WithdrawlModal />
          <DepositModal />
          <CashoutModal />
        </div>
      </div>

      <Card className={classes.root}>
        {!props.isLoadingChequebookBalance && !props.isLoadingSettlements && props.chequebookBalance ? (
          <div className={classes.details}>
            <CardContent className={classes.content}>
              <Grid container spacing={5}>
                <Grid item>
                  <Typography component="h2" variant="h6" color="primary" gutterBottom>
                    Total Balance
                  </Typography>
                  <Typography component="p" variant="h5">
                    {ConvertBalanceToBZZ(props.chequebookBalance.totalBalance)}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography component="h2" variant="h6" color="primary" gutterBottom>
                    Available Balance
                  </Typography>
                  <Typography component="p" variant="h5">
                    {ConvertBalanceToBZZ(props.chequebookBalance.availableBalance)}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography component="h2" variant="h6" color="primary" gutterBottom>
                    Total Sent / Received
                  </Typography>
                  <Typography component="div" variant="h5">
                    <span style={{ marginRight: '7px' }}>
                      {ConvertBalanceToBZZ(props.settlements?.totalsent || 0)} /{' '}
                      {ConvertBalanceToBZZ(props.settlements?.totalreceived || 0)}
                    </span>
                    <span
                      style={{
                        color:
                          props.settlements && props.settlements?.totalsent > props.settlements?.totalreceived
                            ? '#c9201f'
                            : '#32c48d',
                      }}
                    >
                      (
                      {ConvertBalanceToBZZ(
                        (props.settlements && props.settlements?.totalsent - props.settlements?.totalreceived) || 0,
                      )}
                      )
                    </span>
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </div>
        ) : (
          <div className={classes.details}>
            <Skeleton width={180} height={110} animation="wave" style={{ marginLeft: '12px', marginRight: '12px' }} />
            <Skeleton width={180} height={110} animation="wave" style={{ marginLeft: '12px', marginRight: '12px' }} />
            <Skeleton width={180} height={110} animation="wave" style={{ marginLeft: '12px', marginRight: '12px' }} />
            <Skeleton width={180} height={110} animation="wave" />
          </div>
        )}
      </Card>
    </div>
  )
}

export default AccountCard
