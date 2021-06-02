import type { ReactElement } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Table, TableBody, TableCell, TableContainer, TableRow, TableHead, Paper } from '@material-ui/core'

import ClipboardCopy from '../../components/ClipboardCopy'
import PeerDetailDrawer from '../../components/PeerDetail'
import { PostageBatch } from '@ethersphere/bee-js'

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
  postageStamps: PostageBatch[] | null
}

function StampsTable({ postageStamps }: Props): ReactElement | null {
  if (postageStamps === null) return null
  const classes = useStyles()

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} size="small" aria-label="Balances Table">
        <TableHead>
          <TableRow>
            <TableCell>Batch ID</TableCell>
            <TableCell align="right">Utilization</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {postageStamps.map(({ batchID, utilization }) => (
            <TableRow key={batchID}>
              <TableCell>
                <div style={{ display: 'flex' }}>
                  <small>
                    <PeerDetailDrawer peerId={batchID} />
                  </small>
                  <ClipboardCopy value={batchID} />
                </div>
              </TableCell>
              <TableCell className={classes.values}>{utilization}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default StampsTable
