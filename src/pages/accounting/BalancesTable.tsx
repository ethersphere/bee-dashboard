import type { ReactElement } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Table, TableBody, TableCell, TableContainer, TableRow, TableHead, Paper } from '@material-ui/core'

import { fromBZZbaseUnit } from '../../utils'
import ClipboardCopy from '../../components/ClipboardCopy'
import PeerDetailDrawer from './PeerDetail'

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
  accounting: Record<string, Accounting> | null
}

function BalancesTable({ accounting }: Props): ReactElement | null {
  if (accounting === null) return null
  const classes = useStyles()

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} size="small" aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Peer</TableCell>
            <TableCell style={{ textAlign: 'right' }}>Outstanding Balance</TableCell>
            <TableCell style={{ textAlign: 'right' }}>Settlements Sent / Received</TableCell>
            <TableCell style={{ textAlign: 'right' }}>Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.entries(accounting).map(([peer, values]) => (
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
                    color: values.balance > 0 ? '#32c48d' : '#c9201f',
                  }}
                >
                  {fromBZZbaseUnit(values.balance).toFixed(7).toLocaleString()}
                </span>{' '}
                BZZ
              </TableCell>
              <TableCell className={classes.values}>
                -{fromBZZbaseUnit(values.sent).toFixed(7)} / {fromBZZbaseUnit(values.received).toFixed(7)} BZZ
              </TableCell>
              <TableCell className={classes.values}>
                <span
                  style={{
                    color: values.balance + values.received - values.sent > 0 ? '#32c48d' : '#c9201f',
                  }}
                >
                  {fromBZZbaseUnit(values.balance + values.received - values.sent).toFixed(7)}
                </span>{' '}
                BZZ
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default BalancesTable
