import type { ReactElement } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Table, TableBody, TableCell, TableContainer, TableRow, TableHead, Paper } from '@material-ui/core'

import ClipboardCopy from '../../components/ClipboardCopy'
import CashoutModal from '../../components/CashoutModal'
import PeerDetailDrawer from './PeerDetail'
import { Accounting } from '../../hooks/accounting'

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  values: {
    textAlign: 'right',
    fontFamily: 'monospace, monospace',
  },
})
interface Props {
  isLoadingUncashed: boolean
  accounting: Accounting[] | null
}

function BalancesTable({ accounting, isLoadingUncashed }: Props): ReactElement | null {
  if (accounting === null) return null
  const classes = useStyles()

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} size="small" aria-label="Balances Table">
        <TableHead>
          <TableRow>
            <TableCell>Peer</TableCell>
            <TableCell align="right">Outstanding Balance</TableCell>
            <TableCell align="right">Settlements Sent / Received</TableCell>
            <TableCell align="right">Total</TableCell>
            <TableCell align="right">Uncashed Amount</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {accounting.map(({ peer, balance, received, sent, uncashedAmount, total }) => (
            <TableRow key={peer}>
              <TableCell>
                <div style={{ display: 'flex' }}>
                  <small>
                    <PeerDetailDrawer peerId={peer} />
                  </small>
                  <ClipboardCopy value={peer} />
                </div>
              </TableCell>
              <TableCell className={classes.values}>
                <span
                  style={{
                    color: balance.toBigNumber.isPositive() ? '#32c48d' : '#c9201f',
                  }}
                >
                  {balance.toFixedDecimal()}
                </span>{' '}
                BZZ
              </TableCell>
              <TableCell className={classes.values}>
                -{sent.toFixedDecimal()} / {received.toFixedDecimal()} BZZ
              </TableCell>
              <TableCell className={classes.values}>
                <span
                  style={{
                    color: total.toBigNumber.isPositive() ? '#32c48d' : '#c9201f',
                  }}
                >
                  {total.toFixedDecimal()}
                </span>{' '}
                BZZ
              </TableCell>
              <TableCell className={classes.values}>
                {isLoadingUncashed && 'loading...'}
                {!isLoadingUncashed && (
                  <>{uncashedAmount.toBigNumber.isGreaterThan('0') ? uncashedAmount.toFixedDecimal() : '0'} BZZ</>
                )}
              </TableCell>
              <TableCell className={classes.values}>
                {!uncashedAmount.toBigNumber.isGreaterThan('0') && (
                  <CashoutModal uncashedAmount={uncashedAmount.toFixedDecimal()} peerId={peer} />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default BalancesTable
