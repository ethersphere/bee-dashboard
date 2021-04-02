import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableContainer, TableRow, TableHead, Button, Paper, Tooltip, Container, CircularProgress } from '@material-ui/core';
import { Autorenew } from '@material-ui/icons';

import { beeDebugApi } from '../../services/bee';
import type { Peer } from '@ethersphere/bee-js';

const useStyles = makeStyles({
    table: {
      minWidth: 650,
    },
  });

interface Props {
    peers: Peer[] | null
    isLoading: boolean
    error: Error | null
}

  
function PeerTable(props: Props) {
    const classes = useStyles();

    const [peerLatency, setPeerLatency] = useState([{ peerId: '', rtt: '', loading: false }]);

    const PingPeer = async (peerId: string) => {
        
        setPeerLatency([...peerLatency, { peerId: peerId, rtt: '', loading: true }])
        beeDebugApi.connectivity.ping(peerId)
        .then(res => {
            setPeerLatency([...peerLatency, { peerId: peerId, rtt: res.data.rtt, loading: false }])
        })
        .catch(error => {
            setPeerLatency([...peerLatency, { peerId: peerId, rtt: 'error', loading: false }])
        })
    }

    if (props.isLoading) {
        return (
            <Container style={{textAlign:'center', padding:'50px'}}>
                <CircularProgress />
            </Container>
        )
    }

    if (props.error || props.peers === null) {
        return (
            <Container style={{textAlign:'center', padding:'50px'}}>
                <p>Failed to load peers</p>
            </Container>
        )
    }

    return (
        <div>
             <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                    <TableRow>
                        <TableCell>Index</TableCell>
                        <TableCell>Peer Id</TableCell>
                        <TableCell align="right">Actions</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {props.peers.map((peer: any, idx: number) => (
                        <TableRow key={peer.address}>
                        <TableCell component="th" scope="row">
                            {idx + 1}
                        </TableCell>
                        <TableCell>{peer.address}</TableCell>
                        <TableCell align="right">
                            <Tooltip title="Ping node">
                                <Button color="primary" onClick={() => PingPeer(peer.address)} >
                                {peerLatency.find(item => item.peerId === peer.address) ? 
                                    peerLatency.filter(item => item.peerId === peer.address)[0].loading ? <CircularProgress size={20} /> :
                                    peerLatency.filter(item => item.peerId === peer.address)[0].rtt :
                                <Autorenew />}
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
