import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import type { ReactElement } from 'react'
import ClipboardCopy from '../../components/ClipboardCopy'
import PeerDetailDrawer from '../../components/PeerDetail'
import { EnrichedPostageBatch } from '../../providers/Stamps'

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
  postageStamps: EnrichedPostageBatch[] | null
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
            <TableCell align="right">Usage</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {postageStamps.map(({ batchID, usageText }) => (
            <TableRow key={batchID}>
              <TableCell>
                <div style={{ display: 'flex' }}>
                  <small>
                    <PeerDetailDrawer peerId={batchID} />
                  </small>
                  <ClipboardCopy value={batchID} />
                </div>
              </TableCell>
              <TableCell className={classes.values}>{usageText}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default StampsTable
