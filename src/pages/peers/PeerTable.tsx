import { ReactElement, useState, useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TableHead,
  Button,
  Paper,
  Tooltip,
  CircularProgress,
} from '@material-ui/core'
import { Autorenew } from '@material-ui/icons'

import { Context as SettingsContext } from '../../providers/Settings'
import type { Peer } from '@ethersphere/bee-js'

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
})

interface Props {
  peers: Peer[] | null
}

interface PeerLatency {
  rtt: string
  loading: boolean
}

function getPingState(peerLatency: Record<string, PeerLatency>, peer: Peer): ReactElement {
  if (peerLatency[peer.address]?.loading) return <CircularProgress size={20} />

  if (peerLatency[peer.address]?.rtt) return <span>{peerLatency[peer.address]?.rtt}</span>

  return <Autorenew />
}

function PeerTable(props: Props): ReactElement {
  const classes = useStyles()
  const { beeDebugApi } = useContext(SettingsContext)

  const [peerLatency, setPeerLatency] = useState<Record<string, PeerLatency>>({})

  const pingPeer = (peerId: string) => {
    setPeerLatency(prevPeerLatency => ({ ...prevPeerLatency, [peerId]: { rtt: '', loading: true } }))
    beeDebugApi
      ?.pingPeer(peerId)
      .then(res => {
        setPeerLatency(prevPeerLatency => ({ ...prevPeerLatency, [peerId]: { rtt: res.rtt, loading: false } }))
      })
      .catch(() => {
        setPeerLatency(prevPeerLatency => ({ ...prevPeerLatency, [peerId]: { rtt: 'error', loading: false } }))
      })
  }

  return (
    <div>
      <TableContainer component={Paper}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Index</TableCell>
              <TableCell>Peer Id</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.peers?.map((peer: Peer, idx: number) => (
              <TableRow key={peer.address}>
                <TableCell component="th" scope="row">
                  {idx + 1}
                </TableCell>
                <TableCell>{peer.address}</TableCell>
                <TableCell align="right">
                  <Tooltip title="Ping node">
                    <Button color="primary" onClick={() => pingPeer(peer.address)}>
                      {getPingState(peerLatency, peer)}
                    </Button>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default PeerTable
