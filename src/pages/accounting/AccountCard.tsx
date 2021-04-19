import { ReactElement } from 'react'

import { createStyles, makeStyles } from '@material-ui/core/styles'
import { Card, CardContent, Typography, Theme } from '@material-ui/core/'
import { Skeleton } from '@material-ui/lab'
import WithdrawModal from '../../containers/WithdrawModal'
import DepositModal from '../../containers/DepositModal'

import { fromBZZbaseUnit } from '../../utils'

import type { ChequebookAddressResponse } from '@ethersphere/bee-js'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    buttons: {
      display: 'flex',
      columnGap: theme.spacing(1),
    },
    gridContainer: {
      display: 'flex',
      width: '100%',
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      columnGap: theme.spacing(1),
      rowGap: theme.spacing(1),
      flex: '0 1 auto',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
  }),
)

interface ChequebookBalance {
  totalBalance: number
  availableBalance: number
}

interface Props {
  chequebookAddress: ChequebookAddressResponse | null
  chequebookBalance: ChequebookBalance | null
  totalsent: number
  totalreceived: number
  isLoading: boolean
}

function AccountCard({ totalreceived, totalsent, chequebookBalance, isLoading }: Props): ReactElement {
  const classes = useStyles()

  return (
    <div>
      <div style={{ justifyContent: 'space-between', display: 'flex' }}>
        <h2 style={{ marginTop: '0px' }}>Chequebook</h2>
        <div className={classes.buttons}>
          <WithdrawModal />
          <DepositModal />
        </div>
      </div>

      <Card className={classes.root}>
        {!isLoading && (
          <CardContent className={classes.gridContainer}>
            <div>
              <Typography component="h2" variant="h6" color="primary" gutterBottom>
                Total Balance
              </Typography>
              <Typography variant="h5">
                {fromBZZbaseUnit(chequebookBalance?.totalBalance || 0).toFixed(7)} BZZ
              </Typography>
            </div>
            <div>
              <Typography component="h2" variant="h6" color="primary" gutterBottom>
                Available Uncommitted Balance
              </Typography>
              <Typography variant="h5">
                {fromBZZbaseUnit(chequebookBalance?.availableBalance || 0).toFixed(7)} BZZ
              </Typography>
            </div>
            <div>
              <Typography component="h2" variant="h6" color="primary" gutterBottom>
                Total Sent / Received
              </Typography>
              <Typography variant="h5">
                {fromBZZbaseUnit(totalsent).toFixed(7)} / {fromBZZbaseUnit(totalreceived).toFixed(7)} BZZ
              </Typography>
            </div>
          </CardContent>
        )}
        {isLoading && (
          <div className={classes.gridContainer}>
            <Skeleton width={180} height={110} animation="wave" />
            <Skeleton width={180} height={110} animation="wave" />
            <Skeleton width={180} height={110} animation="wave" />
          </div>
        )}
      </Card>
    </div>
  )
}

export default AccountCard
