import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableContainer, TableRow, TableHead, Button, Paper } from '@material-ui/core';
import { Cancel, Autorenew } from '@material-ui/icons';

import { beeDebugApi } from '../../services/bee';

const useStyles = makeStyles({
    table: {
      minWidth: 650,
    },
  });

  
function PeerTable(props: any) {
    const classes = useStyles();

    const [peerRTP, setPeerRTP] = useState([{ peerId: '', rtt: '' }]);
    const [pingingPeer, setPingingPeer] = useState(false);

    const [removingPeer, setRemovingPeer] = useState(false);

    const pingPeer = (peerId: string) => {
        setPingingPeer(true)
        beeDebugApi.connectivity.ping(peerId)
        .then(res => {
            console.log(res.data)
            let roundTripTime: any = res.data;
            setPingingPeer(false)
            setPeerRTP([...peerRTP, {peerId: peerId, rtt: roundTripTime}])
        })
        .catch(error => {
            console.log(error)
            setPingingPeer(false)
        })
    }

    const removePeer = (peerId: string) => {
        setRemovingPeer(true)
        beeDebugApi.connectivity.removePeer(peerId)
        .then(res => {
            setRemovingPeer(false)
        })
        .catch(error => {
            console.log(error)
            setRemovingPeer(false)
        })
    }

    return (
        <div>
             <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                    <TableRow>
                        <TableCell>Index</TableCell>
                        <TableCell>Peer Id</TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {props.nodePeers.peers.map((peer: any, idx: number) => (
                        <TableRow key={peer.address}>
                        <TableCell component="th" scope="row">
                            {idx + 1}
                        </TableCell>
                        <TableCell>{peer.address}</TableCell>
                        <TableCell>
                            <Button color="primary" onClick={() => pingPeer(peer.address)} >
                            {peerRTP.find(item => item.peerId === peer.address) ? peerRTP.filter(item => item.peerId === peer.address)[0].rtt : <Autorenew />}
                            </Button>
                        </TableCell>
                        <TableCell>
                            <Button color="primary" onClick={() => removePeer(peer.address)} >
                                <Cancel />
                            </Button>
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
