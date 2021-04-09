import React, { ReactElement } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TableHead,
  Paper,
  Container,
  CircularProgress,
} from '@material-ui/core'

import { fromBZZbaseUnit } from '../../utils'
import EthereumAddress from '../../components/EthereumAddress'
import ClipboardCopy from '../../components/ClipboardCopy'
import PeerDetailDrawer from './PeerDetailDrawer'

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
})

interface ChequeEvent {
  beneficiary: string
  chequebook: string
  payout: number
}

interface PeerCheque {
  lastreceived?: ChequeEvent
  lastsent?: ChequeEvent
  peer: string
}

interface PeerCheques {
  lastcheques: Array<PeerCheque>
}

interface Props {
  peerCheques: PeerCheques | null
  loading?: boolean
}

function ChequebookTable(props: Props): ReactElement {
  const classes = useStyles()

  return (
    <div>
      {props.loading ? (
        <Container style={{ textAlign: 'center', padding: '50px' }}>
          <CircularProgress />
        </Container>
      ) : (
        <div>
          <TableContainer component={Paper}>
            <Table className={classes.table} size="small" aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Peer</TableCell>
                  <TableCell>Last Received</TableCell>
                  <TableCell>Last Sent</TableCell>
                  <TableCell align="right"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {props.peerCheques?.lastcheques.map((peerCheque: PeerCheque) => (
                  <TableRow key={peerCheque.peer}>
                    <TableCell>
                      <div style={{ display: 'flex' }}>
                        <small>
                          <PeerDetailDrawer peerId={peerCheque.peer} />
                        </small>
                        <ClipboardCopy value={peerCheque.peer} />
                      </div>
                    </TableCell>
                    <TableCell style={{ maxWidth: '320px' }}>
                      <p style={{ marginBottom: '0px', fontFamily: 'monospace, monospace', display: 'flex' }}>
                        <span style={{ whiteSpace: 'nowrap', marginRight: '12px', paddingTop: '3px' }}>
                          {peerCheque.lastreceived?.payout
                            ? `${fromBZZbaseUnit(peerCheque.lastreceived?.payout).toFixed(7).toLocaleString()} from`
                            : '-'}
                        </span>
                        {peerCheque.lastreceived ? (
                          <EthereumAddress
                            hideBlockie
                            truncate
                            network="goerli"
                            address={peerCheque.lastreceived.beneficiary}
                          />
                        ) : null}
                      </p>
                    </TableCell>
                    <TableCell style={{ maxWidth: '320px' }}>
                      <p style={{ marginBottom: '0px', fontFamily: 'monospace, monospace', display: 'flex' }}>
                        <span style={{ whiteSpace: 'nowrap', marginRight: '12px', paddingTop: '3px' }}>
                          {peerCheque.lastsent?.payout
                            ? `${fromBZZbaseUnit(peerCheque.lastsent?.payout).toFixed(7).toLocaleString()} to`
                            : '-'}
                        </span>
                        {peerCheque.lastsent ? (
                          <EthereumAddress
                            hideBlockie
                            truncate
                            network="goerli"
                            address={peerCheque.lastsent.beneficiary}
                          />
                        ) : null}
                      </p>
                    </TableCell>
                    <TableCell align="right"></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}
    </div>
  )
}

export default ChequebookTable
