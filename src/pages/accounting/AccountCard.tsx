import { ReactElement } from 'react'

import { createStyles, makeStyles } from '@material-ui/core/styles'
import { Card, CardContent, Typography, Theme } from '@material-ui/core/'
import WithdrawModal from '../../containers/WithdrawModal'
import DepositModal from '../../containers/DepositModal'

import type { ChequebookAddressResponse } from '@ethersphere/bee-js'
import { Token } from '../../models/Token'

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
    chequebookActions: {
      justifyContent: 'space-between',
      display: 'flex',
      marginBottom: theme.spacing(1),
    },
  }),
)

interface ChequebookBalance {
  totalBalance: Token
  availableBalance: Token
}

interface Props {
  chequebookAddress: ChequebookAddressResponse | null
  chequebookBalance: ChequebookBalance | null
  totalsent?: Token
  totalreceived?: Token
}

function AccountCard({ totalreceived, totalsent, chequebookBalance }: Props): ReactElement {
  const classes = useStyles()

  return (
    <div>
      <div className={classes.chequebookActions}>
        <Typography component="h2" variant="h6">
          Chequebook
        </Typography>
        <div className={classes.buttons}>
          <WithdrawModal />
          <DepositModal />
        </div>
      </div>

      <Card className={classes.root}>
        <CardContent className={classes.gridContainer}>
          <div>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Total Balance
            </Typography>
            <Typography variant="h5">{chequebookBalance?.totalBalance.toFixedDecimal()} BZZ</Typography>
          </div>
          <div>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Available Uncommitted Balance
            </Typography>
            <Typography variant="h5">{chequebookBalance?.availableBalance.toFixedDecimal()} BZZ</Typography>
          </div>
          <div>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Total Sent / Received
            </Typography>
            <Typography variant="h5">
              {totalsent?.toFixedDecimal()} / {totalreceived?.toFixedDecimal()} BZZ
            </Typography>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AccountCard
